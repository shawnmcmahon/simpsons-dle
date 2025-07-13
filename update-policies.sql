-- Update RLS Policies for Simpson's DLE
-- Run this in your Supabase SQL Editor

-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Allow public read access to simpson_characters" ON simpson_characters;
DROP POLICY IF EXISTS "Allow public read access to daily_characters" ON daily_characters;
DROP POLICY IF EXISTS "Users can manage their own games" ON user_games;
DROP POLICY IF EXISTS "Allow anonymous users to manage games" ON user_games;
DROP POLICY IF EXISTS "Allow public read access to user_games" ON user_games;

-- Create new policies
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