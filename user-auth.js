// Simplified User Authentication and Header Management
document.addEventListener('DOMContentLoaded', function() {
    initializeUserState();
    initializeHeader();
});

// Initialize user authentication state
function initializeUserState() {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    
    if (token) {
        if (userData) {
            // Use stored user data first for immediate UI update
            try {
                const user = JSON.parse(userData);
                showUserLoggedIn(user);
            } catch (e) {
                console.error('Error parsing stored user data:', e);
            }
        }
        // Then verify token is still valid and refresh user data
        checkAuthStatus();
    } else {
        showUserLoggedOut();
    }
}

// Check authentication status
async function checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (!token) {
        showUserLoggedOut();
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/auth/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const userData = await response.json();
            // Update stored user data
            localStorage.setItem('userData', JSON.stringify(userData));
            showUserLoggedIn(userData);
        } else {
            // Token is invalid, remove it and show logged out state
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
            showUserLoggedOut();
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
        // Keep existing state if network error, but show logged out if no stored data
        const userData = localStorage.getItem('userData');
        if (!userData) {
            showUserLoggedOut();
        }
    }
}

// Show user logged in state
function showUserLoggedIn(userData) {
    const userStatus = document.getElementById('user-status');
    const userGreeting = document.getElementById('user-greeting');

    if (userStatus && userGreeting) {
        // Update greeting with user name
        userGreeting.textContent = `Welcome, ${userData.name || 'User'}!`;

        // Show user status
        userStatus.style.display = 'flex';
    }
}

// Show user logged out state
function showUserLoggedOut() {
    const userStatus = document.getElementById('user-status');

    if (userStatus) {
        // Hide user status
        userStatus.style.display = 'none';
    }
}

// Logout function
function logout() {
    // Clear all stored data
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    
    // Show logged out state
    showUserLoggedOut();
    
    // Redirect to home page if not already there
    if (window.location.pathname !== '/index.html' && window.location.pathname !== '/') {
        window.location.href = 'index.html';
    }
    
    // Show success message
    setTimeout(() => {
        alert('You have been signed out successfully!');
    }, 100);
}

// Initialize Payment Methods functionality
function initializePaymentMethods() {
    // Create payment modal if it doesn't exist
    if (!document.getElementById('payment-modal')) {
        createPaymentModal();
    }
    
    // Add event listener to payment methods link
    document.addEventListener('click', function(e) {
        if (e.target.id === 'payment-methods-link' || e.target.closest('#payment-methods-link')) {
            e.preventDefault();
            const token = localStorage.getItem('token');
            if (token) {
                openPaymentModal();
            } else {
                alert('Please sign in to manage payment methods.');
                window.location.href = 'auth.html';
            }
        }
    });
}

// Create Payment Modal
function createPaymentModal() {
    const modalHTML = `
        <div id="payment-modal" class="payment-modal">
            <div class="payment-modal-content">
                <div class="payment-modal-header">
                    <h2><i class="fas fa-credit-card"></i> Payment Methods</h2>
                    <span class="payment-modal-close" onclick="closePaymentModal()">&times;</span>
                </div>
                
                <div class="payment-modal-body">
                    <div class="payment-methods-container">
                        <div class="payment-methods-list" id="payment-methods-list">
                            <!-- Payment methods will be loaded here -->
                        </div>
                        
                        <div class="add-payment-section">
                            <button class="add-payment-btn" onclick="showAddPaymentForm()">
                                <i class="fas fa-plus"></i> Add New Payment Method
                            </button>
                        </div>
                        
                        <div class="add-payment-form" id="add-payment-form" style="display: none;">
                            <h3>Add New Card</h3>
                            <form id="payment-form">
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Card Number</label>
                                        <input type="text" id="card-number" placeholder="1234 5678 9012 3456" maxlength="19" required>
                                    </div>
                                    <div class="form-group">
                                        <label>Cardholder Name</label>
                                        <input type="text" id="card-name" placeholder="John Doe" required>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Expiry Date</label>
                                        <input type="text" id="card-expiry" placeholder="MM/YY" maxlength="5" required>
                                    </div>
                                    <div class="form-group">
                                        <label>CVV</label>
                                        <input type="text" id="card-cvv" placeholder="123" maxlength="4" required>
                                    </div>
                                </div>
                                <div class="form-actions">
                                    <button type="button" onclick="hideAddPaymentForm()" class="btn-secondary">Cancel</button>
                                    <button type="submit" class="btn-primary">
                                        <i class="fas fa-save"></i> Save Card
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add form event listener
    document.getElementById('payment-form').addEventListener('submit', handleAddPayment);
    
    // Add input formatting
    formatPaymentInputs();
}

// Format payment inputs
function formatPaymentInputs() {
    const cardNumber = document.getElementById('card-number');
    const cardExpiry = document.getElementById('card-expiry');
    const cardCvv = document.getElementById('card-cvv');
    
    if (cardNumber) {
        cardNumber.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }
    
    if (cardExpiry) {
        cardExpiry.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
    
    if (cardCvv) {
        cardCvv.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
    }
}

// Open Payment Modal
function openPaymentModal() {
    const modal = document.getElementById('payment-modal');
    if (modal) {
        modal.style.display = 'flex';
        loadPaymentMethods();
        document.body.style.overflow = 'hidden';
    }
}

// Close Payment Modal
function closePaymentModal() {
    const modal = document.getElementById('payment-modal');
    if (modal) {
        modal.style.display = 'none';
        hideAddPaymentForm();
        document.body.style.overflow = 'auto';
    }
}

// Load Payment Methods
function loadPaymentMethods() {
    const container = document.getElementById('payment-methods-list');
    if (!container) return;
    
    const token = localStorage.getItem('token');
    if (!token) {
        container.innerHTML = '<p class="text-center">Please log in to view payment methods.</p>';
        return;
    }
    
    // Show loading state
    container.innerHTML = '<div class="text-center"><i class="fas fa-spinner fa-spin"></i> Loading payment methods...</div>';
    
    // Fetch from backend
    fetch('http://localhost:5000/api/payments', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.data.length > 0) {
            container.innerHTML = data.data.map(card => `
                <div class="payment-method-card ${card.isDefault ? 'default' : ''}">
                    <div class="card-info">
                        <div class="card-icon">
                            <i class="fab fa-cc-${card.type}"></i>
                        </div>
                        <div class="card-details">
                            <div class="card-number">**** **** **** ${card.last4}</div>
                            <div class="card-meta">
                                <span class="card-holder">${card.cardholderName}</span>
                                <span class="card-expiry">Expires ${card.expiryMonth}/${card.expiryYear}</span>
                            </div>
                        </div>
                    </div>
                    <div class="card-actions">
                        ${card.isDefault ? '<span class="default-badge">Default</span>' : '<button onclick="setDefaultCard(\'' + card._id + '\')" class="btn-text">Set Default</button>'}
                        <button onclick="removeCard('${card._id}')" class="btn-text text-danger">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = `
                <div class="text-center" style="padding: 2rem; color: #666;">
                    <i class="fas fa-credit-card" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                    <p>No payment methods added yet.</p>
                    <p>Add your first payment method to get started.</p>
                </div>
            `;
        }
    })
    .catch(error => {
        console.error('Error loading payment methods:', error);
        container.innerHTML = `
            <div class="text-center" style="padding: 2rem; color: #666;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem; color: #e74c3c;"></i>
                <p>Error loading payment methods.</p>
                <button onclick="loadPaymentMethods()" class="btn-text">Try Again</button>
            </div>
        `;
    });
}

// Show Add Payment Form
function showAddPaymentForm() {
    const form = document.getElementById('add-payment-form');
    if (form) {
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth' });
    }
}

// Hide Add Payment Form
function hideAddPaymentForm() {
    const form = document.getElementById('add-payment-form');
    if (form) {
        form.style.display = 'none';
        form.querySelector('form').reset();
    }
}

// Handle Add Payment
function handleAddPayment(e) {
    e.preventDefault();
    
    const cardNumber = document.getElementById('card-number').value;
    const cardName = document.getElementById('card-name').value;
    const cardExpiry = document.getElementById('card-expiry').value;
    const cardCvv = document.getElementById('card-cvv').value;
    
    // Basic validation
    if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
        alert('Please fill in all fields.');
        return;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in to add payment methods.');
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
    submitBtn.disabled = true;
    
    // Send to backend
    fetch('http://localhost:5000/api/payments', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            cardNumber: cardNumber,
            cardholderName: cardName,
            expiryDate: cardExpiry,
            cvv: cardCvv,
            isDefault: false
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Payment method added successfully!');
            hideAddPaymentForm();
            loadPaymentMethods(); // Refresh the list
        } else {
            alert(data.message || 'Failed to add payment method.');
        }
    })
    .catch(error => {
        console.error('Error adding payment method:', error);
        alert('Error adding payment method. Please try again.');
    })
    .finally(() => {
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
}

// Set Default Card
function setDefaultCard(cardId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in to manage payment methods.');
        return;
    }
    
    fetch(`http://localhost:5000/api/payments/${cardId}/default`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Default payment method updated successfully!');
            loadPaymentMethods(); // Refresh the list
        } else {
            alert(data.message || 'Failed to update default payment method.');
        }
    })
    .catch(error => {
        console.error('Error setting default card:', error);
        alert('Error updating payment method. Please try again.');
    });
}

// Remove Card
function removeCard(cardId) {
    if (!confirm('Are you sure you want to remove this payment method?')) {
        return;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in to manage payment methods.');
        return;
    }
    
    fetch(`http://localhost:5000/api/payments/${cardId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Payment method removed successfully!');
            loadPaymentMethods(); // Refresh the list
        } else {
            alert(data.message || 'Failed to remove payment method.');
        }
    })
    .catch(error => {
        console.error('Error removing card:', error);
        alert('Error removing payment method. Please try again.');
    });
}

// Initialize header functionality
function initializeHeader() {
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('.nav-menu a[href^=\"#\"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
                
                // Close mobile menu if open
                if (navMenu) {
                    navMenu.classList.remove('active');
                }
                if (mobileMenuToggle) {
                    mobileMenuToggle.classList.remove('active');
                }
            }
        });
    });

    // Header scroll effect
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (header) {
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                header.style.transform = 'translateY(0)';
            }
            
            // Add/remove scrolled class
            if (scrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        
        lastScrollTop = scrollTop;
    });
}

// Service quote button functionality
function initializeServiceQuoteButtons() {
    const quoteButtons = document.querySelectorAll('.get-quote-btn, .service-btn.primary');
    
    quoteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get service information
            const serviceCard = this.closest('.service-detailed-card, .service-card');
            const serviceName = serviceCard ? serviceCard.querySelector('h3').textContent : 'General Inquiry';
            
            // Store service info for contact form
            sessionStorage.setItem('selectedService', serviceName);
            
            // Navigate to contact page
            if (window.location.pathname.includes('services.html')) {
                window.location.href = 'index.html#contact';
            } else {
                // Scroll to contact section if on index page
                const contactSection = document.querySelector('#contact');
                if (contactSection) {
                    contactSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Pre-fill service field if available
                    setTimeout(() => {
                        const serviceSelect = document.querySelector('#contact select[name=\"service\"]');
                        if (serviceSelect) {
                            const option = Array.from(serviceSelect.options).find(opt => 
                                opt.textContent.toLowerCase().includes(serviceName.toLowerCase())
                            );
                            if (option) {
                                serviceSelect.value = option.value;
                            }
                        }
                    }, 500);
                }
            }
        });
    });
}

// Initialize service buttons when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeServiceQuoteButtons);

// Re-initialize when navigating to services page
window.addEventListener('load', initializeServiceQuoteButtons);