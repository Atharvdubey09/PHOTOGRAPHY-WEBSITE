const express = require('express');
const router = express.Router();
const PaymentMethod = require('../models/PaymentMethod');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');
const crypto = require('crypto');

// Mock payment processor functions
const processCardPayment = async (cardDetails, amount) => {
    // In production, integrate with real payment processors like Stripe, Square, etc.
    // This is a mock implementation for demonstration
    
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock validation
    if (cardDetails.number.length < 13) {
        throw new Error('Invalid card number');
    }
    
    // Simulate random failures (5% chance)
    if (Math.random() < 0.05) {
        throw new Error('Payment declined by bank');
    }
    
    return {
        paymentId: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        transactionId: `txn_${Date.now()}`,
        status: 'completed',
        amount: amount,
        currency: 'USD',
        processorResponse: 'APPROVED'
    };
};

const generatePaymentToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Process payment for booking
router.post('/process', auth, async (req, res) => {
    try {
        const { 
            bookingId, 
            amount, 
            paymentMethod, 
            cardDetails, 
            currency = 'USD',
            description 
        } = req.body;

        // Validate required fields
        if (!bookingId || !amount || !paymentMethod) {
            return res.status(400).json({
                success: false,
                message: 'Missing required payment information'
            });
        }

        // Validate amount
        if (amount <= 0 || amount > 10000) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment amount'
            });
        }

        // Find the booking
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        let paymentResult;
        
        try {
            if (paymentMethod === 'card') {
                if (!cardDetails) {
                    return res.status(400).json({
                        success: false,
                        message: 'Card details required for card payment'
                    });
                }
                
                // Process card payment
                paymentResult = await processCardPayment(cardDetails, amount);
                
                // Save card if requested
                if (cardDetails.saveCard) {
                    await savePaymentMethod(req.user.id, cardDetails);
                }
            } else {
                // Handle alternative payment methods (PayPal, Apple Pay, etc.)
                paymentResult = await processAlternativePayment(paymentMethod, amount);
            }
            
            // Create payment record
            const paymentRecord = new Payment({
                bookingId: booking._id,
                userId: req.user.id,
                paymentId: paymentResult.paymentId,
                transactionId: paymentResult.transactionId,
                amount: amount,
                currency: currency,
                method: paymentMethod,
                status: 'completed',
                paymentToken: generatePaymentToken(),
                description: description || `Advance payment for booking ${bookingId}`,
                cardDetails: paymentMethod === 'card' ? {
                    last4: cardDetails.number.slice(-4),
                    cardType: cardDetails.number.startsWith('4') ? 'visa' : 
                             cardDetails.number.startsWith('5') ? 'mastercard' : 
                             cardDetails.number.startsWith('3') ? 'amex' : 'other',
                    cardholderName: cardDetails.name
                } : undefined,
                isAdvancePayment: true,
                advancePercentage: 30,
                totalBookingAmount: booking.price || booking.totalAmount,
                remainingAmount: (booking.price || booking.totalAmount) - amount,
                processedAt: new Date()
            });
            
            await paymentRecord.save();
            
            // Update booking with payment information
            booking.payments = booking.payments || [];
            booking.payments.push(paymentRecord._id);
            booking.paymentStatus = 'partial';
            booking.status = 'confirmed';
            booking.advanceAmount = amount;
            await booking.save();
            
            res.json({
                success: true,
                message: 'Payment processed successfully',
                paymentId: paymentResult.paymentId,
                transactionId: paymentResult.transactionId,
                amount: amount,
                status: 'completed',
                paymentToken: paymentRecord.paymentToken
            });
            
        } catch (paymentError) {
            console.error('Payment processing error:', paymentError);
            
            // Log failed payment attempt
            const failedPayment = new Payment({
                bookingId: booking._id,
                userId: req.user.id,
                paymentId: `failed_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                transactionId: `failed_txn_${Date.now()}`,
                amount: amount,
                currency: currency,
                method: paymentMethod,
                status: 'failed',
                paymentToken: generatePaymentToken(),
                description: description || `Failed payment attempt for booking ${bookingId}`,
                failureReason: paymentError.message,
                totalBookingAmount: booking.price || booking.totalAmount,
                remainingAmount: booking.price || booking.totalAmount,
                processedAt: new Date()
            });
            
            await failedPayment.save();
            
            return res.status(400).json({
                success: false,
                message: paymentError.message || 'Payment processing failed'
            });
        }
        
    } catch (error) {
        console.error('Payment endpoint error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during payment processing'
        });
    }
});

// Initialize alternative payment methods
router.post('/:method/init', auth, async (req, res) => {
    try {
        const { method } = req.params;
        const { bookingId, amount } = req.body;
        
        if (!['paypal', 'apple', 'google'].includes(method)) {
            return res.status(400).json({
                success: false,
                message: 'Unsupported payment method'
            });
        }
        
        // In production, this would initialize payment with the respective provider
        const sessionId = `${method}_session_${Date.now()}`;
        
        let redirectUrl;
        switch (method) {
            case 'paypal':
                redirectUrl = `https://sandbox.paypal.com/checkout?session=${sessionId}`;
                break;
            case 'apple':
                // Apple Pay is handled client-side
                return res.json({
                    success: true,
                    requiresClientHandling: true,
                    sessionId
                });
            case 'google':
                // Google Pay is handled client-side
                return res.json({
                    success: true,
                    requiresClientHandling: true,
                    sessionId
                });
        }
        
        res.json({
            success: true,
            redirectUrl,
            sessionId
        });
        
    } catch (error) {
        console.error('Payment initialization error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to initialize payment'
        });
    }
});

// Handle payment webhooks (for real payment processors)
router.post('/webhook', async (req, res) => {
    try {
        // In production, verify webhook signature
        const { event, data } = req.body;
        
        switch (event) {
            case 'payment.completed':
                // Update booking status
                const booking = await Booking.findById(data.bookingId);
                if (booking) {
                    booking.payment.status = 'completed';
                    booking.status = 'confirmed';
                    await booking.save();
                }
                break;
                
            case 'payment.failed':
                // Handle failed payment
                const failedBooking = await Booking.findById(data.bookingId);
                if (failedBooking) {
                    failedBooking.payment.status = 'failed';
                    failedBooking.status = 'pending';
                    await failedBooking.save();
                }
                break;
        }
        
        res.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
});

// Helper function to save payment method
async function savePaymentMethod(userId, cardDetails) {
    try {
        const cleanCardNumber = cardDetails.number.replace(/\s/g, '');
        let cardType = 'visa';
        
        if (cleanCardNumber.startsWith('4')) {
            cardType = 'visa';
        } else if (cleanCardNumber.startsWith('5') || cleanCardNumber.startsWith('2')) {
            cardType = 'mastercard';
        } else if (cleanCardNumber.startsWith('3')) {
            cardType = 'amex';
        }
        
        const [month, year] = cardDetails.expiry.split('/');
        const last4 = cleanCardNumber.slice(-4);
        
        const paymentMethod = new PaymentMethod({
            userId: userId,
            type: cardType,
            last4,
            cardholderName: cardDetails.name,
            expiryMonth: month,
            expiryYear: year,
            isDefault: false,
            paymentToken: `tok_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        });
        
        await paymentMethod.save();
        return paymentMethod;
    } catch (error) {
        console.error('Error saving payment method:', error);
    }
}

// Helper function for alternative payments
async function processAlternativePayment(method, amount) {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
        paymentId: `${method}_pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        transactionId: `${method}_txn_${Date.now()}`,
        status: 'completed',
        amount: amount,
        currency: 'USD',
        processorResponse: 'APPROVED'
    };
}

// Get user's payment methods
router.get('/', auth, async (req, res) => {
    try {
        const paymentMethods = await PaymentMethod.find({ 
            userId: req.user.id, 
            isActive: true 
        }).sort({ isDefault: -1, createdAt: -1 });

        res.json({
            success: true,
            data: paymentMethods
        });
    } catch (error) {
        console.error('Error fetching payment methods:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching payment methods'
        });
    }
});

// Add new payment method
router.post('/', auth, async (req, res) => {
    try {
        const { cardNumber, cardholderName, expiryDate, cvv, isDefault } = req.body;

        // Basic validation
        if (!cardNumber || !cardholderName || !expiryDate || !cvv) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Validate card number (basic check)
        const cleanCardNumber = cardNumber.replace(/\s/g, '');
        if (!/^\d{13,19}$/.test(cleanCardNumber)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid card number'
            });
        }

        // Validate expiry date
        const [month, year] = expiryDate.split('/');
        if (!month || !year || !/^\d{2}$/.test(month) || !/^\d{2}$/.test(year)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid expiry date format (MM/YY)'
            });
        }

        // Determine card type based on first digits
        let cardType = 'visa'; // default
        if (cleanCardNumber.startsWith('4')) {
            cardType = 'visa';
        } else if (cleanCardNumber.startsWith('5') || cleanCardNumber.startsWith('2')) {
            cardType = 'mastercard';
        } else if (cleanCardNumber.startsWith('3')) {
            cardType = 'amex';
        } else if (cleanCardNumber.startsWith('6')) {
            cardType = 'discover';
        }

        // Get last 4 digits
        const last4 = cleanCardNumber.slice(-4);

        // In production, you would:
        // 1. Use a payment processor (Stripe, PayPal, etc.) to tokenize the card
        // 2. Never store actual card numbers
        // 3. Validate with the payment processor
        
        // For demo purposes, we'll create a mock token
        const paymentToken = `tok_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const paymentMethod = new PaymentMethod({
            userId: req.user.id,
            type: cardType,
            last4,
            cardholderName,
            expiryMonth: month,
            expiryYear: year,
            isDefault: isDefault || false,
            paymentToken
        });

        await paymentMethod.save();

        res.status(201).json({
            success: true,
            message: 'Payment method added successfully',
            data: paymentMethod
        });
    } catch (error) {
        console.error('Error adding payment method:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding payment method'
        });
    }
});

// Set default payment method
router.put('/:id/default', auth, async (req, res) => {
    try {
        const paymentMethod = await PaymentMethod.findOne({
            _id: req.params.id,
            userId: req.user.id,
            isActive: true
        });

        if (!paymentMethod) {
            return res.status(404).json({
                success: false,
                message: 'Payment method not found'
            });
        }

        // Remove default from all other payment methods
        await PaymentMethod.updateMany(
            { userId: req.user.id },
            { isDefault: false }
        );

        // Set this one as default
        paymentMethod.isDefault = true;
        await paymentMethod.save();

        res.json({
            success: true,
            message: 'Default payment method updated',
            data: paymentMethod
        });
    } catch (error) {
        console.error('Error setting default payment method:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating payment method'
        });
    }
});

// Delete payment method
router.delete('/:id', auth, async (req, res) => {
    try {
        const paymentMethod = await PaymentMethod.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!paymentMethod) {
            return res.status(404).json({
                success: false,
                message: 'Payment method not found'
            });
        }

        // Soft delete - mark as inactive
        paymentMethod.isActive = false;
        await paymentMethod.save();

        // If this was the default, set another one as default
        if (paymentMethod.isDefault) {
            const nextPaymentMethod = await PaymentMethod.findOne({
                userId: req.user.id,
                isActive: true,
                _id: { $ne: paymentMethod._id }
            });

            if (nextPaymentMethod) {
                nextPaymentMethod.isDefault = true;
                await nextPaymentMethod.save();
            }
        }

        res.json({
            success: true,
            message: 'Payment method removed successfully'
        });
    } catch (error) {
        console.error('Error deleting payment method:', error);
        res.status(500).json({
            success: false,
            message: 'Error removing payment method'
        });
    }
});

module.exports = router;