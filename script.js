/**
 * Ferienhaus Seeschwalbe 285 - JavaScript
 * Handles navigation, smooth scrolling, animations and UI helpers.
 */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        initMobileNav();
        initNavbarScroll();
        initSmoothScroll();
        initScrollAnimations();
        initLightbox();
        initLazyLoading();
        initCurrentYear();
        initScrollProgress();
        logWelcome();
    });

    // =========================================
    // Mobile Navigation Toggle
    // =========================================
    function initMobileNav() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        if (!navToggle || !navMenu) return;

        const navLinks = navMenu.querySelectorAll('a');

        function setMenu(open) {
            navMenu.classList.toggle('active', open);
            navToggle.classList.toggle('active', open);
            navToggle.setAttribute('aria-expanded', String(open));
            document.body.style.overflow = open ? 'hidden' : '';
        }

        navToggle.addEventListener('click', function () {
            setMenu(!navMenu.classList.contains('active'));
        });

        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                setMenu(false);
            });
        });

        // Close when clicking outside the menu
        document.addEventListener('click', function (e) {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                setMenu(false);
            }
        });

        // Close on Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                setMenu(false);
            }
        });
    }

    // =========================================
    // Navbar Scroll Effect (rAF-throttled)
    // =========================================
    function initNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        let ticking = false;

        function update() {
            navbar.classList.toggle('scrolled', window.pageYOffset > 50);
            ticking = false;
        }

        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(update);
                ticking = true;
            }
        }, { passive: true });

        update();
    }

    // =========================================
    // Smooth Scroll for Anchor Links
    // =========================================
    function initSmoothScroll() {
        const navbar = document.querySelector('.navbar');

        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (!targetElement) return;

                e.preventDefault();
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition =
                    targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            });
        });
    }

    // =========================================
    // Intersection Observer for Animations
    // =========================================
    function initScrollAnimations() {
        const animateElements = document.querySelectorAll(
            '.section-header, .highlight-card, .amenity-category, .activity-card, ' +
            '.testimonial-card, .house-gallery, .house-info, .booking-card'
        );
        if (!animateElements.length) return;

        // Respect reduced-motion preferences
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            animateElements.forEach(function (el) { el.classList.add('animate-in'); });
            return;
        }

        animateElements.forEach(function (el) { el.classList.add('will-animate'); });

        if (!('IntersectionObserver' in window)) {
            animateElements.forEach(function (el) { el.classList.add('animate-in'); });
            return;
        }

        const observer = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    obs.unobserve(entry.target);
                }
            });
        }, { root: null, rootMargin: '0px', threshold: 0.1 });

        animateElements.forEach(function (el) { observer.observe(el); });
    }

    // =========================================
    // Gallery Image Lightbox
    // =========================================
    function initLightbox() {
        const galleryImages = document.querySelectorAll('.gallery-grid img, .gallery-main img');
        galleryImages.forEach(function (img) {
            img.addEventListener('click', function () {
                openLightbox(this.src, this.alt);
            });
        });
    }

    function openLightbox(src, alt) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML =
            '<div class="lightbox-overlay"></div>' +
            '<div class="lightbox-content">' +
            '<button class="lightbox-close" aria-label="Schließen">&times;</button>' +
            '<img src="" alt="">' +
            '</div>';

        // Set image attributes without HTML interpolation (avoids injection)
        const imgEl = lightbox.querySelector('img');
        imgEl.src = src;
        imgEl.alt = alt || '';

        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';

        function closeLightbox() {
            lightbox.classList.add('closing');
            window.setTimeout(function () {
                lightbox.remove();
                document.body.style.overflow = '';
                document.removeEventListener('keydown', escHandler);
            }, 250);
        }

        function escHandler(e) {
            if (e.key === 'Escape') closeLightbox();
        }

        lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox-overlay').addEventListener('click', closeLightbox);
        document.addEventListener('keydown', escHandler);
    }

    // =========================================
    // Lazy Loading Enhancement
    // =========================================
    function initLazyLoading() {
        if (!('IntersectionObserver' in window)) return;

        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        if (!lazyImages.length) return;

        const imageObserver = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('loaded');
                    obs.unobserve(entry.target);
                }
            });
        });

        lazyImages.forEach(function (img) { imageObserver.observe(img); });
    }

    // =========================================
    // Current Year for Footer
    // =========================================
    function initCurrentYear() {
        const year = String(new Date().getFullYear());
        document.querySelectorAll('.current-year').forEach(function (el) {
            el.textContent = year;
        });
    }

    // =========================================
    // Scroll Progress Indicator (rAF-throttled)
    // =========================================
    function initScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
        document.body.appendChild(progressBar);

        const inner = progressBar.querySelector('.scroll-progress-bar');
        let ticking = false;

        function update() {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const height =
                document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = height > 0 ? (scrollTop / height) * 100 : 0;
            inner.style.width = scrolled + '%';
            ticking = false;
        }

        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(update);
                ticking = true;
            }
        }, { passive: true });

        update();
    }

    // =========================================
    // Console Welcome Message
    // =========================================
    function logWelcome() {
        console.log(
            '%c🏡 Ferienhaus Seeschwalbe 285',
            'font-size: 20px; font-weight: bold; color: #2E5A4C;'
        );
        console.log('%cMecklenburgische Seenplatte - Mirow', 'font-size: 14px; color: #666;');
        console.log(
            '%cBuchen Sie unter: https://booking.allseasonparks.de',
            'font-size: 12px; color: #999;'
        );
    }
})();
