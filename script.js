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
            title: 'Excellence in ophthalmology since 2017',
            description1: 'Dr. Sitora Karimova brings 8 years of specialized experience in comprehensive eye care. Trained at Avicenna Tajik State Medical University, she combines cutting-edge technology with a patient-first philosophy.',
            description2: 'Her practice focuses on delivering personalized consultation that address each patient\'s unique needs, ensuring optimal vision outcomes and long-term eye health.',
            credential1: 'Board Certified Ophthalmologist',
            credential2: 'Fellow, American Academy of Ophthalmology',
            credential3: '8+ Years Clinical Experience'
        },
        stats: {
            years: 'Years of<br>Experience'
        },
        testimonials: {
            quote1: '"Dr. Karimova\'s expertise and compassionate care transformed my vision. The cataract surgery was seamless, and I can now see the world with perfect clarity. Truly exceptional service."',
            name1: 'Farrukh Rahimov',
            patient1: 'Cataract Surgery Patient',
            quote2: '"After years of wearing glasses, LASIK surgery has given me the freedom I always wanted. Dr. Karimova\'s professionalism and the modern technology made all the difference. Highly recommend!"',
            name2: 'Dilshoda Nazarova',
            patient2: 'LASIK Surgery Patient',
            quote3: '"The glaucoma treatment I received was outstanding. Dr. Karimova took the time to explain everything and made me feel comfortable throughout the process. My vision is stable thanks to her expertise."',
            name3: 'Rustam Shokirov',
            patient3: 'Glaucoma Patient',
            quote4: '"My daughter\'s vision problems were diagnosed and treated with such care and attention. Dr. Karimova has a wonderful way with children and made the whole experience stress-free for our family."',
            name4: 'Gulnora Karimova',
            patient4: 'Pediatric Patient Parent'
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
            tagline: 'Exceptional ophthalmology care since 2017',
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
            title: 'Превосходство в офтальмологии с 2017 года',
            description1: 'Доктор Ситора Каримова имеет 8 лет специализированного опыта в комплексном уходе за глазами. Получив образование в Таджикском государственном медицинском университете имени Авиценны, она сочетает передовые технологии с философией заботы о пациентах.',
            description2: 'Её практика фокусируется на разработке персонализированных планов лечения, которые отвечают уникальным потребностям каждого пациента, обеспечивая оптимальные результаты для зрения и долгосрочное здоровье глаз.',
            credential1: 'Сертифицированный офтальмолог',
            credential2: 'Член Американской академии офтальмологии',
            credential3: '8+ лет клинического опыта'
        },
        stats: {
            years: 'Лет<br>опыта'
        },
        testimonials: {
            quote1: '"Опыт и заботливый подход доктора Каримовой преобразили моё зрение. Операция по удалению катаракты прошла безупречно, и теперь я могу видеть мир с идеальной чёткостью. Поистине исключительный сервис."',
            name1: 'Фаррух Рахимов',
            patient1: 'Пациент после операции катаракты',
            quote2: '"После многих лет ношения очков операция LASIK дала мне свободу, о которой я всегда мечтал. Профессионализм доктора Каримовой и современные технологии изменили всё. Очень рекомендую!"',
            name2: 'Дилшода Назарова',
            patient2: 'Пациент после операции LASIK',
            quote3: '"Лечение глаукомы, которое я получил, было выдающимся. Доктор Каримова уделила время, чтобы всё объяснить, и я чувствовал себя комфортно на протяжении всего процесса. Моё зрение стабильно благодаря её опыту."',
            name3: 'Рустам Шокиров',
            patient3: 'Пациент с глаукомой',
            quote4: '"Проблемы со зрением моей дочери были диагностированы и вылечены с такой заботой и вниманием. У доктора Каримовой прекрасный подход к детям, и весь процесс прошёл без стресса для нашей семьи."',
            name4: 'Гульнора Каримова',
            patient4: 'Родитель детского пациента'
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
            tagline: 'Исключительный уход за глазами с 2017 года',
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
            title: 'Дараҷаи олӣ дар офтальмология аз соли 2017',
            description1: 'Доктор Ситора Каримова 8 сол таҷрибаи ихтисосӣ дар нигоҳубини комили чашм дорад. Таҳсилёфтаи Донишгоҳи тиббии давлатии Тоҷикистон ба номи Абӯалӣ ибни Сино, ӯ технологияи пешрафтаро бо фалсафаи аввалан беморро муттаҳид мекунад.',
            description2: 'Амалиёти ӯ ба таҳияи нақшаҳои шахсии табобат равона карда шудааст, ки ба эҳтиёҷоти беназири ҳар бемор ҷавобгӯ аст ва натиҷаҳои мувофиқ барои бинӣ ва саломатии дарозмуҳлати чашмро таъмин мекунад.',
            credential1: 'Офтальмологи тасдиқшуда',
            credential2: 'Узви Академияи Америкоии Офтальмология',
            credential3: '8+ сол таҷрибаи клиникӣ'
        },
        stats: {
            years: 'Солҳои<br>таҷриба'
        },
        testimonials: {
            quote1: '"Маҳорат ва ғамхории доктор Каримова бинишии маро табдил дод. Амалиёти катаракт бенуқс буд ва акнун ман метавонам дунёро бо равшании комил бинам. Дар ҳақиқат хидмати истисноӣ."',
            name1: 'Фаррух Раҳимов',
            patient1: 'Бемори амалиёти катаракт',
            quote2: '"Баъд аз солҳои зиёди истифодаи айнак, амалиёти LASIK ба ман озодиеро дод, ки ҳамеша орзу мекардам. Профессионализми доктор Каримова ва технологияи муосир ҳама чизро иваз кард. Пешниҳод мекунам!"',
            name2: 'Дилшода Назарова',
            patient2: 'Бемори амалиёти LASIK',
            quote3: '"Табобати глаукомае, ки ман гирифтам, ғоят олӣ буд. Доктор Каримова вақт гузоронд, то ҳама чизро шарҳ диҳад ва ман дар тамоми раванд худро осуда эҳсос кардам. Бинишии ман устувор аст, ташаккур ба маҳорати ӯ."',
            name3: 'Рустам Шокиров',
            patient3: 'Бемори глаукома',
            quote4: '"Мушкилоти бинишии духтарам бо чунин ғамхорӣ ва диққат ташхис ва табобат карда шуд. Доктор Каримова бо кӯдакон усули ҳамоиш дорад ва тамоми раванд барои оилаи мо бидуни танг буд."',
            name4: 'Гулнора Каримова',
            patient4: 'Волидайни бемори кӯдак'
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
            tagline: 'Нигоҳубини истисноии чашм аз соли 2017',
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
    // Page Loader
    // ===========================
    const pageLoader = document.getElementById('page-loader');

    // Hide loader when page is fully loaded
    window.addEventListener('load', function() {
        setTimeout(() => {
            if (pageLoader) {
                pageLoader.classList.add('hidden');
                document.body.classList.remove('loading');
            }
        }, 300);
    });

    // Fallback: Hide loader after 3 seconds if load event doesn't fire
    setTimeout(() => {
        if (pageLoader && !pageLoader.classList.contains('hidden')) {
            pageLoader.classList.add('hidden');
            document.body.classList.remove('loading');
        }
    }, 3000);


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
            const isHidden = langMenu.classList.contains('hidden');
            langMenu.classList.toggle('hidden');
            langBtn.setAttribute('aria-expanded', !isHidden);
        });

        // Keyboard navigation for language menu
        langBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                langBtn.click();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                langMenu.classList.remove('hidden');
                langBtn.setAttribute('aria-expanded', 'true');
                const firstOption = langMenu.querySelector('.lang-option');
                if (firstOption) firstOption.focus();
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!langBtn.contains(e.target) && !langMenu.contains(e.target)) {
                langMenu.classList.add('hidden');
                langBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // Language option clicks
        const langOptions = document.querySelectorAll('.lang-option');
        langOptions.forEach((option, index) => {
            option.addEventListener('click', function() {
                const selectedLang = this.getAttribute('data-lang');
                updateLanguage(selectedLang);
                langMenu.classList.add('hidden');
                langBtn.setAttribute('aria-expanded', 'false');
                langBtn.focus();
            });

            // Keyboard navigation within dropdown
            option.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const next = langOptions[index + 1];
                    if (next) next.focus();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    if (index === 0) {
                        langBtn.focus();
                        langMenu.classList.add('hidden');
                        langBtn.setAttribute('aria-expanded', 'false');
                    } else {
                        langOptions[index - 1].focus();
                    }
                } else if (e.key === 'Escape') {
                    langMenu.classList.add('hidden');
                    langBtn.setAttribute('aria-expanded', 'false');
                    langBtn.focus();
                }
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
            const isHidden = mobileMenu.classList.contains('hidden');
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('open');
            mobileMenuBtn.setAttribute('aria-expanded', isHidden);

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
    // Testimonial Carousel
    // ===========================
    let currentSlide = 0;
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

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    // Auto-advance carousel every 7 seconds
    let autoAdvance = setInterval(nextSlide, 7000);

    // Pause auto-advance when user interacts with carousel
    const testimonialSection = document.getElementById('testimonials');
    if (testimonialSection) {
        testimonialSection.addEventListener('mouseenter', () => {
            clearInterval(autoAdvance);
        });

        testimonialSection.addEventListener('mouseleave', () => {
            autoAdvance = setInterval(nextSlide, 7000);
        });

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
    // Service Worker Registration (for PWA support)
    // ===========================
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(() => console.log('Service Worker registered successfully'))
            .catch(err => console.log('Service Worker registration failed:', err));
    }

});
