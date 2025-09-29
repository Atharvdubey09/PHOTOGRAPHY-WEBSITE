const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Gallery = require('../models/Gallery');
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');

// Admin Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Find admin by username
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await admin.checkPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { id: admin._id, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            admin: {
                id: admin._id,
                username: admin.username,
                email: admin.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get admin profile
router.get('/profile', auth, async (req, res) => {
    try {
        const admin = await Admin.findById(req.user.id).select('-password');
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.json(admin);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Change admin password
router.put('/change-password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        const admin = await Admin.findById(req.user.id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Verify current password
        const isMatch = await admin.checkPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Update password
        admin.password = newPassword;
        await admin.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin Statistics Routes
router.get('/stats/users', auth, async (req, res) => {
    try {
        const count = await User.countDocuments();
        res.json({ count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/stats/bookings', auth, async (req, res) => {
    try {
        const count = await Booking.countDocuments();
        res.json({ count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/stats/gallery', auth, async (req, res) => {
    try {
        const count = await Gallery.countDocuments();
        res.json({ count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/stats/contacts', auth, async (req, res) => {
    try {
        const count = await Contact.countDocuments();
        res.json({ count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Payment statistics
router.get('/stats/payments', auth, async (req, res) => {
    try {
        const totalPayments = await Payment.countDocuments();
        const completedPayments = await Payment.countDocuments({ status: 'completed' });
        const totalRevenue = await Payment.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const pendingAmount = await Payment.aggregate([
            { $match: { status: 'pending' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        
        res.json({ 
            totalPayments,
            completedPayments,
            totalRevenue: totalRevenue[0]?.total || 0,
            pendingAmount: pendingAmount[0]?.total || 0
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all users
router.get('/users', auth, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all bookings with payment information
router.get('/bookings', auth, async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('userId', 'name email')
            .populate('payments')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update booking status
router.put('/bookings/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('userId', 'name email');
        
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        
        res.json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete booking
router.delete('/bookings/:id', auth, async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.json({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all contacts
router.get('/contacts', auth, async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json(contacts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete contact
router.delete('/contacts/:id', auth, async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.json({ message: 'Contact deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Payment Management Routes

// Get all payments
router.get('/payments', auth, async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate('bookingId', 'name email eventType eventDate')
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });
        res.json(payments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get payment by ID
router.get('/payments/:id', auth, async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id)
            .populate('bookingId')
            .populate('userId', 'name email');
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.json(payment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update payment status
router.put('/payments/:id/status', auth, async (req, res) => {
    try {
        const { status, failureReason } = req.body;
        const payment = await Payment.findByIdAndUpdate(
            req.params.id,
            { 
                status, 
                ...(failureReason && { failureReason })
            },
            { new: true }
        ).populate('bookingId').populate('userId', 'name email');
        
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        
        // Update booking payment status if needed
        if (payment.bookingId) {
            const booking = await Booking.findById(payment.bookingId._id);
            if (booking) {
                if (status === 'completed') {
                    booking.paymentStatus = 'partial';
                    booking.status = 'confirmed';
                } else if (status === 'failed') {
                    booking.paymentStatus = 'pending';
                    booking.status = 'pending';
                }
                await booking.save();
            }
        }
        
        res.json(payment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Process refund
router.post('/payments/:id/refund', auth, async (req, res) => {
    try {
        const { refundAmount, refundReason } = req.body;
        const payment = await Payment.findById(req.params.id);
        
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        
        if (payment.status !== 'completed') {
            return res.status(400).json({ message: 'Can only refund completed payments' });
        }
        
        payment.status = 'refunded';
        payment.refundAmount = refundAmount || payment.amount;
        payment.refundReason = refundReason;
        payment.refundedAt = new Date();
        
        await payment.save();
        
        // Update booking status
        if (payment.bookingId) {
            const booking = await Booking.findById(payment.bookingId);
            if (booking) {
                booking.paymentStatus = 'refunded';
                booking.status = 'cancelled';
                await booking.save();
            }
        }
        
        res.json({ message: 'Refund processed successfully', payment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get payment analytics
router.get('/analytics/payments', auth, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        let dateFilter = {};
        if (startDate && endDate) {
            dateFilter = {
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            };
        }
        
        const analytics = await Payment.aggregate([
            { $match: { ...dateFilter } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$amount' }
                }
            }
        ]);
        
        const methodBreakdown = await Payment.aggregate([
            { $match: { status: 'completed', ...dateFilter } },
            {
                $group: {
                    _id: '$method',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$amount' }
                }
            }
        ]);
        
        const dailyRevenue = await Payment.aggregate([
            { $match: { status: 'completed', ...dateFilter } },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                        day: { $dayOfMonth: '$createdAt' }
                    },
                    revenue: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
        ]);
        
        res.json({
            statusBreakdown: analytics,
            methodBreakdown,
            dailyRevenue
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;