const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['visa', 'mastercard', 'amex', 'discover']
    },
    last4: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 4
    },
    cardholderName: {
        type: String,
        required: true
    },
    expiryMonth: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 2
    },
    expiryYear: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 2
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    // In production, you would store encrypted payment token from payment processor
    // Never store actual card numbers, CVV, or sensitive data
    paymentToken: {
        type: String,
        required: false // For demo purposes
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Ensure only one default payment method per user
paymentMethodSchema.pre('save', async function(next) {
    if (this.isDefault) {
        await mongoose.model('PaymentMethod').updateMany(
            { userId: this.userId, _id: { $ne: this._id } },
            { isDefault: false }
        );
    }
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('PaymentMethod', paymentMethodSchema);