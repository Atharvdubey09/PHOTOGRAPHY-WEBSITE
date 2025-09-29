# Studio Pro Website Deployment Guide

## 🚀 Deployment Options

### **Option 1: Vercel (Recommended for Frontend + Serverless Backend)**
### **Option 2: Netlify (Frontend) + Railway/Render (Backend)**
### **Option 3: Heroku (Full Stack)**
### **Option 4: DigitalOcean App Platform**

---

## 🎯 **Option 1: Vercel Deployment (Recommended)**

Vercel is perfect for your modern website with glass-morphism effects and provides excellent performance.

### **Step 1: Prepare Your Project**

1. **Create .gitignore file**
```
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
dist/
build/

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Uploads (for development)
backend/uploads/*
!backend/uploads/.gitkeep
```

2. **Create vercel.json for backend API**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend/server.js"
    },
    {
      "src": "/uploads/(.*)",
      "dest": "/backend/uploads/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "MONGODB_URI": "@mongodb_uri",
    "JWT_SECRET": "@jwt_secret"
  }
}
```

### **Step 2: Deploy to Vercel**

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel --prod
```

### **Step 3: Environment Variables**
Set these in Vercel Dashboard:
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: your-super-secret-jwt-key-here-2025

---

## 🎯 **Option 2: Netlify + Railway (Separated)**

### **Frontend (Netlify)**

1. **Create netlify.toml**
```toml
[build]
  publish = "."
  command = "echo 'No build required for static site'"

[[redirects]]
  from = "/api/*"
  to = "https://your-railway-backend.up.railway.app/api/:splat"
  status = 200
  force = true

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

2. **Deploy to Netlify**
- Drag and drop your frontend files to Netlify
- Or connect your GitHub repository

### **Backend (Railway)**

1. **Create railway.json**
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd backend && npm start"
  }
}
```

2. **Deploy to Railway**
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

---

## 🎯 **Option 3: Heroku Deployment**

### **Step 1: Prepare for Heroku**

1. **Create Procfile**
```
web: cd backend && npm start
```

2. **Update backend/package.json**
```json
{
  "scripts": {
    "start": "node server.js",
    "heroku-postbuild": "echo 'No build step required'"
  },
  "engines": {
    "node": "18.x"
  }
}
```

### **Step 2: Deploy to Heroku**

1. **Install Heroku CLI and login**
```bash
heroku login
```

2. **Create Heroku app**
```bash
heroku create studio-pro-photography
```

3. **Set environment variables**
```bash
heroku config:set MONGODB_URI=your_mongodb_connection_string
heroku config:set JWT_SECRET=your-super-secret-jwt-key-here-2025
heroku config:set NODE_ENV=production
```

4. **Deploy**
```bash
git add .
git commit -m "Deploy Studio Pro website"
git push heroku main
```

---

## 📊 **Database Setup (MongoDB Atlas)**

### **Step 1: Create MongoDB Atlas Account**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create new cluster

### **Step 2: Configure Database**
1. **Database Access**: Create user with read/write permissions
2. **Network Access**: Add your deployment platform's IPs (or 0.0.0.0/0 for all)
3. **Connect**: Get connection string

### **Step 3: Update Environment**
Replace local MongoDB URI with Atlas URI:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/studiopro?retryWrites=true&w=majority
```

---

## 🔧 **Pre-Deployment Checklist**

### **Frontend Updates Needed**
- [ ] Update API endpoints from `localhost:5000` to production URLs
- [ ] Ensure all images have proper alt tags
- [ ] Test responsive design on all devices
- [ ] Verify all internal links work
- [ ] Check contact information is correct (dubeyatharv36@gmail.com, 7021763330, Mumbai)

### **Backend Updates Needed**
- [ ] Update CORS settings for production domain
- [ ] Set up file upload storage (Cloudinary recommended)
- [ ] Configure email service for contact forms
- [ ] Set up SSL certificates
- [ ] Add rate limiting for API endpoints

### **Security Checklist**
- [ ] Strong JWT secret in production
- [ ] Environment variables secured
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Input validation on all forms
- [ ] File upload restrictions in place

---

## 🎨 **Performance Optimization**

### **Image Optimization**
Replace current images with optimized versions:
```javascript
// Use WebP format for better compression
// Implement lazy loading for gallery images
// Use responsive images with srcset
```

### **Caching Strategy**
```javascript
// Add cache headers for static assets
// Implement service worker for offline functionality
// Use CDN for image delivery
```

---

## 📱 **Mobile Optimization**

Ensure your glass-morphism effects work well on mobile:
```css
/* Mobile-specific optimizations */
@media (max-width: 768px) {
  .glass-morphism {
    backdrop-filter: blur(10px); /* Reduced for mobile performance */
  }
}
```

---

## 🔗 **Custom Domain Setup**

### **Step 1: Purchase Domain**
Recommended: `studioprophotography.com` or similar

### **Step 2: Configure DNS**
Point your domain to your hosting platform:
- **Vercel**: Add CNAME record
- **Netlify**: Add CNAME or A record
- **Heroku**: Add CNAME record

### **Step 3: SSL Certificate**
Most platforms provide free SSL certificates automatically.

---

## 📊 **Post-Deployment Tasks**

### **Analytics Setup**
1. **Google Analytics**: Track website performance
2. **Google Search Console**: Monitor SEO
3. **Hotjar**: User behavior analysis

### **SEO Optimization**
1. **Meta tags**: Add proper meta descriptions
2. **Sitemap**: Generate and submit sitemap
3. **Schema markup**: Add structured data for photography business

### **Monitoring**
1. **Uptime monitoring**: Use UptimeRobot or similar
2. **Error tracking**: Implement Sentry for error monitoring
3. **Performance monitoring**: Use Google PageSpeed Insights

---

## 🎯 **Recommended Deployment: Vercel**

For your Studio Pro website with modern glass-morphism effects, I recommend **Vercel** because:

✅ **Excellent Performance**: Global CDN for fast loading  
✅ **Easy Deployment**: Simple git-based deployment  
✅ **Serverless Functions**: Perfect for your backend API  
✅ **Free Tier**: Generous free plan for small businesses  
✅ **Automatic HTTPS**: Built-in SSL certificates  
✅ **Perfect for Modern UIs**: Optimized for React/modern frontends  

---

## 🎨 **Maintaining Your Aesthetic**

Your glass-morphism design will look great in production. Ensure:
- **Browser compatibility**: Test on all major browsers
- **Performance**: Monitor Core Web Vitals
- **Accessibility**: Ensure good contrast ratios
- **Mobile experience**: Test glass effects on mobile devices

---

## 📞 **Support Contact**

After deployment, your website will showcase:
- **Email**: dubeyatharv36@gmail.com  
- **Phone**: 7021763330  
- **Location**: Mumbai, Maharashtra, India

Ready to deploy? Choose your preferred option and follow the detailed steps above!