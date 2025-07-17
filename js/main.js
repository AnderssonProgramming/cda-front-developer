/**
 * ============================================
 * 🍲 COCINA PARA UNO - ENHANCED MAIN APPLICATION
 * Enhanced JavaScript main controller and UI logic
 * ============================================
 */

import { 
    Recipe, 
    ImageService, 
    ValidationService 
} from './objects.js';

import { 
    gestorRecetas, 
    eventManager, 
    ComponentFactory, 
    CommandManager, 
    Command,
    SortingStrategy,
    AppState,
    NutritionalInfoDecorator,
    CostCalculatorDecorator
} from './patterns.js';

/**
 * Enhanced main application controller
 */
class CocinaParaUnoApp {
    constructor() {
        this.gestor = gestorRecetas;
        this.commandManager = new CommandManager();
        this.appState = new AppState();
        this.currentLanguage = 'es';
        this.currentTheme = 'light';
        this.currentFilter = {
            category: 'all',
            favorites: false,
            search: '',
            sortBy: 'created',
            sortOrder: 'desc'
        };
        
        // UI State
        this.currentModal = null;
        this.editingRecipe = null;
        this.selectedRecipes = new Set();
        this.viewMode = 'grid'; // grid | list
        
        // Configuration
        this.config = {
            debounceDelay: 300,
            animationDuration: 300,
            autoSave: true,
            confirmDeletion: true,
            showNutrition: false,
            showCosts: false,
            defaultServings: 1,
            maxImageSize: 5 * 1024 * 1024, // 5MB
            supportedFormats: ['jpg', 'jpeg', 'png', 'webp'],
            categories: [
                'desayuno', 'almuerzo', 'cena', 'postre', 'snack',
                'vegetariano', 'vegano', 'sin gluten', 'rapido', 'saludable'
            ]
        };
        
        // DOM References
        this.elements = {};
        this.isInitialized = false;
        
        // Initialize app after DOM is ready
        document.addEventListener('DOMContentLoaded', () => {
            this.initialize();
        });
    }

    /**
     * Initialize the application
     */
    async initialize() {
        try {
            this.showLoadingState();
            
            await this.getDOMElements();
            await this.setupEventListeners();
            await this.initializeGestor();
            await this.initializeTheme();
            await this.initializeLanguage();
            await this.loadUserPreferences();
            await this.renderInterface();
            
            this.isInitialized = true;
            this.hideLoadingState();
            
            // Initialize icons if Lucide is available
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            
            // Emit app ready event
            eventManager.emit('app:ready', { app: this });
            
            console.log('🍲 Cocina para Uno enhanced version initialized successfully');
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Error al inicializar la aplicación');
        }
    }
    
    /**
     * Show loading state
     */
    showLoadingState() {
        document.body.classList.add('loading');
        const loadingEl = document.querySelector('.loading-overlay');
        if (loadingEl) {
            loadingEl.style.display = 'flex';
        }
    }
    
    /**
     * Hide loading state
     */
    hideLoadingState() {
        document.body.classList.remove('loading');
        const loadingEl = document.querySelector('.loading-overlay');
        if (loadingEl) {
            loadingEl.style.display = 'none';
        }
    }
    
    /**
     * Get DOM element references
     */
    async getDOMElements() {
        const selectors = {
            // Main containers
            recipeGrid: '.recipe-grid',
            recipeList: '.recipe-list',
            emptyState: '.empty-state',
            
            // Search and filters
            searchInput: '.search__input',
            searchClear: '.search__clear',
            filterButtons: '.filter-btn',
            sortSelect: '.sort-select',
            viewToggle: '.view-toggle',
            
            // Recipe form
            recipeForm: '#recipe-form',
            recipeFormModal: '#recipe-form-modal',
            recipeFormTitle: '.recipe-form__title',
            recipeNameInput: '#recipe-name',
            recipeServingsInput: '#recipe-servings',
            recipeTimeInput: '#recipe-time',
            recipeDifficultySelect: '#recipe-difficulty',
            recipeDescriptionTextarea: '#recipe-description',
            recipeImageInput: '#recipe-image',
            recipeImagePreview: '.recipe-image-preview',
            recipeCategoriesContainer: '.recipe-categories',
            recipeIngredientsContainer: '.recipe-ingredients',
            recipeStepsContainer: '.recipe-steps',
            addIngredientBtn: '.add-ingredient-btn',
            addStepBtn: '.add-step-btn',
            saveRecipeBtn: '.save-recipe-btn',
            cancelRecipeBtn: '.cancel-recipe-btn',
            
            // Recipe detail modal
            recipeDetailModal: '#recipe-detail-modal',
            recipeDetailContent: '.recipe-detail-content',
            
            // UI controls
            addRecipeBtn: '.add-recipe-btn',
            bulkActionsBar: '.bulk-actions-bar',
            selectedCount: '.selected-count',
            selectAllBtn: '.select-all-btn',
            deleteSelectedBtn: '.delete-selected-btn',
            exportSelectedBtn: '.export-selected-btn',
            
            // Settings and preferences
            themeToggle: '.theme-toggle',
            languageSelector: '.language-selector',
            settingsModal: '#settings-modal',
            settingsBtn: '.settings-btn',
            
            // Statistics
            statsModal: '#stats-modal',
            statsBtn: '.stats-btn',
            
            // Import/Export
            importBtn: '.import-btn',
            exportBtn: '.export-btn',
            importFileInput: '#import-file',
            
            // Notifications
            notificationContainer: '.notification-container',
            
            // Navigation
            undoBtn: '.undo-btn',
            redoBtn: '.redo-btn'
        };
        
        this.elements = {};
        
        // Get all elements
        for (const [key, selector] of Object.entries(selectors)) {
            const element = document.querySelector(selector);
            if (!element && key !== 'notificationContainer') {
                console.warn(`Element not found: ${selector}`);
            }
            this.elements[key] = element;
        }
        
        // Create notification container if it doesn't exist
        if (!this.elements.notificationContainer) {
            this.elements.notificationContainer = this.createNotificationContainer();
        }
    }

    /**
     * Create notification container
     */
    createNotificationContainer() {
        const container = document.createElement('div');
        container.className = 'notification-container';
        container.setAttribute('role', 'region');
        container.setAttribute('aria-label', 'Notifications');
        document.body.appendChild(container);
        return container;
    }

    /**
     * Setup event listeners
     */
    async setupEventListeners() {
        // Theme toggle
        this.elements.themeToggle?.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Language selector
        this.elements.languageSelector?.addEventListener('change', (e) => {
            this.changeLanguage(e.target.value);
        });

        // Search functionality
        let searchTimeout;
        this.elements.searchInput?.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.handleSearch(e.target.value);
            }, this.config.debounceDelay);
        });

        this.elements.searchClear?.addEventListener('click', () => {
            this.clearSearch();
        });

        // Filter buttons
        this.elements.filterButtons?.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleFilter(e.target.dataset.filter);
            });
        });

        // Sort select
        this.elements.sortSelect?.addEventListener('change', (e) => {
            this.handleSort(e.target.value);
        });

        // View toggle
        this.elements.viewToggle?.addEventListener('click', () => {
            this.toggleViewMode();
        });

        // Add recipe button
        this.elements.addRecipeBtn?.addEventListener('click', () => {
            this.openRecipeForm();
        });

        // Recipe form events
        this.elements.recipeForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveRecipe();
        });

        this.elements.cancelRecipeBtn?.addEventListener('click', () => {
            this.closeRecipeForm();
        });

        // Dynamic form buttons
        this.elements.addIngredientBtn?.addEventListener('click', () => {
            this.addIngredientInput();
        });

        this.elements.addStepBtn?.addEventListener('click', () => {
            this.addStepInput();
        });

        // Image upload
        this.elements.recipeImageInput?.addEventListener('change', (e) => {
            this.handleImageUpload(e);
        });

        // Bulk actions
        this.elements.selectAllBtn?.addEventListener('click', () => {
            this.toggleSelectAll();
        });

        this.elements.deleteSelectedBtn?.addEventListener('click', () => {
            this.deleteSelectedRecipes();
        });

        this.elements.exportSelectedBtn?.addEventListener('click', () => {
            this.exportSelectedRecipes();
        });

        // Settings
        this.elements.settingsBtn?.addEventListener('click', () => {
            this.openSettings();
        });

        // Statistics
        this.elements.statsBtn?.addEventListener('click', () => {
            this.openStatistics();
        });

        // Import/Export
        this.elements.importBtn?.addEventListener('click', () => {
            this.elements.importFileInput?.click();
        });

        this.elements.importFileInput?.addEventListener('change', (e) => {
            this.handleFileImport(e);
        });

        this.elements.exportBtn?.addEventListener('click', () => {
            this.exportAllRecipes();
        });

        // Undo/Redo
        this.elements.undoBtn?.addEventListener('click', () => {
            this.commandManager.undo();
        });

        this.elements.redoBtn?.addEventListener('click', () => {
            this.commandManager.redo();
        });

        // Recipe grid events (event delegation)
        if (this.elements.recipeGrid) {
            this.elements.recipeGrid.addEventListener('click', (e) => {
                this.handleRecipeGridClick(e);
            });
        }

        // Modal backdrop clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Event manager listeners
        eventManager.on('recipe:added', (recipe) => {
            this.showNotification('Receta agregada exitosamente', 'success');
            this.renderRecipes();
            this.updateStatistics();
        });

        eventManager.on('recipe:updated', (recipe) => {
            this.showNotification('Receta actualizada exitosamente', 'success');
            this.renderRecipes();
            this.updateStatistics();
        });

        eventManager.on('recipe:deleted', (recipe) => {
            this.showNotification('Receta eliminada exitosamente', 'success');
            this.renderRecipes();
            this.updateStatistics();
        });

        eventManager.on('recipe:favorited', (recipe) => {
            this.renderRecipes();
            this.updateStatistics();
        });

        eventManager.on('recipe:cooked', (recipe) => {
            this.showNotification('¡Receta marcada como cocinada! 👨‍🍳', 'success');
            this.renderRecipes();
            this.updateStatistics();
        });

        eventManager.on('command:executed', ({ command }) => {
            this.updateUndoRedoButtons();
        });

        eventManager.on('command:undone', ({ command }) => {
            this.updateUndoRedoButtons();
            this.showNotification(`Deshecho: ${command.description}`, 'info');
        });

        eventManager.on('command:redone', ({ command }) => {
            this.updateUndoRedoButtons();
            this.showNotification(`Rehecho: ${command.description}`, 'info');
        });

        // Auto-save functionality
        if (this.config.autoSave) {
            setInterval(() => {
                this.autoSave();
            }, 30000); // Auto-save every 30 seconds
        }
    }

    /**
     * Initialize the recipe manager
     */
    async initializeGestor() {
        this.gestor.initialize();
        await this.loadRecipes();
    }

    /**
     * Initialize theme system
     */
    async initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.currentTheme = savedTheme;
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        if (this.elements.themeToggle) {
            this.elements.themeToggle.checked = savedTheme === 'dark';
        }
    }

    /**
     * Initialize language system
     */
    async initializeLanguage() {
        const savedLanguage = localStorage.getItem('language') || 'es';
        this.currentLanguage = savedLanguage;
        
        if (this.elements.languageSelector) {
            this.elements.languageSelector.value = savedLanguage;
        }
        
        await this.updateTexts();
    }

    /**
     * Load user preferences
     */
    async loadUserPreferences() {
        try {
            const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
            
            this.config = {
                ...this.config,
                ...preferences
            };
            
            // Apply preferences
            this.viewMode = this.config.viewMode || 'grid';
            this.currentFilter.sortBy = this.config.defaultSort || 'created';
            
        } catch (error) {
            console.warn('Failed to load user preferences:', error);
        }
    }

    /**
     * Render the main interface
     */
    async renderInterface() {
        await this.renderCategories();
        await this.renderRecipes();
        this.updateStatistics();
        this.updateUndoRedoButtons();
    }

    /**
     * Load recipes from storage
     */
    async loadRecipes() {
        try {
            const recipes = this.gestor.obtenerTodasLasRecetas();
            this.appState.data.recipes = recipes;
            eventManager.emit('recipes:loaded', recipes);
        } catch (error) {
            console.error('Failed to load recipes:', error);
            this.showError('Error al cargar las recetas');
        }
    }

    /**
     * Handle search input
     */
    handleSearch(query) {
        this.currentFilter.search = query.toLowerCase().trim();
        this.renderRecipes();
        
        // Update search clear button visibility
        if (this.elements.searchClear) {
            this.elements.searchClear.style.display = query ? 'block' : 'none';
        }
    }

    /**
     * Clear search
     */
    clearSearch() {
        if (this.elements.searchInput) {
            this.elements.searchInput.value = '';
        }
        this.handleSearch('');
    }

    /**
     * Handle category filter
     */
    handleFilter(category) {
        this.currentFilter.category = category;
        this.renderRecipes();
        
        // Update filter button states
        this.elements.filterButtons?.forEach(btn => {
            btn.classList.toggle('filter-btn--active', btn.dataset.filter === category);
        });
    }

    /**
     * Handle sorting
     */
    handleSort(sortBy) {
        const [field, order = 'asc'] = sortBy.split(':');
        this.currentFilter.sortBy = field;
        this.currentFilter.sortOrder = order;
        this.renderRecipes();
    }

    /**
     * Toggle view mode between grid and list
     */
    toggleViewMode() {
        this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
        this.renderRecipes();
        
        // Save preference
        this.saveUserPreferences();
        
        // Update toggle button
        if (this.elements.viewToggle) {
            this.elements.viewToggle.textContent = this.viewMode === 'grid' ? '📋' : '⊞';
        }
    }

    /**
     * Open recipe form for new recipe
     */
    openRecipeForm(recipe = null) {
        this.editingRecipe = recipe;
        
        if (this.elements.recipeFormModal) {
            this.elements.recipeFormModal.showModal();
            this.currentModal = this.elements.recipeFormModal;
        }
        
        // Set form title
        if (this.elements.recipeFormTitle) {
            this.elements.recipeFormTitle.textContent = recipe ? 'Editar Receta' : 'Nueva Receta';
        }
        
        // Populate form if editing
        if (recipe) {
            this.populateRecipeForm(recipe);
        } else {
            this.resetRecipeForm();
        }
        
        // Focus first input
        setTimeout(() => {
            this.elements.recipeNameInput?.focus();
        }, 100);
    }

    /**
     * Close recipe form
     */
    closeRecipeForm() {
        if (this.elements.recipeFormModal) {
            this.elements.recipeFormModal.close();
            this.currentModal = null;
        }
        
        this.editingRecipe = null;
        this.resetRecipeForm();
    }

    /**
     * Reset recipe form
     */
    resetRecipeForm() {
        if (this.elements.recipeForm) {
            this.elements.recipeForm.reset();
        }
        
        // Clear dynamic lists
        if (this.elements.recipeIngredientsContainer) {
            this.elements.recipeIngredientsContainer.innerHTML = '';
            this.addIngredientInput(); // Add one empty input
        }
        
        if (this.elements.recipeStepsContainer) {
            this.elements.recipeStepsContainer.innerHTML = '';
            this.addStepInput(); // Add one empty input
        }
        
        // Clear categories
        if (this.elements.recipeCategoriesContainer) {
            this.elements.recipeCategoriesContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                cb.checked = false;
            });
        }
        
        // Clear image preview
        if (this.elements.recipeImagePreview) {
            this.elements.recipeImagePreview.innerHTML = '';
        }
    }

    /**
     * Populate recipe form with existing recipe data
     */
    populateRecipeForm(recipe) {
        if (this.elements.recipeNameInput) this.elements.recipeNameInput.value = recipe.name;
        if (this.elements.recipeServingsInput) this.elements.recipeServingsInput.value = recipe.servings;
        if (this.elements.recipeTimeInput) this.elements.recipeTimeInput.value = recipe.time;
        if (this.elements.recipeDifficultySelect) this.elements.recipeDifficultySelect.value = recipe.difficulty;
        if (this.elements.recipeDescriptionTextarea) this.elements.recipeDescriptionTextarea.value = recipe.description || '';
        
        // Populate ingredients
        if (this.elements.recipeIngredientsContainer) {
            this.elements.recipeIngredientsContainer.innerHTML = '';
            recipe.ingredients.forEach(ingredient => {
                this.addIngredientInput(ingredient);
            });
        }
        
        // Populate steps
        if (this.elements.recipeStepsContainer) {
            this.elements.recipeStepsContainer.innerHTML = '';
            recipe.steps.forEach(step => {
                this.addStepInput(step);
            });
        }
        
        // Populate categories
        if (this.elements.recipeCategoriesContainer) {
            recipe.categories.forEach(category => {
                const checkbox = this.elements.recipeCategoriesContainer.querySelector(`input[value="${category}"]`);
                if (checkbox) checkbox.checked = true;
            });
        }
        
        // Show image if exists
        if (recipe.image && this.elements.recipeImagePreview) {
            this.elements.recipeImagePreview.innerHTML = `
                <img src="${recipe.image}" alt="Preview" class="recipe-image-preview__img">
                <button type="button" class="recipe-image-preview__remove">×</button>
            `;
            
            // Add remove image handler
            const removeBtn = this.elements.recipeImagePreview.querySelector('.recipe-image-preview__remove');
            removeBtn?.addEventListener('click', () => {
                this.elements.recipeImagePreview.innerHTML = '';
                if (this.elements.recipeImageInput) {
                    this.elements.recipeImageInput.value = '';
                }
            });
        }
    }

    /**
     * Save recipe (create or update)
     */
    async saveRecipe() {
        try {
            const formData = this.getRecipeFormData();
            
            // Validate form data
            const validation = ValidationService.validateRecipe(formData);
            if (!validation.isValid) {
                this.showError(validation.errors.join('\n'));
                return;
            }
            
            let recipe;
            let command;
            
            if (this.editingRecipe) {
                // Update existing recipe
                const oldRecipe = { ...this.editingRecipe };
                recipe = { ...this.editingRecipe, ...formData };
                
                command = new Command(
                    () => this.gestor.actualizarReceta(recipe.id, recipe),
                    () => this.gestor.actualizarReceta(recipe.id, oldRecipe),
                    `Actualizar receta: ${recipe.name}`
                );
            } else {
                // Create new recipe
                recipe = new Recipe(formData);
                
                command = new Command(
                    () => this.gestor.agregarReceta(recipe),
                    () => this.gestor.eliminarReceta(recipe.id),
                    `Agregar receta: ${recipe.name}`
                );
            }
            
            // Execute command
            this.commandManager.execute(command);
            
            this.closeRecipeForm();
            
        } catch (error) {
            console.error('Error saving recipe:', error);
            this.showError('Error al guardar la receta');
        }
    }

    /**
     * Get form data as recipe object
     */
    getRecipeFormData() {
        const ingredients = Array.from(this.elements.recipeIngredientsContainer?.querySelectorAll('input') || [])
            .map(input => input.value.trim())
            .filter(value => value);
            
        const steps = Array.from(this.elements.recipeStepsContainer?.querySelectorAll('textarea') || [])
            .map(textarea => textarea.value.trim())
            .filter(value => value);
            
        const categories = Array.from(this.elements.recipeCategoriesContainer?.querySelectorAll('input:checked') || [])
            .map(checkbox => checkbox.value);
            
        const imagePreview = this.elements.recipeImagePreview?.querySelector('img');
        const image = imagePreview ? imagePreview.src : '';
        
        return {
            name: this.elements.recipeNameInput?.value.trim() || '',
            servings: parseInt(this.elements.recipeServingsInput?.value) || 1,
            time: parseInt(this.elements.recipeTimeInput?.value) || 0,
            difficulty: this.elements.recipeDifficultySelect?.value || 'fácil',
            description: this.elements.recipeDescriptionTextarea?.value.trim() || '',
            ingredients,
            steps,
            categories,
            image
        };
    }

    /**
     * Add ingredient input field
     */
    addIngredientInput(value = '') {
        const input = ComponentFactory.createIngredientInput({
            value,
            onRemove: (index) => this.removeIngredientInput(index),
            index: this.elements.recipeIngredientsContainer?.children.length || 0
        });
        
        this.elements.recipeIngredientsContainer?.appendChild(input);
    }

    /**
     * Remove ingredient input field
     */
    removeIngredientInput(index) {
        const inputs = this.elements.recipeIngredientsContainer?.children;
        if (inputs?.[index]) {
            inputs[index].remove();
        }
    }

    /**
     * Add step input field
     */
    addStepInput(value = '') {
        const input = ComponentFactory.createStepInput({
            value,
            onRemove: (index) => this.removeStepInput(index),
            index: this.elements.recipeStepsContainer?.children.length || 0
        });
        
        this.elements.recipeStepsContainer?.appendChild(input);
    }

    /**
     * Remove step input field
     */
    removeStepInput(index) {
        const inputs = this.elements.recipeStepsContainer?.children;
        if (inputs?.[index]) {
            inputs[index].remove();
            
            // Update step numbers
            Array.from(inputs).forEach((step, i) => {
                const numberEl = step.querySelector('.step-number');
                if (numberEl) {
                    numberEl.textContent = i + 1;
                }
            });
        }
    }

    /**
     * Handle image upload
     */
    async handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        try {
            // Validate file
            if (!this.config.supportedFormats.some(format => file.type.includes(format))) {
                throw new Error('Formato de imagen no soportado');
            }
            
            if (file.size > this.config.maxImageSize) {
                throw new Error('La imagen es demasiado grande (máximo 5MB)');
            }
            
            // Process image
            const imageUrl = await ImageService.processImage(file);
            
            // Show preview
            if (this.elements.recipeImagePreview) {
                this.elements.recipeImagePreview.innerHTML = `
                    <img src="${imageUrl}" alt="Preview" class="recipe-image-preview__img">
                    <button type="button" class="recipe-image-preview__remove">×</button>
                `;
                
                // Add remove handler
                const removeBtn = this.elements.recipeImagePreview.querySelector('.recipe-image-preview__remove');
                removeBtn?.addEventListener('click', () => {
                    this.elements.recipeImagePreview.innerHTML = '';
                    event.target.value = '';
                });
            }
            
        } catch (error) {
            console.error('Error uploading image:', error);
            this.showError(error.message);
        }
    }

    /**
     * Render categories
     */
    async renderCategories() {
        // This would update category filters and counts
        const recipes = this.gestor.obtenerTodasLasRecetas();
        const categoryCounts = {};
        
        // Count recipes per category
        recipes.forEach(recipe => {
            recipe.categories.forEach(category => {
                categoryCounts[category] = (categoryCounts[category] || 0) + 1;
            });
        });
        
        // Update filter buttons with counts
        this.elements.filterButtons?.forEach(btn => {
            const category = btn.dataset.filter;
            const count = categoryCounts[category] || 0;
            const countEl = btn.querySelector('.filter-btn__count');
            if (countEl) {
                countEl.textContent = count;
            }
        });
    }

    /**
     * Render recipes based on current filters
     */
    async renderRecipes() {
        const recipes = this.getFilteredRecipes();
        
        if (recipes.length === 0) {
            this.showEmptyState();
            return;
        }
        
        const container = this.viewMode === 'grid' ? this.elements.recipeGrid : this.elements.recipeList;
        if (!container) return;
        
        // Clear container
        container.innerHTML = '';
        
        // Create recipe cards
        recipes.forEach(recipe => {
            const card = ComponentFactory.createRecipeCard({
                recipe,
                onClick: (recipe) => this.viewRecipe(recipe),
                onFavorite: (id) => this.toggleFavorite(id),
                onEdit: (recipe) => this.openRecipeForm(recipe),
                onDelete: (id) => this.deleteRecipe(id)
            });
            
            container.appendChild(card);
        });
        
        // Show/hide empty state
        if (this.elements.emptyState) {
            this.elements.emptyState.style.display = 'none';
        }
    }

    /**
     * Show empty state
     */
    showEmptyState() {
        if (this.elements.recipeGrid) {
            this.elements.recipeGrid.innerHTML = '';
        }
        if (this.elements.recipeList) {
            this.elements.recipeList.innerHTML = '';
        }
        if (this.elements.emptyState) {
            this.elements.emptyState.style.display = 'flex';
        }
    }

    /**
     * Get filtered and sorted recipes
     */
    getFilteredRecipes() {
        let recipes = this.gestor.obtenerTodasLasRecetas();
        
        // Apply search filter
        if (this.currentFilter.search) {
            recipes = recipes.filter(recipe => 
                recipe.name.toLowerCase().includes(this.currentFilter.search) ||
                recipe.ingredients.some(ing => ing.toLowerCase().includes(this.currentFilter.search)) ||
                recipe.categories.some(cat => cat.toLowerCase().includes(this.currentFilter.search))
            );
        }
        
        // Apply category filter
        if (this.currentFilter.category !== 'all') {
            if (this.currentFilter.category === 'favorites') {
                recipes = recipes.filter(recipe => recipe.favorite);
            } else {
                recipes = recipes.filter(recipe => recipe.hasCategory(this.currentFilter.category));
            }
        }
        
        // Apply sorting
        recipes = SortingStrategy.sort(recipes, this.currentFilter.sortBy);
        
        if (this.currentFilter.sortOrder === 'desc') {
            recipes.reverse();
        }
        
        return recipes;
    }

    /**
     * View recipe details
     */
    viewRecipe(recipe) {
        if (this.elements.recipeDetailModal) {
            this.elements.recipeDetailModal.showModal();
            this.currentModal = this.elements.recipeDetailModal;
        }
        
        if (this.elements.recipeDetailContent) {
            this.elements.recipeDetailContent.innerHTML = this.generateRecipeDetailHTML(recipe);
        }
        
        // Mark as cooked button
        const cookBtn = this.elements.recipeDetailContent?.querySelector('.mark-cooked-btn');
        cookBtn?.addEventListener('click', () => {
            this.markAsCooked(recipe.id);
        });
    }

    /**
     * Generate recipe detail HTML
     */
    generateRecipeDetailHTML(recipe) {
        const nutritionInfo = this.config.showNutrition ? 
            new NutritionalInfoDecorator(recipe).getNutritionalInfo() : null;
            
        const costInfo = this.config.showCosts ?
            new CostCalculatorDecorator(recipe).calculateCost() : null;
        
        return `
            <div class="recipe-detail">
                <header class="recipe-detail__header">
                    <h2 class="recipe-detail__title">${recipe.name}</h2>
                    <div class="recipe-detail__meta">
                        <span class="recipe-detail__rating">${'★'.repeat(recipe.finalRating)}${'☆'.repeat(5-recipe.finalRating)}</span>
                        <span class="recipe-detail__time">⏱️ ${recipe.time} min</span>
                        <span class="recipe-detail__servings">🍽️ ${recipe.servings} ${recipe.servings === 1 ? 'porción' : 'porciones'}</span>
                        <span class="recipe-detail__difficulty">📊 ${recipe.difficulty}</span>
                    </div>
                    ${recipe.image ? `<img src="${recipe.image}" alt="${recipe.name}" class="recipe-detail__image">` : ''}
                </header>
                
                ${recipe.description ? `<p class="recipe-detail__description">${recipe.description}</p>` : ''}
                
                <div class="recipe-detail__categories">
                    ${recipe.categories.map(cat => `<span class="category-tag">${cat}</span>`).join('')}
                </div>
                
                <section class="recipe-detail__ingredients">
                    <h3>Ingredientes</h3>
                    <ul>
                        ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                    </ul>
                </section>
                
                <section class="recipe-detail__steps">
                    <h3>Preparación</h3>
                    <ol>
                        ${recipe.steps.map(step => `<li>${step}</li>`).join('')}
                    </ol>
                </section>
                
                ${nutritionInfo ? `
                    <section class="recipe-detail__nutrition">
                        <h3>Información Nutricional (por porción)</h3>
                        <div class="nutrition-grid">
                            <div class="nutrition-item">
                                <span class="nutrition-value">${nutritionInfo.calories}</span>
                                <span class="nutrition-label">Calorías</span>
                            </div>
                            <div class="nutrition-item">
                                <span class="nutrition-value">${nutritionInfo.protein}g</span>
                                <span class="nutrition-label">Proteínas</span>
                            </div>
                            <div class="nutrition-item">
                                <span class="nutrition-value">${nutritionInfo.carbs}g</span>
                                <span class="nutrition-label">Carbohidratos</span>
                            </div>
                            <div class="nutrition-item">
                                <span class="nutrition-value">${nutritionInfo.fat}g</span>
                                <span class="nutrition-label">Grasas</span>
                            </div>
                        </div>
                    </section>
                ` : ''}
                
                ${costInfo ? `
                    <section class="recipe-detail__cost">
                        <h3>Costo Estimado</h3>
                        <p>Total: $${costInfo.totalCost} ${costInfo.currency}</p>
                        <p>Por porción: $${costInfo.costPerServing} ${costInfo.currency}</p>
                    </section>
                ` : ''}
                
                ${recipe.timesCooked > 0 ? `
                    <section class="recipe-detail__history">
                        <h3>Historial</h3>
                        <p>Cocinada ${recipe.timesCooked} veces</p>
                        <p>Última vez: ${recipe.getLastCookedRelative()}</p>
                    </section>
                ` : ''}
                
                <div class="recipe-detail__actions">
                    <button class="btn btn--primary mark-cooked-btn">
                        <span class="btn__icon">👨‍🍳</span>
                        <span class="btn__text">Marcar como Cocinada</span>
                    </button>
                    <button class="btn btn--secondary" onclick="navigator.share({title: '${recipe.name}', text: '${recipe.description || recipe.name}', url: window.location.href})">
                        <span class="btn__icon">📤</span>
                        <span class="btn__text">Compartir</span>
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Toggle recipe favorite status
     */
    toggleFavorite(id) {
        const command = new Command(
            () => this.gestor.alternarFavorita(id),
            () => this.gestor.alternarFavorita(id),
            'Alternar favorita'
        );
        
        this.commandManager.execute(command);
    }

    /**
     * Mark recipe as cooked
     */
    markAsCooked(id) {
        const command = new Command(
            () => this.gestor.marcarComoCocinada(id),
            () => {
                const recipe = this.gestor.obtenerReceta(id);
                if (recipe && recipe.timesCooked > 0) {
                    recipe.timesCooked--;
                    if (recipe.cookingHistory.length > 0) {
                        recipe.cookingHistory.pop();
                    }
                }
            },
            'Marcar como cocinada'
        );
        
        this.commandManager.execute(command);
        
        // Close modal if open
        if (this.currentModal) {
            this.currentModal.close();
            this.currentModal = null;
        }
    }

    /**
     * Delete recipe with confirmation
     */
    async deleteRecipe(id) {
        if (this.config.confirmDeletion) {
            const recipe = this.gestor.obtenerReceta(id);
            if (!recipe) return;
            
            const confirmed = confirm(`¿Estás seguro de que quieres eliminar "${recipe.name}"?`);
            if (!confirmed) return;
        }
        
        const recipe = this.gestor.obtenerReceta(id);
        if (!recipe) return;
        
        const command = new Command(
            () => this.gestor.eliminarReceta(id),
            () => this.gestor.agregarReceta(recipe),
            `Eliminar receta: ${recipe.name}`
        );
        
        this.commandManager.execute(command);
    }

    /**
     * Update statistics
     */
    updateStatistics() {
        const stats = this.gestor.obtenerEstadisticas();
        
        // Update stats display if elements exist
        const elements = [
            { id: 'stats-total', value: stats.totalRecipes },
            { id: 'stats-favorites', value: stats.favoriteRecipes },
            { id: 'stats-cooked', value: stats.totalTimesCooked },
            { id: 'stats-time', value: `${stats.averageTime} min` }
        ];
        
        elements.forEach(({ id, value }) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }

    /**
     * Update undo/redo buttons
     */
    updateUndoRedoButtons() {
        if (this.elements.undoBtn) {
            this.elements.undoBtn.disabled = !this.commandManager.canUndo();
        }
        if (this.elements.redoBtn) {
            this.elements.redoBtn.disabled = !this.commandManager.canRedo();
        }
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info', duration = 4000) {
        const toast = ComponentFactory.createToast({ message, type, duration });
        this.elements.notificationContainer?.appendChild(toast);
    }

    /**
     * Show error message
     */
    showError(message) {
        this.showNotification(message, 'error', 6000);
    }

    /**
     * Toggle theme
     */
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        
        if (this.elements.themeToggle) {
            this.elements.themeToggle.checked = this.currentTheme === 'dark';
        }
    }

    /**
     * Change language
     */
    changeLanguage(language) {
        this.currentLanguage = language;
        localStorage.setItem('language', language);
        this.updateTexts();
    }

    /**
     * Update interface texts
     */
    async updateTexts() {
        // This would update all translatable text elements
        // For now, we'll just log the language change
        console.log(`Language changed to: ${this.currentLanguage}`);
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyboardShortcuts(event) {
        // Ctrl/Cmd + N: New recipe
        if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
            event.preventDefault();
            this.openRecipeForm();
        }
        
        // Ctrl/Cmd + Z: Undo
        if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
            event.preventDefault();
            this.commandManager.undo();
        }
        
        // Ctrl/Cmd + Shift + Z: Redo
        if ((event.ctrlKey || event.metaKey) && event.key === 'z' && event.shiftKey) {
            event.preventDefault();
            this.commandManager.redo();
        }
        
        // Escape: Close modal
        if (event.key === 'Escape' && this.currentModal) {
            this.currentModal.close();
            this.currentModal = null;
        }
        
        // Ctrl/Cmd + F: Focus search
        if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
            event.preventDefault();
            this.elements.searchInput?.focus();
        }
    }

    /**
     * Handle recipe grid clicks (event delegation)
     */
    handleRecipeGridClick(event) {
        const target = event.target;
        const card = target.closest('.recipe-card');
        if (!card) return;
        
        const recipeId = card.dataset.recipeId;
        const recipe = this.gestor.obtenerReceta(recipeId);
        if (!recipe) return;
        
        // Handle different click targets
        if (target.closest('[data-action="favorite"]')) {
            event.stopPropagation();
            this.toggleFavorite(recipeId);
        } else if (target.closest('[data-action="edit"]')) {
            event.stopPropagation();
            this.openRecipeForm(recipe);
        } else if (target.closest('[data-action="delete"]')) {
            event.stopPropagation();
            this.deleteRecipe(recipeId);
        } else if (target.closest('[data-action="view"]') || !target.closest('button')) {
            // View recipe (default action)
            this.viewRecipe(recipe);
        }
    }

    /**
     * Close modal
     */
    closeModal(modal) {
        if (modal && typeof modal.close === 'function') {
            modal.close();
        }
        this.currentModal = null;
    }

    /**
     * Auto-save functionality
     */
    autoSave() {
        if (this.gestor) {
            this.gestor.save();
        }
    }

    /**
     * Save user preferences
     */
    saveUserPreferences() {
        const preferences = {
            viewMode: this.viewMode,
            defaultSort: this.currentFilter.sortBy,
            showNutrition: this.config.showNutrition,
            showCosts: this.config.showCosts,
            confirmDeletion: this.config.confirmDeletion
        };
        
        localStorage.setItem('userPreferences', JSON.stringify(preferences));
    }

    // Placeholder methods for features not yet implemented
    toggleSelectAll() { console.log('Toggle select all - not implemented'); }
    deleteSelectedRecipes() { console.log('Delete selected recipes - not implemented'); }
    exportSelectedRecipes() { console.log('Export selected recipes - not implemented'); }
    openSettings() { console.log('Open settings - not implemented'); }
    openStatistics() { console.log('Open statistics - not implemented'); }
    handleFileImport() { console.log('Handle file import - not implemented'); }
    exportAllRecipes() { console.log('Export all recipes - not implemented'); }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.cocinaApp = new CocinaParaUnoApp();
});

// Export for potential module use
export default CocinaParaUnoApp;
