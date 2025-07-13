// Supabase Configuration
// Add these environment variables to your .env.local file:

// NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
// NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

export const SUPABASE_CONFIG = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
} 