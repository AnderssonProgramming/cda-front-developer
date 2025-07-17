// Main Application Class
class CocinaParaUnoApp {
  constructor() {
    this.storageManager = new StorageManager()
    this.translationManager = new TranslationManager()
    this.uiManager = new UIManager()
    this.ratingCalculator = new RatingCalculator()
    this.recipeManager = new RecipeManager(this.storageManager, this.uiManager, this.translationManager, this.ratingCalculator)
    this.exportManager = new ExportManager(this.translationManager) // Initialize ExportManager

    this.searchTerm = ""
    this.selectedCategory = "all"
    this.showFavorites = false
    this.darkMode = this.storageManager.loadDarkMode()
  }

  init() {
    this.applyTheme()
    this.translationManager.setLanguage(this.storageManager.loadLanguage())
    this.recipeManager.init()
    this.setupEventListeners()
    this.renderApp()
  }

  setupEventListeners() {
    // Header controls
    document.getElementById("theme-btn").addEventListener("click", () => this.toggleTheme())
    document.getElementById("language-btn").addEventListener("click", () => this.translationManager.cycleLanguage())

    // Search and filters
    document.getElementById("search-input").addEventListener("input", (e) => {
      this.searchTerm = e.target.value
      this.renderApp()
    })
    document.getElementById("category-filter").addEventListener("change", (e) => {
      this.selectedCategory = e.target.value
      this.renderApp()
    })
    document.getElementById("favorites-btn").addEventListener("click", (e) => {
      this.showFavorites = !this.showFavorites
      e.currentTarget.classList.toggle("active", this.showFavorites)
      this.renderApp()
    })

    // Recipe form buttons
    document.getElementById("new-recipe-btn").addEventListener("click", () => this.recipeManager.openRecipeForm())
    document.getElementById("create-first-btn").addEventListener("click", () => this.recipeManager.openRecipeForm())
    document.getElementById("cancel-btn").addEventListener("click", () => this.uiManager.closeModal("recipe"))
    document.getElementById("recipe-form").addEventListener("submit", (e) => this.recipeManager.handleFormSubmit(e))

    // Ingredient and Step buttons in form
    document
      .getElementById("add-ingredient-btn")
      .addEventListener("click", () => this.recipeManager.addFormIngredient())
    document.getElementById("add-step-btn").addEventListener("click", () => this.recipeManager.addFormStep())

    // Initial rendering of category filter options
    this.populateCategoryFilter()
  }

  populateCategoryFilter() {
    const categoryFilter = document.getElementById("category-filter")
    const t = this.translationManager.get.bind(this.translationManager)
    categoryFilter.innerHTML = `<option value="all">${t("allCategories")}</option>`
    this.recipeManager.categories.forEach((cat) => {
      const option = document.createElement("option")
      option.value = cat
      option.textContent = t(`categoryNames.${cat}`) || cat
      categoryFilter.appendChild(option)
    })
    categoryFilter.value = this.selectedCategory // Set initial selected category
  }

  renderApp() {
    this.recipeManager.renderRecipes(this.searchTerm, this.selectedCategory, this.showFavorites)
    this.uiManager.updateFooterStats(this.recipeManager.recipes)
    this.translationManager.updateUI() // Ensure all translated elements are updated
  }

  applyTheme() {
    document.body.classList.toggle("dark-mode", this.darkMode)
    const themeIcon = document.getElementById("theme-icon")
    if (themeIcon) {
      themeIcon.setAttribute("data-lucide", this.darkMode ? "sun" : "moon")
      window.lucide.createIcons() // Re-render icon
    }
  }

  toggleTheme() {
    this.darkMode = !this.darkMode
    this.storageManager.saveDarkMode(this.darkMode)
    this.applyTheme()
  }
}

// Initialize the application
window.onload = () => {
  window.app = new CocinaParaUnoApp()
  window.app.init()
}

// Initialize the app when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  window.app = new CocinaParaUnoApp()
  window.app.init()
})
