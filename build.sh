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

# Create a dummy file to satisfy Amplify's requirements
echo "{}" > out/required-server-files.json

echo "Build process completed successfully!" 