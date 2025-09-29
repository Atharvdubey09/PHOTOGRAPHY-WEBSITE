const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    paymentId: {
        type: String,
        required: true,
        unique: true
    },
    transactionId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        default: 'USD',
        required: true
    },
    method: {
        type: String,
        required: true,
        enum: ['card', 'paypal', 'apple', 'google']
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'completed', 'failed', 'refunded', 'cancelled'],
        default: 'pending'
    },
    paymentToken: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    // Card payment specific details (if applicable)
    cardDetails: {
        last4: String,
        cardType: String,
        cardholderName: String
    },
    // Payment breakdown
    isAdvancePayment: {
        type: Boolean,
        default: true
    },
    advancePercentage: {
        type: Number,
        default: 30 // 30% advance payment
    },
    totalBookingAmount: {
        type: Number,
        required: true
    },
    remainingAmount: {
        type: Number,
        required: true
    },
    // Processing details
    processedAt: {
        type: Date,
        default: Date.now
    },
    failureReason: String,
    refundReason: String,
    refundedAt: Date,
    refundAmount: Number,
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
paymentSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Index for efficient queries
paymentSchema.index({ bookingId: 1 });
paymentSchema.index({ userId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ paymentId: 1 });

module.exports = mongoose.model('Payment', paymentSchema);