const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Gallery = require('../models/Gallery');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Upload a new gallery item (Admin only)
router.post('/upload', adminAuth, upload.single('image'), async (req, res) => {
    try {
        console.log('Upload request received:', {
            file: req.file ? req.file.filename : 'No file',
            body: req.body,
            user: req.user
        });
        
        const { title, description, category = 'portfolio' } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        const imageUrl = `/uploads/${req.file.filename}`;
        console.log('Image URL:', imageUrl);

        const galleryItem = new Gallery({
            title: title || req.file.originalname.split('.')[0],
            description: description || 'Uploaded via admin panel',
            category,
            imageUrl
        });

        await galleryItem.save();
        console.log('Gallery item saved:', galleryItem);
        
        res.status(201).json({
            message: 'Image uploaded successfully',
            galleryItem
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(400).json({ message: error.message });
    }
});

// Add a new gallery item (Admin only)
router.post('/', adminAuth, async (req, res) => {
    try {
        const { title, description, category, imageUrl } = req.body;

        const galleryItem = new Gallery({
            title,
            description,
            category: category || 'portfolio',
            imageUrl
        });

        await galleryItem.save();
        res.status(201).json(galleryItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all gallery items
router.get('/', async (req, res) => {
    try {
        const gallery = await Gallery.find().sort({ createdAt: -1 });
        res.json(gallery);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get gallery items by category
router.get('/category/:category', async (req, res) => {
    try {
        const gallery = await Gallery.find({ category: req.params.category }).sort({ createdAt: -1 });
        res.json(gallery);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a gallery item (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
    try {
        const { title, description, category, featured } = req.body;
        const galleryItem = await Gallery.findByIdAndUpdate(
            req.params.id,
            { title, description, category, featured },
            { new: true }
        );
        
        if (!galleryItem) {
            return res.status(404).json({ message: 'Gallery item not found' });
        }
        
        res.json(galleryItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a gallery item (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const galleryItem = await Gallery.findById(req.params.id);
        
        if (!galleryItem) {
            return res.status(404).json({ message: 'Gallery item not found' });
        }
        
        // Delete the image file if it exists locally
        if (galleryItem.imageUrl && galleryItem.imageUrl.startsWith('/uploads/')) {
            const imagePath = path.join(__dirname, '../', galleryItem.imageUrl);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        
        await Gallery.findByIdAndDelete(req.params.id);
        res.json({ message: 'Gallery item deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;