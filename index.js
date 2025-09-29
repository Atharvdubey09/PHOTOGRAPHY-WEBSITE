const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Create Express app
const app = express();

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? [
            'https://atharvdubey09.github.io',
            'https://atharvdubey09.vercel.app',
            'https://studio-pro-website.vercel.app',
            process.env.FRONTEND_URL
          ].filter(Boolean)
        : [
            'http://127.0.0.1:5500', 
            'http://localhost:5500', 
            'http://127.0.0.1:3000', 
            'http://localhost:3000', 
            'null'
          ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
let cachedConnection = null;

const connectToDatabase = async () => {
    if (cachedConnection) {
        return cachedConnection;
    }

    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/studiopro';
        cachedConnection = await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('✅ Connected to MongoDB');
        console.log(`📧 Contact: ${process.env.CONTACT_EMAIL || 'dubeyatharv36@gmail.com'}`);
        console.log(`📞 Phone: ${process.env.CONTACT_PHONE || '7021763330'}`);
        console.log(`📍 Location: ${process.env.BUSINESS_LOCATION || 'Mumbai, Maharashtra, India'}`);
        
        return cachedConnection;
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
        throw err;
    }
};

// Import route handlers
const authRoutes = require('../backend/routes/authRoutes');
const bookingRoutes = require('../backend/routes/bookingRoutes');
const galleryRoutes = require('../backend/routes/galleryRoutes');
const adminRoutes = require('../backend/routes/adminRoutes');
const contactRoutes = require('../backend/routes/contactRoutes');
const testRoutes = require('../backend/routes/testRoutes');
const paymentRoutes = require('../backend/routes/paymentRoutes');

// Routes
app.use('/auth', authRoutes);
app.use('/bookings', bookingRoutes);
app.use('/gallery', galleryRoutes);
app.use('/admin', adminRoutes);
app.use('/contact', contactRoutes);
app.use('/test', testRoutes);
app.use('/payments', paymentRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Studio Pro API is running',
        contact: {
            email: process.env.CONTACT_EMAIL || 'dubeyatharv36@gmail.com',
            phone: process.env.CONTACT_PHONE || '7021763330',
            location: process.env.BUSINESS_LOCATION || 'Mumbai, Maharashtra, India'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// For Vercel serverless functions
module.exports = async (req, res) => {
    await connectToDatabase();
    return app(req, res);
};

// For local development
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    connectToDatabase().then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    });
}