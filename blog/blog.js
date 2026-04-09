// Blog JavaScript — sitorakarimi.com
// Handles: language switching, mobile menu, share buttons, markdown rendering
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        var lang = window.__LANG__ || 'ru';

        // --- Language Switcher ---
        function navigateToLang(target) {
            // Replace language segment in current URL path
            var parts = window.location.pathname.split('/').filter(Boolean);
            if (parts.length > 0) {
                parts[0] = target;
            }
            window.location.href = '/' + parts.join('/') + '/';
        }

        document.querySelectorAll('.lang-option, .lang-option-mobile').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                var target = this.getAttribute('data-lang') || this.getAttribute('href');
                if (target && target.startsWith('/')) {
                    window.location.href = target;
                } else if (target) {
                    navigateToLang(target);
                }
            });
        });

        // Desktop language dropdown
        var langBtn = document.getElementById('lang-btn');
        var langMenu = document.getElementById('lang-menu');
        if (langBtn && langMenu) {
            langBtn.addEventListener('click', function () {
                var open = !langMenu.classList.contains('hidden');
                langMenu.classList.toggle('hidden');
                langBtn.setAttribute('aria-expanded', !open);
            });
            document.addEventListener('click', function (e) {
                if (!langBtn.contains(e.target) && !langMenu.contains(e.target)) {
                    langMenu.classList.add('hidden');
                    langBtn.setAttribute('aria-expanded', 'false');
                }
            });
        }

        // --- Mobile Menu ---
        var mobileMenuBtn = document.getElementById('mobile-menu-btn');
        var mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', function () {
                var open = !mobileMenu.classList.contains('hidden');
                mobileMenu.classList.toggle('hidden');
                mobileMenuBtn.setAttribute('aria-expanded', !open);
                var icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.className = open ? 'fas fa-bars text-2xl' : 'fas fa-times text-2xl';
                }
            });
        }

        // --- Render Markdown Content ---
        // Convert markdown-style content to HTML (headings, lists, bold, italic, links, hr)
        var blogContent = document.getElementById('blog-content');
        if (blogContent) {
            var html = blogContent.innerHTML;

            // Only process if content looks like raw markdown (has ## headings or **bold**)
            if (html.match(/^##\s/m) || html.match(/\*\*[^*]+\*\*/)) {
                html = renderMarkdown(html);
                blogContent.innerHTML = html;
            }
        }
    });

    // --- Simple Markdown Renderer ---
    function renderMarkdown(text) {
        var lines = text.split('\n');
        var result = [];
        var inList = false;
        var listType = '';

        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];

            // Headings
            if (line.match(/^### (.+)/)) {
                if (inList) { result.push(closeList(listType)); inList = false; }
                result.push('<h3>' + line.replace(/^### /, '') + '</h3>');
                continue;
            }
            if (line.match(/^## (.+)/)) {
                if (inList) { result.push(closeList(listType)); inList = false; }
                result.push('<h2>' + line.replace(/^## /, '') + '</h2>');
                continue;
            }

            // Horizontal rule
            if (line.match(/^---\s*$/)) {
                if (inList) { result.push(closeList(listType)); inList = false; }
                result.push('<hr>');
                continue;
            }

            // Unordered list
            if (line.match(/^- (.+)/)) {
                if (!inList || listType !== 'ul') {
                    if (inList) result.push(closeList(listType));
                    result.push('<ul>');
                    inList = true;
                    listType = 'ul';
                }
                result.push('<li>' + inlineMarkdown(line.replace(/^- /, '')) + '</li>');
                continue;
            }

            // Ordered list
            if (line.match(/^\d+\. (.+)/)) {
                if (!inList || listType !== 'ol') {
                    if (inList) result.push(closeList(listType));
                    result.push('<ol>');
                    inList = true;
                    listType = 'ol';
                }
                result.push('<li>' + inlineMarkdown(line.replace(/^\d+\. /, '')) + '</li>');
                continue;
            }

            // Close list if we're not in a list item
            if (inList && line.trim() === '') {
                result.push(closeList(listType));
                inList = false;
                continue;
            }

            // Empty line
            if (line.trim() === '') {
                continue;
            }

            // Paragraph
            if (inList) { result.push(closeList(listType)); inList = false; }
            result.push('<p>' + inlineMarkdown(line) + '</p>');
        }

        if (inList) result.push(closeList(listType));
        return result.join('\n');
    }

    function closeList(type) {
        return type === 'ol' ? '</ol>' : '</ul>';
    }

    function inlineMarkdown(text) {
        // Bold
        text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        // Italic
        text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        // Links
        text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
        // Inline code
        text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
        return text;
    }

    // --- Share Functions (global) ---
    window.shareTo = function (platform) {
        var url = encodeURIComponent(window.location.href);
        var title = encodeURIComponent(document.title);
        var shareUrl = '';

        switch (platform) {
            case 'twitter':
                shareUrl = 'https://twitter.com/intent/tweet?url=' + url + '&text=' + title;
                break;
            case 'facebook':
                shareUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + url;
                break;
            case 'telegram':
                shareUrl = 'https://t.me/share/url?url=' + url + '&text=' + title;
                break;
        }
        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    };

    window.copyLink = function () {
        navigator.clipboard.writeText(window.location.href).then(function () {
            var btn = document.getElementById('copy-link-btn');
            if (btn) {
                var icon = btn.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-check';
                    setTimeout(function () { icon.className = 'fas fa-link'; }, 2000);
                }
            }
        });
    };
})();
