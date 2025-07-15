/**
 * COCINA PARA UNO - OBJECTS MODULE
 * JavaScript Objects and Classes for data modeling
 * Author: CDA Front Developer
 * Date: 2024
 */

/**
 * Recipe Class - Core data model for recipes
 */
export class Recipe {
  constructor(data = {}) {
    // Required properties with defaults
    this.id = data.id || this.generateId();
    this.title = data.title || '';
    this.description = data.description || '';
    this.ingredients = Array.isArray(data.ingredients) ? [...data.ingredients] : [];
    this.steps = Array.isArray(data.steps) ? [...data.steps] : [];
    this.categories = Array.isArray(data.categories) ? [...data.categories] : [];
    
    // Optional properties with defaults
    this.cookingTime = this.validateCookingTime(data.cookingTime) || 15;
    this.difficulty = this.validateDifficulty(data.difficulty) || 'fácil';
    this.servings = this.validateServings(data.servings) || 1;
    this.imageUrl = data.imageUrl || '';
    this.isFavorite = Boolean(data.isFavorite);
    this.tags = Array.isArray(data.tags) ? [...data.tags] : [];
    
    // Metadata
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.author = data.author || 'Usuario';
    this.source = data.source || '';
    this.notes = data.notes || '';
    
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
    return 'recipe_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
  }

  /**
   * Validate cooking time
   */
  validateCookingTime(time) {
    const numTime = parseInt(time);
    return (numTime && numTime > 0 && numTime <= 1440) ? numTime : null;
  }

  /**
   * Validate difficulty level
   */
  validateDifficulty(difficulty) {
    const validDifficulties = ['muy fácil', 'fácil', 'intermedio', 'difícil', 'muy difícil'];
    return validDifficulties.includes(difficulty) ? difficulty : null;
  }

  /**
   * Validate number of servings
   */
  validateServings(servings) {
    const numServings = parseInt(servings);
    return (numServings && numServings > 0 && numServings <= 20) ? numServings : null;
  }

  /**
   * Basic validation for required fields
   */
  validate() {
    const errors = [];

    if (!this.title || this.title.trim().length < 3) {
      errors.push('El título debe tener al menos 3 caracteres');
    }

    if (!this.description || this.description.trim().length < 10) {
      errors.push('La descripción debe tener al menos 10 caracteres');
    }

    if (!this.ingredients || this.ingredients.length === 0) {
      errors.push('La receta debe tener al menos un ingrediente');
    }

    if (!this.steps || this.steps.length === 0) {
      errors.push('La receta debe tener al menos un paso');
    }

    if (this.categories.length === 0) {
      errors.push('La receta debe tener al menos una categoría');
    }

    if (errors.length > 0) {
      console.warn('Recipe validation warnings:', errors);
    }

    return errors;
  }

  /**
   * Update recipe properties
   */
  update(data) {
    const oldData = this.toJSON();
    
    // Update properties if provided
    if (data.title !== undefined) this.title = data.title;
    if (data.description !== undefined) this.description = data.description;
    if (data.ingredients !== undefined) this.ingredients = [...data.ingredients];
    if (data.steps !== undefined) this.steps = [...data.steps];
    if (data.categories !== undefined) this.categories = [...data.categories];
    if (data.cookingTime !== undefined) this.cookingTime = this.validateCookingTime(data.cookingTime) || this.cookingTime;
    if (data.difficulty !== undefined) this.difficulty = this.validateDifficulty(data.difficulty) || this.difficulty;
    if (data.servings !== undefined) this.servings = this.validateServings(data.servings) || this.servings;
    if (data.imageUrl !== undefined) this.imageUrl = data.imageUrl;
    if (data.tags !== undefined) this.tags = [...data.tags];
    if (data.source !== undefined) this.source = data.source;
    if (data.notes !== undefined) this.notes = data.notes;
    if (data.nutrition !== undefined) this.nutrition = { ...this.nutrition, ...data.nutrition };

    // Always update timestamp
    this.updatedAt = new Date().toISOString();

    // Validate after update
    const errors = this.validate();
    if (errors.length > 0) {
      // Revert on validation failure
      Object.assign(this, oldData);
      throw new Error('Validation failed: ' + errors.join(', '));
    }

    return this;
  }

  /**
   * Toggle favorite status
   */
  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
    this.updatedAt = new Date().toISOString();
    return this.isFavorite;
  }

  /**
   * Add a category if not already present
   */
  addCategory(category) {
    const validCategories = ['breakfast', 'lunch', 'dinner', 'dessert', 'vegetarian', 'quick'];
    if (validCategories.includes(category) && !this.categories.includes(category)) {
      this.categories.push(category);
      this.updatedAt = new Date().toISOString();
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
      this.updatedAt = new Date().toISOString();
    }
    return this;
  }

  /**
   * Add an ingredient
   */
  addIngredient(ingredient) {
    if (ingredient?.trim()) {
      this.ingredients.push(ingredient.trim());
      this.updatedAt = new Date().toISOString();
    }
    return this;
  }

  /**
   * Remove an ingredient by index
   */
  removeIngredient(index) {
    if (index >= 0 && index < this.ingredients.length) {
      this.ingredients.splice(index, 1);
      this.updatedAt = new Date().toISOString();
    }
    return this;
  }

  /**
   * Add a step
   */
  addStep(step) {
    if (step?.trim()) {
      this.steps.push(step.trim());
      this.updatedAt = new Date().toISOString();
    }
    return this;
  }

  /**
   * Remove a step by index
   */
  removeStep(index) {
    if (index >= 0 && index < this.steps.length) {
      this.steps.splice(index, 1);
      this.updatedAt = new Date().toISOString();
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
    return this.getEstimatedPrepTime() + this.cookingTime;
  }

  /**
   * Get difficulty score (1-5)
   */
  getDifficultyScore() {
    const scores = {
      'muy fácil': 1,
      'fácil': 2,
      'intermedio': 3,
      'difícil': 4,
      'muy difícil': 5
    };
    return scores[this.difficulty] || 2;
  }

  /**
   * Check if recipe matches search criteria
   */
  matchesSearch(query) {
    if (!query) return true;
    
    const searchQuery = query.toLowerCase();
    
    return this.title.toLowerCase().includes(searchQuery) ||
           this.description.toLowerCase().includes(searchQuery) ||
           this.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchQuery)) ||
           this.steps.some(step => step.toLowerCase().includes(searchQuery)) ||
           this.categories.some(category => category.toLowerCase().includes(searchQuery)) ||
           this.tags.some(tag => tag.toLowerCase().includes(searchQuery)) ||
           this.notes.toLowerCase().includes(searchQuery);
  }

  /**
   * Check if recipe has category
   */
  hasCategory(category) {
    return this.categories.includes(category);
  }

  /**
   * Get formatted cooking time
   */
  getFormattedCookingTime() {
    if (this.cookingTime < 60) {
      return `${this.cookingTime} min`;
    } else {
      const hours = Math.floor(this.cookingTime / 60);
      const minutes = this.cookingTime % 60;
      return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
    }
  }

  /**
   * Clone recipe with new ID
   */
  clone() {
    const clonedData = this.toJSON();
    clonedData.id = this.generateId();
    clonedData.title = `Copia de ${clonedData.title}`;
    clonedData.isFavorite = false;
    clonedData.createdAt = new Date().toISOString();
    clonedData.updatedAt = new Date().toISOString();
    
    return new Recipe(clonedData);
  }

  /**
   * Export to JSON
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      ingredients: [...this.ingredients],
      steps: [...this.steps],
      categories: [...this.categories],
      cookingTime: this.cookingTime,
      difficulty: this.difficulty,
      servings: this.servings,
      imageUrl: this.imageUrl,
      isFavorite: this.isFavorite,
      tags: [...this.tags],
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      author: this.author,
      source: this.source,
      notes: this.notes,
      nutrition: { ...this.nutrition }
    };
  }

  /**
   * Export to string for sharing
   */
  toString() {
    let str = `${this.title}\n${'='.repeat(this.title.length)}\n\n`;
    
    str += `Descripción: ${this.description}\n`;
    str += `Tiempo de cocción: ${this.getFormattedCookingTime()}\n`;
    str += `Dificultad: ${this.difficulty}\n`;
    str += `Porciones: ${this.servings}\n`;
    str += `Categorías: ${this.categories.join(', ')}\n\n`;
    
    str += `INGREDIENTES:\n`;
    this.ingredients.forEach((ingredient, index) => {
      str += `${index + 1}. ${ingredient}\n`;
    });
    
    str += `\nPASOS:\n`;
    this.steps.forEach((step, index) => {
      str += `${index + 1}. ${step}\n`;
    });
    
    if (this.notes) {
      str += `\nNotas: ${this.notes}\n`;
    }
    
    return str;
  }
}

/**
 * RecipeCollection Class - Manages a collection of recipes
 */
export class RecipeCollection {
  constructor() {
    this.recipes = new Map();
    this.listeners = new Map();
  }

  /**
   * Add a recipe to the collection
   */
  add(recipe) {
    if (!(recipe instanceof Recipe)) {
      throw new Error('Only Recipe instances can be added to the collection');
    }
    
    this.recipes.set(recipe.id, recipe);
    this.notifyListeners('add', recipe);
    return recipe;
  }

  /**
   * Get a recipe by ID
   */
  get(id) {
    return this.recipes.get(id) || null;
  }

  /**
   * Update a recipe
   */
  update(id, data) {
    const recipe = this.recipes.get(id);
    if (recipe) {
      recipe.update(data);
      this.notifyListeners('update', recipe);
      return recipe;
    }
    return null;
  }

  /**
   * Delete a recipe
   */
  delete(id) {
    const recipe = this.recipes.get(id);
    if (recipe) {
      this.recipes.delete(id);
      this.notifyListeners('delete', recipe);
      return recipe;
    }
    return null;
  }

  /**
   * Get all recipes as an array
   */
  getAll() {
    return Array.from(this.recipes.values());
  }

  /**
   * Get recipes by category
   */
  getByCategory(category) {
    return this.getAll().filter(recipe => recipe.hasCategory(category));
  }

  /**
   * Get favorite recipes
   */
  getFavorites() {
    return this.getAll().filter(recipe => recipe.isFavorite);
  }

  /**
   * Search recipes
   */
  search(query) {
    return this.getAll().filter(recipe => recipe.matchesSearch(query));
  }

  /**
   * Get recipes sorted by criteria
   */
  getSorted(criteria = 'title', direction = 'asc') {
    const recipes = this.getAll();
    
    return recipes.sort((a, b) => {
      let aValue, bValue;
      
      switch (criteria) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'cookingTime':
          aValue = a.cookingTime;
          bValue = b.cookingTime;
          break;
        case 'difficulty':
          aValue = a.getDifficultyScore();
          bValue = b.getDifficultyScore();
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'updatedAt':
          aValue = new Date(a.updatedAt);
          bValue = new Date(b.updatedAt);
          break;
        case 'favorite':
          aValue = a.isFavorite ? 1 : 0;
          bValue = b.isFavorite ? 1 : 0;
          break;
        default:
          return 0; // Keep original order for unknown criteria
      }
      
      if (direction === 'desc') {
        [aValue, bValue] = [bValue, aValue];
      }
      
      if (aValue < bValue) return -1;
      if (aValue > bValue) return 1;
      return 0;
    });
  }

  /**
   * Get unique categories from all recipes
   */
  getUniqueCategories() {
    const categories = new Set();
    this.getAll().forEach(recipe => {
      recipe.categories.forEach(category => categories.add(category));
    });
    return Array.from(categories);
  }

  /**
   * Get unique tags from all recipes
   */
  getUniqueTags() {
    const tags = new Set();
    this.getAll().forEach(recipe => {
      recipe.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }

  /**
   * Get statistics about the collection
   */
  getStatistics() {
    const recipes = this.getAll();
    const totalRecipes = recipes.length;
    
    if (totalRecipes === 0) {
      return {
        total: 0,
        favorites: 0,
        categories: 0,
        avgCookingTime: 0,
        difficultyDistribution: {},
        categoryDistribution: {}
      };
    }

    const favorites = recipes.filter(r => r.isFavorite).length;
    const categories = this.getUniqueCategories().length;
    const avgCookingTime = Math.round(
      recipes.reduce((sum, r) => sum + r.cookingTime, 0) / totalRecipes
    );

    // Difficulty distribution
    const difficultyDistribution = {};
    recipes.forEach(recipe => {
      const diff = recipe.difficulty;
      difficultyDistribution[diff] = (difficultyDistribution[diff] || 0) + 1;
    });

    // Category distribution
    const categoryDistribution = {};
    recipes.forEach(recipe => {
      recipe.categories.forEach(category => {
        categoryDistribution[category] = (categoryDistribution[category] || 0) + 1;
      });
    });

    return {
      total: totalRecipes,
      favorites,
      categories,
      avgCookingTime,
      difficultyDistribution,
      categoryDistribution
    };
  }

  /**
   * Filter recipes by multiple criteria
   */
  filter(criteria) {
    return this.getAll().filter(recipe => {
      return this._matchesCategoryFilter(recipe, criteria) &&
             this._matchesCookingTimeFilter(recipe, criteria) &&
             this._matchesDifficultyFilter(recipe, criteria) &&
             this._matchesFavoritesFilter(recipe, criteria) &&
             this._matchesSearchFilter(recipe, criteria);
    });
  }

  /**
   * Helper methods for filtering
   */
  _matchesCategoryFilter(recipe, criteria) {
    if (!criteria.categories || criteria.categories.length === 0) return true;
    return criteria.categories.some(cat => recipe.hasCategory(cat));
  }

  _matchesCookingTimeFilter(recipe, criteria) {
    return (!criteria.maxCookingTime || recipe.cookingTime <= criteria.maxCookingTime) &&
           (!criteria.minCookingTime || recipe.cookingTime >= criteria.minCookingTime);
  }

  _matchesDifficultyFilter(recipe, criteria) {
    if (!criteria.difficulties || criteria.difficulties.length === 0) return true;
    return criteria.difficulties.includes(recipe.difficulty);
  }

  _matchesFavoritesFilter(recipe, criteria) {
    return !criteria.onlyFavorites || recipe.isFavorite;
  }

  _matchesSearchFilter(recipe, criteria) {
    if (!criteria.search) return true;
    return recipe.matchesSearch(criteria.search);
  }

  /**
   * Get random recipe
   */
  getRandom() {
    const recipes = this.getAll();
    if (recipes.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * recipes.length);
    return recipes[randomIndex];
  }

  /**
   * Get random recipes with count
   */
  getRandomRecipes(count = 3) {
    const recipes = this.getAll();
    if (recipes.length === 0) return [];
    
    const shuffled = [...recipes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, recipes.length));
  }

  /**
   * Export collection to JSON
   */
  toJSON() {
    return {
      recipes: this.getAll().map(recipe => recipe.toJSON()),
      metadata: {
        totalRecipes: this.recipes.size,
        exportDate: new Date().toISOString(),
        statistics: this.getStatistics()
      }
    };
  }

  /**
   * Import recipes from JSON data
   */
  fromJSON(data) {
    if (data.recipes && Array.isArray(data.recipes)) {
      data.recipes.forEach(recipeData => {
        try {
          const recipe = new Recipe(recipeData);
          this.add(recipe);
        } catch (error) {
          console.error('Error importing recipe:', error, recipeData);
        }
      });
    }
    return this;
  }

  /**
   * Clear all recipes
   */
  clear() {
    const deletedRecipes = this.getAll();
    this.recipes.clear();
    this.notifyListeners('clear', deletedRecipes);
    return deletedRecipes;
  }

  /**
   * Check if collection is empty
   */
  isEmpty() {
    return this.recipes.size === 0;
  }

  /**
   * Get collection size
   */
  size() {
    return this.recipes.size;
  }

  /**
   * Event listener management
   */
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
          console.error('Error in event listener:', error);
        }
      });
    }
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
      title: '',
      description: '',
      ingredients: [],
      steps: [],
      categories: [],
      cookingTime: 15,
      difficulty: 'fácil',
      servings: 1,
      tags: []
    };
    return this;
  }

  setTitle(title) {
    this.recipeData.title = title;
    return this;
  }

  setDescription(description) {
    this.recipeData.description = description;
    return this;
  }

  addIngredient(ingredient) {
    this.recipeData.ingredients.push(ingredient);
    return this;
  }

  addIngredients(ingredients) {
    this.recipeData.ingredients.push(...ingredients);
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

  setCookingTime(time) {
    this.recipeData.cookingTime = time;
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

  setImageUrl(url) {
    this.recipeData.imageUrl = url;
    return this;
  }

  addTag(tag) {
    if (!this.recipeData.tags.includes(tag)) {
      this.recipeData.tags.push(tag);
    }
    return this;
  }

  build() {
    const recipe = new Recipe(this.recipeData);
    this.reset(); // Reset for next use
    return recipe;
  }
}

/**
 * Utility functions for recipe management
 */
export const RecipeUtils = {
  /**
   * Create a recipe from plain text
   */
  fromText(text) {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    const builder = new RecipeBuilder();
    
    let currentSection = 'title';
    
    lines.forEach(line => {
      if (line.toLowerCase().includes('ingredientes')) {
        currentSection = 'ingredients';
      } else if (line.toLowerCase().includes('pasos') || line.toLowerCase().includes('instrucciones')) {
        currentSection = 'steps';
      } else if (currentSection === 'title' && !builder.recipeData.title) {
        builder.setTitle(line);
        currentSection = 'description';
      } else if (currentSection === 'description' && !builder.recipeData.description) {
        builder.setDescription(line);
      } else if (currentSection === 'ingredients') {
        const ingredient = line.replace(/^\d+\.?\s*/, ''); // Remove numbering
        if (ingredient) builder.addIngredient(ingredient);
      } else if (currentSection === 'steps') {
        const step = line.replace(/^\d+\.?\s*/, ''); // Remove numbering
        if (step) builder.addStep(step);
      }
    });
    
    return builder.build();
  },

  /**
   * Convert cooking time to human readable format
   */
  formatCookingTime(minutes) {
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
    }
  },

  /**
   * Get difficulty color
   */
  getDifficultyColor(difficulty) {
    const colors = {
      'muy fácil': '#27AE60',
      'fácil': '#2ECC71',
      'intermedio': '#F1C40F',
      'difícil': '#E67E22',
      'muy difícil': '#E74C3C'
    };
    return colors[difficulty] || '#95A5A6';
  },

  /**
   * Calculate recipe complexity score
   */
  getComplexityScore(recipe) {
    let score = 0;
    
    // Base on difficulty
    score += recipe.getDifficultyScore() * 2;
    
    // Base on number of ingredients
    score += Math.min(recipe.ingredients.length * 0.5, 5);
    
    // Base on number of steps
    score += Math.min(recipe.steps.length * 0.3, 3);
    
    // Base on cooking time
    if (recipe.cookingTime > 60) score += 2;
    else if (recipe.cookingTime > 30) score += 1;
    
    return Math.round(score);
  },

  /**
   * Validate recipe data before creating Recipe instance
   */
  validateRecipeData(data) {
    const errors = [];
    
    if (!data.title || data.title.trim().length < 3) {
      errors.push('Title must be at least 3 characters');
    }
    
    if (!data.description || data.description.trim().length < 10) {
      errors.push('Description must be at least 10 characters');
    }
    
    if (!data.ingredients || !Array.isArray(data.ingredients) || data.ingredients.length === 0) {
      errors.push('At least one ingredient is required');
    }
    
    if (!data.steps || !Array.isArray(data.steps) || data.steps.length === 0) {
      errors.push('At least one step is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
};