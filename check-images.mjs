// check-images.mjs
import fetch from 'node-fetch';

const SUPABASE_URL = 'https://oozeqvxblqxyxixhblsv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vemVxdnhibHF4eXhpeGhibHN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0NDE3NTcsImV4cCI6MjA2ODAxNzc1N30.06rEMsaY45Nzl3Cgfk7J5tQaJcIvhxmPj2YkUjbRPB0';

async function checkImages() {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/simpson_characters?select=name,image_url`, {
    headers: { apikey: SUPABASE_ANON_KEY }
  });
  const characters = await response.json();

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
