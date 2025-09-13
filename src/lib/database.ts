import { supabase } from './supabase'

// Types for our database
export interface SimpsonCharacter {
  id: number
  name: string
  image_url: string
  first_season: number
  occupation: string
  first_episode: string
  gender: 'Male' | 'Female'
  hair_color: string
  created_at: string
}

export interface DailyCharacter {
  id: number
  name: string
  character_id: number
  game_date: string
}

export interface UserGame {
  id: number
  user_id?: string
  daily_character_id: number
  attempts: string[]
  completed: boolean
  attempts_count: number
  created_at: string
}

export interface HintComparison {
  season: 'correct' | 'incorrect' | 'partial'
  occupation: 'correct' | 'incorrect' | 'partial'
  episode: 'correct' | 'incorrect' | 'partial'
  gender: 'correct' | 'incorrect' | 'partial'
  hairColor: 'correct' | 'incorrect' | 'partial'
}

// Helper function to get today's date in YYYY-MM-DD format
function getTodayDateString(): string {
  const now = new Date()
  return now.toISOString().split('T')[0]
}

// Database functions
export const database = {
  // Get today's character
  async getTodaysCharacter(): Promise<SimpsonCharacter | null> {
    const todayDate = getTodayDateString()
    console.log('Today\'s date:', todayDate);
    
    // First get the daily character record - use limit(1) instead of single() to handle multiple records
    const { data: dailyData, error: dailyError } = await supabase
      .from('daily_characters')
      .select('character_id')
      .eq('game_date', todayDate)
      .limit(1)
    
    console.log('Daily data:', dailyData, 'Error:', dailyError);
    if (dailyError || !dailyData || dailyData.length === 0) {
      console.error('Error fetching daily character:', dailyError)
      return null
    }
    
    // Get the first (and should be only) record
    const dailyRecord = dailyData[0]
    
    // Then get the Simpson character details
    const { data: characterData, error: characterError } = await supabase
      .from('simpson_characters')
      .select('*')
      .eq('id', dailyRecord.character_id)
      .single()
    
    console.log('Character data:', characterData, 'Error:', characterError);
    if (characterError || !characterData) {
      console.error('Error fetching Simpson character for character_id:', dailyRecord.character_id, 'Error:', characterError)
      
      // Fallback: Try to get any character if the specific one doesn't exist
      console.log('Attempting fallback to get any available character...')
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('simpson_characters')
        .select('*')
        .limit(1)
        .single()
      
      if (fallbackError || !fallbackData) {
        console.error('Fallback also failed:', fallbackError)
        return null
      }
      
      console.log('Using fallback character:', fallbackData)
      return fallbackData
    }
    
    return characterData
  },
  


  // Get a character by name
  async getCharacterByName(name: string): Promise<SimpsonCharacter | null> {
    const { data, error } = await supabase
      .from('simpson_characters')
      .select('*')
      .ilike('name', `%${name}%`)
      .single()
    
    if (error) {
      console.error('Error fetching character by name:', error)
      return null
    }
    
    return data
  },

  // Get all characters (for search/autocomplete)
  async getAllCharacters(): Promise<SimpsonCharacter[]> {
    const { data, error } = await supabase
      .from('simpson_characters')
      .select('*')
      .order('name')
    
    if (error) {
      console.error('Error fetching all characters:', error)
      return []
    }
    
    return data || []
  },

  // Compare hints between two characters
  compareHints(targetCharacter: SimpsonCharacter, guessedCharacter: SimpsonCharacter): HintComparison {
    return {
      season: targetCharacter.first_season === guessedCharacter.first_season ? 'correct' : 'incorrect',
      occupation: targetCharacter.occupation === guessedCharacter.occupation ? 'correct' : 'incorrect',
      episode: targetCharacter.first_episode === guessedCharacter.first_episode ? 'correct' : 'incorrect',
      gender: targetCharacter.gender === guessedCharacter.gender ? 'correct' : 'incorrect',
      hairColor: targetCharacter.hair_color === guessedCharacter.hair_color ? 'correct' : 'incorrect'
    }
  },

  // Get or create user game for today
  async getUserGame(userId?: string): Promise<UserGame | null> {
    const todayDate = getTodayDateString()
    
    // First, get today's daily character
    const { data: dailyCharData, error: dailyError } = await supabase
      .from('daily_characters')
      .select('*')
      .eq('game_date', todayDate)
      .limit(1)
    
    if (dailyError || !dailyCharData || dailyCharData.length === 0) {
      console.error('Error fetching daily character:', dailyError)
      return null
    }
    
    const dailyChar = dailyCharData[0]

    // Check if user already has a game for today
    let query = supabase
      .from('user_games')
      .select('*')
      .eq('daily_character_id', dailyChar.id)
    
    if (userId) {
      query = query.eq('user_id', userId)
    } else {
      query = query.is('user_id', null)
    }
    
    const { data: existingGame, error: queryError } = await query.single()
    
    if (queryError && queryError.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error checking for existing game:', queryError)
      return null
    }
    
    if (existingGame) {
      return existingGame
    }

    // Create new game for today
    const { data: newGame, error: createError } = await supabase
      .from('user_games')
      .insert([{
        user_id: userId || null,
        daily_character_id: dailyChar.id,
        attempts: [],
        completed: false,
        attempts_count: 0
      }])
      .select()
      .single()
    
    if (createError) {
      console.error('Error creating new game:', createError)
      return null
    }
    
    return newGame
  },

  // Update user game with new attempt
  async updateGameAttempt(gameId: number, attempt: string, completed: boolean): Promise<UserGame | null> {
    // First get the current game to update the attempts array
    const { data: currentGame, error: fetchError } = await supabase
      .from('user_games')
      .select('attempts, attempts_count')
      .eq('id', gameId)
      .single()
    
    if (fetchError) {
      console.error('Error fetching current game:', fetchError)
      return null
    }
    
    const updatedAttempts = [...(currentGame.attempts || []), attempt]
    const updatedAttemptsCount = (currentGame.attempts_count || 0) + 1
    
    const { data, error } = await supabase
      .from('user_games')
      .update({
        attempts: updatedAttempts,
        completed,
        attempts_count: updatedAttemptsCount
      })
      .eq('id', gameId)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating game attempt:', error)
      return null
    }
    
    return data
  },

  // Get user's game history
  async getUserGameHistory(userId?: string, limit = 10): Promise<UserGame[]> {
    let query = supabase
      .from('user_games')
      .select(`
        *,
        daily_characters (
          simpson_characters (name)
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (userId) {
      query = query.eq('user_id', userId)
    } else {
      query = query.is('user_id', null)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching game history:', error)
      return []
    }
    
    return data || []
  },

  // Get leaderboard (users who completed games)
  async getLeaderboard(limit = 10): Promise<UserGame[]> {
    const { data, error } = await supabase
      .from('user_games')
      .select(`
        *,
        daily_characters (
          simpson_characters (name)
        )
      `)
      .eq('completed', true)
      .order('attempts_count', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) {
      console.error('Error fetching leaderboard:', error)
      return []
    }
    
    return data || []
  },

  // Check if user has already played today
  async hasPlayedToday(userId?: string): Promise<boolean> {
    const todayDate = getTodayDateString()
    
    const { data: dailyCharData, error: dailyError } = await supabase
      .from('daily_characters')
      .select('id')
      .eq('game_date', todayDate)
      .limit(1)
    
    if (dailyError || !dailyCharData || dailyCharData.length === 0) {
      return false
    }
    
    const dailyChar = dailyCharData[0]

    let query = supabase
      .from('user_games')
      .select('id')
      .eq('daily_character_id', dailyChar.id)
    
    if (userId) {
      query = query.eq('user_id', userId)
    } else {
      query = query.is('user_id', null)
    }
    
    const { data, error } = await query.single()
    
    // Return true if we found a game, false if not found or error
    return !error && !!data
  }
} 