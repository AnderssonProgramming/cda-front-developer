/**
 * COCINA PARA UNO - MAIN APPLICATION
 * Main JavaScript file that orchestrates the application
 * Author: CDA Front Developer
 * Date: 2024
 * Version: 2.0.0 - Enhanced with PWA capabilities
 */

// Import dependencies from other modules
import { Recipe, RecipeCollection } from './objects.js';
import { ObserverPattern, SingletonPattern, FactoryPattern } from './patterns.js';

/**
 * Application Configuration - Enhanced
 */
const APP_CONFIG = {
  version: '2.0.0',
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
    cacheVersion: 'v2.0.0'
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
  }
};

/**
 * Enhanced Performance Utilities
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

  static async loadImageOptimized(src, placeholder = null) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      if (placeholder) {
        img.src = placeholder;
      }
      
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      
      // Use Intersection Observer for lazy loading
      if (APP_CONFIG.features.intersectionObserver) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              img.src = src;
              observer.disconnect();
            }
          });
        });
        
        // Start observing when image element is added to DOM
        if (img.parentElement) {
          observer.observe(img);
        } else {
          img.src = src; // Fallback
        }
      } else {
        img.src = src;
      }
    });
  }

  static measurePerformance(name, fn) {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(`${name}-start`);
      const result = fn();
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
      return result;
    }
    return fn();
  }
}

/**
 * PWA Manager for Service Worker and App Install
 */
class PWAManager extends SingletonPattern {
  initialize() {
    this.deferredPrompt = null;
    this.isInstalled = false;
    this.updateAvailable = false;
    
    this.registerServiceWorker();
    this.setupInstallPrompt();
    this.setupUpdatePrompt();
    this.addPWAEventListeners();
  }

  async registerServiceWorker() {
    if (!('serviceWorker' in navigator) || !APP_CONFIG.pwa.enabled) {
      console.info('🔧 Service Worker not supported or disabled');
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
      this.showToast('¡App instalada exitosamente! 🎉', 'success');
    });
  }

  setupUpdatePrompt() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
          this.showUpdateNotification();
        }
      });
    }
  }

  addPWAEventListeners() {
    // Add install button if not already present
    this.createInstallButton();
    
    // Listen for offline/online events
    window.addEventListener('online', () => {
      this.showToast('🌐 Conexión restaurada', 'success');
    });

    window.addEventListener('offline', () => {
      this.showToast('📱 Modo sin conexión activado', 'info');
    });
  }

  createInstallButton() {
    if (document.getElementById('pwa-install-btn')) return;

    const installBtn = document.createElement('button');
    installBtn.id = 'pwa-install-btn';
    installBtn.className = 'btn btn--secondary btn--icon pwa-install-btn';
    installBtn.innerHTML = `
      <span class="btn__icon" aria-hidden="true">📱</span>
      <span class="btn__text">Instalar App</span>
    `;
    installBtn.style.display = 'none';
    installBtn.setAttribute('aria-label', 'Instalar aplicación');
    
    installBtn.addEventListener('click', () => this.installApp());
    
    // Add to header actions
    const headerActions = document.querySelector('.header__actions');
    if (headerActions) {
      headerActions.appendChild(installBtn);
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
          <strong>🔄 Actualización disponible</strong>
          <p>Hay una nueva versión de la app disponible</p>
        </div>
        <div class="toast__actions">
          <button class="btn btn--sm btn--primary" onclick="location.reload()">
            Actualizar ahora
          </button>
          <button class="btn btn--sm btn--ghost" onclick="this.closest('.toast').remove()">
            Más tarde
          </button>
        </div>
      </div>
    `;
    
    const toastContainer = document.getElementById('toast-container');
    if (toastContainer) {
      toastContainer.appendChild(updateToast);
    }
  }

  showToast(message, type = 'info') {
    const toast = ToastFactory.create(type, message);
    const toastContainer = document.getElementById('toast-container');
    if (toastContainer) {
      toastContainer.appendChild(toast);
      
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
 * Enhanced Recipe Sharing with Web Share API
 */
class RecipeSharer {
  static async shareRecipe(recipe) {
    const shareData = {
      title: `🍲 ${recipe.title} - Cocina para Uno`,
      text: `Descubre esta deliciosa receta: ${recipe.title}. Tiempo de preparación: ${recipe.cookingTime} minutos.`,
      url: window.location.href
    };

    try {
      if (APP_CONFIG.features.webShare && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        console.info('✅ Recipe shared successfully');
        return true;
      } else {
        // Fallback to clipboard
        await this.copyToClipboard(shareData);
        return true;
      }
    } catch (error) {
      console.error('❌ Share failed:', error);
      return false;
    }
  }

  static async copyToClipboard(shareData) {
    const textToShare = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
    
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(textToShare);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = textToShare;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      
      // Show success toast
      PWAManager.getInstance().showToast('📋 Enlace copiado al portapapeles', 'success');
    } catch (error) {
      console.error('❌ Clipboard copy failed:', error);
      throw error;
    }
  }
}

/**
 * Enhanced Toast Factory with more types and animations
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

// Continue with the original DOM elements cache and state management...

/**
 * DOM Elements Cache
 */
const DOM = {
  // Loading
  loadingScreen: document.getElementById('loadingScreen'),
  
  // Header elements
  searchInput: document.getElementById('searchInput'),
  searchClear: document.getElementById('searchClear'),
  searchResults: document.getElementById('searchResults'),
  themeToggle: document.getElementById('themeToggle'),
  
  // Navigation filters
  filterAll: document.getElementById('filterAll'),
  filterBreakfast: document.getElementById('filterBreakfast'),
  filterLunch: document.getElementById('filterLunch'),
  filterDinner: document.getElementById('filterDinner'),
  filterDessert: document.getElementById('filterDessert'),
  filterVegetarian: document.getElementById('filterVegetarian'),
  filterQuick: document.getElementById('filterQuick'),
  
  // Main content
  totalRecipes: document.getElementById('totalRecipes'),
  totalFavorites: document.getElementById('totalFavorites'),
  totalCategories: document.getElementById('totalCategories'),
  recipesGrid: document.getElementById('recipesGrid'),
  emptyState: document.getElementById('emptyState'),
  noResults: document.getElementById('noResults'),
  addRecipeBtn: document.getElementById('addRecipeBtn'),
  
  // Modals
  recipeModal: document.getElementById('recipeModal'),
  recipeModalBackdrop: document.getElementById('recipeModalBackdrop'),
  recipeModalClose: document.getElementById('recipeModalClose'),
  
  addRecipeModal: document.getElementById('addRecipeModal'),
  addRecipeModalBackdrop: document.getElementById('addRecipeModalBackdrop'),
  addRecipeModalClose: document.getElementById('addRecipeModalClose'),
  
  // Forms
  recipeForm: document.getElementById('recipeForm'),
  
  // Toast container
  toastContainer: document.getElementById('toastContainer')
};

/**
 * Application State Management (Singleton Pattern)
 */
class AppState extends SingletonPattern {
  constructor() {
    super();
    this.currentFilter = 'all';
    this.currentSearch = '';
    this.currentTheme = localStorage.getItem('theme') || 'light';
    this.recipes = new RecipeCollection();
    this.filteredRecipes = [];
    this.favoriteRecipes = [];
    this.isLoading = false;
    this.activeModal = null;
    this.searchTimeout = null;
  }

  // State management methods
  setFilter(filter) {
    this.currentFilter = filter;
    this.filterAndSearchRecipes();
    this.notifyObservers('filterChanged', filter);
  }

  setSearch(search) {
    this.currentSearch = search.toLowerCase().trim();
    
    // Debounce search
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.filterAndSearchRecipes();
      this.notifyObservers('searchChanged', search);
    }, APP_CONFIG.searchDelay);
  }

  setTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.notifyObservers('themeChanged', theme);
  }

  addRecipe(recipeData) {
    const recipe = new Recipe(recipeData);
    this.recipes.add(recipe);
    this.saveToStorage();
    this.filterAndSearchRecipes();
    this.notifyObservers('recipeAdded', recipe);
    return recipe;
  }

  updateRecipe(id, recipeData) {
    const recipe = this.recipes.update(id, recipeData);
    if (recipe) {
      this.saveToStorage();
      this.filterAndSearchRecipes();
      this.notifyObservers('recipeUpdated', recipe);
    }
    return recipe;
  }

  deleteRecipe(id) {
    const recipe = this.recipes.delete(id);
    if (recipe) {
      this.saveToStorage();
      this.filterAndSearchRecipes();
      this.notifyObservers('recipeDeleted', recipe);
    }
    return recipe;
  }

  toggleFavorite(id) {
    const recipe = this.recipes.get(id);
    if (recipe) {
      recipe.toggleFavorite();
      this.saveToStorage();
      this.updateFavoritesList();
      this.notifyObservers('favoriteToggled', recipe);
    }
    return recipe;
  }

  filterAndSearchRecipes() {
    let filtered = this.recipes.getAll();

    // Apply category filter
    if (this.currentFilter !== 'all') {
      filtered = filtered.filter(recipe => {
        if (this.currentFilter === 'favorites') {
          return recipe.isFavorite;
        }
        return recipe.categories.includes(this.currentFilter);
      });
    }

    // Apply search filter
    if (this.currentSearch) {
      filtered = filtered.filter(recipe => {
        return recipe.title.toLowerCase().includes(this.currentSearch) ||
               recipe.description.toLowerCase().includes(this.currentSearch) ||
               recipe.ingredients.some(ingredient => 
                 ingredient.toLowerCase().includes(this.currentSearch)
               ) ||
               recipe.categories.some(category => 
                 category.toLowerCase().includes(this.currentSearch)
               );
      });
    }

    this.filteredRecipes = filtered;
    this.updateFavoritesList();
    this.updateStatistics();
  }

  updateFavoritesList() {
    this.favoriteRecipes = this.recipes.getAll().filter(recipe => recipe.isFavorite);
  }

  updateStatistics() {
    const stats = {
      total: this.recipes.getAll().length,
      favorites: this.favoriteRecipes.length,
      categories: this.recipes.getUniqueCategories().length,
      filtered: this.filteredRecipes.length
    };
    this.notifyObservers('statisticsUpdated', stats);
  }

  saveToStorage() {
    try {
      const data = {
        recipes: this.recipes.getAll().map(recipe => recipe.toJSON()),
        version: APP_CONFIG.version,
        timestamp: Date.now()
      };
      localStorage.setItem(APP_CONFIG.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      this.showToast('Error guardando los datos', 'error');
    }
  }

  loadFromStorage() {
    try {
      const data = localStorage.getItem(APP_CONFIG.storageKey);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.recipes && Array.isArray(parsed.recipes)) {
          parsed.recipes.forEach(recipeData => {
            const recipe = new Recipe(recipeData);
            this.recipes.add(recipe);
          });
          this.filterAndSearchRecipes();
          this.notifyObservers('dataLoaded', parsed);
        }
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      this.showToast('Error cargando los datos', 'error');
    }
  }

  showToast(message, type = 'info', duration = APP_CONFIG.toastDuration) {
    this.notifyObservers('toastRequested', { message, type, duration });
  }
}

/**
 * UI Controller Class
 */
class UIController extends ObserverPattern {
  constructor() {
    super();
    this.appState = AppState.getInstance();
    this.toastFactory = new FactoryPattern();
    this.setupObservers();
    this.bindEvents();
  }

  setupObservers() {
    // Subscribe to app state changes
    this.appState.subscribe('filterChanged', this.handleFilterChange.bind(this));
    this.appState.subscribe('searchChanged', this.handleSearchChange.bind(this));
    this.appState.subscribe('themeChanged', this.handleThemeChange.bind(this));
    this.appState.subscribe('recipeAdded', this.handleRecipeAdded.bind(this));
    this.appState.subscribe('recipeUpdated', this.handleRecipeUpdated.bind(this));
    this.appState.subscribe('recipeDeleted', this.handleRecipeDeleted.bind(this));
    this.appState.subscribe('favoriteToggled', this.handleFavoriteToggled.bind(this));
    this.appState.subscribe('statisticsUpdated', this.handleStatisticsUpdated.bind(this));
    this.appState.subscribe('dataLoaded', this.handleDataLoaded.bind(this));
    this.appState.subscribe('toastRequested', this.handleToastRequested.bind(this));
  }

  bindEvents() {
    // Search functionality
    if (DOM.searchInput) {
      DOM.searchInput.addEventListener('input', this.handleSearchInput.bind(this));
      DOM.searchInput.addEventListener('keydown', this.handleSearchKeydown.bind(this));
    }

    if (DOM.searchClear) {
      DOM.searchClear.addEventListener('click', this.clearSearch.bind(this));
    }

    // Theme toggle
    if (DOM.themeToggle) {
      DOM.themeToggle.addEventListener('click', this.toggleTheme.bind(this));
    }

    // Filter buttons
    const filterButtons = [
      { element: DOM.filterAll, filter: 'all' },
      { element: DOM.filterBreakfast, filter: 'breakfast' },
      { element: DOM.filterLunch, filter: 'lunch' },
      { element: DOM.filterDinner, filter: 'dinner' },
      { element: DOM.filterDessert, filter: 'dessert' },
      { element: DOM.filterVegetarian, filter: 'vegetarian' },
      { element: DOM.filterQuick, filter: 'quick' }
    ];

    filterButtons.forEach(({ element, filter }) => {
      if (element) {
        element.addEventListener('click', () => this.setActiveFilter(filter));
      }
    });

    // Add recipe button
    if (DOM.addRecipeBtn) {
      DOM.addRecipeBtn.addEventListener('click', this.openAddRecipeModal.bind(this));
    }

    // Modal events
    this.bindModalEvents();

    // Form events
    this.bindFormEvents();

    // Global keyboard events
    document.addEventListener('keydown', this.handleGlobalKeydown.bind(this));
  }

  bindModalEvents() {
    // Recipe detail modal
    if (DOM.recipeModalBackdrop) {
      DOM.recipeModalBackdrop.addEventListener('click', this.closeRecipeModal.bind(this));
    }
    if (DOM.recipeModalClose) {
      DOM.recipeModalClose.addEventListener('click', this.closeRecipeModal.bind(this));
    }

    // Add recipe modal
    if (DOM.addRecipeModalBackdrop) {
      DOM.addRecipeModalBackdrop.addEventListener('click', this.closeAddRecipeModal.bind(this));
    }
    if (DOM.addRecipeModalClose) {
      DOM.addRecipeModalClose.addEventListener('click', this.closeAddRecipeModal.bind(this));
    }
  }

  bindFormEvents() {
    if (DOM.recipeForm) {
      DOM.recipeForm.addEventListener('submit', this.handleFormSubmit.bind(this));
      
      // Dynamic ingredient list
      this.setupDynamicList('ingredients');
      
      // Dynamic steps list
      this.setupDynamicList('steps');
      
      // Categories input
      this.setupCategoriesInput();
      
      // Image upload
      this.setupImageUpload();
    }
  }

  // Event Handlers
  handleSearchInput(event) {
    const query = event.target.value;
    this.appState.setSearch(query);
    
    if (DOM.searchClear) {
      DOM.searchClear.style.display = query ? 'flex' : 'none';
    }
  }

  handleSearchKeydown(event) {
    if (event.key === 'Escape') {
      this.clearSearch();
    }
  }

  clearSearch() {
    if (DOM.searchInput) {
      DOM.searchInput.value = '';
      DOM.searchInput.focus();
    }
    if (DOM.searchClear) {
      DOM.searchClear.style.display = 'none';
    }
    this.appState.setSearch('');
  }

  toggleTheme() {
    const newTheme = this.appState.currentTheme === 'light' ? 'dark' : 'light';
    this.appState.setTheme(newTheme);
  }

  setActiveFilter(filter) {
    this.appState.setFilter(filter);
  }

  handleGlobalKeydown(event) {
    // Escape key closes modals
    if (event.key === 'Escape') {
      if (this.appState.activeModal) {
        this.closeActiveModal();
      }
    }
    
    // Ctrl+K focuses search
    if (event.ctrlKey && event.key === 'k') {
      event.preventDefault();
      if (DOM.searchInput) {
        DOM.searchInput.focus();
      }
    }
  }

  // State change handlers
  handleFilterChange(filter) {
    this.updateFilterButtons(filter);
    this.renderRecipes();
    this.updateSearchResults();
  }

  handleSearchChange(search) {
    this.renderRecipes();
    this.updateSearchResults();
  }

  handleThemeChange(theme) {
    this.updateThemeIcon(theme);
  }

  handleRecipeAdded(recipe) {
    this.renderRecipes();
    this.closeAddRecipeModal();
    this.appState.showToast('Receta agregada exitosamente', 'success');
  }

  handleRecipeUpdated(recipe) {
    this.renderRecipes();
    this.appState.showToast('Receta actualizada exitosamente', 'success');
  }

  handleRecipeDeleted(recipe) {
    this.renderRecipes();
    this.appState.showToast('Receta eliminada exitosamente', 'success');
  }

  handleFavoriteToggled(recipe) {
    this.updateRecipeCard(recipe);
  }

  handleStatisticsUpdated(stats) {
    this.updateStatistics(stats);
    this.updateFilterCounts();
  }

  handleDataLoaded(data) {
    this.renderRecipes();
    this.updateStatistics();
    console.log(`Loaded ${data.recipes.length} recipes from storage`);
  }

  handleToastRequested({ message, type, duration }) {
    this.showToast(message, type, duration);
  }

  // UI Update Methods
  updateFilterButtons(activeFilter) {
    const filterButtons = document.querySelectorAll('[data-filter]');
    filterButtons.forEach(button => {
      const filter = button.getAttribute('data-filter');
      if (filter === activeFilter) {
        button.classList.add('filter-btn--active');
        button.setAttribute('aria-pressed', 'true');
      } else {
        button.classList.remove('filter-btn--active');
        button.setAttribute('aria-pressed', 'false');
      }
    });
  }

  updateFilterCounts() {
    const allRecipes = this.appState.recipes.getAll();
    const categories = ['breakfast', 'lunch', 'dinner', 'dessert', 'vegetarian', 'quick'];
    
    categories.forEach(category => {
      const count = allRecipes.filter(recipe => recipe.categories.includes(category)).length;
      const countElement = document.querySelector(`[data-filter="${category}"] .filter-btn__count`);
      if (countElement) {
        countElement.textContent = count;
      }
    });
    
    // Update favorites count
    const favoritesCount = this.appState.favoriteRecipes.length;
    const favoritesCountElement = document.querySelector('[data-filter="favorites"] .filter-btn__count');
    if (favoritesCountElement) {
      favoritesCountElement.textContent = favoritesCount;
    }
  }

  updateThemeIcon(theme) {
    if (DOM.themeToggle) {
      DOM.themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
      DOM.themeToggle.setAttribute('aria-label', 
        theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'
      );
    }
  }

  updateStatistics(stats) {
    if (DOM.totalRecipes) {
      DOM.totalRecipes.textContent = stats?.total || 0;
    }
    if (DOM.totalFavorites) {
      DOM.totalFavorites.textContent = stats?.favorites || 0;
    }
    if (DOM.totalCategories) {
      DOM.totalCategories.textContent = stats?.categories || 0;
    }
  }

  updateSearchResults() {
    if (DOM.searchResults) {
      const count = this.appState.filteredRecipes.length;
      const total = this.appState.recipes.getAll().length;
      
      if (this.appState.currentSearch) {
        DOM.searchResults.textContent = `${count} de ${total} recetas encontradas`;
        DOM.searchResults.style.display = 'block';
      } else {
        DOM.searchResults.style.display = 'none';
      }
    }
  }

  // Recipe rendering
  renderRecipes() {
    if (!DOM.recipesGrid) return;

    const recipes = this.appState.filteredRecipes;
    
    // Show/hide empty states
    if (recipes.length === 0) {
      DOM.recipesGrid.style.display = 'none';
      
      if (this.appState.currentSearch || this.appState.currentFilter !== 'all') {
        if (DOM.noResults) DOM.noResults.style.display = 'block';
        if (DOM.emptyState) DOM.emptyState.style.display = 'none';
      } else {
        if (DOM.emptyState) DOM.emptyState.style.display = 'block';
        if (DOM.noResults) DOM.noResults.style.display = 'none';
      }
      return;
    }

    // Hide empty states and show grid
    if (DOM.emptyState) DOM.emptyState.style.display = 'none';
    if (DOM.noResults) DOM.noResults.style.display = 'none';
    DOM.recipesGrid.style.display = 'grid';

    // Render recipe cards
    DOM.recipesGrid.innerHTML = recipes.map(recipe => this.createRecipeCard(recipe)).join('');

    // Bind events to new cards
    this.bindRecipeCardEvents();
  }

  createRecipeCard(recipe) {
    const categoriesHtml = recipe.categories.map(cat => 
      `<span class="category-tag category-tag--${cat}">${this.capitalizeCategoryName(cat)}</span>`
    ).join('');

    return `
      <article class="recipe-card" data-recipe-id="${recipe.id}">
        <div class="recipe-card__image" ${recipe.imageUrl ? `style="background-image: url(${recipe.imageUrl})"` : ''}>
          ${recipe.imageUrl ? '' : '🍽️'}
        </div>
        <div class="recipe-card__content">
          <header class="recipe-card__header">
            <h3 class="recipe-card__title">${this.escapeHtml(recipe.title)}</h3>
            <button class="recipe-card__favorite ${recipe.isFavorite ? 'recipe-card__favorite--active' : ''}" 
                    data-recipe-id="${recipe.id}"
                    aria-label="${recipe.isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}">
              ${recipe.isFavorite ? '❤️' : '🤍'}
            </button>
          </header>
          
          <div class="recipe-card__meta">
            <span class="recipe-card__time">
              <span aria-hidden="true">⏱️</span>
              ${recipe.cookingTime} min
            </span>
            <span class="recipe-card__difficulty">
              Dificultad: ${recipe.difficulty}
            </span>
          </div>
          
          <div class="recipe-card__categories">
            ${categoriesHtml}
          </div>
          
          <p class="recipe-card__description">
            ${this.escapeHtml(recipe.description)}
          </p>
          
          <footer class="recipe-card__actions">
            <button class="recipe-card__action" data-action="view" data-recipe-id="${recipe.id}">
              Ver receta
            </button>
            <button class="recipe-card__action" data-action="edit" data-recipe-id="${recipe.id}">
              Editar
            </button>
            <button class="recipe-card__action" data-action="delete" data-recipe-id="${recipe.id}">
              Eliminar
            </button>
          </footer>
        </div>
      </article>
    `;
  }

  bindRecipeCardEvents() {
    // Recipe card clicks (for viewing)
    const recipeCards = document.querySelectorAll('.recipe-card');
    recipeCards.forEach(card => {
      card.addEventListener('click', this.handleRecipeCardClick.bind(this));
    });

    // Favorite buttons
    const favoriteButtons = document.querySelectorAll('.recipe-card__favorite');
    favoriteButtons.forEach(button => {
      button.addEventListener('click', this.handleFavoriteClick.bind(this));
    });

    // Action buttons
    const actionButtons = document.querySelectorAll('.recipe-card__action');
    actionButtons.forEach(button => {
      button.addEventListener('click', this.handleRecipeAction.bind(this));
    });
  }

  handleRecipeCardClick(event) {
    // Don't trigger if clicking on buttons
    if (event.target.closest('button')) return;
    
    const recipeId = event.currentTarget.getAttribute('data-recipe-id');
    const recipe = this.appState.recipes.get(recipeId);
    if (recipe) {
      this.openRecipeModal(recipe);
    }
  }

  handleFavoriteClick(event) {
    event.stopPropagation();
    const recipeId = event.target.getAttribute('data-recipe-id');
    this.appState.toggleFavorite(recipeId);
  }

  handleRecipeAction(event) {
    event.stopPropagation();
    const action = event.target.getAttribute('data-action');
    const recipeId = event.target.getAttribute('data-recipe-id');
    const recipe = this.appState.recipes.get(recipeId);

    if (!recipe) return;

    switch (action) {
      case 'view':
        this.openRecipeModal(recipe);
        break;
      case 'edit':
        this.openEditRecipeModal(recipe);
        break;
      case 'delete':
        this.confirmDeleteRecipe(recipe);
        break;
    }
  }

  // Modal methods will be implemented in the next section
  openRecipeModal(recipe) {
    // TODO: Implement recipe detail modal
    console.log('Opening recipe modal for:', recipe.title);
  }

  openAddRecipeModal() {
    // TODO: Implement add recipe modal
    console.log('Opening add recipe modal');
  }

  closeRecipeModal() {
    // TODO: Implement close recipe modal
    console.log('Closing recipe modal');
  }

  closeAddRecipeModal() {
    // TODO: Implement close add recipe modal
    console.log('Closing add recipe modal');
  }

  closeActiveModal() {
    // TODO: Implement close active modal
    console.log('Closing active modal');
  }

  // Utility methods
  capitalizeCategoryName(category) {
    const names = {
      breakfast: 'Desayuno',
      lunch: 'Almuerzo',
      dinner: 'Cena',
      dessert: 'Postre',
      vegetarian: 'Vegetariano',
      quick: 'Rápido'
    };
    return names[category] || category;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Toast notification system
  showToast(message, type = 'info', duration = APP_CONFIG.toastDuration) {
    if (!DOM.toastContainer) return;

    const toast = this.toastFactory.create('toast', {
      message,
      type,
      duration,
      onClose: (toastElement) => {
        toastElement.remove();
      }
    });

    DOM.toastContainer.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.classList.add('toast--show');
    });

    // Auto remove
    setTimeout(() => {
      toast.classList.remove('toast--show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.remove();
        }
      }, 300);
    }, duration);
  }

  // Form handling methods (basic structure)
  handleFormSubmit(event) {
    event.preventDefault();
    // TODO: Implement form submission
    console.log('Form submitted');
  }

  setupDynamicList(listType) {
    // TODO: Implement dynamic list functionality
    console.log(`Setting up dynamic list for: ${listType}`);
  }

  setupCategoriesInput() {
    // TODO: Implement categories input
    console.log('Setting up categories input');
  }

  setupImageUpload() {
    // TODO: Implement image upload
    console.log('Setting up image upload');
  }

  updateRecipeCard(recipe) {
    const card = document.querySelector(`[data-recipe-id="${recipe.id}"]`);
    if (card) {
      const favoriteButton = card.querySelector('.recipe-card__favorite');
      if (favoriteButton) {
        favoriteButton.textContent = recipe.isFavorite ? '❤️' : '🤍';
        favoriteButton.classList.toggle('recipe-card__favorite--active', recipe.isFavorite);
        favoriteButton.setAttribute('aria-label', 
          recipe.isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'
        );
      }
    }
  }

  confirmDeleteRecipe(recipe) {
    if (confirm(`¿Estás seguro de que quieres eliminar "${recipe.title}"?`)) {
      this.appState.deleteRecipe(recipe.id);
    }
  }
}

/**
 * Application Initialization
 */
class App {
  constructor() {
    this.appState = null;
    this.uiController = null;
    this.initializationPromise = null;
  }

  async initialize() {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this.performInitialization();
    return this.initializationPromise;
  }

  async performInitialization() {
    try {
      console.log('🍽️ Initializing Cocina para Uno...');

      // Initialize app state
      this.appState = AppState.getInstance();
      
      // Set initial theme
      this.appState.setTheme(this.appState.currentTheme);
      
      // Initialize UI controller
      this.uiController = new UIController();
      
      // Load data from storage
      this.appState.loadFromStorage();
      
      // Initial render
      this.uiController.renderRecipes();
      this.uiController.updateStatistics();
      
      // Hide loading screen
      this.hideLoadingScreen();
      
      console.log('✅ Application initialized successfully');
      
      // Show welcome toast if no recipes
      if (this.appState.recipes.getAll().length === 0) {
        setTimeout(() => {
          this.appState.showToast(
            '¡Bienvenido! Comienza agregando tu primera receta.', 
            'info', 
            5000
          );
        }, 1000);
      }

    } catch (error) {
      console.error('❌ Failed to initialize application:', error);
      this.showInitializationError(error);
    }
  }

  hideLoadingScreen() {
    if (DOM.loadingScreen) {
      DOM.loadingScreen.style.opacity = '0';
      setTimeout(() => {
        DOM.loadingScreen.style.display = 'none';
        DOM.loadingScreen.setAttribute('hidden', '');
      }, 300);
    }
  }

  showInitializationError(error) {
    if (DOM.loadingScreen) {
      DOM.loadingScreen.innerHTML = `
        <div class="loading-spinner">
          <div class="error-icon" style="font-size: 3rem; margin-bottom: 1rem;">❌</div>
          <p style="color: var(--color-error); font-weight: 600;">
            Error al inicializar la aplicación
          </p>
          <p style="color: var(--color-gray-600); font-size: 0.9rem; margin-top: 0.5rem;">
            ${error.message}
          </p>
          <button onclick="location.reload()" 
                  style="margin-top: 1rem; padding: 0.5rem 1rem; 
                         background: var(--color-primary); color: white; 
                         border: none; border-radius: 0.5rem; cursor: pointer;">
            Recargar página
          </button>
        </div>
      `;
    }
  }
}

/**
 * Export for module usage and global access
 */
const app = new App();

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  app.initialize();
});

// Make app globally accessible for debugging
window.CocinaApp = {
  app,
  AppState,
  UIController,
  APP_CONFIG,
  DOM
};

// Export for module usage
export { app as default, AppState, UIController, APP_CONFIG };