// JavaScript for Minimalist Ophthalmologist Website

// ===========================
// Translations Object
// ===========================
const translations = window.translations = {
    en: {
        nav: {
            home: 'Home',
            services: 'Services',
            about: 'About',
            reviews: 'Reviews',
            faq: 'FAQ',
            contact: 'Contact',
            language: 'Language'
        },
        hero: {
            subtitle: 'Ophthalmology Practice',
            title: 'Exceptional eye care',
            description: 'Experience personalized ophthalmology services designed for your unique vision needs',
            ourServices: 'Our Services',
            findUs: 'Find Us'
        },
        services: {
            subtitle: 'What We Offer',
            title: 'Core Services',
            exams: {
                title: 'Comprehensive Eye Examinations',
                description: 'Complete eye health evaluation using advanced diagnostic technology',
                detail1: '<strong>What We Check:</strong> Visual acuity testing, refraction assessment, intraocular pressure measurement, retinal health evaluation, and early detection of conditions like glaucoma, cataracts, and macular degeneration.',
                detail2: '<strong>Who Needs Regular Exams:</strong> Adults every 2 years, annual exams for those with diabetes, high blood pressure, or family history of eye disease. Essential for maintaining optimal vision health.',
                detail3: '<strong>Duration:</strong> Approximately 45-60 minutes for first visit. Dr. Karimova personally reviews all findings and discusses treatment options with you.'
            },
            glasses: {
                title: 'Prescription Glasses',
                description: 'Custom eyewear tailored to your vision needs and style preferences',
                detail1: '<strong>Wide Selection:</strong> Choose from a variety of frame styles, lens types (single vision, progressive, bifocal), and specialized coatings including anti-reflective, blue light blocking, and UV protection for Tajikistan\'s sunny climate.',
                detail2: '<strong>Professional Fitting:</strong> Dr. Karimova ensures proper lens positioning, frame adjustment, and comfort. We provide guidance on lens care and maintenance for long-lasting eyewear.',
                detail3: '<strong>For All Ages:</strong> Specialized fitting for children, adults, and seniors. Computer glasses and reading glasses also available.'
            },
            contacts: {
                title: 'Contact Lenses',
                description: 'Professional fitting and care for comfortable contact lens wear',
                detail1: '<strong>Lens Options:</strong> Daily disposable, monthly replacement, toric lenses for astigmatism, multifocal lenses for presbyopia, and specialized lenses for hard-to-fit eyes. We work with leading international brands.',
                detail2: '<strong>Training & Support:</strong> Complete insertion and removal training, proper cleaning techniques, and ongoing support. Follow-up visits ensure optimal comfort and vision correction.',
                detail3: '<strong>First-Time Wearers Welcome:</strong> Perfect for active lifestyles, sports, or those seeking an alternative to glasses. Most patients adjust within 3-7 days.'
            },
            dryeye: {
                title: 'Dry Eye Management',
                description: 'Effective treatments to relieve discomfort and restore eye moisture',
                detail1: '<strong>Our Treatment Approach:</strong> Dr. Karimova performs comprehensive dry eye assessments including tear film analysis and meibomian gland evaluation. Treatment options include prescription eye drops (cyclosporine, lifitegrast), punctal plugs to retain natural tears, warm compress therapy, and lifestyle modifications.',
                detail2: '<strong>Advanced Technology:</strong> We use TearLab osmolarity testing to measure tear film quality and identify the root cause of your dry eye symptoms, ensuring personalized treatment plans.',
                detail3: '<strong>Who Benefits:</strong> Ideal for patients experiencing screen-related eye strain, contact lens discomfort, post-LASIK dryness, or age-related tear production decline. Most patients see improvement within 2-4 weeks.'
            },
            followup: {
                title: 'Ongoing Care and Follow-Up',
                description: 'Continuous monitoring and personalized care plans for long-term eye health',
                detail1: '<strong>Chronic Condition Management:</strong> Specialized follow-up for glaucoma patients, diabetic retinopathy monitoring, post-surgical care, and progression tracking for myopia control in children.',
                detail2: '<strong>Preventive Care:</strong> Regular monitoring helps detect problems early when they\'re most treatable. We maintain detailed records of your eye health history for comprehensive, coordinated care.',
                detail3: '<strong>Convenient Scheduling:</strong> Flexible appointment times including same-day urgent care for eye emergencies. Reminder system ensures you never miss important follow-ups.'
            },
            pediatric: {
                title: 'Children\'s Eye Care',
                description: 'Gentle, specialized eye care for children',
                detail1: '<strong>Conditions We Treat:</strong> Amblyopia (lazy eye), strabismus (crossed eyes), myopia progression control, refractive errors, and developmental vision problems. Child-friendly testing methods make exams stress-free for families.',
                detail2: '<strong>Age-Appropriate Care:</strong> We see infants (6 months+), toddlers, school-age children, and teenagers. Specialized equipment designed for children ensures accurate diagnosis even with non-verbal patients.',
                detail3: '<strong>Parent Education:</strong> We involve parents in every step, explaining findings clearly and providing home care instructions. Vision screening recommendations: 6 months, age 3, before school entry, then annually.'
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
            quote1: '"Dr. Karimova provided exceptional care during my eyeglasses consultation. Her attention to detail and expertise helped me find the perfect prescription. The quality of care and personalized service exceeded my expectations."',
            name1: 'Farrukh Rahimov',
            patient1: 'Eyeglasses Patient',
            quote2: '"After years of struggling with contact lenses, Dr. Karimova helped me find the most comfortable lenses for my eyes. Her expertise and patience made all the difference. I can now wear them all day without any discomfort. Highly recommend!"',
            name2: 'Dilshoda Nazarova',
            patient2: 'Contact Lens Patient',
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
        visionTest: {
            subtitle: 'Test Your Vision',
            title: 'Interactive Vision Test',
            initialInstruction: 'Try our interactive vision test. Sit 50cm from the screen. Cover one eye.',
            questionInstruction: 'Can you read all characters?',
            startButton: 'Start Test',
            yesButton: 'Yes',
            noButton: 'No',
            restartButton: 'Restart',
            lineIndicator: 'Line',
            of: 'of',
            testComplete: 'Test Complete!',
            yourVision: 'Your vision level:',
            detailedResults: 'Detailed Results:',
            consultationReminder: 'Please consult with Dr. Karimova for a professional eye examination.',
            disclaimer: 'This test is for educational purposes only and does not replace a professional eye examination.'
        },
        contact: {
            subtitle: 'Get In Touch',
            title: 'Schedule your appointment',
            address: 'Address',
            phone: 'Phone',
            email: 'Email',
            hours: 'Hours',
            monFri: 'Mon - Fri: 9:00 AM - 6:00 PM',
            sat: 'Sat: 9:00 AM - 2:00 PM',
            sun: 'Sun: Closed',
            bookNow: 'Book Now',
            callUs: 'Call Us',
            visitClinic: 'Visit Our Clinic',
            address1: 'Bekhzod Street 14',
            address2: 'Dushanbe, Tajikistan'
        },
        faq: {
            subtitle: 'Common Questions',
            title: 'Frequently Asked Questions',
            description: 'Find answers to common questions about our eye care services in Dushanbe',
            question1: 'How often should I get an eye exam?',
            answer1: 'Adults with no vision problems should get comprehensive eye exams every 2 years. If you wear glasses, have diabetes, or family history of eye disease, annual exams are recommended. Children need exams at 6 months, age 3, before school, then annually.',
            question2: 'Do you see children? At what age?',
            answer2: 'Yes! Dr. Karimova has specialized training in pediatric ophthalmology and welcomes children from infancy through teenage years using child-friendly testing methods.',
            question3: 'What is dry eye syndrome and how is it treated?',
            answer3: 'Dry eye syndrome causes burning, itching, redness, and watery eyes due to insufficient tear production or poor tear quality. Treatment includes prescription eye drops, punctal plugs, warm compress therapy, and lifestyle modifications. Most patients see improvement within 2-4 weeks.',
            question4: 'How long does a comprehensive eye exam take?',
            answer4: 'A comprehensive eye examination takes approximately 45-60 minutes for your first visit. This includes visual acuity testing, refraction assessment, intraocular pressure measurement, retinal health evaluation, and consultation with Dr. Karimova.',
            question5: 'Do you fit contact lenses?',
            answer5: 'Yes, we provide professional contact lens fitting including measurements of eye curvature and tear film quality. We offer daily disposable, monthly replacement, toric lenses for astigmatism, and multifocal lenses. Complete training and ongoing support are included.',
            question6: 'Where is your clinic located in Dushanbe?',
            answer6: 'Our clinic is located at Bekhzod Street 14, Dushanbe, Tajikistan. We are easily accessible with flexible appointment times including same-day urgent care for eye emergencies. Contact us at +992 93 009 71 71.',
            cta: 'Still have questions? We\'re here to help.',
            contactButton: 'Contact Us'
        },
        footer: {
            tagline: 'Exceptional ophthalmology care since 2017',
            servicesTitle: 'Services',
            eyeExams: 'Comprehensive Eye Examinations',
            glasses: 'Prescription Glasses',
            contacts: 'Contact Lenses',
            dryeye: 'Dry Eye Management',
            followup: 'Ongoing Care and Follow-Up',
            pediatric: 'Children\'s Eye Care',
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
            faq: 'Вопросы',
            contact: 'Контакты',
            language: 'Язык'
        },
        hero: {
            subtitle: 'Офтальмологическая практика',
            title: 'Исключительный уход за зрением',
            description: 'Персонализированные офтальмологические услуги для ваших уникальных потребностей',
            ourServices: 'Наши услуги',
            findUs: 'Найти нас'
        },
        services: {
            subtitle: 'Что мы предлагаем',
            title: 'Основные услуги',
            exams: {
                title: 'Комплексное обследование глаз',
                description: 'Полная оценка здоровья глаз с использованием передовых диагностических технологий',
                detail1: '<strong>Что мы проверяем:</strong> Проверка остроты зрения, оценка рефракции, измерение внутриглазного давления, оценка здоровья сетчатки и раннее выявление таких заболеваний, как глаукома, катаракта и макулярная дегенерация.',
                detail2: '<strong>Кому нужны регулярные обследования:</strong> Взрослым каждые 2 года, ежегодные обследования для тех, у кого диабет, высокое кровяное давление или семейная история глазных заболеваний. Необходимо для поддержания оптимального здоровья зрения.',
                detail3: '<strong>Продолжительность:</strong> Примерно 45-60 минут при первом посещении. Доктор Каримова лично рассматривает все результаты и обсуждает варианты лечения с вами.'
            },
            glasses: {
                title: 'Очки по рецепту',
                description: 'Индивидуальные очки, адаптированные к вашим потребностям зрения и стилю',
                detail1: '<strong>Широкий выбор:</strong> Выберите из разнообразия стилей оправ, типов линз (однофокальные, прогрессивные, бифокальные) и специальных покрытий, включая антибликовое, блокирующее синий свет и УФ-защиту для солнечного климата Таджикистана.',
                detail2: '<strong>Профессиональная подгонка:</strong> Доктор Каримова обеспечивает правильное положение линз, регулировку оправы и комфорт. Мы предоставляем рекомендации по уходу за линзами и их обслуживанию для долговечных очков.',
                detail3: '<strong>Для всех возрастов:</strong> Специализированная подгонка для детей, взрослых и пожилых людей. Также доступны компьютерные очки и очки для чтения.'
            },
            contacts: {
                title: 'Контактные линзы',
                description: 'Профессиональная подборка и уход за удобным ношением контактных линз',
                detail1: '<strong>Варианты линз:</strong> Ежедневные одноразовые, ежемесячные сменные, торические линзы при астигматизме, мультифокальные линзы при пресбиопии и специализированные линзы для трудно подбираемых глаз. Мы работаем с ведущими международными брендами.',
                detail2: '<strong>Обучение и поддержка:</strong> Полное обучение вставке и снятию, правильным методам очистки и постоянная поддержка. Последующие визиты обеспечивают оптимальный комфорт и коррекцию зрения.',
                detail3: '<strong>Приветствуются новички:</strong> Идеально подходит для активного образа жизни, спорта или тех, кто ищет альтернативу очкам. Большинство пациентов адаптируются в течение 3-7 дней.'
            },
            dryeye: {
                title: 'Лечение сухости глаз',
                description: 'Эффективные методы лечения для снятия дискомфорта и восстановления влажности глаз',
                detail1: '<strong>Наш подход к лечению:</strong> Доктор Каримова проводит комплексную оценку сухости глаз, включая анализ слёзной плёнки и оценку мейбомиевых желез. Варианты лечения включают рецептурные глазные капли (циклоспорин, лифитеграст), пунктальные пробки для удержания естественных слёз, терапию тёплыми компрессами и изменение образа жизни.',
                detail2: '<strong>Передовая технология:</strong> Мы используем осмолярное тестирование TearLab для измерения качества слёзной плёнки и выявления основной причины симптомов сухости глаз, обеспечивая персонализированные планы лечения.',
                detail3: '<strong>Кому это полезно:</strong> Идеально подходит для пациентов, испытывающих усталость глаз от экранов, дискомфорт от контактных линз, сухость после LASIK или возрастное снижение выработки слёз. Большинство пациентов видят улучшение в течение 2-4 недель.'
            },
            followup: {
                title: 'Постоянный уход и наблюдение',
                description: 'Непрерывный мониторинг и персонализированные планы ухода для долгосрочного здоровья глаз',
                detail1: '<strong>Управление хроническими состояниями:</strong> Специализированное наблюдение за пациентами с глаукомой, мониторинг диабетической ретинопатии, послеоперационный уход и отслеживание прогрессирования для контроля миопии у детей.',
                detail2: '<strong>Профилактический уход:</strong> Регулярный мониторинг помогает выявить проблемы на ранней стадии, когда они наиболее поддаются лечению. Мы ведём подробные записи вашей истории здоровья глаз для комплексного, скоординированного ухода.',
                detail3: '<strong>Удобное расписание:</strong> Гибкое время приёма, включая срочную помощь в тот же день при чрезвычайных ситуациях с глазами. Система напоминаний гарантирует, что вы никогда не пропустите важные последующие визиты.'
            },
            pediatric: {
                title: 'Детская офтальмология',
                description: 'Бережный, специализированный уход за глазами детей',
                detail1: '<strong>Заболевания, которые мы лечим:</strong> Амблиопия (ленивый глаз), косоглазие (скрещенные глаза), контроль прогрессирования миопии, рефракционные ошибки и проблемы развития зрения. Дружественные к детям методы тестирования делают обследования без стресса для семей.',
                detail2: '<strong>Уход, соответствующий возрасту:</strong> Мы принимаем младенцев (от 6 месяцев), малышей, детей школьного возраста и подростков. Специализированное оборудование, разработанное для детей, обеспечивает точную диагностику даже у невербальных пациентов.',
                detail3: '<strong>Образование родителей:</strong> Мы вовлекаем родителей на каждом этапе, ясно объясняя результаты и предоставляя инструкции по уходу на дому. Рекомендации по скринингу зрения: 6 месяцев, 3 года, перед школой, затем ежегодно.'
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
            quote1: '"Доктор Каримова обеспечила исключительный уход во время консультации по подбору очков. Её внимание к деталям и опыт помогли мне найти идеальный рецепт. Качество ухода и персонализированный сервис превзошли мои ожидания."',
            name1: 'Фаррух Рахимов',
            patient1: 'Пациент с очками',
            quote2: '"После многих лет сложностей с контактными линзами доктор Каримова помогла мне найти самые удобные линзы для моих глаз. Её опыт и терпение изменили всё. Теперь я могу носить их весь день без какого-либо дискомфорта. Очень рекомендую!"',
            name2: 'Дилшода Назарова',
            patient2: 'Пациент с контактными линзами',
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
        visionTest: {
            subtitle: 'Проверьте зрение',
            title: 'Интерактивный тест зрения',
            initialInstruction: 'Попробуйте наш интерактивный тест зрения. Сядьте на расстоянии 50 см от экрана. Закройте один глаз.',
            questionInstruction: 'Вы можете прочитать все символы?',
            startButton: 'Начать тест',
            yesButton: 'Да',
            noButton: 'Нет',
            restartButton: 'Начать заново',
            lineIndicator: 'Строка',
            of: 'из',
            testComplete: 'Тест завершён!',
            yourVision: 'Ваш уровень зрения:',
            detailedResults: 'Детальные результаты:',
            consultationReminder: 'Пожалуйста, проконсультируйтесь с доктором Каримовой для профессионального обследования глаз.',
            disclaimer: 'Этот тест предназначен только для образовательных целей и не заменяет профессионального обследования глаз.'
        },
        contact: {
            subtitle: 'Свяжитесь с нами',
            title: 'Запишитесь на приём',
            address: 'Адрес',
            phone: 'Телефон',
            email: 'Эл. почта',
            hours: 'Часы работы',
            monFri: 'Пн - Пт: 9:00 - 18:00',
            sat: 'Сб: 9:00 - 14:00',
            sun: 'Вс: Закрыто',
            bookNow: 'Записаться',
            callUs: 'Позвонить',
            visitClinic: 'Посетите нашу клинику',
            address1: 'Улица Бехзода 14',
            address2: 'Душанбе, Таджикистан'
        },
        faq: {
            subtitle: 'Часто задаваемые вопросы',
            title: 'Часто задаваемые вопросы',
            description: 'Найдите ответы на распространённые вопросы о наших офтальмологических услугах в Душанбе',
            question1: 'Как часто нужно проходить обследование глаз?',
            answer1: 'Взрослым без проблем со зрением рекомендуется проходить комплексное обследование глаз каждые 2 года. Если вы носите очки, страдаете диабетом или имеете семейную историю глазных заболеваний, рекомендуются ежегодные обследования. Детям необходимы обследования в 6 месяцев, в 3 года, перед школой, а затем ежегодно.',
            question2: 'Вы принимаете детей? С какого возраста?',
            answer2: 'Да! Доктор Каримова имеет специализированную подготовку в области детской офтальмологии и принимает детей с младенчества до подросткового возраста, используя методы тестирования, адаптированные для детей.',
            question3: 'Что такое синдром сухого глаза и как его лечат?',
            answer3: 'Синдром сухого глаза вызывает жжение, зуд, покраснение и слезотечение из-за недостаточного производства слёз или плохого качества слёзной плёнки. Лечение включает рецептурные глазные капли, пунктальные пробки, терапию тёплыми компрессами и изменение образа жизни. Большинство пациентов видят улучшение в течение 2-4 недель.',
            question4: 'Сколько времени занимает комплексное обследование глаз?',
            answer4: 'Комплексное обследование глаз занимает приблизительно 45-60 минут при первом посещении. Это включает проверку остроты зрения, оценку рефракции, измерение внутриглазного давления, оценку здоровья сетчатки и консультацию с доктором Каримовой.',
            question5: 'Вы подбираете контактные линзы?',
            answer5: 'Да, мы предоставляем профессиональный подбор контактных линз, включая измерение кривизны роговицы и качества слёзной плёнки. Мы предлагаем ежедневные одноразовые, ежемесячные линзы, торические линзы при астигматизме и мультифокальные линзы. Включены полное обучение и постоянная поддержка.',
            question6: 'Где находится ваша клиника в Душанбе?',
            answer6: 'Наша клиника расположена по адресу улица Бехзода 14, Душанбе, Таджикистан. Мы легко доступны с гибким графиком приёма, включая срочную помощь в тот же день при чрезвычайных ситуациях с глазами. Свяжитесь с нами по телефону +992 93 009 71 71.',
            cta: 'Остались вопросы? Мы здесь, чтобы помочь.',
            contactButton: 'Связаться с нами'
        },
        footer: {
            tagline: 'Исключительный уход за глазами с 2017 года',
            servicesTitle: 'Услуги',
            eyeExams: 'Комплексное обследование глаз',
            glasses: 'Очки по рецепту',
            contacts: 'Контактные линзы',
            dryeye: 'Лечение сухости глаз',
            followup: 'Постоянный уход и наблюдение',
            pediatric: 'Детская офтальмология',
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
            faq: 'Саволҳо',
            contact: 'Тамос',
            language: 'Забон'
        },
        hero: {
            subtitle: 'Амалиёти офтальмологӣ',
            title: 'Нигоҳубини истисноии чашм',
            description: 'Хидматҳои офтальмологии шахсӣ барои эҳтиёҷоти беназири бинишии шумо',
            ourServices: 'Хидматҳои мо',
            findUs: 'Моро ёбед'
        },
        services: {
            subtitle: 'Он чӣ мо пешниҳод мекунем',
            title: 'Хидматҳои асосӣ',
            exams: {
                title: 'Санҷишҳои комили чашм',
                description: 'Арзёбии пурраи саломатии чашм бо истифода аз технологияи ташхисии пешрафта',
                detail1: '<strong>Он чӣ мо санҷем:</strong> Санҷиши тезии бинӣ, арзёбии рефраксия, андозагирии фишори дохилии чашм, арзёбии саломатии шабакия ва ошкорсозии ба ҳангоми бемориҳо монанди глаукома, катаракта ва дегенератсияи макулярӣ.',
                detail2: '<strong>Ба кӣ санҷишҳои мунтазам зарур аст:</strong> Одамони калонсол ҳар 2 сол, санҷишҳои ҳарсола барои онҳое, ки диабет, фишори хуни баланд ё таърихи оилавии бемориҳои чашм доранд. Барои нигоҳ доштани саломатии бинишӣ ҳатмӣ аст.',
                detail3: '<strong>Давомнокӣ:</strong> Тақрибан 45-60 дақиқа барои боздиди аввал. Доктор Каримова шахсан ҳамаи натиҷаҳоро санҷида, вариантҳои табобатро бо шумо муҳокима мекунад.'
            },
            glasses: {
                title: 'Айнаки тиббӣ',
                description: 'Айнаки фардӣ мутобиқ ба эҳтиёҷоти бинишӣ ва услуби шумо',
                detail1: '<strong>Интихоби васеъ:</strong> Аз услубҳои гуногуни чорчӯбаҳо, намудҳои линзаҳо (як фокус, прогрессивӣ, бифокалӣ) ва пӯшишҳои махсус, аз ҷумла зидди акси нур, манъкунии нури кабуд ва ҳифзи UV барои иқлими офтобии Тоҷикистон интихоб кунед.',
                detail2: '<strong>Танзимоти касбӣ:</strong> Доктор Каримова мавқеи дурусти линзаҳо, танзимоти чорчӯба ва осоишро таъмин мекунад. Мо тавсияҳо оид ба нигоҳубин ва хизматрасонии линзаҳо барои айнаки дарозмуҳлат пешниҳод мекунем.',
                detail3: '<strong>Барои ҳамаи синну солҳо:</strong> Танзимоти махсус барои кӯдакон, одамони калонсол ва пиронсолон. Инчунин айнакҳои компютерӣ ва хондан дастрасанд.'
            },
            contacts: {
                title: 'Линзаҳои тамосӣ',
                description: 'Интихоби касбӣ ва нигоҳубин барои истифодаи бароҳати линзаҳои тамосӣ',
                detail1: '<strong>Вариантҳои линзаҳо:</strong> Рӯзонаи якбора истифодашаванда, ивазкунии ҳармоҳа, линзаҳои торикӣ барои астигматизм, линзаҳои мултифокалӣ барои пресбиопия ва линзаҳои махсус барои чашмҳои мушкили интихобшаванда. Мо бо брендҳои пешрафтаи байналмилалӣ кор мекунем.',
                detail2: '<strong>Таълим ва дастгирӣ:</strong> Таълими пурраи гузоштан ва баровардан, усулҳои дурусти тозакунӣ ва дастгирии доимӣ. Боздидҳои минбаъда осоиши мувофиқ ва ислоҳи бинишро таъмин мекунанд.',
                detail3: '<strong>Истифодабарандагони нав хуш омадед:</strong> Барои тарзи ҳаёти фаъол, варзиш ё онҳое, ки алтернатива ба айнак меҷӯянд, комил аст. Аксари беморон дар давоми 3-7 рӯз мутобиқ мешаванд.'
            },
            dryeye: {
                title: 'Табобати хушкии чашм',
                description: 'Усулҳои муассир барои бартараф кардани ноароҳатӣ ва барқарор кардани намии чашм',
                detail1: '<strong>Равиши табобатии мо:</strong> Доктор Каримова арзёбии комилии хушкии чашмро иҷро мекунад, аз ҷумла таҳлили пардаи ашкӣ ва арзёбии ғадудҳои мейбомӣ. Вариантҳои табобат шомили қатраҳои чашмии рецептӣ (циклоспорин, лифитеграст), пробкаҳои панкталӣ барои нигоҳ доштани ашки табиӣ, табобати компрессҳои гарм ва тағирдиҳии тарзи ҳаёт мебошанд.',
                detail2: '<strong>Технологияи пешрафта:</strong> Мо санҷиши осмолярии TearLab-ро барои андозагирии сифати пардаи ашкӣ ва муайян кардани сабаби аслии аломатҳои хушкии чашм истифода мебарем, ки нақшаҳои шахсии табобатро таъмин мекунад.',
                detail3: '<strong>Ба кӣ фоида меоварад:</strong> Барои беморони дучори хастагии чашм аз экранҳо, ноароҳатии линзаҳои тамосӣ, хушкӣ баъд аз LASIK ё кам шудани истеҳсоли ашк аз синну сол идеалӣ аст. Аксари беморон дар давоми 2-4 ҳафта беҳбудиро мебинанд.'
            },
            followup: {
                title: 'Нигоҳубини доимӣ ва пайгирӣ',
                description: 'Назорати доимӣ ва нақшаҳои фардии нигоҳубин барои саломатии дарозмуҳлати чашм',
                detail1: '<strong>Идоракунии ҳолатҳои музмин:</strong> Пайгирии махсус барои беморони глаукома, назорати ретинопатияи диабетӣ, нигоҳубини баъд аз ҷарроҳӣ ва пайгирии пешрафт барои назорати миопия дар кӯдакон.',
                detail2: '<strong>Нигоҳубини пешгирӣ:</strong> Назорати мунтазам барои ошкор кардани мушкилот дар марҳилаи ибтидоӣ, вақте ки онҳо беҳтарин табобат мешаванд, кӯмак мекунад. Мо сабтҳои муфассали таърихи саломатии чашми шуморо барои нигоҳубини комил ва ҳамоҳангшуда нигоҳ медорем.',
                detail3: '<strong>Ҷадвали қулай:</strong> Вақти фарогири чандир, аз ҷумла кӯмаки таъҷилии ҳамон рӯз барои фавриятҳои чашмӣ. Системаи ёдрас кардан таъмин мекунад, ки шумо ҳеҷ гоҳ пайгириҳои муҳимро гум намекунед.'
            },
            pediatric: {
                title: 'Нигоҳубини чашми кӯдакон',
                description: 'Нигоҳубини махсус ва мулоим барои чашми кӯдакон',
                detail1: '<strong>Бемориҳое, ки мо табобат мекунем:</strong> Амблиопия (чашми танбал), страбизм (чашмҳои қач), назорати пешравии миопия, хатоҳои рефраксионӣ ва мушкилоти рушди бинӣ. Усулҳои санҷиши мувофиқ барои кӯдакон санҷишҳоро барои оилаҳо бидуни танг мекунанд.',
                detail2: '<strong>Нигоҳубини мувофиқ ба синну сол:</strong> Мо кӯдаконро аз кӯдакии бемазмун (аз 6 моҳа), кӯдаконро, кӯдакони синни мактабӣ ва наврасонро қабул мекунем. Таҷҳизоти махсус барои кӯдакон тарроҳишуда ташхиси дақиқро ҳатто дар беморони ғайривербалӣ низ таъмин мекунад.',
                detail3: '<strong>Маълумот додан ба волидайн:</strong> Мо волидайнро дар ҳар қадам ҷалб карда, натиҷаҳоро возеҳ шарҳ дода, дастурҳои нигоҳубинро дар хона пешниҳод мекунем. Тавсияҳои скринингии бинӣ: 6 моҳагӣ, 3 солагӣ, пеш аз мактаб, сипас ҳар сол.'
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
            quote1: '"Доктор Каримова дар вақти маслиҳат барои интихоби айнак нигоҳубини беназир таъмин кард. Диққати ӯ ба тафсилот ва маҳорат ба ман кӯмак кард, то рецепти комил ёбам. Сифати нигоҳубин ва хидмати шахсӣ интизориҳои маро аз ҳад гузаронид."',
            name1: 'Фаррух Раҳимов',
            patient1: 'Бемори айнакӣ',
            quote2: '"Баъд аз солҳои душворӣ бо линзаҳои тамосӣ, доктор Каримова ба ман кӯмак кард, то роҳаттарин линзаҳоро барои чашмонам ёбам. Маҳорат ва сабри ӯ ҳама чизро иваз кард. Акнун ман метавонам онҳоро тамоми рӯз бе ҳеҷ гуна ноароҳатӣ истифода барам. Пешниҳод мекунам!"',
            name2: 'Дилшода Назарова',
            patient2: 'Бемори линзаҳои тамосӣ',
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
        visionTest: {
            subtitle: 'Бинишатонро санҷед',
            title: 'Санҷиши интерактивии бинӣ',
            initialInstruction: 'Санҷиши интерактивии биниши моро санҷед. Дар масофаи 50 см аз экран нишинед. Як чашматонро пӯшонед.',
            questionInstruction: 'Шумо ҳамаи аломатҳоро хонда метавонед?',
            startButton: 'Оғози санҷиш',
            yesButton: 'Ҳа',
            noButton: 'Не',
            restartButton: 'Аз нав оғоз кунед',
            lineIndicator: 'Сатр',
            of: 'аз',
            testComplete: 'Санҷиш анҷом ёфт!',
            yourVision: 'Сатҳи бинишии шумо:',
            detailedResults: 'Натиҷаҳои муфассал:',
            consultationReminder: 'Лутфан, бо доктор Каримова барои санҷиши касбии чашм маслиҳат кунед.',
            disclaimer: 'Ин санҷиш танҳо барои мақсадҳои таълимӣ мебошад ва санҷиши касбии чашмро иваз намекунад.'
        },
        contact: {
            subtitle: 'Бо мо тамос гиред',
            title: 'Барои вохӯрӣ сабти ном кунед',
            address: 'Суроға',
            phone: 'Телефон',
            email: 'Почтаи электронӣ',
            hours: 'Соатҳои корӣ',
            monFri: 'Душ - Ҷум: 9:00 - 18:00',
            sat: 'Шан: 9:00 - 14:00',
            sun: 'Якш: Пӯшида',
            bookNow: 'Сабти ном',
            callUs: 'Занг занед',
            visitClinic: 'Клиникаи моро боздид кунед',
            address1: 'Кӯчаи Беҳзод 14',
            address2: 'Душанбе, Тоҷикистон'
        },
        faq: {
            subtitle: 'Саволҳои маъмул',
            title: 'Саволҳои зиёд пурсидашаванда',
            description: 'Ҷавобҳоро барои саволҳои маъмул дар бораи хидматҳои нигоҳубини чашми мо дар Душанбе ёбед',
            question1: 'Чанд вақт аз чанд вақт бояд санҷиши чашм гузаронам?',
            answer1: 'Одамони калонсол бе мушкилоти бинӣ бояд ҳар 2 сол санҷишҳои комили чашмро гузаронанд. Агар шумо айнак пӯшед, диабет дошта бошед ё таърихи оилавии бемориҳои чашм дошта бошед, санҷишҳои ҳарсола тавсия дода мешаванд. Кӯдакон бояд дар 6 моҳагӣ, 3 солагӣ, пеш аз мактаб ва баъд ҳар сол санҷиш гузаронанд.',
            question2: 'Шумо кӯдаконро қабул мекунед? Аз кадом синну сол?',
            answer2: 'Бале! Доктор Каримова таълими махсуси офтальмологияи кӯдакон дорад ва кӯдаконро аз кӯдакии бемазмун то синни наврасӣ бо истифода аз усулҳои санҷиши мутобиқ ба кӯдакон қабул мекунад.',
            question3: 'Синдроми хушкии чашм чист ва чӣ тавр табобат карда мешавад?',
            answer3: 'Синдроми хушкии чашм сӯхтори, хориш, сурхӣ ва обравии чашмро аз сабаби истеҳсоли ношоями ашк ё сифати бади пардаи ашкӣ боис мешавад. Табобат шомили қатраҳои чашмии рецептӣ, пробкаҳои панкталӣ, табобати компрессҳои гарм ва тағирдиҳои тарзи ҳаёт мебошад. Аксари беморон дар давоми 2-4 ҳафта беҳтаршавиро мебинанд.',
            question4: 'Санҷиши комили чашм чанд вақт давом мекунад?',
            answer4: 'Санҷиши комили чашм тақрибан 45-60 дақиқа барои боздиди аввали шумо давом мекунад. Ин шомили санҷиши тезии бинӣ, арзёбии рефраксия, андозагирии фишори дохилии чашм, арзёбии саломатии шабакия ва маслиҳат бо доктор Каримова мебошад.',
            question5: 'Шумо линзаҳои тамосиро интихоб мекунед?',
            answer5: 'Бале, мо интихоби касбии линзаҳои тамосиро пешниҳод мекунем, аз ҷумла андозагирии қавси роғаи чашм ва сифати пардаи ашкӣ. Мо линзаҳои рӯзонаи якбора истифодашаванда, ивазкунии ҳармоҳа, линзаҳои торикӣ барои астигматизм ва линзаҳои мултифокалӣ пешниҳод мекунем. Таълими комил ва дастгирии доимӣ дохил карда шудааст.',
            question6: 'Клиникаи шумо дар Душанбе дар куҷост?',
            answer6: 'Клиникаи мо дар суроғаи кӯчаи Беҳзод 14, Душанбе, Тоҷикистон ҷойгир аст. Мо осон дастрасем бо вақти фарогирии чандир, аз ҷумла кӯмаки таъҷилии ҳамон рӯз барои фавриятҳои чашмӣ. Бо мо тамос гиред аз тариқи телефони +992 93 009 71 71.',
            cta: 'Ҳанӯз саволҳо доред? Мо дар ин ҷо ҳастем, то кӯмак расонем.',
            contactButton: 'Бо мо тамос гиред'
        },
        footer: {
            tagline: 'Нигоҳубини истисноии чашм аз соли 2017',
            servicesTitle: 'Хидматҳо',
            eyeExams: 'Санҷишҳои комили чашм',
            glasses: 'Айнаки тиббӣ',
            contacts: 'Линзаҳои тамосӣ',
            dryeye: 'Табобати хушкии чашм',
            followup: 'Нигоҳубини доимӣ ва пайгирӣ',
            pediatric: 'Нигоҳубини чашми кӯдакон',
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
    // Detect language from URL parameter or localStorage or default to 'en'
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    let currentLang = urlLang || localStorage.getItem('language') || 'en';

    // Validate language code (only allow en, ru, tj)
    if (!['en', 'ru', 'tj'].includes(currentLang)) {
        currentLang = 'en';
    }

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

        // Update canonical URL for SEO (language-specific canonical)
        const canonicalUrl = document.getElementById('canonical-url');
        if (canonicalUrl) {
            const baseUrl = 'https://sitorakarimi.com/';
            if (lang === 'en') {
                canonicalUrl.setAttribute('href', baseUrl);
            } else {
                canonicalUrl.setAttribute('href', `${baseUrl}?lang=${lang}`);
            }
        }

        // Update browser URL without reloading (for better SEO and bookmarking)
        const url = new URL(window.location);
        if (lang === 'en') {
            url.searchParams.delete('lang');
        } else {
            url.searchParams.set('lang', lang);
        }
        window.history.replaceState({}, '', url);

        // Dispatch custom event for other modules (like vision test)
        document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
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
    const heroImage = heroSection?.querySelector('img');

    // Only enable parallax on desktop to prevent mobile jitter
    if (window.innerWidth > 768) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            if (heroImage && scrollPosition < window.innerHeight) {
                const parallaxSpeed = 0.3;
                // Use transform on the image element instead of background position
                heroImage.style.transform = `translateY(${scrollPosition * parallaxSpeed}px)`;
            }
        });
    }


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
    sections.forEach(section => {
        const revealElements = section.querySelectorAll('h2, p, .btn-navy, .btn-outline');
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
    // Service Worker Registration (for PWA support)
    // ===========================
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(() => console.log('Service Worker registered successfully'))
            .catch(err => console.log('Service Worker registration failed:', err));
    }

});
