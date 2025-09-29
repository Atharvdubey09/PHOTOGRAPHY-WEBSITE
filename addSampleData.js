const mongoose = require('mongoose');
const User = require('./models/User');
const Booking = require('./models/Booking');
const Payment = require('./models/Payment');
const Contact = require('./models/Contact');

async function addSampleData() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/studio-pro', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB');

        // Clear existing data (optional)
        // await User.deleteMany({});
        // await Booking.deleteMany({});
        // await Payment.deleteMany({});
        // await Contact.deleteMany({});

        // Create sample users
        const users = await User.insertMany([
            {
                name: 'John Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                phone: '+1-555-0101'
            },
            {
                name: 'Jane Smith',
                email: 'jane.smith@example.com',
                password: 'password123',
                phone: '+1-555-0102'
            },
            {
                name: 'Mike Johnson',
                email: 'mike.johnson@example.com',
                password: 'password123',
                phone: '+1-555-0103'
            },
            {
                name: 'Sarah Wilson',
                email: 'sarah.wilson@example.com',
                password: 'password123',
                phone: '+1-555-0104'
            },
            {
                name: 'David Brown',
                email: 'david.brown@example.com',
                password: 'password123',
                phone: '+1-555-0105'
            }
        ]);

        console.log(`Created ${users.length} sample users`);

        // Create sample bookings
        const bookings = await Booking.insertMany([
            {
                userId: users[0]._id,
                name: 'John Doe',
                email: 'john.doe@example.com',
                phone: '+1-555-0101',
                sessionType: 'portrait',
                eventType: 'portrait',
                date: new Date('2025-03-15'),
                eventDate: new Date('2025-03-15'),
                time: 'morning',
                eventTime: 'morning',
                price: 199,
                totalAmount: 199,
                message: 'Professional headshots for LinkedIn',
                status: 'confirmed',
                paymentStatus: 'partial',
                advanceAmount: 59.70,
                location: 'Studio A'
            },
            {
                userId: users[1]._id,
                name: 'Jane Smith',
                email: 'jane.smith@example.com',
                phone: '+1-555-0102',
                sessionType: 'wedding',
                eventType: 'wedding',
                date: new Date('2025-06-20'),
                eventDate: new Date('2025-06-20'),
                time: 'afternoon',
                eventTime: 'afternoon',
                price: 1499,
                totalAmount: 1499,
                message: 'Full wedding coverage including ceremony and reception',
                status: 'confirmed',
                paymentStatus: 'partial',
                advanceAmount: 449.70,
                location: 'Beach Resort'
            },
            {
                userId: users[2]._id,
                name: 'Mike Johnson',
                email: 'mike.johnson@example.com',
                phone: '+1-555-0103',
                sessionType: 'event',
                eventType: 'event',
                date: new Date('2025-04-10'),
                eventDate: new Date('2025-04-10'),
                time: 'evening',
                eventTime: 'evening',
                price: 499,
                totalAmount: 499,
                message: 'Corporate event photography',
                status: 'pending',
                paymentStatus: 'pending',
                advanceAmount: 0,
                location: 'Downtown Hotel'
            },
            {
                userId: users[3]._id,
                name: 'Sarah Wilson',
                email: 'sarah.wilson@example.com',
                phone: '+1-555-0104',
                sessionType: 'portrait',
                eventType: 'portrait',
                date: new Date('2025-02-28'),
                eventDate: new Date('2025-02-28'),
                time: 'afternoon',
                eventTime: 'afternoon',
                price: 199,
                totalAmount: 199,
                message: 'Family portrait session',
                status: 'completed',
                paymentStatus: 'paid',
                advanceAmount: 59.70,
                location: 'Outdoor Park'
            },
            {
                userId: users[4]._id,
                name: 'David Brown',
                email: 'david.brown@example.com',
                phone: '+1-555-0105',
                sessionType: 'event',
                eventType: 'event',
                date: new Date('2025-05-15'),
                eventDate: new Date('2025-05-15'),
                time: 'morning',
                eventTime: 'morning',
                price: 499,
                totalAmount: 499,
                message: 'Birthday party coverage',
                status: 'cancelled',
                paymentStatus: 'refunded',
                advanceAmount: 149.70,
                location: 'Client Home'
            }
        ]);

        console.log(`Created ${bookings.length} sample bookings`);

        // Create sample payments
        const payments = await Payment.insertMany([
            {
                bookingId: bookings[0]._id,
                userId: users[0]._id,
                paymentId: 'pay_1234567890_portrait',
                transactionId: 'txn_portrait_john_doe',
                amount: 59.70,
                currency: 'USD',
                method: 'card',
                status: 'completed',
                paymentToken: 'tok_portrait_advance_payment',
                description: 'Advance payment for portrait session',
                cardDetails: {
                    last4: '4242',
                    cardType: 'visa',
                    cardholderName: 'John Doe'
                },
                isAdvancePayment: true,
                advancePercentage: 30,
                totalBookingAmount: 199,
                remainingAmount: 139.30,
                processedAt: new Date()
            },
            {
                bookingId: bookings[1]._id,
                userId: users[1]._id,
                paymentId: 'pay_1234567891_wedding',
                transactionId: 'txn_wedding_jane_smith',
                amount: 449.70,
                currency: 'USD',
                method: 'paypal',
                status: 'completed',
                paymentToken: 'tok_wedding_advance_payment',
                description: 'Advance payment for wedding package',
                isAdvancePayment: true,
                advancePercentage: 30,
                totalBookingAmount: 1499,
                remainingAmount: 1049.30,
                processedAt: new Date()
            },
            {
                bookingId: bookings[3]._id,
                userId: users[3]._id,
                paymentId: 'pay_1234567892_portrait_full',
                transactionId: 'txn_portrait_sarah_wilson',
                amount: 199,
                currency: 'USD',
                method: 'card',
                status: 'completed',
                paymentToken: 'tok_portrait_full_payment',
                description: 'Full payment for portrait session',
                cardDetails: {
                    last4: '5555',
                    cardType: 'mastercard',
                    cardholderName: 'Sarah Wilson'
                },
                isAdvancePayment: false,
                advancePercentage: 100,
                totalBookingAmount: 199,
                remainingAmount: 0,
                processedAt: new Date()
            },
            {
                bookingId: bookings[4]._id,
                userId: users[4]._id,
                paymentId: 'pay_1234567893_event_refunded',
                transactionId: 'txn_event_david_brown',
                amount: 149.70,
                currency: 'USD',
                method: 'card',
                status: 'refunded',
                paymentToken: 'tok_event_refunded_payment',
                description: 'Advance payment for event (refunded)',
                cardDetails: {
                    last4: '3782',
                    cardType: 'amex',
                    cardholderName: 'David Brown'
                },
                isAdvancePayment: true,
                advancePercentage: 30,
                totalBookingAmount: 499,
                remainingAmount: 349.30,
                refundReason: 'Customer cancelled event due to weather',
                refundAmount: 149.70,
                refundedAt: new Date(),
                processedAt: new Date()
            },
            {
                bookingId: bookings[2]._id,
                userId: users[2]._id,
                paymentId: 'pay_1234567894_event_failed',
                transactionId: 'txn_event_mike_johnson_failed',
                amount: 149.70,
                currency: 'USD',
                method: 'card',
                status: 'failed',
                paymentToken: 'tok_event_failed_payment',
                description: 'Failed payment attempt for event',
                failureReason: 'Insufficient funds',
                isAdvancePayment: true,
                advancePercentage: 30,
                totalBookingAmount: 499,
                remainingAmount: 499,
                processedAt: new Date()
            }
        ]);

        console.log(`Created ${payments.length} sample payments`);

        // Update bookings with payment references
        await Booking.findByIdAndUpdate(bookings[0]._id, { 
            payments: [payments[0]._id] 
        });
        await Booking.findByIdAndUpdate(bookings[1]._id, { 
            payments: [payments[1]._id] 
        });
        await Booking.findByIdAndUpdate(bookings[3]._id, { 
            payments: [payments[2]._id] 
        });
        await Booking.findByIdAndUpdate(bookings[4]._id, { 
            payments: [payments[3]._id] 
        });
        await Booking.findByIdAndUpdate(bookings[2]._id, { 
            payments: [payments[4]._id] 
        });

        // Create sample contacts
        const contacts = await Contact.insertMany([
            {
                name: 'Alex Rodriguez',
                email: 'alex.rodriguez@example.com',
                phone: '+1-555-0201',
                message: 'Interested in wedding photography packages. Could you please send me pricing information?'
            },
            {
                name: 'Emma Thompson',
                email: 'emma.thompson@example.com',
                phone: '+1-555-0202',
                message: 'Looking for professional headshots for my real estate business. What packages do you offer?'
            },
            {
                name: 'Chris Martin',
                email: 'chris.martin@example.com',
                phone: '+1-555-0203',
                message: 'I need event photography for my company\'s annual conference. Please contact me to discuss details.'
            }
        ]);

        console.log(`Created ${contacts.length} sample contacts`);

        console.log('\\n=== Sample Data Summary ===');
        console.log(`Users: ${users.length}`);
        console.log(`Bookings: ${bookings.length}`);
        console.log(`Payments: ${payments.length}`);
        console.log(`Contacts: ${contacts.length}`);
        
        console.log('\\n=== Payment Status Breakdown ===');
        console.log(`Completed: ${payments.filter(p => p.status === 'completed').length}`);
        console.log(`Failed: ${payments.filter(p => p.status === 'failed').length}`);
        console.log(`Refunded: ${payments.filter(p => p.status === 'refunded').length}`);
        
        const totalRevenue = payments
            .filter(p => p.status === 'completed')
            .reduce((sum, p) => sum + p.amount, 0);
        console.log(`Total Revenue: $${totalRevenue.toFixed(2)}`);

        await mongoose.disconnect();
        console.log('\\nSample data created successfully!');

    } catch (error) {
        console.error('Error creating sample data:', error);
        process.exit(1);
    }
}

// Run the script
addSampleData();