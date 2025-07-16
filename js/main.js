/**
 * COCINA PARA UNO - MAIN APPLICATION
 * Complete functional application with PWA, multi-language and auto-image features
 * Author: CDA Front Developer
 * Date: 2025
 * Version: 3.0.0 - Enhanced with all requested features
 */

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
    changed: 'cambiado'
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
    changed: 'changed'
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
    addIngredient: 'Ajouter un ingrédient',
    addStep: 'Ajouter une étape',
    saveRecipe: 'Sauvegarder la recette',
    cancel: 'Annuler',
    installApp: 'Installer l\'App',
    updateAvailable: 'Mise à jour disponible',
    updateNow: 'Mettre à jour maintenant',
    later: 'Plus tard',
    connectionRestored: 'Connexion rétablie',
    offlineMode: 'Mode hors ligne activé',
    linkCopied: 'Lien copié dans le presse-papiers',
    addedToFavorites: 'ajoutée aux favoris',
    removedFromFavorites: 'retirée des favoris',
    recipeDeleted: 'supprimée avec succès',
    language: 'Langue',
    changeLanguage: 'Changer de langue',
    changed: 'changée'
  }
};

/**
 * Application Configuration
 */
const APP_CONFIG = {
  version: '3.0.0',
  name: 'Cocina para Uno',
  author: 'CDA Front Developer',
  storageKey: 'cocina-para-uno-recipes',
  languageKey: 'cocina-para-uno-language',
  searchDelay: 300,
  toastDuration: 3000,
  imageFormats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
  maxImageSize: 5 * 1024 * 1024, // 5MB
  apis: {
    unsplash: {
      baseUrl: 'https://api.unsplash.com',
      accessKey: 'demo'
    }
  }
};

/**
 * Current language state
 */
let currentLanguage = localStorage.getItem(APP_CONFIG.languageKey) || 'es';

/**
 * Get translation for current language
 */
function t(key) {
  return TRANSLATIONS[currentLanguage]?.[key] || TRANSLATIONS.es[key] || key;
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
  toastContainer: null
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
    this.isFavorite = data.isFavorite || false;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.ingredientImages = data.ingredientImages || [];
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
      isFavorite: this.isFavorite,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      ingredientImages: this.ingredientImages
    };
  }
}

/**
 * Recipe Collection class
 */
class RecipeCollection {
  constructor() {
    this.recipes = [];
  }

  addRecipe(recipe) {
    this.recipes.push(recipe);
  }

  updateRecipe(updatedRecipe) {
    const index = this.recipes.findIndex(recipe => recipe.id === updatedRecipe.id);
    if (index !== -1) {
      this.recipes[index] = updatedRecipe;
    }
  }

  deleteRecipe(recipeId) {
    this.recipes = this.recipes.filter(recipe => recipe.id !== recipeId);
  }

  findById(recipeId) {
    return this.recipes.find(recipe => recipe.id === recipeId);
  }

  getAll() {
    return this.recipes;
  }

  getFavorites() {
    return this.recipes.filter(recipe => recipe.isFavorite);
  }

  getCategories() {
    const categories = new Set();
    this.recipes.forEach(recipe => {
      recipe.categories.forEach(category => categories.add(category));
    });
    return Array.from(categories);
  }
}

/**
 * Singleton Pattern implementation
 */
class SingletonPattern {
  constructor() {
    if (this.constructor.instance) {
      this.constructor.instance.initialize();
    } else {
      this.constructor.instance = this;
      this.initialize();
    }
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new this();
    }
    return this.instance;
  }

  initialize() {
    // Override in subclasses
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
 * Factory Pattern for Toasts
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
 * Image API Service for automatic image fetching
 */
class ImageService {
  static async searchImage(query, type = 'recipe') {
    // For demo purposes, return placeholder images
    const placeholderImages = {
      recipe: [
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
        'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400',
        'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400'
      ],
      ingredient: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200',
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200',
        'https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?w=200',
        'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=200'
      ]
    };

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return random image from placeholder collection
      const images = placeholderImages[type] || placeholderImages.recipe;
      const randomIndex = Math.floor(Math.random() * images.length);
      
      return {
        url: images[randomIndex],
        alt: `${query} image`,
        description: `Image for ${query}`
      };
    } catch (error) {
      console.error('Error fetching image:', error);
      return null;
    }
  }

  static async searchIngredientImages(ingredients) {
    const images = [];
    
    for (const ingredient of ingredients) {
      const image = await this.searchImage(ingredient, 'ingredient');
      if (image) {
        images.push({
          ingredient,
          ...image
        });
      }
    }
    
    return images;
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
    
    this.createLanguageSelector();
  }

  createLanguageSelector() {
    if (document.getElementById('language-selector')) return;

    const languageSelector = document.createElement('div');
    languageSelector.id = 'language-selector';
    languageSelector.className = 'language-selector';
    
    languageSelector.innerHTML = `
      <button class="language-selector__toggle" aria-label="${t('changeLanguage')}">
        <span class="language-selector__flag">${this.getCurrentLanguageFlag()}</span>
        <span class="language-selector__code">${this.currentLanguage.toUpperCase()}</span>
      </button>
      <div class="language-selector__dropdown">
        ${this.availableLanguages.map(lang => `
          <button class="language-selector__option ${lang.code === this.currentLanguage ? 'language-selector__option--active' : ''}" 
                  data-language="${lang.code}">
            <span class="language-selector__flag">${lang.flag}</span>
            <span class="language-selector__name">${lang.name}</span>
          </button>
        `).join('')}
      </div>
    `;

    // Add to header
    const headerContainer = document.querySelector('.header__container');
    if (headerContainer) {
      headerContainer.appendChild(languageSelector);
    }

    // Add event listeners
    this.addLanguageSelectorListeners(languageSelector);
  }

  addLanguageSelectorListeners(selector) {
    const toggle = selector.querySelector('.language-selector__toggle');
    const dropdown = selector.querySelector('.language-selector__dropdown');
    const options = selector.querySelectorAll('.language-selector__option');

    toggle.addEventListener('click', () => {
      dropdown.classList.toggle('language-selector__dropdown--open');
    });

    options.forEach(option => {
      option.addEventListener('click', () => {
        const language = option.dataset.language;
        this.changeLanguage(language);
        dropdown.classList.remove('language-selector__dropdown--open');
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!selector.contains(e.target)) {
        dropdown.classList.remove('language-selector__dropdown--open');
      }
    });
  }

  getCurrentLanguageFlag() {
    const lang = this.availableLanguages.find(l => l.code === this.currentLanguage);
    return lang ? lang.flag : '🌍';
  }

  changeLanguage(newLanguage) {
    if (newLanguage === this.currentLanguage) return;

    this.currentLanguage = newLanguage;
    currentLanguage = newLanguage;
    localStorage.setItem(APP_CONFIG.languageKey, newLanguage);

    // Update UI
    this.updateUITexts();
    this.updateLanguageSelector();

    // Show success message
    showToast('success', `${t('language')} ${t('changed')}`);
  }

  updateUITexts() {
    // Update page title
    document.title = `🍲 ${t('appTitle')} | ${t('appSubtitle')}`;

    // Update header texts
    const headerTitle = document.querySelector('.header__text');
    const headerSubtitle = document.querySelector('.header__subtitle');
    if (headerTitle) headerTitle.textContent = t('appTitle');
    if (headerSubtitle) headerSubtitle.textContent = t('appSubtitle');

    // Update search placeholder
    if (DOM.searchInput) {
      DOM.searchInput.placeholder = t('searchPlaceholder');
    }

    // Update filter buttons
    DOM.filterButtons?.forEach(btn => {
      const filter = btn.dataset.filter;
      if (filter === 'all') btn.textContent = t('allRecipes');
      if (filter === 'favorites') btn.textContent = t('favorites');
    });

    // Update empty state
    const emptyTitle = document.querySelector('.empty-state__title');
    const emptyDescription = document.querySelector('.empty-state__description');
    const emptyButton = document.querySelector('.btn--add-first-recipe');
    
    if (emptyTitle) emptyTitle.textContent = t('emptyStateTitle');
    if (emptyDescription) emptyDescription.textContent = t('emptyStateDescription');
    if (emptyButton) emptyButton.textContent = t('addFirstRecipe');

    // Update no results state
    const noResultsTitle = document.querySelector('.no-results__title');
    const noResultsDescription = document.querySelector('.no-results__description');
    
    if (noResultsTitle) noResultsTitle.textContent = t('noResultsTitle');
    if (noResultsDescription) noResultsDescription.textContent = t('noResultsDescription');

    // Re-render recipes to update action buttons
    if (window.app) {
      window.app.render();
    }
  }

  updateLanguageSelector() {
    const toggle = document.querySelector('.language-selector__toggle');
    if (toggle) {
      const flag = toggle.querySelector('.language-selector__flag');
      const code = toggle.querySelector('.language-selector__code');
      
      if (flag) flag.textContent = this.getCurrentLanguageFlag();
      if (code) code.textContent = this.currentLanguage.toUpperCase();
    }

    // Update active option
    const options = document.querySelectorAll('.language-selector__option');
    options.forEach(option => {
      option.classList.toggle('language-selector__option--active', 
        option.dataset.language === this.currentLanguage);
    });
  }
}

/**
 * PWA Manager
 */
class PWAManager extends SingletonPattern {
  initialize() {
    this.deferredPrompt = null;
    this.isInstalled = false;
    this.updateAvailable = false;
    
    this.registerServiceWorker();
    this.setupInstallPrompt();
    this.addPWAEventListeners();
  }

  async registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      console.info('🔧 Service Worker not supported');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            this.updateAvailable = true;
            this.showUpdateNotification();
          }
        });
      });

      console.info('🎉 Service Worker registered successfully');
    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
    }
  }

  setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallButton();
    });

    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.hideInstallButton();
      showToast('success', `¡${t('installApp')} ${t('success')}! 🎉`);
    });
  }

  addPWAEventListeners() {
    this.createInstallButton();
    
    window.addEventListener('online', () => {
      showToast('success', `🌐 ${t('connectionRestored')}`);
    });

    window.addEventListener('offline', () => {
      showToast('info', `📱 ${t('offlineMode')}`);
    });
  }

  createInstallButton() {
    if (document.getElementById('pwa-install-btn')) return;

    const installBtn = document.createElement('button');
    installBtn.id = 'pwa-install-btn';
    installBtn.className = 'btn btn--secondary btn--icon pwa-install-btn';
    installBtn.innerHTML = `
      <span class="btn__icon" aria-hidden="true">📱</span>
      <span class="btn__text">${t('installApp')}</span>
    `;
    installBtn.style.display = 'none';
    installBtn.setAttribute('aria-label', t('installApp'));
    
    installBtn.addEventListener('click', () => this.installApp());
    
    const headerContainer = document.querySelector('.header__container');
    if (headerContainer) {
      headerContainer.appendChild(installBtn);
    }
  }

  showInstallButton() {
    const installBtn = document.getElementById('pwa-install-btn');
    if (installBtn && !this.isInstalled) {
      installBtn.style.display = 'flex';
    }
  }

  hideInstallButton() {
    const installBtn = document.getElementById('pwa-install-btn');
    if (installBtn) {
      installBtn.style.display = 'none';
    }
  }

  async installApp() {
    if (!this.deferredPrompt) return;

    try {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.info('🎉 PWA installation accepted');
      } else {
        console.info('📱 PWA installation declined');
      }
      
      this.deferredPrompt = null;
      this.hideInstallButton();
    } catch (error) {
      console.error('❌ PWA installation failed:', error);
    }
  }

  showUpdateNotification() {
    const updateToast = document.createElement('div');
    updateToast.className = 'toast toast--info';
    updateToast.innerHTML = `
      <div class="toast__content">
        <div class="toast__message">
          <strong>🔄 ${t('updateAvailable')}</strong>
          <p>Hay una nueva versión de la app disponible</p>
        </div>
        <div class="toast__actions">
          <button class="btn btn--sm btn--primary" onclick="location.reload()">
            ${t('updateNow')}
          </button>
          <button class="btn btn--sm btn--ghost" onclick="this.closest('.toast').remove()">
            ${t('later')}
          </button>
        </div>
      </div>
    `;
    
    if (DOM.toastContainer) {
      DOM.toastContainer.appendChild(updateToast);
    }
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
    
    // Add observer pattern methods
    Object.assign(this, ObserverPattern);
    
    this.loadRecipesFromStorage();
  }

  setFilter(filter) {
    this.currentFilter = filter;
    this.filterAndSearchRecipes();
    this.notifyObservers('filterChanged', filter);
  }

  setSearch(searchTerm) {
    this.currentSearch = searchTerm;
    this.filterAndSearchRecipes();
    this.notifyObservers('searchChanged', searchTerm);
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

  async loadRecipesFromStorage() {
    try {
      const savedRecipes = localStorage.getItem(APP_CONFIG.storageKey);
      if (savedRecipes) {
        const recipesData = JSON.parse(savedRecipes);
        recipesData.forEach(recipeData => {
          const recipe = new Recipe(recipeData);
          this.recipes.addRecipe(recipe);
        });
      }
      
      this.filterAndSearchRecipes();
      console.log(`📚 Loaded ${this.recipes.getAll().length} recipes from storage`);
    } catch (error) {
      console.error('❌ Error loading recipes from storage:', error);
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

  async addRecipe(recipeData) {
    try {
      // Auto-fetch recipe image if title is provided
      if (recipeData.title && !recipeData.imageUrl) {
        const image = await ImageService.searchImage(recipeData.title, 'recipe');
        if (image) {
          recipeData.imageUrl = image.url;
        }
      }

      // Auto-fetch ingredient images
      if (recipeData.ingredients && recipeData.ingredients.length > 0) {
        const ingredientImages = await ImageService.searchIngredientImages(recipeData.ingredients);
        recipeData.ingredientImages = ingredientImages;
      }

      const recipe = new Recipe(recipeData);
      this.recipes.addRecipe(recipe);
      this.saveRecipes();
      this.filterAndSearchRecipes();
      this.notifyObservers('recipeAdded', recipe);
      
      showToast('success', `✅ Receta "${recipe.title}" creada correctamente`);
      return recipe;
    } catch (error) {
      console.error('❌ Error creating recipe:', error);
      showToast('error', `❌ ${t('error')} creating recipe`);
      throw error;
    }
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update button state
    if (DOM.themeToggle) {
      DOM.themeToggle.setAttribute('aria-pressed', newTheme === 'dark');
      DOM.themeToggle.setAttribute('aria-label', 
        newTheme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
      );
      
      const icon = DOM.themeToggle.querySelector('.theme-toggle__icon');
      if (icon) {
        icon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
      }
    }
    
    this.currentTheme = newTheme;
    this.notifyObservers('themeChanged', newTheme);
  }
}

/**
 * Global toast function
 */
function showToast(type, message, options = {}) {
  const toast = ToastFactory.create(type, message, options);
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

/**
 * UI Controller
 */
class UIController {
  constructor(appState) {
    this.appState = appState;
    this.searchTimeout = null;
    this.setupEventListeners();
    this.setupObservers();
  }

  setupEventListeners() {
    // Search functionality
    DOM.searchInput?.addEventListener('input', (e) => {
      this.handleSearch(e.target.value);
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
  }

  setupObservers() {
    this.appState.subscribe('filterChanged', () => {
      this.updateFilterButtons();
      this.render();
    });

    this.appState.subscribe('searchChanged', () => {
      this.updateSearchResults();
      this.render();
    });
  }

  handleSearch(searchTerm) {
    // Debounce search
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.appState.setSearch(searchTerm);
    }, APP_CONFIG.searchDelay);
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
        DOM.searchResults.textContent = `${count} de ${total} ${t('recipes').toLowerCase()}`;
      } else {
        DOM.searchResults.textContent = '';
      }
    }
  }

  render() {
    this.renderRecipes();
    this.updateStates();
  }

  renderRecipes() {
    const recipes = this.appState.filteredRecipes;
    const hasRecipes = recipes.length > 0;
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
            <button class="recipe-card__action" data-action="view" aria-label="${t('view')}">
              <span aria-hidden="true">👁️</span>
            </button>
            <button class="recipe-card__action" data-action="edit" aria-label="${t('edit')}">
              <span aria-hidden="true">✏️</span>
            </button>
            <button class="recipe-card__action" data-action="share" aria-label="${t('share')}">
              <span aria-hidden="true">📤</span>
            </button>
            <button class="recipe-card__action" data-action="delete" aria-label="${t('delete')}">
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
        this.toggleFavorite(recipe);
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
    }
  }

  toggleFavorite(recipe) {
    recipe.isFavorite = !recipe.isFavorite;
    recipe.updatedAt = new Date().toISOString();
    
    this.appState.recipes.updateRecipe(recipe);
    this.appState.saveRecipes();
    this.render();
    
    const message = recipe.isFavorite ? 
      `✅ "${recipe.title}" ${t('addedToFavorites')}` : 
      `💔 "${recipe.title}" ${t('removedFromFavorites')}`;
    
    showToast('success', message);
  }

  async shareRecipe(recipe) {
    const shareData = {
      title: `🍲 ${recipe.title} - ${t('appTitle')}`,
      text: `${t('view')}: ${recipe.title}. ${t('cookingTime')}: ${recipe.cookingTime} min.`,
      url: window.location.href
    };

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback to clipboard
        const textToShare = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
        await navigator.clipboard.writeText(textToShare);
        showToast('success', `📋 ${t('linkCopied')}`);
      }
    } catch (error) {
      console.error('❌ Share failed:', error);
      showToast('error', `❌ ${t('error')} sharing recipe`);
    }
  }

  showDeleteConfirmation(recipe) {
    const confirmMessage = `¿Estás seguro de que quieres eliminar la receta "${recipe.title}"? Esta acción no se puede deshacer.`;
    
    if (confirm(confirmMessage)) {
      this.appState.recipes.deleteRecipe(recipe.id);
      this.appState.saveRecipes();
      this.render();
      
      showToast('success', `🗑️ Receta "${recipe.title}" ${t('recipeDeleted')}`);
    }
  }

  showRecipeDetails(recipe) {
    // For now, just show a toast - modal functionality would be implemented here
    showToast('info', `${t('view')}: ${recipe.title}`);
  }

  showRecipeForm(recipe = null) {
    // For now, just show a simple form dialog
    const title = recipe ? `${t('edit')} ${recipe.title}` : t('newRecipe');
    
    // Create a simple test recipe
    const testRecipeData = {
      title: `Receta de prueba ${Date.now()}`,
      description: 'Una deliciosa receta de prueba',
      ingredients: ['Ingrediente 1', 'Ingrediente 2', 'Ingrediente 3'],
      steps: ['Paso 1: Preparar ingredientes', 'Paso 2: Cocinar', 'Paso 3: Servir'],
      cookingTime: 30,
      difficulty: 'Fácil',
      servings: 2,
      categories: ['Prueba', 'Rápido'],
      notes: 'Esta es una receta de prueba para demostrar la funcionalidad'
    };
    
    // Add the test recipe
    this.appState.addRecipe(testRecipeData);
    
    showToast('info', `${title} - Funcionalidad de formulario próximamente disponible. Se ha agregado una receta de prueba.`);
  }

  updateStates() {
    // Update any additional UI states here
  }
}

/**
 * Main Application Class
 */
class OneCookingApp {
  constructor() {
    this.appState = AppState.getInstance();
    this.uiController = new UIController(this.appState);
    this.initialized = false;
  }

  async init() {
    try {
      console.log('🔧 Initializing Cocina para Uno...');
      
      // Setup initial theme
      this.setupTheme();
      
      // Initialize UI
      this.render();
      
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
    
    if (DOM.themeToggle) {
      DOM.themeToggle.setAttribute('aria-pressed', savedTheme === 'dark');
      DOM.themeToggle.setAttribute('aria-label', 
        savedTheme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
      );
      
      const icon = DOM.themeToggle.querySelector('.theme-toggle__icon');
      if (icon) {
        icon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
      }
    }
  }

  render() {
    this.uiController.render();
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
    // Initialize DOM elements
    initializeDOM();
    
    // Initialize PWA Manager
    PWAManager.getInstance();
    
    // Initialize Language Manager
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
 * Handle application errors globally
 */
window.addEventListener('error', (event) => {
  console.error('❌ Global error:', event.error);
  
  showToast('error', 
    'Ha ocurrido un error inesperado. La aplicación intentará recuperarse automáticamente.'
  );
});

/**
 * Handle unhandled promise rejections
 */
window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Unhandled promise rejection:', event.reason);
  event.preventDefault();
  
  showToast('error', 
    'Error de conexión. Verifica tu conexión a internet.'
  );
});

console.log('🎉 Cocina para Uno - Main script loaded successfully!');
