/**
 * COCINA PARA UNO - MAIN APPLICATION
 * Main JavaScript file that orchestrates the application
 * Author: CDA Front Developer
 * Date: 2024
 * Version: 2.0.0 - Enhanced with PWA capabilities
 */

// Import dependencies from other modules
import { Recipe, RecipeCollection } from './objects.js';
import { SingletonPattern, FactoryPattern } from './patterns.js';

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
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
        } catch (err) {
          console.warn('Fallback copy failed:', err);
        }
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
 * DOM Elements Cache - Updated for new HTML structure
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
  filtersContainer: document.querySelector('.filters'),
  
  // Main content
  statsTotal: document.querySelector('[data-stat="total"]'),
  statsFavorites: document.querySelector('[data-stat="favorites"]'),
  statsCategories: document.querySelector('[data-stat="categories"]'),
  recipesGrid: document.getElementById('recipes-grid'),
  emptyState: document.getElementById('empty-state'),
  noResults: document.getElementById('no-results'),
  
  // Buttons
  addRecipeBtn: document.querySelector('.btn--add-recipe'),
  addFirstRecipeBtn: document.querySelector('.btn--add-first-recipe'),
  clearSearchBtn: document.querySelector('.btn--clear-search'),
  
  // Modals
  recipeModal: document.getElementById('recipe-modal'),
  recipeFormModal: document.getElementById('recipe-form-modal'),
  
  // Forms
  recipeForm: document.getElementById('recipe-form'),
  
  // Toast container
  toastContainer: document.getElementById('toast-container')
};

/**
 * Enhanced Application State Management (Singleton Pattern)
 */
class AppState extends SingletonPattern {
  initialize() {
    this.currentFilter = 'all';
    this.currentSearch = '';
    this.currentTheme = localStorage.getItem('theme') || 'light';
    this.recipes = new RecipeCollection();
    this.filteredRecipes = [];
    this.favoriteRecipes = [];
    this.isLoading = false;
    this.activeModal = null;
    this.searchTimeout = null;
    this.observers = [];
    
    // Load initial data
    this.loadRecipesFromStorage();
    this.applyTheme();
  }

  // State management methods
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

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', this.currentTheme);
    this.applyTheme();
    this.notifyObservers('themeChanged', this.currentTheme);
  }

  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    const themeIcon = DOM.themeToggle?.querySelector('.theme-toggle__icon');
    if (themeIcon) {
      themeIcon.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
    }
    if (DOM.themeToggle) {
      DOM.themeToggle.setAttribute('aria-label', 
        this.currentTheme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'
      );
    }
  }

  addRecipe(recipe) {
    this.recipes.addRecipe(recipe);
    this.saveRecipesToStorage();
    this.filterAndSearchRecipes();
    this.notifyObservers('recipeAdded', recipe);
  }

  updateRecipe(id, updates) {
    this.recipes.updateRecipe(id, updates);
    this.saveRecipesToStorage();
    this.filterAndSearchRecipes();
    this.notifyObservers('recipeUpdated', { id, updates });
  }

  deleteRecipe(id) {
    const recipe = this.recipes.getRecipe(id);
    this.recipes.deleteRecipe(id);
    this.saveRecipesToStorage();
    this.filterAndSearchRecipes();
    this.notifyObservers('recipeDeleted', recipe);
  }

  toggleFavorite(id) {
    const recipe = this.recipes.getRecipe(id);
    if (recipe) {
      recipe.isFavorite = !recipe.isFavorite;
      this.saveRecipesToStorage();
      this.filterAndSearchRecipes();
      this.notifyObservers('favoriteToggled', recipe);
    }
  }

  filterAndSearchRecipes() {
    let filtered = this.recipes.getAllRecipes();

    // Apply search filter
    if (this.currentSearch.trim()) {
      filtered = this.recipes.searchRecipes(this.currentSearch);
    }

    // Apply category filter
    if (this.currentFilter !== 'all') {
      if (this.currentFilter === 'favorites') {
        filtered = filtered.filter(recipe => recipe.isFavorite);
      } else {
        filtered = filtered.filter(recipe => 
          recipe.categories.some(cat => 
            cat.toLowerCase() === this.currentFilter.toLowerCase()
          )
        );
      }
    }

    this.filteredRecipes = filtered;
    this.favoriteRecipes = this.recipes.getAllRecipes().filter(r => r.isFavorite);
    
    this.notifyObservers('recipesFiltered', this.filteredRecipes);
  }

  saveRecipesToStorage() {
    try {
      localStorage.setItem(APP_CONFIG.storageKey, JSON.stringify(this.recipes.getAllRecipes()));
    } catch (error) {
      console.error('❌ Error saving recipes to storage:', error);
    }
  }

  loadRecipesFromStorage() {
    try {
      const stored = localStorage.getItem(APP_CONFIG.storageKey);
      if (stored) {
        const recipes = JSON.parse(stored);
        recipes.forEach(recipeData => {
          this.recipes.addRecipe(new Recipe(recipeData));
        });
      }
      this.filterAndSearchRecipes();
    } catch (error) {
      console.error('❌ Error loading recipes from storage:', error);
    }
  }

  // Observer pattern methods
  addObserver(callback) {
    this.observers.push(callback);
  }

  removeObserver(callback) {
    this.observers = this.observers.filter(obs => obs !== callback);
  }

  notifyObservers(event, data) {
    this.observers.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('❌ Observer callback error:', error);
      }
    });
  }
}

/**
 * Enhanced UI Controller for DOM manipulation and events
 */
class UIController {
  constructor(appState) {
    this.appState = appState;
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
      this.clearSearch();
    });

    // Theme toggle
    DOM.themeToggle?.addEventListener('click', () => {
      this.appState.toggleTheme();
    });

    // Filter buttons
    DOM.filterButtons?.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.handleFilterClick(e.target.closest('.filter-btn'));
      });
    });

    // Add recipe buttons
    DOM.addRecipeBtn?.addEventListener('click', () => {
      this.openRecipeForm();
    });

    DOM.addFirstRecipeBtn?.addEventListener('click', () => {
      this.openRecipeForm();
    });

    // Clear search button
    DOM.clearSearchBtn?.addEventListener('click', () => {
      this.clearSearch();
    });

    // Modal close handlers
    document.addEventListener('click', (e) => {
      if (e.target.matches('.modal__backdrop, .modal__close')) {
        this.closeActiveModal();
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      this.handleKeyboardShortcuts(e);
    });

    // Recipe form submission
    DOM.recipeForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleRecipeSubmit(e);
    });
  }

  setupObservers() {
    this.appState.addObserver((event, data) => {
      switch (event) {
        case 'recipesFiltered':
          this.renderRecipes(data);
          this.updateStats();
          this.updateFilterCounts();
          break;
        case 'recipeAdded':
          this.showToast('✅ Receta agregada exitosamente', 'success');
          this.closeActiveModal();
          break;
        case 'recipeUpdated':
          this.showToast('✅ Receta actualizada exitosamente', 'success');
          break;
        case 'recipeDeleted':
          this.showToast('🗑️ Receta eliminada', 'info');
          break;
        case 'favoriteToggled':
          this.showToast(
            data.isFavorite ? '❤️ Agregado a favoritos' : '💔 Removido de favoritos',
            'info'
          );
          break;
        case 'searchChanged':
          this.updateSearchResults(data);
          break;
      }
    });
  }

  handleSearch(searchTerm) {
    this.appState.setSearch(searchTerm);
  }

  clearSearch() {
    DOM.searchInput.value = '';
    this.appState.setSearch('');
    this.toggleClearButton('');
    DOM.searchInput.focus();
  }

  toggleClearButton(value) {
    if (DOM.searchClear) {
      DOM.searchClear.hidden = !value.trim();
    }
  }

  handleFilterClick(button) {
    if (!button) return;

    // Update active state
    DOM.filterButtons?.forEach(btn => {
      btn.classList.remove('filter-btn--active');
      btn.setAttribute('aria-pressed', 'false');
    });

    button.classList.add('filter-btn--active');
    button.setAttribute('aria-pressed', 'true');

    // Apply filter
    const filter = button.dataset.filter;
    this.appState.setFilter(filter);
  }

  openRecipeForm(recipe = null) {
    const modal = DOM.recipeFormModal;
    if (!modal) return;

    // Populate form if editing
    if (recipe) {
      this.populateRecipeForm(recipe);
      modal.querySelector('.modal__title').textContent = 'Editar Receta';
    } else {
      this.resetRecipeForm();
      modal.querySelector('.modal__title').textContent = 'Nueva Receta';
    }

    modal.showModal();
    this.appState.activeModal = modal;
    
    // Focus first input
    const firstInput = modal.querySelector('input, textarea');
    firstInput?.focus();
  }

  closeActiveModal() {
    const modal = this.appState.activeModal;
    if (modal) {
      modal.close();
      this.appState.activeModal = null;
    }
  }

  populateRecipeForm(recipe) {
    // TODO: Implement form population for editing
  }

  resetRecipeForm() {
    DOM.recipeForm?.reset();
    // TODO: Reset dynamic lists and categories
  }

  handleRecipeSubmit(event) {
    const formData = new FormData(event.target);
    
    try {
      const recipeData = this.extractRecipeData(formData);
      const recipe = new Recipe(recipeData);
      this.appState.addRecipe(recipe);
    } catch (error) {
      console.error('❌ Error creating recipe:', error);
      this.showToast('❌ Error al guardar la receta', 'error');
    }
  }

  extractRecipeData(formData) {
    // Extract form data and create recipe object
    const name = formData.get('name')?.trim();
    const time = parseInt(formData.get('time'));
    
    if (!name || !time) {
      throw new Error('Nombre y tiempo son requeridos');
    }

    const ingredients = formData.getAll('ingredients[]')
      .filter(ing => ing.trim())
      .map(ing => ing.trim());

    const steps = formData.getAll('steps[]')
      .filter(step => step.trim())
      .map(step => step.trim());

    return {
      title: name,
      cookingTime: time,
      ingredients,
      steps,
      categories: [], // TODO: Extract from form
      imageUrl: '', // TODO: Handle image upload
    };
  }

  renderRecipes(recipes) {
    if (!DOM.recipesGrid) return;

    // Show/hide empty states
    const hasRecipes = recipes.length > 0;
    const hasSearchTerm = this.appState.currentSearch.trim();
    
    DOM.recipesGrid.style.display = hasRecipes ? 'grid' : 'none';
    
    if (DOM.emptyState) {
      DOM.emptyState.hidden = hasRecipes || hasSearchTerm;
    }
    
    if (DOM.noResults) {
      DOM.noResults.hidden = hasRecipes || !hasSearchTerm;
    }

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
  }