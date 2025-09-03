/*==================== MOSTRAR Y OCULTAR MENÚ ====================*/
const navMenu = document.getElementById('nav-menu'),
    navToggle = document.getElementById('nav-toggle'),
    navClose = document.getElementById('nav-close')

/*===== MOSTRAR MENÚ =====*/
/* Validar si la constante existe */
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu')
    })
}

/*===== OCULTAR MENÚ =====*/
/* Validar si la constante existe */
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu')
    })
}

/*==================== QUITAR MENÚ MÓVIL ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction() {
    const navMenu = document.getElementById('nav-menu')
    // Al hacer clic en cada nav__link, eliminamos la clase show-menu
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== ACORDEÓN DE HABILIDADES ====================*/
const skillsContent = document.getElementsByClassName('skills__content'),
    skillsHeader = document.querySelectorAll('.skills__header')

function toggleSkills() {
    let itemClass = this.parentNode.className

    // Cierra todas las secciones de habilidades y elimina las animaciones
    for (i = 0; i < skillsContent.length; i++) {
        skillsContent[i].className = 'skills__content skills__close'
        // Elimina la clase de animación de todas las barras de habilidades en las secciones cerradas
        const skillBars = skillsContent[i].querySelectorAll('.skills__percentage')
        skillBars.forEach(bar => {
            bar.classList.remove('animate')
        })
    }
    
    // Abre la sección clickeada
    if (itemClass === 'skills__content skills__close') {
        this.parentNode.className = 'skills__content skills__open'
        
        // Agrega la clase de animación a las barras de habilidades en la sección abierta con un retraso
        const skillBars = this.parentNode.querySelectorAll('.skills__percentage')
        skillBars.forEach((bar, index) => {
            setTimeout(() => {
                bar.classList.add('animate')
            }, index * 200) // Escalonar la animación por 200ms
        })
    }
}

skillsHeader.forEach((el) => {
    el.addEventListener('click', toggleSkills)
})

// Inicializa la primera sección de habilidades con barras animadas
function initializeSkills() {
    const firstSkillsSection = document.querySelector('.skills__content.skills__open')
    if (firstSkillsSection) {
        const skillBars = firstSkillsSection.querySelectorAll('.skills__percentage')
        skillBars.forEach((bar, index) => {
            setTimeout(() => {
                bar.classList.add('animate')
            }, 500 + (index * 200)) // Comienza después de 500ms con un escalonamiento de 200ms
        })
    }
}

// Sistema de carga aleatoria de imágenes de perfil
const PROFILE_IMAGES_COUNT = 20; // Total de imágenes disponibles (mg_1.png a mg_20.png)
let randomizedProfileImages = [];

// Función para generar lista aleatoria de imágenes de perfil
const generateRandomProfileImages = () => {
    // Generar array con todos los números de imagen (1-20)
    const imageNumbers = Array.from({length: PROFILE_IMAGES_COUNT}, (_, i) => i + 1);
    
    // Algoritmo Fisher-Yates para mezclar el array
    for (let i = imageNumbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [imageNumbers[i], imageNumbers[j]] = [imageNumbers[j], imageNumbers[i]];
    }
    
    // Convertir números a rutas de imágenes
    randomizedProfileImages = imageNumbers.map(num => `assets/img/profiles/mg_${num}.png`);
    
    console.log(`Imágenes de perfil mezcladas (${randomizedProfileImages.length} total):`, randomizedProfileImages.slice(0, 9));
    return randomizedProfileImages;
};

// Función para asignar imágenes aleatorias a los elementos del DOM
const assignRandomProfileImages = () => {
    // Generar lista aleatoria si no existe
    if (randomizedProfileImages.length === 0) {
        generateRandomProfileImages();
    }
    
    // Asignar imágenes a la sección home (blob) - usar las primeras 9 imágenes aleatorias
    const homeImages = document.querySelectorAll('.home__blob-img');
    homeImages.forEach((img, index) => {
        if (randomizedProfileImages[index]) {
            img.src = randomizedProfileImages[index];
            img.alt = `Marco ${index + 1}`;
        }
    });
    
    // Asignar imágenes a la sección de proyectos (CTA) - reutilizar las mismas para consistencia
    const projectImages = document.querySelectorAll('.project__img');
    projectImages.forEach((img, index) => {
        if (randomizedProfileImages[index]) {
            img.src = randomizedProfileImages[index];
            img.alt = `Marco ${index + 1}`;
        }
    });
    
    // Asignar imagen para la sección About - usar una imagen consistente pero aleatoria
    const aboutMainImg = document.querySelector('.about__blob-carousel .about__blob-img[src*="about.jpg"]');
    if (aboutMainImg && randomizedProfileImages[9]) {
        aboutMainImg.src = randomizedProfileImages[9]; // Usar la 10ma imagen aleatoria para about
        aboutMainImg.alt = 'Marco Gallegos - About';
    }
    
    // Las imágenes de testimoniales se mantienen como están en el HTML
    // ya que son imágenes específicas del contenido, no fotos de perfil
    
    console.log(`Imágenes asignadas - Home: ${homeImages.length}, Proyectos: ${projectImages.length}, About: ${aboutMainImg ? 1 : 0}`);
};

// Precarga imágenes críticas para un mejor rendimiento
const preloadCriticalImages = () => {
    const criticalImages = [
        'assets/img/mg_logo.png',
        'assets/img/mg_logo_black.png'
    ];
    
    // Precargar las primeras 4 imágenes aleatorias
    if (randomizedProfileImages.length > 0) {
        criticalImages.push(...randomizedProfileImages.slice(0, 4));
    }
    
    criticalImages.forEach(imagePath => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = imagePath;
        document.head.appendChild(link);
    });
}

// Llama a la inicialización cuando la página se carga
document.addEventListener('DOMContentLoaded', () => {
    initializeSkills();
    assignRandomProfileImages(); // Asignar imágenes aleatorias primero
    preloadCriticalImages(); // Precargar después de asignar
})

/*==================== INTERACCIÓN DEL BLOB CON EL RATÓN ====================*/
document.addEventListener('DOMContentLoaded', function() {
    const blob = document.querySelector('.home__blob-container');
    const blobShape = document.querySelector('.home__blob-shape');
    
    // Rotación automática de imágenes cada 4 segundos
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
        
        // Función para interpolación suave (lerp)
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
            
            // Movimiento suave del blob siguiendo el ratón
            targetTransform.x = (mouseX / rect.width) * 20;
            targetTransform.y = (mouseY / rect.height) * 20;
            targetTransform.scale = 1.05 + factor * 0.1;
            targetTransform.rotation = (mouseX / rect.width) * 8;
            
            // Cambiar imagen cuando el ratón se mueva significativamente
            const images = document.querySelectorAll('.home__blob-img');
            if (factor > 0.15 && Math.random() < 0.15) { // 15% de probabilidad cuando el ratón está activo
                const activeImage = document.querySelector('.home__blob-img.active');
                const activeIndex = Array.from(images).indexOf(activeImage);
                let nextIndex;
                
                // Seleccionar la siguiente imagen de forma inteligente
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

/*==================== PESTAÑAS DE CALIFICACIÓN ====================*/


/*==================== MODAL DE SERVICIOS ====================*/
const modalViews = document.querySelectorAll('.services__modal'),
      modalBtns = document.querySelectorAll('.services__button'),
      modalCloses = document.querySelectorAll('.services__modal-close')

console.log('Modal setup - Buttons found:', modalBtns.length, 'Modals found:', modalViews.length)

// Función para abrir modal
function openModal(modalClick) {
    if (modalViews[modalClick]) {
        // Cerrar cualquier modal abierto primero con transición suave
        closeModal()
        
        // Pequeño delay para permitir que la transición de cierre termine
        setTimeout(() => {
            modalViews[modalClick].classList.add('show-modal')
            document.body.style.overflow = 'hidden'
            console.log('Modal opened:', modalClick)
            
            // Check if this is the CV modal (modal index 4 in our array)
            if (modalClick === 4) {
                console.log('CV Modal opened, initializing collapsible sections...')
                setTimeout(initCollapsibleCVSections, 200)
            }
        }, 100)
    }
}

// Función para cerrar modal
function closeModal() {
    modalViews.forEach(modal => {
        if (modal.classList.contains('show-modal')) {
            modal.classList.remove('show-modal')
            console.log('Modal closed')
        }
    })
    document.body.style.overflow = 'auto'
}

// Mapeo correcto de botones a modales
// Botón 0 (CV) -> Modal 4 (CV)
// Botón 1 (Automatizaciones) -> Modal 0 (Automatizaciones)  
// Botón 2 (Proyectos Llave) -> Modal 1 (Proyectos Llave)
// Botón 3 (Contenido Visual) -> Modal 2 (Contenido Visual)
// Botón 4 (Paquetes Vanity) -> Modal 3 (Paquetes Vanity)
const buttonToModalMap = [4, 0, 1, 2, 3]

// Event listeners para botones de abrir modal
modalBtns.forEach((modalBtn, i) => {
    modalBtn.addEventListener('click', () => {
        const modalIndex = buttonToModalMap[i]
        console.log(`Button ${i} clicked, opening modal ${modalIndex}`)
        openModal(modalIndex)
    })
})

// Event listeners para botones de cerrar modal
modalCloses.forEach(modalClose => {
    modalClose.addEventListener('click', closeModal)
})

// Cerrar modal al hacer click en el backdrop
modalViews.forEach(modalView => {
    modalView.addEventListener('click', (e) => {
        if (e.target === modalView) {
            closeModal()
        }
    })
})

// Cerrar modal con tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal()
    }
})
/*==================== CARRUSEL DEL PORTAFOLIO ====================*/
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

/*==================== TESTIMONIOS PERSONALIZADO ====================*/
class TestimonialCarousel {
    constructor() {
        this.slides = document.querySelectorAll('.testimonial__slide');
        this.prevBtn = document.getElementById('testimonialPrev');
        this.nextBtn = document.getElementById('testimonialNext');
        this.indicatorsContainer = document.getElementById('testimonialIndicators');
        this.currentSlide = 0;
        this.autoplayInterval = null;
        
        this.init();
    }
    
    init() {
        if (this.slides.length === 0) return;
        
        this.createIndicators();
        this.showSlide(0);
        this.bindEvents();
        this.startAutoplay();
    }
    
    createIndicators() {
        this.slides.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'testimonial__indicator';
            indicator.addEventListener('click', () => this.goToSlide(index));
            this.indicatorsContainer.appendChild(indicator);
        });
    }
    
    showSlide(index) {
        // Ocultar todos los slides
        this.slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Mostrar el slide actual
        this.slides[index].classList.add('active');
        this.currentSlide = index;
        
        // Actualizar indicadores
        const indicators = this.indicatorsContainer.querySelectorAll('.testimonial__indicator');
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
    }
    
    goToSlide(index) {
        this.showSlide(index);
        this.resetAutoplay();
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    }
    
    bindEvents() {
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        
        // Soporte para teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
    }
    
    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }
    
    resetAutoplay() {
        clearInterval(this.autoplayInterval);
        this.startAutoplay();
    }
}

// Inicializar el carrusel cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new TestimonialCarousel();
});

/*==================== ENLACE ACTIVO DE SECCIONES AL HACER SCROLL ====================*/
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

/*==================== CAMBIAR FONDO DEL ENCABEZADO ====================*/
function scrollHeader(){
    const nav = document.getElementById('header')
    // Cuando el scroll es mayor que 200 de la altura del viewport, se añade la clase scroll-header a la etiqueta del encabezado
    if(this.scrollY >= 80) nav.classList.add('scroll-header'); else nav.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)


/*==================== MOSTRAR BOTÓN DE SUBIR ====================*/
function scrollUp(){
    const scrollUp = document.getElementById('scroll-up');
    // Cuando el scroll es mayor que 560 de la altura del viewport, se añade la clase show-scroll a la etiqueta 'a' con la clase scroll-top
    if(this.scrollY >= 560) scrollUp.classList.add('show-scroll'); else scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)


/*==================== TEMA OSCURO/CLARO ====================*/ 
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'uil-sun'

// Tema previamente seleccionado (si el usuario lo seleccionó)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// Obtenemos el tema actual que tiene la interfaz validando la clase dark-theme
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'uil-moon' : 'uil-sun'

// Función para obtener la preferencia de tema del sistema
const getSystemTheme = () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark'
    }
    return 'light'
}

// Función para actualizar el logo de la barra de navegación y el favicon según el tema
const updateNavbarLogo = () => {
    const navbarLogo = document.getElementById('navbar-logo')
    const isDarkTheme = document.body.classList.contains('dark-theme')
    
    if (navbarLogo) {
        if (isDarkTheme) {
            // Tema oscuro - usar logo blanco
            navbarLogo.src = 'assets/img/mg_logo.png'
            console.log('Logo cambiado a blanco (tema oscuro)')
        } else {
            // Tema claro - usar logo negro  
            navbarLogo.src = 'assets/img/mg_logo_black.png'
            console.log('Logo cambiado a negro (tema claro)')
        }
    } else {
        console.error('¡Elemento del logo de la barra de navegación no encontrado!')
    }
}

// Función para actualizar el manifiesto de la PWA según el tema
const updatePWAManifest = () => {
    const manifestLink = document.getElementById('theme-manifest')
    const isDarkTheme = document.body.classList.contains('dark-theme')
    
    if (manifestLink) {
        if (isDarkTheme) {
            manifestLink.href = '/assets/img/favicons-white/site.webmanifest'
        } else {
            manifestLink.href = '/site.webmanifest'
        }
    }
}

// Función para actualizar las metaetiquetas específicas del tema
const updateThemeMetaTags = () => {
    const isDarkTheme = document.body.classList.contains('dark-theme')
    const themeColorMeta = document.querySelector('meta[name="theme-color"]:not([media])')
    const tileColorMeta = document.querySelector('meta[name="msapplication-TileColor"]')
    
    if (themeColorMeta) {
        themeColorMeta.content = isDarkTheme ? '#181825' : '#f4b8e4'
    }
    if (tileColorMeta) {
        tileColorMeta.content = isDarkTheme ? '#181825' : '#f4b8e4'
    }
}

// Inicializar el tema según la preferencia del usuario o del sistema (por defecto, oscuro si no hay preferencia del sistema)
if (selectedTheme) {
    // El usuario ha seleccionado previamente un tema
    document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
    themeButton.classList[selectedIcon === 'uil-moon' ? 'add' : 'remove'](iconTheme)
} else {
    // No hay preferencia del usuario, usar la preferencia del sistema o por defecto oscuro
    const systemTheme = getSystemTheme()
    const defaultTheme = systemTheme === 'light' ? 'light' : 'dark' // Por defecto, oscuro si el sistema no prefiere claro
    
    if (defaultTheme === 'dark') {
        document.body.classList.add(darkTheme)
        themeButton.classList.add(iconTheme)
    }
}

// Actualizar todos los elementos relacionados con el tema en la carga inicial después de que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    updateNavbarLogo()
    updatePWAManifest()
    updateThemeMetaTags()
})

/*==================== CARRUSEL DE IMÁGENES CTA ====================*/
document.addEventListener('DOMContentLoaded', function() {
    const projectImages = document.querySelectorAll('.project__img');
    
    if (projectImages.length > 0) {
        let currentProjectIndex = 0;
        
        function showNextProjectImage() {
            // Ocultar imagen actual
            projectImages.forEach(img => img.classList.remove('active'));
            
            // Mostrar siguiente imagen
            currentProjectIndex = (currentProjectIndex + 1) % projectImages.length;
            projectImages[currentProjectIndex].classList.add('active');
        }
        
        // Cambiar imagen cada 3 segundos
        setInterval(showNextProjectImage, 3000);
        
        // Asegurarse de que la primera imagen esté visible
        projectImages[0].classList.add('active');
    }
});

// Escuchar los cambios de tema del sistema (solo si el usuario no ha seleccionado manualmente un tema)
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('selected-theme')) {
        // Solo actualizar si el usuario no ha establecido manualmente una preferencia
        if (e.matches) {
            // El sistema cambió a oscuro
            document.body.classList.add(darkTheme)
            themeButton.classList.add(iconTheme)
        } else {
            // El sistema cambió a claro
            document.body.classList.remove(darkTheme)
            themeButton.classList.remove(iconTheme)
        }
        // Actualizar logo, manifiesto y metaetiquetas después del cambio de tema
        updateNavbarLogo()
        updatePWAManifest()
        updateThemeMetaTags()
    }
})

// Activar / desactivar el tema manualmente con el botón
themeButton.addEventListener('click', () => {
    // Añadir o quitar el tema oscuro / de iconos
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    // Guardamos el tema y el icono actual que el usuario eligió
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
    // Actualizar logo, manifiesto y metaetiquetas después del cambio manual de tema
    updateNavbarLogo()
    updatePWAManifest()
    updateThemeMetaTags()
})

/*==================== ABOUT READ MORE ====================*/
const aboutDescriptionContainer = document.querySelector('.about__description-container');
const aboutReadMoreBtn = document.querySelector('.about__read-more');

if (aboutReadMoreBtn) {
    aboutReadMoreBtn.addEventListener('click', () => {
        aboutDescriptionContainer.classList.toggle('expanded');
        if (aboutDescriptionContainer.classList.contains('expanded')) {
            aboutReadMoreBtn.textContent = 'Leer menos';
        } else {
            aboutReadMoreBtn.textContent = 'Leer más';
        }
    });
}

/*==================== CV COLLAPSIBLE SECTIONS ====================*/
// Initialize CV collapsible sections with event delegation
function initCollapsibleCVSections() {
    // Remove existing listeners to prevent duplicates
    document.removeEventListener('click', handleCVSectionClick);
    document.removeEventListener('click', handleCardClick);
    
    // Add event delegation to handle clicks on CV section headers and cards
    document.addEventListener('click', handleCVSectionClick);
    document.addEventListener('click', handleCardClick);
    
    console.log('CV collapsible sections initialized with event delegation');
}

// Handle clicks on collapsible cards
function handleCardClick(e) {
    const cardHeader = e.target.closest('.collapsible-card__header');
    if (!cardHeader) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const card = cardHeader.closest('.collapsible-card');
    if (!card) return;
    
    // Toggle this card
    const isExpanded = card.classList.contains('expanded');
    card.classList.toggle('expanded');
    
    console.log('Card toggled:', card, 'expanded:', !isExpanded);
}

// Handle clicks on CV section headers
function handleCVSectionClick(e) {
    const header = e.target.closest('.cv-section__header');
    if (!header) return;
    
    const section = header.closest('.cv-section');
    const cvModal = section?.closest('.cv-modal__content');
    
    // Only handle clicks within the CV modal
    if (!cvModal) return;
    
    e.stopPropagation();
    
    // Close all other sections first (accordion behavior)
    const allSections = cvModal.querySelectorAll('.cv-section');
    allSections.forEach(otherSection => {
        if (otherSection !== section && otherSection.classList.contains('expanded')) {
            const otherContent = otherSection.querySelector('.cv-section__content');
            const otherArrow = otherSection.querySelector('.cv-section__arrow');
            
            otherSection.classList.remove('expanded');
            console.log(`Closed section: ${otherSection.querySelector('.cv-section__title')?.textContent}`);
            
            // Update arrow animation for closed sections
            if (otherArrow) {
                otherArrow.style.transform = 'rotate(-90deg) scale(1.1)';
                setTimeout(() => {
                    otherArrow.style.transform = 'rotate(-90deg) scale(1)';
                }, 150);
            }
        }
    });
    
    // Now toggle the clicked section
    const content = section.querySelector('.cv-section__content');
    const arrow = section.querySelector('.cv-section__arrow');
    const title = section.querySelector('.cv-section__title')?.textContent || 'Unknown';
    
    if (content && arrow) {
        console.log(`Toggling CV section: ${title}`);
        toggleCVSection(section, content, arrow);
    }
}

function toggleCVSection(section, content, arrow) {
    const isExpanded = section.classList.contains('expanded');
    const title = section.querySelector('.cv-section__title')?.textContent || 'Section';
    
    console.log(`${title}: ${isExpanded ? 'collapsing' : 'expanding'}`);
    
    if (isExpanded) {
        // Collapse section
        section.classList.remove('expanded');
        console.log(`${title} collapsed`);
    } else {
        // Expand section
        section.classList.add('expanded');
        console.log(`${title} expanded`);
        
        // Trigger skills animation if this is the Skills section
        if (title.toLowerCase().includes('skills')) {
            setTimeout(() => {
                triggerSkillsAnimation(section);
            }, 200); // Small delay to let the section expand first
        }
        
        // Trigger languages animation if this is the Languages section
        if (title.toLowerCase().includes('idiomas')) {
            setTimeout(() => {
                triggerLanguagesAnimation(section);
            }, 200);
        }
    }
    
    // Add a subtle bounce animation to the arrow
    arrow.style.transform = isExpanded ? 'rotate(-90deg) scale(1.1)' : 'rotate(0deg) scale(1.1)';
    setTimeout(() => {
        arrow.style.transform = isExpanded ? 'rotate(-90deg) scale(1)' : 'rotate(0deg) scale(1)';
    }, 150);
}

// Function to trigger skills bars animation
function triggerSkillsAnimation(section) {
    const skillBars = section.querySelectorAll('.cv-skill__progress');
    skillBars.forEach((bar, index) => {
        const level = bar.getAttribute('data-level');
        // Reset animation
        bar.style.width = '0';
        // Trigger animation with staggered delay
        setTimeout(() => {
            bar.style.width = level + '%';
        }, index * 100); // 100ms delay between each bar
    });
    console.log(`Animated ${skillBars.length} skill bars`);
}

// Function to trigger languages bars animation
function triggerLanguagesAnimation(section) {
    const languageBars = section.querySelectorAll('.cv-language__progress');
    languageBars.forEach((bar, index) => {
        const level = bar.getAttribute('data-level');
        // Reset animation
        bar.style.width = '0';
        // Trigger animation with staggered delay
        setTimeout(() => {
            bar.style.width = level + '%';
        }, index * 200); // 200ms delay between each bar
    });
    console.log(`Animated ${languageBars.length} language bars`);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing CV sections...');
    initCollapsibleCVSections();
});

// Also initialize when CV modal is opened using our corrected button mapping
document.addEventListener('click', (e) => {
    const clickedButton = e.target.closest('.services__button');
    if (clickedButton) {
        const allButtons = document.querySelectorAll('.services__button');
        const buttonIndex = Array.from(allButtons).indexOf(clickedButton);
        
        // Check if it's the CV button (index 0 maps to modal 4 which is CV)
        if (buttonIndex === 0) {
            console.log('CV Modal button clicked, scheduling initialization...');
            setTimeout(() => {
                initCollapsibleCVSections();
            }, 300);
        }
    }
});

// Observer to detect when modal becomes visible
const observeModalChanges = () => {
    const targetNode = document.body;
    const config = { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] };
    
    const callback = (mutationsList) => {
        for (let mutation of mutationsList) {
            // Check for show-modal class changes
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.classList.contains('services__modal') && target.classList.contains('show-modal')) {
                    const cvModal = target.querySelector('.cv-modal__content');
                    if (cvModal) {
                        console.log('CV Modal detected as visible, initializing sections...');
                        setTimeout(initCollapsibleCVSections, 200);
                    }
                }
            }
        }
    };
    
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
};

// Start observing when DOM is ready
document.addEventListener('DOMContentLoaded', observeModalChanges);

/*==================== CARRUSEL ABOUT CON CONTROLES ====================*/
document.addEventListener('DOMContentLoaded', function() {
    const aboutBlob = document.querySelector('.about__blob-container');
    const aboutBlobShape = document.querySelector('.about__blob-shape');
    
    // Rotación automática de imágenes de about cada 5 segundos
    const aboutImages = document.querySelectorAll('.about__blob-img');
    let currentAboutImageIndex = 0;
    
    // Array con información de cada imagen about
    const aboutImageInfo = [
        { src: 'assets/img/about.jpg', title: 'Marco Gallegos', theme: 'personal' },
        { src: 'assets/img/about_technology.png', title: 'Tecnología & Desarrollo', theme: 'technology' },
        { src: 'assets/img/about_engineering.png', title: 'Ingeniería & Manufactura', theme: 'engineering' },
        { src: 'assets/img/about_marketing.png', title: 'Marketing & Creatividad', theme: 'marketing' }
    ];
    
    if (aboutImages.length > 0) {
        // Función para cambiar imagen about
        const changeAboutImage = (newIndex) => {
            aboutImages[currentAboutImageIndex].classList.remove('active');
            currentAboutImageIndex = newIndex;
            aboutImages[currentAboutImageIndex].classList.add('active');
            
            // Cambiar color del borde según la temática
            const theme = aboutImageInfo[currentAboutImageIndex].theme;
            const aboutBorder = document.querySelector('.about__blob-border');
            if (aboutBorder) {
                aboutBorder.className = 'about__blob-border about__blob-border--' + theme;
            }
            
            // Log para debugging
            console.log('Imagen About cambiada a:', aboutImageInfo[currentAboutImageIndex].title);
        };
        
        // Rotación automática
        const aboutRotationInterval = setInterval(() => {
            const nextIndex = (currentAboutImageIndex + 1) % aboutImages.length;
            changeAboutImage(nextIndex);
        }, 5000);
        
        // Controles de navegación (flechas)
        const createAboutControls = () => {
            const controlsHTML = `
                <div class="about__carousel-controls">
                    <button class="about__nav-btn about__nav-prev" title="Anterior">‹</button>
                    <button class="about__nav-btn about__nav-next" title="Siguiente">›</button>
                </div>
                <div class="about__carousel-indicators">
                    ${aboutImageInfo.map((info, index) => 
                        `<button class="about__indicator ${index === 0 ? 'active' : ''}" 
                                data-index="${index}" 
                                title="${info.title}">
                            <span class="about__indicator-dot about__indicator--${info.theme}"></span>
                        </button>`
                    ).join('')}
                </div>
            `;
            
            aboutBlob.insertAdjacentHTML('beforeend', controlsHTML);
            
            // Event listeners para controles
            const prevBtn = aboutBlob.querySelector('.about__nav-prev');
            const nextBtn = aboutBlob.querySelector('.about__nav-next');
            const indicators = aboutBlob.querySelectorAll('.about__indicator');
            
            prevBtn.addEventListener('click', () => {
                const prevIndex = currentAboutImageIndex === 0 ? aboutImages.length - 1 : currentAboutImageIndex - 1;
                changeAboutImage(prevIndex);
                updateIndicators();
            });
            
            nextBtn.addEventListener('click', () => {
                const nextIndex = (currentAboutImageIndex + 1) % aboutImages.length;
                changeAboutImage(nextIndex);
                updateIndicators();
            });
            
            indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    changeAboutImage(index);
                    updateIndicators();
                });
            });
            
            // Función para actualizar indicadores
            const updateIndicators = () => {
                indicators.forEach((indicator, index) => {
                    indicator.classList.toggle('active', index === currentAboutImageIndex);
                });
            };
        };
        
        // Interacción con mouse para cambio de imagen
        if (aboutBlob) {
            aboutBlob.addEventListener('mousemove', (e) => {
                const rect = aboutBlob.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Calcular distancia del centro
                const distance = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2));
                const maxDistance = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));
                const factor = distance / maxDistance;
                
                // Cambiar imagen cuando el ratón esté activo (5% probabilidad)
                if (factor > 0.2 && Math.random() < 0.05) {
                    const nextIndex = (currentAboutImageIndex + 1) % aboutImages.length;
                    changeAboutImage(nextIndex);
                    const indicators = aboutBlob.querySelectorAll('.about__indicator');
                    indicators.forEach((indicator, index) => {
                        indicator.classList.toggle('active', index === currentAboutImageIndex);
                    });
                }
            });
            
            // Pausar rotación automática al hacer hover
            aboutBlob.addEventListener('mouseenter', () => {
                clearInterval(aboutRotationInterval);
            });
            
            // Reanudar rotación automática al salir del hover
            aboutBlob.addEventListener('mouseleave', () => {
                aboutRotationInterval = setInterval(() => {
                    const nextIndex = (currentAboutImageIndex + 1) % aboutImages.length;
                    changeAboutImage(nextIndex);
                    const indicators = aboutBlob.querySelectorAll('.about__indicator');
                    indicators.forEach((indicator, index) => {
                        indicator.classList.toggle('active', index === currentAboutImageIndex);
                    });
                }, 5000);
            });
        }
        
        // Crear controles después de un breve delay para asegurar que el DOM esté listo
        setTimeout(createAboutControls, 500);
        
        // Inicializar el primer borde temático
        setTimeout(() => {
            const aboutBorder = document.querySelector('.about__blob-border');
            if (aboutBorder) {
                aboutBorder.className = 'about__blob-border about__blob-border--personal';
            }
        }, 100);
    }
});

/*==================== CONTACT FORM LOGIC ====================*/
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact__form');
    const submitButton = contactForm?.querySelector('button[type="submit"]');
    const buttonText = submitButton?.querySelector('i').previousSibling;
    const buttonIcon = submitButton?.querySelector('i');
    
    // Form inputs for validation
    const nameInput = contactForm?.querySelector('#contact-name');
    const emailInput = contactForm?.querySelector('#contact-email');
    const projectInput = contactForm?.querySelector('#contact-project');
    const messageInput = contactForm?.querySelector('#contact-message');
    
    if (!contactForm) {
        console.error('Contact form not found');
        return;
    }
    
    // Validation patterns
    const validationRules = {
        name: {
            pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{2,50}$/,
            message: 'Nombre debe tener entre 2 y 50 caracteres, solo letras'
        },
        email: {
            pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
            message: 'Por favor ingresa un email válido'
        },
        message: {
            pattern: /^.{10,500}$/s,
            message: 'El mensaje debe tener entre 10 y 500 caracteres'
        }
    };
    
    // Create notification element
    const createNotification = () => {
        const notification = document.createElement('div');
        notification.className = 'contact__notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 12px;
            color: white;
            font-weight: 500;
            max-width: 350px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(400px);
            transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            opacity: 0;
        `;
        document.body.appendChild(notification);
        return notification;
    };
    
    // Show notification
    const showNotification = (message, type = 'success') => {
        const notification = createNotification();
        const colors = {
            success: 'linear-gradient(135deg, #a6e3a1, #94e2d5)',
            error: 'linear-gradient(135deg, #f38ba8, #fab387)',
            warning: 'linear-gradient(135deg, #f9e2af, #fab387)'
        };
        
        notification.style.background = colors[type] || colors.success;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <i class="uil ${type === 'success' ? 'uil-check-circle' : type === 'error' ? 'uil-exclamation-triangle' : 'uil-info-circle'}" 
                   style="font-size: 24px;"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        }, 100);
        
        // Auto hide
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 400);
        }, 5000);
    };
    
    // Create success overlay with detailed confirmation
    const createSuccessOverlay = (userName) => {
        const overlay = document.createElement('div');
        overlay.className = 'contact__success-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(30, 30, 46, 0.9);
            backdrop-filter: blur(10px);
            z-index: 20000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: all 0.4s ease;
        `;
        
        overlay.innerHTML = `
            <div class="success-modal" style="
                background: var(--body-color);
                border-radius: 20px;
                padding: 2.5rem;
                max-width: 500px;
                margin: 1rem;
                text-align: center;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                border: 1px solid var(--ctp-surface2);
                transform: scale(0.8);
                transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            ">
                <div style="margin-bottom: 1.5rem;">
                    <i class="uil uil-check-circle" style="
                        font-size: 4rem; 
                        color: var(--ctp-green);
                        animation: successPulse 1s ease-out;
                    "></i>
                </div>
                <h3 style="
                    color: var(--title-color);
                    margin-bottom: 1rem;
                    font-size: 1.5rem;
                    font-weight: var(--font-semi-bold);
                ">¡Mensaje Enviado!</h3>
                <p style="
                    color: var(--text-color);
                    margin-bottom: 1.5rem;
                    line-height: 1.6;
                ">Hola <strong style="color: var(--ctp-mauve);">${userName}</strong>, tu mensaje ha sido enviado exitosamente.</p>
                <div style="
                    background: var(--ctp-surface0);
                    border-radius: 12px;
                    padding: 1.5rem;
                    margin-bottom: 1.5rem;
                    border: 1px solid var(--ctp-surface1);
                ">
                    <h4 style="
                        color: var(--title-color);
                        margin-bottom: 1rem;
                        font-size: 1.1rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 0.5rem;
                    ">
                        <i class="uil uil-info-circle" style="color: var(--ctp-blue);"></i>
                        ¿Qué sigue?
                    </h4>
                    <div style="text-align: left; color: var(--text-color);">
                        <p style="margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                            <i class="uil uil-envelope" style="color: var(--ctp-green); font-size: 1.1rem;"></i>
                            <span>Recibirás un email de confirmación automático</span>
                        </p>
                        <p style="margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                            <i class="uil uil-clock" style="color: var(--ctp-yellow); font-size: 1.1rem;"></i>
                            <span>Te responderé dentro de las próximas 24 horas</span>
                        </p>
                        <p style="margin: 0; display: flex; align-items: center; gap: 0.5rem;">
                            <i class="uil uil-rocket" style="color: var(--ctp-pink); font-size: 1.1rem;"></i>
                            <span>¡Exploremos juntos nuevas oportunidades!</span>
                        </p>
                    </div>
                </div>
                <button class="close-success-modal" style="
                    background: linear-gradient(135deg, var(--ctp-mauve), var(--ctp-lavender));
                    color: white;
                    border: none;
                    border-radius: 10px;
                    padding: 0.75rem 2rem;
                    font-weight: var(--font-medium);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-family: var(--body-font);
                " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.2)'"
                   onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                    Perfecto, ¡gracias!
                </button>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Animate in
        setTimeout(() => {
            overlay.style.opacity = '1';
            overlay.querySelector('.success-modal').style.transform = 'scale(1)';
        }, 100);
        
        // Close handler
        const closeButton = overlay.querySelector('.close-success-modal');
        const closeOverlay = () => {
            overlay.style.opacity = '0';
            overlay.querySelector('.success-modal').style.transform = 'scale(0.8)';
            setTimeout(() => {
                document.body.removeChild(overlay);
            }, 400);
        };
        
        closeButton.addEventListener('click', closeOverlay);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeOverlay();
        });
        
        // Auto close after 8 seconds
        setTimeout(closeOverlay, 8000);
    };
    
    // Validate single field
    const validateField = (input, fieldName) => {
        const value = input.value.trim();
        const rule = validationRules[fieldName];
        
        // Remove existing error styling and checkmarks
        input.classList.remove('contact__input--error');
        const existingError = input.parentNode.querySelector('.contact__error');
        const existingCheckmarkToRemove = input.parentNode.querySelector('.contact__success');
        if (existingError) existingError.remove();
        if (existingCheckmarkToRemove) existingCheckmarkToRemove.remove();
        
        // Skip validation for optional project field
        if (fieldName === 'project') return true;
        
        // Check required fields
        if (!value && input.required) {
            showFieldError(input, 'Este campo es obligatorio');
            return false;
        }
        
        // Check pattern if field has value
        if (value && rule && !rule.pattern.test(value)) {
            showFieldError(input, rule.message);
            return false;
        }
        
        // Show success state
        input.classList.add('contact__input--valid');
        
        // Add success checkmark
        const currentCheckmark = input.parentNode.querySelector('.contact__success');
        if (!currentCheckmark) {
            const checkmark = document.createElement('i');
            checkmark.className = 'uil uil-check contact__success';
            input.parentNode.appendChild(checkmark);
        }
        
        return true;
    };
    
    // Show field error
    const showFieldError = (input, message) => {
        input.classList.add('contact__input--error');
        input.classList.remove('contact__input--valid');
        
        // Remove any existing checkmarks
        const oldCheckmark = input.parentNode.querySelector('.contact__success');
        if (oldCheckmark) oldCheckmark.remove();
        
        const errorElement = document.createElement('span');
        errorElement.className = 'contact__error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #f38ba8;
            font-size: 0.875rem;
            margin-top: 4px;
            display: block;
            font-weight: 400;
        `;
        input.parentNode.appendChild(errorElement);
    };
    
    // Real-time validation
    const setupFieldValidation = () => {
        const fieldMappings = {
            [nameInput]: 'name',
            [emailInput]: 'email',
            [messageInput]: 'message'
        };
        
        Object.entries(fieldMappings).forEach(([input, fieldName]) => {
            if (input) {
                input.addEventListener('blur', () => validateField(input, fieldName));
                input.addEventListener('input', () => {
                    // Clear all validation states on typing
                    input.classList.remove('contact__input--error', 'contact__input--valid');
                    const existingError = input.parentNode.querySelector('.contact__error');
                    const checkmarkToRemove = input.parentNode.querySelector('.contact__success');
                    if (existingError) existingError.remove();
                    if (checkmarkToRemove) checkmarkToRemove.remove();
                });
            }
        });
    };
    
    // Update button state
    const updateButtonState = (state, message = 'Enviar Mensaje') => {
        const states = {
            default: {
                text: 'Enviar Mensaje',
                icon: 'uil-message',
                disabled: false,
                style: ''
            },
            loading: {
                text: 'Enviando...',
                icon: 'uil-spinner',
                disabled: true,
                style: 'opacity: 0.7; cursor: not-allowed;'
            },
            success: {
                text: '¡Enviado!',
                icon: 'uil-check',
                disabled: true,
                style: 'background: linear-gradient(135deg, #a6e3a1, #94e2d5);'
            },
            error: {
                text: 'Error, reintenta',
                icon: 'uil-exclamation-triangle',
                disabled: false,
                style: 'background: linear-gradient(135deg, #f38ba8, #fab387);'
            }
        };
        
        const config = states[state] || states.default;
        
        if (buttonText) buttonText.textContent = config.text;
        if (buttonIcon) {
            buttonIcon.className = `uil ${config.icon} button__icon`;
            if (state === 'loading') {
                buttonIcon.style.animation = 'spin 1s linear infinite';
            } else {
                buttonIcon.style.animation = '';
            }
        }
        if (submitButton) {
            submitButton.disabled = config.disabled;
            submitButton.style.cssText = config.style;
        }
    };
    
    // Validate entire form
    const validateForm = () => {
        const nameValid = validateField(nameInput, 'name');
        const emailValid = validateField(emailInput, 'email');
        const messageValid = validateField(messageInput, 'message');
        
        return nameValid && emailValid && messageValid;
    };
    
    // Handle form submission
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        console.log('Form submission started');
        
        // Validate form
        if (!validateForm()) {
            showNotification('Por favor corrige los errores en el formulario', 'error');
            return;
        }
        
        // Update UI to loading state
        updateButtonState('loading');
        
        try {
            // Prepare form data as URL encoded string for better webhook compatibility
            const formData = new FormData(contactForm);
            
            // Convert FormData to URLSearchParams for better compatibility
            const urlParams = new URLSearchParams();
            
            // Add form fields
            for (let [key, value] of formData) {
                urlParams.append(key, value);
            }
            
            // Add timestamp and metadata
            urlParams.append('timestamp', new Date().toISOString());
            urlParams.append('user_agent', navigator.userAgent);
            urlParams.append('page_url', window.location.href);
            urlParams.append('form_type', 'contact');
            
            console.log('Sending data to webhook:', urlParams.toString());
            
            // Submit form using fetch API to webhook
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: urlParams,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                }
            });
            
            // Check if response is successful (webhook might return different status codes)
            if (response.ok || response.status === 200 || response.status === 202) {
                // Success
                updateButtonState('success');
                
                // Enhanced success notification with personalized message
                const userName = nameInput.value.split(' ')[0]; // Get first name
                showNotification(
                    `¡Excelente ${userName}! Tu mensaje ha sido enviado correctamente y procesado por nuestro sistema. Te contactaré muy pronto. 🚀`, 
                    'success'
                );
                
                // Create success overlay with additional information
                createSuccessOverlay(userName);
                
                // Reset form after delay
                setTimeout(() => {
                    contactForm.reset();
                    document.querySelectorAll('.contact__input--valid, .contact__success').forEach(element => {
                        if (element.classList.contains('contact__input--valid')) {
                            element.classList.remove('contact__input--valid');
                        } else {
                            element.remove();
                        }
                    });
                    updateButtonState('default');
                }, 5000);
                
                console.log('Message sent successfully');
            } else {
                // Log response details for debugging
                console.log('Webhook response status:', response.status);
                const responseText = await response.text();
                console.log('Webhook response text:', responseText);
                console.log('Webhook response headers:', Object.fromEntries(response.headers.entries()));
                throw new Error(`Webhook error! status: ${response.status} - ${responseText}`);
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            updateButtonState('error');
            showNotification('Error al enviar el mensaje. Por favor intenta de nuevo.', 'error');
            
            // Reset button after delay
            setTimeout(() => {
                updateButtonState('default');
            }, 3000);
        }
    };
    
    // Initialize form functionality
    contactForm.addEventListener('submit', handleFormSubmit);
    setupFieldValidation();
    
    // Add CSS for loading animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .contact__input--error {
            border: 2px solid #f38ba8 !important;
            background: rgba(243, 139, 168, 0.1) !important;
        }
        
        .contact__input--valid {
            border: 2px solid #a6e3a1 !important;
            background: rgba(166, 227, 161, 0.1) !important;
        }
        
        .contact__error {
            animation: fadeInError 0.3s ease-out;
        }
        
        @keyframes fadeInError {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes successPulse {
            0% { transform: scale(0.5); opacity: 0; }
            50% { transform: scale(1.2); opacity: 0.8; }
            100% { transform: scale(1); opacity: 1; }
        }
        
        @media screen and (max-width: 568px) {
            .contact__notification {
                right: 10px !important;
                left: 10px !important;
                max-width: calc(100vw - 20px) !important;
                transform: translateY(-100px) !important;
            }
            
            .contact__notification.show {
                transform: translateY(0) !important;
            }
        }
    `;
    document.head.appendChild(style);
    
    console.log('Contact form functionality initialized');
});