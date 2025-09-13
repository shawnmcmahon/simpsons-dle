-- Remove game_date column from daily_characters table
-- We'll use the ID to determine the day of the year instead

-- Drop the index first
DROP INDEX IF EXISTS idx_daily_characters_game_date;

-- Remove the game_date column
ALTER TABLE public.daily_characters 
DROP COLUMN IF EXISTS game_date;
