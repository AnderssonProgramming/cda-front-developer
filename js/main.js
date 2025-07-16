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
    if (!recipe || !DOM.recipeForm) return;
    
    // Populate basic fields
    const nameInput = DOM.recipeForm.querySelector('[name="name"]');
    const timeInput = DOM.recipeForm.querySelector('[name="time"]');
    
    if (nameInput) nameInput.value = recipe.title;
    if (timeInput) timeInput.value = recipe.cookingTime;
    
    // Update modal title
    const modalTitle = DOM.recipeFormModal?.querySelector('.modal__title');
    if (modalTitle) modalTitle.textContent = `Editar Receta: ${recipe.title}`;
  }

  resetRecipeForm() {
    DOM.recipeForm?.reset();
    
    // Reset modal title
    const modalTitle = DOM.recipeFormModal?.querySelector('.modal__title');
    if (modalTitle) modalTitle.textContent = 'Nueva Receta';
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
      categories: ['general'], // Default category
      imageUrl: '', // Will be implemented later
      description: `Deliciosa receta de ${name}`,
      difficulty: 'fácil',
      servings: 1
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

  attachRecipeCardListeners() {
    const recipeCards = DOM.recipesGrid?.querySelectorAll('.recipe-card');
    
    recipeCards?.forEach(card => {
      const recipeId = card.dataset.recipeId;
      const recipe = this.appState.recipes.get(recipeId);
      
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
        this.openRecipeForm(recipe);
        break;
      case 'share':
        RecipeSharer.shareRecipe(recipe);
        break;
      case 'delete':
        this.showDeleteConfirmation(recipe);
        break;
      default:
        console.warn('Unknown recipe action:', actionType);
    }
  }

  toggleFavorite(recipe) {
    this.appState.toggleFavorite(recipe.id);
    this.renderRecipes(this.appState.filteredRecipes);
    
    const message = recipe.isFavorite ? 
      `✅ "${recipe.title}" agregada a favoritos` : 
      `💔 "${recipe.title}" quitada de favoritos`;
    
    this.showToast(message, 'success');
  }

  showRecipeDetails(recipe) {
    const modal = DOM.recipeModal;
    if (!modal) return;
    
    modal.innerHTML = `
      <div class="modal__backdrop" aria-hidden="true"></div>
      <div class="modal__container">
        <div class="modal__content">
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
                  <h3 class="recipe-section__title">Ingredientes</h3>
                  <ul class="recipe-ingredients">
                    ${recipe.ingredients.map(ingredient => `
                      <li class="recipe-ingredient">${ingredient}</li>
                    `).join('')}
                  </ul>
                </section>
                
                <section class="recipe-section">
                  <h3 class="recipe-section__title">Preparación</h3>
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
                    <h3 class="recipe-section__title">Notas</h3>
                    <p class="recipe-notes">${recipe.notes}</p>
                  </section>
                ` : ''}
              </div>
            </div>
          </div>
          
          <footer class="modal__footer">
            <button type="button" class="btn btn--secondary modal__close">
              Cerrar
            </button>
            <button type="button" class="btn btn--primary" data-action="share">
              <span class="btn__icon" aria-hidden="true">📤</span>
              <span class="btn__text">Compartir</span>
            </button>
          </footer>
        </div>
      </div>
    `;
    
    // Show modal
    modal.showModal();
    
    // Add event listeners
    this.addModalEventListeners(modal, recipe);
  }

  addModalEventListeners(modal, recipe) {
    const closeButtons = modal.querySelectorAll('.modal__close');
    const shareBtn = modal.querySelector('[data-action="share"]');
    
    // Close button events
    closeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        modal.close();
      });
    });
    
    // Share button event
    shareBtn?.addEventListener('click', () => {
      RecipeSharer.shareRecipe(recipe);
    });
  }

  showDeleteConfirmation(recipe) {
    const confirmMessage = `¿Estás seguro de que quieres eliminar la receta "${recipe.title}"? Esta acción no se puede deshacer.`;
    
    if (confirm(confirmMessage)) {
      this.appState.deleteRecipe(recipe.id);
      this.renderRecipes(this.appState.filteredRecipes);
      this.showToast(`🗑️ Receta "${recipe.title}" eliminada correctamente`, 'success');
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
    if (DOM.statsTotal) DOM.statsTotal.textContent = stats.total;
    if (DOM.statsFavorites) DOM.statsFavorites.textContent = stats.favorites;
    if (DOM.statsCategories) DOM.statsCategories.textContent = stats.categories;
    
    // Update filter counts
    const allCountElement = document.querySelector('[data-count="all"]');
    const favCountElement = document.querySelector('[data-count="favorites"]');
    
    if (allCountElement) allCountElement.textContent = stats.total;
    if (favCountElement) favCountElement.textContent = stats.favorites;
  }
}

/**
 * Main Application Class
 */
class OneCookingApp {
  constructor() {
    this.appState = AppState.getInstance();
    this.uiController = new UIController(this.appState);
    this.pwaManager = PWAManager.getInstance();
    this.initialized = false;
  }

  async init() {
    try {
      console.log('🔧 Initializing Cocina para Uno...');
      
      // Initialize PWA Manager first
      this.pwaManager.initialize();
      
      // Setup initial theme
      this.setupTheme();
      
      // Initialize UI
      this.uiController.render();
      
      // Add some demo recipes if none exist
      this.addDemoRecipes();
      
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

  addDemoRecipes() {
    if (this.appState.recipes.getAll().length === 0) {
      const demoRecipes = [
        {
          title: 'Arepa con Queso',
          description: 'Deliciosa arepa tradicional con queso fundido',
          ingredients: ['1 taza de harina de maíz', '1 taza de agua tibia', '1/2 cucharadita de sal', '100g de queso rallado'],
          steps: ['Mezclar la harina con agua y sal', 'Formar una masa suave', 'Hacer bolitas y aplastar', 'Cocinar en plancha 5 min por lado', 'Abrir y rellenar con queso'],
          cookingTime: 20,
          categories: ['desayuno', 'rápida'],
          difficulty: 'fácil',
          servings: 1
        },
        {
          title: 'Pasta con Tomate',
          description: 'Pasta sencilla con salsa de tomate casera',
          ingredients: ['100g de pasta', '2 tomates medianos', '1 diente de ajo', '2 cucharadas de aceite de oliva', 'Sal y pimienta'],
          steps: ['Hervir agua con sal y cocinar la pasta', 'Pelar y picar los tomates', 'Freír el ajo en aceite', 'Agregar tomates y cocinar 10 min', 'Mezclar con la pasta'],
          cookingTime: 25,
          categories: ['almuerzo', 'vegetariana'],
          difficulty: 'fácil',
          servings: 1
        }
      ];

      demoRecipes.forEach(recipeData => {
        const recipe = new Recipe(recipeData);
        this.appState.addRecipe(recipe);
      });
      
      console.log('📚 Added demo recipes');
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
    
    console.log('✅ Application initialized successfully');
    
    // Hide loading screen
    const loadingScreen = DOM.loadingScreen;
    if (loadingScreen) {
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 1000);
    }
    
  } catch (error) {
    console.error('❌ Application initialization failed:', error);
    
    // Show error message to user
    document.body.innerHTML += `
      <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                  background: #ff4444; color: white; padding: 20px; border-radius: 8px; z-index: 9999;">
        <h3>Error de Inicialización</h3>
        <p>Error al inicializar la aplicación. Por favor, recarga la página.</p>
        <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px;">
          Recargar
        </button>
      </div>
    `;
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