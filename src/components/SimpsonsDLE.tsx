'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { database, SimpsonCharacter, HintComparison } from '@/lib/database'
import CharacterAutocomplete from './CharacterAutocomplete'
import { supabase } from '../lib/supabase'

interface GameAttempt {
  character: SimpsonCharacter
  hints: HintComparison
}

// Utility functions for practice mode seen characters
function getTodayKey() {
  return `simpsons-dle-practice-seen-${new Date().toISOString().split('T')[0]}`;
}

export default function SimpsonsDLE() {
  const [todaysCharacter, setTodaysCharacter] = useState<SimpsonCharacter | null>(null)
  const [attempts, setAttempts] = useState<GameAttempt[]>([])
  const [guessInputs, setGuessInputs] = useState([{ value: '', disabled: false }]);
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [allCharacters, setAllCharacters] = useState<SimpsonCharacter[]>([])
  const [isRandomGame, setIsRandomGame] = useState(false)

  // SSR-safe state for seen practice characters
  const [seenPracticeIds, setSeenPracticeIds] = useState<number[]>([]);

  // Load seen practice characters from localStorage on client only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const key = getTodayKey();
      const seen = localStorage.getItem(key);
      setSeenPracticeIds(seen ? JSON.parse(seen) : []);
    }
  }, []);

  // Helper to add a seen character
  const addSeenPracticeCharacter = (id: number) => {
    setSeenPracticeIds(prev => {
      if (!prev.includes(id)) {
        const updated = [...prev, id];
        if (typeof window !== 'undefined') {
          localStorage.setItem(getTodayKey(), JSON.stringify(updated));
        }
        return updated;
      }
      return prev;
    });
  };

  // Helper to reset seen list
  const resetSeenPracticeCharacters = () => {
    setSeenPracticeIds([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(getTodayKey());
    }
  };

  useEffect(() => {
    initializeGame()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!gameCompleted) {
      setGuessInputs([{ value: '', disabled: false }]);
    }
  }, [gameCompleted]);


  const initializeGame = async (useRandomCharacter = false) => {
    try {
      setLoading(true)
      
      let character: SimpsonCharacter | null = null
      
      if (useRandomCharacter) {
        // Get all characters
        const characters = await database.getAllCharacters();

        // Exclude seen ones and the daily character
        const filteredCharacters = characters.filter(c =>
          !seenPracticeIds.includes(c.id) &&
          c.id !== todaysCharacter?.id // Exclude today's character
        );

        if (filteredCharacters.length === 0) {
          resetSeenPracticeCharacters();
          setError('You have seen all characters in practice mode today!');
          setLoading(false);
          return;
        }
        const randomIndex = Math.floor(Math.random() * filteredCharacters.length);
        character = filteredCharacters[randomIndex];
        addSeenPracticeCharacter(character.id);
        setIsRandomGame(true);
      } else {
        character = await database.getTodaysCharacter();
        setIsRandomGame(false);
      }
      
      // Set the character state after getting it
      setTodaysCharacter(character);
      console.log('Todays Character:', character);
      if (character === null) {
        setError('No character found')
        return
      }
      
      // Get all characters for search
      const characters = await database.getAllCharacters()
      console.log('Loaded characters:', characters.length)
      if (characters.length === 0) {
        console.log('No characters loaded - this might indicate a database connection issue')
      } else {
        console.log('Sample characters:', characters.slice(0, 5).map(c => c.name))
      }
      setAllCharacters(characters)
      
      // Reset game state for new game
      setAttempts([])
      setGameCompleted(false)
      setGameWon(false)
      
      // Only check for existing daily game if not random
      if (!useRandomCharacter) {
        const hasPlayed = await database.hasPlayedToday()
        if (hasPlayed) {
          // Load existing game state
          const userGame = await database.getUserGame()
          if (userGame) {
            setGameCompleted(userGame.completed)
            setGameWon(userGame.completed)
            
            // Load previous attempts
            const loadedAttempts: GameAttempt[] = []
            for (const attemptName of userGame.attempts) {
              const guessedCharacter = await database.getCharacterByName(attemptName)
              if (guessedCharacter && todaysCharacter) {
                const hints = database.compareHints(todaysCharacter, guessedCharacter)
                loadedAttempts.push({ character: guessedCharacter, hints })
              }
            }
            setAttempts(loadedAttempts)
          }
        }
      }
    } catch (err) {
      setError('Failed to load game')
      console.error('Game initialization error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleGuess = async () => {
    const currentGuess = guessInputs[guessInputs.length - 1].value;
    if (!currentGuess.trim() || !todaysCharacter || gameCompleted) return;

    try {
      const normalizedGuess = currentGuess.trim().toLowerCase();
      const guessedCharacter = allCharacters.find(char =>
        char.name.toLowerCase() === normalizedGuess ||
        char.name.toLowerCase().includes(normalizedGuess) ||
        normalizedGuess.includes(char.name.toLowerCase())
      );

      if (!guessedCharacter) {
        alert('Character not found. Please try a different name.');
        return;
      }

      // Compare hints
      const hints = database.compareHints(todaysCharacter, guessedCharacter);
      const newAttempt: GameAttempt = { character: guessedCharacter, hints };
      const updatedAttempts = [...attempts, newAttempt];
      setAttempts(updatedAttempts);

      // Check if correct
      const isCorrect = guessedCharacter.name === todaysCharacter.name;
      const isGameOver = isCorrect || updatedAttempts.length >= 5;

      if (isGameOver) {
        setGameCompleted(true);
        setGameWon(isCorrect);
        // Disable all guess inputs
        setGuessInputs(inputs => inputs.map(g => ({ ...g, disabled: true })));
      } else {
        // Disable the current input and add a new one
        setGuessInputs(inputs => [
          ...inputs.slice(0, -1),
          { ...inputs[inputs.length - 1], disabled: true },
          { value: '', disabled: false }
        ]);
      }

      // Update database
      const userGame = await database.getUserGame();
      if (userGame) {
        await database.updateGameAttempt(userGame.id, guessedCharacter.name, isGameOver);
      }
    } catch {
      alert('Error processing your guess. Please try again.');
    }
  };

  const handleCharacterSelect = (character: SimpsonCharacter) => {
    setGuessInputs(inputs =>
      inputs.map((g, i) =>
        i === inputs.length - 1 ? { ...g, value: character.name } : g
      )
    );
    setTimeout(() => {
      handleGuess();
    }, 100);
  };

  const handleNewGame = async () => {
    await initializeGame(true) // Start a new random game
  }

  const handleResetDailyGame = async () => {
    try {
      // Get today's user game
      const userGame = await database.getUserGame();
      if (userGame) {
        await supabase
          .from('user_games')
          .delete()
          .eq('id', userGame.id);
      }
      window.location.reload();
    } catch {
      alert('Failed to reset the daily game.');
    }
  };

  const getHintColor = (status: 'correct' | 'incorrect') => {
    switch (status) {
      case 'correct': return 'bg-green-500'
      case 'incorrect': return 'bg-red-500'
      default: return 'bg-gray-300'
    }
  }



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: 'radial-gradient(circle, rgba(57, 59, 116, 1) 0%, rgba(26, 0, 71, 1) 100%)'}}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-white">Loading today{'\u2019'}s character...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: 'radial-gradient(circle, rgba(57, 59, 116, 1) 0%, rgba(26, 0, 71, 1) 100%)'}}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Error</h1>
          <p className="text-white">{error}</p>
        </div>
      </div>
    )
  }

  if (!todaysCharacter) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: 'radial-gradient(circle, rgba(57, 59, 116, 1) 0%, rgba(26, 0, 71, 1) 100%)'}}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">No Character Found</h1>
          <p className="text-white">No character is scheduled for today.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 pb-32" style={{background: 'radial-gradient(circle, rgba(57, 59, 116, 1) 0%, rgba(26, 0, 71, 1) 100%)'}}>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4" style={{color: '#ffcf22'}}>Simpson&apos;s DLE</h1>
        <p className="text-xl text-white mb-6">The Daily Simpson{'\u2019'}s Character Guessing Game</p>
        
        {/* Today's Character Image */}
        <div className="mb-6">
          <Image
            src="/simpsons-couch.avif"
            alt="Mystery Character"
            width={600}
            height={800}
            className="mx-auto rounded-lg shadow-lg"
            priority
          />
        </div>

        {/* Game Status */}
        {gameCompleted && (
          <div className={`text-xl font-bold mb-4 text-white`}>
            {gameWon ? '🎉 Congratulations! You guessed correctly!' : '❌ Game Over! You ran out of attempts.'}
          </div>
        )}

        {/* Hint Labels and Values */}
        <div className="mb-8">
          {/* Hint Labels */}
          <div className="flex gap-6 mb-2 justify-center">
            <div className="w-24 text-center">
              <span className="text-sm font-bold text-white">First Season Appearance</span>
            </div>
            <div className="w-24 text-center">
              <span className="text-sm font-bold text-white">First Episode Appearance</span>
            </div>
            <div className="w-24 text-center">
              <span className="text-sm font-bold text-white">Occupation</span>
            </div>
            <div className="w-24 text-center">
              <span className="text-sm font-bold text-white">Gender</span>
            </div>
            <div className="w-24 text-center">
              <span className="text-sm font-bold text-white">Hair Color</span>
            </div>
          </div>
          {/* Hint Values */}
          <div className="flex gap-6 justify-center">
            <div className="w-24 flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 border border-blue-400/30 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-lg backdrop-blur-sm p-1 text-center leading-tight">
                {todaysCharacter.first_season}
              </div>
            </div>
            <div className="w-24 flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 border border-blue-400/30 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-lg backdrop-blur-sm p-1 text-center leading-tight">
                {todaysCharacter.first_episode}
              </div>
            </div>
            <div className="w-24 flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 border border-blue-400/30 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-lg backdrop-blur-sm p-1 text-center leading-tight">
                {todaysCharacter.occupation}
              </div>
            </div>
            <div className="w-24 flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 border border-blue-400/30 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-lg backdrop-blur-sm p-1 text-center leading-tight">
                {todaysCharacter.gender}
              </div>
            </div>
            <div className="w-24 flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 border border-blue-400/30 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-lg backdrop-blur-sm p-1 text-center leading-tight">
                {todaysCharacter.hair_color}
              </div>
            </div>
          </div>
        </div>

        {/* Attempt Results */}
        {attempts.map((attempt, index) => (
          <div key={index} className="flex gap-6 justify-center mb-3">
            <div className="w-24 flex justify-center">
              <div className={`w-20 h-20 ${getHintColor(attempt.hints.season)} border border-white/20 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 p-1 text-center leading-tight`}>
                {attempt.character.first_season}
              </div>
            </div>
            <div className="w-24 flex justify-center">
              <div className={`w-20 h-20 ${getHintColor(attempt.hints.episode)} border border-white/20 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 p-1 text-center leading-tight`}>
                {attempt.character.first_episode}
              </div>
            </div>
            <div className="w-24 flex justify-center">
              <div className={`w-20 h-20 ${getHintColor(attempt.hints.occupation)} border border-white/20 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 p-1 text-center leading-tight`}>
                {attempt.character.occupation}
              </div>
            </div>
            <div className="w-24 flex justify-center">
              <div className={`w-20 h-20 ${getHintColor(attempt.hints.gender)} border border-white/20 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 p-1 text-center leading-tight`}>
                {attempt.character.gender}
              </div>
            </div>
            <div className="w-24 flex justify-center">
              <div className={`w-20 h-20 ${getHintColor(attempt.hints.hairColor)} border border-white/20 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 p-1 text-center leading-tight`}>
                {attempt.character.hair_color}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Color Key */}
      <div className="mb-6 text-center">
        <div className="flex gap-4 justify-center items-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm font-semibold text-white">Green = Correct</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm font-semibold text-white">Red = Incorrect</span>
          </div>
        </div>
      </div>

      {/* Input Boxes */}
      {!gameCompleted && (
        <div className="flex flex-col gap-4 w-full max-w-md">
          {guessInputs.map((input, idx) => (
            <CharacterAutocomplete
              key={idx}
              value={input.value}
              onChange={val => {
                if (!input.disabled) {
                  setGuessInputs(inputs =>
                    inputs.map((g, i) => i === idx ? { ...g, value: val } : g)
                  );
                }
              }}
              onSelect={handleCharacterSelect}
              characters={allCharacters}
              placeholder=""
              disabled={input.disabled}
              className=""
            />
          ))}
          {/* Guess Counter */}
          <div className="text-center text-white mt-2 font-semibold">
            Guess {guessInputs.length} of 5
          </div>
        </div>
      )}

       {/* Final Result */}
       {gameCompleted && (
         <div className="mt-8 mb-16 text-center">
           <h2 className="text-2xl font-bold text-white mb-2">
             {isRandomGame ? 'Character' : `Today${'\u2019'}s Character`}: {todaysCharacter.name}
           </h2>
           <p className="text-white mb-4">
             {isRandomGame ? 'Practice mode completed!' : 'Come back tomorrow for a new character!'}
           </p>
           <button
             onClick={handleNewGame}
             className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
           >
             New Game
           </button>
         </div>
       )}

       {/* Reset Daily Game Button (only for daily game, not practice mode) */}
       {(isRandomGame || !isRandomGame) && (
         <div className="w-full flex justify-center mt-8" style={{marginBottom: '100px'}}>
           <button
             onClick={handleResetDailyGame}
             className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
           >
             Reset Daily Game
           </button>
         </div>
       )}
    </div>
  )
}