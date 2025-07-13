import { supabase } from './supabase'

// Types for our database
export interface GameWord {
  id: number
  word: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  created_at: string
}

export interface UserScore {
  id: number
  user_id?: string
  word_id: number
  attempts: number
  completed: boolean
  time_taken: number
  created_at: string
}

export interface GameState {
  id: number
  user_id?: string
  current_word: string
  attempts: string[]
  completed: boolean
  created_at: string
}

// Database functions
export const database = {
  // Get a random word for the game
  async getRandomWord(category?: string): Promise<GameWord | null> {
    let query = supabase
      .from('game_words')
      .select('*')
    
    if (category) {
      query = query.eq('category', category)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching random word:', error)
      return null
    }
    
    if (!data || data.length === 0) {
      return null
    }
    
    // Return a random word from the results
    const randomIndex = Math.floor(Math.random() * data.length)
    return data[randomIndex]
  },

  // Save user score
  async saveScore(score: Omit<UserScore, 'id' | 'created_at'>): Promise<UserScore | null> {
    const { data, error } = await supabase
      .from('user_scores')
      .insert([score])
      .select()
      .single()
    
    if (error) {
      console.error('Error saving score:', error)
      return null
    }
    
    return data
  },

  // Get user's best scores
  async getUserScores(userId?: string, limit = 10): Promise<UserScore[]> {
    let query = supabase
      .from('user_scores')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (userId) {
      query = query.eq('user_id', userId)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching user scores:', error)
      return []
    }
    
    return data || []
  },

  // Save game state
  async saveGameState(state: Omit<GameState, 'id' | 'created_at'>): Promise<GameState | null> {
    const { data, error } = await supabase
      .from('game_states')
      .insert([state])
      .select()
      .single()
    
    if (error) {
      console.error('Error saving game state:', error)
      return null
    }
    
    return data
  },

  // Get current game state
  async getGameState(userId?: string): Promise<GameState | null> {
    let query = supabase
      .from('game_states')
      .select('*')
      .eq('completed', false)
      .order('created_at', { ascending: false })
      .limit(1)
    
    if (userId) {
      query = query.eq('user_id', userId)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching game state:', error)
      return null
    }
    
    return data?.[0] || null
  },

  // Get leaderboard
  async getLeaderboard(limit = 10): Promise<UserScore[]> {
    const { data, error } = await supabase
      .from('user_scores')
      .select('*')
      .eq('completed', true)
      .order('attempts', { ascending: true })
      .order('time_taken', { ascending: true })
      .limit(limit)
    
    if (error) {
      console.error('Error fetching leaderboard:', error)
      return []
    }
    
    return data || []
  }
} 