// JavaScript for Minimalist Ophthalmologist Website

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // ===========================
    // Mobile Menu Toggle
    // ===========================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('open');

            // Toggle icon between bars and times
            const icon = mobileMenuBtn.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close mobile menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('open');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }


    // ===========================
    // Smooth Scrolling for Navigation Links
    // ===========================
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // ===========================
    // Active Navigation Link on Scroll
    // ===========================
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-link-light');

    function setActiveNavOnScroll() {
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', setActiveNavOnScroll);


    // ===========================
    // Navbar Background on Scroll
    // ===========================
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });


    // ===========================
    // Intersection Observer for Scroll Animations
    // ===========================
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe service cards
    const serviceCards = document.querySelectorAll('.service-card-minimal');
    serviceCards.forEach((card, index) => {
        card.classList.add('fade-in-up');
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    // Observe sections
    const animatedSections = document.querySelectorAll('section');
    animatedSections.forEach(section => {
        observer.observe(section);
    });


    // ===========================
    // Parallax Effect for Hero Section
    // ===========================
    const heroSection = document.querySelector('#home');

    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        if (heroSection && scrollPosition < window.innerHeight) {
            const parallaxSpeed = 0.5;
            heroSection.style.backgroundPositionY = scrollPosition * parallaxSpeed + 'px';
        }
    });


    // ===========================
    // Back to Top Button
    // ===========================
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopButton.className = 'fixed bottom-8 right-8 w-14 h-14 bg-navy-900 text-white rounded-full shadow-xl hover:bg-coral transition-all duration-300 z-40 opacity-0 pointer-events-none flex items-center justify-center';
    backToTopButton.id = 'back-to-top';
    backToTopButton.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTopButton);

    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTopButton.style.opacity = '1';
            backToTopButton.style.pointerEvents = 'auto';
        } else {
            backToTopButton.style.opacity = '0';
            backToTopButton.style.pointerEvents = 'none';
        }
    });

    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });


    // ===========================
    // Stats Counter Animation
    // ===========================
    const statsCircle = document.querySelector('.w-64.h-64');
    if (statsCircle) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const numberElement = statsCircle.querySelector('.text-5xl');
                    if (numberElement) {
                        animateCounter(numberElement, 15, 2000);
                    }
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(statsCircle);
    }

    function animateCounter(element, target, duration = 2000) {
        const originalText = element.textContent;
        let current = 0;
        const increment = target / (duration / 16);

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + '+';
            }
        }, 16);
    }


    // ===========================
    // Lazy Loading for Images
    // ===========================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });

        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }


    // ===========================
    // Cursor Follow Effect (Optional Enhancement)
    // ===========================
    let cursor = null;
    if (window.innerWidth > 768) {
        cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid #ff6b4a;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.2s ease;
            display: none;
        `;
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', function(e) {
            cursor.style.display = 'block';
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
        });

        // Scale cursor on button hover
        const buttons = document.querySelectorAll('a, button');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.5)';
                cursor.style.borderColor = '#0a2a3d';
            });
            button.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursor.style.borderColor = '#ff6b4a';
            });
        });
    }


    // ===========================
    // Hero Text Animation
    // ===========================
    const heroTitle = document.querySelector('#home h1');
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(30px)';

        setTimeout(() => {
            heroTitle.style.transition = 'all 1s ease-out';
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 300);
    }


    // ===========================
    // Accessibility: Keyboard Navigation
    // ===========================
    document.addEventListener('keydown', function(e) {
        // ESC key closes mobile menu
        if (e.key === 'Escape' && mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenuBtn.click();
        }

        // Tab key focus styling
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });


    // ===========================
    // Performance: Debounce Scroll Events
    // ===========================
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Apply debounce to scroll-heavy functions
    const debouncedScrollHandler = debounce(() => {
        setActiveNavOnScroll();
    }, 50);

    window.addEventListener('scroll', debouncedScrollHandler);


    // ===========================
    // Smooth Reveal for Elements
    // ===========================
    const revealElements = document.querySelectorAll('h2, p, .btn-navy, .btn-outline');
    revealElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';

        const elementObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.transition = 'all 0.6s ease-out';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 50);
                    elementObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        elementObserver.observe(element);
    });


    // ===========================
    // Footer Year Update
    // ===========================
    const footerYear = document.querySelector('footer p');
    if (footerYear) {
        const currentYear = new Date().getFullYear();
        footerYear.innerHTML = footerYear.innerHTML.replace('2025', currentYear);
    }


    // ===========================
    // Console Branding
    // ===========================
    console.log('%c👁️ Sitora Karimova Ophthalmology', 'color: #0a2a3d; font-size: 24px; font-weight: bold; padding: 10px;');
    console.log('%cExceptional eye care with modern design', 'color: #ff6b4a; font-size: 14px; font-weight: 300;');


    // ===========================
    // Service Worker Registration (for future PWA support)
    // ===========================
    if ('serviceWorker' in navigator) {
        // Uncomment when you have a service worker file
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('Service Worker registered'))
        //     .catch(err => console.log('Service Worker registration failed'));
    }

});
