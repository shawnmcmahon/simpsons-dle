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
  age_group VARCHAR(20) CHECK (age_group IN ('Child', 'Adult', 'Elder')) NOT NULL,
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

-- Insert Simpson's characters with detailed information
INSERT INTO simpson_characters (name, image_url, first_season, occupation, first_episode, gender, age_group) VALUES
-- Main Family
('HOMER SIMPSON', 'https://upload.wikimedia.org/wikipedia/en/0/02/Homer_Simpson_2006.png', 1, 'Nuclear Safety Inspector', 'Simpsons Roasting on an Open Fire', 'Male', 'Adult'),
('MARGE SIMPSON', 'https://upload.wikimedia.org/wikipedia/en/0/0b/Marge_Simpson.png', 1, 'Stay at Home Parent', 'Simpsons Roasting on an Open Fire', 'Female', 'Adult'),
('BART SIMPSON', 'https://upload.wikimedia.org/wikipedia/en/a/aa/Bart_Simpson_200px.png', 1, 'Student', 'Simpsons Roasting on an Open Fire', 'Male', 'Child'),
('LISA SIMPSON', 'https://upload.wikimedia.org/wikipedia/en/e/ec/Lisa_Simpson_with_saxophone.png', 1, 'Student', 'Simpsons Roasting on an Open Fire', 'Female', 'Child'),
('MAGGIE SIMPSON', 'https://upload.wikimedia.org/wikipedia/en/9/9d/Maggie_Simpson.png', 1, 'None', 'Simpsons Roasting on an Open Fire', 'Female', 'Child'),

-- Supporting Characters
('NED FLANDERS', 'https://upload.wikimedia.org/wikipedia/en/8/84/Ned_Flanders.png', 1, 'Left-handed Store Owner', 'Simpsons Roasting on an Open Fire', 'Male', 'Adult'),
('MOE SZYSLAK', 'https://upload.wikimedia.org/wikipedia/en/8/80/Moe_Szyslak.png', 1, 'Bartender', 'Simpsons Roasting on an Open Fire', 'Male', 'Adult'),
('MR. BURNS', 'https://upload.wikimedia.org/wikipedia/en/5/56/Mr_Burns.png', 1, 'Nuclear Plant Owner', 'Simpsons Roasting on an Open Fire', 'Male', 'Elder'),
('WAYLON SMITHERS', 'https://upload.wikimedia.org/wikipedia/en/8/87/Waylon_Smithers_2.png', 1, 'Executive Assistant', 'Simpsons Roasting on an Open Fire', 'Male', 'Adult'),
('CHIEF WIGGUM', 'https://upload.wikimedia.org/wikipedia/en/6/65/Chief_Wiggum.png', 1, 'Police Chief', 'Simpsons Roasting on an Open Fire', 'Male', 'Adult'),
('EDNA KRABAPPEL', 'https://upload.wikimedia.org/wikipedia/en/7/76/Edna_Krabappel.png', 1, 'Teacher', 'Simpsons Roasting on an Open Fire', 'Female', 'Adult'),
('PRINCIPAL SKINNER', 'https://upload.wikimedia.org/wikipedia/en/3/3a/Seymour_Skinner.png', 1, 'School Principal', 'Simpsons Roasting on an Open Fire', 'Male', 'Adult'),
('APU NAHASAPEEMAPETILON', 'https://upload.wikimedia.org/wikipedia/en/7/79/Apu_Nahasapeemapetilon.png', 1, 'Convenience Store Clerk', 'Simpsons Roasting on an Open Fire', 'Male', 'Adult'),
('KRUSTY THE CLOWN', 'https://upload.wikimedia.org/wikipedia/en/5/5d/Krustytheclown.png', 1, 'Television Host', 'Simpsons Roasting on an Open Fire', 'Male', 'Adult'),
('MILHOUSE VAN HOUTEN', 'https://upload.wikimedia.org/wikipedia/en/1/11/Milhouse_Van_Houten.png', 1, 'Student', 'Simpsons Roasting on an Open Fire', 'Male', 'Child'),
('RALPH WIGGUM', 'https://upload.wikimedia.org/wikipedia/en/1/14/Ralph_Wiggum.png', 1, 'Student', 'Simpsons Roasting on an Open Fire', 'Male', 'Child'),
('NELSON MUNTZ', 'https://upload.wikimedia.org/wikipedia/en/5/56/Nelson_Muntz.png', 1, 'Student', 'Simpsons Roasting on an Open Fire', 'Male', 'Child'),
('PATTY BOUVIER', 'https://upload.wikimedia.org/wikipedia/en/3/33/Patty_Bouvier.png', 1, 'Police Officer', 'Simpsons Roasting on an Open Fire', 'Female', 'Adult'),
('SELMA BOUVIER', 'https://upload.wikimedia.org/wikipedia/en/3/34/Selma_Bouvier.png', 1, 'Department of Motor Vehicles', 'Simpsons Roasting on an Open Fire', 'Female', 'Adult'),
('GRANDPA SIMPSON', 'https://upload.wikimedia.org/wikipedia/en/a/a0/Abraham_Simpson.png', 1, 'Retired', 'Simpsons Roasting on an Open Fire', 'Male', 'Elder'),
('KENT BROCKMAN', 'https://upload.wikimedia.org/wikipedia/en/8/8a/Kent_Brockman.png', 1, 'News Anchor', 'Simpsons Roasting on an Open Fire', 'Male', 'Adult'),
('CARL CARLSON', 'https://upload.wikimedia.org/wikipedia/en/8/81/Carl_Carlson_-_shading.png', 1, 'Nuclear Plant Worker', 'Simpsons Roasting on an Open Fire', 'Male', 'Adult'),
('LENNY LEONARD', 'https://upload.wikimedia.org/wikipedia/en/8/8a/Lenny_Leonard.png', 1, 'Nuclear Plant Worker', 'Simpsons Roasting on an Open Fire', 'Male', 'Adult'),
('DR. HIBBERT', 'https://upload.wikimedia.org/wikipedia/en/c/cd/Dr._Hibbert.png', 1, 'Doctor', 'Simpsons Roasting on an Open Fire', 'Male', 'Adult'),
('REVEREND LOVEJOY', 'https://upload.wikimedia.org/wikipedia/en/7/76/Reverend_Lovejoy.png', 1, 'Minister', 'Simpsons Roasting on an Open Fire', 'Male', 'Adult'),
('MAUDE FLANDERS', 'https://upload.wikimedia.org/wikipedia/en/9/95/Maude_Flanders.png', 1, 'Stay at Home Parent', 'Simpsons Roasting on an Open Fire', 'Female', 'Adult'),
('ROD FLANDERS', 'https://upload.wikimedia.org/wikipedia/en/8/87/Rod_Flanders.png', 1, 'Student', 'Simpsons Roasting on an Open Fire', 'Male', 'Child'),
('TODD FLANDERS', 'https://upload.wikimedia.org/wikipedia/en/9/9d/Todd_Flanders.png', 1, 'Student', 'Simpsons Roasting on an Open Fire', 'Male', 'Child'),
('JIMBO JONES', 'https://upload.wikimedia.org/wikipedia/en/8/87/Jimbo_Jones.png', 1, 'Student', 'Simpsons Roasting on an Open Fire', 'Male', 'Child'),
('DOLPH STARBEAM', 'https://upload.wikimedia.org/wikipedia/en/8/8a/Dolph_Starbear.png', 1, 'Student', 'Simpsons Roasting on an Open Fire', 'Male', 'Child'),
('KEARNEY ZZYZWICZ', 'https://upload.wikimedia.org/wikipedia/en/8/8a/Kearney_Zzyzwicz.png', 1, 'Student', 'Simpsons Roasting on an Open Fire', 'Male', 'Child'),
('AGNES SKINNER', 'https://upload.wikimedia.org/wikipedia/en/8/87/Agnes_Skinner.png', 1, 'Retired', 'Simpsons Roasting on an Open Fire', 'Female', 'Elder'),
('MANJULA NAHASAPEEMAPETILON', 'https://upload.wikimedia.org/wikipedia/en/8/8a/Manjula_Nahasapeemapetilon.png', 1, 'Stay at Home Parent', 'Simpsons Roasting on an Open Fire', 'Female', 'Adult'),
('OTTO MANN', 'https://upload.wikimedia.org/wikipedia/en/8/8a/Otto_Mann.png', 1, 'School Bus Driver', 'Simpsons Roasting on an Open Fire', 'Male', 'Adult'),
('DISCO STU', 'https://upload.wikimedia.org/wikipedia/en/8/8a/Disco_Stu.png', 1, 'Retail Clerk', 'Simpsons Roasting on an Open Fire', 'Male', 'Adult'),
('CAPTAIN MCALLISTER', 'https://upload.wikimedia.org/wikipedia/en/8/8a/Captain_McAllister.png', 1, 'Sea Captain', 'Simpsons Roasting on an Open Fire', 'Male', 'Elder'),
('JASPER BEARDLY', 'https://upload.wikimedia.org/wikipedia/en/8/8a/Jasper_Beardly.png', 1, 'Retired', 'Simpsons Roasting on an Open Fire', 'Male', 'Elder'),
('HANS MOLEMAN', 'https://upload.wikimedia.org/wikipedia/en/8/8a/Hans_Moleman.png', 1, 'Retired', 'Simpsons Roasting on an Open Fire', 'Male', 'Elder'),
('SNOWBALL II', 'https://upload.wikimedia.org/wikipedia/en/8/8a/Snowball_II.png', 1, 'Pet', 'Simpsons Roasting on an Open Fire', 'Female', 'Adult'),
('SANTA''S LITTLE HELPER', 'https://upload.wikimedia.org/wikipedia/en/8/8a/Santas_Little_Helper.png', 1, 'Pet', 'Simpsons Roasting on an Open Fire', 'Male', 'Adult')
ON CONFLICT (name) DO NOTHING;

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

-- Create policies
-- Allow public read access to characters and daily characters
CREATE POLICY "Allow public read access to simpson_characters" ON simpson_characters
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to daily_characters" ON daily_characters
  FOR SELECT USING (true);

-- Allow authenticated users to manage their own games
CREATE POLICY "Users can manage their own games" ON user_games
  FOR ALL USING (auth.uid() = user_id);

-- Allow anonymous users to create and manage their own games
CREATE POLICY "Allow anonymous users to manage games" ON user_games
  FOR ALL USING (user_id IS NULL);

-- Allow public read access to games (for anonymous play)
CREATE POLICY "Allow public read access to user_games" ON user_games
  FOR SELECT USING (true); 