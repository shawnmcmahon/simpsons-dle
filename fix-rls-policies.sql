-- Fix RLS Policies for user_games table
-- Run this in your Supabase SQL Editor

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can manage their own games" ON user_games;
DROP POLICY IF EXISTS "Allow public read access to user_games" ON user_games;

-- Create new policies that allow both authenticated and anonymous users
CREATE POLICY "Users can manage their own games" ON user_games
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Allow anonymous users to manage games" ON user_games
  FOR ALL USING (user_id IS NULL);

CREATE POLICY "Allow public read access to user_games" ON user_games
  FOR SELECT USING (true); 