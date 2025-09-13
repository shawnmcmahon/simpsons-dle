'use client'

import { useState, useEffect } from 'react'
import { FireIcon, CalendarIcon } from '@heroicons/react/24/outline'

interface GameHistory {
  date: string
  completed: boolean
  attempts: number
}

export default function Progress() {
  const [streak, setStreak] = useState(0)
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([])

  useEffect(() => {
    // Load streak and game history from localStorage
    const savedStreak = localStorage.getItem('simpsons-dle-streak')
    const savedHistory = localStorage.getItem('simpsons-dle-history')
    
    if (savedStreak) {
      setStreak(parseInt(savedStreak))
    }
    
    if (savedHistory) {
      setGameHistory(JSON.parse(savedHistory))
    }
  }, [])

  // Generate calendar grid for the last 30 days
  const generateCalendarGrid = () => {
    const today = new Date()
    const days = []
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateString = date.toISOString().split('T')[0]
      
      const gameData = gameHistory.find(game => game.date === dateString)
      
      days.push({
        date: dateString,
        day: date.getDate(),
        isToday: i === 0,
        completed: gameData?.completed || false,
        attempts: gameData?.attempts || 0,
      })
    }
    
    return days
  }

  const calendarDays = generateCalendarGrid()

  return (
    <div className="space-y-6">
      {/* Streak Tracker */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FireIcon className="w-5 h-5 text-warning" />
            Current Streak
          </h3>
          <span className="text-2xl font-bold text-white">{streak}</span>
        </div>
        <p className="text-sm text-white">
          {streak === 0 
            ? "Start your streak by completing today's puzzle!"
            : streak === 1 
            ? "Great start! Keep it going!"
            : `Amazing! You've solved ${streak} puzzles in a row!`
          }
        </p>
      </div>

      {/* Calendar History */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <CalendarIcon className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Recent Games</h3>
        </div>
        
        <div className="grid grid-cols-10 gap-1">
          {calendarDays.map((day, index) => (
            <div
              key={day.date}
              className={`
                aspect-square rounded-lg flex items-center justify-center text-xs font-medium
                transition-all duration-200 hover:scale-110
                ${day.isToday 
                  ? 'ring-2 ring-primary bg-primary/20 text-white font-bold' 
                  : day.completed 
                    ? 'bg-success text-white' 
                    : 'bg-muted text-white'
                }
              `}
              title={day.isToday 
                ? 'Today' 
                : day.completed 
                  ? `Completed in ${day.attempts} attempts` 
                  : 'Not played'
              }
            >
              {day.day}
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-success rounded"></div>
            <span className="text-white">Completed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-muted rounded"></div>
            <span className="text-white">Not played</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 ring-2 ring-primary bg-primary/20 rounded"></div>
            <span className="text-white">Today</span>
          </div>
        </div>
      </div>
    </div>
  )
}
