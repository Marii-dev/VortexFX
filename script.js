// Clean VortexFX Website JavaScript
class VortexFXWebsite {
    constructor() {
        this.scrollDirection = 'down';
        this.lastScrollY = 0;
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupCleanScrollAnimations();
        this.setupSmoothScrolling();
        this.setupVideoEffects();
        this.setupMobileMenu();
        this.setupPerformanceOptimizations();
    }

    // Navigation functionality
    setupNavigation() {
        const navbar = document.querySelector('.navbar');
        
        const handleScroll = this.throttle(() => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, 16);

        window.addEventListener('scroll', handleScroll);
        this.highlightActiveSection();
    }

    // Clean scroll animations with fade in/out
    setupCleanScrollAnimations() {
        const observerOptions = {
            threshold: [0, 0.1, 0.5, 1],
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const element = entry.target;
                
                if (entry.isIntersecting) {
                    element.classList.add('visible');
                    element.classList.remove('fade-out');
                } else {
                    element.classList.remove('visible');
                    element.classList.add('fade-out');
                }
            });
        }, observerOptions);

        const animatedElements = document.querySelectorAll(
            '.fade-in, .slide-left, .slide-right, .feature-card, .showcase-item, .partner-item, .stat'
        );
        
        animatedElements.forEach((el, index) => {
            el.style.transitionDelay = `${index * 0.05}s`;
            observer.observe(el);
        });

        window.addEventListener('scroll', this.throttle(() => {
            const currentScrollY = window.scrollY;
            this.scrollDirection = currentScrollY > this.lastScrollY ? 'down' : 'up';
            this.lastScrollY = currentScrollY;
        }, 16));
    }

    // Smooth scrolling for navigation links
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        window.scrollToFeatures = () => {
            const featuresSection = document.getElementById('features');
            if (featuresSection) {
                const offsetTop = featuresSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        };
    }

    // Video effects and optimization
    setupVideoEffects() {
        const video = document.querySelector('.video-background');
        if (!video) return;

        // Intersection Observer for video performance
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play().catch(e => console.log('Video autoplay failed:', e));
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.1 });

        videoObserver.observe(video);

        // Video fade effect on scroll with throttling
        const handleVideoScroll = this.throttle(() => {
            const scrolled = window.scrollY;
            const heroHeight = window.innerHeight;
            const opacity = Math.max(0, 1 - (scrolled / heroHeight) * 1.2);
            video.style.opacity = opacity;
        }, 16);

        window.addEventListener('scroll', handleVideoScroll);

        // Handle video loading errors
        video.addEventListener('error', () => {
            console.warn('Video failed to load');
            video.style.display = 'none';
        });
    }

    // Mobile menu functionality
    setupMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (!mobileToggle || !navMenu) return;

        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });
    }

    // Highlight active navigation section
    highlightActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

        const handleSectionScroll = this.throttle(() => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 120;
                const sectionHeight = section.clientHeight;
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }, 16);

        window.addEventListener('scroll', handleSectionScroll);
    }

    // Performance optimizations
    setupPerformanceOptimizations() {
        // Lazy load images
        this.lazyLoadImages();
        
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Handle page visibility changes
        this.handleVisibilityChange();
        
        // Error handling for missing images
        this.handleImageErrors();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    preloadCriticalResources() {
        const criticalImages = [
            'tinylogo.png',
            'enginepreview1.png',
            'enginepreview2.png',
            'discordlogo.png'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    handleVisibilityChange() {
        document.addEventListener('visibilitychange', () => {
            const video = document.querySelector('.video-background');
            if (video) {
                if (document.hidden) {
                    video.pause();
                } else {
                    video.play().catch(e => console.log('Video play failed:', e));
                }
            }
        });
    }

    handleImageErrors() {
        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG') {
                e.target.style.display = 'none';
                console.warn('Image failed to load:', e.target.src);
            }
        }, true);
    }

    // Utility functions
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
}

// Initialize website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VortexFXWebsite();
});

// Handle page load completion
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Trigger initial animations
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.animation = 'fadeInUp 1s ease-out';
    }
});

// Prevent context menu and text selection for better UX
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

document.addEventListener('selectstart', (e) => {
    e.preventDefault();
});

// Handle mouse interactions for better UX
document.addEventListener('mousedown', (e) => {
    e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
    if (e.buttons === 1) {
        e.preventDefault();
    }
});

// Add smooth hover effects for interactive elements
document.addEventListener('DOMContentLoaded', () => {
    const interactiveElements = document.querySelectorAll('.feature-card, .partner-item, .showcase-item, .cta-button');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VortexFXWebsite;
}