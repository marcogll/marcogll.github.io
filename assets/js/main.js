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

// Precarga imágenes críticas para un mejor rendimiento
const preloadCriticalImages = () => {
    const criticalImages = [
        'assets/img/mg_logo.png',
        'assets/img/mg_logo_black.png',
        'assets/img/profiles/mg_1.png',
        'assets/img/profiles/mg_2.png'
    ];
    
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
    preloadCriticalImages();
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

/*==================== TESTIMONIOS ====================*/
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
            slidesPerView: 2,
        }
    }
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

/*==================== MODAL DEL CV ====================*/
const cvButton = document.getElementById('cv-button'),
      cvModal = document.getElementById('cv-modal'),
      cvModalClose = document.getElementById('cv-modal-close')

// Abrir modal del CV
if(cvButton) {
    cvButton.addEventListener('click', () => {
        cvModal.classList.add('show-modal')
        // Animar las barras de progreso de skills cuando se abra el modal
        setTimeout(() => {
            animateSkillBars()
        }, 400)
        // Prevenir scroll del body
        document.body.style.overflow = 'hidden'
    })
}

// Cerrar modal del CV
if(cvModalClose) {
    cvModalClose.addEventListener('click', () => {
        cvModal.classList.remove('show-modal')
        document.body.style.overflow = 'auto'
    })
}

// Cerrar modal al hacer click fuera del contenido
cvModal?.addEventListener('click', (e) => {
    if(e.target === cvModal) {
        cvModal.classList.remove('show-modal')
        document.body.style.overflow = 'auto'
    }
})

// Cerrar modal con tecla ESC
document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && cvModal?.classList.contains('show-modal')) {
        cvModal.classList.remove('show-modal')
        document.body.style.overflow = 'auto'
    }
})

// Función para animar las barras de progreso de skills
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.cv-skill__progress')
    
    skillBars.forEach((bar, index) => {
        setTimeout(() => {
            const level = bar.getAttribute('data-level')
            bar.style.width = '0%'
            setTimeout(() => {
                bar.style.width = level + '%'
            }, 50)
        }, index * 150) // Animación escalonada
    })
}

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