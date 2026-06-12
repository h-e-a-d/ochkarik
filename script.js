// JavaScript for Minimalist Ophthalmologist Website

// Prevent browsers from restoring a stale scroll position after
// language-switch navigation (bfcache or same-origin restore).
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // ===========================
    // Page Loader
    // ===========================
    const pageLoader = document.getElementById('page-loader');

    // When bfcache restores a page, DOMContentLoaded doesn't re-fire
    // but pageshow does. Ensure the page loader is hidden.
    window.addEventListener('pageshow', function(e) {
        if (e.persisted && pageLoader) {
            pageLoader.classList.add('hidden');
            document.body.classList.remove('loading');
        }
    });

    // Hide loader as soon as DOM is ready — CSS is already applied at this point
    // (render-blocking stylesheets are fully parsed before DOMContentLoaded fires).
    // Waiting for window.load (which waits for images) delays FCP/LCP by 3-4 s on
    // mobile and directly inflates those Core Web Vitals scores.
    function hideLoader() {
        if (pageLoader && !pageLoader.classList.contains('hidden')) {
            pageLoader.classList.add('hidden');
            document.body.classList.remove('loading');
        }
    }
    // Hide on DOMContentLoaded (we are already inside that handler).
    hideLoader();

    // Also handle the case where window.load fires before hideLoader runs
    // (belt-and-suspenders: removes the spinner if still visible after images load).
    window.addEventListener('load', hideLoader);

    // Hard cap at 800 ms for any edge-case where the above paths are skipped.
    setTimeout(hideLoader, 800);


    // ===========================
    // Language Switcher (navigation only — content is rendered server-side by Eleventy)
    // ===========================
    (function () {
        const currentLang = document.documentElement.lang || 'ru';
        const langMap = { en: 'EN', ru: 'RU', tg: 'TJ', tj: 'TJ' };

        // Update the "current language" badge in the nav
        const currentLangDisplay = document.getElementById('current-lang');
        if (currentLangDisplay) {
            currentLangDisplay.textContent = langMap[currentLang] || currentLang.toUpperCase();
        }

        // Clicking a lang option navigates to the sibling locale page.
        // The URL structure is /<lang>/, so we replace the first path segment.
        function navigateToLang(target) {
            if (!target) return;
            const parts = window.location.pathname.split('/').filter(Boolean);
            if (['en', 'ru', 'tj'].includes(parts[0])) {
                parts[0] = target;
            } else {
                parts.unshift(target);
            }
            window.location.href = '/' + parts.join('/') + (parts.length === 1 ? '/' : '');
        }

        document.querySelectorAll('.lang-option, .lang-option-mobile').forEach(el => {
            el.addEventListener('click', function (e) {
                e.preventDefault();
                navigateToLang(this.getAttribute('data-lang'));
            });
        });

        // Desktop dropdown open/close (visual only)
        const langBtn = document.getElementById('lang-btn');
        const langMenu = document.getElementById('lang-menu');
        if (langBtn && langMenu) {
            langBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                const isHidden = langMenu.classList.contains('hidden');
                langMenu.classList.toggle('hidden');
                langBtn.setAttribute('aria-expanded', String(isHidden));
            });
            document.addEventListener('click', function (e) {
                if (!langBtn.contains(e.target) && !langMenu.contains(e.target)) {
                    langMenu.classList.add('hidden');
                    langBtn.setAttribute('aria-expanded', 'false');
                }
            });
        }
    })();

    // ===========================
    // Mobile Menu Toggle with Backdrop
    // ===========================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    // Create backdrop for mobile menu
    const backdrop = document.createElement('div');
    backdrop.className = 'mobile-menu-backdrop';
    document.body.appendChild(backdrop);

    // Close menu when clicking backdrop
    backdrop.addEventListener('click', () => {
        if (!mobileMenu.classList.contains('hidden')) {
            mobileMenuBtn.click();
        }
    });

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            const isHidden = mobileMenu.classList.contains('hidden');
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('open');
            mobileMenuBtn.setAttribute('aria-expanded', isHidden);

            // Toggle backdrop
            backdrop.classList.toggle('active', isHidden);

            // Toggle icon between bars and xmark
            const iconUse = mobileMenuBtn.querySelector('use');
            const isBars = iconUse.getAttribute('href').endsWith('#fa-bars');
            iconUse.setAttribute('href', isBars ? '/assets/icons.svg#fa-xmark' : '/assets/icons.svg#fa-bars');
        });

        // Close mobile menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('open');
                backdrop.classList.remove('active');
                mobileMenuBtn.querySelector('use').setAttribute('href', '/assets/icons.svg#fa-bars');
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

    let sectionOffsets = [];

    function cacheSectionOffsets() {
        sectionOffsets = Array.from(sections).map(section => ({
            id: section.getAttribute('id'),
            top: section.offsetTop,
            bottom: section.offsetTop + section.offsetHeight
        }));
    }

    cacheSectionOffsets();
    window.addEventListener('resize', cacheSectionOffsets, { passive: true });

    function setActiveNavOnScroll() {
        const scrollPosition = window.scrollY + 100;

        let activeId = null;
        for (const s of sectionOffsets) {
            if (scrollPosition >= s.top && scrollPosition < s.bottom) {
                activeId = s.id;
            }
        }

        navItems.forEach(item => {
            const shouldBeActive = item.getAttribute('href') === `#${activeId}`;
            const isActive = item.classList.contains('active');
            if (shouldBeActive && !isActive) {
                item.classList.add('active');
            } else if (!shouldBeActive && isActive) {
                item.classList.remove('active');
            }
        });
    }

    // ===========================
    // Consolidated Scroll Handler with RAF Throttling
    // ===========================
    const navbar = document.getElementById('navbar');
    const heroSection = document.querySelector('#home');
    const heroImage = heroSection?.querySelector('img');

    // Contact FAB (Floating Action Button)
    const contactFab = document.createElement('div');
    contactFab.id = 'contact-fab';
    contactFab.innerHTML = `
        <a href="tel:+992108118080" id="fab-phone" class="fab-option" aria-label="Call us">
            <svg class="svg-icon"><use href="/assets/icons.svg#fa-phone"></use></svg>
        </a>
        <a href="https://wa.me/992108118080" id="fab-whatsapp" class="fab-option fab-option--whatsapp" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
            <svg class="svg-icon"><use href="/assets/icons.svg#fa-whatsapp"></use></svg>
        </a>
        <button id="fab-main" class="fab-main" aria-label="Contact options" aria-expanded="false">
            <svg class="svg-icon fab-icon-contact"><use href="/assets/icons.svg#fa-comments"></use></svg>
            <svg class="svg-icon fab-icon-close"><use href="/assets/icons.svg#fa-xmark"></use></svg>
        </button>
    `;
    document.body.appendChild(contactFab);

    const fabMain = document.getElementById('fab-main');
    let fabOpen = false;

    fabMain.addEventListener('click', function() {
        fabOpen = !fabOpen;
        contactFab.classList.toggle('fab-expanded', fabOpen);
        fabMain.setAttribute('aria-expanded', fabOpen);
        if (fabOpen) {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({ event: 'contact_fab_open' });
        }
    });

    document.getElementById('fab-phone').addEventListener('click', function() {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: 'contact_phone_click' });
    });

    document.getElementById('fab-whatsapp').addEventListener('click', function() {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: 'contact_whatsapp_click' });
    });

    // Close on outside click
    document.addEventListener('click', function(e) {
        if (fabOpen && !contactFab.contains(e.target)) {
            fabOpen = false;
            contactFab.classList.remove('fab-expanded');
            fabMain.setAttribute('aria-expanded', 'false');
        }
    });

    const backToTopButton = null;

    let scrollTicking = false;

    function handleScroll() {
        const scrollY = window.scrollY;

        // Navbar background (> 100px)
        if (scrollY > 100) {
            if (!navbar.classList.contains('scrolled')) navbar.classList.add('scrolled');
        } else {
            if (navbar.classList.contains('scrolled')) navbar.classList.remove('scrolled');
        }

        // Active nav highlighting
        setActiveNavOnScroll();

        // Contact FAB visibility (> 500px)
        if (contactFab) {
            if (scrollY > 500) {
                if (!contactFab.classList.contains('fab-visible')) contactFab.classList.add('fab-visible');
            } else {
                if (contactFab.classList.contains('fab-visible')) contactFab.classList.remove('fab-visible');
                if (fabOpen) {
                    fabOpen = false;
                    contactFab.classList.remove('fab-expanded');
                    fabMain.setAttribute('aria-expanded', 'false');
                }
            }
        }

        // Parallax (desktop only, < viewport height)
        if (window.innerWidth > 768 && heroImage && scrollY < window.innerHeight) {
            const parallaxSpeed = 0.3;
            heroImage.style.transform = `translateY(${scrollY * parallaxSpeed}px)`;
        }

        scrollTicking = false;
    }

    // Single scroll listener with RAF throttling
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(handleScroll);
            scrollTicking = true;
        }
    }, { passive: true });


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
    // Stats Counter Animation
    // ===========================
    const statsCircle = document.querySelector('.w-64.h-64');
    if (statsCircle) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const numberElement = statsCircle.querySelector('.text-5xl');
                    if (numberElement) {
                        animateCounter(numberElement, 8, 2000);
                    }
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(statsCircle);
    }

    function animateCounter(element, target, duration = 2000) {
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
    // Hero Text Animation
    // ===========================
    const heroTitle = document.querySelector('#home h1');
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(30px)';

        setTimeout(() => {
            heroTitle.style.transition = 'all 0.8s ease-out';
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 100);
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
    // Smooth Reveal for Elements (Optimized - Single Observer)
    // ===========================
    const revealElements = document.querySelectorAll('section h2, section p, .btn-navy, .btn-outline');

    // Initialize elements (skip hero section for instant visibility)
    revealElements.forEach(element => {
        const isInHero = element.closest('#home');
        if (!isInHero) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
        }
    });

    // Single observer for all elements
    const elementObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate immediately when visible (no artificial delay)
                entry.target.style.transition = 'all 0.4s ease-out';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                elementObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });

    // Observe all elements with single observer
    revealElements.forEach(el => elementObserver.observe(el));


    // ===========================
    // Footer Year Update
    // ===========================
    const footerYear = document.querySelector('footer p');
    if (footerYear) {
        const currentYear = new Date().getFullYear();
        footerYear.innerHTML = footerYear.innerHTML.replace('2025', currentYear);
    }


    // ===========================
    // Testimonial Carousel
    // ===========================
    let currentSlide = 0;
    let autoAdvance;
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dot');

    function showSlide(index) {
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Add active class to current slide and dot
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    // Touch swipe support for mobile
    const testimonialSection = document.getElementById('testimonials');
    if (testimonialSection) {
        // Touch swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        testimonialSection.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        testimonialSection.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                clearInterval(autoAdvance);

                if (diff > 0) {
                    // Swipe left - next slide
                    nextSlide();
                } else {
                    // Swipe right - previous slide
                    prevSlide();
                }

                // Restart auto-advance after swipe
                autoAdvance = setInterval(nextSlide, 7000);
            }
        }
    }


    // ===========================
    // Console Branding
    // ===========================
    console.log('%c👁️ Sitora Karimova Ophthalmology', 'color: #0a2a3d; font-size: 24px; font-weight: bold; padding: 10px;');
    console.log('%cExceptional eye care with modern design', 'color: #ff6b4a; font-size: 14px; font-weight: 300;');


    // ===========================
    // About Section Image Carousel
    // ===========================
    const aboutSlides = document.querySelectorAll('.carousel-slide');
    const aboutIndicators = document.querySelectorAll('.indicator');
    let aboutCurrentSlide = 0;

    function showAboutSlide(index) {
        // Remove active class from all slides and indicators
        aboutSlides.forEach(slide => {
            slide.classList.remove('active');
            slide.classList.add('opacity-0');
        });
        aboutIndicators.forEach(indicator => {
            indicator.classList.remove('active');
            indicator.classList.remove('bg-white');
            indicator.classList.add('bg-white/50');
        });

        // Add active class to current slide and indicator
        aboutSlides[index].classList.add('active');
        aboutSlides[index].classList.remove('opacity-0');
        aboutIndicators[index].classList.add('active');
        aboutIndicators[index].classList.add('bg-white');
        aboutIndicators[index].classList.remove('bg-white/50');

        aboutCurrentSlide = index;
    }

    // Event listeners for indicators
    aboutIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showAboutSlide(index);
        });
    });


    // ===========================
    // Service Toggle Functionality (Expand Entire Row)
    // ===========================

    // Function to toggle a row
    function toggleServiceRow(rowIndex) {
        const rowCards = document.querySelectorAll(`.service-card-minimal[data-row="${rowIndex}"]`);

        // Check current state of this row
        const firstCard = rowCards[0];
        const firstDescription = firstCard.querySelector('.service-description');
        const isExpanded = firstDescription.classList.contains('expanded');

        // Toggle all cards in this row
        rowCards.forEach(card => {
            const description = card.querySelector('.service-description');
            const cardToggle = card.querySelector('.service-toggle');
            const cardIcon = cardToggle.querySelector('.toggle-icon');
            const cardText = cardToggle.querySelector('.toggle-text');

            if (isExpanded) {
                // Collapse row
                description.classList.remove('expanded');
                cardIcon.classList.remove('rotate-180');
                cardText.textContent = (window.__T__ && window.__T__.services.readMore);
            } else {
                // Expand row
                description.classList.add('expanded');
                cardIcon.classList.add('rotate-180');
                cardText.textContent = (window.__T__ && window.__T__.services.readLess);
            }
        });
    }

    // Add click handlers to toggle buttons
    const serviceToggles = document.querySelectorAll('.service-toggle');
    serviceToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
            const rowIndex = this.getAttribute('data-row');
            toggleServiceRow(rowIndex);
        });
    });

    // Add click handlers to descriptions
    const serviceDescriptions = document.querySelectorAll('.service-description');
    serviceDescriptions.forEach(description => {
        description.addEventListener('click', function() {
            const card = this.closest('.service-card-minimal');
            const rowIndex = card.getAttribute('data-row');
            toggleServiceRow(rowIndex);
        });
    });


    // ===========================
    // Service Worker Registration (deferred for better performance)
    // ===========================
    window.addEventListener('load', () => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered successfully');

                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New content available, reload recommended
                                console.log('New content available. Please refresh.');
                            }
                        });
                    });
                })
                .catch(err => console.log('Service Worker registration failed:', err));
        }
    });

});
