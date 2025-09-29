const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Health check route
router.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Test protected route
router.get('/protected', (req, res) => {
    try {
        res.json({ 
            status: 'ok', 
            message: 'Protected route accessed',
            auth: req.headers.authorization ? 'Token present' : 'No token'
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Test database connection
router.get('/db-test', async (req, res) => {
    try {
        const dbStatus = mongoose.connection.readyState;
        const status = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        };
        
        res.json({ 
            status: 'ok', 
            database: status[dbStatus] || 'unknown',
            mongodb_uri: process.env.MONGODB_URI ? 'configured' : 'missing'
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Test file upload
router.post('/upload-test', upload.single('test-file'), (req, res) => {
    try {
        res.json({ 
            status: 'ok', 
            message: 'File upload endpoint working',
            file: req.file ? 'File received' : 'No file received'
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;