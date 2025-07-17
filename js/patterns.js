/**
 * ============================================
 * 🍲 COCINA PARA UNO - ENHANCED DESIGN PATTERNS
 * JavaScript Design Patterns implementation
 * Migrated from TypeScript with advanced features
 * ============================================
 */

import { Recipe, RecipeManager, ImageService } from './objects.js';

/**
 * 1. SINGLETON PATTERN - Gestor de Recetas (Enhanced)
 * Garantiza una única instancia del gestor de recetas con funcionalidad avanzada
 */
const GestorRecetas = (function() {
    let instancia;
    
    function crearInstancia() {
        // Variables privadas
        let recetas = new Map();
        let favoritas = new Set();
        let configuracion = {
            idioma: 'es',
            tema: 'light',
            ultimaCategoria: 'all',
            ordenamiento: 'name',
            vistaCuadricula: true
        };
        
        // Métodos privados
        function validarReceta(datos) {
            const errores = [];
            
            if (!datos.name || datos.name.trim() === '') {
                errores.push('El nombre es requerido');
            }
            
            if (!Array.isArray(datos.ingredients) || datos.ingredients.length === 0) {
                errores.push('Al menos un ingrediente es requerido');
            }
            
            if (!Array.isArray(datos.steps) || datos.steps.length === 0) {
                errores.push('Al menos un paso es requerido');
            }
            
            if (!datos.time || datos.time < 1 || datos.time > 480) {
                errores.push('El tiempo debe estar entre 1 y 480 minutos');
            }
            
            return {
                valido: errores.length === 0,
                errores
            };
        }
        
        function guardarEnStorage() {
            try {
                const datos = {
                    recetas: Array.from(recetas.values()).map(receta => receta.toJSON()),
                    favoritas: Array.from(favoritas),
                    configuracion: configuracion,
                    version: '2.0',
                    timestamp: Date.now()
                };
                
                localStorage.setItem('cocina-para-uno-data', JSON.stringify(datos));
                return true;
            } catch (error) {
                console.error('Error guardando en localStorage:', error);
                return false;
            }
        }
        
        function cargarDesdeStorage() {
            try {
                const datosGuardados = localStorage.getItem('cocina-para-uno-data');
                
                if (datosGuardados) {
                    const datos = JSON.parse(datosGuardados);
                    
                    // Cargar recetas
                    if (datos.recetas) {
                        datos.recetas.forEach(datosReceta => {
                            const receta = Recipe.fromJSON(datosReceta);
                            recetas.set(receta.id, receta);
                        });
                    }
                    
                    // Cargar favoritas
                    if (datos.favoritas) {
                        favoritas = new Set(datos.favoritas);
                    }
                    
                    // Cargar configuración
                    if (datos.configuracion) {
                        configuracion = { ...configuracion, ...datos.configuracion };
                    }
                } else {
                    // Cargar recetas iniciales si no hay datos guardados
                    cargarRecetasIniciales();
                    guardarEnStorage();
                }
                
                return true;
            } catch (error) {
                console.error('Error cargando desde localStorage:', error);
                cargarRecetasIniciales();
                return false;
            }
        }
        
        function cargarRecetasIniciales() {
            const recetasIniciales = [
                {
                    name: "Arepas con Queso",
                    ingredients: ["Harina de maíz", "Queso mozzarella", "Agua", "Sal"],
                    ingredientImages: [
                        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=100&h=100&fit=crop",
                        "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=100&h=100&fit=crop",
                        "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=100&h=100&fit=crop",
                        "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=100&h=100&fit=crop"
                    ],
                    steps: [
                        "Mezclar harina con agua y sal",
                        "Formar las arepas",
                        "Asar en plancha",
                        "Rellenar con queso"
                    ],
                    time: 20,
                    categories: ["Desayuno", "Vegetariano"],
                    difficulty: "Fácil",
                    servings: 2,
                    manualRating: 5,
                    favorite: true,
                    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop",
                    notes: "Perfectas para el desayuno. Agregar un poco más de sal la próxima vez.",
                    timesCooked: 8,
                    lastCooked: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                    cookingHistory: [
                        new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                        new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                        new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
                    ]
                },
                {
                    name: "Pasta Carbonara",
                    ingredients: ["Pasta", "Huevos", "Tocino", "Queso parmesano", "Pimienta negra"],
                    steps: [
                        "Cocinar la pasta al dente",
                        "Freír el tocino hasta que esté crujiente",
                        "Batir huevos con queso",
                        "Mezclar todo caliente para crear la salsa cremosa"
                    ],
                    time: 15,
                    categories: ["Cena", "Rápido"],
                    difficulty: "Medio",
                    servings: 1,
                    manualRating: 4,
                    favorite: false,
                    image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d996?w=400&h=300&fit=crop",
                    timesCooked: 3,
                    lastCooked: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
                },
                {
                    name: "Ensalada César Personal",
                    ingredients: ["Lechuga romana", "Crutones", "Queso parmesano", "Aderezo césar"],
                    steps: [
                        "Lavar y cortar la lechuga",
                        "Agregar crutones y queso",
                        "Añadir aderezo y mezclar"
                    ],
                    time: 10,
                    categories: ["Almuerzo", "Saludable", "Vegetariano"],
                    difficulty: "Fácil",
                    servings: 1,
                    manualRating: 4,
                    favorite: true,
                    image: "https://images.unsplash.com/photo-1551248429-40975aa4de74?w=400&h=300&fit=crop",
                    timesCooked: 5
                }
            ];
            
            recetasIniciales.forEach(datosReceta => {
                const receta = new Recipe(datosReceta);
                recetas.set(receta.id, receta);
                if (receta.favorite) {
                    favoritas.add(receta.id);
                }
            });
        }
        
        // API pública
        return {
            // Métodos CRUD
            obtenerRecetas: function() {
                return Array.from(recetas.values());
            },
            
            obtenerRecetaPorId: function(id) {
                return recetas.get(id);
            },
            
            agregarReceta: function(datos) {
                const validacion = validarReceta(datos);
                if (!validacion.valido) {
                    throw new Error('Datos de receta inválidos: ' + validacion.errores.join(', '));
                }
                
                const nuevaReceta = new Recipe(datos);
                recetas.set(nuevaReceta.id, nuevaReceta);
                
                if (nuevaReceta.favorite) {
                    favoritas.add(nuevaReceta.id);
                }
                
                guardarEnStorage();
                EventManager.emit('receta:agregada', nuevaReceta);
                return nuevaReceta;
            },
            
            actualizarReceta: function(id, datos) {
                const receta = recetas.get(id);
                if (!receta) {
                    throw new Error('Receta no encontrada');
                }
                
                const validacion = validarReceta(datos);
                if (!validacion.valido) {
                    throw new Error('Datos de receta inválidos: ' + validacion.errores.join(', '));
                }
                
                receta.update(datos);
                
                // Actualizar favoritas
                if (receta.favorite) {
                    favoritas.add(id);
                } else {
                    favoritas.delete(id);
                }
                
                guardarEnStorage();
                EventManager.emit('receta:actualizada', receta);
                return receta;
            },
            
            eliminarReceta: function(id) {
                const receta = recetas.get(id);
                if (!receta) {
                    throw new Error('Receta no encontrada');
                }
                
                recetas.delete(id);
                favoritas.delete(id);
                guardarEnStorage();
                EventManager.emit('receta:eliminada', receta);
                return receta;
            },
            
            // Métodos de búsqueda y filtrado avanzado
            buscarRecetas: function(termino, filtros = {}) {
                let resultados = this.obtenerRecetas();
                
                // Aplicar búsqueda por texto
                if (termino && termino.trim() !== '') {
                    const terminoLower = termino.toLowerCase().trim();
                    resultados = resultados.filter(receta => {
                        return receta.name.toLowerCase().includes(terminoLower) ||
                               receta.ingredients.some(ing => ing.toLowerCase().includes(terminoLower)) ||
                               receta.categories.some(cat => cat.toLowerCase().includes(terminoLower)) ||
                               receta.steps.some(paso => paso.toLowerCase().includes(terminoLower)) ||
                               receta.notes.toLowerCase().includes(terminoLower);
                    });
                }
                
                // Aplicar filtros adicionales
                if (filtros.categoria && filtros.categoria !== 'all') {
                    resultados = resultados.filter(receta => receta.hasCategory(filtros.categoria));
                }
                
                if (filtros.dificultad) {
                    resultados = resultados.filter(receta => receta.difficulty === filtros.dificultad);
                }
                
                if (filtros.tiempoMaximo) {
                    resultados = resultados.filter(receta => receta.time <= filtros.tiempoMaximo);
                }
                
                if (filtros.favoritas) {
                    resultados = resultados.filter(receta => receta.favorite);
                }
                
                if (filtros.calificacionMinima) {
                    resultados = resultados.filter(receta => receta.finalRating >= filtros.calificacionMinima);
                }
                
                // Aplicar ordenamiento
                return this.ordenarRecetas(resultados, filtros.ordenarPor || configuracion.ordenamiento);
            },
            
            filtrarPorCategoria: function(categoria) {
                if (categoria === 'all') {
                    return this.obtenerRecetas();
                }
                
                return this.obtenerRecetas().filter(receta => receta.hasCategory(categoria));
            },
            
            obtenerFavoritas: function() {
                return this.obtenerRecetas().filter(receta => receta.favorite);
            },
            
            ordenarRecetas: function(recetas, criterio) {
                const recetasOrdenadas = [...recetas];
                
                switch (criterio) {
                    case 'name':
                        return recetasOrdenadas.sort((a, b) => a.name.localeCompare(b.name));
                    case 'time':
                        return recetasOrdenadas.sort((a, b) => a.time - b.time);
                    case 'rating':
                        return recetasOrdenadas.sort((a, b) => b.finalRating - a.finalRating);
                    case 'created':
                        return recetasOrdenadas.sort((a, b) => b.createdAt - a.createdAt);
                    case 'updated':
                        return recetasOrdenadas.sort((a, b) => b.updatedAt - a.updatedAt);
                    case 'cooked':
                        return recetasOrdenadas.sort((a, b) => b.timesCooked - a.timesCooked);
                    default:
                        return recetasOrdenadas;
                }
            },
            
            // Métodos de acción mejorados
            marcarComoFavorita: function(id) {
                const receta = this.obtenerRecetaPorId(id);
                if (receta) {
                    receta.toggleFavorite();
                    
                    if (receta.favorite) {
                        favoritas.add(id);
                    } else {
                        favoritas.delete(id);
                    }
                    
                    guardarEnStorage();
                    EventManager.emit('receta:favorita', receta);
                    return receta;
                }
                throw new Error('Receta no encontrada');
            },
            
            marcarComoCocinada: function(id) {
                const receta = this.obtenerRecetaPorId(id);
                if (receta) {
                    receta.markAsCooked();
                    guardarEnStorage();
                    EventManager.emit('receta:cocinada', receta);
                    return receta;
                }
                throw new Error('Receta no encontrada');
            },
            
            actualizarRating: function(id, rating) {
                const receta = this.obtenerRecetaPorId(id);
                if (receta) {
                    receta.updateRating(rating);
                    guardarEnStorage();
                    EventManager.emit('receta:rating', receta);
                    return receta;
                }
                throw new Error('Receta no encontrada');
            },
            
            // Métodos de estadísticas avanzadas
            obtenerEstadisticas: function() {
                const todasLasRecetas = this.obtenerRecetas();
                const total = todasLasRecetas.length;
                const favoritas = todasLasRecetas.filter(r => r.favorite).length;
                const tiempoPromedio = total > 0 ? 
                    Math.round(todasLasRecetas.reduce((acc, r) => acc + r.time, 0) / total) : 0;
                const totalCocinadas = todasLasRecetas.reduce((acc, r) => acc + r.timesCooked, 0);
                const calificacionPromedio = total > 0 ?
                    Math.round(todasLasRecetas.reduce((acc, r) => acc + r.finalRating, 0) / total * 10) / 10 : 0;
                
                // Estadísticas por categoría
                const estadisticasCategorias = {};
                const categorias = new Set();
                todasLasRecetas.forEach(receta => {
                    receta.categories.forEach(categoria => categorias.add(categoria));
                });
                
                Array.from(categorias).forEach(categoria => {
                    const recetasCategoria = todasLasRecetas.filter(r => r.hasCategory(categoria));
                    estadisticasCategorias[categoria] = {
                        total: recetasCategoria.length,
                        favoritas: recetasCategoria.filter(r => r.favorite).length,
                        tiempoPromedio: Math.round(recetasCategoria.reduce((acc, r) => acc + r.time, 0) / recetasCategoria.length)
                    };
                });
                
                // Recetas más cocinadas
                const masCocinadas = todasLasRecetas
                    .filter(r => r.timesCooked > 0)
                    .sort((a, b) => b.timesCooked - a.timesCooked)
                    .slice(0, 5);
                
                return {
                    total,
                    favoritas,
                    tiempoPromedio,
                    totalCocinadas,
                    calificacionPromedio,
                    estadisticasCategorias,
                    masCocinadas
                };
            },
            
            // Configuración mejorada
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
            
            // Métodos de exportación/importación mejorados
            exportarDatos: function() {
                return {
                    recetas: this.obtenerRecetas().map(r => r.toJSON()),
                    favoritas: Array.from(favoritas),
                    configuracion: configuracion,
                    estadisticas: this.obtenerEstadisticas(),
                    version: '2.0',
                    fechaExportacion: new Date().toISOString()
                };
            },
            
            importarDatos: function(datos) {
                try {
                    if (datos.recetas) {
                        recetas.clear();
                        favoritas.clear();
                        
                        datos.recetas.forEach(datosReceta => {
                            const receta = Recipe.fromJSON(datosReceta);
                            recetas.set(receta.id, receta);
                            if (receta.favorite) {
                                favoritas.add(receta.id);
                            }
                        });
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
            },
            
            // Nuevos métodos para análisis avanzado
            obtenerTendencias: function() {
                const recetas = this.obtenerRecetas();
                const now = new Date();
                const treintaDiasAtras = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
                
                // Recetas más populares del mes
                const popularesDelMes = recetas
                    .filter(r => r.lastCooked && r.lastCooked >= treintaDiasAtras)
                    .sort((a, b) => b.timesCooked - a.timesCooked)
                    .slice(0, 10);
                
                // Categorías en tendencia
                const categoriasTendencia = {};
                recetas.forEach(receta => {
                    const diasDesdeUltimaVez = receta.lastCooked ? 
                        Math.floor((now - receta.lastCooked) / (24 * 60 * 60 * 1000)) : Infinity;
                    
                    if (diasDesdeUltimaVez <= 7) { // Cocinada en la última semana
                        receta.categories.forEach(categoria => {
                            categoriasTendencia[categoria] = (categoriasTendencia[categoria] || 0) + 1;
                        });
                    }
                });
                
                return {
                    popularesDelMes,
                    categoriasTendencia: Object.entries(categoriasTendencia)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 5)
                };
            },
            
            sugerirRecetas: function() {
                const recetas = this.obtenerRecetas();
                const now = new Date();
                
                // Recetas que no se han cocinado recientemente
                const noCocinadasRecientemente = recetas
                    .filter(r => {
                        if (!r.lastCooked) return true;
                        const diasDesdeUltimaVez = Math.floor((now - r.lastCooked) / (24 * 60 * 60 * 1000));
                        return diasDesdeUltimaVez > 14; // No cocinadas en 2 semanas
                    })
                    .sort((a, b) => b.finalRating - a.finalRating)
                    .slice(0, 5);
                
                // Recetas favoritas no cocinadas recientemente
                const favoritasOlvidadas = recetas
                    .filter(r => r.favorite && (!r.lastCooked || 
                        Math.floor((now - r.lastCooked) / (24 * 60 * 60 * 1000)) > 7))
                    .slice(0, 3);
                
                return {
                    noCocinadasRecientemente,
                    favoritasOlvidadas
                };
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
    const eventos = new Map();
    
    return {
        // Agregar listener para un evento
        on: function(evento, callback) {
            if (!eventos.has(evento)) {
                eventos.set(evento, []);
            }
            eventos.get(evento).push(callback);
            
            // Retornar función para remover el listener
            return function off() {
                const callbacks = eventos.get(evento);
                if (callbacks) {
                    const index = callbacks.indexOf(callback);
                    if (index > -1) {
                        callbacks.splice(index, 1);
                    }
                }
            };
        },
        
        // Remover listener específico
        off: function(evento, callback) {
            const callbacks = eventos.get(evento);
            if (callbacks) {
                const index = callbacks.indexOf(callback);
                if (index > -1) {
                    callbacks.splice(index, 1);
                }
            }
        },
        
        // Emitir evento
        emit: function(evento, datos) {
            const callbacks = eventos.get(evento);
            if (callbacks) {
                callbacks.forEach(callback => {
                    try {
                        callback(datos);
                    } catch (error) {
                        console.error(`Error en callback para evento ${evento}:`, error);
                    }
                });
            }
        },
        
        // Listener que se ejecuta solo una vez
        once: function(evento, callback) {
            const onceCallback = (datos) => {
                callback(datos);
                this.off(evento, onceCallback);
            };
            return this.on(evento, onceCallback);
        },
        
        // Limpiar todos los listeners de un evento
        clear: function(evento) {
            if (evento) {
                eventos.delete(evento);
            } else {
                eventos.clear();
            }
        },
        
        // Obtener información de debug
        getEventInfo: function() {
            const info = {};
            eventos.forEach((callbacks, evento) => {
                info[evento] = callbacks.length;
            });
            return info;
        }
    };
})();

/**
 * 3. FACTORY PATTERN - Factoría de Componentes
 * Crea diferentes tipos de componentes sin especificar su clase exacta
 */
export class ComponentFactory {
    static componentTypes = {
        'recipe-card': 'createRecipeCard',
        'modal': 'createModal',
        'toast': 'createToast',
        'filter-button': 'createFilterButton',
        'search-bar': 'createSearchBar',
        'rating-stars': 'createRatingStars',
        'ingredient-input': 'createIngredientInput',
        'step-input': 'createStepInput',
        'category-tag': 'createCategoryTag'
    };

    /**
     * Create component based on type
     */
    static createComponent(type, options = {}) {
        const methodName = this.componentTypes[type];
        if (!methodName || typeof this[methodName] !== 'function') {
            throw new Error(`Unknown component type: ${type}`);
        }
        
        return this[methodName](options);
    }

    /**
     * Create recipe card element
     */
    static createRecipeCard({ recipe, onClick, onFavorite, onEdit, onDelete }) {
        const card = document.createElement('article');
        card.className = 'recipe-card';
        card.setAttribute('data-recipe-id', recipe.id);
        
        const categoriesHtml = recipe.categories.map(cat => 
            `<span class="category-tag category-tag--${cat.toLowerCase().replace(/\s+/g, '-')}">${this.capitalizeCategoryName(cat)}</span>`
        ).join('');

        const ratingStars = '★'.repeat(recipe.finalRating) + '☆'.repeat(5 - recipe.finalRating);

        card.innerHTML = `
            <div class="recipe-card__image" ${recipe.image ? `style="background-image: url(${recipe.image})"` : ''}>
                ${recipe.image ? '' : '🍽️'}
                <button class="recipe-card__favorite ${recipe.favorite ? 'recipe-card__favorite--active' : ''}" 
                        data-action="favorite" aria-label="Toggle favorite">
                    ${recipe.favorite ? '❤️' : '🤍'}
                </button>
            </div>
            <div class="recipe-card__content">
                <header class="recipe-card__header">
                    <h3 class="recipe-card__title">${recipe.name}</h3>
                    <div class="recipe-card__rating" title="Calificación: ${recipe.finalRating}/5">
                        ${ratingStars}
                    </div>
                </header>
                
                <div class="recipe-card__meta">
                    <div class="recipe-card__stat">
                        <span class="recipe-card__stat-icon">⏱️</span>
                        <span class="recipe-card__stat-text">${recipe.time} min</span>
                    </div>
                    <div class="recipe-card__stat">
                        <span class="recipe-card__stat-icon">🍽️</span>
                        <span class="recipe-card__stat-text">${recipe.servings} ${recipe.servings === 1 ? 'porción' : 'porciones'}</span>
                    </div>
                    <div class="recipe-card__stat">
                        <span class="recipe-card__stat-icon">📊</span>
                        <span class="recipe-card__stat-text">${recipe.difficulty}</span>
                    </div>
                </div>

                ${recipe.timesCooked > 0 ? `
                    <div class="recipe-card__cooking-info">
                        <span class="recipe-card__cooked-count">Cocinada ${recipe.timesCooked} veces</span>
                        <span class="recipe-card__last-cooked">${recipe.getLastCookedRelative()}</span>
                    </div>
                ` : ''}
                
                <div class="recipe-card__categories">
                    ${categoriesHtml}
                </div>
                
                <div class="recipe-card__actions">
                    <button class="btn btn--secondary btn--small" data-action="view">
                        <span class="btn__icon">👁️</span>
                        <span class="btn__text">Ver</span>
                    </button>
                    <button class="btn btn--outline btn--small" data-action="edit">
                        <span class="btn__icon">✏️</span>
                        <span class="btn__text">Editar</span>
                    </button>
                    <button class="btn btn--danger btn--small" data-action="delete">
                        <span class="btn__icon">🗑️</span>
                        <span class="btn__text">Eliminar</span>
                    </button>
                </div>
            </div>
        `;

        // Add event listeners
        if (onClick) {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('button')) {
                    onClick(recipe);
                }
            });
        }

        if (onFavorite) {
            const favoriteBtn = card.querySelector('[data-action="favorite"]');
            favoriteBtn?.addEventListener('click', (e) => {
                e.stopPropagation();
                onFavorite(recipe.id);
            });
        }

        if (onEdit) {
            const editBtn = card.querySelector('[data-action="edit"]');
            editBtn?.addEventListener('click', (e) => {
                e.stopPropagation();
                onEdit(recipe);
            });
        }

        if (onDelete) {
            const deleteBtn = card.querySelector('[data-action="delete"]');
            deleteBtn?.addEventListener('click', (e) => {
                e.stopPropagation();
                onDelete(recipe.id);
            });
        }

        const viewBtn = card.querySelector('[data-action="view"]');
        viewBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            if (onClick) onClick(recipe);
        });

        return card;
    }

    /**
     * Create modal element
     */
    static createModal({ title, content, actions = [], className = '' }) {
        const modal = document.createElement('dialog');
        modal.className = `modal ${className}`;
        
        modal.innerHTML = `
            <div class="modal__backdrop"></div>
            <div class="modal__container">
                <div class="modal__content">
                    <header class="modal__header">
                        <h2 class="modal__title">${title}</h2>
                        <button type="button" class="modal__close" aria-label="Cerrar">
                            <span aria-hidden="true">×</span>
                        </button>
                    </header>
                    <div class="modal__body">
                        ${content}
                    </div>
                    ${actions.length > 0 ? `
                        <footer class="modal__footer">
                            ${actions.map(action => `
                                <button type="button" class="btn ${action.className || 'btn--secondary'}" 
                                        data-action="${action.action}">
                                    ${action.icon ? `<span class="btn__icon">${action.icon}</span>` : ''}
                                    <span class="btn__text">${action.text}</span>
                                </button>
                            `).join('')}
                        </footer>
                    ` : ''}
                </div>
            </div>
        `;

        // Add close functionality
        const closeBtn = modal.querySelector('.modal__close');
        const backdrop = modal.querySelector('.modal__backdrop');
        
        const closeModal = () => modal.close();
        
        closeBtn?.addEventListener('click', closeModal);
        backdrop?.addEventListener('click', closeModal);
        
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        });

        return modal;
    }

    /**
     * Create toast notification
     */
    static createToast({ message, type = 'info', duration = 4000, actions = [] }) {
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        toast.innerHTML = `
            <div class="toast__content">
                <div class="toast__icon">${icons[type] || icons.info}</div>
                <div class="toast__message">${message}</div>
                ${actions.length > 0 ? `
                    <div class="toast__actions">
                        ${actions.map(action => `
                            <button type="button" class="toast__action" data-action="${action.action}">
                                ${action.text}
                            </button>
                        `).join('')}
                    </div>
                ` : ''}
                <button type="button" class="toast__close" aria-label="Cerrar">×</button>
            </div>
        `;

        // Auto-dismiss
        if (duration > 0) {
            setTimeout(() => {
                toast.classList.add('toast--hiding');
                setTimeout(() => toast.remove(), 300);
            }, duration);
        }

        // Manual close
        const closeBtn = toast.querySelector('.toast__close');
        closeBtn?.addEventListener('click', () => {
            toast.classList.add('toast--hiding');
            setTimeout(() => toast.remove(), 300);
        });

        return toast;
    }

    /**
     * Create filter button
     */
    static createFilterButton({ text, count = 0, active = false, filter }) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `filter-btn ${active ? 'filter-btn--active' : ''}`;
        button.setAttribute('data-filter', filter);
        
        button.innerHTML = `
            <span class="filter-btn__text">${text}</span>
            <span class="filter-btn__count">${count}</span>
        `;

        return button;
    }

    /**
     * Create search bar
     */
    static createSearchBar({ placeholder = 'Buscar...', onSearch, onClear }) {
        const container = document.createElement('div');
        container.className = 'search';
        
        container.innerHTML = `
            <div class="search__input-wrapper">
                <input type="text" class="search__input" placeholder="${placeholder}" autocomplete="off">
                <button type="button" class="search__clear" hidden>
                    <span aria-hidden="true">×</span>
                </button>
            </div>
        `;

        const input = container.querySelector('.search__input');
        const clearBtn = container.querySelector('.search__clear');

        // Search functionality with debounce
        let timeoutId;
        input.addEventListener('input', (e) => {
            const value = e.target.value.trim();
            
            // Show/hide clear button
            clearBtn.hidden = value === '';
            
            // Debounced search
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                if (onSearch) onSearch(value);
            }, 300);
        });

        // Clear functionality
        clearBtn.addEventListener('click', () => {
            input.value = '';
            clearBtn.hidden = true;
            if (onClear) onClear();
            if (onSearch) onSearch('');
        });

        return container;
    }

    /**
     * Create rating stars input
     */
    static createRatingStars({ rating = 5, onChange, interactive = true }) {
        const container = document.createElement('div');
        container.className = `rating-input ${interactive ? 'rating-input--interactive' : ''}`;
        
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('button');
            star.type = 'button';
            star.className = `rating-star ${i <= rating ? 'rating-star--active' : ''}`;
            star.textContent = '★';
            star.setAttribute('data-rating', i);
            
            if (interactive && onChange) {
                star.addEventListener('click', () => {
                    // Update visual state
                    container.querySelectorAll('.rating-star').forEach((s, index) => {
                        s.classList.toggle('rating-star--active', index < i);
                    });
                    onChange(i);
                });
            }
            
            container.appendChild(star);
        }

        return container;
    }

    /**
     * Create ingredient input with image support
     */
    static createIngredientInput({ value = '', imageUrl = '', onRemove, index }) {
        const container = document.createElement('div');
        container.className = 'dynamic-list__item';
        
        container.innerHTML = `
            <div class="input-group">
                <input type="text" class="form-input" 
                       placeholder="Ingrediente" 
                       value="${value}" 
                       required>
                ${imageUrl ? `
                    <div class="ingredient-image">
                        <img src="${imageUrl}" alt="${value}" loading="lazy">
                    </div>
                ` : ''}
                <button type="button" class="btn btn--danger btn--small" data-action="remove">
                    <span class="btn__icon">×</span>
                </button>
            </div>
        `;

        if (onRemove) {
            const removeBtn = container.querySelector('[data-action="remove"]');
            removeBtn?.addEventListener('click', () => onRemove(index));
        }

        return container;
    }

    /**
     * Create step input
     */
    static createStepInput({ value = '', onRemove, index }) {
        const container = document.createElement('div');
        container.className = 'dynamic-list__item';
        
        container.innerHTML = `
            <div class="input-group">
                <div class="step-number">${index + 1}</div>
                <textarea class="form-textarea" 
                          placeholder="Describe este paso..." 
                          rows="2" 
                          required>${value}</textarea>
                <button type="button" class="btn btn--danger btn--small" data-action="remove">
                    <span class="btn__icon">×</span>
                </button>
            </div>
        `;

        if (onRemove) {
            const removeBtn = container.querySelector('[data-action="remove"]');
            removeBtn?.addEventListener('click', () => onRemove(index));
        }

        return container;
    }

    /**
     * Create category tag
     */
    static createCategoryTag({ category, removable = false, onRemove }) {
        const tag = document.createElement('span');
        tag.className = `category-tag category-tag--${category.toLowerCase().replace(/\s+/g, '-')}`;
        
        tag.innerHTML = `
            <span class="category-tag__text">${category}</span>
            ${removable ? `
                <button type="button" class="category-tag__remove" aria-label="Remover ${category}">×</button>
            ` : ''}
        `;

        if (removable && onRemove) {
            const removeBtn = tag.querySelector('.category-tag__remove');
            removeBtn?.addEventListener('click', () => onRemove(category));
        }

        return tag;
    }

    /**
     * Helper method to capitalize category names
     */
    static capitalizeCategoryName(category) {
        const categoryNames = {
            'desayuno': 'Desayuno',
            'almuerzo': 'Almuerzo', 
            'cena': 'Cena',
            'postre': 'Postre',
            'snack': 'Snack',
            'vegetariano': 'Vegetariano',
            'vegano': 'Vegano',
            'sin gluten': 'Sin Gluten',
            'rapido': 'Rápido',
            'saludable': 'Saludable'
        };
        
        return categoryNames[category.toLowerCase()] || category;
    }
}

/**
 * 4. STRATEGY PATTERN - Estrategias de Ordenamiento
 * Define diferentes algoritmos de ordenamiento
 */
export class SortingStrategy {
    static strategies = {
        name: (a, b) => a.name.localeCompare(b.name),
        time: (a, b) => a.time - b.time,
        rating: (a, b) => b.finalRating - a.finalRating,
        created: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        updated: (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
        cooked: (a, b) => b.timesCooked - a.timesCooked,
        lastCooked: (a, b) => {
            if (!a.lastCooked && !b.lastCooked) return 0;
            if (!a.lastCooked) return 1;
            if (!b.lastCooked) return -1;
            return new Date(b.lastCooked) - new Date(a.lastCooked);
        }
    };

    static sort(recipes, strategy) {
        if (!this.strategies[strategy]) {
            throw new Error(`Unknown sorting strategy: ${strategy}`);
        }
        
        return [...recipes].sort(this.strategies[strategy]);
    }

    static addStrategy(name, sortFunction) {
        this.strategies[name] = sortFunction;
    }
}

/**
 * 5. COMMAND PATTERN - Comandos de Acción
 * Encapsula acciones como objetos para permitir deshacer/rehacer
 */
export class Command {
    constructor(action, undo, description) {
        this.action = action;
        this.undo = undo;
        this.description = description;
        this.timestamp = new Date();
    }

    execute() {
        return this.action();
    }

    revert() {
        return this.undo();
    }
}

export class CommandManager {
    constructor(maxHistory = 50) {
        this.history = [];
        this.currentIndex = -1;
        this.maxHistory = maxHistory;
    }

    execute(command) {
        // Remove any commands after current index (when undoing then doing new action)
        this.history = this.history.slice(0, this.currentIndex + 1);
        
        // Add new command
        this.history.push(command);
        this.currentIndex++;
        
        // Limit history size
        if (this.history.length > this.maxHistory) {
            this.history.shift();
            this.currentIndex--;
        }

        // Execute the command
        const result = command.execute();
        EventManager.emit('command:executed', { command, result });
        return result;
    }

    undo() {
        if (this.canUndo()) {
            const command = this.history[this.currentIndex];
            const result = command.revert();
            this.currentIndex--;
            EventManager.emit('command:undone', { command, result });
            return result;
        }
        return null;
    }

    redo() {
        if (this.canRedo()) {
            this.currentIndex++;
            const command = this.history[this.currentIndex];
            const result = command.execute();
            EventManager.emit('command:redone', { command, result });
            return result;
        }
        return null;
    }

    canUndo() {
        return this.currentIndex >= 0;
    }

    canRedo() {
        return this.currentIndex < this.history.length - 1;
    }

    clear() {
        this.history = [];
        this.currentIndex = -1;
        EventManager.emit('command:cleared');
    }

    getHistory() {
        return this.history.map((cmd, index) => ({
            description: cmd.description,
            timestamp: cmd.timestamp,
            isCurrent: index <= this.currentIndex
        }));
    }
}

/**
 * 6. STATE PATTERN - Estados de la Aplicación
 * Maneja diferentes estados de la aplicación
 */
export class AppState {
    constructor() {
        this.currentState = new LoadingState(this);
        this.data = {
            recipes: [],
            currentFilter: 'all',
            searchQuery: '',
            selectedRecipe: null,
            isLoading: false,
            error: null
        };
    }

    setState(newState) {
        this.currentState = newState;
        this.currentState.enter();
        EventManager.emit('state:changed', newState.constructor.name);
    }

    // Delegate to current state
    render() {
        return this.currentState.render();
    }

    handleSearch(query) {
        return this.currentState.handleSearch(query);
    }

    handleFilter(filter) {
        return this.currentState.handleFilter(filter);
    }

    handleRecipeSelect(recipe) {
        return this.currentState.handleRecipeSelect(recipe);
    }
}

// State implementations
class BaseState {
    constructor(context) {
        this.context = context;
    }

    enter() {
        // Override in subclasses
    }

    render() {
        throw new Error('render method must be implemented');
    }

    handleSearch(query) {
        this.context.data.searchQuery = query;
    }

    handleFilter(filter) {
        this.context.data.currentFilter = filter;
    }

    handleRecipeSelect(recipe) {
        this.context.data.selectedRecipe = recipe;
    }
}

class LoadingState extends BaseState {
    enter() {
        this.context.data.isLoading = true;
        this.context.data.error = null;
    }

    render() {
        return '<div class="loading">Cargando recetas...</div>';
    }

    handleSearch() {
        // Ignore search while loading
    }

    handleFilter() {
        // Ignore filter while loading
    }
}

class ReadyState extends BaseState {
    enter() {
        this.context.data.isLoading = false;
        this.context.data.error = null;
    }

    render() {
        // Render recipe grid
        const filteredRecipes = this.getFilteredRecipes();
        if (filteredRecipes.length === 0) {
            return '<div class="empty-state">No se encontraron recetas</div>';
        }
        
        return filteredRecipes.map(recipe => 
            ComponentFactory.createRecipeCard({ recipe }).outerHTML
        ).join('');
    }

    getFilteredRecipes() {
        let recipes = this.context.data.recipes;
        
        // Apply search filter
        if (this.context.data.searchQuery) {
            const query = this.context.data.searchQuery.toLowerCase();
            recipes = recipes.filter(recipe => 
                recipe.name.toLowerCase().includes(query) ||
                recipe.ingredients.some(ing => ing.toLowerCase().includes(query))
            );
        }
        
        // Apply category filter
        if (this.context.data.currentFilter !== 'all') {
            if (this.context.data.currentFilter === 'favorites') {
                recipes = recipes.filter(recipe => recipe.favorite);
            } else {
                recipes = recipes.filter(recipe => recipe.hasCategory(this.context.data.currentFilter));
            }
        }
        
        return recipes;
    }
}

class ErrorState extends BaseState {
    enter() {
        this.context.data.isLoading = false;
    }

    render() {
        return `
            <div class="error-state">
                <div class="error-state__icon">⚠️</div>
                <div class="error-state__message">${this.context.data.error}</div>
                <button class="btn btn--primary" onclick="location.reload()">
                    Reintentar
                </button>
            </div>
        `;
    }
}

/**
 * 7. DECORATOR PATTERN - Decoradores de Recetas
 * Extiende funcionalidad de recetas sin modificar la clase base
 */
export class RecipeDecorator {
    constructor(recipe) {
        this.recipe = recipe;
    }

    // Delegate all methods to the wrapped recipe
    get name() { return this.recipe.name; }
    get ingredients() { return this.recipe.ingredients; }
    get steps() { return this.recipe.steps; }
    get time() { return this.recipe.time; }
    get difficulty() { return this.recipe.difficulty; }
    get favorite() { return this.recipe.favorite; }
    get finalRating() { return this.recipe.finalRating; }
    
    toJSON() { return this.recipe.toJSON(); }
    toString() { return this.recipe.toString(); }
}

export class NutritionalInfoDecorator extends RecipeDecorator {
    constructor(recipe, nutritionalData) {
        super(recipe);
        this.nutritionalData = nutritionalData;
    }

    getNutritionalInfo() {
        const baseCalories = this.nutritionalData.baseCalories || 200;
        const proteinRatio = this.nutritionalData.proteinRatio || 0.15;
        const carbsRatio = this.nutritionalData.carbsRatio || 0.50;
        const fatRatio = this.nutritionalData.fatRatio || 0.35;

        return {
            calories: Math.round(baseCalories * this.recipe.servings),
            protein: Math.round(baseCalories * proteinRatio / 4), // 4 cal per gram
            carbs: Math.round(baseCalories * carbsRatio / 4),
            fat: Math.round(baseCalories * fatRatio / 9), // 9 cal per gram
            fiber: Math.round(this.ingredients.length * 2) // Rough estimate
        };
    }

    toString() {
        const base = super.toString();
        const nutrition = this.getNutritionalInfo();
        
        return base + `\nINFORMACIÓN NUTRICIONAL (por porción):\n` +
               `- Calorías: ${nutrition.calories}\n` +
               `- Proteínas: ${nutrition.protein}g\n` +
               `- Carbohidratos: ${nutrition.carbs}g\n` +
               `- Grasas: ${nutrition.fat}g\n` +
               `- Fibra: ${nutrition.fiber}g\n`;
    }
}

export class CostCalculatorDecorator extends RecipeDecorator {
    constructor(recipe, ingredientCosts = {}) {
        super(recipe);
        this.ingredientCosts = ingredientCosts;
    }

    calculateCost() {
        const defaultCost = 0.50; // Default cost per ingredient
        let totalCost = 0;

        this.recipe.ingredients.forEach(ingredient => {
            const ingredientName = ingredient.toLowerCase();
            let cost = defaultCost;

            // Check for specific ingredient costs
            for (const [key, value] of Object.entries(this.ingredientCosts)) {
                if (ingredientName.includes(key.toLowerCase())) {
                    cost = value;
                    break;
                }
            }

            totalCost += cost;
        });

        return {
            totalCost: Math.round(totalCost * 100) / 100,
            costPerServing: Math.round((totalCost / this.recipe.servings) * 100) / 100,
            currency: 'USD'
        };
    }

    toString() {
        const base = super.toString();
        const cost = this.calculateCost();
        
        return base + `\nCOSTO ESTIMADO:\n` +
               `- Costo total: $${cost.totalCost} ${cost.currency}\n` +
               `- Costo por porción: $${cost.costPerServing} ${cost.currency}\n`;
    }
}

// Export singleton instances for global use
export const eventManager = EventManager;
export const gestorRecetas = GestorRecetas.obtenerInstancia();
export const commandManager = new CommandManager();
export const appState = new AppState();
