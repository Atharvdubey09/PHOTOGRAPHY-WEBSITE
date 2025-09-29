const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['wedding', 'portrait', 'event', 'landscape', 'commercial', 'family', 'portfolio']
    },
    imageUrl: {
        type: String,
        required: true
    },
    description: String,
    featured: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Gallery', gallerySchema);