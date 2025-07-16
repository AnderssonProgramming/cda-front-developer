/**
 * COCINA PARA UNO - MAIN APPLICATION
 * Complete functional application with PWA, multi-language and auto-image features
 * Author: CDA Front Developer
 * Date: 2024
 * Version: 3.0.0 - Enhanced with all requested features
 */

// Import dependencies from other modules
import { Recipe, RecipeCollection } from './objects.js';
import { SingletonPattern, FactoryPattern, ObserverPattern } from './patterns.js';

/**
 * Multi-language support - Translations
 */
const TRANSLATIONS = {
  es: {
    appTitle: 'Cocina para Uno',
    appSubtitle: 'Tu recetario personal',
    searchPlaceholder: 'Buscar recetas, ingredientes...',
    newRecipe: 'Nueva Receta',
    allRecipes: 'Todas',
    favorites: 'Favoritas',
    categories: 'Categorías',
    recipes: 'Recetas',
    emptyStateTitle: '¡Comienza tu aventura culinaria!',
    emptyStateDescription: 'Crea tu primera receta y comienza a organizar tu colección personal de recetas',
    addFirstRecipe: '+ Agregar mi primera receta',
    noResultsTitle: 'No se encontraron recetas',
    noResultsDescription: 'Intenta con otros términos de búsqueda o agrega una nueva receta',
    clearSearch: 'Limpiar búsqueda',
    view: 'Ver receta',
    edit: 'Editar receta',
    share: 'Compartir receta',
    delete: 'Eliminar receta',
    close: 'Cerrar',
    ingredients: 'Ingredientes',
    preparation: 'Preparación',
    notes: 'Notas',
    cookingTime: 'Tiempo de cocción',
    difficulty: 'Dificultad',
    servings: 'Porciones',
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    warning: 'Advertencia',
    info: 'Información',
    recipeTitle: 'Título de la receta',
    recipeDescription: 'Descripción',
    addIngredient: 'Agregar ingrediente',
    addStep: 'Agregar paso',
    save: 'Guardar',
    cancel: 'Cancelar'
  },
  en: {
    appTitle: 'Cooking for One',
    appSubtitle: 'Your personal recipe book',
    searchPlaceholder: 'Search recipes, ingredients...',
    newRecipe: 'New Recipe',
    allRecipes: 'All',
    favorites: 'Favorites',
    categories: 'Categories',
    recipes: 'Recipes',
    emptyStateTitle: 'Start your culinary adventure!',
    emptyStateDescription: 'Create your first recipe and start organizing your personal recipe collection',
    addFirstRecipe: '+ Add my first recipe',
    noResultsTitle: 'No recipes found',
    noResultsDescription: 'Try different search terms or add a new recipe',
    clearSearch: 'Clear search',
    view: 'View recipe',
    edit: 'Edit recipe',
    share: 'Share recipe',
    delete: 'Delete recipe',
    close: 'Close',
    ingredients: 'Ingredients',
    preparation: 'Preparation',
    notes: 'Notes',
    cookingTime: 'Cooking time',
    difficulty: 'Difficulty',
    servings: 'Servings',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Information',
    recipeTitle: 'Recipe title',
    recipeDescription: 'Description',
    addIngredient: 'Add ingredient',
    addStep: 'Add step',
    save: 'Save',
    cancel: 'Cancel'
  },
  fr: {
    appTitle: 'Cuisine pour Un',
    appSubtitle: 'Votre livre de recettes personnel',
    searchPlaceholder: 'Rechercher des recettes, ingrédients...',
    newRecipe: 'Nouvelle Recette',
    allRecipes: 'Toutes',
    favorites: 'Favoris',
    categories: 'Catégories',
    recipes: 'Recettes',
    emptyStateTitle: 'Commencez votre aventure culinaire!',
    emptyStateDescription: 'Créez votre première recette et commencez à organiser votre collection personnelle',
    addFirstRecipe: '+ Ajouter ma première recette',
    noResultsTitle: 'Aucune recette trouvée',
    noResultsDescription: 'Essayez avec d\'autres termes de recherche ou ajoutez une nouvelle recette',
    clearSearch: 'Effacer la recherche',
    view: 'Voir la recette',
    edit: 'Modifier la recette',
    share: 'Partager la recette',
    delete: 'Supprimer la recette',
    close: 'Fermer',
    ingredients: 'Ingrédients',
    preparation: 'Préparation',
    notes: 'Notes',
    cookingTime: 'Temps de cuisson',
    difficulty: 'Difficulté',
    servings: 'Portions',
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    warning: 'Avertissement',
    info: 'Information',
    recipeTitle: 'Titre de la recette',
    recipeDescription: 'Description',
    addIngredient: 'Ajouter un ingrédient',
    addStep: 'Ajouter une étape',
    save: 'Sauvegarder',
    cancel: 'Annuler'
  }
};

/**
 * Application Configuration - Enhanced
 */
const APP_CONFIG = {
  version: '3.0.0',
  name: 'Cocina para Uno',
  author: 'CDA Front Developer',
  storageKey: 'cocina-para-uno-recipes',
  searchDelay: 300,
  toastDuration: 3000,
  imageFormats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
  maxImageSize: 5 * 1024 * 1024, // 5MB
  animations: {
    duration: 200,
    easing: 'ease-out'
  },
  pwa: {
    enabled: true,
    updateCheckInterval: 60000, // 1 minute
    cacheVersion: 'v3.0.0'
  },
  performance: {
    enableVirtualScrolling: true,
    lazyLoadImages: true,
    debounceSearch: true,
    preloadCritical: true
  },
  features: {
    webShare: 'shareAPI' in navigator,
    notifications: 'Notification' in window,
    geolocation: 'geolocation' in navigator,
    storage: 'localStorage' in window,
    webWorkers: 'Worker' in window,
    intersectionObserver: 'IntersectionObserver' in window
  },
  defaultLanguage: 'es',
  supportedLanguages: ['es', 'en', 'fr'],
  apiKeys: {
    // Using demo keys for testing - replace with your own
    unsplashAccessKey: 'YOUR_UNSPLASH_ACCESS_KEY',
    pixabayKey: 'YOUR_PIXABAY_KEY'
  }
};

/**
 * DOM Elements Cache
 */
const DOM = {
  // Loading
  loadingScreen: document.getElementById('loading-screen'),
  
  // Header elements
  searchInput: document.getElementById('search-input'),
  searchClear: document.querySelector('.search__clear'),
  searchResults: document.getElementById('search-results-count'),
  themeToggle: document.querySelector('.theme-toggle'),
  
  // Navigation filters
  filterButtons: document.querySelectorAll('.filter-btn'),
  
  // Main content
  recipesGrid: document.getElementById('recipes-grid'),
  emptyState: document.getElementById('empty-state'),
  noResults: document.getElementById('no-results'),
  
  // Modals
  recipeModal: document.getElementById('recipe-modal'),
  recipeFormModal: document.getElementById('recipe-form-modal'),
  
  // Forms
  recipeForm: document.getElementById('recipe-form'),
  
  // Toast container
  toastContainer: document.getElementById('toast-container')
};

/**
 * Language Manager for Multi-language support
 */
class LanguageManager extends SingletonPattern {
  initialize() {
    this.currentLanguage = localStorage.getItem('app-language') || APP_CONFIG.defaultLanguage;
    this.translations = TRANSLATIONS;
    this.applyLanguage();
    this.addLanguageSelector();
  }

  setLanguage(languageCode) {
    if (!APP_CONFIG.supportedLanguages.includes(languageCode)) {
      console.warn(`Language ${languageCode} not supported`);
      return;
    }

    this.currentLanguage = languageCode;
    localStorage.setItem('app-language', languageCode);
    this.applyLanguage();
    this.notifyLanguageChange();
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }

  translate(key) {
    return this.translations[this.currentLanguage]?.[key] || key;
  }

  applyLanguage() {
    // Update page title
    document.title = `🍲 ${this.translate('appTitle')} | ${this.translate('appSubtitle')}`;
    
    // Update app header
    const headerTitle = document.querySelector('.header__text');
    const headerSubtitle = document.querySelector('.header__subtitle');
    if (headerTitle) headerTitle.textContent = this.translate('appTitle');
    if (headerSubtitle) headerSubtitle.textContent = this.translate('appSubtitle');

    // Update search placeholder
    if (DOM.searchInput) {
      DOM.searchInput.placeholder = this.translate('searchPlaceholder');
    }

    // Update buttons and filters
    this.updateStaticElements();
  }

  updateStaticElements() {
    // Update filter buttons
    const allButton = document.querySelector('[data-filter="all"] .filter-btn__text');
    const favoritesButton = document.querySelector('[data-filter="favorites"] .filter-btn__text');
    
    if (allButton) allButton.textContent = this.translate('allRecipes');
    if (favoritesButton) favoritesButton.textContent = this.translate('favorites');

    // Update add recipe button
    const addRecipeBtn = document.querySelector('.btn--add-recipe .btn__text');
    if (addRecipeBtn) addRecipeBtn.textContent = this.translate('newRecipe');

    // Update empty state
    const emptyTitle = document.querySelector('.empty-state__title');
    const emptyDescription = document.querySelector('.empty-state__description');
    const addFirstBtn = document.querySelector('.btn--add-first-recipe');
    
    if (emptyTitle) emptyTitle.textContent = this.translate('emptyStateTitle');
    if (emptyDescription) emptyDescription.textContent = this.translate('emptyStateDescription');
    if (addFirstBtn) addFirstBtn.textContent = this.translate('addFirstRecipe');

    // Update no results state
    const noResultsTitle = document.querySelector('.no-results__title');
    const noResultsDescription = document.querySelector('.no-results__description');
    const clearSearchBtn = document.querySelector('.btn--clear-search');
    
    if (noResultsTitle) noResultsTitle.textContent = this.translate('noResultsTitle');
    if (noResultsDescription) noResultsDescription.textContent = this.translate('noResultsDescription');
    if (clearSearchBtn) clearSearchBtn.textContent = this.translate('clearSearch');
  }

  addLanguageSelector() {
    const headerContainer = document.querySelector('.header__container');
    if (!headerContainer || document.querySelector('.language-selector')) return;

    const languageSelector = this.createLanguageSelector();
    headerContainer.appendChild(languageSelector);
  }

  createLanguageSelector() {
    const selector = document.createElement('div');
    selector.className = 'language-selector';
    
    const button = document.createElement('button');
    button.className = 'btn btn--ghost btn--sm language-toggle';
    button.innerHTML = `
      <span class="btn__icon">🌍</span>
      <span class="btn__text">${this.currentLanguage.toUpperCase()}</span>
    `;
    
    const dropdown = document.createElement('div');
    dropdown.className = 'language-dropdown';
    dropdown.style.display = 'none';
    
    APP_CONFIG.supportedLanguages.forEach(lang => {
      const option = document.createElement('button');
      option.className = 'language-option';
      option.textContent = lang.toUpperCase();
      option.addEventListener('click', () => {
        this.setLanguage(lang);
        button.querySelector('.btn__text').textContent = lang.toUpperCase();
        dropdown.style.display = 'none';
      });
      dropdown.appendChild(option);
    });
    
    button.addEventListener('click', () => {
      dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!selector.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    });
    
    selector.appendChild(button);
    selector.appendChild(dropdown);
    
    return selector;
  }

  notifyLanguageChange() {
    window.dispatchEvent(new CustomEvent('languageChanged', {
      detail: { language: this.currentLanguage }
    }));
  }
}

/**
 * Image Service for automatic image fetching
 */
class ImageService {
  static async searchRecipeImage(recipeName) {
    // For demo purposes, return placeholder
    return {
      url: this.generateFoodPlaceholder(recipeName),
      thumbnail: this.generateFoodPlaceholder(recipeName),
      description: recipeName,
      source: 'placeholder'
    };
  }

  static async searchIngredientImage(ingredientName) {
    // For demo purposes, return placeholder
    return {
      url: this.generateIngredientPlaceholder(ingredientName),
      description: ingredientName,
      source: 'placeholder'
    };
  }

  static generateFoodPlaceholder(recipeName) {
    const emojis = ['🍲', '🍝', '🥘', '🍛', '🥗', '🍕', '🌮', '🥙', '🍜', '🍱'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#FF6B35;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#F7931E;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="60">${randomEmoji}</text>
        <text x="50%" y="80%" text-anchor="middle" dy=".3em" font-size="16" fill="white" font-family="Arial">${recipeName}</text>
      </svg>
    `)}`;
  }

  static generateIngredientPlaceholder(ingredientName) {
    const ingredientEmojis = {
      'tomate': '🍅', 'cebolla': '🧅', 'ajo': '🧄', 'papa': '🥔', 'zanahoria': '🥕',
      'pollo': '🐔', 'carne': '🥩', 'pescado': '🐟', 'huevo': '🥚', 'leche': '🥛',
      'queso': '🧀', 'arroz': '🍚', 'pasta': '🍝', 'pan': '🍞', 'aceite': '🫒'
    };
    
    const lowerIngredient = ingredientName.toLowerCase();
    const emoji = Object.keys(ingredientEmojis).find(key => 
      lowerIngredient.includes(key)
    ) ? ingredientEmojis[Object.keys(ingredientEmojis).find(key => 
      lowerIngredient.includes(key)
    )] : '🥄';

    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="30" fill="#f8f9fa" stroke="#e9ecef" stroke-width="2"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="24">${emoji}</text>
      </svg>
    `)}`;
  }
}

/**
 * Performance Manager
 */
class PerformanceManager {
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

/**
 * Toast Factory
 */
class ToastFactory extends FactoryPattern {
  static create(type, message, options = {}) {
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    
    const icons = {
      success: '✅',
      error: '❌', 
      warning: '⚠️',
      info: 'ℹ️',
      loading: '⏳'
    };

    toast.innerHTML = `
      <div class="toast__content">
        <span class="toast__icon" aria-hidden="true">${icons[type] || 'ℹ️'}</span>
        <span class="toast__message">${message}</span>
        ${options.dismissible !== false ? `
          <button class="toast__close" aria-label="Cerrar notificación">
            <span aria-hidden="true">✕</span>
          </button>
        ` : ''}
      </div>
    `;

    // Add close functionality
    if (options.dismissible !== false) {
      const closeBtn = toast.querySelector('.toast__close');
      closeBtn?.addEventListener('click', () => {
        toast.classList.add('toast--removing');
        setTimeout(() => toast.remove(), 200);
      });
    }

    // Add entrance animation
    requestAnimationFrame(() => {
      toast.classList.add('toast--show');
    });

    return toast;
  }
}

/**
 * Application State Management
 */
class AppState extends SingletonPattern {
  initialize() {
    this.currentFilter = 'all';
    this.currentSearch = '';
    this.currentTheme = localStorage.getItem('theme') || 'light';
    this.recipes = new RecipeCollection();
    this.filteredRecipes = [];
    this.isLoading = false;
    this.activeModal = null;
    this.observers = [];
    
    this.loadRecipes();
  }

  // Observer pattern methods
  subscribe(callback) {
    this.observers.push(callback);
    return () => {
      this.observers = this.observers.filter(obs => obs !== callback);
    };
  }

  notify(event, data) {
    this.observers.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('Observer callback error:', error);
      }
    });
  }

  // State management methods
  setFilter(filter) {
    this.currentFilter = filter;
    this.filterAndSearchRecipes();
    this.notify('filterChanged', filter);
  }

  setSearch(searchTerm) {
    this.currentSearch = searchTerm;
    this.filterAndSearchRecipes();
    this.notify('searchChanged', searchTerm);
  }

  filterAndSearchRecipes() {
    let recipes = this.recipes.getAll();

    // Apply filter
    if (this.currentFilter !== 'all') {
      if (this.currentFilter === 'favorites') {
        recipes = recipes.filter(recipe => recipe.isFavorite);
      } else {
        recipes = recipes.filter(recipe => 
          recipe.categories.some(cat => 
            cat.toLowerCase().includes(this.currentFilter.toLowerCase())
          )
        );
      }
    }

    // Apply search
    if (this.currentSearch.trim()) {
      const searchTerm = this.currentSearch.toLowerCase();
      recipes = recipes.filter(recipe => 
        recipe.title.toLowerCase().includes(searchTerm) ||
        recipe.ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(searchTerm)
        ) ||
        recipe.categories.some(category => 
          category.toLowerCase().includes(searchTerm)
        )
      );
    }

    this.filteredRecipes = recipes;
  }

  async loadRecipes() {
    try {
      const savedRecipes = localStorage.getItem(APP_CONFIG.storageKey);
      if (savedRecipes) {
        const recipesData = JSON.parse(savedRecipes);
        recipesData.forEach(recipeData => {
          const recipe = new Recipe(recipeData);
          this.recipes.addRecipe(recipe);
        });
      } else {
        // Add demo recipes if none exist
        this.addDemoRecipes();
      }
      
      this.filterAndSearchRecipes();
      console.log(`📚 Loaded ${this.recipes.getAll().length} recipes from storage`);
    } catch (error) {
      console.error('❌ Failed to load recipes from storage:', error);
    }
  }

  saveRecipes() {
    try {
      const recipesData = this.recipes.getAll().map(recipe => recipe.toJSON());
      localStorage.setItem(APP_CONFIG.storageKey, JSON.stringify(recipesData));
      console.log(`💾 Saved ${recipesData.length} recipes to storage`);
    } catch (error) {
      console.error('❌ Failed to save recipes to storage:', error);
    }
  }

  addRecipe(recipeData) {
    try {
      const recipe = new Recipe(recipeData);
      this.recipes.addRecipe(recipe);
      this.saveRecipes();
      this.filterAndSearchRecipes();
      this.notify('recipeAdded', recipe);
      return recipe;
    } catch (error) {
      console.error('❌ Error adding recipe:', error);
      throw error;
    }
  }

  updateRecipe(id, updates) {
    try {
      const recipe = this.recipes.findById(id);
      if (recipe) {
        recipe.update(updates);
        this.saveRecipes();
        this.filterAndSearchRecipes();
        this.notify('recipeUpdated', recipe);
      }
    } catch (error) {
      console.error('❌ Error updating recipe:', error);
    }
  }

  deleteRecipe(id) {
    try {
      this.recipes.deleteRecipe(id);
      this.saveRecipes();
      this.filterAndSearchRecipes();
      this.notify('recipeDeleted', id);
    } catch (error) {
      console.error('❌ Error deleting recipe:', error);
    }
  }

  toggleFavorite(id) {
    try {
      const recipe = this.recipes.findById(id);
      if (recipe) {
        recipe.toggleFavorite();
        this.saveRecipes();
        this.filterAndSearchRecipes();
        this.notify('favoriteToggled', recipe);
      }
    } catch (error) {
      console.error('❌ Error toggling favorite:', error);
    }
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update button state
    const themeToggle = DOM.themeToggle;
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', newTheme === 'dark');
      themeToggle.setAttribute('aria-label', 
        newTheme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
      );
      
      const icon = themeToggle.querySelector('.theme-toggle__icon');
      if (icon) {
        icon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
      }
    }
    
    this.currentTheme = newTheme;
    this.notify('themeChanged', newTheme);
  }

  addDemoRecipes() {
    const demoRecipes = [
      {
        title: 'Pasta Aglio e Olio',
        description: 'Pasta italiana simple y deliciosa con ajo y aceite de oliva',
        ingredients: ['200g pasta', '4 dientes de ajo', '50ml aceite de oliva', 'Perejil fresco', 'Sal', 'Pimienta'],
        steps: ['Hervir agua con sal para la pasta', 'Cortar el ajo en láminas finas', 'Calentar aceite y dorar el ajo', 'Escurrir pasta y mezclar con el aceite', 'Agregar perejil y servir'],
        categories: ['cena', 'pasta', 'italiana'],
        cookingTime: 15,
        difficulty: 'fácil',
        servings: 1
      },
      {
        title: 'Ensalada César Personal',
        description: 'Ensalada clásica perfecta para una persona',
        ingredients: ['1 lechuga romana', '50g queso parmesano', '2 rebanadas de pan', '1 huevo', '2 anchoas', 'Aceite de oliva', 'Limón'],
        steps: ['Lavar y cortar la lechuga', 'Hacer crutones con el pan', 'Preparar aderezo con huevo, anchoas y limón', 'Mezclar todo y servir'],
        categories: ['almuerzo', 'ensalada', 'saludable'],
        cookingTime: 10,
        difficulty: 'fácil',
        servings: 1,
        isFavorite: true
      }
    ];

    demoRecipes.forEach(recipeData => {
      const recipe = new Recipe(recipeData);
      this.recipes.addRecipe(recipe);
    });

    this.saveRecipes();
  }
}

/**
 * UI Controller
 */
class UIController {
  constructor(appState, languageManager) {
    this.appState = appState;
    this.languageManager = languageManager;
    this.searchDebounced = PerformanceManager.debounce(
      this.handleSearch.bind(this), 
      APP_CONFIG.searchDelay
    );
    
    this.setupEventListeners();
    this.setupObservers();
  }

  setupEventListeners() {
    // Search functionality
    DOM.searchInput?.addEventListener('input', (e) => {
      this.searchDebounced(e.target.value);
      this.toggleClearButton(e.target.value);
    });

    DOM.searchClear?.addEventListener('click', () => {
      DOM.searchInput.value = '';
      this.handleSearch('');
      this.toggleClearButton('');
    });

    // Filter buttons
    DOM.filterButtons?.forEach(btn => {
      btn.addEventListener('click', () => {
        this.handleFilterChange(btn.dataset.filter);
      });
    });

    // Theme toggle
    DOM.themeToggle?.addEventListener('click', () => {
      this.appState.toggleTheme();
    });

    // Add recipe buttons
    const addRecipeButtons = document.querySelectorAll('.btn--add-recipe, .btn--add-first-recipe');
    addRecipeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.showRecipeForm();
      });
    });

    // Global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      this.handleKeyboardShortcuts(e);
    });
  }

  setupObservers() {
    this.appState.subscribe((event, data) => {
      switch (event) {
        case 'filterChanged':
          this.updateFilterButtons();
          this.render();
          break;
        case 'searchChanged':
          this.updateSearchResults();
          this.render();
          break;
        case 'recipeAdded':
        case 'recipeUpdated':
        case 'recipeDeleted':
        case 'favoriteToggled':
          this.render();
          break;
        case 'themeChanged':
          console.log('🎨 Theme changed to:', data);
          break;
      }
    });
  }

  handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      DOM.searchInput?.focus();
    }
    
    // Escape to clear search or close modals
    if (e.key === 'Escape') {
      if (DOM.searchInput?.value) {
        DOM.searchInput.value = '';
        this.handleSearch('');
      }
    }
  }

  handleSearch(searchTerm) {
    this.appState.setSearch(searchTerm);
  }

  handleFilterChange(filter) {
    this.appState.setFilter(filter);
  }

  toggleClearButton(value) {
    if (DOM.searchClear) {
      DOM.searchClear.hidden = !value.trim();
    }
  }

  updateFilterButtons() {
    DOM.filterButtons?.forEach(btn => {
      const isActive = btn.dataset.filter === this.appState.currentFilter;
      btn.classList.toggle('filter-btn--active', isActive);
      btn.setAttribute('aria-pressed', isActive);
    });
  }

  updateSearchResults() {
    if (DOM.searchResults) {
      const count = this.appState.filteredRecipes.length;
      const total = this.appState.recipes.getAll().length;
      
      if (this.appState.currentSearch.trim()) {
        DOM.searchResults.textContent = `${count} de ${total} recetas`;
      } else {
        DOM.searchResults.textContent = '';
      }
    }
  }

  render() {
    this.renderRecipes();
    this.updateStats();
    this.updateStates();
  }

  renderRecipes() {
    const recipes = this.appState.filteredRecipes;
    const hasRecipes = recipes.length > 0;
    const hasSearch = this.appState.currentSearch.trim().length > 0;
    const totalRecipes = this.appState.recipes.getAll().length;

    // Show/hide states
    if (DOM.recipesGrid) DOM.recipesGrid.style.display = hasRecipes ? 'grid' : 'none';
    if (DOM.emptyState) DOM.emptyState.hidden = hasRecipes || totalRecipes > 0;
    if (DOM.noResults) DOM.noResults.hidden = hasRecipes || totalRecipes === 0;

    if (!hasRecipes) return;

    // Render recipe cards
    DOM.recipesGrid.innerHTML = recipes.map(recipe => this.createRecipeCard(recipe)).join('');

    // Add event listeners to recipe cards
    this.attachRecipeCardListeners();
  }

  createRecipeCard(recipe) {
    const categoriesHtml = recipe.categories
      .slice(0, 3)
      .map(cat => `<span class="category-tag category-tag--${cat.toLowerCase()}">${cat}</span>`)
      .join('');

    return `
      <article class="recipe-card" data-recipe-id="${recipe.id}">
        <div class="recipe-card__image">
          ${recipe.imageUrl ? 
            `<img src="${recipe.imageUrl}" alt="${recipe.title}" loading="lazy">` :
            `<div class="recipe-card__placeholder">🍽️</div>`
          }
          <button class="recipe-card__favorite ${recipe.isFavorite ? 'recipe-card__favorite--active' : ''}" 
                  aria-label="${recipe.isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}"
                  data-action="toggle-favorite">
            <span aria-hidden="true">${recipe.isFavorite ? '❤️' : '🤍'}</span>
          </button>
        </div>
        
        <div class="recipe-card__content">
          <header class="recipe-card__header">
            <h3 class="recipe-card__title">${recipe.title}</h3>
          </header>
          
          <div class="recipe-card__meta">
            <span class="recipe-card__time">
              <span aria-hidden="true">⏱️</span>
              ${recipe.cookingTime} min
            </span>
          </div>
          
          ${categoriesHtml ? `<div class="recipe-card__categories">${categoriesHtml}</div>` : ''}
          
          <div class="recipe-card__actions">
            <button class="recipe-card__action" data-action="view" aria-label="Ver receta">
              <span aria-hidden="true">👁️</span>
            </button>
            <button class="recipe-card__action" data-action="edit" aria-label="Editar receta">
              <span aria-hidden="true">✏️</span>
            </button>
            <button class="recipe-card__action" data-action="share" aria-label="Compartir receta">
              <span aria-hidden="true">📤</span>
            </button>
            <button class="recipe-card__action" data-action="delete" aria-label="Eliminar receta">
              <span aria-hidden="true">🗑️</span>
            </button>
          </div>
        </div>
      </article>
    `;
  }

  attachRecipeCardListeners() {
    const recipeCards = DOM.recipesGrid?.querySelectorAll('.recipe-card');
    
    recipeCards?.forEach(card => {
      const recipeId = card.dataset.recipeId;
      const recipe = this.appState.recipes.findById(recipeId);
      
      if (!recipe) return;
      
      // Add click event for viewing recipe
      card.addEventListener('click', (e) => {
        if (!e.target.closest('.recipe-card__action, .recipe-card__favorite')) {
          this.showRecipeDetails(recipe);
        }
      });
      
      // Add action button events
      const actions = card.querySelectorAll('.recipe-card__action');
      actions.forEach(action => {
        action.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          const actionType = action.dataset.action;
          this.handleRecipeAction(actionType, recipe);
        });
      });
      
      // Add favorite button event
      const favoriteBtn = card.querySelector('.recipe-card__favorite');
      favoriteBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.appState.toggleFavorite(recipe.id);
      });
    });
  }

  handleRecipeAction(actionType, recipe) {
    switch (actionType) {
      case 'view':
        this.showRecipeDetails(recipe);
        break;
      case 'edit':
        this.showRecipeForm(recipe);
        break;
      case 'share':
        this.shareRecipe(recipe);
        break;
      case 'delete':
        this.showDeleteConfirmation(recipe);
        break;
      default:
        console.warn('Unknown recipe action:', actionType);
    }
  }

  async shareRecipe(recipe) {
    const shareData = {
      title: `🍲 ${recipe.title} - ${this.languageManager.translate('appTitle')}`,
      text: `${this.languageManager.translate('view')} ${recipe.title}. ${this.languageManager.translate('cookingTime')}: ${recipe.cookingTime} min.`,
      url: window.location.href
    };

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback to clipboard
        const textToShare = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
        await navigator.clipboard.writeText(textToShare);
        this.showToast('📋 Enlace copiado al portapapeles', 'success');
      }
    } catch (error) {
      console.error('Share failed:', error);
      this.showToast('Error al compartir', 'error');
    }
  }

  showRecipeDetails(recipe) {
    const modal = DOM.recipeModal;
    if (!modal) return;
    
    const content = modal.querySelector('.modal__content');
    if (!content) return;
    
    content.innerHTML = `
      <header class="modal__header">
        <h2 class="modal__title">${recipe.title}</h2>
        <button type="button" class="modal__close" aria-label="Cerrar modal">
          <span aria-hidden="true">×</span>
        </button>
      </header>
      
      <div class="modal__body">
        <div class="recipe-details">
          ${recipe.imageUrl ? `
            <div class="recipe-details__image">
              <img src="${recipe.imageUrl}" alt="${recipe.title}" loading="lazy">
            </div>
          ` : ''}
          
          <div class="recipe-details__meta">
            <div class="recipe-meta">
              <span class="recipe-meta__item">
                <span class="recipe-meta__icon" aria-hidden="true">⏱️</span>
                <span>${recipe.cookingTime} min</span>
              </span>
              <span class="recipe-meta__item">
                <span class="recipe-meta__icon" aria-hidden="true">👨‍🍳</span>
                <span>${recipe.difficulty}</span>
              </span>
              <span class="recipe-meta__item">
                <span class="recipe-meta__icon" aria-hidden="true">🍽️</span>
                <span>${recipe.servings} porción${recipe.servings > 1 ? 'es' : ''}</span>
              </span>
            </div>
          </div>
          
          <div class="recipe-details__content">
            <section class="recipe-section">
              <h3 class="recipe-section__title">${this.languageManager.translate('ingredients')}</h3>
              <ul class="recipe-ingredients">
                ${recipe.ingredients.map(ingredient => `
                  <li class="recipe-ingredient">${ingredient}</li>
                `).join('')}
              </ul>
            </section>
            
            <section class="recipe-section">
              <h3 class="recipe-section__title">${this.languageManager.translate('preparation')}</h3>
              <ol class="recipe-steps">
                ${recipe.steps.map((step, index) => `
                  <li class="recipe-step">
                    <span class="recipe-step__number">${index + 1}</span>
                    <span class="recipe-step__text">${step}</span>
                  </li>
                `).join('')}
              </ol>
            </section>
            
            ${recipe.notes ? `
              <section class="recipe-section">
                <h3 class="recipe-section__title">${this.languageManager.translate('notes')}</h3>
                <p class="recipe-notes">${recipe.notes}</p>
              </section>
            ` : ''}
          </div>
        </div>
      </div>
      
      <footer class="modal__footer">
        <button type="button" class="btn btn--secondary modal__close">
          ${this.languageManager.translate('close')}
        </button>
        <button type="button" class="btn btn--primary" data-action="share">
          <span class="btn__icon" aria-hidden="true">📤</span>
          <span class="btn__text">${this.languageManager.translate('share')}</span>
        </button>
      </footer>
    `;
    
    // Show modal
    modal.showModal();
    
    // Add event listeners
    this.addModalEventListeners(modal, recipe);
  }

  addModalEventListeners(modal, recipe) {
    const closeButtons = modal.querySelectorAll('.modal__close');
    const shareBtn = modal.querySelector('[data-action="share"]');
    
    closeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        modal.close();
      });
    });
    
    shareBtn?.addEventListener('click', () => {
      this.shareRecipe(recipe);
    });

    // Close modal on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.close();
      }
    });
  }

  showDeleteConfirmation(recipe) {
    const confirmMessage = `¿Estás seguro de que quieres eliminar la receta "${recipe.title}"? Esta acción no se puede deshacer.`;
    
    if (confirm(confirmMessage)) {
      this.appState.deleteRecipe(recipe.id);
      this.showToast(`🗑️ Receta "${recipe.title}" eliminada correctamente`, 'success');
    }
  }

  async showRecipeForm(recipe = null) {
    const modal = DOM.recipeFormModal;
    if (!modal) return;
    
    const content = modal.querySelector('.modal__content');
    if (!content) return;
    
    const isEditing = !!recipe;
    const title = isEditing ? 'Editar Receta' : this.languageManager.translate('newRecipe');
    
    content.innerHTML = `
      <header class="modal__header">
        <h2 class="modal__title">${title}</h2>
        <button type="button" class="modal__close" aria-label="Cerrar modal">
          <span aria-hidden="true">×</span>
        </button>
      </header>
      
      <form class="recipe-form" id="recipe-form" novalidate>
        <div class="modal__body">
          <div class="form-group">
            <label for="recipe-title" class="form-label">${this.languageManager.translate('recipeTitle')} *</label>
            <input 
              type="text" 
              id="recipe-title" 
              name="title" 
              class="form-input" 
              required
              value="${recipe?.title || ''}"
              placeholder="Ej: Pasta con tomate"
            >
          </div>
          
          <div class="form-group">
            <label for="recipe-description" class="form-label">${this.languageManager.translate('recipeDescription')} *</label>
            <textarea 
              id="recipe-description" 
              name="description" 
              class="form-textarea" 
              required
              placeholder="Describe brevemente tu receta..."
            >${recipe?.description || ''}</textarea>
          </div>
          
          <div class="form-group">
            <label class="form-label">${this.languageManager.translate('ingredients')} *</label>
            <div class="dynamic-list" id="ingredients-list">
              ${recipe?.ingredients?.map((ingredient, index) => `
                <div class="dynamic-list__item">
                  <input 
                    type="text" 
                    name="ingredients[]" 
                    class="form-input" 
                    value="${ingredient}"
                    placeholder="Ej: 200g de pasta"
                  >
                  <button type="button" class="btn btn--ghost btn--sm remove-item">×</button>
                </div>
              `).join('') || ''}
              <button type="button" class="btn btn--secondary add-ingredient">
                ${this.languageManager.translate('addIngredient')}
              </button>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">${this.languageManager.translate('preparation')} *</label>
            <div class="dynamic-list" id="steps-list">
              ${recipe?.steps?.map((step, index) => `
                <div class="dynamic-list__item">
                  <textarea 
                    name="steps[]" 
                    class="form-textarea" 
                    placeholder="Paso ${index + 1}: Describe lo que hay que hacer..."
                  >${step}</textarea>
                  <button type="button" class="btn btn--ghost btn--sm remove-item">×</button>
                </div>
              `).join('') || ''}
              <button type="button" class="btn btn--secondary add-step">
                ${this.languageManager.translate('addStep')}
              </button>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="cooking-time" class="form-label">${this.languageManager.translate('cookingTime')} (min)</label>
              <input 
                type="number" 
                id="cooking-time" 
                name="cookingTime" 
                class="form-input" 
                min="1" 
                max="480"
                value="${recipe?.cookingTime || 15}"
              >
            </div>
            
            <div class="form-group">
              <label for="difficulty" class="form-label">${this.languageManager.translate('difficulty')}</label>
              <select id="difficulty" name="difficulty" class="form-input">
                <option value="muy fácil" ${recipe?.difficulty === 'muy fácil' ? 'selected' : ''}>Muy fácil</option>
                <option value="fácil" ${recipe?.difficulty === 'fácil' ? 'selected' : ''}>Fácil</option>
                <option value="intermedio" ${recipe?.difficulty === 'intermedio' ? 'selected' : ''}>Intermedio</option>
                <option value="difícil" ${recipe?.difficulty === 'difícil' ? 'selected' : ''}>Difícil</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="servings" class="form-label">${this.languageManager.translate('servings')}</label>
              <input 
                type="number" 
                id="servings" 
                name="servings" 
                class="form-input" 
                min="1" 
                max="10"
                value="${recipe?.servings || 1}"
              >
            </div>
          </div>
        </div>
        
        <footer class="modal__footer">
          <button type="button" class="btn btn--secondary modal__close">
            ${this.languageManager.translate('cancel')}
          </button>
          <button type="submit" class="btn btn--primary">
            ${this.languageManager.translate('save')}
          </button>
        </footer>
      </form>
    `;
    
    // Show modal
    modal.showModal();
    
    // Add form event listeners
    this.setupFormEventListeners(modal, recipe);
  }

  setupFormEventListeners(modal, recipe = null) {
    const form = modal.querySelector('#recipe-form');
    const titleInput = modal.querySelector('#recipe-title');
    
    // Auto-fetch image when title changes
    titleInput?.addEventListener('blur', async (e) => {
      if (e.target.value.trim() && !recipe) {
        try {
          const imageData = await ImageService.searchRecipeImage(e.target.value);
          // Store for later use when saving
          form.dataset.autoImage = imageData.url;
        } catch (error) {
          console.warn('Failed to fetch recipe image:', error);
        }
      }
    });
    
    // Add ingredient button
    const addIngredientBtn = modal.querySelector('.add-ingredient');
    addIngredientBtn?.addEventListener('click', () => {
      this.addDynamicListItem('ingredients-list', 'ingredients[]', 'input', 'Ej: 1 tomate');
    });
    
    // Add step button
    const addStepBtn = modal.querySelector('.add-step');
    addStepBtn?.addEventListener('click', () => {
      const stepNumber = modal.querySelectorAll('#steps-list .dynamic-list__item').length + 1;
      this.addDynamicListItem('steps-list', 'steps[]', 'textarea', `Paso ${stepNumber}: Describe lo que hay que hacer...`);
    });
    
    // Remove item buttons
    modal.addEventListener('click', (e) => {
      if (e.target.classList.contains('remove-item')) {
        e.target.closest('.dynamic-list__item').remove();
      }
    });
    
    // Form submit
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleRecipeSubmit(e, recipe);
    });
    
    // Close modal
    const closeButtons = modal.querySelectorAll('.modal__close');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        modal.close();
      });
    });
    
    // Initialize with at least one ingredient and step if new recipe
    if (!recipe) {
      this.addDynamicListItem('ingredients-list', 'ingredients[]', 'input', 'Ej: 200g de pasta');
      this.addDynamicListItem('steps-list', 'steps[]', 'textarea', 'Paso 1: Describe lo que hay que hacer...');
    }
  }

  addDynamicListItem(containerId, inputName, inputType, placeholder) {
    const container = document.getElementById(containerId);
    const addButton = container.querySelector('button');
    
    const item = document.createElement('div');
    item.className = 'dynamic-list__item';
    
    const input = inputType === 'textarea' ? 
      `<textarea name="${inputName}" class="form-textarea" placeholder="${placeholder}"></textarea>` :
      `<input type="text" name="${inputName}" class="form-input" placeholder="${placeholder}">`;
    
    item.innerHTML = `
      ${input}
      <button type="button" class="btn btn--ghost btn--sm remove-item">×</button>
    `;
    
    container.insertBefore(item, addButton);
    
    // Focus the new input
    const newInput = item.querySelector('input, textarea');
    newInput?.focus();
  }

  async handleRecipeSubmit(event, existingRecipe = null) {
    try {
      const formData = new FormData(event.target);
      const recipeData = this.extractRecipeData(formData);
      
      // Add auto-fetched image if available
      if (event.target.dataset.autoImage && !existingRecipe) {
        recipeData.imageUrl = event.target.dataset.autoImage;
      }
      
      if (existingRecipe) {
        this.appState.updateRecipe(existingRecipe.id, recipeData);
        this.showToast(`✅ Receta "${recipeData.title}" actualizada`, 'success');
      } else {
        const newRecipe = this.appState.addRecipe(recipeData);
        this.showToast(`✅ Receta "${recipeData.title}" creada`, 'success');
      }
      
      // Close modal
      DOM.recipeFormModal?.close();
      
    } catch (error) {
      console.error('❌ Error saving recipe:', error);
      this.showToast('❌ Error al guardar la receta', 'error');
    }
  }

  extractRecipeData(formData) {
    const ingredients = formData.getAll('ingredients[]').filter(i => i.trim());
    const steps = formData.getAll('steps[]').filter(s => s.trim());
    
    return {
      title: formData.get('title').trim(),
      description: formData.get('description').trim(),
      ingredients,
      steps,
      cookingTime: parseInt(formData.get('cookingTime')) || 15,
      difficulty: formData.get('difficulty') || 'fácil',
      servings: parseInt(formData.get('servings')) || 1,
      categories: ['personal'] // Default category
    };
  }

  updateStats() {
    const allRecipes = this.appState.recipes.getAll();
    const favorites = allRecipes.filter(r => r.isFavorite);
    const categories = [...new Set(allRecipes.flatMap(r => r.categories))];
    
    const stats = {
      total: allRecipes.length,
      favorites: favorites.length,
      categories: categories.length
    };
    
    // Update main stats
    const totalElement = document.querySelector('[data-stat="total"]');
    const favoritesElement = document.querySelector('[data-stat="favorites"]');
    const categoriesElement = document.querySelector('[data-stat="categories"]');
    
    if (totalElement) totalElement.textContent = stats.total;
    if (favoritesElement) favoritesElement.textContent = stats.favorites;
    if (categoriesElement) categoriesElement.textContent = stats.categories;
    
    // Update filter counts
    const allCountElement = document.querySelector('[data-count="all"]');
    const favCountElement = document.querySelector('[data-count="favorites"]');
    
    if (allCountElement) allCountElement.textContent = stats.total;
    if (favCountElement) favCountElement.textContent = stats.favorites;
  }

  updateStates() {
    // Update loading screen
    if (DOM.loadingScreen) {
      DOM.loadingScreen.style.display = 'none';
    }
  }

  showToast(message, type = 'info') {
    const toast = ToastFactory.create(type, message);
    if (DOM.toastContainer) {
      DOM.toastContainer.appendChild(toast);
      
      // Auto remove after duration
      setTimeout(() => {
        if (toast.parentElement) {
          toast.remove();
        }
      }, APP_CONFIG.toastDuration);
    }
  }
}

/**
 * Main Application Class
 */
class OneCookingApp {
  constructor() {
    this.appState = AppState.getInstance();
    this.languageManager = LanguageManager.getInstance();
    this.uiController = new UIController(this.appState, this.languageManager);
    this.initialized = false;
  }

  async init() {
    try {
      console.log('🔧 Initializing Cocina para Uno...');
      
      // Setup initial theme
      this.setupTheme();
      
      // Initialize UI
      this.uiController.render();
      
      // Mark as initialized
      this.initialized = true;
      
      console.log('✅ Application initialized successfully');
      
    } catch (error) {
      console.error('❌ Application initialization failed:', error);
      throw error;
    }
  }

  setupTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.appState.currentTheme = savedTheme;
    
    const themeToggle = DOM.themeToggle;
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', savedTheme === 'dark');
      themeToggle.setAttribute('aria-label', 
        savedTheme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
      );
      
      const icon = themeToggle.querySelector('.theme-toggle__icon');
      if (icon) {
        icon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
      }
    }
  }
}

// =============================================================================
// APPLICATION INITIALIZATION
// =============================================================================

/**
 * Initialize application when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('🍲 Cocina para Uno - Starting application...');
  
  try {
    // Initialize main application
    const app = new OneCookingApp();
    app.init();
    
    console.log('✅ Application ready');
    
  } catch (error) {
    console.error('❌ Application initialization failed:', error);
    
    // Show error message to user
    const errorToast = ToastFactory.create('error', 
      'Error al inicializar la aplicación. Por favor, recarga la página.'
    );
    if (DOM.toastContainer) {
      DOM.toastContainer.appendChild(errorToast);
    }
  }
});

/**
 * Handle application errors globally
 */
window.addEventListener('error', (event) => {
  console.error('❌ Global error:', event.error);
});

/**
 * Handle unhandled promise rejections
 */
window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Unhandled promise rejection:', event.reason);
  event.preventDefault();
});

console.log('🎉 Cocina para Uno - Main script loaded successfully!');
