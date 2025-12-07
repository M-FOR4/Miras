document.addEventListener('DOMContentLoaded', () => {

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

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
