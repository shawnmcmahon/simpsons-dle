#!/bin/bash
set -e

echo "Starting build process..."

# Install dependencies
npm ci

# Build the static site
npm run build

# Verify the build output
echo "Build completed. Contents of out directory:"
ls -la out/

# Create files that Amplify expects for Next.js apps
echo "{}" > out/required-server-files.json
echo "{}" > out/server-reference-manifest.json
echo "{}" > out/trace

echo "Build process completed successfully!" 