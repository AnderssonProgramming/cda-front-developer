/**
 * ============================================
 * 🍲 COCINA PARA UNO - MAIN APPLICATION
 * JavaScript main controller and UI logic
 * ============================================
 */

/**
 * Controlador principal de la aplicación
 */
class CocinaParaUnoApp {
    constructor() {
        this.gestor = null;
        this.idiomaActual = 'es';
        this.filtroActual = {
            categoria: 'all',
            favoritas: false,
            busqueda: ''
        };
        this.modalActual = null;
        this.recetaEditando = null;
        this.debounceSearch = null;
        
        // Referencias DOM
        this.elementos = {};
        
        this.inicializar();
    }
    
    /**
     * Inicialización de la aplicación
     */
    inicializar() {
        this.obtenerElementosDOM();
        this.configurarEventListeners();
        this.inicializarGestor();
        this.inicializarTemas();
        this.inicializarIdioma();
        this.renderizarInterfaz();
        
        // Crear íconos de Lucide
        lucide.createIcons();
        
        console.log('🍲 Cocina para Uno inicializada correctamente');
    }
    
    /**
     * Obtener referencias a elementos DOM
     */
    obtenerElementosDOM() {
        this.elementos = {
            // Header
            appTitle: document.getElementById('app-title'),
            appSubtitle: document.getElementById('app-subtitle'),
            currentLanguage: document.getElementById('current-language'),
            themeToggle: document.getElementById('theme-toggle'),
            languageBtn: document.getElementById('language-btn'),
            
            // Search and filters
            searchInput: document.getElementById('search-input'),
            searchClear: document.getElementById('search-clear'),
            categoryFilter: document.getElementById('category-filter'),
            favoritesToggle: document.getElementById('favorites-toggle'),
            newRecipeBtn: document.getElementById('new-recipe-btn'),
            
            // Main content
            recipesGrid: document.getElementById('recipes-grid'),
            emptyState: document.getElementById('empty-state'),
            emptyNewRecipe: document.getElementById('empty-new-recipe'),
            
            // Recipe modal
            recipeModal: document.getElementById('recipe-modal'),
            modalTitle: document.getElementById('modal-title'),
            modalClose: document.getElementById('modal-close'),
            recipeForm: document.getElementById('recipe-form'),
            recipeName: document.getElementById('recipe-name'),
            recipeTime: document.getElementById('recipe-time'),
            recipeServings: document.getElementById('recipe-servings'),
            recipeDifficulty: document.getElementById('recipe-difficulty'),
            recipeNotes: document.getElementById('recipe-notes'),
            manualRating: document.getElementById('manual-rating'),
            ingredientsList: document.getElementById('ingredients-list'),
            stepsList: document.getElementById('steps-list'),
            categoriesGrid: document.getElementById('categories-grid'),
            addIngredient: document.getElementById('add-ingredient'),
            addStep: document.getElementById('add-step'),
            cancelRecipe: document.getElementById('cancel-recipe'),
            saveText: document.getElementById('save-text'),
            
            // View modal
            viewModal: document.getElementById('view-modal'),
            viewTitle: document.getElementById('view-title'),
            viewClose: document.getElementById('view-close'),
            viewRecipeName: document.getElementById('view-recipe-name'),
            recipeView: document.getElementById('recipe-view'),
            
            // Toast container
            toastContainer: document.getElementById('toast-container'),
            
            // Footer stats
            statsTotal: document.getElementById('stats-total'),
            statsFavorites: document.getElementById('stats-favorites'),
            statsTime: document.getElementById('stats-time'),
            statsCooked: document.getElementById('stats-cooked')
        };
    }
    
    /**
     * Configurar event listeners
     */
    configurarEventListeners() {
        // Theme toggle
        this.elementos.themeToggle?.addEventListener('click', () => {
            GestorTemas.alternar();
        });
        
        // Language toggle
        this.elementos.languageBtn?.addEventListener('click', () => {
            this.cambiarIdioma();
        });
        
        // Search
        this.elementos.searchInput?.addEventListener('input', (e) => {
            this.buscarRecetas(e.target.value);
        });
        
        this.elementos.searchClear?.addEventListener('click', () => {
            this.limpiarBusqueda();
        });
        
        // Filters
        this.elementos.categoryFilter?.addEventListener('change', (e) => {
            this.filtrarPorCategoria(e.target.value);
        });
        
        this.elementos.favoritesToggle?.addEventListener('click', () => {
            this.alternarFavoritas();
        });
        
        // New recipe buttons
        this.elementos.newRecipeBtn?.addEventListener('click', () => {
            this.abrirModalReceta();
        });
        
        this.elementos.emptyNewRecipe?.addEventListener('click', () => {
            this.abrirModalReceta();
        });
        
        // Modal events
        this.elementos.modalClose?.addEventListener('click', () => {
            this.cerrarModal('recipe');
        });
        
        this.elementos.viewClose?.addEventListener('click', () => {
            this.cerrarModal('view');
        });
        
        this.elementos.cancelRecipe?.addEventListener('click', () => {
            this.cerrarModal('recipe');
        });
        
        // Form events
        this.elementos.recipeForm?.addEventListener('submit', (e) => {
            this.guardarReceta(e);
        });
        
        this.elementos.addIngredient?.addEventListener('click', () => {
            this.agregarIngrediente();
        });
        
        this.elementos.addStep?.addEventListener('click', () => {
            this.agregarPaso();
        });
        
        // Rating events
        this.elementos.manualRating?.addEventListener('click', (e) => {
            if (e.target.classList.contains('star') || e.target.closest('.star')) {
                const button = e.target.closest('.star');
                const rating = parseInt(button.dataset.rating);
                this.actualizarRatingFormulario(rating);
            }
        });
        
        // Recipe grid events (delegación de eventos)
        this.elementos.recipesGrid?.addEventListener('click', (e) => {
            this.manejarClickReceta(e);
        });
        
        // Modal backdrop click
        this.elementos.recipeModal?.addEventListener('click', (e) => {
            if (e.target === this.elementos.recipeModal) {
                this.cerrarModal('recipe');
            }
        });
        
        this.elementos.viewModal?.addEventListener('click', (e) => {
            if (e.target === this.elementos.viewModal) {
                this.cerrarModal('view');
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.manejarTeclado(e);
        });
        
        // Event Manager listeners
        EventManager.on('receta:agregada', (receta) => {
            this.mostrarToast('success', this.t.recipeAdded);
            this.renderizarRecetas();
            this.actualizarEstadisticas();
        });
        
        EventManager.on('receta:actualizada', (receta) => {
            this.mostrarToast('success', this.t.recipeUpdated);
            this.renderizarRecetas();
            this.actualizarEstadisticas();
        });
        
        EventManager.on('receta:eliminada', (receta) => {
            this.mostrarToast('success', this.t.recipeDeleted);
            this.renderizarRecetas();
            this.actualizarEstadisticas();
        });
        
        EventManager.on('receta:favorita', (receta) => {
            this.renderizarRecetas();
            this.actualizarEstadisticas();
        });
        
        EventManager.on('receta:cocinada', (receta) => {
            this.mostrarToast('success', '¡Receta marcada como cocinada! 👨‍🍳');
            this.renderizarRecetas();
            this.actualizarEstadisticas();
        });
        
        EventManager.on('tema:cambiado', (tema) => {
            console.log(`Tema cambiado a: ${tema}`);
        });
    }
    
    /**
     * Inicializar gestor de recetas
     */
    inicializarGestor() {
        this.gestor = GestorRecetas.obtenerInstancia();
        this.gestor.inicializar();
    }
    
    /**
     * Inicializar gestor de temas
     */
    inicializarTemas() {
        GestorTemas.inicializar();
    }
    
    /**
     * Inicializar idioma
     */
    inicializarIdioma() {
        const idiomaGuardado = localStorage.getItem(AppConfig.STORAGE_KEYS.language);
        this.idiomaActual = idiomaGuardado || 'es';
        this.t = Traducciones[this.idiomaActual];
        this.actualizarTextos();
    }
    
    /**
     * Renderizar interfaz completa
     */
    renderizarInterfaz() {
        this.renderizarCategorias();
        this.renderizarRecetas();
        this.actualizarEstadisticas();
    }
    
    /**
     * Cambiar idioma
     */
    cambiarIdioma() {
        const idiomas = ['es', 'en'];
        const indiceActual = idiomas.indexOf(this.idiomaActual);
        const siguienteIndice = (indiceActual + 1) % idiomas.length;
        
        this.idiomaActual = idiomas[siguienteIndice];
        this.t = Traducciones[this.idiomaActual];
        
        localStorage.setItem(AppConfig.STORAGE_KEYS.language, this.idiomaActual);
        
        this.actualizarTextos();
        this.renderizarRecetas();
    }
    
    /**
     * Actualizar textos de la interfaz
     */
    actualizarTextos() {
        // Header
        if (this.elementos.appTitle) this.elementos.appTitle.textContent = this.t.title;
        if (this.elementos.appSubtitle) this.elementos.appSubtitle.textContent = this.t.subtitle;
        if (this.elementos.currentLanguage) this.elementos.currentLanguage.textContent = this.idiomaActual.toUpperCase();
        
        // Search
        if (this.elementos.searchInput) this.elementos.searchInput.placeholder = this.t.search;
        
        // Buttons
        const newRecipeText = document.getElementById('new-recipe-text');
        if (newRecipeText) newRecipeText.textContent = this.t.newRecipe;
        
        const favoritesText = document.getElementById('favorites-text');
        if (favoritesText) favoritesText.textContent = this.t.favorites;
        
        // Empty state
        const emptyTitle = document.getElementById('empty-title');
        if (emptyTitle) emptyTitle.textContent = this.t.noRecipes;
        
        const emptySubtitle = document.getElementById('empty-subtitle');
        if (emptySubtitle) emptySubtitle.textContent = this.t.createFirst;
        
        // Footer
        const footerTitle = document.getElementById('footer-title');
        if (footerTitle) footerTitle.textContent = this.t.title;
        
        const footerSubtitle = document.getElementById('footer-subtitle');
        if (footerSubtitle) footerSubtitle.textContent = this.t.subtitle;
        
        const footerMade = document.getElementById('footer-made');
        if (footerMade) footerMade.textContent = this.t.footer;
        
        // Stats labels
        const statsLabels = {
            'stats-total-label': this.t.totalRecipes,
            'stats-favorites-label': this.t.favoriteRecipes,
            'stats-time-label': this.t.averageTime,
            'footer-stats-title': this.t.statistics,
            'footer-tech-title': this.t.technologies
        };
        
        Object.entries(statsLabels).forEach(([id, text]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = text + ':';
        });
        
        // Category filter
        this.renderizarCategorias();
    }
    
    /**
     * Buscar recetas con debounce
     */
    buscarRecetas(termino) {
        // Cancelar búsqueda anterior
        if (this.debounceSearch) {
            clearTimeout(this.debounceSearch);
        }
        
        // Mostrar/ocultar botón de limpiar
        if (this.elementos.searchClear) {
            this.elementos.searchClear.classList.toggle('hidden', !termino.trim());
        }
        
        // Configurar nueva búsqueda con debounce
        this.debounceSearch = setTimeout(() => {
            this.filtroActual.busqueda = termino.trim();
            this.renderizarRecetas();
        }, AppConfig.DEBOUNCE_DELAY);
    }
    
    /**
     * Limpiar búsqueda
     */
    limpiarBusqueda() {
        if (this.elementos.searchInput) {
            this.elementos.searchInput.value = '';
        }
        if (this.elementos.searchClear) {
            this.elementos.searchClear.classList.add('hidden');
        }
        this.filtroActual.busqueda = '';
        this.renderizarRecetas();
    }
    
    /**
     * Filtrar por categoría
     */
    filtrarPorCategoria(categoria) {
        this.filtroActual.categoria = categoria;
        this.renderizarRecetas();
    }
    
    /**
     * Alternar filtro de favoritas
     */
    alternarFavoritas() {
        this.filtroActual.favoritas = !this.filtroActual.favoritas;
        
        if (this.elementos.favoritesToggle) {
            this.elementos.favoritesToggle.classList.toggle('active', this.filtroActual.favoritas);
        }
        
        this.renderizarRecetas();
    }
    
    /**
     * Renderizar categorías en el select
     */
    renderizarCategorias() {
        if (!this.elementos.categoryFilter) return;
        
        const opciones = [
            `<option value="all">${this.t.all}</option>`,
            ...CATEGORIAS.map(cat => 
                `<option value="${cat}">${this.t.categoryNames[cat] || cat}</option>`
            )
        ];
        
        this.elementos.categoryFilter.innerHTML = opciones.join('');
    }
    
    /**
     * Obtener recetas filtradas
     */
    obtenerRecetasFiltradas() {
        let recetas = this.gestor.obtenerRecetas();
        
        // Filtrar por búsqueda
        if (this.filtroActual.busqueda) {
            recetas = EstrategiasBusqueda.inteligente(recetas, this.filtroActual.busqueda);
        }
        
        // Filtrar por categoría
        if (this.filtroActual.categoria !== 'all') {
            recetas = recetas.filter(receta => 
                receta.categoria.includes(this.filtroActual.categoria)
            );
        }
        
        // Filtrar por favoritas
        if (this.filtroActual.favoritas) {
            recetas = recetas.filter(receta => receta.favorita);
        }
        
        return recetas;
    }
    
    /**
     * Renderizar lista de recetas
     */
    renderizarRecetas() {
        const recetas = this.obtenerRecetasFiltradas();
        
        if (recetas.length === 0) {
            this.mostrarEstadoVacio();
        } else {
            this.mostrarRecetas(recetas);
        }
    }
    
    /**
     * Mostrar estado vacío
     */
    mostrarEstadoVacio() {
        if (this.elementos.recipesGrid) {
            this.elementos.recipesGrid.style.display = 'none';
        }
        if (this.elementos.emptyState) {
            this.elementos.emptyState.classList.remove('hidden');
        }
    }
    
    /**
     * Mostrar recetas
     */
    mostrarRecetas(recetas) {
        if (this.elementos.emptyState) {
            this.elementos.emptyState.classList.add('hidden');
        }
        if (this.elementos.recipesGrid) {
            this.elementos.recipesGrid.style.display = 'grid';
            
            // Limpiar grid
            this.elementos.recipesGrid.innerHTML = '';
            
            // Agregar recetas
            recetas.forEach(receta => {
                const tarjeta = ComponentFactory.crearTarjetaReceta(receta, this.idiomaActual);
                this.elementos.recipesGrid.appendChild(tarjeta);
            });
            
            // Recrear íconos
            lucide.createIcons();
        }
    }
    
    /**
     * Manejar clicks en recetas
     */
    manejarClickReceta(e) {
        const button = e.target.closest('button');
        if (!button) return;
        
        const recipeId = button.dataset.recipeId;
        const action = button.dataset.action;
        
        if (!recipeId) return;
        
        switch (action) {
            case 'cook':
                this.marcarComoCocinada(recipeId);
                break;
            case 'view':
                this.verReceta(recipeId);
                break;
            case 'edit':
                this.editarReceta(recipeId);
                break;
            case 'delete':
                this.eliminarReceta(recipeId);
                break;
            default:
                // Botón de favorito
                if (button.classList.contains('recipe-favorite-btn')) {
                    this.alternarFavorito(recipeId);
                }
                break;
        }
    }
    
    /**
     * Marcar receta como cocinada
     */
    marcarComoCocinada(id) {
        try {
            this.gestor.marcarComoCocinada(id);
        } catch (error) {
            this.mostrarToast('error', 'Error al marcar como cocinada');
            console.error('Error:', error);
        }
    }
    
    /**
     * Alternar favorito
     */
    alternarFavorito(id) {
        try {
            this.gestor.marcarComoFavorita(id);
        } catch (error) {
            this.mostrarToast('error', 'Error al cambiar favorito');
            console.error('Error:', error);
        }
    }
    
    /**
     * Ver receta en modal
     */
    verReceta(id) {
        const receta = this.gestor.obtenerRecetaPorId(id);
        if (!receta) return;
        
        this.renderizarVistaReceta(receta);
        this.abrirModal('view');
    }
    
    /**
     * Renderizar vista de receta
     */
    renderizarVistaReceta(receta) {
        if (!this.elementos.recipeView) return;
        
        if (this.elementos.viewRecipeName) {
            this.elementos.viewRecipeName.textContent = receta.nombre;
        }
        
        const t = this.t;
        
        this.elementos.recipeView.innerHTML = `
            <img src="${receta.imagen || AppConfig.PLACEHOLDER_IMAGE}" 
                 alt="${receta.nombre}" 
                 class="recipe-view-image">
            
            <div class="recipe-view-meta">
                <div class="recipe-view-meta-item">
                    <i data-lucide="clock"></i>
                    <div>${receta.tiempo} ${t.minutes}</div>
                </div>
                <div class="recipe-view-meta-item">
                    <i data-lucide="users"></i>
                    <div>${receta.porciones} ${t.servings}</div>
                </div>
                <div class="recipe-view-meta-item">
                    <div>${t[receta.dificultad.toLowerCase()]}</div>
                </div>
                <div class="recipe-view-meta-item">
                    <i data-lucide="calendar"></i>
                    <div>${receta.vecesCocinada}x</div>
                </div>
            </div>
            
            <div class="recipe-view-rating">
                <h4>${t.rateRecipe}</h4>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; text-align: center;">
                    <div>
                        <div style="font-size: 0.875rem; color: var(--gray-600); margin-bottom: 0.5rem;">${t.manualRating}</div>
                        <div class="star-rating" data-recipe-id="${receta.id}">
                            ${this.crearEstrellasInteractivas(receta.manualRating, receta.id)}
                        </div>
                        <div style="font-size: 0.75rem; color: var(--gray-500); margin-top: 0.25rem;">
                            ${receta.manualRating}/5
                        </div>
                    </div>
                    <div>
                        <div style="font-size: 0.875rem; color: var(--gray-600); margin-bottom: 0.5rem;">${t.autoRating}</div>
                        <div style="display: flex; align-items: center; justify-content: center; gap: 0.25rem;">
                            <i data-lucide="trending-up" style="color: var(--info-color); width: 1rem; height: 1rem;"></i>
                            ${ComponentFactory.crearEstrellas(receta.autoRating, true)}
                        </div>
                        <div style="font-size: 0.75rem; color: var(--gray-500); margin-top: 0.25rem;">
                            ${receta.autoRating}/5
                        </div>
                    </div>
                    <div>
                        <div style="font-size: 0.875rem; color: var(--gray-600); margin-bottom: 0.5rem;">${t.finalRating}</div>
                        ${ComponentFactory.crearEstrellas(receta.finalRating, true)}
                        <div style="font-size: 0.75rem; color: var(--gray-500); margin-top: 0.25rem;">
                            ${receta.finalRating}/5
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="recipe-view-stats">
                <h4 style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
                    <i data-lucide="trending-up" style="color: var(--success-color);"></i>
                    ${t.cookingStats}
                </h4>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; font-size: 0.875rem;">
                    <div>
                        <span style="color: var(--gray-600);">${t.timesCooked}:</span>
                        <span style="font-weight: 500; margin-left: 0.5rem;">${receta.vecesCocinada}</span>
                    </div>
                    <div>
                        <span style="color: var(--gray-600);">${t.lastCooked}:</span>
                        <span style="font-weight: 500; margin-left: 0.5rem;">
                            ${formatearFechaRelativa(receta.ultimaVezCocinada, this.idiomaActual)}
                        </span>
                    </div>
                </div>
            </div>
            
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem;">
                ${receta.categoria.map(cat => 
                    `<span style="background: rgba(255, 107, 53, 0.1); color: var(--primary-color); padding: 0.25rem 0.5rem; border-radius: 0.375rem; font-size: 0.875rem; font-weight: 500;">
                        ${t.categoryNames[cat] || cat}
                    </span>`
                ).join('')}
            </div>
            
            <div class="recipe-view-section">
                <h3>
                    <i data-lucide="utensils" style="color: var(--primary-color);"></i>
                    ${t.ingredients}
                </h3>
                <div class="recipe-view-ingredients">
                    ${receta.ingredientes.map((ingrediente, index) => `
                        <div class="recipe-view-ingredient">
                            <div style="width: 2rem; height: 2rem; background: var(--gray-100); border-radius: 50%; display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0;">
                                ${receta.ingredientImages?.[index] && receta.ingredientImages[index] !== AppConfig.PLACEHOLDER_IMAGE ? 
                                    `<img src="${receta.ingredientImages[index]}" alt="${ingrediente}" style="width: 100%; height: 100%; object-fit: cover;">` :
                                    `<div style="width: 0.5rem; height: 0.5rem; background: var(--primary-color); border-radius: 50%;"></div>`
                                }
                            </div>
                            <span>${ingrediente}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="recipe-view-section">
                <h3>
                    <i data-lucide="chef-hat" style="color: var(--primary-color);"></i>
                    ${t.steps}
                </h3>
                <div class="recipe-view-steps">
                    ${receta.pasos.map((paso, index) => `
                        <div class="recipe-view-step">
                            <div class="recipe-view-step-number">${index + 1}</div>
                            <div style="flex: 1;">${paso}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            ${receta.notas ? `
                <div class="recipe-view-section">
                    <h3>
                        <i data-lucide="message-square" style="color: var(--primary-color);"></i>
                        ${t.notes}
                    </h3>
                    <div class="recipe-view-notes">
                        <p>"${receta.notas}"</p>
                    </div>
                </div>
            ` : ''}
            
            <div class="recipe-view-actions">
                <button class="btn-primary" onclick="window.app.marcarComoCocinada('${receta.id}'); window.app.cerrarModal('view');">
                    <i data-lucide="chef-hat"></i>
                    <span>${t.markAsCooked}</span>
                </button>
            </div>
        `;
        
        // Configurar event listener para rating interactivo
        const ratingContainer = this.elementos.recipeView.querySelector('.star-rating');
        if (ratingContainer) {
            ratingContainer.addEventListener('click', (e) => {
                const star = e.target.closest('.star');
                if (star) {
                    const rating = parseInt(star.dataset.rating);
                    this.actualizarRating(receta.id, rating);
                    this.renderizarVistaReceta(this.gestor.obtenerRecetaPorId(receta.id));
                }
            });
        }
        
        lucide.createIcons();
    }
    
    /**
     * Crear estrellas interactivas para vista
     */
    crearEstrellasInteractivas(rating, recipeId) {
        const estrellas = [];
        for (let i = 1; i <= 5; i++) {
            const activa = i <= rating;
            estrellas.push(`
                <button type="button" 
                        class="star ${activa ? 'active' : ''}" 
                        data-rating="${i}"
                        data-recipe-id="${recipeId}"
                        title="${i} estrella${i > 1 ? 's' : ''}"
                        style="background: none; border: none; cursor: pointer; padding: 0.25rem; border-radius: 0.25rem; transition: all 150ms; color: ${activa ? '#FCD34D' : 'var(--gray-400)'};">
                    <i data-lucide="star" style="width: 1rem; height: 1rem;"></i>
                </button>
            `);
        }
        return estrellas.join('');
    }
    
    /**
     * Actualizar rating de receta
     */
    actualizarRating(id, rating) {
        try {
            this.gestor.actualizarRating(id, rating);
        } catch (error) {
            this.mostrarToast('error', 'Error al actualizar calificación');
            console.error('Error:', error);
        }
    }
    
    /**
     * Editar receta
     */
    editarReceta(id) {
        const receta = this.gestor.obtenerRecetaPorId(id);
        if (!receta) return;
        
        this.recetaEditando = receta;
        this.cargarRecetaEnFormulario(receta);
        this.abrirModalReceta(true);
    }
    
    /**
     * Eliminar receta
     */
    eliminarReceta(id) {
        if (confirm(this.t.deleteConfirm)) {
            try {
                const comando = CommandManager.crearComandoEliminarReceta(id);
                CommandManager.ejecutar(comando);
            } catch (error) {
                this.mostrarToast('error', 'Error al eliminar receta');
                console.error('Error:', error);
            }
        }
    }
    
    /**
     * Abrir modal de receta
     */
    abrirModalReceta(esEdicion = false) {
        if (!esEdicion) {
            this.recetaEditando = null;
            this.limpiarFormulario();
            this.renderizarFormularioCategorias();
        }
        
        if (this.elementos.modalTitle) {
            this.elementos.modalTitle.textContent = esEdicion ? this.t.editRecipe : this.t.addRecipe;
        }
        
        if (this.elementos.saveText) {
            this.elementos.saveText.textContent = this.t.save;
        }
        
        this.abrirModal('recipe');
    }
    
    /**
     * Abrir modal
     */
    abrirModal(tipo) {
        const modal = tipo === 'recipe' ? this.elementos.recipeModal : this.elementos.viewModal;
        if (modal) {
            modal.classList.add('active');
            this.modalActual = tipo;
            document.body.style.overflow = 'hidden';
            
            // Focus en primer input si es modal de receta
            if (tipo === 'recipe' && this.elementos.recipeName) {
                setTimeout(() => this.elementos.recipeName.focus(), 100);
            }
        }
    }
    
    /**
     * Cerrar modal
     */
    cerrarModal(tipo) {
        const modal = tipo === 'recipe' ? this.elementos.recipeModal : this.elementos.viewModal;
        if (modal) {
            modal.classList.remove('active');
            this.modalActual = null;
            document.body.style.overflow = '';
            
            if (tipo === 'recipe') {
                this.recetaEditando = null;
            }
        }
    }
    
    /**
     * Limpiar formulario
     */
    limpiarFormulario() {
        if (this.elementos.recipeName) this.elementos.recipeName.value = '';
        if (this.elementos.recipeTime) this.elementos.recipeTime.value = '15';
        if (this.elementos.recipeServings) this.elementos.recipeServings.value = '1';
        if (this.elementos.recipeDifficulty) this.elementos.recipeDifficulty.value = 'Fácil';
        if (this.elementos.recipeNotes) this.elementos.recipeNotes.value = '';
        
        this.actualizarRatingFormulario(5);
        this.renderizarIngredientes(['']);
        this.renderizarPasos(['']);
    }
    
    /**
     * Cargar receta en formulario
     */
    cargarRecetaEnFormulario(receta) {
        if (this.elementos.recipeName) this.elementos.recipeName.value = receta.nombre;
        if (this.elementos.recipeTime) this.elementos.recipeTime.value = receta.tiempo;
        if (this.elementos.recipeServings) this.elementos.recipeServings.value = receta.porciones;
        if (this.elementos.recipeDifficulty) this.elementos.recipeDifficulty.value = receta.dificultad;
        if (this.elementos.recipeNotes) this.elementos.recipeNotes.value = receta.notas || '';
        
        this.actualizarRatingFormulario(receta.manualRating);
        this.renderizarIngredientes(receta.ingredientes, receta.ingredientImages);
        this.renderizarPasos(receta.pasos);
        this.renderizarFormularioCategorias(receta.categoria);
    }
    
    /**
     * Actualizar rating en formulario
     */
    actualizarRatingFormulario(rating) {
        if (!this.elementos.manualRating) return;
        
        const estrellas = this.elementos.manualRating.querySelectorAll('.star');
        estrellas.forEach((estrella, index) => {
            estrella.classList.toggle('active', index < rating);
        });
    }
    
    /**
     * Renderizar ingredientes en formulario
     */
    renderizarIngredientes(ingredientes = [''], imagenes = []) {
        if (!this.elementos.ingredientsList) return;
        
        this.elementos.ingredientsList.innerHTML = '';
        
        ingredientes.forEach((ingrediente, index) => {
            const item = ComponentFactory.crearItemIngrediente(
                ingrediente, 
                imagenes[index] || '', 
                index
            );
            this.elementos.ingredientsList.appendChild(item);
        });
        
        // Event listeners para ingredientes
        this.elementos.ingredientsList.addEventListener('input', (e) => {
            if (e.target.classList.contains('ingredient-input')) {
                this.manejarCambioIngrediente(e);
            }
        });
        
        this.elementos.ingredientsList.addEventListener('click', (e) => {
            if (e.target.closest('.remove-btn[data-type="ingredient"]')) {
                this.eliminarIngrediente(e.target.closest('.remove-btn').dataset.index);
            }
        });
    }
    
    /**
     * Renderizar pasos en formulario
     */
    renderizarPasos(pasos = ['']) {
        if (!this.elementos.stepsList) return;
        
        this.elementos.stepsList.innerHTML = '';
        
        pasos.forEach((paso, index) => {
            const item = ComponentFactory.crearItemPaso(paso, index);
            this.elementos.stepsList.appendChild(item);
        });
        
        // Event listeners para pasos
        this.elementos.stepsList.addEventListener('click', (e) => {
            if (e.target.closest('.remove-btn[data-type="step"]')) {
                this.eliminarPaso(e.target.closest('.remove-btn').dataset.index);
            }
        });
    }
    
    /**
     * Renderizar categorías en formulario
     */
    renderizarFormularioCategorias(categoriasSeleccionadas = []) {
        if (!this.elementos.categoriesGrid) return;
        
        this.elementos.categoriesGrid.innerHTML = '';
        
        CATEGORIAS.forEach(categoria => {
            const seleccionada = categoriasSeleccionadas.includes(categoria);
            const checkbox = document.createElement('label');
            checkbox.className = `category-checkbox ${seleccionada ? 'selected' : ''}`;
            
            checkbox.innerHTML = `
                <input type="checkbox" 
                       value="${categoria}" 
                       ${seleccionada ? 'checked' : ''}
                       style="display: none;">
                <span>${this.t.categoryNames[categoria] || categoria}</span>
            `;
            
            checkbox.addEventListener('change', (e) => {
                checkbox.classList.toggle('selected', e.target.checked);
            });
            
            this.elementos.categoriesGrid.appendChild(checkbox);
        });
    }
    
    /**
     * Agregar ingrediente
     */
    agregarIngrediente() {
        const ingredientes = this.obtenerIngredientesFormulario();
        ingredientes.push('');
        this.renderizarIngredientes(ingredientes);
    }
    
    /**
     * Eliminar ingrediente
     */
    eliminarIngrediente(index) {
        const ingredientes = this.obtenerIngredientesFormulario();
        if (ingredientes.length > 1) {
            ingredientes.splice(index, 1);
            this.renderizarIngredientes(ingredientes);
        }
    }
    
    /**
     * Agregar paso
     */
    agregarPaso() {
        const pasos = this.obtenerPasosFormulario();
        pasos.push('');
        this.renderizarPasos(pasos);
    }
    
    /**
     * Eliminar paso
     */
    eliminarPaso(index) {
        const pasos = this.obtenerPasosFormulario();
        if (pasos.length > 1) {
            pasos.splice(index, 1);
            this.renderizarPasos(pasos);
        }
    }
    
    /**
     * Manejar cambio en ingrediente
     */
    async manejarCambioIngrediente(e) {
        const input = e.target;
        const index = parseInt(input.dataset.index);
        const valor = input.value.trim();
        
        if (valor) {
            const item = input.closest('.ingredient-item');
            const imagenContainer = item.querySelector('.ingredient-image');
            
            // Mostrar indicador de carga
            imagenContainer.innerHTML = '<i data-lucide="loader" style="animation: spin 1s linear infinite;"></i>';
            lucide.createIcons();
            
            try {
                const imagen = await APIProxy.obtenerImagenIngrediente(valor);
                
                if (imagen && imagen !== AppConfig.PLACEHOLDER_IMAGE) {
                    imagenContainer.innerHTML = `<img src="${imagen}" alt="${valor}" loading="lazy">`;
                } else {
                    imagenContainer.innerHTML = '<i data-lucide="image"></i>';
                    lucide.createIcons();
                }
            } catch (error) {
                imagenContainer.innerHTML = '<i data-lucide="image"></i>';
                lucide.createIcons();
            }
        }
    }
    
    /**
     * Obtener ingredientes del formulario
     */
    obtenerIngredientesFormulario() {
        const inputs = this.elementos.ingredientsList?.querySelectorAll('.ingredient-input') || [];
        return Array.from(inputs).map(input => input.value.trim());
    }
    
    /**
     * Obtener pasos del formulario
     */
    obtenerPasosFormulario() {
        const inputs = this.elementos.stepsList?.querySelectorAll('.step-input') || [];
        return Array.from(inputs).map(input => input.value.trim());
    }
    
    /**
     * Obtener categorías seleccionadas
     */
    obtenerCategoriasSeleccionadas() {
        const checkboxes = this.elementos.categoriesGrid?.querySelectorAll('input[type="checkbox"]:checked') || [];
        return Array.from(checkboxes).map(cb => cb.value);
    }
    
    /**
     * Obtener rating del formulario
     */
    obtenerRatingFormulario() {
        const estrellasActivas = this.elementos.manualRating?.querySelectorAll('.star.active') || [];
        return estrellasActivas.length || 5;
    }
    
    /**
     * Guardar receta
     */
    async guardarReceta(e) {
        e.preventDefault();
        
        try {
            const datos = {
                nombre: this.elementos.recipeName?.value.trim() || '',
                ingredientes: this.obtenerIngredientesFormulario().filter(ing => ing),
                pasos: this.obtenerPasosFormulario().filter(paso => paso),
                tiempo: parseInt(this.elementos.recipeTime?.value) || 15,
                categoria: this.obtenerCategoriasSeleccionadas(),
                porciones: parseInt(this.elementos.recipeServings?.value) || 1,
                dificultad: this.elementos.recipeDifficulty?.value || 'Fácil',
                notas: this.elementos.recipeNotes?.value.trim() || '',
                manualRating: this.obtenerRatingFormulario()
            };
            
            // Validar datos
            const validacion = Validador.receta(datos);
            if (!validacion.valido) {
                this.mostrarToast('error', validacion.errores[0]);
                return;
            }
            
            // Obtener imagen principal
            this.mostrarToast('info', 'Obteniendo imagen...');
            datos.imagen = await APIProxy.obtenerImagen(datos.nombre);
            
            // Obtener imágenes de ingredientes
            datos.ingredientImages = await Promise.all(
                datos.ingredientes.map(ingrediente => APIProxy.obtenerImagenIngrediente(ingrediente))
            );
            
            if (this.recetaEditando) {
                // Actualizar receta existente
                this.gestor.actualizarReceta(this.recetaEditando.id, datos);
            } else {
                // Crear nueva receta
                const comando = CommandManager.crearComandoAgregarReceta(datos);
                CommandManager.ejecutar(comando);
            }
            
            this.cerrarModal('recipe');
            
        } catch (error) {
            this.mostrarToast('error', 'Error al guardar receta');
            console.error('Error:', error);
        }
    }
    
    /**
     * Actualizar estadísticas
     */
    actualizarEstadisticas() {
        const stats = this.gestor.obtenerEstadisticas();
        
        if (this.elementos.statsTotal) {
            this.elementos.statsTotal.textContent = stats.total;
        }
        if (this.elementos.statsFavorites) {
            this.elementos.statsFavorites.textContent = stats.favoritas;
        }
        if (this.elementos.statsTime) {
            this.elementos.statsTime.textContent = `${stats.tiempoPromedio} min`;
        }
        if (this.elementos.statsCooked) {
            this.elementos.statsCooked.textContent = stats.totalCocinadas;
        }
    }
    
    /**
     * Mostrar toast
     */
    mostrarToast(tipo, mensaje) {
        if (!this.elementos.toastContainer) return;
        
        const toast = ComponentFactory.crearToast(tipo, mensaje);
        this.elementos.toastContainer.appendChild(toast);
        
        // Animar entrada
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
    }
    
    /**
     * Manejar teclado
     */
    manejarTeclado(e) {
        // ESC para cerrar modales
        if (e.key === 'Escape' && this.modalActual) {
            this.cerrarModal(this.modalActual);
        }
        
        // Ctrl/Cmd + N para nueva receta
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            this.abrirModalReceta();
        }
        
        // Ctrl/Cmd + F para enfocar búsqueda
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            this.elementos.searchInput?.focus();
        }
        
        // Ctrl/Cmd + Z para deshacer
        if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
            e.preventDefault();
            if (CommandManager.puedeDeshacer()) {
                CommandManager.deshacer();
            }
        }
        
        // Ctrl/Cmd + Shift + Z para rehacer
        if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
            e.preventDefault();
            if (CommandManager.puedeRehacer()) {
                CommandManager.rehacer();
            }
        }
    }
}

/**
 * Inicialización de la aplicación
 */
document.addEventListener('DOMContentLoaded', () => {
    // Crear instancia global de la aplicación
    window.app = new CocinaParaUnoApp();
    
    // Configurar PWA
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('SW registered: ', registration);
                })
                .catch((registrationError) => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
});
