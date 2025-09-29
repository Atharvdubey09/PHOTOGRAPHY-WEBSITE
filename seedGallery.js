const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Gallery = require('./models/Gallery');

// Load environment variables
dotenv.config();

// AI-generated photography images from Unsplash for Studio Pro
const aiGeneratedImages = [
    {
        title: "Elegant Wedding Portrait",
        description: "Beautiful wedding photography capturing the perfect moment",
        category: "wedding",
        imageUrl: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&h=600&fit=crop&crop=faces",
        featured: true
    },
    {
        title: "Professional Headshot",
        description: "Corporate portrait photography with professional lighting",
        category: "portrait", 
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=faces",
        featured: true
    },
    {
        title: "Wedding Ceremony Moments",
        description: "Candid wedding ceremony photography",
        category: "wedding",
        imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=600&fit=crop&crop=center"
    },
    {
        title: "Fashion Portrait Session",
        description: "High-fashion portrait photography with dramatic lighting",
        category: "portrait",
        imageUrl: "https://images.unsplash.com/photo-1494790108755-2616c9d80e7b?w=800&h=600&fit=crop&crop=faces"
    },
    {
        title: "Corporate Event Coverage",
        description: "Professional event photography for business occasions",
        category: "event",
        imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop&crop=center"
    },
    {
        title: "Family Portrait Session",
        description: "Warm family photography in natural lighting",
        category: "family",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center"
    },
    {
        title: "Sunset Landscape",
        description: "Stunning landscape photography at golden hour",
        category: "landscape",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center"
    },
    {
        title: "Wedding Reception Dance",
        description: "Dynamic wedding reception photography",
        category: "wedding",
        imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop&crop=center"
    },
    {
        title: "Professional Business Portrait",
        description: "Executive portrait photography for corporate use",
        category: "portrait",
        imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=600&fit=crop&crop=faces"
    },
    {
        title: "Product Photography",
        description: "Commercial product photography with clean styling",
        category: "commercial",
        imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&crop=center"
    },
    {
        title: "Nature Portrait",
        description: "Portrait session in natural outdoor setting",
        category: "portrait",
        imageUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=600&fit=crop&crop=faces"
    },
    {
        title: "Wedding Details",
        description: "Artistic wedding detail photography",
        category: "wedding",
        imageUrl: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop&crop=center"
    },
    {
        title: "Urban Landscape",
        description: "Cityscape photography with architectural elements",
        category: "landscape",
        imageUrl: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=800&h=600&fit=crop&crop=center"
    },
    {
        title: "Event Photography",
        description: "Professional conference and seminar photography",
        category: "event",
        imageUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop&crop=center"
    },
    {
        title: "Maternity Portrait",
        description: "Beautiful maternity photography session",
        category: "family",
        imageUrl: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&h=600&fit=crop&crop=center"
    }
];

async function seedGallery() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to MongoDB');

        // Clear existing gallery items
        await Gallery.deleteMany({});
        console.log('Cleared existing gallery items');

        // Insert AI-generated images
        await Gallery.insertMany(aiGeneratedImages);
        console.log(`Successfully seeded ${aiGeneratedImages.length} gallery items`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding gallery:', error);
        process.exit(1);
    }
}

seedGallery();