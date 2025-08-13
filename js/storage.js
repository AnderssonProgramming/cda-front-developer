// Storage Manager - Handles localStorage operations
class StorageManager {
  constructor() {
    this.storageKeys = {
      recipes: "cocina-para-uno-recipes",
      settings: "cocina-para-uno-settings",
      language: "cocina-para-uno-language",
      theme: "cocina-para-uno-theme",
    }

    this.defaultSettings = {
      theme: "light",
      language: "es",
      notifications: true,
      autoSave: true,
    }

    this.storageKey = "cocinaParaUnoRecipes"
    this.darkModeKey = "cocinaParaUnoDarkMode"
    this.languageKey = "cocinaParaUnoLanguage"
  }

  // Recipe operations
  loadRecipes() {
    try {
      const recipes = localStorage.getItem(this.storageKeys.recipes)
      const savedRecipes = localStorage.getItem(this.storageKey)
      if (recipes) {
        const parsedRecipes = JSON.parse(recipes)
        // Convert date strings back to Date objects
        return parsedRecipes.map((recipe) => ({
          ...recipe,
          createdAt: new Date(recipe.createdAt),
          lastCooked: recipe.lastCooked ? new Date(recipe.lastCooked) : null,
          cookingHistory: recipe.cookingHistory ? recipe.cookingHistory.map((date) => new Date(date)) : [],
        }))
      } else if (savedRecipes) {
        const parsed = JSON.parse(savedRecipes)
        // Migrate dates back to Date objects
        return parsed.map((r) => ({
          ...r,
          createdAt: new Date(r.createdAt),
          lastCooked: r.lastCooked ? new Date(r.lastCooked) : undefined,
          cookingHistory: r.cookingHistory ? r.cookingHistory.map((d) => new Date(d)) : [],
        }))
      }
      return [] // Return empty array when no recipes found
    } catch (error) {
      console.error("Error loading recipes:", error)
      localStorage.removeItem(this.storageKey) // Clear corrupted data
      return []
    }
  }

  saveRecipes(recipes) {
    try {
      localStorage.setItem(this.storageKeys.recipes, JSON.stringify(recipes))
      localStorage.setItem(this.storageKey, JSON.stringify(recipes))
      return true
    } catch (error) {
      console.error("Error saving recipes:", error)
      if (window.Utils && window.Utils.showToast) {
        window.Utils.showToast("Error al guardar las recetas", "error")
      }
      return false
    }
  }

  // Settings operations
  loadSettings() {
    try {
      const settings = localStorage.getItem(this.storageKeys.settings)
      return settings ? { ...this.defaultSettings, ...JSON.parse(settings) } : this.defaultSettings
    } catch (error) {
      console.error("Error loading settings:", error)
      return this.defaultSettings
    }
  }

  saveSettings(settings) {
    try {
      localStorage.setItem(this.storageKeys.settings, JSON.stringify(settings))
      return true
    } catch (error) {
      console.error("Error saving settings:", error)
      return false
    }
  }

  // Individual setting operations
  saveTheme(theme) {
    const settings = this.loadSettings()
    settings.theme = theme
    return this.saveSettings(settings)
  }

  loadDarkMode() {
    try {
      const savedDarkMode = localStorage.getItem(this.darkModeKey)
      return savedDarkMode ? JSON.parse(savedDarkMode) : false
    } catch (e) {
      console.error("Error loading dark mode from localStorage:", e)
    }
    return false
  }

  saveDarkMode(isDarkMode) {
    try {
      localStorage.setItem(this.darkModeKey, JSON.stringify(isDarkMode))
    } catch (e) {
      console.error("Error saving dark mode to localStorage:", e)
    }
  }

  loadLanguage() {
    try {
      const settings = this.loadSettings()
      return settings.language || "es"
    } catch (error) {
      console.error("Error loading language:", error)
      return "es"
    }
  }

  saveLanguage(lang) {
    try {
      const settings = this.loadSettings()
      settings.language = lang
      this.saveSettings(settings)
    } catch (error) {
      console.error("Error saving language:", error)
    }
  }

  loadTheme() {
    try {
      const settings = this.loadSettings()
      return settings.theme || "light"
    } catch (error) {
      console.error("Error loading theme:", error)
      return "light"
    }
  }

  // Recipe validation
  validateRecipe(recipe) {
    try {
      const requiredFields = ['id', 'name', 'ingredients', 'instructions']
      const hasRequiredFields = requiredFields.every(field => recipe.hasOwnProperty(field))
      
      if (!hasRequiredFields) return false
      
      // Check data types
      if (typeof recipe.id !== 'string') return false
      if (typeof recipe.name !== 'string') return false
      if (!Array.isArray(recipe.ingredients)) return false
      if (!Array.isArray(recipe.instructions)) return false
      
      return true
    } catch (error) {
      console.error("Error validating recipe:", error)
      return false
    }
  }

  // Data repair
  repairData(recipes) {
    try {
      return recipes.filter(recipe => {
        if (!recipe.id) {
          recipe.id = this.generateId()
        }
        if (!recipe.ingredients) {
          recipe.ingredients = []
        }
        if (!recipe.instructions) {
          recipe.instructions = []
        }
        if (!recipe.createdAt) {
          recipe.createdAt = new Date()
        }
        if (!recipe.cookingHistory) {
          recipe.cookingHistory = []
        }
        
        return this.validateRecipe(recipe)
      })
    } catch (error) {
      console.error("Error repairing data:", error)
      return []
    }
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // Storage info
  getStorageInfo() {
    try {
      const recipes = localStorage.getItem(this.storageKeys.recipes)
      const settings = localStorage.getItem(this.storageKeys.settings)

      const recipesSize = recipes ? new Blob([recipes]).size : 0
      const settingsSize = settings ? new Blob([settings]).size : 0
      const totalSize = recipesSize + settingsSize

      // Get available storage (approximate)
      const totalStorage = 5 * 1024 * 1024 // 5MB typical localStorage limit
      const usedPercentage = (totalSize / totalStorage) * 100

      return {
        totalSize: window.Utils ? window.Utils.formatFileSize(totalSize) : `${totalSize} Bytes`,
        recipesSize: window.Utils ? window.Utils.formatFileSize(recipesSize) : `${recipesSize} Bytes`,
        settingsSize: window.Utils ? window.Utils.formatFileSize(settingsSize) : `${settingsSize} Bytes`,
        usedPercentage: Math.round(usedPercentage * 100) / 100,
        availableSpace: window.Utils ? window.Utils.formatFileSize(totalStorage - totalSize) : "Unknown",
        used: totalSize,
        keys: Object.keys(localStorage)
      }
    } catch (error) {
      console.error("Error getting storage info:", error)
      return {
        totalSize: "0 Bytes",
        recipesSize: "0 Bytes",
        settingsSize: "0 Bytes",
        usedPercentage: 0,
        availableSpace: "Unknown",
        used: 0,
        keys: []
      }
    }
  }

  // Export all data
  exportData() {
    try {
      const data = {
        recipes: this.loadRecipes(),
        settings: this.loadSettings(),
        exportDate: new Date().toISOString(),
        version: "1.0",
      }

      const dataStr = JSON.stringify(data, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })

      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `cocina-para-uno-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      return true
    } catch (error) {
      console.error("Error exporting data:", error)
      throw error
    }
  }

  // Import data
  async importData(file) {
    try {
      const text = await file.text()
      const data = JSON.parse(text)

      // Validate data structure
      if (!data.recipes || !Array.isArray(data.recipes)) {
        throw new Error("Invalid backup file format")
      }

      // Backup current data
      const currentData = {
        recipes: this.loadRecipes(),
        settings: this.loadSettings(),
      }

      try {
        // Import recipes
        if (data.recipes) {
          this.saveRecipes(data.recipes)
        }

        // Import settings
        if (data.settings) {
          this.saveSettings({ ...this.defaultSettings, ...data.settings })
        }

        return true
      } catch (importError) {
        // Restore backup on error
        this.saveRecipes(currentData.recipes)
        this.saveSettings(currentData.settings)
        throw importError
      }
    } catch (error) {
      console.error("Error importing data:", error)
      throw error
    }
  }

  // Clear all data
  clearAllData() {
    try {
      Object.values(this.storageKeys).forEach((key) => {
        localStorage.removeItem(key)
      })

      if (window.Utils && window.Utils.showToast) {
        window.Utils.showToast("Todos los datos han sido eliminados", "success")
      }

      // Reload page after clearing
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.location) {
          window.location.reload()
        }
      }, 1000)

      return true
    } catch (error) {
      console.error("Error clearing data:", error)
      if (window.Utils && window.Utils.showToast) {
        window.Utils.showToast("Error al eliminar los datos", "error")
      }
      return false
    }
  }

  // Check storage quota
  async checkStorageQuota() {
    if ("storage" in navigator && "estimate" in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate()
        return {
          quota: estimate.quota,
          usage: estimate.usage,
          available: estimate.quota - estimate.usage,
          usagePercentage: (estimate.usage / estimate.quota) * 100,
        }
      } catch (error) {
        console.error("Error checking storage quota:", error)
      }
    }
    return null
  }

  // Cleanup old data (if needed)
  cleanup() {
    try {
      const recipes = this.loadRecipes()
      const oneYearAgo = new Date()
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

      // Remove cooking history older than 1 year
      const cleanedRecipes = recipes.map((recipe) => ({
        ...recipe,
        cookingHistory: recipe.cookingHistory.filter((date) => date > oneYearAgo),
      }))

      this.saveRecipes(cleanedRecipes)
      return true
    } catch (error) {
      console.error("Error cleaning up old data:", error)
      return false
    }
  }
}

// Export for global use
window.StorageManager = StorageManager
