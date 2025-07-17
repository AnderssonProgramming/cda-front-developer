/**
 * ============================================
 * 🍲 COCINA PARA UNO - DESIGN PATTERNS
 * JavaScript Design Patterns implementation
 * ============================================
 */

/**
 * 1. SINGLETON PATTERN - Gestor de Recetas
 * Garantiza una única instancia del gestor de recetas
 */
const GestorRecetas = (function() {
    let instancia;
    
    function crearInstancia() {
        // Variables privadas
        let recetas = [];
        let configuracion = {
            idioma: 'es',
            temaOscuro: false,
            ultimaCategoria: 'all',
            mostrarFavoritas: false
        };
        
        // Métodos privados
        function validarReceta(datos) {
            return Validador.receta(datos);
        }
        
        function guardarEnStorage() {
            try {
                localStorage.setItem(AppConfig.STORAGE_KEYS.recipes, JSON.stringify(
                    recetas.map(receta => receta.toJSON())
                ));
                localStorage.setItem(AppConfig.STORAGE_KEYS.settings, JSON.stringify(configuracion));
                return true;
            } catch (error) {
                console.error('Error guardando en localStorage:', error);
                return false;
            }
        }
        
        function cargarDesdeStorage() {
            try {
                const recetasGuardadas = localStorage.getItem(AppConfig.STORAGE_KEYS.recipes);
                const configGuardada = localStorage.getItem(AppConfig.STORAGE_KEYS.settings);
                
                if (recetasGuardadas) {
                    const datosRecetas = JSON.parse(recetasGuardadas);
                    recetas = datosRecetas.map(datos => Receta.fromJSON(datos));
                } else {
                    // Cargar recetas iniciales si no hay datos guardados
                    recetas = crearRecetasIniciales();
                    guardarEnStorage();
                }
                
                if (configGuardada) {
                    configuracion = { ...configuracion, ...JSON.parse(configGuardada) };
                }
                
                return true;
            } catch (error) {
                console.error('Error cargando desde localStorage:', error);
                recetas = crearRecetasIniciales();
                return false;
            }
        }
        
        // API pública
        return {
            // Métodos CRUD
            obtenerRecetas: function() {
                return [...recetas]; // Retorna copia para inmutabilidad
            },
            
            obtenerRecetaPorId: function(id) {
                return recetas.find(receta => receta.id === id);
            },
            
            agregarReceta: function(datos) {
                const validacion = validarReceta(datos);
                if (!validacion.valido) {
                    throw new Error('Datos de receta inválidos: ' + validacion.errores.join(', '));
                }
                
                const nuevaReceta = new Receta(
                    datos.nombre,
                    datos.ingredientes,
                    datos.pasos,
                    datos.tiempo,
                    datos
                );
                
                recetas.push(nuevaReceta);
                guardarEnStorage();
                EventManager.emit('receta:agregada', nuevaReceta);
                return nuevaReceta;
            },
            
            actualizarReceta: function(id, datos) {
                const indice = recetas.findIndex(receta => receta.id === id);
                if (indice === -1) {
                    throw new Error('Receta no encontrada');
                }
                
                const validacion = validarReceta(datos);
                if (!validacion.valido) {
                    throw new Error('Datos de receta inválidos: ' + validacion.errores.join(', '));
                }
                
                recetas[indice].actualizar(datos);
                guardarEnStorage();
                EventManager.emit('receta:actualizada', recetas[indice]);
                return recetas[indice];
            },
            
            eliminarReceta: function(id) {
                const indice = recetas.findIndex(receta => receta.id === id);
                if (indice === -1) {
                    throw new Error('Receta no encontrada');
                }
                
                const recetaEliminada = recetas.splice(indice, 1)[0];
                guardarEnStorage();
                EventManager.emit('receta:eliminada', recetaEliminada);
                return recetaEliminada;
            },
            
            // Métodos de búsqueda y filtrado
            buscarRecetas: function(termino) {
                if (!termino || termino.trim() === '') {
                    return this.obtenerRecetas();
                }
                
                const terminoLower = termino.toLowerCase().trim();
                return recetas.filter(receta => {
                    return receta.nombre.toLowerCase().includes(terminoLower) ||
                           receta.ingredientes.some(ing => ing.toLowerCase().includes(terminoLower)) ||
                           receta.categoria.some(cat => cat.toLowerCase().includes(terminoLower));
                });
            },
            
            filtrarPorCategoria: function(categoria) {
                if (categoria === 'all') {
                    return this.obtenerRecetas();
                }
                
                return recetas.filter(receta => receta.categoria.includes(categoria));
            },
            
            obtenerFavoritas: function() {
                return recetas.filter(receta => receta.favorita);
            },
            
            // Métodos de acción
            marcarComoFavorita: function(id) {
                const receta = this.obtenerRecetaPorId(id);
                if (receta) {
                    receta.marcarComoFavorita();
                    guardarEnStorage();
                    EventManager.emit('receta:favorita', receta);
                    return receta;
                }
                throw new Error('Receta no encontrada');
            },
            
            marcarComoCocinada: function(id) {
                const receta = this.obtenerRecetaPorId(id);
                if (receta) {
                    receta.marcarComoCocinada();
                    guardarEnStorage();
                    EventManager.emit('receta:cocinada', receta);
                    return receta;
                }
                throw new Error('Receta no encontrada');
            },
            
            actualizarRating: function(id, rating) {
                const receta = this.obtenerRecetaPorId(id);
                if (receta) {
                    receta.actualizarRatingManual(rating);
                    guardarEnStorage();
                    EventManager.emit('receta:rating', receta);
                    return receta;
                }
                throw new Error('Receta no encontrada');
            },
            
            // Métodos de estadísticas
            obtenerEstadisticas: function() {
                const total = recetas.length;
                const favoritas = recetas.filter(r => r.favorita).length;
                const tiempoPromedio = total > 0 ? 
                    Math.round(recetas.reduce((acc, r) => acc + r.tiempo, 0) / total) : 0;
                const totalCocinadas = recetas.reduce((acc, r) => acc + r.vecesCocinada, 0);
                
                return {
                    total,
                    favoritas,
                    tiempoPromedio,
                    totalCocinadas
                };
            },
            
            // Configuración
            obtenerConfiguracion: function() {
                return { ...configuracion };
            },
            
            actualizarConfiguracion: function(nuevaConfig) {
                configuracion = { ...configuracion, ...nuevaConfig };
                guardarEnStorage();
                EventManager.emit('configuracion:actualizada', configuracion);
                return configuracion;
            },
            
            // Inicialización
            inicializar: function() {
                cargarDesdeStorage();
                EventManager.emit('gestor:inicializado', this);
                return this;
            },
            
            // Métodos de exportación/importación
            exportarDatos: function() {
                return {
                    recetas: recetas.map(r => r.toJSON()),
                    configuracion: configuracion,
                    version: '1.0',
                    fechaExportacion: new Date().toISOString()
                };
            },
            
            importarDatos: function(datos) {
                try {
                    if (datos.recetas) {
                        recetas = datos.recetas.map(r => Receta.fromJSON(r));
                    }
                    if (datos.configuracion) {
                        configuracion = { ...configuracion, ...datos.configuracion };
                    }
                    guardarEnStorage();
                    EventManager.emit('datos:importados', datos);
                    return true;
                } catch (error) {
                    console.error('Error importando datos:', error);
                    return false;
                }
            }
        };
    }
    
    return {
        obtenerInstancia: function() {
            if (!instancia) {
                instancia = crearInstancia();
            }
            return instancia;
        }
    };
})();

/**
 * 2. OBSERVER PATTERN - Gestor de Eventos
 * Permite la comunicación entre componentes sin acoplamiento directo
 */
const EventManager = (function() {
    const eventos = {};
    
    return {
        on: function(evento, callback) {
            if (!eventos[evento]) {
                eventos[evento] = [];
            }
            eventos[evento].push(callback);
        },
        
        off: function(evento, callback) {
            if (eventos[evento]) {
                eventos[evento] = eventos[evento].filter(cb => cb !== callback);
            }
        },
        
        emit: function(evento, datos) {
            if (eventos[evento]) {
                eventos[evento].forEach(callback => {
                    try {
                        callback(datos);
                    } catch (error) {
                        console.error(`Error en event listener para ${evento}:`, error);
                    }
                });
            }
        },
        
        once: function(evento, callback) {
            const onceCallback = (datos) => {
                callback(datos);
                this.off(evento, onceCallback);
            };
            this.on(evento, onceCallback);
        }
    };
})();

/**
 * 3. FACTORY PATTERN - Factory de Componentes UI
 * Crea diferentes tipos de componentes de interfaz
 */
const ComponentFactory = {
    crearToast: function(tipo, mensaje, duracion = AppConfig.TOAST_DURATION) {
        const toast = document.createElement('div');
        toast.className = `toast ${tipo}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span>${mensaje}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // Auto-eliminar después de la duración especificada
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, duracion);
        
        return toast;
    },
    
    crearTarjetaReceta: function(receta, idioma = 'es') {
        const t = Traducciones[idioma];
        const card = document.createElement('div');
        card.className = 'recipe-card fade-in';
        card.dataset.recipeId = receta.id;
        
        card.innerHTML = `
            <div class="recipe-image-container">
                <img src="${receta.imagen || AppConfig.PLACEHOLDER_IMAGE}" 
                     alt="${receta.nombre}" 
                     class="recipe-image"
                     loading="lazy">
                <div class="recipe-image-overlay">
                    <button class="recipe-favorite-btn ${receta.favorita ? 'active' : ''}" 
                            data-recipe-id="${receta.id}"
                            title="${receta.favorita ? 'Quitar de favoritos' : 'Agregar a favoritos'}">
                        <i data-lucide="heart"></i>
                    </button>
                </div>
                <div class="recipe-rating">
                    ${this.crearEstrellas(receta.finalRating, true)}
                </div>
                ${receta.vecesCocinada > 0 ? `
                    <div class="recipe-cooked-badge">${receta.vecesCocinada}x</div>
                ` : ''}
            </div>
            
            <div class="recipe-content">
                <h3 class="recipe-title">${receta.nombre}</h3>
                
                <div class="recipe-meta">
                    <div class="recipe-meta-item">
                        <i data-lucide="clock"></i>
                        <span>${receta.tiempo} ${t.minutes}</span>
                    </div>
                    <div class="recipe-meta-item">
                        <i data-lucide="users"></i>
                        <span>${receta.porciones}</span>
                    </div>
                </div>
                
                <div class="recipe-categories">
                    ${receta.categoria.slice(0, 2).map(cat => 
                        `<span class="recipe-category">${t.categoryNames[cat] || cat}</span>`
                    ).join('')}
                    ${receta.categoria.length > 2 ? 
                        `<span class="recipe-category">+${receta.categoria.length - 2}</span>` : ''}
                </div>
                
                <div class="recipe-stats">
                    <span>${t.timesCooked}: ${receta.vecesCocinada}</span>
                    <span>${t.lastCooked}: ${formatearFechaRelativa(receta.ultimaVezCocinada, idioma)}</span>
                </div>
                
                <div class="recipe-actions">
                    <span class="recipe-difficulty ${receta.dificultad.toLowerCase()}">
                        ${t[receta.dificultad.toLowerCase()]}
                    </span>
                    
                    <div class="recipe-action-buttons">
                        <button class="recipe-action-btn cook" 
                                data-action="cook" 
                                data-recipe-id="${receta.id}"
                                title="${t.markAsCooked}">
                            <i data-lucide="chef-hat"></i>
                        </button>
                        <button class="recipe-action-btn view" 
                                data-action="view" 
                                data-recipe-id="${receta.id}"
                                title="${t.view}">
                            <i data-lucide="eye"></i>
                        </button>
                        <button class="recipe-action-btn edit" 
                                data-action="edit" 
                                data-recipe-id="${receta.id}"
                                title="${t.edit}">
                            <i data-lucide="edit"></i>
                        </button>
                        <button class="recipe-action-btn delete" 
                                data-action="delete" 
                                data-recipe-id="${receta.id}"
                                title="${t.delete}">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        return card;
    },
    
    crearEstrellas: function(rating, readonly = false) {
        const estrellas = [];
        for (let i = 1; i <= 5; i++) {
            const activa = i <= rating;
            estrellas.push(`
                <button type="button" 
                        class="star ${activa ? 'active' : ''} ${readonly ? 'readonly' : ''}" 
                        data-rating="${i}"
                        ${readonly ? 'disabled' : ''}
                        ${!readonly ? `title="${i} estrella${i > 1 ? 's' : ''}"` : ''}>
                    <i data-lucide="star"></i>
                </button>
            `);
        }
        return `<div class="star-rating">${estrellas.join('')}</div>`;
    },
    
    crearItemIngrediente: function(ingrediente, imagen, indice) {
        const item = document.createElement('div');
        item.className = 'ingredient-item';
        
        item.innerHTML = `
            <div class="ingredient-image">
                ${imagen && imagen !== AppConfig.PLACEHOLDER_IMAGE ? 
                    `<img src="${imagen}" alt="${ingrediente}" loading="lazy">` :
                    `<i data-lucide="image"></i>`
                }
            </div>
            <input type="text" 
                   class="form-input ingredient-input" 
                   value="${ingrediente}" 
                   data-index="${indice}"
                   placeholder="Ingrediente ${indice + 1}">
            <button type="button" class="remove-btn" data-type="ingredient" data-index="${indice}">
                <i data-lucide="x"></i>
            </button>
        `;
        
        return item;
    },
    
    crearItemPaso: function(paso, indice) {
        const item = document.createElement('div');
        item.className = 'step-item';
        
        item.innerHTML = `
            <div class="step-number">${indice + 1}</div>
            <textarea class="form-textarea step-input" 
                      data-index="${indice}"
                      placeholder="Paso ${indice + 1}"
                      rows="2">${paso}</textarea>
            <button type="button" class="remove-btn" data-type="step" data-index="${indice}">
                <i data-lucide="x"></i>
            </button>
        `;
        
        return item;
    }
};

/**
 * 4. COMMAND PATTERN - Comandos para acciones
 * Encapsula acciones en objetos para poder deshacerlas, repetirlas, etc.
 */
const CommandManager = (function() {
    const historial = [];
    let indiceActual = -1;
    
    function Comando(accion, deshacer, datos) {
        this.accion = accion;
        this.deshacer = deshacer;
        this.datos = datos;
        this.timestamp = new Date();
    }
    
    return {
        ejecutar: function(comando) {
            try {
                comando.accion();
                
                // Limpiar historial futuro si estamos en el medio
                if (indiceActual < historial.length - 1) {
                    historial.splice(indiceActual + 1);
                }
                
                historial.push(comando);
                indiceActual++;
                
                // Limitar historial a últimos 50 comandos
                if (historial.length > 50) {
                    historial.shift();
                    indiceActual--;
                }
                
                EventManager.emit('comando:ejecutado', comando);
            } catch (error) {
                console.error('Error ejecutando comando:', error);
                EventManager.emit('comando:error', { comando, error });
            }
        },
        
        deshacer: function() {
            if (indiceActual >= 0) {
                const comando = historial[indiceActual];
                try {
                    comando.deshacer();
                    indiceActual--;
                    EventManager.emit('comando:deshecho', comando);
                } catch (error) {
                    console.error('Error deshaciendo comando:', error);
                }
            }
        },
        
        rehacer: function() {
            if (indiceActual < historial.length - 1) {
                indiceActual++;
                const comando = historial[indiceActual];
                try {
                    comando.accion();
                    EventManager.emit('comando:rehecho', comando);
                } catch (error) {
                    console.error('Error rehaciendo comando:', error);
                }
            }
        },
        
        puedeDeshacer: function() {
            return indiceActual >= 0;
        },
        
        puedeRehacer: function() {
            return indiceActual < historial.length - 1;
        },
        
        crearComandoAgregarReceta: function(datos) {
            const gestor = GestorRecetas.obtenerInstancia();
            let recetaCreada = null;
            
            return new Comando(
                () => {
                    recetaCreada = gestor.agregarReceta(datos);
                },
                () => {
                    if (recetaCreada) {
                        gestor.eliminarReceta(recetaCreada.id);
                    }
                },
                datos
            );
        },
        
        crearComandoEliminarReceta: function(id) {
            const gestor = GestorRecetas.obtenerInstancia();
            let recetaEliminada = null;
            
            return new Comando(
                () => {
                    recetaEliminada = gestor.eliminarReceta(id);
                },
                () => {
                    if (recetaEliminada) {
                        gestor.agregarReceta(recetaEliminada.toJSON());
                    }
                },
                { id }
            );
        }
    };
})();

/**
 * 5. STRATEGY PATTERN - Estrategias de búsqueda
 * Diferentes algoritmos de búsqueda intercambiables
 */
const EstrategiasBusqueda = {
    simple: function(recetas, termino) {
        const terminoLower = termino.toLowerCase();
        return recetas.filter(receta => 
            receta.nombre.toLowerCase().includes(terminoLower)
        );
    },
    
    completa: function(recetas, termino) {
        const terminoLower = termino.toLowerCase();
        return recetas.filter(receta => {
            return receta.nombre.toLowerCase().includes(terminoLower) ||
                   receta.ingredientes.some(ing => ing.toLowerCase().includes(terminoLower)) ||
                   receta.categoria.some(cat => cat.toLowerCase().includes(terminoLower)) ||
                   receta.notas.toLowerCase().includes(terminoLower);
        });
    },
    
    inteligente: function(recetas, termino) {
        const terminoLower = termino.toLowerCase();
        const palabras = terminoLower.split(' ').filter(p => p.length > 0);
        
        return recetas.map(receta => {
            let score = 0;
            
            // Puntaje por coincidencias en nombre (peso alto)
            palabras.forEach(palabra => {
                if (receta.nombre.toLowerCase().includes(palabra)) {
                    score += 10;
                }
            });
            
            // Puntaje por coincidencias en ingredientes (peso medio)
            palabras.forEach(palabra => {
                receta.ingredientes.forEach(ingrediente => {
                    if (ingrediente.toLowerCase().includes(palabra)) {
                        score += 5;
                    }
                });
            });
            
            // Puntaje por coincidencias en categorías (peso medio)
            palabras.forEach(palabra => {
                receta.categoria.forEach(categoria => {
                    if (categoria.toLowerCase().includes(palabra)) {
                        score += 3;
                    }
                });
            });
            
            // Puntaje por popularidad
            score += receta.finalRating;
            score += receta.vecesCocinada * 0.5;
            
            return { receta, score };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.receta);
    }
};

/**
 * 6. MODULE PATTERN - Módulo de Gestión de Temas
 * Encapsula la funcionalidad del tema en un módulo
 */
const GestorTemas = (function() {
    let temaActual = 'light';
    
    function aplicarTema(tema) {
        document.documentElement.setAttribute('data-theme', tema);
        const icono = document.getElementById('theme-icon');
        if (icono) {
            icono.setAttribute('data-lucide', tema === 'dark' ? 'sun' : 'moon');
            lucide.createIcons();
        }
    }
    
    function guardarTema(tema) {
        localStorage.setItem(AppConfig.STORAGE_KEYS.theme, tema);
    }
    
    function cargarTema() {
        const temaGuardado = localStorage.getItem(AppConfig.STORAGE_KEYS.theme);
        const temaPreferido = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        return temaGuardado || temaPreferido;
    }
    
    return {
        inicializar: function() {
            temaActual = cargarTema();
            aplicarTema(temaActual);
            
            // Escuchar cambios en preferencias del sistema
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem(AppConfig.STORAGE_KEYS.theme)) {
                    temaActual = e.matches ? 'dark' : 'light';
                    aplicarTema(temaActual);
                }
            });
        },
        
        alternar: function() {
            temaActual = temaActual === 'light' ? 'dark' : 'light';
            aplicarTema(temaActual);
            guardarTema(temaActual);
            EventManager.emit('tema:cambiado', temaActual);
            return temaActual;
        },
        
        establecer: function(tema) {
            if (['light', 'dark'].includes(tema)) {
                temaActual = tema;
                aplicarTema(tema);
                guardarTema(tema);
                EventManager.emit('tema:cambiado', tema);
            }
        },
        
        obtener: function() {
            return temaActual;
        }
    };
})();

/**
 * 7. PROXY PATTERN - Proxy para APIs externas
 * Controla el acceso a APIs externas con cache y rate limiting
 */
const APIProxy = (function() {
    const cache = new Map();
    const rateLimits = new Map();
    
    function puedeHacerPeticion(endpoint) {
        const ahora = Date.now();
        const ultimaPeticion = rateLimits.get(endpoint) || 0;
        const LIMITE_MS = 1000; // 1 segundo entre peticiones
        
        if (ahora - ultimaPeticion < LIMITE_MS) {
            return false;
        }
        
        rateLimits.set(endpoint, ahora);
        return true;
    }
    
    function obtenerDeCache(clave) {
        const entrada = cache.get(clave);
        if (entrada) {
            const DURACION_CACHE = 5 * 60 * 1000; // 5 minutos
            if (Date.now() - entrada.timestamp < DURACION_CACHE) {
                return entrada.datos;
            }
            cache.delete(clave);
        }
        return null;
    }
    
    function guardarEnCache(clave, datos) {
        cache.set(clave, {
            datos: datos,
            timestamp: Date.now()
        });
    }
    
    return {
        obtenerImagen: async function(query) {
            const cacheKey = `imagen:${query}`;
            const datosCache = obtenerDeCache(cacheKey);
            
            if (datosCache) {
                return datosCache;
            }
            
            if (!puedeHacerPeticion('unsplash')) {
                return AppConfig.PLACEHOLDER_IMAGE;
            }
            
            try {
                const imagen = await obtenerImagenUnsplash(query);
                guardarEnCache(cacheKey, imagen);
                return imagen;
            } catch (error) {
                console.error('Error obteniendo imagen:', error);
                return AppConfig.PLACEHOLDER_IMAGE;
            }
        },
        
        obtenerImagenIngrediente: async function(ingrediente) {
            const cacheKey = `ingrediente:${ingrediente}`;
            const datosCache = obtenerDeCache(cacheKey);
            
            if (datosCache) {
                return datosCache;
            }
            
            if (!puedeHacerPeticion('unsplash-ingredient')) {
                return AppConfig.PLACEHOLDER_IMAGE;
            }
            
            try {
                const imagen = await obtenerImagenIngrediente(ingrediente);
                guardarEnCache(cacheKey, imagen);
                return imagen;
            } catch (error) {
                console.error('Error obteniendo imagen de ingrediente:', error);
                return AppConfig.PLACEHOLDER_IMAGE;
            }
        },
        
        limpiarCache: function() {
            cache.clear();
        }
    };
})();

// Exportar patrones para uso global
if (typeof window !== 'undefined') {
    window.GestorRecetas = GestorRecetas;
    window.EventManager = EventManager;
    window.ComponentFactory = ComponentFactory;
    window.CommandManager = CommandManager;
    window.EstrategiasBusqueda = EstrategiasBusqueda;
    window.GestorTemas = GestorTemas;
    window.APIProxy = APIProxy;
}
