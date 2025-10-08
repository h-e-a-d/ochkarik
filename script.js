// JavaScript for Minimalist Ophthalmologist Website

// ===========================
// Translations Object
// ===========================
const translations = {
    en: {
        nav: {
            home: 'Home',
            services: 'Services',
            about: 'About',
            reviews: 'Reviews',
            contact: 'Contact',
            language: 'Language'
        },
        hero: {
            subtitle: 'Ophthalmology Practice',
            title: 'Exceptional eye care with cutting-edge technology',
            description: 'Experience personalized ophthalmology services designed for your unique vision needs',
            bookNow: 'Book Now',
            ourServices: 'Our Services'
        },
        services: {
            subtitle: 'What We Offer',
            title: 'Core Services',
            exams: {
                title: 'Comprehensive Exams',
                description: 'Complete eye health evaluation using advanced diagnostic technology'
            },
            cataract: {
                title: 'Cataract Surgery',
                description: 'State-of-the-art microsurgical procedures for vision restoration'
            },
            lasik: {
                title: 'LASIK Surgery',
                description: 'Precision laser vision correction for lasting results'
            },
            glaucoma: {
                title: 'Glaucoma Management',
                description: 'Advanced detection and treatment to preserve your vision'
            },
            retina: {
                title: 'Retina Specialist',
                description: 'Expert care for retinal conditions and macular health'
            },
            pediatric: {
                title: 'Pediatric Care',
                description: 'Gentle, specialized eye care for children'
            }
        },
        about: {
            subtitle: 'Meet Dr. Karimova',
            title: 'Excellence in ophthalmology since 2008',
            description1: 'Dr. Sitora Karimova brings over 15 years of specialized experience in comprehensive eye care. Trained at Johns Hopkins University and Massachusetts Eye and Ear Infirmary, she combines cutting-edge technology with a patient-first philosophy.',
            description2: 'Her practice focuses on delivering personalized treatment plans that address each patient\'s unique needs, ensuring optimal vision outcomes and long-term eye health.',
            credential1: 'Board Certified Ophthalmologist',
            credential2: 'Fellow, American Academy of Ophthalmology',
            credential3: '15+ Years Clinical Experience'
        },
        stats: {
            years: 'Years of<br>Experience'
        },
        testimonials: {
            quote: '"Dr. Karimova\'s expertise and compassionate care transformed my vision. The cataract surgery was seamless, and I can now see the world with perfect clarity. Truly exceptional service."',
            patient: 'Cataract Surgery Patient'
        },
        partners: {
            title: 'Trusted Partnerships'
        },
        contact: {
            subtitle: 'Get In Touch',
            title: 'Schedule your appointment',
            phone: 'Phone',
            email: 'Email',
            hours: 'Hours',
            monFri: 'Mon - Fri: 8:00 AM - 6:00 PM',
            sat: 'Sat: 9:00 AM - 2:00 PM',
            sun: 'Sun: Closed',
            bookNow: 'Book Now',
            callUs: 'Call Us',
            visitClinic: 'Visit Our Clinic',
            address1: 'Bekhzod Street 14',
            address2: 'Dushanbe, Tajikistan'
        },
        footer: {
            tagline: 'Exceptional ophthalmology care since 2008',
            servicesTitle: 'Services',
            eyeExams: 'Eye Exams',
            cataractSurgery: 'Cataract Surgery',
            lasik: 'LASIK',
            glaucomaCare: 'Glaucoma Care',
            infoTitle: 'Information',
            about: 'About',
            reviews: 'Reviews',
            contact: 'Contact',
            privacy: 'Privacy Policy',
            connect: 'Connect',
            copyright: '© 2025 Sitora Karimova Ophthalmology. All rights reserved.'
        }
    },
    ru: {
        nav: {
            home: 'Главная',
            services: 'Услуги',
            about: 'О нас',
            reviews: 'Отзывы',
            contact: 'Контакты',
            language: 'Язык'
        },
        hero: {
            subtitle: 'Офтальмологическая практика',
            title: 'Исключительный уход за зрением с передовыми технологиями',
            description: 'Персонализированные офтальмологические услуги для ваших уникальных потребностей',
            bookNow: 'Записаться',
            ourServices: 'Наши услуги'
        },
        services: {
            subtitle: 'Что мы предлагаем',
            title: 'Основные услуги',
            exams: {
                title: 'Комплексное обследование',
                description: 'Полная оценка здоровья глаз с использованием передовых диагностических технологий'
            },
            cataract: {
                title: 'Операция по удалению катаракты',
                description: 'Современные микрохирургические процедуры для восстановления зрения'
            },
            lasik: {
                title: 'LASIK операция',
                description: 'Точная лазерная коррекция зрения для долговременных результатов'
            },
            glaucoma: {
                title: 'Лечение глаукомы',
                description: 'Передовая диагностика и лечение для сохранения вашего зрения'
            },
            retina: {
                title: 'Специалист по сетчатке',
                description: 'Экспертная помощь при заболеваниях сетчатки и макулы'
            },
            pediatric: {
                title: 'Детская офтальмология',
                description: 'Бережный, специализированный уход за глазами детей'
            }
        },
        about: {
            subtitle: 'Знакомьтесь, доктор Каримова',
            title: 'Превосходство в офтальмологии с 2008 года',
            description1: 'Доктор Ситора Каримова имеет более 15 лет специализированного опыта в комплексном уходе за глазами. Получив образование в Университете Джонса Хопкинса и Массачусетской глазной и ушной больнице, она сочетает передовые технологии с философией заботы о пациентах.',
            description2: 'Её практика фокусируется на разработке персонализированных планов лечения, которые отвечают уникальным потребностям каждого пациента, обеспечивая оптимальные результаты для зрения и долгосрочное здоровье глаз.',
            credential1: 'Сертифицированный офтальмолог',
            credential2: 'Член Американской академии офтальмологии',
            credential3: '15+ лет клинического опыта'
        },
        stats: {
            years: 'Лет<br>опыта'
        },
        testimonials: {
            quote: '"Опыт и заботливый подход доктора Каримовой преобразили моё зрение. Операция по удалению катаракты прошла безупречно, и теперь я могу видеть мир с идеальной чёткостью. Поистине исключительный сервис."',
            patient: 'Пациент после операции катаракты'
        },
        partners: {
            title: 'Доверенные партнёры'
        },
        contact: {
            subtitle: 'Свяжитесь с нами',
            title: 'Запишитесь на приём',
            phone: 'Телефон',
            email: 'Эл. почта',
            hours: 'Часы работы',
            monFri: 'Пн - Пт: 8:00 - 18:00',
            sat: 'Сб: 9:00 - 14:00',
            sun: 'Вс: Закрыто',
            bookNow: 'Записаться',
            callUs: 'Позвонить',
            visitClinic: 'Посетите нашу клинику',
            address1: 'Улица Бехзода 14',
            address2: 'Душанбе, Таджикистан'
        },
        footer: {
            tagline: 'Исключительный уход за глазами с 2008 года',
            servicesTitle: 'Услуги',
            eyeExams: 'Обследование глаз',
            cataractSurgery: 'Операция катаракты',
            lasik: 'LASIK',
            glaucomaCare: 'Лечение глаукомы',
            infoTitle: 'Информация',
            about: 'О нас',
            reviews: 'Отзывы',
            contact: 'Контакты',
            privacy: 'Политика конфиденциальности',
            connect: 'Связаться',
            copyright: '© 2025 Офтальмология Ситоры Каримовой. Все права защищены.'
        }
    },
    tj: {
        nav: {
            home: 'Асосӣ',
            services: 'Хидматҳо',
            about: 'Дар бораи мо',
            reviews: 'Тақризҳо',
            contact: 'Тамос',
            language: 'Забон'
        },
        hero: {
            subtitle: 'Амалиёти офтальмологӣ',
            title: 'Нигоҳубини истисноии чашм бо технологияи пешрафта',
            description: 'Хидматҳои офтальмологии шахсӣ барои эҳтиёҷоти беназири бинишии шумо',
            bookNow: 'Сабти ном',
            ourServices: 'Хидматҳои мо'
        },
        services: {
            subtitle: 'Он чӣ мо пешниҳод мекунем',
            title: 'Хидматҳои асосӣ',
            exams: {
                title: 'Санҷишҳои комил',
                description: 'Арзёбии пурраи саломатии чашм бо истифода аз технологияи ташхисии пешрафта'
            },
            cataract: {
                title: 'Амалиёти катаракт',
                description: 'Усулҳои микроҷарроҳии муосир барои барқароркунии бинӣ'
            },
            lasik: {
                title: 'Амалиёти LASIK',
                description: 'Ислоҳи дақиқи бинӣ бо лазер барои натиҷаҳои пойдор'
            },
            glaucoma: {
                title: 'Табобати глаукома',
                description: 'Ошкоркунӣ ва табобати пешрафта барои нигоҳ доштани бинишии шумо'
            },
            retina: {
                title: 'Мутахассиси шабакия',
                description: 'Нигоҳубини мутахассисона барои ҳолатҳои шабакия ва макулярӣ'
            },
            pediatric: {
                title: 'Нигоҳубини кӯдакон',
                description: 'Нигоҳубини махсус ва мулоим барои чашми кӯдакон'
            }
        },
        about: {
            subtitle: 'Бо доктор Каримова шинос шавед',
            title: 'Дараҷаи олӣ дар офтальмология аз соли 2008',
            description1: 'Доктор Ситора Каримова зиёда аз 15 сол таҷрибаи ихтисосӣ дар нигоҳубини комили чашм дорад. Таҳсилёфтаи Донишгоҳи Ҷонс Ҳопкинс ва Беморхонаи чашм ва гӯши Массачусетс, ӯ технологияи пешрафтаро бо фалсафаи аввалан беморро муттаҳид мекунад.',
            description2: 'Амалиёти ӯ ба таҳияи нақшаҳои шахсии табобат равона карда шудааст, ки ба эҳтиёҷоти беназири ҳар бемор ҷавобгӯ аст ва натиҷаҳои мувофиқ барои бинӣ ва саломатии дарозмуҳлати чашмро таъмин мекунад.',
            credential1: 'Офтальмологи тасдиқшуда',
            credential2: 'Узви Академияи Америкоии Офтальмология',
            credential3: '15+ сол таҷрибаи клиникӣ'
        },
        stats: {
            years: 'Солҳои<br>таҷриба'
        },
        testimonials: {
            quote: '"Маҳорат ва ғамхории доктор Каримова бинишии маро табдил дод. Амалиёти катаракт бенуқс буд ва акнун ман метавонам дунёро бо равшании комил бинам. Дар ҳақиқат хидмати истисноӣ."',
            patient: 'Бемори амалиёти катаракт'
        },
        partners: {
            title: 'Шарикони боэътимод'
        },
        contact: {
            subtitle: 'Бо мо тамос гиред',
            title: 'Барои вохӯрӣ сабти ном кунед',
            phone: 'Телефон',
            email: 'Почтаи электронӣ',
            hours: 'Соатҳои корӣ',
            monFri: 'Душ - Ҷум: 8:00 - 18:00',
            sat: 'Шан: 9:00 - 14:00',
            sun: 'Якш: Пӯшида',
            bookNow: 'Сабти ном',
            callUs: 'Занг занед',
            visitClinic: 'Клиникаи моро боздид кунед',
            address1: 'Кӯчаи Беҳзод 14',
            address2: 'Душанбе, Тоҷикистон'
        },
        footer: {
            tagline: 'Нигоҳубини истисноии чашм аз соли 2008',
            servicesTitle: 'Хидматҳо',
            eyeExams: 'Санҷиши чашм',
            cataractSurgery: 'Амалиёти катаракт',
            lasik: 'LASIK',
            glaucomaCare: 'Табобати глаукома',
            infoTitle: 'Маълумот',
            about: 'Дар бораи мо',
            reviews: 'Тақризҳо',
            contact: 'Тамос',
            privacy: 'Сиёсати махфият',
            connect: 'Пайваст',
            copyright: '© 2025 Офтальмологияи Ситора Каримова. Ҳамаи ҳуқуқҳо маҳфузанд.'
        }
    }
};

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // ===========================
    // Language Switching System
    // ===========================
    let currentLang = localStorage.getItem('language') || 'en';

    // Function to get nested translation value
    function getTranslation(lang, key) {
        const keys = key.split('.');
        let value = translations[lang];

        for (let k of keys) {
            if (value && value[k] !== undefined) {
                value = value[k];
            } else {
                return null;
            }
        }
        return value;
    }

    // Function to update page language
    function updateLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('language', lang);

        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = getTranslation(lang, key);

            if (translation) {
                element.innerHTML = translation;
            }
        });

        // Update current language display
        const langMap = { en: 'EN', ru: 'RU', tj: 'TJ' };
        const currentLangDisplay = document.getElementById('current-lang');
        if (currentLangDisplay) {
            currentLangDisplay.textContent = langMap[lang];
        }

        // Update html lang attribute
        document.documentElement.setAttribute('lang', lang);
    }

    // Initialize language on page load
    updateLanguage(currentLang);

    // Desktop language switcher
    const langBtn = document.getElementById('lang-btn');
    const langMenu = document.getElementById('lang-menu');

    if (langBtn && langMenu) {
        langBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            langMenu.classList.toggle('hidden');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!langBtn.contains(e.target) && !langMenu.contains(e.target)) {
                langMenu.classList.add('hidden');
            }
        });

        // Language option clicks
        const langOptions = document.querySelectorAll('.lang-option');
        langOptions.forEach(option => {
            option.addEventListener('click', function() {
                const selectedLang = this.getAttribute('data-lang');
                updateLanguage(selectedLang);
                langMenu.classList.add('hidden');
            });
        });
    }

    // Mobile language switcher
    const mobileLangOptions = document.querySelectorAll('.lang-option-mobile');
    mobileLangOptions.forEach(option => {
        option.addEventListener('click', function() {
            const selectedLang = this.getAttribute('data-lang');
            updateLanguage(selectedLang);

            // Close mobile menu after language change
            const mobileMenu = document.getElementById('mobile-menu');
            const mobileMenuBtn = document.getElementById('mobile-menu-btn');
            if (mobileMenu && mobileMenuBtn) {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('open');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });


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
