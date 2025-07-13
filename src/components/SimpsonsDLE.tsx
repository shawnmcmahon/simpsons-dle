'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { database, SimpsonCharacter, HintComparison } from '@/lib/database'

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

  useEffect(() => {
    initializeGame()
  }, [])

  const initializeGame = async () => {
    try {
      setLoading(true)
      
      // Get today's character
      const character = await database.getTodaysCharacter()
      if (!character) {
        setError('No character found for today')
        return
      }
      setTodaysCharacter(character)
      
      // Get all characters for search
      const characters = await database.getAllCharacters()
      setAllCharacters(characters)
      
      // Check if user has already played today
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
      // Find the character by name
      const guessedCharacter = allCharacters.find(char => 
        char.name.toLowerCase().includes(currentGuess.toLowerCase())
      )

      if (!guessedCharacter) {
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

  const getHintColor = (status: 'correct' | 'incorrect' | 'partial') => {
    switch (status) {
      case 'correct': return 'bg-green-500'
      case 'incorrect': return 'bg-red-500'
      case 'partial': return 'bg-yellow-500'
      default: return 'bg-gray-300'
    }
  }

  const getHintText = (character: SimpsonCharacter, hintType: keyof HintComparison) => {
    switch (hintType) {
      case 'season': return `Season ${character.first_season}`
      case 'occupation': return character.occupation
      case 'episode': return character.first_episode
      case 'gender': return character.gender
      case 'ageGroup': return character.age_group
      default: return ''
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading today's character...</p>
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
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Simpson's DLE</h1>
        
        {/* Today's Character Image */}
        <div className="mb-6">
          <Image
            src={todaysCharacter.image_url}
            alt="Today's Character"
            width={300}
            height={400}
            className="mx-auto rounded-lg shadow-lg"
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
        <div className="flex gap-4 mb-8 justify-center">
          <div className="w-16 h-16 bg-blue-500 border-2 border-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm text-center">
            Season {todaysCharacter.first_season}
          </div>
          <div className="w-16 h-16 bg-blue-500 border-2 border-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm text-center">
            {todaysCharacter.occupation}
          </div>
          <div className="w-16 h-16 bg-blue-500 border-2 border-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs text-center">
            {todaysCharacter.first_episode}
          </div>
          <div className="w-16 h-16 bg-blue-500 border-2 border-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm text-center">
            {todaysCharacter.gender}
          </div>
          <div className="w-16 h-16 bg-blue-500 border-2 border-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm text-center">
            {todaysCharacter.age_group}
          </div>
        </div>
      </div>

      {/* Attempt Results */}
      {attempts.map((attempt, index) => (
        <div key={index} className="mb-4">
          <div className="text-center mb-2">
            <span className="font-bold text-gray-700">Attempt {index + 1}: {attempt.character.name}</span>
          </div>
          <div className="flex gap-4 justify-center">
            <div className={`w-16 h-16 ${getHintColor(attempt.hints.season)} border-2 border-gray-400 rounded-lg flex items-center justify-center text-white font-bold text-sm text-center`}>
              Season {attempt.character.first_season}
            </div>
            <div className={`w-16 h-16 ${getHintColor(attempt.hints.occupation)} border-2 border-gray-400 rounded-lg flex items-center justify-center text-white font-bold text-sm text-center`}>
              {attempt.character.occupation}
            </div>
            <div className={`w-16 h-16 ${getHintColor(attempt.hints.episode)} border-2 border-gray-400 rounded-lg flex items-center justify-center text-white font-bold text-xs text-center`}>
              {attempt.character.first_episode}
            </div>
            <div className={`w-16 h-16 ${getHintColor(attempt.hints.gender)} border-2 border-gray-400 rounded-lg flex items-center justify-center text-white font-bold text-sm text-center`}>
              {attempt.character.gender}
            </div>
            <div className={`w-16 h-16 ${getHintColor(attempt.hints.ageGroup)} border-2 border-gray-400 rounded-lg flex items-center justify-center text-white font-bold text-sm text-center`}>
              {attempt.character.age_group}
            </div>
          </div>
        </div>
      ))}

      {/* Input Boxes */}
      {!gameCompleted && (
        <div className="flex flex-col gap-4 w-full max-w-md">
          {[0, 1, 2, 3, 4].map((index) => (
            <input
              key={index}
              type="text"
              placeholder={`Guess ${index + 1}`}
              value={index === attempts.length ? currentGuess : ''}
              onChange={(e) => index === attempts.length ? setCurrentGuess(e.target.value) : undefined}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && index === attempts.length) {
                  handleGuess()
                }
              }}
              disabled={index !== attempts.length || gameCompleted}
              className={`px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                index !== attempts.length ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            />
          ))}
        </div>
      )}

      {/* Final Result */}
      {gameCompleted && (
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Today's Character: {todaysCharacter.name}
          </h2>
          <p className="text-gray-600">
            Come back tomorrow for a new character!
          </p>
        </div>
      )}
    </div>
  )
} 