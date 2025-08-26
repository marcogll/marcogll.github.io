/*==================== MENU SHOW Y HIDDEN ====================*/
const navMenu = document.getElementById('nav-menu'),
    navToggle = document.getElementById('nav-toggle'),
    navClose = document.getElementById('nav-close')
/*===== MENU SHOW =====*/
/* Validate if constant exists */
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu')
    })
}

/*===== MENU HIDDEN =====*/
/* Validate if constant exists */
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu')
    })
}

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction() {
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))
/*==================== ACCORDION SKILLS ====================*/
const skillsContent = document.getElementsByClassName('skills__content'),
    skillsHeader = document.querySelectorAll('.skills__header')

function toggleSkills() {
    let itemClass = this.parentNode.className

    // Close all skills sections and remove animations
    for (i = 0; i < skillsContent.length; i++) {
        skillsContent[i].className = 'skills__content skills__close'
        // Remove animate class from all skill bars in closed sections
        const skillBars = skillsContent[i].querySelectorAll('.skills__percentage')
        skillBars.forEach(bar => {
            bar.classList.remove('animate')
        })
    }
    
    // Open clicked section
    if (itemClass === 'skills__content skills__close') {
        this.parentNode.className = 'skills__content skills__open'
        
        // Add animate class to skill bars in opened section with delay
        const skillBars = this.parentNode.querySelectorAll('.skills__percentage')
        skillBars.forEach((bar, index) => {
            setTimeout(() => {
                bar.classList.add('animate')
            }, index * 200) // Stagger animation by 200ms
        })
    }
}

skillsHeader.forEach((el) => {
    el.addEventListener('click', toggleSkills)
})

// Initialize first skills section with animated bars
function initializeSkills() {
    const firstSkillsSection = document.querySelector('.skills__content.skills__open')
    if (firstSkillsSection) {
        const skillBars = firstSkillsSection.querySelectorAll('.skills__percentage')
        skillBars.forEach((bar, index) => {
            setTimeout(() => {
                bar.classList.add('animate')
            }, 500 + (index * 200)) // Start after 500ms with 200ms stagger
        })
    }
}

// Call initialization when page loads
document.addEventListener('DOMContentLoaded', initializeSkills)

/*==================== BLOB MOUSE INTERACTION ====================*/
document.addEventListener('DOMContentLoaded', function() {
    const blob = document.querySelector('.home__blob-container');
    const blobShape = document.querySelector('.home__blob-shape');
    
    // Auto-rotate images every 4 seconds
    const images = document.querySelectorAll('.home__blob-img');
    let currentImageIndex = 0;
    
    setInterval(() => {
        if (!blob.matches(':hover')) { // Solo auto-rotar cuando no hay hover
            images.forEach(img => img.classList.remove('active'));
            currentImageIndex = (currentImageIndex + 1) % images.length;
            images[currentImageIndex].classList.add('active');
        }
    }, 4000);
    
    if (blob && blobShape) {
        let isHovering = false;
        let animationFrame;
        
        // Función para interpolación suave
        function lerp(start, end, factor) {
            return start + (end - start) * factor;
        }
        
        let currentTransform = {
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0
        };
        
        let targetTransform = {
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0
        };
        
        function updateTransform() {
            // Interpolación suave hacia el objetivo
            currentTransform.x = lerp(currentTransform.x, targetTransform.x, 0.1);
            currentTransform.y = lerp(currentTransform.y, targetTransform.y, 0.1);
            currentTransform.scale = lerp(currentTransform.scale, targetTransform.scale, 0.08);
            currentTransform.rotation = lerp(currentTransform.rotation, targetTransform.rotation, 0.05);
            
            if (isHovering) {
                blobShape.style.transform = `translate(${currentTransform.x}px, ${currentTransform.y}px) scale(${currentTransform.scale}) rotate(${currentTransform.rotation}deg)`;
                animationFrame = requestAnimationFrame(updateTransform);
            }
        }
        
        blob.addEventListener('mouseenter', () => {
            isHovering = true;
            blobShape.style.animationPlayState = 'paused';
            updateTransform();
        });
        
        blob.addEventListener('mouseleave', () => {
            isHovering = false;
            
            // Volver suavemente al estado original
            targetTransform = { x: 0, y: 0, scale: 1, rotation: 0 };
            
            const returnAnimation = () => {
                currentTransform.x = lerp(currentTransform.x, 0, 0.15);
                currentTransform.y = lerp(currentTransform.y, 0, 0.15);
                currentTransform.scale = lerp(currentTransform.scale, 1, 0.12);
                currentTransform.rotation = lerp(currentTransform.rotation, 0, 0.1);
                
                blobShape.style.transform = `translate(${currentTransform.x}px, ${currentTransform.y}px) scale(${currentTransform.scale}) rotate(${currentTransform.rotation}deg)`;
                
                if (Math.abs(currentTransform.x) > 0.1 || Math.abs(currentTransform.y) > 0.1 || Math.abs(currentTransform.scale - 1) > 0.01) {
                    requestAnimationFrame(returnAnimation);
                } else {
                    blobShape.style.animationPlayState = 'running';
                    blobShape.style.transform = '';
                }
            };
            
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
            returnAnimation();
        });
        
        blob.addEventListener('mousemove', (e) => {
            if (!isHovering) return;
            
            const rect = blob.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;
            
            // Calcular el desplazamiento y limitarlo
            const maxDistance = 25; // Máximo desplazamiento en píxeles
            const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
            const factor = Math.min(distance, maxDistance) / maxDistance;
            
            // Movimiento suave del blob siguiendo el mouse
            targetTransform.x = (mouseX / rect.width) * 20;
            targetTransform.y = (mouseY / rect.height) * 20;
            targetTransform.scale = 1.05 + factor * 0.1;
            targetTransform.rotation = (mouseX / rect.width) * 8;
            
            // Cambiar imagen cuando el mouse se mueva significativamente
            const images = document.querySelectorAll('.home__blob-img');
            if (factor > 0.15 && Math.random() < 0.15) { // 15% chance cuando el mouse está activo
                const activeImage = document.querySelector('.home__blob-img.active');
                const activeIndex = Array.from(images).indexOf(activeImage);
                let nextIndex;
                
                // Seleccionar siguiente imagen de forma inteligente
                do {
                    nextIndex = Math.floor(Math.random() * images.length);
                } while (nextIndex === activeIndex && images.length > 1);
                
                images.forEach(img => img.classList.remove('active'));
                images[nextIndex].classList.add('active');
                currentImageIndex = nextIndex; // Actualizar el índice para la rotación automática
            }
        });
    }
});

/*==================== QUALIFICATION TABS ====================*/


/*==================== SERVICES MODAL ====================*/
const modalViews = document.querySelectorAll('.services__modal'),
    modalBtns = document.querySelectorAll('.services__button'),
    modalCloses = document.querySelectorAll('.services__modal-close')

let modal = function (modalClick) {
    modalViews[modalClick].classList.add('active-modal')
}

modalBtns.forEach((modalBtn, i) => {
    modalBtn.addEventListener('click', () => {
        modal(i)
    })
})

modalCloses.forEach((modalClose) => {
    modalClose.addEventListener('click', () => {
        modalViews.forEach((modalView) => {
            modalView.classList.remove('active-modal')
        })
    })
})
/*==================== PORTFOLIO SWIPER  ====================*/
let swiperPortfolio = new Swiper('.portfolio__container', {
    cssMode: true,
    loop: true,

    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
});

/*==================== TESTIMONIAL ====================*/
let swiperTestimonial = new Swiper('.testimonial__container', {
    loop: true,
    grabCursor: true,
    spaceBetween: 48,


    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
    },
    breakpoints:{
        568:{
            slidesPerview: 2,
        }
    }
});

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

function scrollActive(){
    const scrollY = window.pageYOffset

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 50;
        sectionId = current.getAttribute('id')

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link')
        }else{
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link')
        }
    })
}
window.addEventListener('scroll', scrollActive)

/*==================== CHANGE BACKGROUND HEADER ====================*/
function scrollHeader(){
    const nav = document.getElementById('header')
    // When the scroll is greater than 200 viewport height, add the scroll-header class to the header tag
    if(this.scrollY >= 80) nav.classList.add('scroll-header'); else nav.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)


/*==================== SHOW SCROLL UP ====================*/
function scrollUp(){
    const scrollUp = document.getElementById('scroll-up');
    // When the scroll is higher than 560 viewport height, add the show-scroll class to the a tag with the scroll-top class
    if(this.scrollY >= 560) scrollUp.classList.add('show-scroll'); else scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)


/*==================== DARK LIGHT THEME ====================*/ 
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'uil-sun'

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'uil-moon' : 'uil-sun'

// Function to get system theme preference
const getSystemTheme = () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark'
    }
    return 'light'
}

// Function to update navbar logo based on theme
const updateNavbarLogo = () => {
    const navbarLogo = document.getElementById('navbar-logo')
    const isDarkTheme = document.body.classList.contains('dark-theme')
    
    if (navbarLogo) {
        if (isDarkTheme) {
            // Dark theme - use white logo
            navbarLogo.src = 'assets/img/mg_logo.png'
            console.log('Logo changed to white (dark theme)')
        } else {
            // Light theme - use black logo  
            navbarLogo.src = 'assets/img/mg_logo_black.png'
            console.log('Logo changed to black (light theme)')
        }
    } else {
        console.error('Navbar logo element not found!')
    }
}

// Initialize theme based on user preference or system preference (defaulting to dark if no system preference)
if (selectedTheme) {
    // User has previously selected a theme
    document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
    themeButton.classList[selectedIcon === 'uil-moon' ? 'add' : 'remove'](iconTheme)
} else {
    // No user preference, use system preference or default to dark
    const systemTheme = getSystemTheme()
    const defaultTheme = systemTheme === 'light' ? 'light' : 'dark' // Default to dark if system doesn't prefer light
    
    if (defaultTheme === 'dark') {
        document.body.classList.add(darkTheme)
        themeButton.classList.add(iconTheme)
    }
}

// Update logo on initial load after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    updateNavbarLogo()
})

// Listen for system theme changes (only if user hasn't manually selected a theme)
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('selected-theme')) {
        // Only update if user hasn't manually set a preference
        if (e.matches) {
            // System switched to dark
            document.body.classList.add(darkTheme)
            themeButton.classList.add(iconTheme)
        } else {
            // System switched to light
            document.body.classList.remove(darkTheme)
            themeButton.classList.remove(iconTheme)
        }
        // Update logo after theme change
        updateNavbarLogo()
    }
})

// Activate / deactivate the theme manually with the button
themeButton.addEventListener('click', () => {
    // Add or remove the dark / icon theme
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    // We save the theme and the current icon that the user chose
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
    // Update logo after manual theme change
    updateNavbarLogo()
})