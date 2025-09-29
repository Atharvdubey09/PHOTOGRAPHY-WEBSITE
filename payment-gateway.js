// Payment Gateway JavaScript
class PaymentGateway {
    constructor() {
        this.currentStep = 1;
        this.selectedPaymentMethod = 'card';
        this.bookingData = null;
        this.paymentToken = null;
        this.advancePercentage = 0.30; // 30% advance payment
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.formatCardInputs();
        this.loadBookingData();
    }

    setupEventListeners() {
        // Close modal when clicking overlay
        document.querySelector('.payment-modal-overlay')?.addEventListener('click', () => {
            this.closePaymentGateway();
        });

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.getElementById('payment-gateway-modal').classList.contains('active')) {
                this.closePaymentGateway();
            }
        });

        // Payment form submission
        document.getElementById('payment-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.processPayment();
        });
    }

    formatCardInputs() {
        const cardNumber = document.getElementById('card-number');
        const cardExpiry = document.getElementById('card-expiry');
        const cardCvv = document.getElementById('card-cvv');
        const billingZip = document.getElementById('billing-zip');

        if (cardNumber) {
            cardNumber.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
                e.target.value = formattedValue;
                this.detectCardType(value);
            });
        }

        if (cardExpiry) {
            cardExpiry.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                e.target.value = value;
            });
        }

        if (cardCvv) {
            cardCvv.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
            });
        }

        if (billingZip) {
            billingZip.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
            });
        }
    }

    detectCardType(cardNumber) {
        const cardIcons = document.querySelectorAll('.card-icons i');
        cardIcons.forEach(icon => icon.style.color = '#ccc');

        if (cardNumber.startsWith('4')) {
            document.querySelector('.fa-cc-visa').style.color = '#1a1f71';
        } else if (cardNumber.startsWith('5') || cardNumber.startsWith('2')) {
            document.querySelector('.fa-cc-mastercard').style.color = '#eb001b';
        } else if (cardNumber.startsWith('3')) {
            document.querySelector('.fa-cc-amex').style.color = '#006fcf';
        }
    }

    loadBookingData() {
        // Get booking data from session storage or URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const bookingId = urlParams.get('booking');
        
        if (bookingId) {
            this.fetchBookingData(bookingId);
        } else {
            // Use demo data for testing
            this.bookingData = {
                id: 'BOOK-' + Date.now(),
                sessionType: 'portrait',
                name: 'John Doe',
                email: 'john.doe@example.com',
                phone: '+1-234-567-8900',
                date: '2025-02-15',
                time: 'morning',
                price: 199,
                message: 'Looking forward to the session!'
            };
            this.populateBookingDetails();
        }
    }

    async fetchBookingData(bookingId) {
        try {
            const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                this.bookingData = await response.json();
                this.populateBookingDetails();
            } else {
                throw new Error('Failed to load booking data');
            }
        } catch (error) {
            console.error('Error fetching booking data:', error);
            this.showError('Failed to load booking information');
        }
    }

    populateBookingDetails() {
        if (!this.bookingData) return;

        const sessionTypeTitles = {
            portrait: 'Portrait Session',
            event: 'Event Coverage',
            wedding: 'Wedding Package'
        };

        const sessionTitle = sessionTypeTitles[this.bookingData.sessionType] || 'Photography Session';
        const totalAmount = this.bookingData.price;
        const advanceAmount = Math.round(totalAmount * this.advancePercentage * 100) / 100;
        const remainingAmount = Math.round((totalAmount - advanceAmount) * 100) / 100;

        // Update booking details
        document.getElementById('booking-details').innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div><strong>Name:</strong> ${this.bookingData.name}</div>
                <div><strong>Email:</strong> ${this.bookingData.email}</div>
                <div><strong>Phone:</strong> ${this.bookingData.phone}</div>
                <div><strong>Date:</strong> ${new Date(this.bookingData.date).toLocaleDateString()}</div>
                <div><strong>Time:</strong> ${this.bookingData.time}</div>
                <div><strong>Booking ID:</strong> ${this.bookingData.id || 'BOOK-' + Date.now()}</div>
            </div>
            ${this.bookingData.message ? `<div style="margin-top: 1rem;"><strong>Special Requests:</strong><br>${this.bookingData.message}</div>` : ''}
        `;

        // Update payment summary
        document.getElementById('session-type-display').textContent = sessionTitle;
        document.getElementById('total-amount').textContent = `$${totalAmount.toFixed(2)}`;
        document.getElementById('advance-amount').textContent = `$${advanceAmount.toFixed(2)}`;
        document.getElementById('remaining-amount').textContent = `$${remainingAmount.toFixed(2)}`;

        // Update all payment amount displays
        document.querySelectorAll('#paypal-amount, #apple-amount, #google-amount, #pay-amount').forEach(elem => {
            elem.textContent = `$${advanceAmount.toFixed(2)}`;
        });
    }

    openPaymentGateway(bookingData = null) {
        if (bookingData) {
            this.bookingData = bookingData;
            this.populateBookingDetails();
        }
        
        document.getElementById('payment-gateway-modal').classList.add('active');
        document.body.style.overflow = 'hidden';
        this.goToStep(1);
    }

    closePaymentGateway() {
        document.getElementById('payment-gateway-modal').classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    goToStep(step) {
        // Hide all steps
        document.querySelectorAll('.payment-step').forEach(stepElem => {
            stepElem.style.display = 'none';
        });

        // Show current step
        document.getElementById(`step-${step}`).style.display = 'block';

        // Update progress
        document.querySelectorAll('.progress-step').forEach((stepElem, index) => {
            stepElem.classList.remove('active', 'completed');
            if (index + 1 === step) {
                stepElem.classList.add('active');
            } else if (index + 1 < step) {
                stepElem.classList.add('completed');
            }
        });

        this.currentStep = step;
    }

    selectPaymentMethod(method) {
        this.selectedPaymentMethod = method;

        // Update tabs
        document.querySelectorAll('.payment-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-method="${method}"]`).classList.add('active');

        // Show/hide payment forms
        document.querySelectorAll('.payment-form-container').forEach(form => {
            form.style.display = 'none';
        });
        document.getElementById(`${method}-form`).style.display = 'block';

        // Update button text
        const button = document.getElementById('process-payment-btn');
        const methodNames = {
            card: 'Pay Securely',
            paypal: 'Pay with PayPal',
            apple: 'Pay with Apple Pay',
            google: 'Pay with Google Pay'
        };
        
        button.innerHTML = `
            <i class="fas fa-lock"></i>
            ${methodNames[method]}
            <span class="amount-display">${document.getElementById('advance-amount').textContent}</span>
        `;
    }

    validateCardForm() {
        const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
        const cardName = document.getElementById('card-name').value.trim();
        const cardExpiry = document.getElementById('card-expiry').value;
        const cardCvv = document.getElementById('card-cvv').value;
        const billingZip = document.getElementById('billing-zip').value;

        const errors = [];

        if (!cardNumber || cardNumber.length < 13) {
            errors.push('Please enter a valid card number');
        }

        if (!cardName) {
            errors.push('Please enter the cardholder name');
        }

        if (!cardExpiry || !cardExpiry.match(/^\d{2}\/\d{2}$/)) {
            errors.push('Please enter a valid expiry date (MM/YY)');
        }

        if (!cardCvv || cardCvv.length < 3) {
            errors.push('Please enter a valid CVV');
        }

        if (!billingZip || billingZip.length < 5) {
            errors.push('Please enter a valid billing ZIP code');
        }

        // Check expiry date is not in the past
        if (cardExpiry) {
            const [month, year] = cardExpiry.split('/');
            const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
            const now = new Date();
            if (expiryDate < now) {
                errors.push('Card has expired');
            }
        }

        return errors;
    }

    async processPayment() {
        const button = document.getElementById('process-payment-btn');
        const originalText = button.innerHTML;

        try {
            // Show processing state
            this.showProcessing(true);
            button.disabled = true;

            let paymentData = {
                bookingId: this.bookingData.id || 'BOOK-' + Date.now(),
                amount: Math.round(this.bookingData.price * this.advancePercentage * 100) / 100,
                paymentMethod: this.selectedPaymentMethod,
                currency: 'USD',
                description: `Advance payment for ${this.bookingData.sessionType} session`
            };

            if (this.selectedPaymentMethod === 'card') {
                // Validate card form
                const errors = this.validateCardForm();
                if (errors.length > 0) {
                    this.showProcessing(false);
                    button.disabled = false;
                    button.innerHTML = originalText;
                    this.showError(errors.join('\n'));
                    return;
                }

                // Add card details
                paymentData.cardDetails = {
                    number: document.getElementById('card-number').value.replace(/\s/g, ''),
                    name: document.getElementById('card-name').value.trim(),
                    expiry: document.getElementById('card-expiry').value,
                    cvv: document.getElementById('card-cvv').value,
                    billingZip: document.getElementById('billing-zip').value,
                    saveCard: document.getElementById('save-card').checked
                };
            }

            // Process payment
            const response = await fetch('http://localhost:5000/api/payments/process', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(paymentData)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                this.paymentToken = result.paymentToken;
                await this.updateBookingStatus();
                this.showPaymentSuccess(result);
            } else {
                throw new Error(result.message || 'Payment processing failed');
            }

        } catch (error) {
            console.error('Payment error:', error);
            this.showError(error.message || 'Payment processing failed. Please try again.');
            this.showProcessing(false);
            button.disabled = false;
            button.innerHTML = originalText;
        }
    }

    async updateBookingStatus() {
        try {
            const response = await fetch(`http://localhost:5000/api/bookings/${this.bookingData.id}/payment`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    paymentToken: this.paymentToken,
                    advanceAmount: Math.round(this.bookingData.price * this.advancePercentage * 100) / 100,
                    status: 'confirmed'
                })
            });

            if (!response.ok) {
                console.error('Failed to update booking status');
            }
        } catch (error) {
            console.error('Error updating booking status:', error);
        }
    }

    showPaymentSuccess(paymentResult) {
        this.showProcessing(false);
        
        // Populate confirmation details
        document.getElementById('confirmation-details').innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                <div><strong>Booking ID:</strong> ${this.bookingData.id}</div>
                <div><strong>Payment ID:</strong> ${paymentResult.paymentId}</div>
                <div><strong>Amount Paid:</strong> $${paymentResult.amount}</div>
                <div><strong>Payment Method:</strong> ${this.selectedPaymentMethod.toUpperCase()}</div>
                <div><strong>Status:</strong> <span style="color: #4CAF50;">Confirmed</span></div>
                <div><strong>Date:</strong> ${new Date().toLocaleDateString()}</div>
            </div>
            <div style="background: rgba(76, 175, 80, 0.1); padding: 1rem; border-radius: 10px; border: 1px solid rgba(76, 175, 80, 0.2);">
                <strong>What's Next?</strong><br>
                • You will receive a confirmation email shortly<br>
                • We will contact you 24 hours before your session<br>
                • Remaining balance ($${(this.bookingData.price - paymentResult.amount).toFixed(2)}) will be collected on the day<br>
                • Please arrive 15 minutes early for your session
            </div>
        `;

        this.goToStep(3);
    }

    showProcessing(show) {
        const processingOverlay = document.getElementById('payment-processing');
        processingOverlay.style.display = show ? 'flex' : 'none';
    }

    showError(message) {
        alert(message); // Simple alert for now, can be enhanced with custom modal
    }

    // Method to handle alternative payment methods
    async processAlternativePayment(method) {
        try {
            this.showProcessing(true);

            const response = await fetch(`http://localhost:5000/api/payments/${method}/init`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    bookingId: this.bookingData.id,
                    amount: Math.round(this.bookingData.price * this.advancePercentage * 100) / 100
                })
            });

            const result = await response.json();

            if (response.ok && result.redirectUrl) {
                // Redirect to payment provider
                window.location.href = result.redirectUrl;
            } else {
                throw new Error(result.message || 'Failed to initialize payment');
            }

        } catch (error) {
            console.error('Alternative payment error:', error);
            this.showError(error.message || 'Payment initialization failed');
            this.showProcessing(false);
        }
    }
}

// Global functions for HTML event handlers
window.openPaymentGateway = function(bookingData) {
    if (!window.paymentGateway) {
        window.paymentGateway = new PaymentGateway();
    }
    window.paymentGateway.openPaymentGateway(bookingData);
};

window.closePaymentGateway = function() {
    if (window.paymentGateway) {
        window.paymentGateway.closePaymentGateway();
    }
};

window.goToStep = function(step) {
    if (window.paymentGateway) {
        window.paymentGateway.goToStep(step);
    }
};

window.selectPaymentMethod = function(method) {
    if (window.paymentGateway) {
        window.paymentGateway.selectPaymentMethod(method);
    }
};

window.processPayment = function() {
    if (window.paymentGateway) {
        if (window.paymentGateway.selectedPaymentMethod === 'card') {
            window.paymentGateway.processPayment();
        } else {
            window.paymentGateway.processAlternativePayment(window.paymentGateway.selectedPaymentMethod);
        }
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if this is a payment gateway page or if payment gateway is needed
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'true' || window.location.pathname.includes('payment')) {
        window.paymentGateway = new PaymentGateway();
        
        // Auto-open if booking parameter exists
        if (urlParams.get('booking')) {
            window.paymentGateway.openPaymentGateway();
        }
    }
});