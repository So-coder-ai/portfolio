// Theme Toggle
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }
    
    // Theme toggle functionality
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            this.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });
    }
    
    // Mobile Menu Toggle
    const navToggle = document.getElementById('nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on links
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.remove('active');
            }
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Dynamic text animation in hero
    const textSlides = document.querySelectorAll('.text-slide');
    let currentSlide = 0;
    
    function showNextSlide() {
        textSlides.forEach((slide, index) => {
            slide.style.opacity = '0';
            slide.style.transform = 'translateY(20px)';
        });
        
        currentSlide = (currentSlide + 1) % textSlides.length;
        
        setTimeout(() => {
            textSlides[currentSlide].style.opacity = '1';
            textSlides[currentSlide].style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Initialize first slide
    if (textSlides.length > 0) {
        textSlides[0].style.opacity = '1';
        textSlides[0].style.transform = 'translateY(0)';
        
        // Change slide every 3 seconds
        setInterval(showNextSlide, 3000);
    }

    // Project filters
    const filterButtons = document.querySelectorAll('.filter-button');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;

            filterButtons.forEach((item) => item.classList.remove('active'));
            button.classList.add('active');

            projectCards.forEach((card) => {
                const categories = card.dataset.category.split(' ');
                card.classList.toggle('is-hidden', filter !== 'all' && !categories.includes(filter));
            });
        });
    });

    // Binary Portrait: renders the supplied photo as a low-density 0/1 canvas.
    const portrait = document.getElementById('binary-portrait');
    if (portrait) {
        const canvas = portrait.querySelector('.binary-portrait-canvas');
        const photo = portrait.querySelector('.binary-portrait-photo');
        const context = canvas.getContext('2d');
        let cells = [];
        let columns = 0;
        let rows = 0;
        let flippedCells = [];

        function renderBinaryPortrait() {
            if (!photo.naturalWidth) return;

            const bounds = canvas.getBoundingClientRect();
            const width = Math.max(1, Math.round(bounds.width));
            const height = Math.max(1, Math.round(bounds.height));
            const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
            columns = width < 210 ? 48 : 68;
            rows = Math.max(24, Math.round(columns * height / width * 0.62));

            const sample = document.createElement('canvas');
            sample.width = columns;
            sample.height = rows;
            const sampleContext = sample.getContext('2d', { willReadFrequently: true });
            const sourceWidth = photo.naturalWidth;
            const sourceHeight = Math.min(photo.naturalHeight, sourceWidth * height / width);
            const sourceY = Math.max(0, (photo.naturalHeight - sourceHeight) * 0.34);

            sampleContext.drawImage(photo, 0, sourceY, sourceWidth, sourceHeight, 0, 0, columns, rows);
            const pixels = sampleContext.getImageData(0, 0, columns, rows).data;
            cells = [];
            for (let index = 0; index < columns * rows; index += 1) {
                const pixel = index * 4;
                const brightness = (pixels[pixel] * 0.2126) + (pixels[pixel + 1] * 0.7152) + (pixels[pixel + 2] * 0.0722);
                cells.push({ brightness, bit: brightness < 132 ? '0' : '1' });
            }
            flippedCells = [];
            drawBinaryPortrait(width, height, pixelRatio);
        }

        function drawBinaryPortrait(width, height, pixelRatio) {
            canvas.width = width * pixelRatio;
            canvas.height = height * pixelRatio;
            context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
            context.clearRect(0, 0, width, height);
            context.fillStyle = getComputedStyle(document.body).getPropertyValue('--bg-primary');
            context.fillRect(0, 0, width, height);

            const cellWidth = width / columns;
            const cellHeight = height / rows;
            const fontSize = Math.min(cellHeight * 1.2, cellWidth / 0.58);
            const accent = getComputedStyle(document.body).getPropertyValue('--accent-primary').trim();
            const flipped = new Set(flippedCells);
            context.font = `${fontSize}px "JetBrains Mono", monospace`;
            context.textAlign = 'center';
            context.textBaseline = 'middle';

            cells.forEach((cell, index) => {
                const column = index % columns;
                const row = Math.floor(index / columns);
                const density = 1 - (cell.brightness / 255);
                context.globalAlpha = 0.08 + (density * 0.9);
                context.fillStyle = accent;
                const bit = flipped.has(index) ? (cell.bit === '0' ? '1' : '0') : cell.bit;
                context.fillText(bit, (column + 0.5) * cellWidth, (row + 0.5) * cellHeight);
            });
            context.globalAlpha = 1;
        }

        function redraw() {
            const bounds = canvas.getBoundingClientRect();
            drawBinaryPortrait(Math.max(1, Math.round(bounds.width)), Math.max(1, Math.round(bounds.height)), Math.min(window.devicePixelRatio || 1, 2));
        }

        function animateBits() {
            if (!cells.length || document.hidden || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            flippedCells = Array.from({ length: Math.min(6, cells.length) }, () => Math.floor(Math.random() * cells.length));
            redraw();
            window.setTimeout(() => { flippedCells = []; redraw(); }, 360);
        }

        photo.addEventListener('load', renderBinaryPortrait, { once: true });
        if (photo.complete) renderBinaryPortrait();
        new ResizeObserver(renderBinaryPortrait).observe(canvas);
        window.setInterval(animateBits, 1800);

        portrait.addEventListener('click', (event) => {
            if (window.matchMedia('(hover: hover)').matches) return;
            event.stopPropagation();
            portrait.classList.toggle('is-revealed');
        });
        document.addEventListener('click', (event) => {
            if (!portrait.contains(event.target)) portrait.classList.remove('is-revealed');
        });
        portrait.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                portrait.classList.toggle('is-revealed');
            }
        });
    }
    
    console.log('Portfolio loaded successfully! 🚀');
});
