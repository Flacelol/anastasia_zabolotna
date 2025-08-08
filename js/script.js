// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    if (hamburger && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
}));

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu || !hamburger) return;
    
    const isClickInsideNav = navMenu.contains(e.target);
    const isClickOnHamburger = hamburger.contains(e.target);
    
    if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Prevent menu from closing when clicking inside it
if (navMenu) {
    navMenu.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll


// Active navigation link highlighting
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.method-card, .gallery-item, .contact-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Gallery item click handlers (placeholder for future media integration)
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
        // Placeholder for opening media in modal/lightbox
        console.log('Gallery item clicked - implement media viewer here');
    });
});

// Contact form validation (if you add a contact form later)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Social media link tracking (optional analytics)
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const platform = e.currentTarget.classList.contains('facebook') ? 'Facebook' : 'Instagram';
        console.log(`Social media click: ${platform}`);
        // Add analytics tracking here if needed
    });
});

// Lazy loading for images (when you add real images)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is loaded
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Smooth reveal animation for hero section
window.addEventListener('load', () => {
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    
    heroContent.style.opacity = '1';
    heroContent.style.transform = 'translateX(0)';
    heroImage.style.opacity = '1';
    heroImage.style.transform = 'translateX(0)';
});

// Initialize hero animations
document.addEventListener('DOMContentLoaded', () => {
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateX(-50px)';
    heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
    
    heroImage.style.opacity = '0';
    heroImage.style.transform = 'translateX(50px)';
    heroImage.style.transition = 'opacity 1s ease, transform 1s ease';
});


// Booking Management System
class BookingManager {
    constructor() {
        this.storageKey = 'psychologist_bookings';
        this.bookings = this.loadBookings();
    }
    
    loadBookings() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.error('Error loading bookings:', error);
            return {};
        }
    }
    
    saveBookings() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.bookings));
            return true;
        } catch (error) {
            console.error('Error saving bookings:', error);
            return false;
        }
    }
    
    isTimeBooked(date, time) {
        const dateKey = date;
        return this.bookings[dateKey] && this.bookings[dateKey].includes(time);
    }
    
    addBooking(date, time, clientData) {
        if (this.isTimeBooked(date, time)) {
            return false; // Time already booked
        }
        
        if (!this.bookings[date]) {
            this.bookings[date] = [];
        }
        
        this.bookings[date].push(time);
        
        // Also save client data for reference (optional)
        const bookingKey = `${date}_${time}`;
        const clientBookings = JSON.parse(localStorage.getItem('client_bookings') || '{}');
        clientBookings[bookingKey] = {
            ...clientData,
            bookedAt: new Date().toISOString()
        };
        localStorage.setItem('client_bookings', JSON.stringify(clientBookings));
        
        return this.saveBookings();
    }
    
    removeBooking(date, time) {
        if (this.bookings[date]) {
            this.bookings[date] = this.bookings[date].filter(t => t !== time);
            if (this.bookings[date].length === 0) {
                delete this.bookings[date];
            }
            
            // Remove client data
            const bookingKey = `${date}_${time}`;
            const clientBookings = JSON.parse(localStorage.getItem('client_bookings') || '{}');
            delete clientBookings[bookingKey];
            localStorage.setItem('client_bookings', JSON.stringify(clientBookings));
            
            return this.saveBookings();
        }
        return false;
    }
    
    getAvailableTimes(date) {
        const allTimes = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
        const bookedTimes = this.bookings[date] || [];
        return allTimes.filter(time => !bookedTimes.includes(time));
    }
    
    clearAllBookings() {
        this.bookings = {};
        localStorage.removeItem('client_bookings');
        return this.saveBookings();
    }
}

// Initialize booking manager
const bookingManager = new BookingManager();

// Form handling
document.addEventListener('DOMContentLoaded', () => {
    const appointmentForm = document.getElementById('appointmentForm');
    const dateInput = document.getElementById('date');
    const timeSelect = document.getElementById('time');
    const formMessage = document.getElementById('formMessage');
    
    // Set minimum date to today
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    dateInput.min = formattedToday;
    
    // Update available times when date changes
    function updateAvailableTimes() {
        const selectedDate = dateInput.value;
        if (!selectedDate) return;
        
        const availableTimes = bookingManager.getAvailableTimes(selectedDate);
        
        // Clear current options except the first one
        timeSelect.innerHTML = '<option value="">Оберіть час</option>';
        
        // Add available times
        availableTimes.forEach(time => {
            const option = document.createElement('option');
            option.value = time;
            option.textContent = time;
            timeSelect.appendChild(option);
        });
        
        // Show message if no times available
        if (availableTimes.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'Немає вільного часу на цю дату';
            option.disabled = true;
            timeSelect.appendChild(option);
        }
    }
    
    // Event listeners
    dateInput.addEventListener('change', updateAvailableTimes);
    
    // Form submission
    appointmentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const selectedDate = formData.get('date');
        const selectedTime = formData.get('time');
        
        // Check if time is still available
        if (bookingManager.isTimeBooked(selectedDate, selectedTime)) {
            showMessage('Вибачте, цей час вже зайнятий. Будь ласка, оберіть інший час.', 'error');
            updateAvailableTimes(); // Refresh available times
            return;
        }
        
        // Prepare client data
        const clientData = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            sessionType: formData.get('sessionType'),
            message: formData.get('message')
        };
        
        // Disable submit button
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Відправляємо...';
        
        // Prepare template parameters for EmailJS
        const templateParams = {
            from_name: clientData.name,
            from_email: clientData.email,
            phone: clientData.phone,
            date: selectedDate,
            time: selectedTime,
            session_type: clientData.sessionType,
            message: clientData.message || 'Не вказано'
        };
        
        // Send email using EmailJS
        emailjs.send('service_wrz1o2p', 'template_9euk13t', templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                
                // Add booking to local storage
                if (bookingManager.addBooking(selectedDate, selectedTime, clientData)) {
                    showMessage('Ваша заявка успішно відправлена! Я зв\'яжуся з вами найближчим часом для підтвердження.', 'success');
                    appointmentForm.reset();
                    dateInput.min = formattedToday; // Restore min date after reset
                    timeSelect.innerHTML = '<option value="">Оберіть час</option>';
                } else {
                    showMessage('Заявка відправлена, але сталася помилка при збереженні бронювання.', 'warning');
                }
            })
            .catch(function(error) {
                console.log('FAILED...', error);
                showMessage('Сталася помилка при відправці заявки. Спробуйте ще раз або зв\'яжіться зі мною напряму.', 'error');
            })
            .finally(function() {
                // Restore submit button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            });
    });
    
    // Show message function
    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
    
    // Admin function to clear all bookings (for testing)
    window.clearAllBookings = function() {
        if (confirm('Ви впевнені, що хочете очистити всі бронювання?')) {
            bookingManager.clearAllBookings();
            updateAvailableTimes();
            alert('Всі бронювання очищено!');
        }
    };
});