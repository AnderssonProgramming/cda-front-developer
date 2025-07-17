// Main Application Class
class CocinaParaUnoApp {
  constructor() {
    // Initialize managers
    this.storageManager = new window.StorageManager()
    this.translationManager = new window.TranslationManager()
    this.uiManager = new window.UIManager()
    this.exportManager = new window.ExportManager(this.translationManager) // Pass translation manager
    this.recipeManager = new window.RecipeManager(this.storageManager, this.uiManager, this.translationManager)

    this.init()
  }

  init() {
    // Load saved settings (theme, language)
    this.loadSettings()

    // Setup global event listeners (theme, language, shortcuts)
    this.setupGlobalEventListeners()

    // Initial UI update based on loaded data
    this.translationManager.updateUI()

    // Initialize Lucide icons after DOM is ready
    this.initializeLucideIcons()

    console.log("Cocina para Uno initialized successfully! 🍳")
  }

  loadSettings() {
    const settings = this.storageManager.loadSettings()
    this.setTheme(settings.theme)
    this.translationManager.setLanguage(settings.language)
  }

  setupGlobalEventListeners() {
    // Theme toggle button
    document.getElementById("theme-btn").addEventListener("click", () => {
      this.toggleTheme()
    })

    // Language cycle button
    document.getElementById("language-btn").addEventListener("click", () => {
      this.translationManager.cycleLanguage()
      this.storageManager.saveLanguage(this.translationManager.currentLanguage)
    })

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      // Ctrl/Cmd + N for new recipe
      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault()
        this.recipeManager.openRecipeForm()
      }
      // Ctrl/Cmd + F for search focus
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault()
        document.getElementById("search-input").focus()
      }
    })

    // Online/offline status
    window.addEventListener("online", () => {
      window.Utils.showToast(this.translationManager.get("connectionRestored"), "success")
    })
    window.addEventListener("offline", () => {
      window.Utils.showToast(this.translationManager.get("noInternetConnection"), "warning")
    })
  }

  initializeLucideIcons() {
    // Ensure Lucide icons are rendered after dynamic content is added
    if (window.lucide) {
      window.lucide.createIcons()
    } else {
      // Fallback if script loads later
      setTimeout(() => {
        if (window.lucide) {
          window.lucide.createIcons()
        }
      }, 500)
    }
  }

  // Theme management
  toggleTheme() {
    const currentTheme = document.body.classList.contains("dark-mode") ? "dark" : "light"
    const newTheme = currentTheme === "dark" ? "light" : "dark"
    this.setTheme(newTheme)
    this.storageManager.saveTheme(newTheme)
  }

  setTheme(theme) {
    document.body.className = theme === "dark" ? "dark-mode" : "light-mode"
    const themeIcon = document.getElementById("theme-icon")
    if (themeIcon) {
      themeIcon.setAttribute("data-lucide", theme === "dark" ? "sun" : "moon")
      if (window.lucide) {
        window.lucide.createIcons() // Re-render icon
      }
    }
  }

  // Public methods for debugging/console access
  exportData() {
    try {
      this.storageManager.exportData()
      window.Utils.showToast(this.translationManager.get("dataExportedSuccess"), "success")
    } catch (error) {
      console.error("Export error:", error)
      window.Utils.showToast(this.translationManager.get("dataExportError"), "error")
    }
  }

  async importData(file) {
    try {
      await this.storageManager.importData(file)
      window.Utils.showToast(this.translationManager.get("dataImportedSuccess"), "success")
      // Reload app to reflect imported data
      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
      console.error("Import error:", error)
      window.Utils.showToast(`${this.translationManager.get("dataImportError")}: ${error.message}`, "error")
    }
  }

  clearAllData() {
    this.storageManager.clearAllData()
  }

  getAppStats() {
    return window.RatingCalculator.getGlobalStats(this.recipeManager.recipes)
  }

  debug() {
    console.log("=== Cocina para Uno Debug Info ===")
    console.log("Recipes:", this.recipeManager.recipes)
    console.log("Filtered Recipes:", this.recipeManager.filteredRecipes)
    console.log("Current Filter:", this.recipeManager.currentFilter)
    console.log("Settings:", this.storageManager.loadSettings())
    console.log("Storage Info:", this.storageManager.getStorageInfo())
    console.log("App Stats:", this.getAppStats())
    console.log("================================")
  }
}

// Initialize app when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  window.app = new CocinaParaUnoApp()

  // Expose app to global scope for easier debugging in console
  window.CocinaParaUno = window.app
})

// PWA Service Worker Registration
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw.js")
      .then((registration) => {
        console.log("Service Worker registered:", registration)
      })
      .catch((registrationError) => {
        console.log("Service Worker registration failed:", registrationError)
      })
  })
}

// Handle app installation prompt
let deferredPrompt
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault()
  deferredPrompt = e
  window.Utils.showToast(window.app.translationManager.get("installAppPrompt"), "info")
})

window.addEventListener("appinstalled", () => {
  window.Utils.showToast(window.app.translationManager.get("appInstalledSuccess"), "success")
  deferredPrompt = null
})
