const express = require('express');
const path = require('path');

// This is a simple handler for uploads - in production, you would use proper file handling
const app = express();

// Serve static files from the backend uploads directory
app.use(express.static(path.join(__dirname, '../backend/uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Uploads API is running',
        timestamp: new Date().toISOString(),
        contact: {
            email: process.env.CONTACT_EMAIL || 'dubeyatharv36@gmail.com',
            phone: process.env.CONTACT_PHONE || '7021763330',
            location: process.env.BUSINESS_LOCATION || 'Mumbai, Maharashtra, India'
        }
    });
});

// Export for Vercel
module.exports = app;