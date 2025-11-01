#!/bin/bash

# Manual Vercel deployment script

echo "🚀 Starting manual Vercel deployment..."
echo ""

# Step 1: Install Vercel CLI
echo "📦 Installing Vercel CLI..."
npm install -g vercel

# Step 2: Login
echo "🔐 Login to Vercel..."
vercel login

# Step 3: Pull environment
echo "📥 Pulling Vercel environment..."
vercel pull --yes

# Step 4: Build locally
echo "🔨 Building project..."
vercel build --prod

# Step 5: Deploy
echo "🚀 Deploying to production..."
vercel deploy --prod --force

echo ""
echo "✅ Deployment complete!"
echo "🔍 Check logs: vercel logs"




