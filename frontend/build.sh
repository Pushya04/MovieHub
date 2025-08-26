#!/bin/bash

echo "🚀 Building frontend for production..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful! Files are in the 'dist' directory."
    echo "📁 Build output:"
    ls -la dist/
else
    echo "❌ Build failed!"
    exit 1
fi
