#!/bin/bash

# Studio Pro Deployment Script
echo "🚀 Studio Pro Photography - Deployment Script"
echo "=============================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: Studio Pro Photography website"
fi

# Check deployment option
echo ""
echo "Choose your deployment option:"
echo "1. Vercel (Recommended)"
echo "2. Netlify + Railway"
echo "3. Heroku"
echo "4. Exit"
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🔄 Deploying to Vercel..."
        
        # Check if Vercel CLI is installed
        if ! command -v vercel &> /dev/null; then
            echo "📦 Installing Vercel CLI..."
            npm install -g vercel
        fi
        
        echo "🚀 Starting Vercel deployment..."
        vercel --prod
        
        echo ""
        echo "✅ Deployment completed!"
        echo "📝 Don't forget to set environment variables in Vercel dashboard:"
        echo "   - MONGODB_URI"
        echo "   - JWT_SECRET"
        ;;
        
    2)
        echo ""
        echo "🔄 Preparing for Netlify + Railway deployment..."
        
        echo "📁 Frontend: Upload your files to Netlify"
        echo "🔧 Backend: Deploy to Railway"
        
        # Check if Railway CLI is installed
        if ! command -v railway &> /dev/null; then
            echo "📦 Installing Railway CLI..."
            npm install -g @railway/cli
        fi
        
        echo "🚀 Initializing Railway..."
        cd backend
        railway login
        railway init
        railway up
        
        echo ""
        echo "✅ Backend deployed to Railway!"
        echo "📝 Now deploy frontend to Netlify and update the API URL in netlify.toml"
        ;;
        
    3)
        echo ""
        echo "🔄 Deploying to Heroku..."
        
        # Check if Heroku CLI is installed
        if ! command -v heroku &> /dev/null; then
            echo "❌ Heroku CLI not found. Please install it first:"
            echo "   https://devcenter.heroku.com/articles/heroku-cli"
            exit 1
        fi
        
        echo "🔐 Logging in to Heroku..."
        heroku login
        
        read -p "Enter your app name (e.g., studio-pro-photography): " appname
        
        echo "🚀 Creating Heroku app..."
        heroku create $appname
        
        echo "🔧 Setting environment variables..."
        read -p "Enter your MongoDB URI: " mongodb_uri
        heroku config:set MONGODB_URI="$mongodb_uri"
        heroku config:set JWT_SECRET="your-super-secret-jwt-key-here-2025"
        heroku config:set NODE_ENV="production"
        
        echo "🚀 Deploying to Heroku..."
        git add .
        git commit -m "Deploy to Heroku"
        git push heroku main
        
        echo ""
        echo "✅ Deployment completed!"
        ;;
        
    4)
        echo "👋 Deployment cancelled."
        exit 0
        ;;
        
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎉 Studio Pro Photography deployment process completed!"
echo ""
echo "📞 Contact Information:"
echo "   Email: dubeyatharv36@gmail.com"
echo "   Phone: 7021763330"
echo "   Location: Mumbai, Maharashtra, India"
echo ""
echo "🎨 Your beautiful glass-morphism website is now live!"