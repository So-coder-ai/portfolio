
document.addEventListener('DOMContentLoaded', function() {
    
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const navLinks = document.querySelectorAll('.nav-link');
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    const currentYearSpan = document.getElementById('current-year');
    const easterEgg = document.querySelector('.easter-egg');
    const projectCategories = document.querySelectorAll('.category-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    
    currentYearSpan.textContent = new Date().getFullYear();
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
    }
    
 
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        
      
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
    
  
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
        
        
        const spans = this.querySelectorAll('span');
        if (mobileMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
            
            
            const spans = mobileMenuBtn.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
    
  
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });
    
  
    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', function(e) {
        
            cursorDot.style.left = e.clientX + 'px';
            cursorDot.style.top = e.clientY + 'px';
            
          
            setTimeout(() => {
                cursorOutline.style.left = e.clientX + 'px';
                cursorOutline.style.top = e.clientY + 'px';
            }, 50);
        });
        
        
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .social-link');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', function() {
                cursorOutline.classList.add('cursor-hover');
            });
            
            el.addEventListener('mouseleave', function() {
                cursorOutline.classList.remove('cursor-hover');
            });
        });
    } else {
      
        cursorDot.style.display = 'none';
        cursorOutline.style.display = 'none';
    }
    
  
    projectCategories.forEach(category => {
        category.addEventListener('click', function() {
           
            projectCategories.forEach(btn => btn.classList.remove('active'));
           
            this.classList.add('active');
            
            const selectedCategory = this.getAttribute('data-category');
            
        
            projectCards.forEach(card => {
                if (selectedCategory === 'all' || card.getAttribute('data-category') === selectedCategory) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
  
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const animateSkillBars = () => {
        skillBars.forEach(bar => {
            const barPosition = bar.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (barPosition < screenPosition) {
                const width = bar.getAttribute('data-width');
                bar.style.setProperty('--progress-width', width + '%');
                bar.classList.add('animate-skill');
            }
        });
    };
    
    
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.fade-in, .slide-up, .slide-in-left, .slide-in-right, .scale');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
        
        
        animateSkillBars();
    };
    
   
    window.addEventListener('scroll', animateOnScroll);
    
   
    animateOnScroll();
    
   
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', function(e) {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            
            if (konamiIndex === konamiCode.length) {
                
                document.body.classList.add('shake');
                setTimeout(() => {
                    alert('🎉 You found the easter egg! You are awesome! 🎉');
                    document.body.classList.remove('shake');
                }, 500);
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
    
   
    easterEgg.addEventListener('click', function() {
        alert('Hint: Try the Konami code! (↑↑↓↓←→←→BA)');
    });
});