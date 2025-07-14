'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { database, SimpsonCharacter, HintComparison } from '@/lib/database'
import CharacterAutocomplete from './CharacterAutocomplete'

interface GameAttempt {
  character: SimpsonCharacter
  hints: HintComparison
}

export default function SimpsonsDLE() {
  const [todaysCharacter, setTodaysCharacter] = useState<SimpsonCharacter | null>(null)
  const [attempts, setAttempts] = useState<GameAttempt[]>([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [allCharacters, setAllCharacters] = useState<SimpsonCharacter[]>([])
  const [isRandomGame, setIsRandomGame] = useState(false)

  useEffect(() => {
    initializeGame()
  }, [])

  const initializeGame = async (useRandomCharacter = false) => {
    try {
      setLoading(true)
      
      let character: SimpsonCharacter | null = null
      
      if (useRandomCharacter) {
        // Get a random character for practice mode
        const characters = await database.getAllCharacters()
        if (characters.length > 0) {
          const randomIndex = Math.floor(Math.random() * characters.length)
          character = characters[randomIndex]
          setIsRandomGame(true)
        }
      } else {
        // Get today's character
        character = await database.getTodaysCharacter()
        setIsRandomGame(false)
      }
      
      if (!character) {
        setError('No character found')
        return
      }
      setTodaysCharacter(character)
      
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
      setCurrentGuess('')
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
              if (guessedCharacter && character) {
                const hints = database.compareHints(character, guessedCharacter)
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
    if (!currentGuess.trim() || !todaysCharacter || gameCompleted) return

    try {
      // Find the character by name with more flexible matching
      const normalizedGuess = currentGuess.trim().toLowerCase()
      console.log('User guess:', normalizedGuess)
      console.log('Available characters count:', allCharacters.length)
      console.log('Available character names:', allCharacters.map(c => c.name.toLowerCase()))
      
      const guessedCharacter = allCharacters.find(char => 
        char.name.toLowerCase() === normalizedGuess ||
        char.name.toLowerCase().includes(normalizedGuess) ||
        normalizedGuess.includes(char.name.toLowerCase())
      )

      if (!guessedCharacter) {
        console.log('No character found for guess:', normalizedGuess)
        alert('Character not found. Please try a different name.')
        return
      }

      // Compare hints
      const hints = database.compareHints(todaysCharacter, guessedCharacter)
      const newAttempt: GameAttempt = { character: guessedCharacter, hints }
      
      const updatedAttempts = [...attempts, newAttempt]
      setAttempts(updatedAttempts)

      // Check if correct
      const isCorrect = guessedCharacter.name === todaysCharacter.name
      const isGameOver = isCorrect || updatedAttempts.length >= 5

      if (isGameOver) {
        setGameCompleted(true)
        setGameWon(isCorrect)
      }

      // Update database
      const userGame = await database.getUserGame()
      if (userGame) {
        await database.updateGameAttempt(userGame.id, guessedCharacter.name, isGameOver)
      }

      // Clear current guess and move to next input
      setCurrentGuess('')
    } catch (err) {
      console.error('Error processing guess:', err)
      alert('Error processing your guess. Please try again.')
    }
  }

  const handleCharacterSelect = (character: SimpsonCharacter) => {
    // Auto-submit when a character is selected from dropdown
    setCurrentGuess(character.name)
    // Small delay to ensure state is updated before processing
    setTimeout(() => {
      handleGuess()
    }, 100)
  }

  const handleNewGame = async () => {
    await initializeGame(true) // Start a new random game
  }

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
      <div className="min-h-screen flex items-center justify-center bg-yellow-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading today&apos;s character...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!todaysCharacter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">No Character Found</h1>
          <p className="text-gray-600">No character is scheduled for today.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-100 p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Simpson&apos;s DLE</h1>
        <p className="text-xl text-gray-700 mb-6">Guess the Simpson&apos;s Character</p>
        
        {/* Today's Character Image */}
        <div className="mb-6">
          <Image
            src={gameCompleted ? todaysCharacter.image_url : "https://static.simpsonswiki.com/images/b/b1/AllSimpsonsCharacters.png"}
            alt={gameCompleted ? "Today&apos;s Character" : "Mystery Character"}
            width={600}
            height={800}
            className={`mx-auto rounded-lg shadow-lg ${gameCompleted ? 'max-w-[25vw] max-h-[25vh] w-auto h-auto' : ''}`}
            priority
          />
        </div>

        {/* Game Status */}
        {gameCompleted && (
          <div className={`text-xl font-bold mb-4 ${gameWon ? 'text-green-600' : 'text-red-600'}`}>
            {gameWon ? '🎉 Congratulations! You guessed correctly!' : '❌ Game Over! You ran out of attempts.'}
          </div>
        )}

        {/* Original Hints */}
        <div className="mb-8">
          {/* Hint Labels */}
          <div className="flex gap-4 mb-2 justify-center">
            <div className="w-20 text-center">
              <span className="text-sm font-bold text-gray-700">First Season Appearance</span>
            </div>
            <div className="w-20 text-center">
              <span className="text-sm font-bold text-gray-700">First Episode Appearance</span>
            </div>
            <div className="w-20 text-center">
              <span className="text-sm font-bold text-gray-700">Occupation</span>
            </div>
            <div className="w-20 text-center">
              <span className="text-sm font-bold text-gray-700">Gender</span>
            </div>
            <div className="w-20 text-center">
              <span className="text-sm font-bold text-gray-700">Hair Color</span>
            </div>
          </div>
          
          {/* Hint Boxes */}
          <div className="flex gap-4 justify-center">
            <div className="w-20 h-20 bg-blue-500 border-2 border-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm text-center p-2">
              Season {todaysCharacter.first_season}
            </div>
            <div className="w-20 h-20 bg-blue-500 border-2 border-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs text-center p-2">
              {todaysCharacter.first_episode}
            </div>
            <div className="w-20 h-20 bg-blue-500 border-2 border-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm text-center p-2">
              {todaysCharacter.occupation}
            </div>
            <div className="w-20 h-20 bg-blue-500 border-2 border-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm text-center p-2">
              {todaysCharacter.gender}
            </div>
            <div className="w-20 h-20 bg-blue-500 border-2 border-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm text-center p-2">
              {todaysCharacter.hair_color}
            </div>
          </div>
        </div>
      </div>

      {/* Attempt Results */}
      {attempts.map((attempt, index) => (
        <div key={index} className="mb-4">
          <div className="flex gap-4 justify-center">
            <div className={`w-20 h-20 ${getHintColor(attempt.hints.season)} border-2 border-gray-400 rounded-lg flex items-center justify-center text-white font-bold text-sm text-center shadow-lg p-2`}>
              Season {attempt.character.first_season}
            </div>
            <div className={`w-20 h-20 ${getHintColor(attempt.hints.episode)} border-2 border-gray-400 rounded-lg flex items-center justify-center text-white font-bold text-xs text-center shadow-lg p-2`}>
              {attempt.character.first_episode}
            </div>
            <div className={`w-20 h-20 ${getHintColor(attempt.hints.occupation)} border-2 border-gray-400 rounded-lg flex items-center justify-center text-white font-bold text-sm text-center shadow-lg p-2`}>
              {attempt.character.occupation}
            </div>
            <div className={`w-20 h-20 ${getHintColor(attempt.hints.gender)} border-2 border-gray-400 rounded-lg flex items-center justify-center text-white font-bold text-sm text-center shadow-lg p-2`}>
              {attempt.character.gender}
            </div>
            <div className={`w-20 h-20 ${getHintColor(attempt.hints.hairColor)} border-2 border-gray-400 rounded-lg flex items-center justify-center text-white font-bold text-sm text-center shadow-lg p-2`}>
              {attempt.character.hair_color}
            </div>
          </div>
        </div>
      ))}

      {/* Color Key */}
      <div className="mb-6 text-center">
        <div className="flex gap-4 justify-center items-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm font-semibold text-gray-700">Green = Correct</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm font-semibold text-gray-700">Red = Incorrect</span>
          </div>
        </div>
      </div>

      {/* Input Boxes */}
      {!gameCompleted && (
        <div className="flex flex-col gap-4 w-full max-w-md">
          {/* Show only the next guess box */}
          <div className="text-center mb-2">
            <p className="text-sm text-gray-600 mb-2">Type a character name to guess:</p>
          </div>
          <CharacterAutocomplete
            value={currentGuess}
            onChange={setCurrentGuess}
            onSelect={handleCharacterSelect}
            characters={allCharacters}
            placeholder=""
            disabled={false}
            className=""
          />
        </div>
      )}

              {/* Final Result */}
        {gameCompleted && (
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {isRandomGame ? 'Character' : 'Today&apos;s Character'}: {todaysCharacter.name}
            </h2>
            <p className="text-gray-600 mb-4">
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
    </div>
  )
} 