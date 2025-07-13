# Supabase Setup for Simpson's DLE

This guide will help you set up Supabase for your Simpson's DLE project.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `simpsons-dle`
   - **Database Password**: Choose a strong password
   - **Region**: Select the region closest to your users
6. Click "Create new project"
7. Wait for the project to be created (this may take a few minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

## Step 3: Set Up Environment Variables

1. Create a `.env.local` file in your project root
2. Add the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace the placeholder values with your actual Supabase credentials.

## Step 4: Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `database-schema.sql`
3. Paste it into the SQL editor
4. Click "Run" to execute the schema

This will create:
- `game_words` table with Simpson's-themed words
- `user_scores` table for tracking player scores
- `game_states` table for saving game progress
- Sample data with characters, locations, food, and quotes

## Step 5: Test the Connection

1. Start your development server: `npm run dev`
2. Open your browser to `http://localhost:3000`
3. Check the browser console for any connection errors

## Step 6: Verify Database Setup

You can verify the setup by checking your Supabase dashboard:

1. Go to **Table Editor**
2. You should see three tables: `game_words`, `user_scores`, and `game_states`
3. Click on `game_words` to see the sample Simpson's data

## Database Structure

### Tables

1. **game_words**: Contains Simpson's-themed words for the game
   - `id`: Unique identifier
   - `word`: The word to guess (e.g., "HOMER", "SPRINGFIELD")
   - `category`: Word category (characters, locations, food, quotes)
   - `difficulty`: Easy, medium, or hard
   - `created_at`: Timestamp

2. **user_scores**: Tracks player performance
   - `id`: Unique identifier
   - `user_id`: User ID (optional, for anonymous play)
   - `word_id`: Reference to the word that was played
   - `attempts`: Number of attempts taken
   - `completed`: Whether the word was successfully guessed
   - `time_taken`: Time taken in seconds
   - `created_at`: Timestamp

3. **game_states**: Saves current game progress
   - `id`: Unique identifier
   - `user_id`: User ID (optional)
   - `current_word`: The word being guessed
   - `attempts`: Array of previous attempts
   - `completed`: Whether the game is finished
   - `created_at`: Timestamp

## Usage Examples

The database functions are available in `src/lib/database.ts`:

```typescript
import { database } from '@/lib/database'

// Get a random word
const word = await database.getRandomWord('characters')

// Save a score
await database.saveScore({
  word_id: 1,
  attempts: 3,
  completed: true,
  time_taken: 120
})

// Get leaderboard
const leaderboard = await database.getLeaderboard(10)
```

## Security

- Row Level Security (RLS) is enabled on all tables
- Public read access is allowed for game words and leaderboards
- User-specific data requires authentication
- All database operations are logged for monitoring

## Troubleshooting

### Common Issues

1. **Connection Error**: Check your environment variables are correct
2. **Permission Denied**: Ensure RLS policies are set up correctly
3. **Table Not Found**: Run the SQL schema again
4. **CORS Error**: Check your Supabase project settings

### Getting Help

- Check the [Supabase Documentation](https://supabase.com/docs)
- Visit the [Supabase Community](https://github.com/supabase/supabase/discussions)
- Review the [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)

## Next Steps

Once Supabase is set up, you can:

1. Integrate the database functions into your game logic
2. Add user authentication (optional)
3. Implement real-time features
4. Add analytics and tracking
5. Scale your application as needed 