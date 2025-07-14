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

# Create comprehensive server files that Amplify expects
cat > out/required-server-files.json << 'EOF'
{
  "version": 3,
  "files": {},
  "entrypoints": {}
}
EOF

cat > out/server-reference-manifest.json << 'EOF'
{
  "version": 3,
  "files": {},
  "entrypoints": {}
}
EOF

cat > out/trace << 'EOF'
{
  "version": 3,
  "files": {},
  "entrypoints": {}
}
EOF

echo "Server files created successfully"
echo "Build process completed successfully!" 