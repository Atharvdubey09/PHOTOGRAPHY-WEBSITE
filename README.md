# 📸 Studio Pro - Professional Photography Website

> **Fixed & Ready for Deployment!** All bugs resolved, optimized for GitHub Pages and Vercel  
> Contact: dubeyatharv36@gmail.com | Phone: 7021763330 | Mumbai, Maharashtra, India

## 🎆 Live Demo

- **GitHub Pages**: https://atharvdubey09.github.io/studio-pro-website/
- **Vercel (Full-Stack)**: https://studio-pro-website.vercel.app/
## ✨ Features

### 🎨 Frontend Features
- **Modern Glass-Morphism UI** - Beautiful translucent effects and gradient backgrounds
- **Wedding Photography Showcase** - Pinterest-inspired romantic, traditional, and creative styles  
- **Responsive Design** - Mobile-optimized for all devices
- **Single Page Application** - Smooth scrolling navigation
- **Professional Gallery** - Interactive image showcases

### 💾 Backend Features
- **Admin Dashboard** - Complete content management with payment tracking
- **Payment Gateway** - Secure booking with 30% advance payment system
- **JWT Authentication** - Secure user and admin authentication
- **MongoDB Integration** - User data, bookings, and payments
- **File Upload System** - Gallery image management

### 🔧 Fixed Issues
- ✅ **Missing package.json** - Added root package.json for proper deployment
- ✅ **Broken file paths** - Fixed CSS and JS file references
- ✅ **CORS errors** - Updated server.js with proper origin configuration  
- ✅ **Vercel routing** - Enhanced vercel.json with proper route handling
- ✅ **Environment variables** - Added comprehensive .env.example
- ✅ **JavaScript syntax** - Fixed unclosed script tags
- ✅ **GitHub deployment** - Optimized for GitHub Pages hosting

## 🛠 Tech Stack

### Frontend
- HTML5, CSS3, JavaScript
- Glass-morphism effects with backdrop-filter
- Responsive grid layouts
- Font Awesome icons

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads
- CORS enabled

### Authentication
- Admin-specific authentication middleware
- JWT token-based security
- Role-based access control

## 🎨 Design Features

- **Glass-Morphism Effects** - Modern translucent UI elements
- **Gradient Backgrounds** - Professional color schemes
- **Smooth Animations** - Hover effects and transitions
- **Professional Typography** - Modern font combinations
- **Mobile-First Design** - Responsive across all devices

## 📁 Project Structure

```
studio-pro/
├── backend/                 # Node.js backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Authentication middleware
│   ├── uploads/            # File upload storage
│   └── server.js           # Main server file
├── admin-dashboard.html    # Admin management interface
├── index.html              # Main website
├── wedding-photography.html # Wedding portfolio showcase
├── booking.html            # Session booking system
├── payment-gateway.html    # Payment processing
├── style.css               # Main stylesheet
└── js/                     # JavaScript modules
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Git

### Local Development

1. **Clone the repository**
```bash
git clone [your-repo-url]
cd studio-pro
```

2. **Install dependencies**
```bash
cd backend
npm install
```

3. **Set up environment variables**
Create `backend/.env`:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your-super-secret-jwt-key-here-2025
PORT=5000
```

4. **Start the backend server**
```bash
npm start
```

5. **Open frontend**
Open `index.html` in your browser or use a local server.

## 🌐 Deployment

### Recommended: Vercel

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel --prod
```

3. **Set environment variables in Vercel dashboard**
- `MONGODB_URI`
- `JWT_SECRET`

### Alternative: Netlify + Railway

**Frontend (Netlify):**
- Drag and drop frontend files to Netlify

**Backend (Railway):**
```bash
npm i -g @railway/cli
railway login
railway init
railway up
```

## 📊 Admin Features

### Dashboard Statistics
- User management
- Booking tracking with payment status
- Contact form submissions
- Gallery management
- Revenue analytics

### Gallery Management
- Image upload with admin authentication
- Category organization
- Drag & drop interface
- Image optimization

### Payment Tracking
- Real-time payment status
- Advance payment tracking (30%)
- Refund processing
- Payment analytics

## 🎯 Wedding Photography Showcase

### Featured Styles
- **Bridal Elegance** - Professional sparkle wedding dress photography
- **Monsoon Romance** - Unique South Indian rain photography
- **Love Stories** - Romantic couple poses and intimate moments
- **Creative Artistry** - Innovative photography techniques
- **Sacred Ceremonies** - Traditional cultural photography
- **Destination Dreams** - Beautiful outdoor celebrations

## 🔐 Security Features

- JWT-based authentication
- Admin-specific middleware
- Input validation
- File upload restrictions
- CORS protection
- Environment variable security

## 📱 Mobile Optimization

- Responsive design for all screen sizes
- Touch-friendly navigation
- Optimized glass-morphism effects for mobile
- Fast loading with image optimization

## 🎨 Customization

### Brand Colors
```css
--primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--glass-bg: rgba(255, 255, 255, 0.9);
--backdrop-blur: blur(20px);
```

### Typography
- Primary: Poppins
- Secondary: Arial, sans-serif
- Accent: Font Awesome icons

## 📈 Performance

- Optimized images with proper alt tags
- CSS/JS minification ready
- CDN-ready static assets
- Lazy loading implementation
- Service worker ready

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Pinterest Inspiration** - Wedding photography styles
- **Unsplash** - High-quality stock photography
- **Font Awesome** - Professional icon library
- **MongoDB Atlas** - Cloud database hosting

---

**Created with ❤️ for Studio Pro Photography, Mumbai**
- **Pinterest Inspiration** - Wedding photography styles
- **Unsplash** - High-quality stock photography
- **Font Awesome** - Professional icon library
- **MongoDB Atlas** - Cloud database hosting

---

**Created with ❤️ for Studio Pro Photography, Mumbai**