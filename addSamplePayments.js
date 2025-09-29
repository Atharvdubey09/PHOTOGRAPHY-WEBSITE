const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const PaymentMethod = require('./models/PaymentMethod');

// Load environment variables
dotenv.config();

async function addSamplePaymentMethods() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to MongoDB');

        // Find test user
        const testUser = await User.findOne({ email: 'test@example.com' });
        if (!testUser) {
            console.log('Test user not found. Please run createTestUser.js first.');
            process.exit(1);
        }

        // Check if payment methods already exist
        const existingPayments = await PaymentMethod.find({ userId: testUser._id });
        if (existingPayments.length > 0) {
            console.log('Sample payment methods already exist');
            process.exit(0);
        }

        // Create sample payment methods
        const samplePayments = [
            {
                userId: testUser._id,
                type: 'visa',
                last4: '4567',
                cardholderName: 'John Doe',
                expiryMonth: '12',
                expiryYear: '25',
                isDefault: true,
                paymentToken: 'tok_sample_visa_4567'
            },
            {
                userId: testUser._id,
                type: 'mastercard',
                last4: '8901',
                cardholderName: 'John Doe',
                expiryMonth: '06',
                expiryYear: '26',
                isDefault: false,
                paymentToken: 'tok_sample_mc_8901'
            }
        ];

        await PaymentMethod.insertMany(samplePayments);
        console.log('Sample payment methods created successfully!');
        console.log('Test user now has 2 payment methods available.');

        process.exit(0);
    } catch (error) {
        console.error('Error creating sample payment methods:', error);
        process.exit(1);
    }
}

addSamplePaymentMethods();