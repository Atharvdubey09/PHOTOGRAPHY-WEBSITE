const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// Submit contact form
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, service, message } = req.body;
        
        // Validate inputs
        if (!name || !email || !phone || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        if (name.length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Name must be at least 2 characters long'
            });
        }

        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address'
            });
        }

        if (!/^\d{10}$/.test(phone)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid 10-digit phone number'
            });
        }

        if (message.length < 10) {
            return res.status(400).json({
                success: false,
                message: 'Message must be at least 10 characters long'
            });
        }

        const contact = new Contact({
            name,
            email,
            phone,
            service: service || 'General Inquiry',
            message
        });

        await contact.save();
        console.log('Contact form submitted:', { name, email }); // Log successful submission

        res.status(201).json({ 
            success: true, 
            message: 'Thank you for contacting us! We will get back to you soon.' 
        });
    } catch (error) {
        console.error('Contact form error:', error); // Log error details
        res.status(500).json({ 
            success: false, 
            message: 'Error submitting contact form. Please try again.' 
        });
    }
});

// Test endpoint
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Contact API is working'
    });
});

// Get all contacts (Admin only)
router.get('/', async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            data: contacts
        });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error retrieving contacts.' 
        });
    }
});

module.exports = router;