// State management
let selectedSession = null;

// DOM Elements
const bookingForm = document.getElementById('booking-form');
const sessionTypes = document.querySelectorAll('.session-type');
const errorMessages = document.querySelectorAll('.error-message');
const submitButton = document.querySelector('.submit-btn');

// Helper Functions
const showError = (element, message) => {
    const errorElement = element.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
};

const hideError = (element) => {
    const errorElement = element.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.style.display = 'none';
    }
};

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const validatePhone = (phone) => {
    const re = /^\+?[\d\s-]{10,}$/;
    return re.test(phone);
};

const validateForm = () => {
    let isValid = true;

    // Reset all error messages
    errorMessages.forEach(msg => msg.style.display = 'none');

    // Session type validation
    if (!selectedSession) {
        alert('Please select a session type');
        isValid = false;
    }

    // Name validation
    const nameInput = document.getElementById('name');
    if (!nameInput.value.trim()) {
        showError(nameInput, 'Please enter your full name');
        isValid = false;
    } else {
        hideError(nameInput);
    }

    // Email validation
    const emailInput = document.getElementById('email');
    if (!validateEmail(emailInput.value)) {
        showError(emailInput, 'Please enter a valid email address');
        isValid = false;
    } else {
        hideError(emailInput);
    }

    // Phone validation
    const phoneInput = document.getElementById('phone');
    if (!validatePhone(phoneInput.value)) {
        showError(phoneInput, 'Please enter a valid phone number');
        isValid = false;
    } else {
        hideError(phoneInput);
    }

    // Date validation
    const dateInput = document.getElementById('date');
    if (!dateInput.value) {
        showError(dateInput, 'Please select a date');
        isValid = false;
    } else {
        const selectedDate = new Date(dateInput.value);
        const today = new Date();
        if (selectedDate < today) {
            showError(dateInput, 'Please select a future date');
            isValid = false;
        } else {
            hideError(dateInput);
        }
    }

    // Time validation
    const timeInput = document.getElementById('time');
    if (!timeInput.value) {
        showError(timeInput, 'Please select a time slot');
        isValid = false;
    } else {
        hideError(timeInput);
    }

    return isValid;
};

const showSuccessMessage = (booking) => {
    const successHTML = `
        <div class="success-message" style="text-align: center; padding: 40px; background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%); border-radius: 15px; margin: 20px 0;">
            <div class="success-header">
                <h2 style="color: #155724; margin-bottom: 10px;">🎉 Booking Confirmed!</h2>
                <p style="color: #155724; font-size: 1.1em;">Thank you for choosing Studio Pro</p>
            </div>
            
            <div class="booking-details" style="margin: 20px 0; padding: 20px; background: rgba(255,255,255,0.8); border-radius: 10px;">
                <h3 style="color: #333; margin-bottom: 15px;">Session Details</h3>
                <div class="details-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; text-align: left;">
                    <div><strong>Session Type:</strong> ${booking.sessionType}</div>
                    <div><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</div>
                    <div><strong>Time:</strong> ${booking.time}</div>
                    <div><strong>Price:</strong> $${booking.price}</div>
                    <div><strong>Status:</strong> ${booking.status}</div>
                </div>
            </div>

            <div class="success-actions" style="margin-top: 20px;">
                <button onclick="window.location.reload()" style="margin: 5px; padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">Book Another Session</button>
                <button onclick="window.location.href='index.html'" style="margin: 5px; padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">Return to Home</button>
            </div>
        </div>
    `;
    bookingForm.innerHTML = successHTML;
};

// Event Listeners
sessionTypes.forEach(session => {
    session.addEventListener('click', () => {
        sessionTypes.forEach(s => s.classList.remove('selected'));
        session.classList.add('selected');
        selectedSession = session.dataset.type;
    });
});

// Initialize date input min value
const dateInput = document.getElementById('date');
const today = new Date().toISOString().split('T')[0];
dateInput.min = today;

// Silent authentication
const handleAuthentication = async (formData) => {
    try {
        // Try to create a temporary account or get existing one
        const authResponse = await fetch('http://localhost:5000/api/auth/quick-book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: formData.name,
                email: formData.email,
                phone: formData.phone
            })
        });

        const authData = await authResponse.json();
        
        if (authResponse.ok) {
            localStorage.setItem('token', authData.token);
            return authData.token;
        }
        return null;
    } catch (error) {
        console.error('Auth error:', error);
        return null;
    }
};

// Form submission handler
bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    submitButton.disabled = true;
    submitButton.textContent = 'Processing Your Booking...';

    const formData = {
        sessionType: selectedSession,
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        message: document.getElementById('message').value.trim()
    };

    try {
        const response = await fetch('http://localhost:5000/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            // Instead of showing success message, open payment gateway
            openPaymentGateway({
                id: data.booking._id || data.booking.id,
                sessionType: data.booking.sessionType,
                name: data.booking.name,
                email: data.booking.email,
                phone: data.booking.phone,
                date: data.booking.date,
                time: data.booking.time,
                price: data.booking.price,
                message: data.booking.message
            });
        } else {
            throw new Error(data.message || 'Error submitting booking');
        }
    } catch (error) {
        console.error('Error:', error);
        showErrorMessage(error.message || 'An error occurred. Please try again later.');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Book Session';
    }
});

// Update progress step
const updateProgressStep = (step) => {
    const steps = document.querySelectorAll('.progress-step');
    steps.forEach((s, index) => {
        if (index < step) {
            s.classList.add('completed');
            s.classList.remove('current');
        } else if (index === step) {
            s.classList.add('current');
        }
    });
};

// Process additional features
const processAdditionalFeatures = async (formData, token) => {
    try {
        const features = {
            calendarInvite: null,
            photographerDetails: null,
            locationSuggestions: null
        };

        // Generate calendar invite
        const calendarResponse = await fetch('http://localhost:5000/api/bookings/calendar-invite', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });
        features.calendarInvite = await calendarResponse.json();

        // Get photographer details
        const photographerResponse = await fetch('http://localhost:5000/api/bookings/photographer-details', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ sessionType: formData.sessionType })
        });
        features.photographerDetails = await photographerResponse.json();

        // Get location suggestions
        const locationResponse = await fetch('http://localhost:5000/api/bookings/location-suggestions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ sessionType: formData.sessionType })
        });
        features.locationSuggestions = await locationResponse.json();

        return features;
    } catch (error) {
        console.error('Error processing additional features:', error);
        return null;
    }
};

// Show enhanced success message
const showEnhancedSuccessMessage = (booking, features) => {
    const successHTML = `
        <div class="success-message">
            <div class="success-header">
                <h2>Booking Confirmed!</h2>
                <p>Thank you for choosing Studio Pro</p>
            </div>
            
            <div class="booking-details">
                <h3>Session Details</h3>
                <div class="details-grid">
                    <div class="detail-item">
                        <span class="detail-label">Session Type</span>
                        <span class="detail-value">${booking.sessionType}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Date</span>
                        <span class="detail-value">${new Date(booking.date).toLocaleDateString()}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Time</span>
                        <span class="detail-value">${booking.time}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Price</span>
                        <span class="detail-value">$${booking.price}</span>
                    </div>
                </div>
            </div>

            ${features ? `
                <div class="additional-features">
                    <div class="feature-card">
                        <h4>Your Photographer</h4>
                        <img src="${features.photographerDetails.photo}" alt="Photographer">
                        <p>${features.photographerDetails.name}</p>
                        <p class="photographer-bio">${features.photographerDetails.bio}</p>
                    </div>

                    <div class="feature-card">
                        <h4>Suggested Locations</h4>
                        <ul class="location-list">
                            ${features.locationSuggestions.locations.map(loc => `
                                <li>
                                    <strong>${loc.name}</strong>
                                    <p>${loc.description}</p>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>

                <div class="next-steps">
                    <h3>Next Steps</h3>
                    <ul>
                        <li>Check your email for detailed information</li>
                        <li>Add to your calendar using the calendar invite</li>
                        <li>Review suggested locations and prepare for your session</li>
                    </ul>
                </div>
            ` : ''}

            <div class="success-actions">
                <button onclick="window.location.reload()" class="secondary-btn">Book Another Session</button>
                <button onclick="window.location.href='index.html'" class="primary-btn">Return to Home</button>
            </div>
        </div>
    `;
    bookingForm.innerHTML = successHTML;
};

// Show error message
const showErrorMessage = (message) => {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'booking-error';
    errorDiv.innerHTML = `
        <div class="error-content">
            <h3>Oops! Something went wrong</h3>
            <p>${message}</p>
            <button onclick="this.parentElement.remove()" class="error-close">Try Again</button>
        </div>
    `;
    bookingForm.appendChild(errorDiv);
};

// Send confirmation email
const sendConfirmationEmail = async (bookingData) => {
    try {
        const token = localStorage.getItem('token');
        await fetch('http://localhost:5000/api/bookings/confirm-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(bookingData)
        });
    } catch (error) {
        console.error('Error sending confirmation email:', error);
    }
};