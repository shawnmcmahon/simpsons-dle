-- Update Database Schema to Replace Age Group with Hair Color
-- Run this in your Supabase SQL Editor

-- First, add the hair_color column
ALTER TABLE simpson_characters ADD COLUMN IF NOT EXISTS hair_color VARCHAR(50);

-- Update hair colors based on Simpsons Wiki information
UPDATE simpson_characters SET hair_color = 'Blue' WHERE name = 'HOMER SIMPSON';
UPDATE simpson_characters SET hair_color = 'Blue' WHERE name = 'MARGE SIMPSON';
UPDATE simpson_characters SET hair_color = 'Yellow' WHERE name = 'BART SIMPSON';
UPDATE simpson_characters SET hair_color = 'Yellow' WHERE name = 'LISA SIMPSON';
UPDATE simpson_characters SET hair_color = 'Blue' WHERE name = 'MAGGIE SIMPSON';
UPDATE simpson_characters SET hair_color = 'Gray' WHERE name = 'ABRAHAM SIMPSON';
UPDATE simpson_characters SET hair_color = 'Brown' WHERE name = 'NED FLANDERS';
UPDATE simpson_characters SET hair_color = 'Gray' WHERE name = 'MOE SZYSLAK';
UPDATE simpson_characters SET hair_color = 'Gray' WHERE name = 'MR. BURNS';
UPDATE simpson_characters SET hair_color = 'Gray' WHERE name = 'WAYLON SMITHERS';
UPDATE simpson_characters SET hair_color = 'Brown' WHERE name = 'CHIEF WIGGUM';
UPDATE simpson_characters SET hair_color = 'Brown' WHERE name = 'EDNA KRABAPPEL';
UPDATE simpson_characters SET hair_color = 'Gray' WHERE name = 'PRINCIPAL SKINNER';
UPDATE simpson_characters SET hair_color = 'Black' WHERE name = 'APU NAHASAPEEMAPETILON';
UPDATE simpson_characters SET hair_color = 'Green' WHERE name = 'KRUSTY THE CLOWN';
UPDATE simpson_characters SET hair_color = 'Blue' WHERE name = 'MILHOUSE VAN HOUTEN';
UPDATE simpson_characters SET hair_color = 'Blue' WHERE name = 'RALPH WIGGUM';
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
UPDATE simpson_characters SET hair_color = 'Gray' WHERE name = 'AGNES SKINNER';
UPDATE simpson_characters SET hair_color = 'Black' WHERE name = 'MANJULA NAHASAPEEMAPETILON';
UPDATE simpson_characters SET hair_color = 'Brown' WHERE name = 'OTTO MANN';
UPDATE simpson_characters SET hair_color = 'Brown' WHERE name = 'DISCO STU';
UPDATE simpson_characters SET hair_color = 'Gray' WHERE name = 'CAPTAIN MCALLISTER';
UPDATE simpson_characters SET hair_color = 'Gray' WHERE name = 'JASPER BEARDLY';
UPDATE simpson_characters SET hair_color = 'Gray' WHERE name = 'HANS MOLEMAN';
UPDATE simpson_characters SET hair_color = 'Black' WHERE name = 'SNOWBALL II';
UPDATE simpson_characters SET hair_color = 'Orange' WHERE name = 'SANTA''S LITTLE HELPER';
UPDATE simpson_characters SET hair_color = 'Gray' WHERE name = 'SUPERINTENDENT CHALMERS';
UPDATE simpson_characters SET hair_color = 'Yellow' WHERE name = 'MARTIN PRINCE';
UPDATE simpson_characters SET hair_color = 'Yellow' WHERE name = 'WENDELL BORTON';
UPDATE simpson_characters SET hair_color = 'Yellow' WHERE name = 'JANEY POWELL';
UPDATE simpson_characters SET hair_color = 'Yellow' WHERE name = 'SHERRI AND TERRI';
UPDATE simpson_characters SET hair_color = 'Red' WHERE name = 'GROUNDSKEEPER WILLIE';
UPDATE simpson_characters SET hair_color = 'Gray' WHERE name = 'LUNCHLADY DORIS';
UPDATE simpson_characters SET hair_color = 'Brown' WHERE name = 'MS. HOOVER';
UPDATE simpson_characters SET hair_color = 'Gray' WHERE name = 'COACH KRUP';
UPDATE simpson_characters SET hair_color = 'Red' WHERE name = 'SIDESHOW BOB';
UPDATE simpson_characters SET hair_color = 'Green' WHERE name = 'SIDESHOW MEL';
UPDATE simpson_characters SET hair_color = 'Blonde' WHERE name = 'PRINCESS PENELOPE';
UPDATE simpson_characters SET hair_color = 'Brown' WHERE name = 'CECIL TERWILLIGER';
UPDATE simpson_characters SET hair_color = 'Brown' WHERE name = 'FRANK GRIMES';
UPDATE simpson_characters SET hair_color = 'Gray' WHERE name = 'SMILIN'' JOE FISSION';
UPDATE simpson_characters SET hair_color = 'Gray' WHERE name = 'MARTIN PRINCE SR.';
UPDATE simpson_characters SET hair_color = 'Brown' WHERE name = 'MRS. PRINCE';
UPDATE simpson_characters SET hair_color = 'Brown' WHERE name = 'LIONEL HUTZ';
UPDATE simpson_characters SET hair_color = 'Black' WHERE name = 'DR. NICK RIVIERA';
UPDATE simpson_characters SET hair_color = 'Black' WHERE name = 'COMIC BOOK GUY';
UPDATE simpson_characters SET hair_color = 'Yellow' WHERE name = 'BUMBLEBEE MAN';
UPDATE simpson_characters SET hair_color = 'Gray' WHERE name = 'ITCHY';
UPDATE simpson_characters SET hair_color = 'Gray' WHERE name = 'SCRATCHY';
UPDATE simpson_characters SET hair_color = 'Brown' WHERE name = 'POWELL MOTEL';
UPDATE simpson_characters SET hair_color = 'Brown' WHERE name = 'MRS. POWELL';
UPDATE simpson_characters SET hair_color = 'Gray' WHERE name = 'MOLEMAN';
UPDATE simpson_characters SET hair_color = 'Brown' WHERE name = 'GRADY';
UPDATE simpson_characters SET hair_color = 'Brown' WHERE name = 'FRANK';
UPDATE simpson_characters SET hair_color = 'Red' WHERE name = 'GROUNDSKEEPER SEAMUS';
UPDATE simpson_characters SET hair_color = 'Brown' WHERE name = 'MS. PEYTON';
UPDATE simpson_characters SET hair_color = 'Yellow' WHERE name = 'SPUCKLER CHILDREN';
UPDATE simpson_characters SET hair_color = 'Gray' WHERE name = 'MAYOR QUIMBY';
UPDATE simpson_characters SET hair_color = 'Gray' WHERE name = 'CHIEF INSPECTOR';
UPDATE simpson_characters SET hair_color = 'Gray' WHERE name = 'PROFESSOR FRINK';
UPDATE simpson_characters SET hair_color = 'Gray' WHERE name = 'KANG';
UPDATE simpson_characters SET hair_color = 'Gray' WHERE name = 'KODOS';
UPDATE simpson_characters SET hair_color = 'Green' WHERE name = 'RADIOACTIVE MAN';
UPDATE simpson_characters SET hair_color = 'Yellow' WHERE name = 'FALLOUT BOY';
UPDATE simpson_characters SET hair_color = 'Brown' WHERE name = 'HANK SCORPIO';
UPDATE simpson_characters SET hair_color = 'Gray' WHERE name = 'JOHNNY TIGHTLIPS';
UPDATE simpson_characters SET hair_color = 'Gray' WHERE name = 'LEGITIMATE BUSINESSMAN';
UPDATE simpson_characters SET hair_color = 'Gray' WHERE name = 'REX BANNER';
UPDATE simpson_characters SET hair_color = 'Brown' WHERE name = 'JACQUES';
UPDATE simpson_characters SET hair_color = 'Gray' WHERE name = 'GIL GUNDERSON';
UPDATE simpson_characters SET hair_color = 'Brown' WHERE name = 'DUFFMAN';
UPDATE simpson_characters SET hair_color = 'Gray' WHERE name = 'HOMER''S MOTHER';

-- Remove the age_group column
ALTER TABLE simpson_characters DROP COLUMN IF EXISTS age_group;

-- Verify the changes
SELECT name, hair_color FROM simpson_characters ORDER BY name; 