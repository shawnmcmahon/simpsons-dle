-- Update Nuclear Plant Occupations
-- Run this in your Supabase SQL Editor

-- Update all occupations that contain "nuclear plant" to "Nuclear Plant Worker"
UPDATE simpson_characters 
SET occupation = 'Nuclear Plant Worker'
WHERE LOWER(occupation) LIKE '%nuclear plant%';

-- Update specific nuclear plant related occupations
UPDATE simpson_characters 
SET occupation = 'Nuclear Plant Worker'
WHERE LOWER(occupation) IN (
    'nuclear safety inspector',
    'nuclear plant owner',
    'nuclear plant worker'
);

-- Verify the changes
SELECT name, occupation 
FROM simpson_characters 
WHERE LOWER(occupation) LIKE '%nuclear%'
ORDER BY name; 