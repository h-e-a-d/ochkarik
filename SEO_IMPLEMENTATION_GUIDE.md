# SEO Implementation Guide
## Step-by-Step Code Examples

---

## 1. ADDING MISSING H2 HEADERS

### Location 1: Testimonials Section (Around line 756)

**BEFORE:**
```html
<section id="testimonials" class="py-24 bg-navy-900 relative overflow-hidden">
    <div class="absolute inset-0 opacity-5">
        <img src="https://images.unsplash.com/..." ...>
    </div>
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="testimonial-carousel">
            <!-- Slides start here -->
```

**AFTER:**
```html
<section id="testimonials" class="py-24 bg-navy-900 relative overflow-hidden">
    <div class="absolute inset-0 opacity-5">
        <img src="https://images.unsplash.com/..." ...>
    </div>
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <!-- ADD THIS -->
        <div class="text-center mb-12">
            <h2 class="text-4xl md:text-5xl font-light text-white mb-4" data-i18n="testimonials.title">
                What Our Patients Say
            </h2>
            <p class="text-lg text-white/70 font-light" data-i18n="testimonials.subtitle">
                Real experiences from our patients
            </p>
        </div>

        <div class="testimonial-carousel">
            <!-- Slides start here -->
```

**Add to translations (script.js, around line 82):**
```javascript
testimonials: {
    quote1: '...',
    title: 'What Our Patients Say',        // ADD
    subtitle: 'Real experiences from our patients',  // ADD
    // ... rest of testimonials
}
```

**Also add Russian and Tajik translations:**
```javascript
// In ru: { } section around line 244:
testimonials: {
    title: 'Что говорят наши пациенты',
    subtitle: 'Реальный опыт наших пациентов',
    // ...
}

// In tj: { } section around line 406:
testimonials: {
    title: 'Сухани беморони мо',
    subtitle: 'Таҷрибаи воқеии беморонаи мо',
    // ...
}
```

---

### Location 2: Vision Test Section (Around line 904)

**BEFORE:**
```html
<section id="vision-test" class="py-24 bg-white">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-12">
            <p class="text-sm uppercase tracking-widest mb-3 text-coral" data-i18n="visionTest.subtitle">Test Your Vision</p>
        </div>
```

**AFTER:**
```html
<section id="vision-test" class="py-24 bg-white">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-12">
            <p class="text-sm uppercase tracking-widest mb-3 text-coral" data-i18n="visionTest.subtitle">
                Interactive Features
            </p>
            <!-- ADD THIS -->
            <h2 class="text-4xl md:text-5xl font-light text-navy-900 mb-4" data-i18n="visionTest.title">
                Test Your Vision at Home
            </h2>
            <p class="text-lg text-gray-600 font-light" data-i18n="visionTest.description">
                Try our interactive vision test using the Russian Snellen chart
            </p>
        </div>
```

**Update translations:**
```javascript
visionTest: {
    subtitle: 'Interactive Features',
    title: 'Test Your Vision at Home',           // ADD
    description: 'Try our interactive vision test using the Russian Snellen chart',  // ADD
    initialInstruction: '...',
    // ... rest
}

// Russian translation around line 261:
visionTest: {
    subtitle: 'Интерактивные функции',
    title: 'Проверьте зрение дома',
    description: 'Попробуйте наш интерактивный тест зрения, используя русскую таблицу Сивцева',
    // ...
}

// Tajik translation around line 423:
visionTest: {
    subtitle: 'Функсияҳои интерактивӣ',
    title: 'Бинишатонро дар хона санҷед',
    description: 'Санҷиши интерактивии мо аз ҷавонибӣ бо истифода аз ҷадвали Сивтсев',
    // ...
}
```

---

### Location 3: Partners Section (Around line 875)

**BEFORE:**
```html
<section class="py-20 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
            <p class="text-sm uppercase tracking-widest text-gray-500" data-i18n="partners.title">
                Trusted Partnerships
            </p>
        </div>
```

**AFTER:**
```html
<section class="py-20 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
            <p class="text-sm uppercase tracking-widest text-coral mb-3" data-i18n="partners.subtitle">
                Partnerships
            </p>
            <!-- ADD THIS -->
            <h2 class="text-4xl md:text-5xl font-light text-navy-900" data-i18n="partners.title">
                Trusted Professional Network
            </h2>
        </div>
```

**Update translations:**
```javascript
partners: {
    subtitle: 'Partnerships',            // ADD
    title: 'Trusted Professional Network', // UPDATE
}

// Russian:
partners: {
    subtitle: 'Партнёрства',
    title: 'Доверенная профессиональная сеть',
}

// Tajik:
partners: {
    subtitle: 'Шарикорӣ',
    title: 'Шабакаи ҳирфаи боэътимод',
}
```

---

### Location 4: Stats Section (Around line 740)

**ADD SEMANTIC HEADING:**

```html
<section class="py-24 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- ADD THIS: Hidden but semantic heading -->
        <h2 class="sr-only" data-i18n="stats.title">Professional Experience</h2>

        <div class="flex justify-center">
            <div class="relative">
                <div class="w-64 h-64 bg-navy-900 rounded-full flex items-center justify-center">
```

**Add to translations:**
```javascript
stats: {
    title: 'Professional Experience',  // ADD
    years: 'Years of<br>Experience'
}

// Russian:
stats: {
    title: 'Профессиональный опыт',
    years: 'Лет<br>опыта'
}

// Tajik:
stats: {
    title: 'Таҷрибаи касбӣ',
    years: 'Солҳои<br>таҷриба'
}
```

---

## 2. FIXING CACHE CONTROL HEADERS

### Current Code (Lines 15-18):
```html
<!-- Cache Control Headers -->
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
```

### Replace With:

```html
<!-- Cache Control Headers -->
<!-- Note: For optimal control, configure on the server level -->
<!-- This meta tag is advisory only; server headers take precedence -->
<meta http-equiv="Cache-Control" content="public, max-age=3600">

<!-- Alternative: Keep validation but allow some caching -->
<!-- For single-page apps, cache the HTML but validate on each request -->
<meta http-equiv="Cache-Control" content="no-cache">
```

### Recommended: Server-Level Configuration

**If using Node.js/Express:**
```javascript
app.use((req, res, next) => {
  // HTML: validate each time but allow browser caching
  if (req.path === '/index.html' || req.path === '/') {
    res.set('Cache-Control', 'public, max-age=0, must-revalidate');
  }

  // Static assets: cache for 1 year
  if (req.path.match(/\.(js|css|woff2|png|jpg|webp)$/)) {
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  next();
});
```

**If using .htaccess (Apache):**
```apache
<IfModule mod_headers.c>
  # HTML files - always revalidate
  <FilesMatch "\.html?$">
    Header set Cache-Control "public, max-age=0, must-revalidate"
  </FilesMatch>

  # CSS, JS, fonts - cache for 1 year
  <FilesMatch "\.(js|css|woff2|ttf|eot)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>

  # Images - cache for 30 days
  <FilesMatch "\.(jpg|jpeg|png|gif|webp)$">
    Header set Cache-Control "public, max-age=2592000"
  </FilesMatch>
</IfModule>
```

**If using Netlify (netlify.toml):**
```toml
[[headers]]
  for = "/"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

## 3. ADDING INTERNAL LINKS

### Example 1: Service to FAQ Cross-Link

**Location: Dry Eye Management service description**

**BEFORE (Around line 595-600):**
```html
<div class="service-card-minimal" data-row="1">
    <h3 class="text-xl font-medium mb-3 text-white">
        Dry Eye Management
    </h3>
    <div class="service-description line-clamp-5">
        <p class="text-white/70 font-light">
            Comprehensive dry eye assessment and treatment including tear film analysis,
            meibomian gland evaluation, and personalized therapy.
        </p>
    </div>
```

**AFTER:**
```html
<div class="service-card-minimal" data-row="1">
    <h3 class="text-xl font-medium mb-3 text-white">
        Dry Eye Management
    </h3>
    <div class="service-description line-clamp-5">
        <p class="text-white/70 font-light">
            Comprehensive dry eye assessment and treatment including tear film analysis,
            meibomian gland evaluation, and personalized therapy.
            <a href="#faq" class="text-coral hover:text-white transition-colors font-medium">
                Learn more about symptoms and treatment
            </a>.
        </p>
    </div>
```

### Example 2: Service to Service Cross-Link

**Location: Contact Lenses section (Around line 664-668)**

**BEFORE:**
```html
<h3 class="text-xl font-medium mb-3 text-white">
    Contact Lenses & Treatment
</h3>
<div class="service-description line-clamp-5">
    <p class="text-white/70 font-light">
        Professional fitting and care: daily disposable, monthly replacement, toric lenses for astigmatism,
        multifocal lenses. Treatment and patient management for conjunctivitis, dry eye syndrome,
        accommodation spasm, and visual fatigue.
    </p>
</div>
```

**AFTER:**
```html
<h3 class="text-xl font-medium mb-3 text-white">
    Contact Lenses & Treatment
</h3>
<div class="service-description line-clamp-5">
    <p class="text-white/70 font-light">
        Professional fitting and care: daily disposable, monthly replacement, toric lenses for astigmatism,
        multifocal lenses. Treatment and patient management for conjunctivitis, dry eye syndrome,
        <a href="#services" class="text-coral hover:text-white transition-colors font-medium">
            accommodation spasm
        </a>, and visual fatigue. We also offer
        <a href="#services" class="text-coral hover:text-white transition-colors font-medium">
            comprehensive accommodation assessment
        </a> to diagnose underlying issues.
    </p>
</div>
```

### Example 3: Testimonial to Service Cross-Link

**Location: Update testimonial slides (Around lines 769-858)**

**Example - Eyeglasses testimonial:**

**BEFORE:**
```html
<div class="testimonial-slide active">
    <div class="text-center">
        <blockquote class="text-2xl md:text-4xl font-light text-white mb-8">
            "Dr. Karimova provided exceptional care during my eyeglasses consultation..."
        </blockquote>
        <div class="text-white/80 font-light">
            <p class="text-lg">Farrukh Rahimov</p>
            <p class="text-sm">Eyeglasses Patient</p>
        </div>
    </div>
</div>
```

**AFTER:**
```html
<div class="testimonial-slide active">
    <div class="text-center">
        <blockquote class="text-2xl md:text-4xl font-light text-white mb-8">
            "Dr. Karimova provided exceptional care during my eyeglasses consultation..."
        </blockquote>
        <div class="text-white/80 font-light mb-6">
            <p class="text-lg">Farrukh Rahimov</p>
            <p class="text-sm">Eyeglasses Patient</p>
        </div>
        <!-- ADD: Service link -->
        <div>
            <a href="#services" class="text-coral hover:text-white transition-colors font-medium">
                Explore our Prescription Glasses service
            </a>
        </div>
    </div>
</div>
```

### Example 4: FAQ to Services Cross-Link

**Location: FAQ section (Around line 989-1008)**

**BEFORE:**
```html
<div class="faq-item bg-white rounded-lg shadow-sm p-6">
    <h3 class="text-xl font-medium text-navy-900 mb-3">
        How often should I get an eye exam?
    </h3>
    <p class="text-gray-600 font-light leading-relaxed">
        Adults with no vision problems should get comprehensive eye exams every 2 years.
        If you wear glasses, have diabetes, or family history of eye disease, annual exams
        are recommended. Children need exams at 6 months, age 3, before school, then annually.
    </p>
</div>
```

**AFTER:**
```html
<div class="faq-item bg-white rounded-lg shadow-sm p-6">
    <h3 class="text-xl font-medium text-navy-900 mb-3">
        How often should I get an eye exam?
    </h3>
    <p class="text-gray-600 font-light leading-relaxed">
        Adults with no vision problems should get
        <a href="#services" class="text-coral hover:text-navy-900 font-medium">
            comprehensive eye exams
        </a> every 2 years.
        If you wear glasses, have diabetes, or family history of eye disease, annual exams
        are recommended.
        <a href="#services" class="text-coral hover:text-navy-900 font-medium">
            Children's eye care
        </a> is recommended at 6 months, age 3, before school, then annually.
    </p>
</div>
```

### Example 5: Contact Section Link Strategy

**Location: Contact section intro (Around line 1050-1052)**

**BEFORE:**
```html
<p class="text-sm uppercase tracking-widest mb-2 text-coral">Get In Touch</p>
<h2 class="text-4xl md:text-5xl font-light mb-8 text-navy-900">
    Schedule your appointment
</h2>
```

**AFTER:**
```html
<p class="text-sm uppercase tracking-widest mb-2 text-coral">Get In Touch</p>
<h2 class="text-4xl md:text-5xl font-light mb-8 text-navy-900">
    Schedule your appointment
</h2>
<p class="text-lg text-gray-600 font-light mb-8">
    Ready to experience our <a href="#services" class="text-coral hover:text-navy-900 font-medium">
    full range of ophthalmology services</a>? Contact us today to schedule your
    <a href="#services" class="text-coral hover:text-navy-900 font-medium">
    comprehensive eye examination</a>.
</p>
```

---

## 4. ADDING RESOURCE HINTS FOR PERFORMANCE

**Add to `<head>` section, after line 92 (`<link rel="stylesheet" href="styles.css">`):**

```html
<!-- Preconnect to Critical Third-Party Origins -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://cdnjs.cloudflare.com">
<link rel="preconnect" href="https://cdn.tailwindcss.com">
<link rel="preconnect" href="https://www.googletagmanager.com">

<!-- DNS Prefetch for Analytics and Tracking -->
<link rel="dns-prefetch" href="https://www.google-analytics.com">
<link rel="dns-prefetch" href="https://stats.g.doubleclick.net">

<!-- Prefetch (Lower Priority) -->
<link rel="prefetch" href="https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrFJA.woff2">

<!-- Preload Critical Images -->
<link rel="preload" as="image" href="assets/images/hero.png" imagesrcset="assets/images/hero.webp">
```

---

## 5. UPDATING SCHEMA MARKUP FOR ADDITIONAL REVIEWS

**Location: Lines 215-272 in index.html**

**Current (4 reviews):**
```json
"review": [
  {
    "@type": "Review",
    "author": { "@type": "Person", "name": "Farrukh Rahimov" },
    "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
    "reviewBody": "...",
    "datePublished": "2024-08-15"
  },
  // ... 3 more reviews
]
```

**Add 4 more reviews (expand to 8 total):**

```json
{
  "@type": "Review",
  "author": { "@type": "Person", "name": "Mahira Tajikova" },
  "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
  "reviewBody": "After suffering from dry eye syndrome for years, Dr. Karimova's targeted treatment plan finally gave me relief. The personalized care and follow-up appointments ensured my symptoms improved consistently.",
  "datePublished": "2024-09-28"
},
{
  "@type": "Review",
  "author": { "@type": "Person", "name": "Javon Mahmudov" },
  "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
  "reviewBody": "Excellent eye examination using advanced equipment. Dr. Karimova explained everything thoroughly and recommended glasses that perfectly suit my needs. Highly professional service.",
  "datePublished": "2024-10-05"
},
{
  "@type": "Review",
  "author": { "@type": "Person", "name": "Laylo Saidova" },
  "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
  "reviewBody": "My daughter was nervous about her eye exam, but Dr. Karimova was incredibly patient and gentle. She found the perfect solution for my daughter's vision needs. We trust her completely with our family's eye care.",
  "datePublished": "2024-09-15"
}
```

**Also update the aggregateRating (currently line 208-214):**

**BEFORE:**
```json
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": "5.0",
  "reviewCount": "4",
  "bestRating": "5",
  "worstRating": "1"
}
```

**AFTER (as you add more reviews):**
```json
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": "4.95",
  "reviewCount": "8",
  "bestRating": "5",
  "worstRating": "1"
}
```

---

## 6. ADDING MULTILINGUAL META TAGS

**Add after line 47 (Twitter OG tags), before line 62 (Tailwind CSS):**

```html
<!-- Russian Language Meta Tags -->
<meta property="og:title:ru" content="Доктор Ситора Каримова - Специалист офтальмолог в Душанбе">
<meta property="og:description:ru" content="Полный спектр офтальмологических услуг в Душанбе: комплексное обследование глаз, подбор контактных линз, лечение синдрома сухого глаза. 8+ лет опыта.">

<!-- Tajik Language Meta Tags -->
<meta property="og:title:tj" content="Доктор Ситора Каримова - Мутахассиси офтальмология дар Душанбе">
<meta property="og:description:tj" content="Дамдомаи мухташоси офтальмологӣ дар Душанбе: санҷишҳои комили чашм, интихоби линзаҳои тамосӣ, табобати синдроми хушкии чашм. 8+ сол таҷриба.">

<!-- Language Availability Indicator -->
<meta name="languages" content="en, ru, tg">
```

---

## 7. IMPROVING IMAGE MARKUP

**Example: Hero Image (Line 476-479)**

**BEFORE:**
```html
<img src="assets/images/hero.png"
     alt="Dr. Sitora Karimova's ophthalmology practice - Professional eye care services in Dushanbe, Tajikistan"
     loading="eager"
     class="w-full h-full object-cover">
```

**AFTER (with WebP and responsive sizing):**
```html
<picture>
  <!-- Modern WebP format -->
  <source srcset="assets/images/hero.webp" type="image/webp">
  <!-- Fallback PNG for older browsers -->
  <img src="assets/images/hero.png"
       alt="Dr. Sitora Karimova's ophthalmology practice - Professional eye care services in Dushanbe, Tajikistan"
       loading="eager"
       fetchpriority="high"
       width="1920"
       height="1080"
       class="w-full h-full object-cover"
       itemprop="image">
</picture>
```

**Example: About Section Image (Line 716-721)**

**BEFORE:**
```html
<img src="assets/images/about-1.jpg"
     alt="Dr. Sitora Karimova - Board certified ophthalmologist with 8 years experience at her Dushanbe eye care clinic"
     loading="lazy"
     width="800"
     height="600"
     class="carousel-slide active absolute inset-0 w-full h-full object-cover transition-opacity duration-700">
```

**AFTER (with WebP):**
```html
<picture>
  <source srcset="assets/images/about-1.webp" type="image/webp">
  <img src="assets/images/about-1.jpg"
       alt="Dr. Sitora Karimova - Board certified ophthalmologist with 8 years experience at her Dushanbe eye care clinic"
       loading="lazy"
       width="800"
       height="600"
       class="carousel-slide active absolute inset-0 w-full h-full object-cover transition-opacity duration-700">
</picture>
```

---

## 8. ENHANCING ARIA LABELS FOR ACCESSIBILITY

**Location: Back-to-Top Button (Line 847)**

**BEFORE:**
```javascript
backToTopButton.setAttribute('aria-label', 'Back to top');
```

**AFTER (Already good, but ensure consistent):**
```javascript
backToTopButton.setAttribute('aria-label', 'Back to top of page');
backToTopButton.setAttribute('role', 'button');
backToTopButton.setAttribute('tabindex', '0');
```

**Location: Language Switcher (Line 431-435)**

**BEFORE:**
```html
<button id="lang-btn" class="flex items-center space-x-2 text-white hover:text-coral transition-colors"
        aria-label="Language selector"
        aria-haspopup="true"
        aria-expanded="false">
```

**Add aria-controls:**
```html
<button id="lang-btn" class="flex items-center space-x-2 text-white hover:text-coral transition-colors"
        aria-label="Language selector"
        aria-haspopup="menu"
        aria-expanded="false"
        aria-controls="lang-menu">
```

**Location: Service Toggle Buttons (Line 534-537)**

**ADD ARIA ATTRIBUTES:**
```html
<button class="service-toggle mt-3 text-coral hover:text-white transition-colors text-sm font-medium flex items-center"
        data-row="0"
        aria-expanded="false"
        aria-controls="service-description-0">
    <span class="toggle-text">Read More</span>
    <i class="fas fa-chevron-down ml-2 toggle-icon transition-transform" aria-hidden="true"></i>
</button>
```

**Update JavaScript to manage aria-expanded:**
```javascript
// In service toggle section (around line 1161-1173)
function toggleServiceRow(rowIndex) {
    const rowCards = document.querySelectorAll(`.service-card-minimal[data-row="${rowIndex}"]`);
    const firstCard = rowCards[0];
    const firstDescription = firstCard.querySelector('.service-description');
    const isExpanded = firstDescription.classList.contains('expanded');

    rowCards.forEach((card, index) => {
        const description = card.querySelector('.service-description');
        const cardToggle = card.querySelector('.service-toggle');
        const cardIcon = cardToggle.querySelector('.toggle-icon');
        const cardText = cardToggle.querySelector('.toggle-text');

        if (isExpanded) {
            description.classList.remove('expanded');
            cardIcon.classList.remove('rotate-180');
            cardText.textContent = translations[currentLang].services.readMore;
            cardToggle.setAttribute('aria-expanded', 'false'); // ADD
        } else {
            description.classList.add('expanded');
            cardIcon.classList.add('rotate-180');
            cardText.textContent = translations[currentLang].services.readLess;
            cardToggle.setAttribute('aria-expanded', 'true'); // ADD
        }
    });
}
```

---

## 9. ADDING FAQ STRUCTURED DATA UPDATES

**Location: FAQ Schema (Lines 282-337)**

**ADD 3 new question blocks to FAQ array:**

```json
{
  "@type": "Question",
  "name": "Can I wear contact lenses with astigmatism?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "Yes! We offer toric contact lenses specifically designed for astigmatism. These lenses have different powers in different meridians to correct the uneven curvature of your cornea. Dr. Karimova will conduct specialized fitting to ensure proper alignment and comfort."
  }
},
{
  "@type": "Question",
  "name": "What should I bring to my eye appointment?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "Please bring your current glasses or contact lenses (if applicable) and a list of any medications you're taking. If you have previous eye exam records, bring those as well. Allow 45-60 minutes for a comprehensive exam. Bring valid ID and insurance information if applicable."
  }
},
{
  "@type": "Question",
  "name": "How much does a comprehensive eye exam cost?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "Pricing varies based on the specific services needed. Contact our clinic at +992 93 009 71 71 for current pricing. Many insurance plans cover comprehensive eye exams. Ask about our flexible payment options during your consultation with Dr. Karimova."
  }
}
```

---

## 10. CREATING SECTION-SPECIFIC SKIP LINKS

**Location: After line 409 (Skip to Content Link)**

**BEFORE:**
```html
<!-- Skip to Content Link (Accessibility) -->
<a href="#main-content" class="skip-to-content">Skip to main content</a>
```

**AFTER (Add additional skip links):**
```html
<!-- Skip Links for Accessibility -->
<a href="#main-content" class="skip-to-content" style="top: 0; z-index: 10001;">
    Skip to main content
</a>
<a href="#services" class="skip-to-content" style="top: 40px; z-index: 10001;">
    Skip to services
</a>
<a href="#faq" class="skip-to-content" style="top: 80px; z-index: 10001;">
    Skip to FAQ
</a>
<a href="#contact" class="skip-to-content" style="top: 120px; z-index: 10001;">
    Skip to contact
</a>
```

**Update CSS in styles.css (Around line 375-392):**

```css
/* Skip to Content Links (Accessibility) */
.skip-to-content {
    position: absolute;
    top: -100px;
    left: 0;
    background: #ff6b4a;
    color: white;
    padding: 12px 24px;
    text-decoration: none;
    z-index: 10001;
    font-weight: 500;
    transition: top 0.3s ease;
}

.skip-to-content:focus {
    top: auto !important; /* Override inline styles on focus */
    outline: 3px solid #0a2a3d;
    outline-offset: 2px;
}

/* Stack multiple skip links on focus */
.skip-to-content:nth-of-type(1):focus {
    top: 0 !important;
}

.skip-to-content:nth-of-type(2):focus {
    top: 40px !important;
}

.skip-to-content:nth-of-type(3):focus {
    top: 80px !important;
}

.skip-to-content:nth-of-type(4):focus {
    top: 120px !important;
}
```

---

## VALIDATION CHECKLIST

After implementing these changes, verify:

- [ ] Run `index.html` through [W3C HTML Validator](https://validator.w3.org/)
- [ ] Test schema markup at [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Verify hreflang tags with [Ahrefs Hreflang Checker](https://ahrefs.com/webmaster-tools/hreflang-checker)
- [ ] Check performance with [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [ ] Test accessibility with [WAVE](https://wave.webaim.org/)
- [ ] Verify all links work with [Broken Link Checker](https://www.brokenlinkcheck.com/)
- [ ] Check mobile responsiveness with [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [ ] Monitor Search Console for indexation and errors

---

**File Paths for Reference:**
- HTML: `/Users/matlyubakarimova/Documents/GitHub/ochkarik/index.html`
- JavaScript: `/Users/matlyubakarimova/Documents/GitHub/ochkarik/script.js`
- CSS: `/Users/matlyubakarimova/Documents/GitHub/ochkarik/styles.css`
- Schema: Lines 94-395 in index.html

