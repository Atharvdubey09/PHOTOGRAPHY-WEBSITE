document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const tabs = document.querySelectorAll('.tab');
    const forms = document.querySelectorAll('.auth-form');
    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');

    // Tab switching functionality
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and forms
            tabs.forEach(t => t.classList.remove('active'));
            forms.forEach(f => f.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding form
            tab.classList.add('active');
            document.getElementById(`${tab.dataset.tab}-form`).classList.add('active');
        });
    });

    // Sign In form submission
    signinForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            email: signinForm.querySelector('[name="email"]').value,
            password: signinForm.querySelector('[name="password"]').value
        };

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                // Store the token and user data
                localStorage.setItem('token', data.token);
                
                // Store user data if provided in response
                if (data.user) {
                    localStorage.setItem('userData', JSON.stringify(data.user));
                }
                
                // Show success message
                alert(`Welcome back, ${data.user ? data.user.name : 'User'}!`);
                
                // Redirect to home page
                window.location.href = 'index.html';
            } else {
                alert(data.message || 'Sign in failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        }
    });

    // Sign Up form submission
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const password = signupForm.querySelector('[name="password"]').value;
        const confirmPassword = signupForm.querySelector('[name="confirm-password"]').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        const formData = {
            name: signupForm.querySelector('[name="name"]').value,
            email: signupForm.querySelector('[name="email"]').value,
            phone: signupForm.querySelector('[name="phone"]').value,
            password: password
        };

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                // Store the token if provided for auto-login
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    
                    // Store user data if provided
                    if (data.user) {
                        localStorage.setItem('userData', JSON.stringify(data.user));
                    }
                    
                    alert(`Welcome, ${data.user ? data.user.name : 'User'}! You are now signed in.`);
                    window.location.href = 'index.html';
                } else {
                    alert('Registration successful! Please sign in with your credentials.');
                    // Switch to sign in tab
                    tabs[0].click();
                }
            } else {
                alert(data.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        }
    });
});