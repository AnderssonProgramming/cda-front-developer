/**
 * COCINA PARA UNO - MAIN APPLICATION
 * Complete functional application with PWA, multi-language and auto-image features
 * Author: CDA Front Developer
 * Date: 2025
 * Version: 4.0.0 - Fixed and Enhanced
 */

/**
 * Global Configuration
 */
const APP_CONFIG = {
  version: '4.0.0',
  name: 'Cocina para Uno',
  themeKey: 'oneCooking-theme',
  languageKey: 'oneCooking-language',
  recipesKey: 'oneCooking-recipes',
  favoritesKey: 'oneCooking-favorites',
  imageFormats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
  maxFileSize: 5 * 1024 * 1024, // 5MB
  autoSaveDelay: 1000
};

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
    saveRecipe: 'Guardar receta',
    cancel: 'Cancelar',
    installApp: 'Instalar App',
    updateAvailable: 'Actualización disponible',
    updateNow: 'Actualizar ahora',
    later: 'Más tarde',
    connectionRestored: 'Conexión restaurada',
    offlineMode: 'Modo sin conexión activado',
    linkCopied: 'Enlace copiado al portapapeles',
    addedToFavorites: 'agregada a favoritos',
    removedFromFavorites: 'quitada de favoritos',
    recipeDeleted: 'eliminada correctamente',
    language: 'Idioma',
    changeLanguage: 'Cambiar idioma',
    changed: 'cambiado',
    searchingImage: 'Buscando imagen automática...',
    imageFound: 'Imagen encontrada automáticamente',
    imageNotFound: 'No se pudo encontrar imagen automática'
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
    noResultsDescription: 'Try other search terms or add a new recipe',
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
    saveRecipe: 'Save recipe',
    cancel: 'Cancel',
    installApp: 'Install App',
    updateAvailable: 'Update available',
    updateNow: 'Update now',
    later: 'Later',
    connectionRestored: 'Connection restored',
    offlineMode: 'Offline mode activated',
    linkCopied: 'Link copied to clipboard',
    addedToFavorites: 'added to favorites',
    removedFromFavorites: 'removed from favorites',
    recipeDeleted: 'deleted successfully',
    language: 'Language',
    changeLanguage: 'Change language',
    changed: 'changed',
    searchingImage: 'Searching for automatic image...',
    imageFound: 'Image found automatically',
    imageNotFound: 'Could not find automatic image'
  },
  fr: {
    appTitle: 'Cuisine pour Un',
    appSubtitle: 'Votre livre de recettes personnel',
    searchPlaceholder: 'Rechercher recettes, ingrédients...',
    newRecipe: 'Nouvelle Recette',
    allRecipes: 'Toutes',
    favorites: 'Favoris',
    categories: 'Catégories',
    recipes: 'Recettes',
    emptyStateTitle: 'Commencez votre aventure culinaire!',
    emptyStateDescription: 'Créez votre première recette et commencez à organiser votre collection personnelle',
    addFirstRecipe: '+ Ajouter ma première recette',
    noResultsTitle: 'Aucune recette trouvée',
    noResultsDescription: 'Essayez d\'autres termes de recherche ou ajoutez une nouvelle recette',
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
    addIngredient: 'Ajouter ingrédient',
    addStep: 'Ajouter étape',
    saveRecipe: 'Sauvegarder recette',
    cancel: 'Annuler',
    installApp: 'Installer App',
    updateAvailable: 'Mise à jour disponible',
    updateNow: 'Mettre à jour maintenant',
    later: 'Plus tard',
    connectionRestored: 'Connexion restaurée',
    offlineMode: 'Mode hors ligne activé',
    linkCopied: 'Lien copié dans le presse-papiers',
    addedToFavorites: 'ajoutée aux favoris',
    removedFromFavorites: 'retirée des favoris',
    recipeDeleted: 'supprimée avec succès',
    language: 'Langue',
    changeLanguage: 'Changer de langue',
    changed: 'changé',
    searchingImage: 'Recherche d\'image automatique...',
    imageFound: 'Image trouvée automatiquement',
    imageNotFound: 'Impossible de trouver une image automatique'
  }
};

/**
 * Current language global variable
 */
let currentLanguage = localStorage.getItem(APP_CONFIG.languageKey) || 'es';

/**
 * Translation helper function
 */
function t(key) {
  return TRANSLATIONS[currentLanguage]?.[key] || key;
}

/**
 * DOM Elements Cache
 */
const DOM = {
  loadingScreen: null,
  searchInput: null,
  searchClear: null,
  searchResults: null,
  themeToggle: null,
  filterButtons: null,
  recipesGrid: null,
  emptyState: null,
  noResults: null,
  recipeModal: null,
  recipeFormModal: null,
  recipeForm: null,
  toastContainer: null,
  languageToggle: null,
  languageMenu: null,
  languageOptions: null
};

/**
 * Initialize DOM elements
 */
function initializeDOM() {
  DOM.loadingScreen = document.getElementById('loading-screen');
  DOM.searchInput = document.getElementById('search-input');
  DOM.searchClear = document.querySelector('.search__clear');
  DOM.searchResults = document.getElementById('search-results-count');
  DOM.themeToggle = document.querySelector('.theme-toggle');
  DOM.filterButtons = document.querySelectorAll('.filter-btn');
  DOM.recipesGrid = document.getElementById('recipes-grid');
  DOM.emptyState = document.getElementById('empty-state');
  DOM.noResults = document.getElementById('no-results');
  DOM.recipeModal = document.getElementById('recipe-modal');
  DOM.recipeFormModal = document.getElementById('recipe-form-modal');
  DOM.recipeForm = document.getElementById('recipe-form');
  DOM.toastContainer = document.getElementById('toast-container');
  DOM.languageToggle = document.querySelector('.language-toggle');
  DOM.languageMenu = document.querySelector('.language-menu');
  DOM.languageOptions = document.querySelectorAll('.language-option');
}

/**
 * Recipe class definition
 */
class Recipe {
  constructor(data = {}) {
    this.id = data.id || Date.now().toString() + Math.random().toString(36).substring(2, 9);
    this.title = data.title || '';
    this.description = data.description || '';
    this.ingredients = data.ingredients || [];
    this.steps = data.steps || [];
    this.cookingTime = data.cookingTime || 0;
    this.difficulty = data.difficulty || 'Fácil';
    this.servings = data.servings || 1;
    this.categories = data.categories || [];
    this.imageUrl = data.imageUrl || '';
    this.notes = data.notes || '';
    this.dateCreated = data.dateCreated || new Date().toISOString();
    this.dateModified = data.dateModified || new Date().toISOString();
    this.isFavorite = data.isFavorite || false;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      ingredients: this.ingredients,
      steps: this.steps,
      cookingTime: this.cookingTime,
      difficulty: this.difficulty,
      servings: this.servings,
      categories: this.categories,
      imageUrl: this.imageUrl,
      notes: this.notes,
      dateCreated: this.dateCreated,
      dateModified: this.dateModified,
      isFavorite: this.isFavorite
    };
  }

  static fromJSON(data) {
    return new Recipe(data);
  }
}

/**
 * Singleton Pattern Base Class
 */
class SingletonPattern {
  constructor() {
    if (this.constructor.instance) {
      return this.constructor.instance;
    }
    this.constructor.instance = this;
    this.initialize();
    return this;
  }

  initialize() {
    // Override in subclasses
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new this();
    }
    return this.instance;
  }
}

/**
 * Observer Pattern implementation
 */
const ObserverPattern = {
  observers: {},

  subscribe(event, callback) {
    if (!this.observers[event]) {
      this.observers[event] = [];
    }
    this.observers[event].push(callback);
  },

  unsubscribe(event, callback) {
    if (this.observers[event]) {
      this.observers[event] = this.observers[event].filter(obs => obs !== callback);
    }
  },

  notifyObservers(event, data) {
    if (this.observers[event]) {
      this.observers[event].forEach(callback => callback(data));
    }
  }
};

/**
 * Auto-Image Service for recipes and ingredients
 */
class ImageService {
  static imageCache = new Map();
  static searchHistory = new Map();

  static async searchImage(query, type = 'recipe', size = '400x300') {
    try {
      // Check cache first
      const cacheKey = `${query}-${type}-${size}`;
      if (this.imageCache.has(cacheKey)) {
        return this.imageCache.get(cacheKey);
      }

      // Simulate API call to image search service
      // In real app, this would call Google Images API, Unsplash API, etc.
      const imageId = this.generateImageId(query, type);
      const imageUrl = this.buildImageUrl(imageId, size);
      
      // Cache the result
      this.imageCache.set(cacheKey, imageUrl);
      this.searchHistory.set(query, { url: imageUrl, timestamp: Date.now() });
      
      // Small delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return imageUrl;
    } catch (error) {
      console.error('Error searching for image:', error);
      return this.getDefaultImage(type);
    }
  }

  static generateImageId(query, type) {
    // Generate a predictable but varied image ID based on query
    const baseIds = {
      recipe: ['1565299543268', '1565299507', '1565299458', '1565299401', '1565299344'],
      ingredient: ['1506368249284', '1506368204', '1506368158', '1506368123', '1506368087']
    };
    
    const seeds = baseIds[type] || baseIds.recipe;
    const index = query.length % seeds.length;
    return seeds[index];
  }

  static buildImageUrl(imageId, size) {
    // Using Unsplash as example (in real app, use your preferred image service)
    return `https://images.unsplash.com/photo-${imageId}?w=${size.split('x')[0]}&h=${size.split('x')[1]}&fit=crop&crop=center&auto=format&q=80`;
  }

  static getDefaultImage(type) {
    const defaults = {
      recipe: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="60" fill="%236b7280">🍲</text></svg>',
      ingredient: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="60" fill="%236b7280">🥘</text></svg>'
    };
    return defaults[type] || defaults.recipe;
  }

  static async searchIngredientImage(ingredient) {
    return await this.searchImage(ingredient, 'ingredient', '200x200');
  }

  static async searchRecipeImage(recipeName) {
    return await this.searchImage(recipeName, 'recipe', '400x300');
  }
}

/**
 * Language Manager for multi-language support
 */
class LanguageManager extends SingletonPattern {
  initialize() {
    this.currentLanguage = currentLanguage;
    this.availableLanguages = [
      { code: 'es', name: 'Español', flag: '🇪🇸' },
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'fr', name: 'Français', flag: '🇫🇷' }
    ];
    
    this.setupLanguageSelector();
  }

  setupLanguageSelector() {
    if (!DOM.languageToggle || !DOM.languageMenu) {
      console.warn('Language selector elements not found');
      return;
    }

    // Update current language display
    this.updateLanguageDisplay();
    
    // Add event listeners
    this.addLanguageSelectorListeners();
  }

  updateLanguageDisplay() {
    const currentLangData = this.availableLanguages.find(lang => lang.code === this.currentLanguage);
    if (!currentLangData) return;

    // Update toggle button
    const flagElement = DOM.languageToggle.querySelector('.language-toggle__flag');
    const textElement = DOM.languageToggle.querySelector('.language-toggle__text');
    
    if (flagElement) flagElement.textContent = currentLangData.flag;
    if (textElement) textElement.textContent = currentLangData.code.toUpperCase();

    // Update aria-current on options
    DOM.languageOptions.forEach(option => {
      const isActive = option.getAttribute('data-lang') === this.currentLanguage;
      option.setAttribute('aria-current', isActive);
      
      if (isActive) {
        option.classList.add('language-option--active');
      } else {
        option.classList.remove('language-option--active');
      }
    });
  }

  addLanguageSelectorListeners() {
    // Toggle dropdown
    DOM.languageToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const isOpen = !DOM.languageMenu.hasAttribute('hidden');
      
      if (isOpen) {
        DOM.languageMenu.setAttribute('hidden', '');
        DOM.languageToggle.setAttribute('aria-expanded', 'false');
      } else {
        DOM.languageMenu.removeAttribute('hidden');
        DOM.languageToggle.setAttribute('aria-expanded', 'true');
      }
    });

    // Language option selection
    DOM.languageOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        e.preventDefault();
        const newLanguage = option.getAttribute('data-lang');
        this.changeLanguage(newLanguage);
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.language-selector')) {
        DOM.languageMenu.setAttribute('hidden', '');
        DOM.languageToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !DOM.languageMenu.hasAttribute('hidden')) {
        DOM.languageMenu.setAttribute('hidden', '');
        DOM.languageToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  changeLanguage(newLanguage) {
    if (newLanguage === this.currentLanguage) return;

    const oldLanguage = this.currentLanguage;
    this.currentLanguage = newLanguage;
    currentLanguage = newLanguage;

    // Save to localStorage
    localStorage.setItem(APP_CONFIG.languageKey, newLanguage);

    // Update HTML lang attribute
    document.documentElement.lang = newLanguage;

    // Update display
    this.updateLanguageDisplay();

    // Hide dropdown
    DOM.languageMenu.setAttribute('hidden', '');
    DOM.languageToggle.setAttribute('aria-expanded', 'false');

    // Trigger language change event
    ObserverPattern.notifyObservers('languageChanged', { 
      from: oldLanguage, 
      to: newLanguage 
    });

    // Update all UI text
    this.updateUITexts();

    // Show success message
    const langName = this.availableLanguages.find(l => l.code === newLanguage)?.name;
    showToast('success', `${t('language')} ${t('changed')}: ${langName}`);
  }

  updateUITexts() {
    // Update document title
    document.title = `🍲 ${t('appTitle')} | ${t('appSubtitle')}`;

    // Update header
    const headerTitle = document.querySelector('.header__title .header__text');
    const headerSubtitle = document.querySelector('.header__subtitle');
    
    if (headerTitle) headerTitle.textContent = t('appTitle');
    if (headerSubtitle) headerSubtitle.textContent = t('appSubtitle');

    // Update search placeholder
    if (DOM.searchInput) {
      DOM.searchInput.setAttribute('placeholder', t('searchPlaceholder'));
    }

    // Update buttons
    const newRecipeBtn = document.querySelector('.btn--add-recipe .btn__text');
    if (newRecipeBtn) newRecipeBtn.textContent = t('newRecipe');

    // Update filter buttons
    const allBtn = document.querySelector('[data-filter="all"] .filter-btn__text');
    const favBtn = document.querySelector('[data-filter="favorites"] .filter-btn__text');
    const catBtn = document.querySelector('.dropdown__trigger .filter-btn__text');
    
    if (allBtn) allBtn.textContent = t('allRecipes');
    if (favBtn) favBtn.textContent = t('favorites');
    if (catBtn) catBtn.textContent = t('categories');

    // Update empty state
    const emptyTitle = document.querySelector('.empty-state__title');
    const emptyDesc = document.querySelector('.empty-state__description');
    const emptyBtn = document.querySelector('.btn--add-first-recipe .btn__text');
    
    if (emptyTitle) emptyTitle.textContent = t('emptyStateTitle');
    if (emptyDesc) emptyDesc.textContent = t('emptyStateDescription');
    if (emptyBtn) emptyBtn.textContent = t('addFirstRecipe');

    // Update no results state
    const noResultsTitle = document.querySelector('.no-results__title');
    const noResultsDesc = document.querySelector('.no-results__description');
    
    if (noResultsTitle) noResultsTitle.textContent = t('noResultsTitle');
    if (noResultsDesc) noResultsDesc.textContent = t('noResultsDescription');

    // Update stats labels
    const statLabels = document.querySelectorAll('.stat-item__label');
    if (statLabels.length >= 3) {
      statLabels[0].textContent = t('recipes');
      statLabels[1].textContent = t('favorites');
      statLabels[2].textContent = t('categories');
    }

    // Update form modal if it exists
    const formTitle = document.getElementById('form-modal-title');
    if (formTitle) formTitle.textContent = t('newRecipe');

    // Update theme toggle aria-label
    if (DOM.themeToggle) {
      const isDark = document.body.getAttribute('data-theme') === 'dark';
      DOM.themeToggle.setAttribute('aria-label', 
        isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
      );
    }

    // Re-render recipes if app is available
    if (window.app) {
      window.app.render();
    }
  }
}

/**
 * Toast Factory for notifications
 */
class ToastFactory {
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
          <button class="toast__close" aria-label="${t('close')}">
            <span aria-hidden="true">×</span>
          </button>
        ` : ''}
      </div>
    `;

    // Auto dismiss
    if (options.autoDismiss !== false) {
      setTimeout(() => {
        if (toast.parentNode) {
          toast.remove();
        }
      }, options.duration || (type === 'loading' ? 8000 : 4000));
    }

    // Close button functionality
    const closeBtn = toast.querySelector('.toast__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => toast.remove());
    }

    return toast;
  }
}

/**
 * Global toast function
 */
function showToast(type, message, options = {}) {
  if (!DOM.toastContainer) return;

  const toast = ToastFactory.create(type, message, options);
  DOM.toastContainer.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('toast--show');
  });

  return toast;
}

/**
 * Theme Manager for dark/light mode
 */
class ThemeManager extends SingletonPattern {
  initialize() {
    this.currentTheme = localStorage.getItem(APP_CONFIG.themeKey) || 'light';
    this.applyTheme();
    this.setupThemeToggle();
  }

  applyTheme() {
    document.body.setAttribute('data-theme', this.currentTheme);
    this.updateThemeToggle();
  }

  updateThemeToggle() {
    if (!DOM.themeToggle) return;

    const isDark = this.currentTheme === 'dark';
    const icon = DOM.themeToggle.querySelector('.theme-toggle__icon');
    
    if (icon) {
      icon.textContent = isDark ? '☀️' : '🌙';
    }
    
    DOM.themeToggle.setAttribute('aria-pressed', isDark);
    DOM.themeToggle.setAttribute('aria-label', 
      isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
    );
  }

  setupThemeToggle() {
    if (!DOM.themeToggle) return;

    DOM.themeToggle.addEventListener('click', () => {
      this.toggleTheme();
    });
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem(APP_CONFIG.themeKey, this.currentTheme);
    this.applyTheme();
    
    showToast('info', `Tema ${this.currentTheme === 'dark' ? 'oscuro' : 'claro'} activado`);
  }
}

/**
 * PWA Manager for app-like features
 */
class PWAManager extends SingletonPattern {
  initialize() {
    this.deferredPrompt = null;
    this.setupPWAFeatures();
  }

  setupPWAFeatures() {
    // Service Worker registration
    this.registerServiceWorker();
    
    // Install prompt handling
    this.setupInstallPrompt();
    
    // Online/offline detection
    this.setupOnlineDetection();
  }

  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('./sw.js');
        console.log('✅ Service Worker registered:', registration);
      } catch (error) {
        console.error('❌ Service Worker registration failed:', error);
      }
    }
  }

  setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallButton();
    });
  }

  showInstallButton() {
    // You can implement an install button here
    console.log('📱 App can be installed');
  }

  setupOnlineDetection() {
    window.addEventListener('online', () => {
      showToast('success', t('connectionRestored'));
    });

    window.addEventListener('offline', () => {
      showToast('warning', t('offlineMode'));
    });
  }
}

/**
 * Main Application Class
 */
class OneCookingApp {
  constructor() {
    this.recipes = [];
    this.favorites = new Set();
    this.currentFilter = 'all';
    this.searchQuery = '';
    this.initialized = false;
  }

  async init() {
    try {
      console.log('🔧 Initializing Cocina para Uno...');
      
      // Load data
      this.loadRecipes();
      this.loadFavorites();
      
      // Setup UI
      this.setupEventListeners();
      this.render();
      
      // Mark as initialized
      this.initialized = true;
      
      console.log('✅ Application initialized successfully');
      
    } catch (error) {
      console.error('❌ Application initialization failed:', error);
      showToast('error', 'Error al inicializar la aplicación');
    }
  }

  loadRecipes() {
    try {
      const stored = localStorage.getItem(APP_CONFIG.recipesKey);
      this.recipes = stored ? JSON.parse(stored).map(data => Recipe.fromJSON(data)) : [];
    } catch (error) {
      console.error('Error loading recipes:', error);
      this.recipes = [];
    }
  }

  loadFavorites() {
    try {
      const stored = localStorage.getItem(APP_CONFIG.favoritesKey);
      this.favorites = new Set(stored ? JSON.parse(stored) : []);
    } catch (error) {
      console.error('Error loading favorites:', error);
      this.favorites = new Set();
    }
  }

  saveRecipes() {
    try {
      localStorage.setItem(APP_CONFIG.recipesKey, JSON.stringify(this.recipes));
    } catch (error) {
      console.error('Error saving recipes:', error);
    }
  }

  saveFavorites() {
    try {
      localStorage.setItem(APP_CONFIG.favoritesKey, JSON.stringify([...this.favorites]));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }

  setupEventListeners() {
    // Add recipe buttons
    const addRecipeBtn = document.querySelector('.btn--add-recipe');
    const addFirstRecipeBtn = document.querySelector('.btn--add-first-recipe');
    
    if (addRecipeBtn) {
      addRecipeBtn.addEventListener('click', () => this.showRecipeForm());
    }
    
    if (addFirstRecipeBtn) {
      addFirstRecipeBtn.addEventListener('click', () => this.showRecipeForm());
    }

    // Search functionality
    if (DOM.searchInput) {
      DOM.searchInput.addEventListener('input', this.debounce((e) => {
        this.searchQuery = e.target.value.trim();
        this.render();
        this.updateSearchClear();
      }, 300));
    }

    if (DOM.searchClear) {
      DOM.searchClear.addEventListener('click', () => {
        DOM.searchInput.value = '';
        this.searchQuery = '';
        this.render();
        this.updateSearchClear();
      });
    }

    // Filter buttons
    DOM.filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.setActiveFilter(btn.dataset.filter);
        this.render();
      });
    });
  }

  debounce(func, wait) {
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

  updateSearchClear() {
    if (!DOM.searchClear) return;
    
    if (this.searchQuery) {
      DOM.searchClear.removeAttribute('hidden');
    } else {
      DOM.searchClear.setAttribute('hidden', '');
    }
  }

  setActiveFilter(filter) {
    this.currentFilter = filter;
    
    DOM.filterButtons.forEach(btn => {
      const isActive = btn.dataset.filter === filter;
      btn.classList.toggle('filter-btn--active', isActive);
      btn.setAttribute('aria-pressed', isActive);
    });
  }

  getFilteredRecipes() {
    let filtered = [...this.recipes];

    // Apply search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(recipe => 
        recipe.title.toLowerCase().includes(query) ||
        recipe.description.toLowerCase().includes(query) ||
        recipe.ingredients.some(ing => ing.toLowerCase().includes(query)) ||
        recipe.categories.some(cat => cat.toLowerCase().includes(query))
      );
    }

    // Apply type filter
    if (this.currentFilter === 'favorites') {
      filtered = filtered.filter(recipe => this.favorites.has(recipe.id));
    }

    return filtered;
  }

  render() {
    const filteredRecipes = this.getFilteredRecipes();
    this.renderRecipes(filteredRecipes);
    this.updateStats();
    this.updateResultsCount(filteredRecipes.length);
  }

  renderRecipes(recipes) {
    if (!DOM.recipesGrid) return;

    if (recipes.length === 0) {
      this.showEmptyState();
      return;
    }

    this.hideEmptyState();
    
    DOM.recipesGrid.innerHTML = recipes.map(recipe => this.createRecipeCard(recipe)).join('');
    
    // Add event listeners to recipe cards
    this.setupRecipeCardListeners();
  }

  createRecipeCard(recipe) {
    const isFavorite = this.favorites.has(recipe.id);
    
    return `
      <article class="recipe-card" data-recipe-id="${recipe.id}" role="gridcell">
        <div class="recipe-card__image">
          <img 
            src="${recipe.imageUrl || ImageService.getDefaultImage('recipe')}" 
            alt="${recipe.title}"
            loading="lazy"
            onerror="this.src='${ImageService.getDefaultImage('recipe')}'"
          >
          <button 
            class="recipe-card__favorite ${isFavorite ? 'recipe-card__favorite--active' : ''}"
            aria-label="${isFavorite ? t('removedFromFavorites') : t('addedToFavorites')}"
            data-action="toggle-favorite"
          >
            <span aria-hidden="true">${isFavorite ? '❤️' : '🤍'}</span>
          </button>
        </div>
        
        <div class="recipe-card__content">
          <header class="recipe-card__header">
            <h3 class="recipe-card__title">${recipe.title}</h3>
            <div class="recipe-card__meta">
              <span class="recipe-card__time">
                <span aria-hidden="true">⏱️</span>
                ${recipe.cookingTime} min
              </span>
              <span class="recipe-card__difficulty">${recipe.difficulty}</span>
            </div>
          </header>
          
          ${recipe.description ? `
            <p class="recipe-card__description">${recipe.description}</p>
          ` : ''}
          
          ${recipe.categories.length > 0 ? `
            <div class="recipe-card__categories">
              ${recipe.categories.map(cat => `
                <span class="recipe-card__category">${cat}</span>
              `).join('')}
            </div>
          ` : ''}
          
          <footer class="recipe-card__actions">
            <button 
              class="btn btn--secondary btn--sm"
              data-action="view"
              aria-label="${t('view')} ${recipe.title}"
            >
              ${t('view')}
            </button>
            <button 
              class="btn btn--outline btn--sm"
              data-action="edit"
              aria-label="${t('edit')} ${recipe.title}"
            >
              ${t('edit')}
            </button>
            <button 
              class="btn btn--outline btn--sm"
              data-action="delete"
              aria-label="${t('delete')} ${recipe.title}"
            >
              ${t('delete')}
            </button>
          </footer>
        </div>
      </article>
    `;
  }

  setupRecipeCardListeners() {
    const cards = DOM.recipesGrid.querySelectorAll('.recipe-card');
    
    cards.forEach(card => {
      const recipeId = card.dataset.recipeId;
      const recipe = this.recipes.find(r => r.id === recipeId);
      
      if (!recipe) return;

      // Action buttons
      const viewBtn = card.querySelector('[data-action="view"]');
      const editBtn = card.querySelector('[data-action="edit"]');
      const deleteBtn = card.querySelector('[data-action="delete"]');
      const favoriteBtn = card.querySelector('[data-action="toggle-favorite"]');

      if (viewBtn) {
        viewBtn.addEventListener('click', () => this.showRecipeDetails(recipe));
      }

      if (editBtn) {
        editBtn.addEventListener('click', () => this.showRecipeForm(recipe));
      }

      if (deleteBtn) {
        deleteBtn.addEventListener('click', () => this.deleteRecipe(recipe.id));
      }

      if (favoriteBtn) {
        favoriteBtn.addEventListener('click', () => this.toggleFavorite(recipe.id));
      }
    });
  }

  showEmptyState() {
    if (DOM.emptyState) DOM.emptyState.removeAttribute('hidden');
    if (DOM.noResults) DOM.noResults.setAttribute('hidden', '');
    if (DOM.recipesGrid) DOM.recipesGrid.innerHTML = '';
  }

  hideEmptyState() {
    if (DOM.emptyState) DOM.emptyState.setAttribute('hidden', '');
    if (DOM.noResults) DOM.noResults.setAttribute('hidden', '');
  }

  updateStats() {
    const totalStat = document.querySelector('[data-stat="total"]');
    const favoritesStat = document.querySelector('[data-stat="favorites"]');
    const categoriesStat = document.querySelector('[data-stat="categories"]');

    if (totalStat) totalStat.textContent = this.recipes.length;
    if (favoritesStat) favoritesStat.textContent = this.favorites.size;
    if (categoriesStat) {
      const uniqueCategories = new Set(this.recipes.flatMap(r => r.categories));
      categoriesStat.textContent = uniqueCategories.size;
    }
  }

  updateResultsCount(count) {
    if (!DOM.searchResults) return;
    
    if (this.searchQuery) {
      DOM.searchResults.textContent = `${count} resultado${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''}`;
    } else {
      DOM.searchResults.textContent = '';
    }
  }

  showRecipeForm(recipe = null) {
    if (!DOM.recipeFormModal) {
      console.error('Recipe form modal not found');
      return;
    }

    const isEdit = recipe !== null;
    const modalTitle = document.getElementById('form-modal-title');
    
    if (modalTitle) {
      modalTitle.textContent = isEdit ? `${t('edit')}: ${recipe.title}` : t('newRecipe');
    }

    // Reset and populate form
    this.resetRecipeForm();
    if (isEdit) {
      this.populateRecipeForm(recipe);
    }

    // Setup form listeners
    this.setupRecipeFormListeners(recipe);
    
    // Show modal
    DOM.recipeFormModal.showModal();
    
    // Focus first input
    const firstInput = DOM.recipeFormModal.querySelector('input[type="text"]');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }

  resetRecipeForm() {
    if (!DOM.recipeForm) return;
    
    DOM.recipeForm.reset();
    
    // Reset dynamic lists
    this.resetDynamicList('ingredients-list');
    this.resetDynamicList('steps-list');
    
    // Clear categories
    const categoriesTags = document.getElementById('categories-tags');
    if (categoriesTags) {
      categoriesTags.innerHTML = '';
    }

    // Clear image preview
    const imagePreview = document.getElementById('image-preview');
    if (imagePreview) {
      imagePreview.innerHTML = '';
      imagePreview.setAttribute('hidden', '');
    }
  }

  populateRecipeForm(recipe) {
    // Basic fields
    const nameInput = DOM.recipeForm.querySelector('#recipe-name');
    const timeInput = DOM.recipeForm.querySelector('#recipe-time');
    
    if (nameInput) nameInput.value = recipe.title;
    if (timeInput) timeInput.value = recipe.cookingTime;

    // Populate ingredients
    if (recipe.ingredients.length > 0) {
      const ingredientsList = document.getElementById('ingredients-list');
      if (ingredientsList) {
        ingredientsList.innerHTML = '';
        recipe.ingredients.forEach(ingredient => {
          this.addDynamicListItem('ingredients-list', 'text', t('addIngredient'), ingredient);
        });
      }
    }

    // Populate steps
    if (recipe.steps.length > 0) {
      const stepsList = document.getElementById('steps-list');
      if (stepsList) {
        stepsList.innerHTML = '';
        recipe.steps.forEach(step => {
          this.addDynamicListItem('steps-list', 'textarea', t('addStep'), step);
        });
      }
    }

    // Populate categories
    recipe.categories.forEach(category => {
      this.addCategory(category);
    });

    // Show image if exists
    if (recipe.imageUrl) {
      this.showImagePreview(recipe.imageUrl);
    }
  }

  resetDynamicList(listId) {
    const list = document.getElementById(listId);
    if (!list) return;
    
    const isIngredients = listId.includes('ingredients');
    const inputType = isIngredients ? 'text' : 'textarea';
    const placeholder = isIngredients ? 'Ej: 2 tazas de harina' : 'Describe este paso...';
    
    list.innerHTML = `
      <div class="dynamic-list__item">
        <label for="${listId}-0" class="dynamic-list__label">
          ${isIngredients ? 'Ingrediente 1' : 'Paso 1'}
        </label>
        ${inputType === 'textarea' ? `
          <textarea 
            id="${listId}-0"
            name="${isIngredients ? 'ingredients[]' : 'steps[]'}"
            class="form-textarea dynamic-list__textarea"
            rows="3"
            placeholder="${placeholder}"
            required
          ></textarea>
        ` : `
          <input 
            type="text"
            id="${listId}-0"
            name="${isIngredients ? 'ingredients[]' : 'steps[]'}"
            class="form-input dynamic-list__input"
            placeholder="${placeholder}"
            required
          >
        `}
        <button 
          type="button" 
          class="btn btn--icon btn--remove-item"
          aria-label="Eliminar ${isIngredients ? 'ingrediente' : 'paso'}"
          disabled
        >
          <span aria-hidden="true">−</span>
        </button>
      </div>
    `;
  }

  addDynamicListItem(listId, inputType = 'text', buttonText = '', value = '') {
    const list = document.getElementById(listId);
    if (!list) return;

    const items = list.querySelectorAll('.dynamic-list__item');
    const index = items.length;
    const isIngredients = listId.includes('ingredients');
    
    const itemDiv = document.createElement('div');
    itemDiv.className = 'dynamic-list__item';
    
    const label = isIngredients ? `Ingrediente ${index + 1}` : `Paso ${index + 1}`;
    const name = isIngredients ? 'ingredients[]' : 'steps[]';
    const placeholder = isIngredients ? 'Ej: 2 tazas de harina' : 'Describe este paso...';
    
    itemDiv.innerHTML = `
      <label for="${listId}-${index}" class="dynamic-list__label">
        ${label}
      </label>
      ${inputType === 'textarea' ? `
        <textarea 
          id="${listId}-${index}"
          name="${name}"
          class="form-textarea dynamic-list__textarea"
          rows="3"
          placeholder="${placeholder}"
          required
        >${value}</textarea>
      ` : `
        <input 
          type="text"
          id="${listId}-${index}"
          name="${name}"
          class="form-input dynamic-list__input"
          placeholder="${placeholder}"
          value="${value}"
          required
        >
      `}
      <button 
        type="button" 
        class="btn btn--icon btn--remove-item"
        aria-label="Eliminar ${isIngredients ? 'ingrediente' : 'paso'}"
      >
        <span aria-hidden="true">−</span>
      </button>
    `;

    list.appendChild(itemDiv);

    // Add remove functionality
    const removeBtn = itemDiv.querySelector('.btn--remove-item');
    removeBtn.addEventListener('click', () => {
      itemDiv.remove();
      this.updateDynamicListLabels(listId);
    });

    // Auto-search image for ingredients
    if (isIngredients && !value) {
      const input = itemDiv.querySelector('input');
      if (input) {
        input.addEventListener('blur', async (e) => {
          const ingredient = e.target.value.trim();
          if (ingredient.length > 2) {
            await this.searchIngredientImage(ingredient);
          }
        });
      }
    }

    this.updateDynamicListLabels(listId);
  }

  updateDynamicListLabels(listId) {
    const list = document.getElementById(listId);
    if (!list) return;

    const items = list.querySelectorAll('.dynamic-list__item');
    const isIngredients = listId.includes('ingredients');
    
    items.forEach((item, index) => {
      const label = item.querySelector('.dynamic-list__label');
      const removeBtn = item.querySelector('.btn--remove-item');
      
      if (label) {
        label.textContent = isIngredients ? `Ingrediente ${index + 1}` : `Paso ${index + 1}`;
      }
      
      if (removeBtn) {
        removeBtn.disabled = items.length === 1;
      }
    });
  }

  async searchIngredientImage(ingredient) {
    try {
      showToast('loading', `${t('searchingImage')} "${ingredient}"...`);
      
      const imageUrl = await ImageService.searchIngredientImage(ingredient);
      
      if (imageUrl) {
        showToast('success', `${t('imageFound')} "${ingredient}"`);
      }
      
      return imageUrl;
    } catch (error) {
      console.error('Error searching ingredient image:', error);
      showToast('warning', `${t('imageNotFound')} "${ingredient}"`);
      return null;
    }
  }

  addCategory(categoryText) {
    const categoriesTags = document.getElementById('categories-tags');
    if (!categoriesTags || !categoryText.trim()) return;

    const categoryTag = document.createElement('span');
    categoryTag.className = 'category-tag';
    categoryTag.innerHTML = `
      <span class="category-tag__text">${categoryText}</span>
      <button type="button" class="category-tag__remove" aria-label="Eliminar categoría ${categoryText}">
        <span aria-hidden="true">×</span>
      </button>
    `;

    // Add remove functionality
    const removeBtn = categoryTag.querySelector('.category-tag__remove');
    removeBtn.addEventListener('click', () => {
      categoryTag.remove();
    });

    categoriesTags.appendChild(categoryTag);
  }

  setupRecipeFormListeners(editingRecipe = null) {
    if (!DOM.recipeForm) return;

    // Remove existing listeners
    const newForm = DOM.recipeForm.cloneNode(true);
    DOM.recipeForm.parentNode.replaceChild(newForm, DOM.recipeForm);
    DOM.recipeForm = newForm;

    // Recipe name input with auto-image search
    const nameInput = DOM.recipeForm.querySelector('#recipe-name');
    if (nameInput) {
      nameInput.addEventListener('blur', async (e) => {
        const recipeName = e.target.value.trim();
        if (recipeName.length > 2 && !editingRecipe) {
          await this.searchAndSetRecipeImage(recipeName);
        }
      });
    }

    // Add ingredient button
    const addIngredientBtn = DOM.recipeForm.querySelector('.btn--add-ingredient');
    if (addIngredientBtn) {
      addIngredientBtn.addEventListener('click', () => {
        this.addDynamicListItem('ingredients-list', 'text', t('addIngredient'));
      });
    }

    // Add step button
    const addStepBtn = DOM.recipeForm.querySelector('.btn--add-step');
    if (addStepBtn) {
      addStepBtn.addEventListener('click', () => {
        this.addDynamicListItem('steps-list', 'textarea', t('addStep'));
      });
    }

    // Categories input
    const categoriesInput = DOM.recipeForm.querySelector('#category-input');
    if (categoriesInput) {
      categoriesInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const category = e.target.value.trim();
          if (category) {
            this.addCategory(category);
            e.target.value = '';
          }
        }
      });
    }

    // Form submission
    DOM.recipeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit(e, editingRecipe);
    });

    // Cancel button
    const cancelBtn = DOM.recipeForm.querySelector('.btn--cancel');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        DOM.recipeFormModal.close();
      });
    }

    // Close button
    const closeBtn = DOM.recipeFormModal.querySelector('.modal__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        DOM.recipeFormModal.close();
      });
    }
  }

  async searchAndSetRecipeImage(recipeName) {
    try {
      showToast('loading', `${t('searchingImage')} "${recipeName}"...`);
      
      const imageUrl = await ImageService.searchRecipeImage(recipeName);
      
      if (imageUrl) {
        this.showImagePreview(imageUrl);
        showToast('success', `${t('imageFound')} "${recipeName}"`);
      }
      
      return imageUrl;
    } catch (error) {
      console.error('Error fetching recipe image:', error);
      showToast('warning', `${t('imageNotFound')} "${recipeName}"`);
      return null;
    }
  }

  showImagePreview(imageUrl) {
    const imagePreview = document.getElementById('image-preview');
    if (!imagePreview) return;

    imagePreview.innerHTML = `
      <div class="image-preview">
        <img src="${imageUrl}" alt="Vista previa" class="image-preview__img">
        <button type="button" class="image-preview__remove" aria-label="Eliminar imagen">
          <span aria-hidden="true">×</span>
        </button>
      </div>
    `;

    imagePreview.removeAttribute('hidden');

    // Add remove functionality
    const removeBtn = imagePreview.querySelector('.image-preview__remove');
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        imagePreview.innerHTML = '';
        imagePreview.setAttribute('hidden', '');
      });
    }
  }

  handleFormSubmit(event, editingRecipe = null) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const recipeData = this.extractRecipeData(formData);
    
    if (!this.validateRecipeData(recipeData)) {
      return;
    }

    if (editingRecipe) {
      this.updateRecipe(editingRecipe.id, recipeData);
    } else {
      this.createRecipe(recipeData);
    }

    DOM.recipeFormModal.close();
  }

  extractRecipeData(formData) {
    const data = {
      title: formData.get('name')?.trim() || '',
      cookingTime: parseInt(formData.get('time')) || 0,
      ingredients: formData.getAll('ingredients[]').filter(ing => ing.trim()),
      steps: formData.getAll('steps[]').filter(step => step.trim()),
      categories: []
    };

    // Extract categories from tags
    const categoriesTags = document.querySelectorAll('.category-tag__text');
    data.categories = Array.from(categoriesTags).map(tag => tag.textContent.trim());

    // Get image URL from preview
    const imagePreview = document.querySelector('.image-preview__img');
    if (imagePreview) {
      data.imageUrl = imagePreview.src;
    }

    return data;
  }

  validateRecipeData(data) {
    if (!data.title) {
      showToast('error', 'El título de la receta es obligatorio');
      return false;
    }

    if (data.ingredients.length === 0) {
      showToast('error', 'Debe agregar al menos un ingrediente');
      return false;
    }

    if (data.steps.length === 0) {
      showToast('error', 'Debe agregar al menos un paso de preparación');
      return false;
    }

    return true;
  }

  createRecipe(data) {
    const recipe = new Recipe(data);
    this.recipes.push(recipe);
    this.saveRecipes();
    this.render();
    
    showToast('success', `Receta "${recipe.title}" creada exitosamente`);
  }

  updateRecipe(id, data) {
    const index = this.recipes.findIndex(r => r.id === id);
    if (index === -1) return;

    const recipe = this.recipes[index];
    Object.assign(recipe, data);
    recipe.dateModified = new Date().toISOString();
    
    this.saveRecipes();
    this.render();
    
    showToast('success', `Receta "${recipe.title}" actualizada exitosamente`);
  }

  deleteRecipe(id) {
    const recipe = this.recipes.find(r => r.id === id);
    if (!recipe) return;

    if (confirm(`¿Estás seguro de que quieres eliminar la receta "${recipe.title}"?`)) {
      this.recipes = this.recipes.filter(r => r.id !== id);
      this.favorites.delete(id);
      
      this.saveRecipes();
      this.saveFavorites();
      this.render();
      
      showToast('success', `Receta "${recipe.title}" ${t('recipeDeleted')}`);
    }
  }

  toggleFavorite(id) {
    const recipe = this.recipes.find(r => r.id === id);
    if (!recipe) return;

    if (this.favorites.has(id)) {
      this.favorites.delete(id);
      showToast('info', `"${recipe.title}" ${t('removedFromFavorites')}`);
    } else {
      this.favorites.add(id);
      showToast('success', `"${recipe.title}" ${t('addedToFavorites')}`);
    }

    this.saveFavorites();
    this.render();
  }

  showRecipeDetails(recipe) {
    // For now, just show a toast - could implement a full detail modal
    showToast('info', `${t('view')}: ${recipe.title}`);
  }
}

/**
 * APPLICATION INITIALIZATION
 */

/**
 * Initialize application when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('🍲 Cocina para Uno - Starting application...');
  
  try {
    // Initialize DOM elements
    initializeDOM();
    
    // Initialize managers
    PWAManager.getInstance();
    ThemeManager.getInstance();
    LanguageManager.getInstance();
    
    // Initialize main application
    window.app = new OneCookingApp();
    window.app.init();
    
    console.log('✅ Application initialized successfully');
    
    // Hide loading screen
    if (DOM.loadingScreen) {
      setTimeout(() => {
        DOM.loadingScreen.style.display = 'none';
      }, 500);
    }
    
  } catch (error) {
    console.error('❌ Application initialization failed:', error);
    
    // Show error message to user
    showToast('error', 
      'Error al inicializar la aplicación. Por favor, recarga la página.'
    );
  }
});

/**
 * Handle page visibility changes for better performance
 */
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && window.app?.initialized) {
    // Refresh data when page becomes visible again
    window.app.render();
  }
});

/**
 * Global error handler
 */
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  showToast('error', 'Ha ocurrido un error inesperado');
});

/**
 * Unhandled promise rejection handler
 */
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  showToast('error', 'Error de conexión o procesamiento');
  event.preventDefault();
});
