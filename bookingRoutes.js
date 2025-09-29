const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// Get user's bookings
router.get('/my-bookings', auth, async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user.userId })
            .sort({ date: -1 });
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Error fetching bookings' });
    }
});

// Create new booking - public route (no auth required)
router.post('/', async (req, res) => {
    try {
        const { 
            name, 
            email, 
            phone, 
            sessionType, 
            date, 
            time, 
            message 
        } = req.body;

        // Input validation
        if (!name || !email || !phone || !sessionType || !date || !time) {
            return res.status(400).json({ 
                message: 'Please provide all required fields' 
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                message: 'Please provide a valid email address' 
            });
        }

        // Phone validation
        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ 
                message: 'Please provide a valid phone number' 
            });
        }

        // Set price based on session type
        const prices = {
            portrait: 199,
            event: 499,
            wedding: 1499
        };

        // Try to find or create user
        let bookingUser = await User.findOne({ email });
        if (!bookingUser) {
            bookingUser = new User({
                name,
                email,
                phone,
                password: 'temp-password-' + Date.now() // Temporary password
            });
            await bookingUser.save();
        }

        const booking = new Booking({
            userId: bookingUser._id,
            name,
            email,
            phone,
            sessionType,
            date: new Date(date),
            time,
            message,
            price: prices[sessionType]
        });

        await booking.save();

        console.log('Booking session submitted:', { name, email, sessionType, date, time });

        
        // Send confirmation response
        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            booking: {
                _id: booking._id,
                id: booking._id,
                sessionType: booking.sessionType,
                name: booking.name,
                email: booking.email,
                phone: booking.phone,
                date: booking.date,
                time: booking.time,
                price: booking.price,
                message: booking.message,
                status: booking.status
            }
        });
    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ 
            message: 'An error occurred while processing your booking' 
        });
    }
});

// Confirm booking email route
router.post('/confirm-email', auth, async (req, res) => {
    try {
        const { email, sessionType, date, time } = req.body;
        const emailUser = await User.findById(req.user.userId);

        if (!emailUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create email transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Send confirmation email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Studio Pro - Booking Confirmation',
            html: `
                <h1>Booking Confirmation</h1>
                <p>Dear ${emailUser.name},</p>
                <p>Thank you for booking a session with Studio Pro. Here are your booking details:</p>
                <ul>
                    <li>Session Type: ${sessionType}</li>
                    <li>Date: ${new Date(date).toLocaleDateString()}</li>
                    <li>Time: ${time}</li>
                </ul>
                <p>We will contact you shortly to confirm your appointment.</p>
                <p>Best regards,<br>Studio Pro Team</p>
            `
        });

        res.json({ message: 'Confirmation email sent successfully' });
    } catch (error) {
        console.error('Error sending confirmation email:', error);
        res.status(500).json({ message: 'Error sending confirmation email' });
    }
});

// Update booking status
router.patch('/:id', auth, async (req, res) => {
    try {
        const booking = await Booking.findOneAndUpdate(
            { _id: req.params.id, user: req.user.userId },
            { status: req.body.status },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

// Update booking payment status
router.put('/:id/payment', auth, async (req, res) => {
    try {
        const { paymentToken, advanceAmount, status } = req.body;
        
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ 
                success: false,
                message: 'Booking not found' 
            });
        }
        
        // Update booking with payment information
        booking.paymentToken = paymentToken;
        booking.advanceAmount = advanceAmount;
        booking.status = status || 'confirmed';
        booking.paymentDate = new Date();
        
        await booking.save();
        
        res.json({
            success: true,
            message: 'Booking payment status updated',
            booking
        });
    } catch (error) {
        console.error('Error updating booking payment:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error updating booking payment status' 
        });
    }
});

// Get single booking by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            userId: req.user.userId
        });
        
        if (!booking) {
            return res.status(404).json({ 
                success: false,
                message: 'Booking not found' 
            });
        }
        
        res.json({
            success: true,
            booking
        });
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching booking' 
        });
    }
});