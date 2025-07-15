/**
 * COCINA PARA UNO - PATTERNS MODULE
 * JavaScript Design Patterns implementation
 * Author: CDA Front Developer
 * Date: 2024
 */

/**
 * SINGLETON PATTERN
 * Ensures only one instance of a class exists
 * Used for: Application state management, configuration, logging
 */
export class SingletonPattern {
  constructor() {
    // Check if an instance already exists
    if (this.constructor.instance) {
      return this.constructor.instance;
    }
    
    // Store the instance
    this.constructor.instance = this;
    
    // Initialize the instance
    this.initialize();
    
    return this;
  }

  /**
   * Get the singleton instance
   */
  static getInstance() {
    if (!this.instance) {
      this.instance = new this();
    }
    return this.instance;
  }

  /**
   * Initialize method to be overridden by subclasses
   */
  initialize() {
    // Override in subclasses
  }

  /**
   * Reset the singleton instance (useful for testing)
   */
  static resetInstance() {
    this.instance = null;
  }
}

/**
 * OBSERVER PATTERN
 * Allows objects to be notified of changes in other objects
 * Used for: Event handling, state changes, data updates
 */
export class ObserverPattern {
  constructor() {
    this.observers = new Map();
  }

  /**
   * Subscribe to an event
   */
  subscribe(eventType, callback) {
    if (!this.observers.has(eventType)) {
      this.observers.set(eventType, []);
    }
    
    const observers = this.observers.get(eventType);
    observers.push(callback);
    
    // Return unsubscribe function
    return () => this.unsubscribe(eventType, callback);
  }

  /**
   * Unsubscribe from an event
   */
  unsubscribe(eventType, callback) {
    if (!this.observers.has(eventType)) {
      return false;
    }
    
    const observers = this.observers.get(eventType);
    const index = observers.indexOf(callback);
    
    if (index > -1) {
      observers.splice(index, 1);
      return true;
    }
    
    return false;
  }

  /**
   * Notify all observers of an event
   */
  notifyObservers(eventType, data = null) {
    if (!this.observers.has(eventType)) {
      return;
    }
    
    const observers = this.observers.get(eventType);
    observers.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in observer callback for ${eventType}:`, error);
      }
    });
  }

  /**
   * Get all event types
   */
  getEventTypes() {
    return Array.from(this.observers.keys());
  }

  /**
   * Get observer count for an event type
   */
  getObserverCount(eventType) {
    return this.observers.has(eventType) ? this.observers.get(eventType).length : 0;
  }

  /**
   * Clear all observers for an event type
   */
  clearObservers(eventType) {
    if (eventType) {
      this.observers.delete(eventType);
    } else {
      this.observers.clear();
    }
  }
}

/**
 * FACTORY PATTERN
 * Creates objects without specifying their exact class
 * Used for: Creating different types of components, elements, or instances
 */
export class FactoryPattern {
  constructor() {
    this.creators = new Map();
    this.registerDefaultCreators();
  }

  /**
   * Register default creators
   */
  registerDefaultCreators() {
    // Toast notification creator
    this.register('toast', (options) => {
      return this.createToastElement(options);
    });

    // Modal creator
    this.register('modal', (options) => {
      return this.createModalElement(options);
    });

    // Recipe card creator
    this.register('recipeCard', (options) => {
      return this.createRecipeCardElement(options);
    });

    // Form input creator
    this.register('formInput', (options) => {
      return this.createFormInputElement(options);
    });

    // Button creator
    this.register('button', (options) => {
      return this.createButtonElement(options);
    });
  }

  /**
   * Register a new creator function
   */
  register(type, creatorFunction) {
    this.creators.set(type, creatorFunction);
  }

  /**
   * Create an instance using the factory
   */
  create(type, options = {}) {
    const creator = this.creators.get(type);
    
    if (!creator) {
      throw new Error(`No creator registered for type: ${type}`);
    }
    
    return creator(options);
  }

  /**
   * Check if a type is registered
   */
  isRegistered(type) {
    return this.creators.has(type);
  }

  /**
   * Get all registered types
   */
  getRegisteredTypes() {
    return Array.from(this.creators.keys());
  }

  /**
   * Unregister a creator
   */
  unregister(type) {
    return this.creators.delete(type);
  }

  // FACTORY CREATOR METHODS

  /**
   * Create toast notification element
   */
  createToastElement({ message, type = 'info', duration = 3000, onClose }) {
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    
    const iconMap = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };

    toast.innerHTML = `
      <div class="toast__icon">${iconMap[type] || iconMap.info}</div>
      <div class="toast__content">
        <div class="toast__title">${this.capitalizeFirstLetter(type)}</div>
        <p class="toast__message">${this.escapeHtml(message)}</p>
      </div>
      <button class="toast__close" aria-label="Cerrar notificación">×</button>
    `;

    // Add close functionality
    const closeButton = toast.querySelector('.toast__close');
    closeButton.addEventListener('click', () => {
      if (onClose) onClose(toast);
    });

    return toast;
  }

  /**
   * Create modal element
   */
  createModalElement({ title, content, size = 'medium', closable = true, onClose }) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'modal-title');
    
    const modalId = 'modal-' + Date.now();
    
    modal.innerHTML = `
      <div class="modal__backdrop"></div>
      <div class="modal__container ${size === 'large' ? 'modal__container--large' : ''}">
        <div class="modal__content">
          ${title ? `
            <header class="modal__header">
              <h2 class="modal__title" id="${modalId}-title">${this.escapeHtml(title)}</h2>
              ${closable ? '<button class="modal__close" aria-label="Cerrar modal">×</button>' : ''}
            </header>
          ` : ''}
          <div class="modal__body">
            ${typeof content === 'string' ? content : ''}
          </div>
        </div>
      </div>
    `;

    // Add close functionality
    if (closable) {
      const closeButton = modal.querySelector('.modal__close');
      const backdrop = modal.querySelector('.modal__backdrop');
      
      const closeModal = () => {
        if (onClose) onClose(modal);
      };
      
      if (closeButton) closeButton.addEventListener('click', closeModal);
      if (backdrop) backdrop.addEventListener('click', closeModal);
    }

    // Add content if it's an element
    if (content && typeof content === 'object' && content.nodeType) {
      const modalBody = modal.querySelector('.modal__body');
      modalBody.innerHTML = '';
      modalBody.appendChild(content);
    }

    return modal;
  }

  /**
   * Create recipe card element
   */
  createRecipeCardElement({ recipe, onClick, onFavorite, onEdit, onDelete }) {
    const card = document.createElement('article');
    card.className = 'recipe-card';
    card.setAttribute('data-recipe-id', recipe.id);
    
    const categoriesHtml = recipe.categories.map(cat => 
      `<span class="category-tag category-tag--${cat}">${this.capitalizeCategoryName(cat)}</span>`
    ).join('');

    card.innerHTML = `
      <div class="recipe-card__image" ${recipe.imageUrl ? `style="background-image: url(${recipe.imageUrl})"` : ''}>
        ${recipe.imageUrl ? '' : '🍽️'}
      </div>
      <div class="recipe-card__content">
        <header class="recipe-card__header">
          <h3 class="recipe-card__title">${this.escapeHtml(recipe.title)}</h3>
          <button class="recipe-card__favorite ${recipe.isFavorite ? 'recipe-card__favorite--active' : ''}" 
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
          <button class="recipe-card__action" data-action="view">Ver receta</button>
          <button class="recipe-card__action" data-action="edit">Editar</button>
          <button class="recipe-card__action" data-action="delete">Eliminar</button>
        </footer>
      </div>
    `;

    // Add event listeners
    if (onClick) {
      card.addEventListener('click', (e) => {
        if (!e.target.closest('button')) onClick(recipe);
      });
    }

    const favoriteBtn = card.querySelector('.recipe-card__favorite');
    if (favoriteBtn && onFavorite) {
      favoriteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        onFavorite(recipe);
      });
    }

    const actionButtons = card.querySelectorAll('.recipe-card__action');
    actionButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = button.getAttribute('data-action');
        
        switch (action) {
          case 'view':
            if (onClick) onClick(recipe);
            break;
          case 'edit':
            if (onEdit) onEdit(recipe);
            break;
          case 'delete':
            if (onDelete) onDelete(recipe);
            break;
        }
      });
    });

    return card;
  }

  /**
   * Create form input element
   */
  createFormInputElement({ 
    type = 'text', 
    name, 
    label, 
    placeholder, 
    required = false, 
    value = '', 
    helpText,
    validation 
  }) {
    const wrapper = document.createElement('div');
    wrapper.className = 'form-group';
    
    const inputId = `input-${name}-${Date.now()}`;
    
    let inputElement;
    if (type === 'textarea') {
      inputElement = document.createElement('textarea');
      inputElement.className = 'form-textarea';
    } else {
      inputElement = document.createElement('input');
      inputElement.type = type;
      inputElement.className = 'form-input';
    }
    
    inputElement.id = inputId;
    inputElement.name = name;
    if (placeholder) inputElement.placeholder = placeholder;
    if (required) inputElement.required = true;
    if (value) inputElement.value = value;

    wrapper.innerHTML = `
      ${label ? `<label for="${inputId}" class="form-label">${this.escapeHtml(label)}${required ? ' *' : ''}</label>` : ''}
      ${helpText ? `<small class="form-help">${this.escapeHtml(helpText)}</small>` : ''}
      <div class="form-error" style="display: none;"></div>
    `;

    // Insert input element
    const errorDiv = wrapper.querySelector('.form-error');
    wrapper.insertBefore(inputElement, errorDiv);

    // Add validation if provided
    if (validation) {
      inputElement.addEventListener('blur', () => {
        const isValid = validation(inputElement.value);
        this.toggleInputValidation(inputElement, isValid);
      });
    }

    return wrapper;
  }

  /**
   * Create button element
   */
  createButtonElement({ 
    text, 
    type = 'button', 
    variant = 'primary', 
    size = 'medium', 
    icon, 
    disabled = false, 
    onClick 
  }) {
    const button = document.createElement('button');
    button.type = type;
    button.className = `btn btn--${variant}`;
    
    if (size !== 'medium') {
      button.classList.add(`btn--${size}`);
    }
    
    if (disabled) {
      button.disabled = true;
    }

    // Add content
    let content = '';
    if (icon) {
      content += `<span class="btn__icon">${icon}</span>`;
    }
    if (text) {
      content += `<span class="btn__text">${this.escapeHtml(text)}</span>`;
    }
    
    button.innerHTML = content;

    // Add click handler
    if (onClick) {
      button.addEventListener('click', onClick);
    }

    return button;
  }

  // UTILITY METHODS

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Capitalize first letter
   */
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  /**
   * Capitalize category names
   */
  capitalizeCategoryName(category) {
    const names = {
      breakfast: 'Desayuno',
      lunch: 'Almuerzo',
      dinner: 'Cena',
      dessert: 'Postre',
      vegetarian: 'Vegetariano',
      quick: 'Rápido'
    };
    return names[category] || this.capitalizeFirstLetter(category);
  }

  /**
   * Toggle input validation state
   */
  toggleInputValidation(input, isValid) {
    const formGroup = input.closest('.form-group');
    const errorDiv = formGroup?.querySelector('.form-error');
    
    if (isValid) {
      input.classList.remove('form-input--error');
      if (errorDiv) {
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';
      }
    } else {
      input.classList.add('form-input--error');
      if (errorDiv) {
        errorDiv.style.display = 'block';
        errorDiv.textContent = 'Este campo contiene errores';
      }
    }
  }
}

/**
 * MODULE PATTERN
 * Encapsulates related functionality in a single module
 * Used for: Organizing code, creating namespaces, data privacy
 */
export const ModulePattern = {
  /**
   * Create a new module
   */
  create(name, dependencies = [], factory) {
    const module = {
      name,
      dependencies,
      exports: {},
      private: {},
      initialize: factory
    };

    // Initialize the module
    if (typeof factory === 'function') {
      const moduleApi = factory(module.private);
      if (moduleApi) {
        module.exports = moduleApi;
      }
    }

    return module;
  },

  /**
   * Module registry for dependency management
   */
  registry: new Map(),

  /**
   * Register a module
   */
  register(module) {
    this.registry.set(module.name, module);
    return module;
  },

  /**
   * Get a registered module
   */
  get(name) {
    return this.registry.get(name);
  },

  /**
   * Load a module with its dependencies
   */
  load(name) {
    const module = this.registry.get(name);
    if (!module) {
      throw new Error(`Module '${name}' not found`);
    }

    // Load dependencies first
    const loadedDependencies = module.dependencies.map(depName => {
      const dep = this.load(depName);
      return dep.exports;
    });

    // If module hasn't been initialized, do it now
    if (typeof module.initialize === 'function') {
      const moduleApi = module.initialize(module.private, ...loadedDependencies);
      if (moduleApi) {
        module.exports = moduleApi;
      }
      module.initialize = null; // Prevent re-initialization
    }

    return module;
  }
};

/**
 * COMMAND PATTERN
 * Encapsulates requests as objects, allowing for queuing, logging, and undo operations
 * Used for: Action history, undo/redo functionality, batch operations
 */
export class CommandPattern {
  constructor() {
    this.history = [];
    this.currentIndex = -1;
    this.maxHistorySize = 50;
  }

  /**
   * Execute a command and add it to history
   */
  execute(command) {
    // Remove any commands after current index (for redo functionality)
    this.history = this.history.slice(0, this.currentIndex + 1);
    
    // Execute the command
    const result = command.execute();
    
    // Add to history if command is undoable
    if (command.undo) {
      this.history.push(command);
      this.currentIndex++;
      
      // Limit history size
      if (this.history.length > this.maxHistorySize) {
        this.history.shift();
        this.currentIndex--;
      }
    }
    
    return result;
  }

  /**
   * Undo the last command
   */
  undo() {
    if (this.canUndo()) {
      const command = this.history[this.currentIndex];
      const result = command.undo();
      this.currentIndex--;
      return result;
    }
    return null;
  }

  /**
   * Redo the next command
   */
  redo() {
    if (this.canRedo()) {
      this.currentIndex++;
      const command = this.history[this.currentIndex];
      return command.execute();
    }
    return null;
  }

  /**
   * Check if undo is possible
   */
  canUndo() {
    return this.currentIndex >= 0;
  }

  /**
   * Check if redo is possible
   */
  canRedo() {
    return this.currentIndex < this.history.length - 1;
  }

  /**
   * Clear command history
   */
  clearHistory() {
    this.history = [];
    this.currentIndex = -1;
  }

  /**
   * Get current history size
   */
  getHistorySize() {
    return this.history.length;
  }

  /**
   * Get history as array of command descriptions
   */
  getHistoryDescriptions() {
    return this.history.map(command => command.description || 'Unknown command');
  }
}

/**
 * STRATEGY PATTERN
 * Defines a family of algorithms and makes them interchangeable
 * Used for: Different sorting methods, validation strategies, formatting options
 */
export class StrategyPattern {
  constructor() {
    this.strategies = new Map();
  }

  /**
   * Register a strategy
   */
  register(name, strategy) {
    this.strategies.set(name, strategy);
  }

  /**
   * Execute a strategy
   */
  execute(name, ...args) {
    const strategy = this.strategies.get(name);
    if (!strategy) {
      throw new Error(`Strategy '${name}' not found`);
    }
    return strategy(...args);
  }

  /**
   * Check if strategy exists
   */
  has(name) {
    return this.strategies.has(name);
  }

  /**
   * Get all strategy names
   */
  getStrategyNames() {
    return Array.from(this.strategies.keys());
  }

  /**
   * Remove a strategy
   */
  remove(name) {
    return this.strategies.delete(name);
  }
}

// PREDEFINED COMMAND CLASSES

/**
 * Recipe command for adding recipes
 */
export class AddRecipeCommand {
  constructor(recipeCollection, recipeData) {
    this.recipeCollection = recipeCollection;
    this.recipeData = recipeData;
    this.addedRecipe = null;
    this.description = `Add recipe: ${recipeData.title}`;
  }

  execute() {
    this.addedRecipe = this.recipeCollection.add(this.recipeData);
    return this.addedRecipe;
  }

  undo() {
    if (this.addedRecipe) {
      return this.recipeCollection.delete(this.addedRecipe.id);
    }
    return null;
  }
}

/**
 * Recipe command for updating recipes
 */
export class UpdateRecipeCommand {
  constructor(recipeCollection, recipeId, newData) {
    this.recipeCollection = recipeCollection;
    this.recipeId = recipeId;
    this.newData = newData;
    this.oldData = null;
    this.description = `Update recipe: ${newData.title || recipeId}`;
  }

  execute() {
    const recipe = this.recipeCollection.get(this.recipeId);
    if (recipe) {
      this.oldData = recipe.toJSON();
      return this.recipeCollection.update(this.recipeId, this.newData);
    }
    return null;
  }

  undo() {
    if (this.oldData) {
      return this.recipeCollection.update(this.recipeId, this.oldData);
    }
    return null;
  }
}

/**
 * Recipe command for deleting recipes
 */
export class DeleteRecipeCommand {
  constructor(recipeCollection, recipeId) {
    this.recipeCollection = recipeCollection;
    this.recipeId = recipeId;
    this.deletedRecipe = null;
    this.description = `Delete recipe: ${recipeId}`;
  }

  execute() {
    const recipe = this.recipeCollection.get(this.recipeId);
    if (recipe) {
      this.deletedRecipe = recipe.toJSON();
      this.description = `Delete recipe: ${recipe.title}`;
    }
    return this.recipeCollection.delete(this.recipeId);
  }

  undo() {
    if (this.deletedRecipe) {
      return this.recipeCollection.add(this.deletedRecipe);
    }
    return null;
  }
}

// EXPORT ALL PATTERNS
export default {
  SingletonPattern,
  ObserverPattern,
  FactoryPattern,
  ModulePattern,
  CommandPattern,
  StrategyPattern,
  AddRecipeCommand,
  UpdateRecipeCommand,
  DeleteRecipeCommand
};