const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    sessionType: {
        type: String,
        required: true,
        enum: ['portrait', 'event', 'wedding']
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true,
        enum: ['morning', 'afternoon', 'evening']
    },
    message: String,
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    price: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'partial', 'paid', 'refunded'],
        default: 'pending'
    },
    // Payment information
    payments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment'
    }],
    totalAmount: {
        type: Number
    },
    advanceAmount: {
        type: Number,
        default: 0
    },
    remainingAmount: {
        type: Number
    },
    // Event details
    eventDate: {
        type: Date
    },
    eventTime: {
        type: String
    },
    eventType: {
        type: String
    },
    location: {
        type: String,
        default: 'Studio'
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

// Pre-save middleware to calculate remaining amount
bookingSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    
    // Calculate remaining amount
    if (this.totalAmount && this.advanceAmount) {
        this.remainingAmount = this.totalAmount - this.advanceAmount;
    } else if (this.price && this.advanceAmount) {
        this.remainingAmount = this.price - this.advanceAmount;
    }
    
    // Ensure backward compatibility
    if (this.price && !this.totalAmount) {
        this.totalAmount = this.price;
    }
    if (this.date && !this.eventDate) {
        this.eventDate = this.date;
    }
    if (this.time && !this.eventTime) {
        this.eventTime = this.time;
    }
    if (this.sessionType && !this.eventType) {
        this.eventType = this.sessionType;
    }
    
    next();
});

module.exports = mongoose.model('Booking', bookingSchema);