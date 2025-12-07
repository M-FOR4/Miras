document.addEventListener('DOMContentLoaded', () => {

    // Navbar Scroll Effect
    // Navbar Scroll Effect (Transparent to Solid)
    const navbar = document.querySelector('.navbar');

    function updateNavbar() {
        if (window.scrollY > 50) {
            navbar.classList.remove('transparent');
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.add('transparent');
            navbar.classList.remove('scrolled');
        }
    }

    // Initial check
    updateNavbar();

    window.addEventListener('scroll', updateNavbar);

    // Form Submission Handling
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Create Success Message Modal
            const modal = document.createElement('div');
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
            modal.style.display = 'flex';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
            modal.style.zIndex = '9999';
            modal.style.opacity = '0';
            modal.style.transition = 'opacity 0.3s ease';

            modal.innerHTML = `
                <div style="background: white; padding: 2rem; border-radius: 1rem; text-align: center; max-width: 400px; transform: scale(0.8); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
                    <div style="width: 60px; height: 60px; background: #e8f5e9; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
                        <svg style="width: 30px; height: 30px; fill: #4caf50;" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                    </div>
                    <h3 style="color: #1e3583; margin-bottom: 0.5rem;">تم الإرسال بنجاح!</h3>
                    <p style="color: #666; margin-bottom: 1.5rem;">شكراً لتواصلك معنا. سيقوم فريقنا بالرد عليك في أقرب وقت ممكن.</p>
                    <button id="closeModal" style="background: #1e3583; color: white; border: none; padding: 0.8rem 2rem; border-radius: 2rem; cursor: pointer; font-weight: 600; transition: background 0.3s;">حسناً</button>
                </div>
            `;

            document.body.appendChild(modal);

            // Animate In
            requestAnimationFrame(() => {
                modal.style.opacity = '1';
                modal.querySelector('div').style.transform = 'scale(1)';
            });

            // Close Logic
            const closeBtn = modal.querySelector('#closeModal');
            closeBtn.addEventListener('click', () => {
                modal.style.opacity = '0';
                modal.querySelector('div').style.transform = 'scale(0.8)';
                setTimeout(() => {
                    modal.remove();
                    contactForm.reset();
                }, 300);
            });

            // Close on outside click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeBtn.click();
                }
            });
        });
    }

    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');

    function toggleMenu() {
        mobileBtn.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
        document.body.style.overflow = mobileBtn.classList.contains('active') ? 'hidden' : '';
    }

    if (mobileBtn) {
        mobileBtn.addEventListener('click', toggleMenu);

        // Close menu when clicking a link
        navLinksItems.forEach(link => {
            link.addEventListener('click', () => {
                if (navLinksContainer.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });
    }

    // Active Navigation Link based on Scroll Position (Scroll Spy)
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveLink() {
        let current = '';
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            // Check if we're in this section (with some offset for navbar)
            if (scrollY >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        // Update active class on nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');

            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Run on scroll and on load
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // Initial call

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');

                // Trigger counter animation if it's a stat number
                if (entry.target.classList.contains('stat-number')) {
                    animateValue(entry.target);
                    observer.unobserve(entry.target); // Only animate once
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-aos], .stat-number').forEach(el => {
        observer.observe(el);
    });

    // Counter Animation Function
    function animateValue(obj) {
        const target = parseInt(obj.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const start = 0;
        let startTimestamp = null;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            // Ease out quart
            const easeProgress = 1 - Math.pow(1 - progress, 4);

            obj.innerHTML = Math.floor(easeProgress * (target - start) + start) + (obj.getAttribute('data-suffix') || '');

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);
    }

});
