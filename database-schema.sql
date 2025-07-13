-- Simpson's DLE Database Schema
-- Run this in your Supabase SQL editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret-here';

-- Create tables
CREATE TABLE IF NOT EXISTS game_words (
  id SERIAL PRIMARY KEY,
  word VARCHAR(50) NOT NULL UNIQUE,
  category VARCHAR(100) NOT NULL,
  difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_scores (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  word_id INTEGER REFERENCES game_words(id) ON DELETE CASCADE,
  attempts INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  time_taken INTEGER NOT NULL DEFAULT 0, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS game_states (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  current_word VARCHAR(50) NOT NULL,
  attempts TEXT[] NOT NULL DEFAULT '{}',
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_game_words_category ON game_words(category);
CREATE INDEX IF NOT EXISTS idx_game_words_difficulty ON game_words(difficulty);
CREATE INDEX IF NOT EXISTS idx_user_scores_user_id ON user_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_user_scores_word_id ON user_scores(word_id);
CREATE INDEX IF NOT EXISTS idx_game_states_user_id ON game_states(user_id);
CREATE INDEX IF NOT EXISTS idx_game_states_completed ON game_states(completed);

-- Insert sample Simpson's data
INSERT INTO game_words (word, category, difficulty) VALUES
-- Characters
('HOMER', 'characters', 'easy'),
('MARGE', 'characters', 'easy'),
('BART', 'characters', 'easy'),
('LISA', 'characters', 'easy'),
('NED', 'characters', 'easy'),
('MOE', 'characters', 'medium'),
('KRUSTY', 'characters', 'medium'),
('BURNS', 'characters', 'medium'),
('SMITHERS', 'characters', 'hard'),
('APU', 'characters', 'medium'),
('SKINNER', 'characters', 'medium'),
('CHALMERS', 'characters', 'hard'),
('WIGGUM', 'characters', 'medium'),
('FLANDERS', 'characters', 'medium'),
('KRABAPPEL', 'characters', 'hard'),

-- Locations
('SPRINGFIELD', 'locations', 'easy'),
('NUCLEAR', 'locations', 'easy'),
('ELEMENTARY', 'locations', 'easy'),
('TAVERN', 'locations', 'medium'),
('MANOR', 'locations', 'medium'),
('PLANT', 'locations', 'easy'),
('SCHOOL', 'locations', 'easy'),
('CHURCH', 'locations', 'medium'),
('HOSPITAL', 'locations', 'medium'),
('MALL', 'locations', 'easy'),
('PARK', 'locations', 'easy'),
('BEACH', 'locations', 'medium'),
('CEMETERY', 'locations', 'hard'),
('LIBRARY', 'locations', 'medium'),
('STADIUM', 'locations', 'medium'),

-- Food & Drinks
('DOUGHNUT', 'food', 'easy'),
('DUFF', 'food', 'easy'),
('KRUSTYBURGER', 'food', 'medium'),
('SLURM', 'food', 'medium'),
('BUTTERFINGER', 'food', 'medium'),
('PINK', 'food', 'easy'),
('SQUISHY', 'food', 'hard'),
('KRUSTYPART', 'food', 'hard'),
('MONORAIL', 'food', 'medium'),
('LARD', 'food', 'easy'),

-- Catchphrases & Quotes
('DOH', 'quotes', 'easy'),
('EXCELLENT', 'quotes', 'easy'),
('EAT', 'quotes', 'easy'),
('MY', 'quotes', 'easy'),
('SHORTS', 'quotes', 'easy'),
('AYE', 'quotes', 'medium'),
('CARAMBA', 'quotes', 'medium'),
('WOOHOO', 'quotes', 'easy'),
('HAHA', 'quotes', 'easy'),
('BARTMAN', 'quotes', 'medium')
ON CONFLICT (word) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE game_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_states ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow public read access to game words
CREATE POLICY "Allow public read access to game_words" ON game_words
  FOR SELECT USING (true);

-- Allow authenticated users to manage their own scores
CREATE POLICY "Users can manage their own scores" ON user_scores
  FOR ALL USING (auth.uid() = user_id);

-- Allow public read access to scores (for leaderboards)
CREATE POLICY "Allow public read access to user_scores" ON user_scores
  FOR SELECT USING (true);

-- Allow authenticated users to manage their own game states
CREATE POLICY "Users can manage their own game states" ON game_states
  FOR ALL USING (auth.uid() = user_id);

-- Allow public read access to game states
CREATE POLICY "Allow public read access to game_states" ON game_states
  FOR SELECT USING (true); 