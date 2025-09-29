// Counter Animation with Live Data
let isAnimating = false;
let hasAnimated = false; // Track if animation has run once
let liveData = {
    photoSessions: 0,
    awards: 0,
    happyClients: 0,
    teamMembers: 0
};

// Fetch live data from backend
async function fetchLiveStats() {
    try {
        const [usersRes, bookingsRes, contactsRes, galleryRes] = await Promise.all([
            fetch('http://localhost:5000/api/admin/stats/users').catch(() => ({ json: () => ({ count: 0 }) })),
            fetch('http://localhost:5000/api/admin/stats/bookings').catch(() => ({ json: () => ({ count: 0 }) })),
            fetch('http://localhost:5000/api/admin/stats/contacts').catch(() => ({ json: () => ({ count: 0 }) })),
            fetch('http://localhost:5000/api/admin/stats/gallery').catch(() => ({ json: () => ({ count: 0 }) }))
        ]);

        const [usersData, bookingsData, contactsData, galleryData] = await Promise.all([
            usersRes.json().catch(() => ({ count: 0 })),
            bookingsRes.json().catch(() => ({ count: 0 })),
            contactsRes.json().catch(() => ({ count: 0 })),
            galleryRes.json().catch(() => ({ count: 0 }))
        ]);

        // Update live data
        liveData = {
            bookingSessions: bookingsData.count || 0,
            awards: 25, // Static for now
            happyClients: usersData.count || 0,
            teamMembers: 8 // Static for now
        };

        console.log('Live stats fetched:', liveData);
    } catch (error) {
        console.log('Error fetching live stats, using defaults:', error);
        // Use default values if API fails
        liveData = {
            bookingSessions: 15,
            awards: 25,
            happyClients: 50,
            teamMembers: 8
        };
    }
}

function startCountAnimation() {
    if (isAnimating || hasAnimated) return; // Prevent multiple animations and ensure it runs only once
    isAnimating = true;
    
    const counters = document.querySelectorAll('.counter');
    const duration = 2000; // Animation duration in milliseconds
    const steps = 60; // Number of animation steps
    const stepDuration = duration / steps;

    counters.forEach((counter, index) => {
        // Get target value from live data or fallback to data attribute
        let targetValue;
        const statItem = counter.closest('.stat-item');
        
        if (index === 0) targetValue = liveData.bookingSessions;
        else if (index === 1) targetValue = liveData.awards;
        else if (index === 2) targetValue = liveData.happyClients;
        else if (index === 3) targetValue = liveData.teamMembers;
        else targetValue = parseInt(statItem.dataset.count) || 0;
        
        const increment = targetValue / steps;
        let currentValue = 0;
        let step = 0;
        
        // Reset counter to 0
        counter.innerText = '0';
        
        const timer = setInterval(() => {
            step++;
            currentValue = Math.ceil(increment * step);
            
            if (currentValue >= targetValue) {
                counter.innerText = targetValue;
                clearInterval(timer);
                
                // Check if this was the last counter to finish
                const allCounters = document.querySelectorAll('.counter');
                const allFinished = Array.from(allCounters).every(c => {
                    const item = c.closest('.stat-item');
                    const idx = Array.from(allCounters).indexOf(c);
                    let target;
                    if (idx === 0) target = liveData.bookingSessions;
                    else if (idx === 1) target = liveData.awards;
                    else if (idx === 2) target = liveData.happyClients;
                    else if (idx === 3) target = liveData.teamMembers;
                    else target = parseInt(item.dataset.count) || 0;
                    return parseInt(c.innerText) === target;
                });
                
                if (allFinished) {
                    isAnimating = false;
                    hasAnimated = true; // Mark as animated
                }
            } else {
                counter.innerText = currentValue;
            }
        }, stepDuration);
    });
}

// Reset animation state when section goes out of view
function resetAnimation() {
    hasAnimated = false;
    isAnimating = false;
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        counter.innerText = '0';
    });
}

// Intersection Observer to trigger animation when section is in view
const observerOptions = {
    root: null,
    rootMargin: '-20px',
    threshold: 0.5 // Require more of the section to be visible
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(async entry => {
        if (entry.isIntersecting) {
            // Fetch live data before starting animation
            await fetchLiveStats();
            // Start the animation when section comes into view
            startCountAnimation();
        } else {
            // Reset animation when section goes out of view
            resetAnimation();
        }
    });
}, observerOptions);

// Start observing the statistics section
document.addEventListener('DOMContentLoaded', async () => {
    const statsSection = document.querySelector('.statistics-section');
    if (statsSection) {
        // Fetch initial data
        await fetchLiveStats();
        observer.observe(statsSection);
    }
});