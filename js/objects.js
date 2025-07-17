/**
 * ============================================
 * 🍲 COCINA PARA UNO - ENHANCED OBJECTS MODEL
 * JavaScript Objects with TypeScript functionality
 * ============================================
 */

/**
 * Enhanced Recipe Class - Core data model for recipes
 * Based on TypeScript version with all advanced features
 */
export class Recipe {
  constructor(data = {}) {
    // Required properties with defaults
    this.id = data.id || this.generateId();
    this.name = data.name || data.title || '';
    this.ingredients = Array.isArray(data.ingredients) ? [...data.ingredients] : [];
    this.ingredientImages = Array.isArray(data.ingredientImages) ? [...data.ingredientImages] : [];
    this.steps = Array.isArray(data.steps) ? [...data.steps] : [];
    // Handle categories from different property names
    if (Array.isArray(data.categories)) {
      this.categories = [...data.categories];
    } else if (Array.isArray(data.category)) {
      this.categories = [...data.category];
    } else {
      this.categories = [];
    }
    
    // Time and difficulty
    this.time = this.validateTime(data.time || data.cookingTime) || 15;
    this.difficulty = this.validateDifficulty(data.difficulty) || 'Fácil';
    this.servings = this.validateServings(data.servings) || 1;
    
    // Rating system (enhanced from TypeScript version)
    this.manualRating = this.validateRating(data.manualRating) || 5;
    this.autoRating = this.validateRating(data.autoRating) || 1;
    this.finalRating = this.validateRating(data.finalRating) || this.calculateFinalRating();
    
    // Status and metadata
    this.favorite = Boolean(data.favorite || data.isFavorite);
    this.image = data.image || data.imageUrl || '';
    this.notes = data.notes || '';
    
    // Timestamps
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
    this.lastCooked = data.lastCooked ? new Date(data.lastCooked) : null;
    
    // Cooking statistics
    this.timesCooked = data.timesCooked || 0;
    this.cookingHistory = Array.isArray(data.cookingHistory) ? 
      data.cookingHistory.map(date => new Date(date)) : [];
    
    // Additional metadata
    this.author = data.author || 'Usuario';
    this.source = data.source || '';
    
    // Nutritional information (optional)
    this.nutrition = {
      calories: data.nutrition?.calories || null,
      protein: data.nutrition?.protein || null,
      carbs: data.nutrition?.carbs || null,
      fat: data.nutrition?.fat || null,
      fiber: data.nutrition?.fiber || null
    };

    // Validate required fields on creation
    this.validate();
  }

  /**
   * Generate unique ID for recipe
   */
  generateId() {
    return Date.now().toString() + Math.random().toString(36).substring(2, 9);
  }

  /**
   * Validate time input
   */
  validateTime(time) {
    const numTime = Number(time);
    return (numTime > 0 && numTime <= 480) ? Math.round(numTime) : null;
  }

  /**
   * Validate difficulty level
   */
  validateDifficulty(difficulty) {
    const validDifficulties = ['Fácil', 'Medio', 'Difícil'];
    return validDifficulties.includes(difficulty) ? difficulty : null;
  }

  /**
   * Validate number of servings
   */
  validateServings(servings) {
    const numServings = Number(servings);
    return (numServings > 0 && numServings <= 20) ? Math.round(numServings) : null;
  }

  /**
   * Validate rating (1-5)
   */
  validateRating(rating) {
    const numRating = Number(rating);
    return (numRating >= 1 && numRating <= 5) ? Math.round(numRating) : null;
  }

  /**
   * Basic validation for required fields
   */
  validate() {
    if (!this.name || this.name.trim() === '') {
      throw new Error('Recipe name is required');
    }
    if (!Array.isArray(this.ingredients) || this.ingredients.length === 0) {
      throw new Error('At least one ingredient is required');
    }
    if (!Array.isArray(this.steps) || this.steps.length === 0) {
      throw new Error('At least one preparation step is required');
    }
    return true;
  }

  /**
   * Calculate automatic rating based on usage patterns
   */
  calculateAutoRating() {
    let score = 0;

    // Factor 1: Cooking frequency (40% weight)
    const cookingFrequency = Math.min(this.timesCooked / 10, 1) * 2; // Max 2 points
    score += cookingFrequency;

    // Factor 2: If favorite (20% weight)
    if (this.favorite) {
      score += 1;
    }

    // Factor 3: Age vs usage ratio (20% weight)
    const daysSinceCreated = Math.floor((Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24));
    const ageUsageRatio = daysSinceCreated > 0 ? this.timesCooked / Math.max(daysSinceCreated / 7, 1) : this.timesCooked;
    score += Math.min(ageUsageRatio, 1);

    // Factor 4: Recency of use (20% weight)
    if (this.lastCooked) {
      const daysSinceCooked = Math.floor((Date.now() - this.lastCooked.getTime()) / (1000 * 60 * 60 * 24));
      const recencyScore = Math.max(0, 1 - daysSinceCooked / 30); // Decays over 30 days
      score += recencyScore;
    }

    return Math.min(Math.max(Math.round(score), 1), 5);
  }

  /**
   * Calculate final hybrid rating (70% manual, 30% automatic)
   */
  calculateFinalRating() {
    const autoRating = this.calculateAutoRating();
    return Math.round(this.manualRating * 0.7 + autoRating * 0.3);
  }

  /**
   * Update recipe properties
   */
  update(data) {
    // Update properties if provided
    if (data.name !== undefined) this.name = data.name;
    if (data.ingredients !== undefined) this.ingredients = [...data.ingredients];
    if (data.ingredientImages !== undefined) this.ingredientImages = [...data.ingredientImages];
    if (data.steps !== undefined) this.steps = [...data.steps];
    if (data.categories !== undefined) this.categories = [...data.categories];
    if (data.time !== undefined) this.time = this.validateTime(data.time) || this.time;
    if (data.difficulty !== undefined) this.difficulty = this.validateDifficulty(data.difficulty) || this.difficulty;
    if (data.servings !== undefined) this.servings = this.validateServings(data.servings) || this.servings;
    if (data.image !== undefined) this.image = data.image;
    if (data.manualRating !== undefined) this.manualRating = this.validateRating(data.manualRating) || this.manualRating;
    if (data.notes !== undefined) this.notes = data.notes;
    
    // Update timestamps
    this.updatedAt = new Date();
    
    // Recalculate ratings
    this.autoRating = this.calculateAutoRating();
    this.finalRating = this.calculateFinalRating();
    
    this.validate();
    return this;
  }

  /**
   * Toggle favorite status
   */
  toggleFavorite() {
    this.favorite = !this.favorite;
    this.updatedAt = new Date();
    this.autoRating = this.calculateAutoRating();
    this.finalRating = this.calculateFinalRating();
    return this.favorite;
  }

  /**
   * Mark recipe as cooked
   */
  markAsCooked() {
    const now = new Date();
    this.timesCooked++;
    this.lastCooked = now;
    this.cookingHistory.push(now);
    this.updatedAt = now;
    
    // Recalculate ratings
    this.autoRating = this.calculateAutoRating();
    this.finalRating = this.calculateFinalRating();
    
    return this;
  }

  /**
   * Update manual rating
   */
  updateRating(rating) {
    const validRating = this.validateRating(rating);
    if (validRating) {
      this.manualRating = validRating;
      this.finalRating = this.calculateFinalRating();
      this.updatedAt = new Date();
    }
    return this;
  }

  /**
   * Add a category if not already present
   */
  addCategory(category) {
    const validCategories = [
      'Desayuno', 'Almuerzo', 'Cena', 'Postre', 'Snack',
      'Vegetariano', 'Vegano', 'Sin Gluten', 'Rápido', 'Saludable'
    ];
    if (validCategories.includes(category) && !this.categories.includes(category)) {
      this.categories.push(category);
      this.updatedAt = new Date();
    }
    return this;
  }

  /**
   * Remove a category
   */
  removeCategory(category) {
    const index = this.categories.indexOf(category);
    if (index > -1) {
      this.categories.splice(index, 1);
      this.updatedAt = new Date();
    }
    return this;
  }

  /**
   * Add an ingredient
   */
  addIngredient(ingredient, image = '') {
    if (ingredient?.trim()) {
      this.ingredients.push(ingredient.trim());
      this.ingredientImages.push(image);
      this.updatedAt = new Date();
    }
    return this;
  }

  /**
   * Remove an ingredient by index
   */
  removeIngredient(index) {
    if (index >= 0 && index < this.ingredients.length) {
      this.ingredients.splice(index, 1);
      this.ingredientImages.splice(index, 1);
      this.updatedAt = new Date();
    }
    return this;
  }

  /**
   * Add a step
   */
  addStep(step) {
    if (step?.trim()) {
      this.steps.push(step.trim());
      this.updatedAt = new Date();
    }
    return this;
  }

  /**
   * Remove a step by index
   */
  removeStep(index) {
    if (index >= 0 && index < this.steps.length) {
      this.steps.splice(index, 1);
      this.updatedAt = new Date();
    }
    return this;
  }

  /**
   * Get estimated preparation time
   */
  getEstimatedPrepTime() {
    // Rough estimation based on number of ingredients and steps
    const ingredientTime = this.ingredients.length * 2; // 2 minutes per ingredient
    const stepTime = this.steps.length * 3; // 3 minutes per step
    return Math.max(5, ingredientTime + stepTime); // Minimum 5 minutes
  }

  /**
   * Get total time (prep + cooking)
   */
  getTotalTime() {
    return this.getEstimatedPrepTime() + this.time;
  }

  /**
   * Get difficulty score (1-5)
   */
  getDifficultyScore() {
    const scores = { 'Fácil': 1, 'Medio': 3, 'Difícil': 5 };
    return scores[this.difficulty] || 1;
  }

  /**
   * Get formatted cooking time
   */
  getFormattedTime() {
    if (this.time < 60) {
      return `${this.time} min`;
    } else {
      const hours = Math.floor(this.time / 60);
      const minutes = this.time % 60;
      return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
    }
  }

  /**
   * Format relative time for last cooked
   */
  getLastCookedRelative(language = 'es') {
    if (!this.lastCooked) {
      return language === 'es' ? 'Nunca' : 'Never';
    }

    const now = new Date();
    const diffTime = now.getTime() - this.lastCooked.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return language === 'es' ? 'Hoy' : 'Today';
    } else if (diffDays === 1) {
      return language === 'es' ? 'Ayer' : 'Yesterday';
    } else {
      return language === 'es' ? `hace ${diffDays} días` : `${diffDays} days ago`;
    }
  }

  /**
   * Check if recipe matches search criteria
   */
  matchesSearch(query) {
    if (!query || query.trim() === '') return true;
    
    const searchTerm = query.toLowerCase().trim();
    
    return this.name.toLowerCase().includes(searchTerm) ||
           this.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchTerm)) ||
           this.categories.some(category => category.toLowerCase().includes(searchTerm)) ||
           this.steps.some(step => step.toLowerCase().includes(searchTerm)) ||
           this.notes.toLowerCase().includes(searchTerm);
  }

  /**
   * Check if recipe has category
   */
  hasCategory(category) {
    return this.categories.includes(category);
  }

  /**
   * Clone recipe with new ID
   */
  clone() {
    const clonedData = this.toJSON();
    clonedData.id = this.generateId();
    clonedData.name = `${clonedData.name} (Copia)`;
    clonedData.createdAt = new Date();
    clonedData.updatedAt = new Date();
    clonedData.timesCooked = 0;
    clonedData.lastCooked = null;
    clonedData.cookingHistory = [];
    
    return new Recipe(clonedData);
  }

  /**
   * Export to JSON
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      ingredients: [...this.ingredients],
      ingredientImages: [...this.ingredientImages],
      steps: [...this.steps],
      categories: [...this.categories],
      time: this.time,
      difficulty: this.difficulty,
      servings: this.servings,
      manualRating: this.manualRating,
      autoRating: this.autoRating,
      finalRating: this.finalRating,
      favorite: this.favorite,
      image: this.image,
      notes: this.notes,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      lastCooked: this.lastCooked ? this.lastCooked.toISOString() : null,
      timesCooked: this.timesCooked,
      cookingHistory: this.cookingHistory.map(date => date.toISOString()),
      author: this.author,
      source: this.source,
      nutrition: { ...this.nutrition }
    };
  }

  /**
   * Create recipe from JSON data
   */
  static fromJSON(data) {
    return new Recipe(data);
  }

  /**
   * Export to string for sharing
   */
  toString() {
    let str = `${this.name}\n${'='.repeat(this.name.length)}\n\n`;
    
    str += `Tiempo de cocción: ${this.getFormattedTime()}\n`;
    str += `Dificultad: ${this.difficulty}\n`;
    str += `Porciones: ${this.servings}\n`;
    str += `Categorías: ${this.categories.join(', ')}\n`;
    str += `Calificación: ${'★'.repeat(this.finalRating)}${'☆'.repeat(5 - this.finalRating)}\n\n`;
    
    str += `INGREDIENTES:\n`;
    this.ingredients.forEach((ingredient, index) => {
      str += `${index + 1}. ${ingredient}\n`;
    });
    
    str += `\nPASOS:\n`;
    this.steps.forEach((step, index) => {
      str += `${index + 1}. ${step}\n`;
    });
    
    if (this.notes) {
      str += `\nNOTAS:\n${this.notes}\n`;
    }
    
    str += `\nEstadísticas:\n`;
    str += `- Cocinada ${this.timesCooked} veces\n`;
    str += `- Última vez: ${this.getLastCookedRelative()}\n`;
    
    return str;
  }
}

/**
 * RecipeBuilder Class - Builder pattern for creating recipes
 */
export class RecipeBuilder {
  constructor() {
    this.reset();
  }

  reset() {
    this.recipeData = {
      name: '',
      ingredients: [],
      ingredientImages: [],
      steps: [],
      categories: [],
      time: 15,
      difficulty: 'Fácil',
      servings: 1,
      manualRating: 5,
      notes: '',
      image: ''
    };
    return this;
  }

  setName(name) {
    this.recipeData.name = name;
    return this;
  }

  addIngredient(ingredient, image = '') {
    this.recipeData.ingredients.push(ingredient);
    this.recipeData.ingredientImages.push(image);
    return this;
  }

  addIngredients(ingredients) {
    ingredients.forEach(ingredient => {
      if (typeof ingredient === 'string') {
        this.addIngredient(ingredient);
      } else {
        this.addIngredient(ingredient.name, ingredient.image);
      }
    });
    return this;
  }

  addStep(step) {
    this.recipeData.steps.push(step);
    return this;
  }

  addSteps(steps) {
    this.recipeData.steps.push(...steps);
    return this;
  }

  addCategory(category) {
    if (!this.recipeData.categories.includes(category)) {
      this.recipeData.categories.push(category);
    }
    return this;
  }

  setTime(time) {
    this.recipeData.time = time;
    return this;
  }

  setDifficulty(difficulty) {
    this.recipeData.difficulty = difficulty;
    return this;
  }

  setServings(servings) {
    this.recipeData.servings = servings;
    return this;
  }

  setRating(rating) {
    this.recipeData.manualRating = rating;
    return this;
  }

  setImage(image) {
    this.recipeData.image = image;
    return this;
  }

  setNotes(notes) {
    this.recipeData.notes = notes;
    return this;
  }

  build() {
    const recipe = new Recipe(this.recipeData);
    this.reset();
    return recipe;
  }
}

/**
 * RecipeManager Class - Singleton pattern for managing recipes
 */
export class RecipeManager {
  constructor() {
    if (RecipeManager.instance) {
      return RecipeManager.instance;
    }

    this.recipes = new Map();
    this.categories = new Set();
    this.storageKey = 'cocina-para-uno-recipes';
    this.settingsKey = 'cocina-para-uno-settings';
    this.settings = {
      language: 'es',
      theme: 'light',
      lastFilter: 'all',
      sortBy: 'name'
    };

    RecipeManager.instance = this;
    this.loadFromStorage();
    return this;
  }

  /**
   * Get singleton instance
   */
  static getInstance() {
    if (!RecipeManager.instance) {
      RecipeManager.instance = new RecipeManager();
    }
    return RecipeManager.instance;
  }

  /**
   * Add a new recipe
   */
  addRecipe(recipeData) {
    const recipe = recipeData instanceof Recipe ? recipeData : new Recipe(recipeData);
    this.recipes.set(recipe.id, recipe);
    
    // Update categories set
    recipe.categories.forEach(category => this.categories.add(category));
    
    this.saveToStorage();
    this.notifyListeners('recipe:added', recipe);
    return recipe;
  }

  /**
   * Update existing recipe
   */
  updateRecipe(id, updates) {
    const recipe = this.recipes.get(id);
    if (!recipe) {
      throw new Error(`Recipe with id ${id} not found`);
    }

    recipe.update(updates);
    
    // Update categories set
    recipe.categories.forEach(category => this.categories.add(category));
    
    this.saveToStorage();
    this.notifyListeners('recipe:updated', recipe);
    return recipe;
  }

  /**
   * Delete recipe
   */
  deleteRecipe(id) {
    const recipe = this.recipes.get(id);
    if (!recipe) {
      throw new Error(`Recipe with id ${id} not found`);
    }

    this.recipes.delete(id);
    this.updateCategories();
    this.saveToStorage();
    this.notifyListeners('recipe:deleted', recipe);
    return recipe;
  }

  /**
   * Get recipe by ID
   */
  getRecipe(id) {
    return this.recipes.get(id);
  }

  /**
   * Get all recipes as array
   */
  getAllRecipes() {
    return Array.from(this.recipes.values());
  }

  /**
   * Get favorite recipes
   */
  getFavoriteRecipes() {
    return this.getAllRecipes().filter(recipe => recipe.favorite);
  }

  /**
   * Filter recipes by category
   */
  getRecipesByCategory(category) {
    return this.getAllRecipes().filter(recipe => recipe.hasCategory(category));
  }

  /**
   * Search recipes
   */
  searchRecipes(query) {
    if (!query || query.trim() === '') {
      return this.getAllRecipes();
    }

    return this.getAllRecipes().filter(recipe => recipe.matchesSearch(query));
  }

  /**
   * Get recipes with advanced filtering
   */
  getFilteredRecipes(filters = {}) {
    let results = this.getAllRecipes();

    // Apply search filter
    if (filters.search) {
      results = results.filter(recipe => recipe.matchesSearch(filters.search));
    }

    // Apply category filter
    if (filters.category && filters.category !== 'all') {
      results = results.filter(recipe => recipe.hasCategory(filters.category));
    }

    // Apply favorites filter
    if (filters.favorites) {
      results = results.filter(recipe => recipe.favorite);
    }

    // Apply difficulty filter
    if (filters.difficulty) {
      results = results.filter(recipe => recipe.difficulty === filters.difficulty);
    }

    // Apply time range filter
    if (filters.maxTime) {
      results = results.filter(recipe => recipe.time <= filters.maxTime);
    }

    // Apply sorting
    if (filters.sortBy) {
      results = this.sortRecipes(results, filters.sortBy);
    }

    return results;
  }

  /**
   * Sort recipes by different criteria
   */
  sortRecipes(recipes, sortBy) {
    const sortedRecipes = [...recipes];

    switch (sortBy) {
      case 'name':
        return sortedRecipes.sort((a, b) => a.name.localeCompare(b.name));
      case 'time':
        return sortedRecipes.sort((a, b) => a.time - b.time);
      case 'rating':
        return sortedRecipes.sort((a, b) => b.finalRating - a.finalRating);
      case 'created':
        return sortedRecipes.sort((a, b) => b.createdAt - a.createdAt);
      case 'updated':
        return sortedRecipes.sort((a, b) => b.updatedAt - a.updatedAt);
      case 'cooked':
        return sortedRecipes.sort((a, b) => b.timesCooked - a.timesCooked);
      default:
        return sortedRecipes;
    }
  }

  /**
   * Get all categories
   */
  getAllCategories() {
    return Array.from(this.categories).sort();
  }

  /**
   * Update categories set based on current recipes
   */
  updateCategories() {
    this.categories.clear();
    this.getAllRecipes().forEach(recipe => {
      recipe.categories.forEach(category => this.categories.add(category));
    });
  }

  /**
   * Get cooking statistics
   */
  getStatistics() {
    const recipes = this.getAllRecipes();
    const totalRecipes = recipes.length;
    const favoriteRecipes = recipes.filter(r => r.favorite).length;
    const totalTimesCooked = recipes.reduce((sum, r) => sum + r.timesCooked, 0);
    const averageTime = totalRecipes > 0 ? 
      Math.round(recipes.reduce((sum, r) => sum + r.time, 0) / totalRecipes) : 0;
    const averageRating = totalRecipes > 0 ?
      Math.round(recipes.reduce((sum, r) => sum + r.finalRating, 0) / totalRecipes * 10) / 10 : 0;

    // Category distribution
    const categoryStats = {};
    this.getAllCategories().forEach(category => {
      categoryStats[category] = recipes.filter(r => r.hasCategory(category)).length;
    });

    // Most cooked recipes
    const mostCooked = recipes
      .filter(r => r.timesCooked > 0)
      .sort((a, b) => b.timesCooked - a.timesCooked)
      .slice(0, 5);

    return {
      totalRecipes,
      favoriteRecipes,
      totalTimesCooked,
      averageTime,
      averageRating,
      categoryStats,
      mostCooked
    };
  }

  /**
   * Export all data
   */
  exportData() {
    return {
      recipes: this.getAllRecipes().map(recipe => recipe.toJSON()),
      settings: { ...this.settings },
      categories: this.getAllCategories(),
      exportDate: new Date().toISOString(),
      version: '2.0'
    };
  }

  /**
   * Import data
   */
  importData(data) {
    try {
      if (data.recipes) {
        this.recipes.clear();
        data.recipes.forEach(recipeData => {
          const recipe = new Recipe(recipeData);
          this.recipes.set(recipe.id, recipe);
        });
      }

      if (data.settings) {
        this.settings = { ...this.settings, ...data.settings };
      }

      this.updateCategories();
      this.saveToStorage();
      this.notifyListeners('data:imported', data);
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  /**
   * Save to localStorage
   */
  saveToStorage() {
    try {
      const data = {
        recipes: this.getAllRecipes().map(recipe => recipe.toJSON()),
        timestamp: Date.now()
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      localStorage.setItem(this.settingsKey, JSON.stringify(this.settings));
      return true;
    } catch (error) {
      console.error('Error saving to storage:', error);
      return false;
    }
  }

  /**
   * Load from localStorage
   */
  loadFromStorage() {
    try {
      // Load recipes
      const recipesData = localStorage.getItem(this.storageKey);
      if (recipesData) {
        const parsed = JSON.parse(recipesData);
        if (parsed.recipes) {
          parsed.recipes.forEach(recipeData => {
            const recipe = new Recipe(recipeData);
            this.recipes.set(recipe.id, recipe);
          });
        }
      } else {
        // Load initial recipes if none exist
        this.loadInitialRecipes();
      }

      // Load settings
      const settingsData = localStorage.getItem(this.settingsKey);
      if (settingsData) {
        this.settings = { ...this.settings, ...JSON.parse(settingsData) };
      }

      this.updateCategories();
      return true;
    } catch (error) {
      console.error('Error loading from storage:', error);
      this.loadInitialRecipes();
      return false;
    }
  }

  /**
   * Load initial sample recipes
   */
  loadInitialRecipes() {
    const initialRecipes = [
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
        notes: "Perfectas para el desayuno. Agregar un poco más de sal la próxima vez."
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
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d996?w=400&h=300&fit=crop"
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
        image: "https://images.unsplash.com/photo-1551248429-40975aa4de74?w=400&h=300&fit=crop"
      }
    ];

    initialRecipes.forEach(recipeData => {
      this.addRecipe(recipeData);
    });
  }

  /**
   * Event listener system
   */
  listeners = new Map();

  addEventListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  removeEventListener(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  notifyListeners(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Settings management
   */
  getSetting(key) {
    return this.settings[key];
  }

  setSetting(key, value) {
    this.settings[key] = value;
    this.saveToStorage();
    this.notifyListeners('settings:changed', { key, value });
  }

  getSettings() {
    return { ...this.settings };
  }

  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    this.saveToStorage();
    this.notifyListeners('settings:updated', this.settings);
  }
}

/**
 * ImageService Class - Handle image operations
 */
export class ImageService {
  static defaultImages = {
    recipe: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    ingredient: 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=100&h=100&fit=crop'
  };

  /**
   * Get default image for type
   */
  static getDefaultImage(type = 'recipe') {
    return this.defaultImages[type] || this.defaultImages.recipe;
  }

  /**
   * Convert file to base64
   */
  static fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }

  /**
   * Resize image to specific dimensions
   */
  static resizeImage(file, maxWidth = 800, maxHeight = 600, quality = 0.8) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        const resizedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(resizedDataUrl);
      };

      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Search for ingredient image (placeholder - in real app would use API)
   */
  static async searchIngredientImage(ingredient) {
    // Placeholder implementation - in real app would use Unsplash API or similar
    const ingredientImageMap = {
      'tomate': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=100&h=100&fit=crop',
      'cebolla': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=100&h=100&fit=crop',
      'ajo': 'https://images.unsplash.com/photo-1588427309898-79e1a504f3ea?w=100&h=100&fit=crop',
      'queso': 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=100&h=100&fit=crop',
      'huevo': 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=100&h=100&fit=crop',
      'pollo': 'https://images.unsplash.com/photo-1516656440124-a831dfc4b6bc?w=100&h=100&fit=crop',
      'pasta': 'https://images.unsplash.com/photo-1551892374-ecf8db2d85d9?w=100&h=100&fit=crop',
      'arroz': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100&h=100&fit=crop'
    };

    const searchTerm = ingredient.toLowerCase();
    for (const [key, url] of Object.entries(ingredientImageMap)) {
      if (searchTerm.includes(key)) {
        return url;
      }
    }

    return this.getDefaultImage('ingredient');
  }
}

/**
 * ValidationService Class - Data validation utilities
 */
export class ValidationService {
  /**
   * Validate recipe data
   */
  static validateRecipe(data) {
    const errors = [];

    if (!data.name || data.name.trim() === '') {
      errors.push('Recipe name is required');
    }

    if (!Array.isArray(data.ingredients) || data.ingredients.length === 0) {
      errors.push('At least one ingredient is required');
    }

    if (!Array.isArray(data.steps) || data.steps.length === 0) {
      errors.push('At least one preparation step is required');
    }

    if (!data.time || data.time < 1 || data.time > 480) {
      errors.push('Cooking time must be between 1 and 480 minutes');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Sanitize HTML to prevent XSS
   */
  static sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Validate and sanitize form data
   */
  static sanitizeFormData(data) {
    const sanitized = {};

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeHTML(value.trim());
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map(item => 
          typeof item === 'string' ? this.sanitizeHTML(item.trim()) : item
        );
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }
}

// Export singleton instance
export const recipeManager = RecipeManager.getInstance();
