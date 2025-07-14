# Deploying Simpson's DLE to AWS Amplify

This guide will walk you through deploying your Simpson's DLE application to AWS Amplify.

## Prerequisites

1. **AWS Account**: You need an AWS account with appropriate permissions
2. **GitHub/GitLab/Bitbucket Account**: Your code should be in a Git repository
3. **Supabase Project**: Your Supabase project should be set up and running

## Step 1: Prepare Your Repository

Make sure your code is committed and pushed to your Git repository (GitHub, GitLab, or Bitbucket).

## Step 2: Set Up AWS Amplify

### Option A: Using AWS Amplify Console (Recommended)

1. **Sign in to AWS Console**
   - Go to [AWS Console](https://console.aws.amazon.com/)
   - Sign in with your AWS account

2. **Navigate to Amplify**
   - Search for "Amplify" in the AWS services search bar
   - Click on "AWS Amplify"

3. **Create a New App**
   - Click "New app" → "Host web app"
   - Choose your Git provider (GitHub, GitLab, Bitbucket, or AWS CodeCommit)
   - Authorize Amplify to access your repository

4. **Select Repository**
   - Choose your repository containing the Simpson's DLE code
   - Select the branch you want to deploy (usually `main` or `master`)

5. **Configure Build Settings**
   - Amplify should automatically detect that it's a Next.js app
   - The build settings should be pre-configured with the `amplify.yml` file
   - If not, you can manually configure:
     - Build command: `npm run build`
     - Output directory: `out`

6. **Environment Variables**
   - Add your Supabase environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key

7. **Deploy**
   - Click "Save and deploy"
   - Amplify will build and deploy your application

### Option B: Using AWS CLI

1. **Install AWS CLI**
   ```bash
   # Download and install AWS CLI from https://aws.amazon.com/cli/
   ```

2. **Configure AWS CLI**
   ```bash
   aws configure
   # Enter your AWS Access Key ID, Secret Access Key, region, and output format
   ```

3. **Install Amplify CLI**
   ```bash
   npm install -g @aws-amplify/cli
   ```

4. **Initialize Amplify**
   ```bash
   amplify init
   # Follow the prompts to set up your project
   ```

5. **Add Hosting**
   ```bash
   amplify add hosting
   # Choose "Amazon CloudFront and S3" for production hosting
   ```

6. **Deploy**
   ```bash
   amplify publish
   ```

## Step 3: Configure Environment Variables

In the AWS Amplify Console:

1. Go to your app's dashboard
2. Navigate to **App settings** → **Environment variables**
3. Add the following variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://oozeqvxblqxyxixhblsv.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key

## Step 4: Custom Domain (Optional)

1. In Amplify Console, go to **Domain management**
2. Click **Add domain**
3. Enter your custom domain name
4. Follow the DNS configuration instructions
5. Wait for DNS propagation (can take up to 48 hours)

## Step 5: Verify Deployment

1. **Check Build Status**
   - Monitor the build process in the Amplify Console
   - Check for any build errors in the logs

2. **Test Your Application**
   - Visit your deployed URL
   - Test the game functionality
   - Verify that Supabase connection works

3. **Monitor Performance**
   - Use Amplify's built-in analytics
   - Monitor for any errors in the browser console

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check the build logs in Amplify Console
   - Ensure all dependencies are in `package.json`
   - Verify Node.js version compatibility

2. **Environment Variables Not Working**
   - Make sure variables are prefixed with `NEXT_PUBLIC_` for client-side access
   - Redeploy after adding environment variables

3. **Supabase Connection Issues**
   - Verify your Supabase project is active
   - Check that RLS policies are configured correctly
   - Ensure the database schema is set up

4. **Image Loading Issues**
   - Verify the image domains are configured in `next.config.ts`
   - Check that image URLs are accessible

### Build Configuration

The `amplify.yml` file configures the build process:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: out
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

### Next.js Configuration

The `next.config.ts` file is configured for static export:

```typescript
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'static.simpsonswiki.com',
      },
    ],
  },
};
```

## Continuous Deployment

Once set up, Amplify will automatically:
- Deploy when you push to your main branch
- Run tests and build checks
- Provide preview deployments for pull requests
- Handle rollbacks if needed

## Cost Considerations

- **Amplify Hosting**: Free tier includes 1,000 build minutes/month and 15 GB storage
- **Bandwidth**: Free tier includes 15 GB/month
- **Custom Domains**: Free SSL certificates included
- **Build Minutes**: Additional minutes cost $0.01 per minute

## Security Best Practices

1. **Environment Variables**: Never commit sensitive data to your repository
2. **Supabase RLS**: Ensure proper Row Level Security policies
3. **HTTPS**: Amplify provides free SSL certificates
4. **Access Control**: Use AWS IAM for team access management

## Monitoring and Analytics

1. **Amplify Analytics**: Built-in analytics for page views and user behavior
2. **Error Tracking**: Monitor for JavaScript errors
3. **Performance**: Track Core Web Vitals
4. **Logs**: Access build and runtime logs

Your Simpson's DLE application should now be successfully deployed and accessible via the provided Amplify URL! 