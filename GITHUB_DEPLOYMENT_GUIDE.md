# Studio Pro - GitHub Deployment Guide

## Option 1: Deploy Without Installing Git (Recommended)

### Step 1: Create GitHub Account & Repository
1. Go to [github.com](https://github.com) and create an account if you don't have one
2. Click "New repository" (green button)
3. Repository name: `studio-pro-website`
4. Description: `Professional Photography Studio Website with Payment Gateway`
5. Set to **Public** (required for free GitHub Pages)
6. ✅ Check "Add a README file"
7. Click "Create repository"

### Step 2: Upload Your Website Files
1. In your new repository, click "uploading an existing file"
2. **IMPORTANT**: Select ALL files from your project folder:
   ```
   📁 Your Project Files to Upload:
   ├── 📄 index.html
   ├── 📄 about.html
   ├── 📄 services.html
   ├── 📄 gallery.html
   ├── 📄 contact.html
   ├── 📄 admin.html
   ├── 📄 booking.html
   ├── 📄 wedding-photography.html
   ├── 📄 privacy-policy.html
   ├── 📄 terms-conditions.html
   ├── 📄 cookie-policy.html
   ├── 📄 api-fallback.html
   ├── 📄 package.json
   ├── 📄 package-lock.json
   ├── 📄 server.js
   ├── 📄 Procfile
   ├── 📄 deploy.sh
   ├── 📁 css/ (entire folder)
   ├── 📁 js/ (entire folder)
   ├── 📁 images/ (entire folder)
   ├── 📁 backend/ (entire folder)
   └── 📁 .github/ (entire folder)
   ```

3. Drag and drop all files or use "choose your files"
4. Commit message: "Initial deployment of Studio Pro website"
5. Click "Commit changes"

### Step 3: Enable GitHub Pages
1. In your repository, go to **Settings** tab
2. Scroll down to **Pages** section (left sidebar)
3. Under "Source", select **Deploy from a branch**
4. Branch: **main** 
5. Folder: **/ (root)**
6. Click **Save**

### Step 4: Access Your Live Website
- Your website will be available at: `https://YOUR_USERNAME.github.io/studio-pro-website`
- It may take 5-10 minutes to become live

## Option 2: Install Git and Use Command Line

### Step 1: Install Git for Windows
1. Download Git from: https://git-scm.com/download/win
2. Run the installer with default settings
3. Restart your command prompt/PowerShell

### Step 2: Configure Git (First Time Only)
```bash
git config --global user.name "Your Name"
git config --global user.email "dubeyatharv36@gmail.com"
```

### Step 3: Initialize and Deploy
```bash
# Initialize repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial deployment of Studio Pro website"

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/studio-pro-website.git

# Push to GitHub
git push -u origin main
```

## Important Notes for Backend Functionality

⚠️ **GitHub Pages Limitation**: GitHub Pages only hosts static websites. Your backend won't work on GitHub Pages.

### For Full Backend Functionality, Also Deploy To:

#### Vercel (Recommended for Node.js)
1. Go to [vercel.com](https://vercel.com)
2. Connect your GitHub repository
3. Deploy automatically

#### Heroku (Alternative)
1. Go to [heroku.com](https://heroku.com)
2. Create new app
3. Connect to GitHub repository
4. Enable automatic deploys

#### Railway (Alternative)
1. Go to [railway.app](https://railway.app)
2. Connect GitHub repository
3. Deploy with one click

## Environment Variables Required

For backend functionality, set these environment variables in your hosting platform:

```
NODE_ENV=production
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

## Your Website Features

✅ **Working on GitHub Pages**:
- All HTML pages and frontend functionality
- CSS styling and animations
- Client-side JavaScript
- Image gallery display
- Contact forms (frontend only)

❌ **Requires Backend Hosting**:
- Payment processing
- Database operations
- User authentication
- Admin dashboard functionality
- File uploads
- Email sending

## Next Steps After Deployment

1. **Update URLs**: Replace localhost URLs in your frontend with your deployed backend URL
2. **Configure Domain**: Optionally set up custom domain in repository settings
3. **SSL Certificate**: GitHub Pages provides HTTPS automatically
4. **Monitor Performance**: Use GitHub's built-in analytics

## Support

If you encounter any issues:
1. Check repository Actions tab for deployment status
2. Verify all files were uploaded correctly
3. Ensure GitHub Pages is enabled in settings
4. Check browser console for any errors

Your website is ready for professional use! 🚀