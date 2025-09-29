// Simple test endpoint to verify API is working
module.exports = (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'API test endpoint is working',
        timestamp: new Date().toISOString(),
        contact: {
            email: process.env.CONTACT_EMAIL || 'dubeyatharv36@gmail.com',
            phone: process.env.CONTACT_PHONE || '7021763330',
            location: process.env.BUSINESS_LOCATION || 'Mumbai, Maharashtra, India'
        }
    });
};