// Recipe Manager
class RecipeManager {
  constructor(storageManager, uiManager, translationManager, ratingCalculator) {
    this.storageManager = storageManager
    this.uiManager = uiManager
    this.translationManager = translationManager
    this.ratingCalculator = ratingCalculator
    this.recipes = []
    this.editingRecipe = null
    this.categories = [
      "Desayuno",
      "Almuerzo",
      "Cena",
      "Postre",
      "Snack",
      "Vegetariano",
      "Vegano",
      "Sin Gluten",
      "Rápido",
      "Saludable",
    ]
    this.initialRecipesData = [
      {
        id: "1",
        name: "Arepas con Queso",
        ingredients: ["Harina de maíz", "Queso mozzarella", "Agua", "Sal"],
        ingredientImages: [
          "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=100&h=100&fit=crop",
          "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=100&h=100&fit=crop",
          "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=100&h=100&fit=crop",
          "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=100&h=100&fit=crop",
        ],
        steps: ["Mezclar harina con agua y sal", "Formar las arepas", "Asar en plancha", "Rellenar con queso"],
        time: 20,
        category: ["Desayuno", "Vegetariano"],
        favorite: true,
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop",
        manualRating: 5,
        autoRating: 4,
        finalRating: 5,
        servings: 2,
        difficulty: "Fácil",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 días atrás
        lastCooked: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 días atrás
        timesCooked: 8,
        notes: "Perfectas para el desayuno. Agregar un poco más de sal la próxima vez.",
        cookingHistory: [
          new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        ],
      },
      {
        id: "2",
        name: "Pasta Carbonara",
        ingredients: ["Pasta", "Huevos", "Tocino", "Queso parmesano", "Pimienta negra"],
        ingredientImages: [
          "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=100&h=100&fit=crop",
          "https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=100&h=100&fit=crop",
          "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=100&h=100&fit=crop",
          "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=100&h=100&fit=crop",
          "https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=100&h=100&fit=crop",
        ],
        steps: ["Cocinar pasta", "Freír tocino", "Mezclar huevos con queso", "Combinar todo"],
        time: 25,
        category: ["Almuerzo", "Cena"],
        favorite: false,
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop",
        manualRating: 4,
        autoRating: 3,
        finalRating: 4,
        servings: 1,
        difficulty: "Medio",
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 días atrás
        lastCooked: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 días atrás
        timesCooked: 3,
        notes: "Cuidado de no sobrecocinar los huevos. Queda cremosa cuando se hace bien.",
        cookingHistory: [
          new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        ],
      },
    ]
  }

  init() {
    this.recipes = this.storageManager.loadRecipes()
    if (this.recipes.length === 0) {
      this.recipes = this.initialRecipesData.map((r) => {
        const autoRating = this.ratingCalculator.calculateAutoRating(r)
        const finalRating = this.ratingCalculator.calculateFinalRating(r.manualRating, autoRating)
        return { ...r, autoRating, finalRating }
      })
      this.storageManager.saveRecipes(this.recipes)
    } else {
      // Ensure all recipes have calculated auto and final ratings on load
      this.recipes = this.recipes.map((r) => {
        const autoRating = this.ratingCalculator.calculateAutoRating(r)
        const finalRating = this.ratingCalculator.calculateFinalRating(r.manualRating, autoRating)
        return { ...r, autoRating, finalRating }
      })
    }
    this.renderRecipes()
  }

  getRecipeById(id) {
    return this.recipes.find((r) => r.id === id)
  }

  addRecipe(newRecipeData) {
    const now = new Date()
    const newRecipe = {
      id: Date.now().toString(),
      createdAt: now,
      timesCooked: 0,
      cookingHistory: [],
      favorite: false, // Default to not favorite
      lastCooked: undefined,
      ...newRecipeData,
    }
    const autoRating = this.ratingCalculator.calculateAutoRating(newRecipe)
    const finalRating = this.ratingCalculator.calculateFinalRating(newRecipe.manualRating, autoRating)
    newRecipe.autoRating = autoRating
    newRecipe.finalRating = finalRating

    this.recipes.push(newRecipe)
    this.storageManager.saveRecipes(this.recipes)
    this.renderRecipes()
    window.Utils.showToast(this.translationManager.get("recipeAdded"), "success")
  }

  updateRecipe(id, updatedData) {
    this.recipes = this.recipes.map((recipe) => {
      if (recipe.id === id) {
        const updatedRecipe = { ...recipe, ...updatedData }
        const autoRating = this.ratingCalculator.calculateAutoRating(updatedRecipe)
        const finalRating = this.ratingCalculator.calculateFinalRating(updatedRecipe.manualRating, autoRating)
        return { ...updatedRecipe, autoRating, finalRating }
      }
      return recipe
    })
    this.storageManager.saveRecipes(this.recipes)
    this.renderRecipes()
    window.Utils.showToast(this.translationManager.get("recipeUpdated"), "success")
  }

  deleteRecipe(id) {
    if (confirm(this.translationManager.get("deleteConfirm"))) {
      this.recipes = this.recipes.filter((recipe) => recipe.id !== id)
      this.storageManager.saveRecipes(this.recipes)
      this.renderRecipes()
      window.Utils.showToast(this.translationManager.get("recipeDeleted"), "success")
    }
  }

  toggleFavorite(id) {
    this.recipes = this.recipes.map((recipe) => {
      if (recipe.id === id) {
        const updated = { ...recipe, favorite: !recipe.favorite }
        const autoRating = this.ratingCalculator.calculateAutoRating(updated)
        const finalRating = this.ratingCalculator.calculateFinalRating(updated.manualRating, autoRating)
        return { ...updated, autoRating, finalRating }
      }
      return recipe
    })
    this.storageManager.saveRecipes(this.recipes)
    this.renderRecipes()
  }

  markAsCooked(id) {
    const now = new Date()
    this.recipes = this.recipes.map((recipe) => {
      if (recipe.id === id) {
        const updated = {
          ...recipe,
          timesCooked: recipe.timesCooked + 1,
          lastCooked: now,
          cookingHistory: [...recipe.cookingHistory, now],
        }
        const autoRating = this.ratingCalculator.calculateAutoRating(updated)
        const finalRating = this.ratingCalculator.calculateFinalRating(updated.manualRating, autoRating)
        return { ...updated, autoRating, finalRating }
      }
      return recipe
    })
    this.storageManager.saveRecipes(this.recipes)
    this.renderRecipes()
    window.Utils.showToast(this.translationManager.get("markAsCooked") + "!", "success")
  }

  updateManualRating(id, rating) {
    this.recipes = this.recipes.map((recipe) => {
      if (recipe.id === id) {
        const updated = { ...recipe, manualRating: rating }
        const finalRating = this.ratingCalculator.calculateFinalRating(rating, recipe.autoRating)
        return { ...updated, finalRating }
      }
      return recipe
    })
    this.storageManager.saveRecipes(this.recipes)
    this.renderRecipes()
  }

  filterRecipes(searchTerm, selectedCategory, showFavorites) {
    return this.recipes.filter((recipe) => {
      const matchesSearch =
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients.some((ingredient) => ingredient.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "all" || recipe.category.includes(selectedCategory)
      const matchesFavorites = !showFavorites || recipe.favorite

      return matchesSearch && matchesCategory && matchesFavorites
    })
  }

  renderRecipes(searchTerm = "", category = "all", showFavoritesOnly = false) {
    const filteredRecipes = this.filterRecipes(searchTerm, category, showFavoritesOnly)
    const recipesGrid = document.getElementById("recipes-grid")
    const emptyState = document.getElementById("empty-state")

    // Clear the grid
    recipesGrid.innerHTML = ""

    if (filteredRecipes.length === 0) {
      // Show empty state if no recipes match
      recipesGrid.style.display = "none"
      emptyState.style.display = "block"
      return
    }

    // Show recipes grid
    recipesGrid.style.display = "grid"
    emptyState.style.display = "none"

    // Render each recipe card
    filteredRecipes.forEach((recipe) => {
      const card = this.uiManager.createRecipeCard(
        recipe,
        (recipe) => this.editRecipe(recipe),
        (id) => this.deleteRecipe(id),
        (recipe) => this.viewRecipe(recipe),
        (id) => this.toggleFavorite(id),
        (id) => this.markRecipeAsCooked(id),
        (recipe) => this.exportRecipe(recipe),
      )
      recipesGrid.appendChild(card)
    })
    
    // Inicializar los iconos Lucide después de renderizar todas las recetas
    if (window.lucide) {
      window.lucide.createIcons()
    }
  }

  // Form handling for Add/Edit
  openRecipeForm(recipe = null) {
    this.editingRecipe = recipe
    const form = document.getElementById("recipe-form")
    const modalTitle = document.getElementById("modal-title")
    const t = this.translationManager.get.bind(this.translationManager)

    if (recipe) {
      modalTitle.innerHTML = `<i data-lucide="edit"></i> <span>${t("editRecipe")}</span>`
      document.getElementById("recipe-name").value = recipe.name
      document.getElementById("recipe-time").value = recipe.time
      document.getElementById("recipe-servings").value = recipe.servings
      document.getElementById("recipe-difficulty").value = recipe.difficulty
      this.uiManager.updateStarRating(document.getElementById("manual-rating"), recipe.manualRating)
      document.getElementById("recipe-notes").value = recipe.notes || ""

      this.renderFormIngredients(recipe.ingredients, recipe.ingredientImages)
      this.renderFormSteps(recipe.steps)
    } else {
      modalTitle.innerHTML = `<i data-lucide="plus"></i> <span>${t("addRecipe")}</span>`
      form.reset()
      this.uiManager.updateStarRating(document.getElementById("manual-rating"), 5) // Default rating
      this.renderFormIngredients([""])
      this.renderFormSteps([""])
    }
    window.lucide.createIcons() // Re-render icons in modal
    this.uiManager.openModal("recipe")
  }

  renderFormIngredients(ingredients, ingredientImages = []) {
    const container = document.getElementById("ingredients-container")
    container.innerHTML = ""
    ingredients.forEach((ing, index) => {
      const item = this.uiManager.createIngredientItem(
        ing,
        ingredientImages[index],
        index,
        (idx, val) => this.updateFormIngredient(idx, val),
        (idx) => this.removeFormIngredient(idx),
        ingredients.length > 1,
      )
      container.appendChild(item)
    })
  }

  renderFormSteps(steps) {
    const container = document.getElementById("steps-container")
    container.innerHTML = ""
    steps.forEach((step, index) => {
      const item = this.uiManager.createStepItem(
        step,
        index,
        (idx, val) => this.updateFormStep(idx, val),
        (idx) => this.removeFormStep(idx),
        steps.length > 1,
      )
      container.appendChild(item)
    })
  }

  async updateFormIngredient(index, value) {
    const formIngredients = this.getFormIngredients()
    formIngredients[index] = value
    this.setFormIngredients(formIngredients)

    // Update image if value is not empty
    if (value.trim()) {
      const img = await window.Utils.getIngredientImage(value)
      const container = document.getElementById("ingredients-container")
      const imgElement = container.children[index].querySelector(".ingredient-image img")
      const iconElement = container.children[index].querySelector(".ingredient-image i")

      if (imgElement) imgElement.src = img
      if (iconElement) iconElement.style.display = img === "/placeholder.svg?height=50&width=50" ? "block" : "none"
      if (imgElement) imgElement.style.display = img === "/placeholder.svg?height=50&width=50" ? "none" : "block"
    }
  }

  removeFormIngredient(index) {
    const formIngredients = this.getFormIngredients().filter((_, i) => i !== index)
    this.setFormIngredients(formIngredients)
    this.renderFormIngredients(formIngredients) // Re-render to update indices and remove button visibility
  }

  addFormIngredient() {
    const formIngredients = this.getFormIngredients()
    formIngredients.push("")
    this.setFormIngredients(formIngredients)
    this.renderFormIngredients(formIngredients)
  }

  updateFormStep(index, value) {
    const formSteps = this.getFormSteps()
    formSteps[index] = value
    this.setFormSteps(formSteps)
  }

  removeFormStep(index) {
    const formSteps = this.getFormSteps().filter((_, i) => i !== index)
    this.setFormSteps(formSteps)
    this.renderFormSteps(formSteps) // Re-render to update indices and remove button visibility
  }

  addFormStep() {
    const formSteps = this.getFormSteps()
    formSteps.push("")
    this.setFormSteps(formSteps)
    this.renderFormSteps(formSteps)
  }

  getFormIngredients() {
    const container = document.getElementById("ingredients-container")
    return Array.from(container.querySelectorAll("input")).map((input) => input.value)
  }

  setFormIngredients(ingredients) {
    // This is a placeholder. Actual update happens via renderFormIngredients
  }

  getFormSteps() {
    const container = document.getElementById("steps-container")
    return Array.from(container.querySelectorAll("textarea")).map((textarea) => textarea.value)
  }

  setFormSteps(steps) {
    // This is a placeholder. Actual update happens via renderFormSteps
  }

  async handleFormSubmit(e) {
    e.preventDefault()

    const t = this.translationManager.get.bind(this.translationManager)

    const name = document.getElementById("recipe-name").value.trim()
    const time = Number.parseInt(document.getElementById("recipe-time").value)
    const servings = Number.parseInt(document.getElementById("recipe-servings").value)
    const difficulty = document.getElementById("recipe-difficulty").value
    const manualRating = Number.parseInt(
      document.getElementById("manual-rating").querySelector(".star.active:last-child")?.dataset.rating || "5",
    )
    const ingredients = this.getFormIngredients().filter((i) => i.trim())
    const steps = this.getFormSteps().filter((s) => s.trim())
    const notes = document.getElementById("recipe-notes").value.trim()

    if (!name) {
      window.Utils.showToast(t("recipeNameRequired"), "error")
      return
    }
    if (ingredients.length === 0) {
      window.Utils.showToast(t("ingredientsRequired"), "error")
      return
    }
    if (steps.length === 0) {
      window.Utils.showToast(t("stepsRequired"), "error")
      return
    }

    // Show loading state
    const modalContent = document.querySelector("#recipe-modal .modal-content")
    this.uiManager.showLoading(modalContent, t("loadingImage"))

    const image = await window.Utils.getUnsplashImage(name)
    const ingredientImages = await Promise.all(ingredients.map((ing) => window.Utils.getIngredientImage(ing)))

    const formData = {
      name,
      ingredients,
      ingredientImages,
      steps,
      time,
      category: [], // Categories are not part of the form yet, default empty
      servings,
      difficulty,
      manualRating,
      notes,
      image,
    }

    if (this.editingRecipe) {
      this.updateRecipe(this.editingRecipe.id, formData)
    } else {
      this.addRecipe(formData)
    }

    this.uiManager.hideLoading(modalContent)
    this.uiManager.closeModal("recipe")
  }

  handleEdit(recipe) {
    this.openRecipeForm(recipe)
  }

  handleView(recipe) {
    this.uiManager.createRecipeDetailsView(
      recipe,
      (rating) => this.updateManualRating(recipe.id, rating),
      this.markAsCooked.bind(this),
      window.app.exportManager.openExportModal.bind(window.app.exportManager), // Pass export handler
    )
    document.getElementById("view-title-text").innerHTML =
      `<i data-lucide="eye"></i> <span>${window.Utils.sanitizeHTML(recipe.name)}</span>`
    window.lucide.createIcons() // Re-render icons in modal
    this.uiManager.openModal("view")
  }

  // Exportar receta utilizando ExportManager
  exportRecipe(recipe) {
    if (window.app && window.app.exportManager) {
      window.app.exportManager.openExportModal(recipe);
    } else {
      console.error("ExportManager no está disponible");
    }
  }
}

window.RecipeManager = RecipeManager
