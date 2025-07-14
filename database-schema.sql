-- Simpson's DLE Database Schema - Character Guessing Game
-- Run this in your Supabase SQL editor

-- Create tables
CREATE TABLE IF NOT EXISTS simpson_characters (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  image_url VARCHAR(500) NOT NULL,
  first_season INTEGER NOT NULL,
  occupation VARCHAR(100) NOT NULL,
  first_episode VARCHAR(200) NOT NULL,
  gender VARCHAR(20) CHECK (gender IN ('Male', 'Female')) NOT NULL,
  hair_color VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS daily_characters (
  id SERIAL PRIMARY KEY,
  character_id INTEGER REFERENCES simpson_characters(id) ON DELETE CASCADE,
  game_date DATE NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_games (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  daily_character_id INTEGER REFERENCES daily_characters(id) ON DELETE CASCADE,
  attempts TEXT[] NOT NULL DEFAULT '{}',
  completed BOOLEAN NOT NULL DEFAULT false,
  attempts_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_simpson_characters_name ON simpson_characters(name);
CREATE INDEX IF NOT EXISTS idx_daily_characters_date ON daily_characters(game_date);
CREATE INDEX IF NOT EXISTS idx_user_games_user_date ON user_games(user_id, daily_character_id);

-- Note: Use update-hair-colors.sql to populate the database with hair color data
-- The original INSERT statements with age_group have been replaced with hair_color data

-- Insert some sample daily characters (you can add more or generate them programmatically)
INSERT INTO daily_characters (character_id, game_date) VALUES
(1, CURRENT_DATE), -- Homer Simpson for today
(2, CURRENT_DATE + INTERVAL '1 day'), -- Marge Simpson for tomorrow
(3, CURRENT_DATE + INTERVAL '2 days'), -- Bart Simpson for day after tomorrow
(4, CURRENT_DATE + INTERVAL '3 days'), -- Lisa Simpson
(5, CURRENT_DATE + INTERVAL '4 days'), -- Maggie Simpson
(6, CURRENT_DATE + INTERVAL '5 days'), -- Ned Flanders
(7, CURRENT_DATE + INTERVAL '6 days'), -- Moe Szyslak
(8, CURRENT_DATE + INTERVAL '7 days'), -- Mr. Burns
(9, CURRENT_DATE + INTERVAL '8 days'), -- Smithers
(10, CURRENT_DATE + INTERVAL '9 days') -- Chief Wiggum
ON CONFLICT (game_date) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE simpson_characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_games ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow public read access to simpson_characters" ON simpson_characters
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to daily_characters" ON daily_characters
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own games" ON user_games
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Allow anonymous users to manage games" ON user_games
  FOR ALL USING (user_id IS NULL);

CREATE POLICY "Allow public read access to user_games" ON user_games
  FOR SELECT USING (true);

