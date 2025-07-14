-- Corrected Hair Colors Based on Simpsons Wiki Research (Bald Update)
-- Run this in your Supabase SQL Editor

-- First, ensure the hair_color column exists
ALTER TABLE simpson_characters ADD COLUMN IF NOT EXISTS hair_color VARCHAR(50);

-- BALD CHARACTERS (even if they have a couple of strands)
UPDATE simpson_characters SET hair_color = 'Bald' WHERE name = 'HOMER SIMPSON';
UPDATE simpson_characters SET hair_color = 'Bald' WHERE name = 'MR. BURNS';
UPDATE simpson_characters SET hair_color = 'Bald' WHERE name = 'HANS MOLEMAN';
UPDATE simpson_characters SET hair_color = 'Bald' WHERE name = 'JASPER BEARDLY';
UPDATE simpson_characters SET hair_color = 'Bald' WHERE name = 'MOE SZYSLAK';
UPDATE simpson_characters SET hair_color = 'Bald' WHERE name = 'WAYLON SMITHERS';
UPDATE simpson_characters SET hair_color = 'Bald' WHERE name = 'PRINCIPAL SKINNER';
UPDATE simpson_characters SET hair_color = 'Bald' WHERE name = 'CAPTAIN MCALLISTER';
UPDATE simpson_characters SET hair_color = 'Bald' WHERE name = 'AGNES SKINNER';
UPDATE simpson_characters SET hair_color = 'Bald' WHERE name = 'SUPERINTENDENT CHALMERS';
UPDATE simpson_characters SET hair_color = 'Bald' WHERE name = 'LUNCHLADY DORIS';
UPDATE simpson_characters SET hair_color = 'Bald' WHERE name = 'COACH KRUP';
UPDATE simpson_characters SET hair_color = 'Bald' WHERE name = 'SMILIN'' JOE FISSION';
UPDATE simpson_characters SET hair_color = 'Bald' WHERE name = 'MARTIN PRINCE SR.';
UPDATE simpson_characters SET hair_color = 'Bald' WHERE name = 'MAYOR QUIMBY';
UPDATE simpson_characters SET hair_color = 'Bald' WHERE name = 'CHIEF INSPECTOR';
UPDATE simpson_characters SET hair_color = 'Bald' WHERE name = 'PROFESSOR FRINK';
UPDATE simpson_characters SET hair_color = 'Bald' WHERE name = 'KANG';
UPDATE simpson_characters SET hair_color = 'Bald' WHERE name = 'KODOS';
UPDATE simpson_characters SET hair_color = 'Bald' WHERE name = 'JOHNNY TIGHTLIPS';
UPDATE simpson_characters SET hair_color = 'Bald' WHERE name = 'LEGITIMATE BUSINESSMAN';
UPDATE simpson_characters SET hair_color = 'Bald' WHERE name = 'REX BANNER';
UPDATE simpson_characters SET hair_color = 'Bald' WHERE name = 'GIL GUNDERSON';
UPDATE simpson_characters SET hair_color = 'Bald' WHERE name = 'HOMER''S MOTHER';

-- Main Family (rest)
UPDATE simpson_characters SET hair_color = 'Blue' WHERE name = 'MARGE SIMPSON';
UPDATE simpson_characters SET hair_color = 'Yellow' WHERE name = 'BART SIMPSON';
UPDATE simpson_characters SET hair_color = 'Yellow' WHERE name = 'LISA SIMPSON';
UPDATE simpson_characters SET hair_color = 'Blue' WHERE name = 'MAGGIE SIMPSON';
UPDATE simpson_characters SET hair_color = 'Gray' WHERE name = 'ABRAHAM SIMPSON';

-- Supporting Characters (rest, as previously researched)
UPDATE simpson_characters SET hair_color = 'Brown' WHERE name = 'NED FLANDERS';
UPDATE simpson_characters SET hair_color = 'Brown' WHERE name = 'CHIEF WIGGUM';
UPDATE simpson_characters SET hair_color = 'Brown' WHERE name = 'EDNA KRABAPPEL';
UPDATE simpson_characters SET hair_color = 'Black' WHERE name = 'APU NAHASAPEEMAPETILON';
UPDATE simpson_characters SET hair_color = 'Green' WHERE name = 'KRUSTY THE CLOWN';
UPDATE simpson_characters SET hair_color = 'Black' WHERE name = 'MILHOUSE VAN HOUTEN';
UPDATE simpson_characters SET hair_color = 'Black' WHERE name = 'RALPH WIGGUM';
UPDATE simpson_characters SET hair_color = 'Yellow' WHERE name = 'NELSON MUNTZ';
UPDATE simpson_characters SET hair_color = 'Gray' WHERE name = 'PATTY BOUVIER';
UPDATE simpson_characters SET hair_color = 'Gray' WHERE name = 'SELMA BOUVIER';
UPDATE simpson_characters SET hair_color = 'Gray' WHERE name = 'KENT BROCKMAN';
UPDATE simpson_characters SET hair_color = 'Black' WHERE name = 'CARL CARLSON';
UPDATE simpson_characters SET hair_color = 'Brown' WHERE name = 'LENNY LEONARD';
UPDATE simpson_characters SET hair_color = 'Black' WHERE name = 'DR. HIBBERT';
UPDATE simpson_characters SET hair_color = 'Gray' WHERE name = 'REVEREND LOVEJOY';
UPDATE simpson_characters SET hair_color = 'Red' WHERE name = 'MAUDE FLANDERS';
UPDATE simpson_characters SET hair_color = 'Yellow' WHERE name = 'ROD FLANDERS';
UPDATE simpson_characters SET hair_color = 'Yellow' WHERE name = 'TODD FLANDERS';
UPDATE simpson_characters SET hair_color = 'Yellow' WHERE name = 'JIMBO JONES';
UPDATE simpson_characters SET hair_color = 'Yellow' WHERE name = 'DOLPH STARBEAM';
UPDATE simpson_characters SET hair_color = 'Yellow' WHERE name = 'KEARNEY ZZYZWICZ';
UPDATE simpson_characters SET hair_color = 'Black' WHERE name = 'MANJULA NAHASAPEEMAPETILON';
UPDATE simpson_characters SET hair_color = 'Brown' WHERE name = 'OTTO MANN';
UPDATE simpson_characters SET hair_color = 'Brown' WHERE name = 'DISCO STU';
UPDATE simpson_characters SET hair_color = 'Black' WHERE name = 'SNOWBALL II';
UPDATE simpson_characters SET hair_color = 'Orange' WHERE name = 'SANTA''S LITTLE HELPER';
UPDATE simpson_characters SET hair_color = 'Yellow' WHERE name = 'MARTIN PRINCE';
UPDATE simpson_characters SET hair_color = 'Yellow' WHERE name = 'WENDELL BORTON';
UPDATE simpson_characters SET hair_color = 'Yellow' WHERE name = 'JANEY POWELL';
UPDATE simpson_characters SET hair_color = 'Yellow' WHERE name = 'SHERRI AND TERRI';
UPDATE simpson_characters SET hair_color = 'Red' WHERE name = 'GROUNDSKEEPER WILLIE';
UPDATE simpson_characters SET hair_color = 'Brown' WHERE name = 'MS. HOOVER';
UPDATE simpson_characters SET hair_color = 'Red' WHERE name = 'SIDESHOW BOB';
UPDATE simpson_characters SET hair_color = 'Green' WHERE name = 'SIDESHOW MEL';
UPDATE simpson_characters SET hair_color = 'Blonde' WHERE name = 'PRINCESS PENELOPE';
UPDATE simpson_characters SET hair_color = 'Brown' WHERE name = 'CECIL TERWILLIGER';
UPDATE simpson_characters SET hair_color = 'Brown' WHERE name = 'FRANK GRIMES';
UPDATE simpson_characters SET hair_color = 'Brown' WHERE name = 'MRS. PRINCE';
UPDATE simpson_characters SET hair_color = 'Brown' WHERE name = 'LIONEL HUTZ';
UPDATE simpson_characters SET hair_color = 'Black' WHERE name = 'DR. NICK RIVIERA';
UPDATE simpson_characters SET hair_color = 'Black' WHERE name = 'COMIC BOOK GUY';
UPDATE simpson_characters SET hair_color = 'Yellow' WHERE name = 'BUMBLEBEE MAN';
UPDATE simpson_characters SET hair_color = 'Gray' WHERE name = 'ITCHY';
UPDATE simpson_characters SET hair_color = 'Gray' WHERE name = 'SCRATCHY';
UPDATE simpson_characters SET hair_color = 'Brown' WHERE name = 'POWELL MOTEL';
UPDATE simpson_characters SET hair_color = 'Brown' WHERE name = 'MRS. POWELL';
UPDATE simpson_characters SET hair_color = 'Brown' WHERE name = 'GRADY';
UPDATE simpson_characters SET hair_color = 'Brown' WHERE name = 'FRANK';
UPDATE simpson_characters SET hair_color = 'Red' WHERE name = 'GROUNDSKEEPER SEAMUS';
UPDATE simpson_characters SET hair_color = 'Brown' WHERE name = 'MS. PEYTON';
UPDATE simpson_characters SET hair_color = 'Yellow' WHERE name = 'SPUCKLER CHILDREN';
UPDATE simpson_characters SET hair_color = 'Green' WHERE name = 'RADIOACTIVE MAN';
UPDATE simpson_characters SET hair_color = 'Yellow' WHERE name = 'FALLOUT BOY';
UPDATE simpson_characters SET hair_color = 'Brown' WHERE name = 'HANK SCORPIO';

-- Remove the age_group column if it still exists
ALTER TABLE simpson_characters DROP COLUMN IF EXISTS age_group;

-- Verify the changes
SELECT name, hair_color FROM simpson_characters ORDER BY name; 

import fetch from 'node-fetch';

async function checkImages() {
  // 1. Fetch all image URLs from your database (replace with your actual fetch logic)
  const response = await fetch('https://your-supabase-url/rest/v1/simpson_characters?select=name,image_url', {
    headers: { apikey: 'YOUR_SUPABASE_ANON_KEY' }
  });
  const characters = await response.json();

  // 2. Check each image URL
  for (const char of characters) {
    try {
      const res = await fetch(char.image_url, { method: 'HEAD' });
      if (!res.ok) {
        console.log(`BROKEN: ${char.name} - ${char.image_url} (Status: ${res.status})`);
      }
    } catch {
      console.log(`ERROR: ${char.name} - ${char.image_url}`);
    }
  }
}

checkImages(); 