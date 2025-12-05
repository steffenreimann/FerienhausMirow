/**
 * Ferienhaus Seeschwalbe 285 - JavaScript
 * Handles navigation, smooth scrolling, and animations
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // =========================================
    // Mobile Navigation Toggle
    // =========================================
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');

            // Toggle body scroll when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // =========================================
    // Navbar Scroll Effect
    // =========================================
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // =========================================
    // Smooth Scroll for Anchor Links
    // =========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // =========================================
    // Intersection Observer for Animations
    // =========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe sections and cards
    const animateElements = document.querySelectorAll(
        '.section-header, .highlight-card, .amenity-category, .activity-card, .testimonial-card, .house-gallery, .house-info, .booking-card'
    );

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add the animate-in styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // =========================================
    // Gallery Image Lightbox (Simple)
    // =========================================
    const galleryImages = document.querySelectorAll('.gallery-grid img, .gallery-main img');

    galleryImages.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function() {
            openLightbox(this.src, this.alt);
        });
    });

    function openLightbox(src, alt) {
        // Create lightbox elements
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-overlay"></div>
            <div class="lightbox-content">
                <button class="lightbox-close" aria-label="Schließen">&times;</button>
                <img src="${src.replace('w=400', 'w=1200').replace('w=800', 'w=1200')}" alt="${alt}">
            </div>
        `;

        // Add styles
        const lightboxStyle = document.createElement('style');
        lightboxStyle.textContent = `
            .lightbox {
                position: fixed;
                inset: 0;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2rem;
                animation: fadeIn 0.3s ease;
            }
            .lightbox-overlay {
                position: absolute;
                inset: 0;
                background: rgba(0, 0, 0, 0.9);
            }
            .lightbox-content {
                position: relative;
                max-width: 90%;
                max-height: 90%;
            }
            .lightbox-content img {
                max-width: 100%;
                max-height: 85vh;
                border-radius: 8px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            }
            .lightbox-close {
                position: absolute;
                top: -40px;
                right: 0;
                background: none;
                border: none;
                color: white;
                font-size: 2.5rem;
                cursor: pointer;
                line-height: 1;
                transition: transform 0.2s;
            }
            .lightbox-close:hover {
                transform: scale(1.1);
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(lightboxStyle);

        // Add to DOM
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';

        // Close handlers
        function closeLightbox() {
            lightbox.style.animation = 'fadeIn 0.3s ease reverse';
            setTimeout(() => {
                lightbox.remove();
                document.body.style.overflow = '';
            }, 250);
        }

        lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox-overlay').addEventListener('click', closeLightbox);

        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                closeLightbox();
                document.removeEventListener('keydown', escHandler);
            }
        });
    }

    // =========================================
    // Lazy Loading Enhancement
    // =========================================
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // =========================================
    // Current Year for Footer
    // =========================================
    const yearElements = document.querySelectorAll('.current-year');
    yearElements.forEach(el => {
        el.textContent = new Date().getFullYear();
    });

    // =========================================
    // Scroll Progress Indicator (optional)
    // =========================================
    function createScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';

        const progressStyle = document.createElement('style');
        progressStyle.textContent = `
            .scroll-progress {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 3px;
                background: transparent;
                z-index: 10001;
            }
            .scroll-progress-bar {
                height: 100%;
                background: linear-gradient(90deg, #2E5A4C, #7BA3A8);
                width: 0%;
                transition: width 0.1s ease;
            }
        `;
        document.head.appendChild(progressStyle);
        document.body.appendChild(progressBar);

        const progressBarInner = progressBar.querySelector('.scroll-progress-bar');

        window.addEventListener('scroll', function() {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBarInner.style.width = scrolled + '%';
        });
    }

    createScrollProgress();

    // =========================================
    // Console Welcome Message
    // =========================================
    console.log('%c🏡 Ferienhaus Seeschwalbe 285', 'font-size: 20px; font-weight: bold; color: #2E5A4C;');
    console.log('%cMecklenburgische Seenplatte - Mirow', 'font-size: 14px; color: #666;');
    console.log('%cBuchen Sie unter: https://booking.allseasonparks.de', 'font-size: 12px; color: #999;');
});
