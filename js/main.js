// ===== DOM Elements =====
const navbar = document.querySelector('.navbar');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');
const careerForm = document.getElementById('careerForm');

// ===== Navbar Scroll Effect =====
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== Mobile Menu Toggle =====
if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
}

// ===== Smooth Scroll for Navigation Links =====
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (!targetId || !targetId.startsWith('#')) {
            return;
        }

        e.preventDefault();
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            navMenu.classList.remove('active');
            mobileMenuToggle?.classList.remove('active');
        }
    });
});

// ===== Active Navigation Link on Scroll =====
const sections = document.querySelectorAll('section[id]');

const highlightNavLink = () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
};

window.addEventListener('scroll', highlightNavLink);

// ===== Form Handling =====
function selectPlan(planName) {
    // Scroll to contact section
    const contactSection = document.getElementById('contact');
    const packageSelect = document.getElementById('package');
    
    if (contactSection && packageSelect) {
        const offsetTop = contactSection.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        
        // Set the selected package
        setTimeout(() => {
            packageSelect.value = planName;
            packageSelect.focus();
            
            // Add highlight effect
            packageSelect.style.borderColor = '#abe2fe';
            setTimeout(() => {
                packageSelect.style.borderColor = '';
            }, 1000);
        }, 500);
    }
}

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        const requiredFields = ['name', 'businessName', 'email', 'phone', 'services', 'cta', 'package'];
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!data[field] || data[field].trim() === '') {
                isValid = false;
                const input = document.getElementById(field);
                if (input) {
                    input.style.borderColor = '#ff6b6b';
                    setTimeout(() => {
                        input.style.borderColor = '';
                    }, 2000);
                }
            }
        });
        
        if (!isValid) {
            e.preventDefault();
            showNotification('Please fill in all required fields', 'error');
        }
    });
}

if (careerForm) {
    careerForm.addEventListener('submit', (e) => {
        if (!careerForm.checkValidity()) {
            e.preventDefault();
            showNotification('Please fill in all required fields', 'error');
        }
    });
}

// ===== Notification System =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 24px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        margin-left: 8px;
    `;
    
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ===== Scroll Reveal Animations =====
const revealElements = document.querySelectorAll([
    '.section-header',
    '.service-card',
    '.pricing-card',
    '.pricing-note',
    '.contact-info',
    '.contact-feature',
    '.contact-form-container',
    '.content-section .section-badge',
    '.content-section .page-title',
    '.content-section .page-description',
    '.detail-card',
    '.contact-method',
    '.career-form',
    '.image-placeholder'
].join(','));

if (revealElements.length) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    revealElements.forEach((el, index) => {
        if (reduceMotion) {
            return;
        }

        el.classList.add('scroll-reveal');
        el.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 70}ms`);
    });

    if (!reduceMotion) {
        const revealObserver = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observerInstance.unobserve(entry.target);
                    window.setTimeout(() => {
                        entry.target.classList.remove('scroll-reveal', 'is-visible');
                        entry.target.style.removeProperty('--reveal-delay');
                    }, 1000);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -70px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }
}

// ===== Counter Animation =====
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
};

// Trigger counter animation when stats are visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                if (!isNaN(number)) {
                    stat.classList.add('counted');
                    // You can implement counter animation here if needed
                }
            });
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// ===== Parallax Effect for Hero Visual =====
document.addEventListener('mousemove', (e) => {
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual && window.innerWidth > 992) {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;
        
        heroVisual.style.transform = `translate(${mouseX * 20}px, ${mouseY * 20}px)`;
    }
});

// ===== Add CSS for animations =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('Afrisoft Online website loaded successfully!');
});
