'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { database, SimpsonCharacter, HintComparison } from '@/lib/database'
import CharacterAutocomplete from './CharacterAutocomplete'
import { supabase } from '../lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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
  }, [])

  useEffect(() => {
    if (!gameCompleted) {
      setGuessInputs([{ value: '', disabled: false }]);
    }
  }, [gameCompleted]);

  async function fetchTodaysCharacterDirectly() {
    // Get today's date in YYYY-MM-DD
    const today = "2025-07-15"

    // 1. Query daily_characters for today's row
    const { data: daily, error: dailyError } = await supabase
      .from('daily_characters')
      .select('character_id')
      .eq('game_date', today)
      .single();

    console.log('Daily:', daily, 'Error:', dailyError);

    if (dailyError || !daily) {
      setError('No daily character found for today');
      setTodaysCharacter(null);
      return null;
    }

    // 2. Query simpson_characters for the character
    const { data: character, error: charError } = await supabase
      .from('simpson_characters')
      .select('*')
      .eq('id', daily.character_id)
      .single();

    if (charError || !character) {
      setError('No character found for today');
      setTodaysCharacter(null);
      return null;
    }
    console.log('Character:', character, 'Error:', charError);
    setTodaysCharacter(character);
    return character;
  }

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
        setTodaysCharacter(character);
        setIsRandomGame(true);
      } else {
        character = await fetchTodaysCharacterDirectly();
        setIsRandomGame(false);
      }
      console.log('Todays Character:', todaysCharacter);
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

  const getHintColor = (status: 'correct' | 'incorrect' | 'partial') => {
    switch (status) {
      case 'correct': return 'bg-green-500'
      case 'incorrect': return 'bg-red-500'
      case 'partial': return 'bg-yellow-500'
      default: return 'bg-gray-300'
    }
  }



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white/60 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-slate-700 font-medium">Loading today{'\u2019'}s character...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-8 py-8 bg-white/60 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-lg text-slate-700">{error}</p>
        </div>
      </div>
    )
  }

  if (!todaysCharacter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-8 py-8 bg-white/60 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">No Character Found</h1>
          <p className="text-lg text-slate-700">No character is scheduled for today.</p>
        </div>
      </div>
    )
  }

        return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center py-8">
      <div className="max-w-lg mx-auto px-6 w-full">
        {/* Game Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Simpson&apos;s DLE
          </h1>
          <p className="text-lg text-slate-600 font-medium">Guess the Simpson&apos;s character in 5 tries</p>
        </div>

        {/* Today's Character Image */}
        <div className="mb-8 text-center">
          <div className="relative inline-block">
            <Image
              src={gameCompleted ? todaysCharacter.image_url : '/images/simpsons.png'}
              alt={gameCompleted ? `Today${'\u2019'}s Character` : "Mystery Character"}
              width={180}
              height={240}
              className={`mx-auto rounded-2xl shadow-2xl border-4 border-white/20 backdrop-blur-sm ${gameCompleted ? 'max-w-[180px] max-h-[240px] w-auto h-auto' : ''}`}
              priority
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
          </div>
        </div>

        {/* Game Status */}
        {gameCompleted && (
          <div className={`text-center mb-8 p-6 rounded-2xl backdrop-blur-md border shadow-lg ${
            gameWon 
              ? 'bg-gradient-to-r from-green-50/80 to-emerald-50/80 text-green-800 border-green-200' 
              : 'bg-gradient-to-r from-red-50/80 to-rose-50/80 text-red-800 border-red-200'
          }`}>
            <div className="font-bold text-lg">
              {gameWon ? '🎉 Congratulations! You got it!' : '❌ Game Over! You ran out of attempts.'}
            </div>
          </div>
        )}

        {/* Hint Labels */}
        <div className="grid grid-cols-5 gap-2 mb-3">
          <div className="text-center">
            <span className="text-sm font-semibold text-slate-700">Season</span>
          </div>
          <div className="text-center">
            <span className="text-sm font-semibold text-slate-700">Episode</span>
          </div>
          <div className="text-center">
            <span className="text-sm font-semibold text-slate-700">Job</span>
          </div>
          <div className="text-center">
            <span className="text-sm font-semibold text-slate-700">Gender</span>
          </div>
          <div className="text-center">
            <span className="text-sm font-semibold text-slate-700">Hair</span>
          </div>
        </div>
        
        {/* Original Hints */}
        <div className="grid grid-cols-5 gap-2 mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 border border-blue-400/30 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-lg backdrop-blur-sm">
            {todaysCharacter.first_season}
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 border border-blue-400/30 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-lg backdrop-blur-sm">
            {todaysCharacter.first_episode}
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 border border-blue-400/30 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-lg backdrop-blur-sm">
            {todaysCharacter.occupation}
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 border border-blue-400/30 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-lg backdrop-blur-sm">
            {todaysCharacter.gender}
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 border border-blue-400/30 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-lg backdrop-blur-sm">
            {todaysCharacter.hair_color}
          </div>
        </div>

        {/* Attempt Results */}
        {attempts.map((attempt, index) => (
          <div key={index} className="grid grid-cols-5 gap-2 mb-3">
            <div className={`w-14 h-14 ${getHintColor(attempt.hints.season)} border border-white/20 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105`}>
              {attempt.character.first_season}
            </div>
            <div className={`w-14 h-14 ${getHintColor(attempt.hints.episode)} border border-white/20 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105`}>
              {attempt.character.first_episode}
            </div>
            <div className={`w-14 h-14 ${getHintColor(attempt.hints.occupation)} border border-white/20 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105`}>
              {attempt.character.occupation}
            </div>
            <div className={`w-14 h-14 ${getHintColor(attempt.hints.gender)} border border-white/20 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105`}>
              {attempt.character.gender}
            </div>
            <div className={`w-14 h-14 ${getHintColor(attempt.hints.hairColor)} border border-white/20 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105`}>
              {attempt.character.hair_color}
            </div>
          </div>
        ))}

        {/* Empty rows for remaining guesses */}
        {Array.from({ length: 5 - attempts.length }, (_, index) => (
          <div key={`empty-${index}`} className="grid grid-cols-5 gap-2 mb-3">
            {Array.from({ length: 5 }, (_, colIndex) => (
              <div key={colIndex} className="w-14 h-14 border-2 border-slate-200/60 rounded-xl bg-white/40 backdrop-blur-sm shadow-inner"></div>
            ))}
          </div>
        ))}

        {/* Color Key */}
        <div className="text-center mt-8 mb-6">
          <div className="inline-flex items-center gap-6 px-6 py-3 bg-white/60 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-sm"></div>
              <span className="text-slate-700 font-medium text-sm">Correct</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-br from-red-400 to-red-600 rounded-full shadow-sm"></div>
              <span className="text-slate-700 font-medium text-sm">Wrong</span>
            </div>
          </div>
        </div>

        {/* Input Boxes */}
        {!gameCompleted && (
          <div className="space-y-3 w-full max-w-sm mx-auto">
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
                placeholder="Enter character name..."
                disabled={input.disabled}
                className="w-full"
              />
            ))}
          </div>
        )}

        {/* Final Result */}
        {gameCompleted && (
          <div className="text-center mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {isRandomGame ? 'Character' : `Today${'\u2019'}s Character`}: {todaysCharacter.name}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {isRandomGame ? 'Practice mode completed!' : 'Come back tomorrow for a new character!'}
            </p>
            <div className="space-y-2 max-w-sm mx-auto">
              <Button
                onClick={handleNewGame}
                className="w-full"
              >
                New Game
              </Button>
              <Button
                onClick={handleResetDailyGame}
                variant="outline"
                className="w-full"
              >
                Reset Daily Game
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 