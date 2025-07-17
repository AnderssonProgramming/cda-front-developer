// Recipe Object Model and Data Structures
class Recipe {
  constructor(data = {}) {
    this.id = data.id || window.Utils.generateId()
    this.name = data.name || ""
    this.category = data.category || ""
    this.time = data.time || 0
    this.difficulty = data.difficulty || "easy"
    this.image = data.image || ""
    this.ingredients = data.ingredients || []
    this.steps = data.steps || []
    this.ingredientImages = data.ingredientImages || []
    this.notes = data.notes || ""
    this.manualRating = data.manualRating || 3
    this.autoRating = data.autoRating || 1
    this.finalRating = data.finalRating || 2
    this.timesCooked = data.timesCooked || 0
    this.favorite = data.favorite || false
    this.createdAt = data.createdAt || new Date()
    this.updatedAt = data.updatedAt || new Date()
    this.lastCooked = data.lastCooked || null
    this.tags = data.tags || []
    this.nutritionInfo = data.nutritionInfo || {}
  }

  // Validation methods
  isValid() {
    return this.name.trim() !== "" && 
           this.category !== "" && 
           this.time > 0 && 
           this.difficulty !== "" &&
           this.ingredients.length > 0 &&
           this.steps.length > 0
  }

  // Utility methods
  getDifficultyLevel() {
    const levels = {
      easy: 1,
      medium: 2,
      hard: 3
    }
    return levels[this.difficulty] || 1
  }

  getFormattedTime() {
    if (this.time < 60) {
      return `${this.time} min`
    } else {
      const hours = Math.floor(this.time / 60)
      const minutes = this.time % 60
      return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`
    }
  }

  getAgeInDays() {
    const now = new Date()
    const diffTime = Math.abs(now - this.createdAt)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  getDaysSinceLastCooked() {
    if (!this.lastCooked) return null
    const now = new Date()
    const diffTime = Math.abs(now - this.lastCooked)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  // Recipe manipulation methods
  markAsCooked() {
    this.timesCooked += 1
    this.lastCooked = new Date()
    this.updatedAt = new Date()
    this.updateRatings()
  }

  updateRatings() {
    this.autoRating = window.RatingCalculator.calculateAutoRating(this)
    this.finalRating = window.RatingCalculator.calculateFinalRating(this.manualRating, this.autoRating)
  }

  toggleFavorite() {
    this.favorite = !this.favorite
    this.updatedAt = new Date()
    this.updateRatings()
  }

  updateManualRating(rating) {
    this.manualRating = Math.max(1, Math.min(5, rating))
    this.updatedAt = new Date()
    this.updateRatings()
  }

  // Export methods
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      category: this.category,
      time: this.time,
      difficulty: this.difficulty,
      image: this.image,
      ingredients: this.ingredients,
      steps: this.steps,
      ingredientImages: this.ingredientImages,
      notes: this.notes,
      manualRating: this.manualRating,
      autoRating: this.autoRating,
      finalRating: this.finalRating,
      timesCooked: this.timesCooked,
      favorite: this.favorite,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      lastCooked: this.lastCooked,
      tags: this.tags,
      nutritionInfo: this.nutritionInfo
    }
  }

  toPlainObject() {
    return this.toJSON()
  }

  // Clone method
  clone() {
    return new Recipe(this.toJSON())
  }
}

// Recipe Collection/Manager Object
class RecipeCollection {
  constructor() {
    this.recipes = []
    this.filters = {
      search: "",
      category: "all",
      difficulty: "all",
      favorites: false,
      rating: 0
    }
  }

  // Collection management
  add(recipe) {
    if (recipe instanceof Recipe) {
      this.recipes.push(recipe)
    } else {
      this.recipes.push(new Recipe(recipe))
    }
  }

  remove(id) {
    this.recipes = this.recipes.filter(recipe => recipe.id !== id)
  }

  update(id, data) {
    const recipe = this.findById(id)
    if (recipe) {
      Object.assign(recipe, data)
      recipe.updatedAt = new Date()
      recipe.updateRatings()
    }
  }

  findById(id) {
    return this.recipes.find(recipe => recipe.id === id)
  }

  findByName(name) {
    return this.recipes.find(recipe => recipe.name.toLowerCase() === name.toLowerCase())
  }

  // Filtering methods
  getFiltered() {
    return this.recipes.filter(recipe => {
      // Search filter
      if (this.filters.search) {
        const searchTerm = this.filters.search.toLowerCase()
        const matchesSearch = 
          recipe.name.toLowerCase().includes(searchTerm) ||
          recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchTerm)) ||
          recipe.steps.some(step => step.toLowerCase().includes(searchTerm)) ||
          recipe.notes.toLowerCase().includes(searchTerm)
        
        if (!matchesSearch) return false
      }

      // Category filter
      if (this.filters.category !== "all" && recipe.category !== this.filters.category) {
        return false
      }

      // Difficulty filter
      if (this.filters.difficulty !== "all" && recipe.difficulty !== this.filters.difficulty) {
        return false
      }

      // Favorites filter
      if (this.filters.favorites && !recipe.favorite) {
        return false
      }

      // Rating filter
      if (this.filters.rating > 0 && recipe.finalRating < this.filters.rating) {
        return false
      }

      return true
    })
  }

  // Sorting methods
  sortBy(field, direction = "asc") {
    const multiplier = direction === "asc" ? 1 : -1
    
    return this.recipes.sort((a, b) => {
      let aValue = a[field]
      let bValue = b[field]
      
      if (field === "createdAt" || field === "updatedAt" || field === "lastCooked") {
        aValue = aValue ? aValue.getTime() : 0
        bValue = bValue ? bValue.getTime() : 0
      }
      
      if (aValue < bValue) return -1 * multiplier
      if (aValue > bValue) return 1 * multiplier
      return 0
    })
  }

  // Statistical methods
  getStats() {
    const total = this.recipes.length
    const favorites = this.recipes.filter(r => r.favorite).length
    const totalCookings = this.recipes.reduce((sum, r) => sum + r.timesCooked, 0)
    const averageRating = total > 0 ? this.recipes.reduce((sum, r) => sum + r.finalRating, 0) / total : 0
    
    const categoryStats = this.recipes.reduce((stats, recipe) => {
      stats[recipe.category] = (stats[recipe.category] || 0) + 1
      return stats
    }, {})

    const difficultyStats = this.recipes.reduce((stats, recipe) => {
      stats[recipe.difficulty] = (stats[recipe.difficulty] || 0) + 1
      return stats
    }, {})

    return {
      total,
      favorites,
      totalCookings,
      averageRating: Math.round(averageRating * 10) / 10,
      categoryStats,
      difficultyStats,
      mostCooked: this.getMostCooked(),
      leastCooked: this.getLeastCooked(),
      newest: this.getNewest(),
      oldest: this.getOldest()
    }
  }

  getMostCooked() {
    return this.recipes.reduce((max, recipe) => 
      recipe.timesCooked > max.timesCooked ? recipe : max, 
      this.recipes[0] || null
    )
  }

  getLeastCooked() {
    return this.recipes.reduce((min, recipe) => 
      recipe.timesCooked < min.timesCooked ? recipe : min, 
      this.recipes[0] || null
    )
  }

  getNewest() {
    return this.recipes.reduce((newest, recipe) => 
      recipe.createdAt > newest.createdAt ? recipe : newest, 
      this.recipes[0] || null
    )
  }

  getOldest() {
    return this.recipes.reduce((oldest, recipe) => 
      recipe.createdAt < oldest.createdAt ? recipe : oldest, 
      this.recipes[0] || null
    )
  }

  // Recommendation methods
  getRecommendations(limit = 5) {
    return window.RatingCalculator.getRecommendedRecipes(this.recipes, limit)
  }

  getTrending(limit = 5) {
    return window.RatingCalculator.getTrendingRecipes(this.recipes, limit)
  }

  // Export/Import methods
  toJSON() {
    return {
      recipes: this.recipes.map(recipe => recipe.toJSON()),
      filters: this.filters,
      exportedAt: new Date().toISOString()
    }
  }

  fromJSON(data) {
    this.recipes = data.recipes.map(recipeData => new Recipe(recipeData))
    this.filters = data.filters || this.filters
  }

  // Utility methods
  clear() {
    this.recipes = []
  }

  isEmpty() {
    return this.recipes.length === 0
  }

  size() {
    return this.recipes.length
  }
}

// User Settings Object
class UserSettings {
  constructor(data = {}) {
    this.theme = data.theme || "light"
    this.language = data.language || "es"
    this.notifications = data.notifications !== undefined ? data.notifications : true
    this.autoSave = data.autoSave !== undefined ? data.autoSave : true
    this.defaultCategory = data.defaultCategory || "almuerzo"
    this.defaultDifficulty = data.defaultDifficulty || "easy"
    this.defaultTime = data.defaultTime || 30
    this.showImages = data.showImages !== undefined ? data.showImages : true
    this.compactView = data.compactView !== undefined ? data.compactView : false
    this.autoUpdateRatings = data.autoUpdateRatings !== undefined ? data.autoUpdateRatings : true
    this.backupFrequency = data.backupFrequency || "weekly"
    this.maxRecipeHistory = data.maxRecipeHistory || 100
  }

  // Validation
  isValid() {
    const validThemes = ["light", "dark"]
    const validLanguages = ["es", "en", "fr"]
    const validCategories = ["desayuno", "almuerzo", "cena", "postre", "snack", "bebida"]
    const validDifficulties = ["easy", "medium", "hard"]
    const validBackupFrequencies = ["daily", "weekly", "monthly", "never"]

    return validThemes.includes(this.theme) &&
           validLanguages.includes(this.language) &&
           validCategories.includes(this.defaultCategory) &&
           validDifficulties.includes(this.defaultDifficulty) &&
           validBackupFrequencies.includes(this.backupFrequency) &&
           this.defaultTime > 0 &&
           this.maxRecipeHistory > 0
  }

  // Utility methods
  toJSON() {
    return {
      theme: this.theme,
      language: this.language,
      notifications: this.notifications,
      autoSave: this.autoSave,
      defaultCategory: this.defaultCategory,
      defaultDifficulty: this.defaultDifficulty,
      defaultTime: this.defaultTime,
      showImages: this.showImages,
      compactView: this.compactView,
      autoUpdateRatings: this.autoUpdateRatings,
      backupFrequency: this.backupFrequency,
      maxRecipeHistory: this.maxRecipeHistory
    }
  }

  clone() {
    return new UserSettings(this.toJSON())
  }

  reset() {
    const defaultSettings = new UserSettings()
    Object.assign(this, defaultSettings)
  }
}

// Application State Object
class AppState {
  constructor() {
    this.currentView = "recipes"
    this.selectedRecipe = null
    this.activeModal = null
    this.isLoading = false
    this.lastError = null
    this.isDirty = false
    this.lastSaved = null
    this.onlineStatus = navigator.onLine
  }

  // State management
  setState(newState) {
    Object.assign(this, newState)
    this.isDirty = true
  }

  clearError() {
    this.lastError = null
  }

  setLoading(loading) {
    this.isLoading = loading
  }

  setError(error) {
    this.lastError = error
    this.isLoading = false
  }

  markSaved() {
    this.isDirty = false
    this.lastSaved = new Date()
  }

  // Navigation methods
  navigateTo(view) {
    this.currentView = view
    this.selectedRecipe = null
    this.activeModal = null
  }

  openModal(modalName, recipe = null) {
    this.activeModal = modalName
    this.selectedRecipe = recipe
  }

  closeModal() {
    this.activeModal = null
    this.selectedRecipe = null
  }

  // Utility methods
  toJSON() {
    return {
      currentView: this.currentView,
      selectedRecipe: this.selectedRecipe,
      activeModal: this.activeModal,
      isLoading: this.isLoading,
      lastError: this.lastError,
      isDirty: this.isDirty,
      lastSaved: this.lastSaved,
      onlineStatus: this.onlineStatus
    }
  }
}

// Export objects for global use
window.Recipe = Recipe
window.RecipeCollection = RecipeCollection
window.UserSettings = UserSettings
window.AppState = AppState