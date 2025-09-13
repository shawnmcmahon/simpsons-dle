-- Add game_date column to daily_characters table
ALTER TABLE public.daily_characters 
ADD COLUMN game_date DATE DEFAULT CURRENT_DATE;

-- Create index for better query performance
CREATE INDEX idx_daily_characters_game_date ON public.daily_characters USING btree (game_date);

-- Update existing records to have today's date (if any exist)
UPDATE public.daily_characters 
SET game_date = CURRENT_DATE 
WHERE game_date IS NULL;
