-- Update existing records to have proper game_date values
-- Set the first few records to have specific dates for testing

-- Update existing records to have game_date values
UPDATE daily_characters 
SET game_date = '2025-09-11'::date 
WHERE id = 1 AND game_date IS NULL;

UPDATE daily_characters 
SET game_date = '2025-09-12'::date 
WHERE id = 2 AND game_date IS NULL;

UPDATE daily_characters 
SET game_date = '2025-09-13'::date 
WHERE id = 3 AND game_date IS NULL;

UPDATE daily_characters 
SET game_date = '2025-09-14'::date 
WHERE id = 4 AND game_date IS NULL;

UPDATE daily_characters 
SET game_date = '2025-09-15'::date 
WHERE id = 5 AND game_date IS NULL;

-- If we don't have enough records, insert new ones
INSERT INTO daily_characters (character_id, game_date) 
SELECT 274, '2025-09-13'::date
WHERE NOT EXISTS (
  SELECT 1 FROM daily_characters WHERE game_date = '2025-09-13'::date
);