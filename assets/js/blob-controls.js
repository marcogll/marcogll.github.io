/*==================== CONTROLES DINÁMICOS DE BLOB ====================*/
class BlobController {
    constructor() {
        this.vertices = 8; // Número de vértices (4-12)
        this.roundness = 50; // Porcentaje de redondez (20-80)
        this.morphSpeed = 8; // Velocidad de morphing (4-20 segundos)
        this.colorSpeed = 15; // Velocidad cambio de color (10-30 segundos)
        
        this.blobShape = document.querySelector('.home__blob-shape');
        this.init();
    }
    
    init() {
        if (this.blobShape) {
            this.updateBlobStyle();
            this.createControls();
        }
    }
    
    generateBorderRadius() {
        const baseRadius = this.roundness;
        const variation = Math.max(10, 50 - this.roundness); // Más variación con menos redondez
        
        const radiusValues = [];
        for (let i = 0; i < 8; i++) {
            const radius = baseRadius + (Math.random() - 0.5) * variation;
            radiusValues.push(Math.max(20, Math.min(80, radius)));
        }
        
        return `${radiusValues[0]}% ${radiusValues[1]}% ${radiusValues[2]}% ${radiusValues[3]}% / ${radiusValues[4]}% ${radiusValues[5]}% ${radiusValues[6]}% ${radiusValues[7]}%`;
    }
    
    updateBlobStyle() {
        if (!this.blobShape) return; 
        
        // Generar keyframes dinámicos para morphing
        const keyframes = [];
        const steps = Math.max(4, Math.min(this.vertices, 8));
        
        for (let i = 0; i <= steps; i++) {
            const percentage = (i / steps) * 100;
            const borderRadius = this.generateBorderRadius();
            keyframes.push(`${percentage}% { border-radius: ${borderRadius}; }`);
        }
        
        // Crear CSS dinámico
        const dynamicCSS = `
            @keyframes blobMorphDynamic {
                ${keyframes.join('\n')}
            }
        `;
        
        // Aplicar estilos
        let styleSheet = document.getElementById('blob-dynamic-styles');
        if (!styleSheet) {
            styleSheet = document.createElement('style');
            styleSheet.id = 'blob-dynamic-styles';
            document.head.appendChild(styleSheet);
        }
        styleSheet.textContent = dynamicCSS;
        
        // Aplicar animación al blob
        this.blobShape.style.animation = `blobMorphDynamic ${this.morphSpeed}s ease-in-out infinite, blobColorChangeBorder ${this.colorSpeed}s ease-in-out infinite`;
        
        // También aplicar a las imágenes y borde
        const images = document.querySelectorAll('.home__blob-img');
        const border = document.querySelector('.home__blob-border');
        images.forEach(img => {
            img.style.animation = `blobMorphDynamic ${this.morphSpeed}s ease-in-out infinite`;
        });
        if (border) {
            border.style.animation = `blobMorphDynamic ${this.morphSpeed}s ease-in-out infinite`;
        }
    }
    
    createControls() {
        // Solo crear controles si no existen
        if (document.getElementById('blob-controls')) return;
        
        const controlsHTML = `
            <div id="blob-controls" style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(255,255,255,0.1);
                backdrop-filter: blur(10px);
                padding: 15px;
                border-radius: 10px;
                font-size: 12px;
                color: var(--text-color);
                z-index: 1000;
                min-width: 200px;
                display: none;
            ">
                <h4 style="margin: 0 0 10px 0;">Controles del Blob</h4>
                
                <label>Vértices: <span id="vertices-value">${this.vertices}</span></label>
                <input type="range" id="vertices-slider" min="4" max="12" value="${this.vertices}" style="width: 100%; margin-bottom: 10px;">
                
                <label>Redondez: <span id="roundness-value">${this.roundness}%</span></label>
                <input type="range" id="roundness-slider" min="20" max="80" value="${this.roundness}" style="width: 100%; margin-bottom: 10px;">
                
                <label>Velocidad Morph: <span id="morph-speed-value">${this.morphSpeed}s</span></label>
                <input type="range" id="morph-speed-slider" min="4" max="20" value="${this.morphSpeed}" style="width: 100%; margin-bottom: 10px;">
                
                <button id="regenerate-blob" style="
                    width: 100%;
                    padding: 5px;
                    border: none;
                    border-radius: 5px;
                    background: var(--first-color);
                    color: white;
                    cursor: pointer;
                ">Regenerar Blob</button>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', controlsHTML);
        this.bindControlEvents();
        
        // Mostrar controles con Ctrl+B
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'b') {
                e.preventDefault();
                const controls = document.getElementById('blob-controls');
                controls.style.display = controls.style.display === 'none' ? 'block' : 'none';
            }
        });
    }
    
    bindControlEvents() {
        const verticesSlider = document.getElementById('vertices-slider');
        const roundnessSlider = document.getElementById('roundness-slider');
        const morphSpeedSlider = document.getElementById('morph-speed-slider');
        const regenerateBtn = document.getElementById('regenerate-blob');
        
        const verticesValue = document.getElementById('vertices-value');
        const roundnessValue = document.getElementById('roundness-value');
        const morphSpeedValue = document.getElementById('morph-speed-value');
        
        verticesSlider.addEventListener('input', (e) => {
            this.vertices = parseInt(e.target.value);
            verticesValue.textContent = this.vertices;
            this.updateBlobStyle();
        });
        
        roundnessSlider.addEventListener('input', (e) => {
            this.roundness = parseInt(e.target.value);
            roundnessValue.textContent = this.roundness + '%';
            this.updateBlobStyle();
        });
        
        morphSpeedSlider.addEventListener('input', (e) => {
            this.morphSpeed = parseInt(e.target.value);
            morphSpeedValue.textContent = this.morphSpeed + 's';
            this.updateBlobStyle();
        });
        
        regenerateBtn.addEventListener('click', () => {
            this.updateBlobStyle();
        });
    }
    
    // Métodos públicos para controlar el blob programáticamente
    setVertices(count) {
        this.vertices = Math.max(4, Math.min(12, count));
        this.updateBlobStyle();
    }
    
    setRoundness(percentage) {
        this.roundness = Math.max(20, Math.min(80, percentage));
        this.updateBlobStyle();
    }
    
    setMorphSpeed(seconds) {
        this.morphSpeed = Math.max(4, Math.min(20, seconds));
        this.updateBlobStyle();
    }
}

// Inicializar el controlador cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.blobController = new BlobController();
    
    // Agregar info en consola
    console.log('🎨 Controlador de Blob inicializado!');
    console.log('💡 Presiona Ctrl+B para mostrar/ocultar los controles');
    console.log('🛠️ Usa window.blobController para control programático');
});
