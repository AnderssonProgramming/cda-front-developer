// UI Manager
class UIManager {
  constructor() {
    this.modals = {
      recipe: document.getElementById("recipe-modal"),
      view: document.getElementById("view-modal"),
      export: document.getElementById("export-modal"),
    }
    this.setupEventListeners()
    
    // Inicializar los iconos Lucide en la carga
    this.initLucideIcons()
  }  setupEventListeners() {
    // Modal close events
    document.getElementById("modal-close").addEventListener("click", () => {
      this.closeModal("recipe")
    })

    document.getElementById("view-modal-close").addEventListener("click", () => {
      this.closeModal("view")
    })

    document.getElementById("export-modal-close").addEventListener("click", () => {
      this.closeModal("export") // Export modal close
    })

    // Close modal when clicking outside
    Object.values(this.modals).forEach((modal) => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          this.closeModal(modal.id.replace("-modal", ""))
        }
      })
    })

    // Escape key to close modals
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeAllModals()
      }
    })
  }

  // Modal management
  openModal(modalName) {
    const modal = this.modals[modalName]
    if (modal) {
      modal.classList.add("active")
      document.body.style.overflow = "hidden" // Prevent scrolling body
    }
  }

  closeModal(modalName) {
    const modal = this.modals[modalName]
    if (modal) {
      modal.classList.remove("active")
      document.body.style.overflow = "" // Restore body scrolling
    }
  }

  closeAllModals() {
    Object.keys(this.modals).forEach((key) => {
      this.modals[key].classList.remove("active")
    })
    document.body.style.overflow = ""
  }
  
  // Asegurarse de que los iconos Lucide se inicialicen correctamente
  initLucideIcons() {
    if (window.lucide) {
      window.lucide.createIcons()
    } else {
      console.warn("Lucide no está disponible, los iconos no se pueden inicializar")
    }
  }

  // Star rating component
  createStarRating(rating, interactive = false, onRatingChange = null) {
    const container = document.createElement("div")
    container.className = `star-rating ${interactive ? "" : "readonly"}`

    for (let i = 1; i <= 5; i++) {
      const star = document.createElement("button")
      star.type = "button"
      star.className = `star ${i <= rating ? "active" : ""}`
      star.innerHTML = '<i data-lucide="star"></i>'

      if (interactive && onRatingChange) {
        star.addEventListener("click", () => {
          onRatingChange(i)
          this.updateStarRating(container, i)
        })
      }

      container.appendChild(star)
    }

    // Initialize Lucide icons
    if (window.lucide) {
      window.lucide.createIcons()
    }

    return container
  }

  updateStarRating(container, rating) {
    const stars = container.querySelectorAll(".star")
    stars.forEach((star, index) => {
      star.classList.toggle("active", index < rating)
    })
  }

  // Recipe card creation
  createRecipeCard(recipe, onEdit, onDelete, onView, onToggleFavorite, onMarkCooked, onExport) {
    const card = document.createElement("div")
    card.className = "recipe-card"

    const t = window.app.translationManager.get.bind(window.app.translationManager)

    card.innerHTML = `
            <div class="recipe-image-container">
                <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image">
                <div class="recipe-actions">
                    <button class="recipe-favorite ${recipe.favorite ? "active" : ""}" data-action="favorite" title="${recipe.favorite ? t("unfavorite") : t("favorite")}">
                        <i data-lucide="heart"></i>
                    </button>
                </div>
                <div class="recipe-rating">
                    ${this.createStarRating(recipe.finalRating).outerHTML}
                </div>
                ${recipe.timesCooked > 0 ? `<div class="recipe-times-cooked">${recipe.timesCooked}x</div>` : ""}
            </div>
            
            <div class="recipe-content">
                <h3 class="recipe-title">${window.Utils.sanitizeHTML(recipe.name)}</h3>
                
                <div class="recipe-meta">
                    <div class="recipe-meta-item">
                        <i data-lucide="clock"></i>
                        <span>${recipe.time} ${t("minutes")}</span>
                    </div>
                    <div class="recipe-meta-item">
                        <i data-lucide="users"></i>
                        <span>${recipe.servings} ${t("servings")}</span>
                    </div>
                </div>
                
                <div class="recipe-categories">
                    ${recipe.category
                      .slice(0, 2)
                      .map((cat) => `<span class="recipe-category">${t(`categoryNames.${cat}`) || cat}</span>`)
                      .join("")}
                    ${recipe.category.length > 2 ? `<span class="recipe-category">+${recipe.category.length - 2}</span>` : ""}
                </div>
                
                <div class="recipe-stats">
                    <span>${t("timesCooked")}: ${recipe.timesCooked}</span>
                    <span>${t("lastCooked")}: ${recipe.lastCooked ? window.Utils.formatRelativeDate(recipe.lastCooked, window.app.translationManager.currentLanguage) : t("never")}</span>
                </div>
                
                <div class="recipe-bottom">
                    <span class="recipe-difficulty ${recipe.difficulty.toLowerCase()}">
                        ${t(recipe.difficulty.toLowerCase())}
                    </span>
                    
                    <div class="recipe-controls">
                        <button class="btn-icon green" data-action="cook" title="${t("markAsCooked")}">
                            <i data-lucide="chef-hat"></i>
                        </button>
                        <button class="btn-icon blue" data-action="view" title="${t("view")}">
                            <i data-lucide="eye"></i>
                        </button>
                        <button class="btn-icon purple" data-action="export" title="${t("exportRecipe")}">
                            <i data-lucide="download"></i>
                        </button>
                        <button class="btn-icon orange" data-action="edit" title="${t("edit")}">
                            <i data-lucide="edit"></i>
                        </button>
                        <button class="btn-icon red" data-action="delete" title="${t("delete")}">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </div>
            </div>
        `

    // Add event listeners
    card.querySelector('[data-action="favorite"]').addEventListener("click", (e) => {
      e.stopPropagation()
      onToggleFavorite(recipe.id)
    })

    card.querySelector('[data-action="cook"]').addEventListener("click", (e) => {
      e.stopPropagation()
      onMarkCooked(recipe.id)
    })

    card.querySelector('[data-action="view"]').addEventListener("click", (e) => {
      e.stopPropagation()
      onView(recipe)
    })

    card.querySelector('[data-action="export"]').addEventListener("click", (e) => {
      e.stopPropagation()
      onExport(recipe) // Call the export handler
    })

    card.querySelector('[data-action="edit"]').addEventListener("click", (e) => {
      e.stopPropagation()
      onEdit(recipe)
    })

    card.querySelector('[data-action="delete"]').addEventListener("click", (e) => {
      e.stopPropagation()
      onDelete(recipe.id)
    })

    // Initialize Lucide icons
    if (window.lucide) {
      window.lucide.createIcons()
    }

    return card
  }

  // Recipe details view
  createRecipeDetailsView(recipe, onRatingChange, onMarkCooked, onExport) {
    const t = window.app.translationManager.get.bind(window.app.translationManager)

    const detailsHTML = `
            <img src="${recipe.image}" alt="${recipe.name}" class="recipe-detail-image">
            
            <div class="recipe-detail-stats">
                <div class="recipe-stat red">
                    <i data-lucide="clock"></i>
                    <div>${recipe.time} ${t("minutes")}</div>
                </div>
                <div class="recipe-stat orange">
                    <i data-lucide="users"></i>
                    <div>${recipe.servings} ${t("servings")}</div>
                </div>
                <div class="recipe-stat green">
                    <div>${t(recipe.difficulty.toLowerCase())}</div>
                </div>
                <div class="recipe-stat blue">
                    <i data-lucide="calendar"></i>
                    <div>${recipe.timesCooked}x</div>
                </div>
            </div>
            
            <div class="rating-section">
                <h4>${t("rateRecipe")}</h4>
                <div class="rating-grid">
                    <div class="rating-item">
                        <h5>${t("manualRating")}</h5>
                        <div id="manual-rating-display"></div>
                        <div class="rating-value">${recipe.manualRating}/5</div>
                    </div>
                    <div class="rating-item">
                        <h5>${t("autoRating")}</h5>
                        <div class="star-rating readonly">
                            <i data-lucide="trending-up"></i>
                            ${this.createStarRating(recipe.autoRating).outerHTML}
                        </div>
                        <div class="rating-value">${recipe.autoRating}/5</div>
                    </div>
                    <div class="rating-item">
                        <h5>${t("finalRating")}</h5>
                        ${this.createStarRating(recipe.finalRating).outerHTML}
                        <div class="rating-value">${recipe.finalRating}/5</div>
                    </div>
                </div>
            </div>
            
            <div class="cooking-stats">
                <h4>
                    <i data-lucide="trending-up"></i>
                    ${t("cookingStats")}
                </h4>
                <div class="cooking-stats-grid">
                    <span>${t("timesCooked")}:</span>
                    <span>${recipe.timesCooked}</span>
                    <span>${t("lastCooked")}:</span>
                    <span>${recipe.lastCooked ? window.Utils.formatRelativeDate(recipe.lastCooked, window.app.translationManager.currentLanguage) : t("never")}</span>
                </div>
            </div>
            
            <div class="recipe-categories">
                ${recipe.category
                  .map((cat) => `<span class="recipe-category">${t(`categoryNames.${cat}`) || cat}</span>`)
                  .join("")}
            </div>
            
            <div class="separator"></div>
            
            <div class="recipe-section">
                <h3>
                    <i data-lucide="utensils"></i>
                    ${t("ingredients")}
                </h3>
                <ul class="ingredients-list">
                    ${recipe.ingredients
                      .map(
                        (ingredient, index) => `
                        <li class="ingredient-list-item">
                            <div class="ingredient-list-image">
                                ${
                                  recipe.ingredientImages?.[index] &&
                                  recipe.ingredientImages[index] !== "/placeholder.svg?height=50&width=50"
                                    ? `<img src="${recipe.ingredientImages[index]}" alt="${ingredient}">`
                                    : '<div class="dot"></div>'
                                }
                            </div>
                            <span>${window.Utils.sanitizeHTML(ingredient)}</span>
                        </li>
                    `,
                      )
                      .join("")}
                </ul>
            </div>
            
            <div class="recipe-section">
                <h3>
                    <i data-lucide="chef-hat"></i>
                    ${t("steps")}
                </h3>
                <ol class="steps-list">
                    ${recipe.steps
                      .map(
                        (step, index) => `
                        <li class="step-list-item">
                            <div class="step-number">${index + 1}</div>
                            <div>${window.Utils.sanitizeHTML(step)}</div>
                        </li>
                    `,
                      )
                      .join("")}
                </ol>
            </div>
            
            ${
              recipe.notes
                ? `
                <div class="recipe-section">
                    <h3>
                        <i data-lucide="message-square"></i>
                        ${t("notes")}
                    </h3>
                    <div class="notes-section">
                        <p class="notes-text">"${window.Utils.sanitizeHTML(recipe.notes)}"</p>
                    </div>
                </div>
            `
                : ""
            }
            
            ${
              recipe.cookingHistory && recipe.cookingHistory.length > 0
                ? `
                <div class="recipe-section">
                    <h3>
                        <i data-lucide="history"></i>
                        ${t("cookingHistory")}
                    </h3>
                    <ul class="history-list">
                        ${recipe.cookingHistory
                          .map(
                            (date) =>
                              `<li>${date.toLocaleDateString()} (${window.Utils.formatRelativeDate(date, window.app.translationManager.currentLanguage)})</li>`,
                          )
                          .join("")}
                    </ul>
                </div>
            `
                : ""
            }
            
            <div class="cook-button-container">
                <button class="btn-cook" id="cook-recipe-btn">
                    <i data-lucide="chef-hat"></i>
                    ${t("markAsCooked")}
                </button>
                <button class="btn-cook btn-export-view" id="export-recipe-btn">
                    <i data-lucide="download"></i>
                    ${t("exportRecipe")}
                </button>
            </div>
        `

    const container = document.getElementById("recipe-details")
    container.innerHTML = detailsHTML

    // Add interactive manual rating
    const manualRatingContainer = container.querySelector("#manual-rating-display")
    const manualRating = this.createStarRating(recipe.manualRating, true, onRatingChange)
    manualRatingContainer.appendChild(manualRating)

    // Add cook button event listener
    container.querySelector("#cook-recipe-btn").addEventListener("click", () => {
      onMarkCooked(recipe.id)
    })

    // Add export button event listener with log
    container.querySelector("#export-recipe-btn").addEventListener("click", () => {
      console.log("Botón de exportación clickeado");
      onExport(recipe);
    });

    // Ensure Lucide icons are initialized
    this.initLucideIcons();
  }

  // Form ingredient item
  createIngredientItem(ingredient = "", ingredientImage = "", index = 0, onUpdate, onRemove, canRemove = true) {
    const item = document.createElement("div")
    item.className = "ingredient-item"

    const t = window.app.translationManager.get.bind(window.app.translationManager)

    item.innerHTML = `
            <div class="ingredient-image">
                ${
                  ingredientImage && ingredientImage !== "/placeholder.svg?height=50&width=50"
                    ? `<img src="${ingredientImage}" alt="${ingredient}">`
                    : '<i data-lucide="image"></i>'
                }
            </div>
            <input type="text" class="form-input" value="${ingredient}" placeholder="${t("ingredient")} ${index + 1}">
            ${canRemove ? '<button type="button" class="remove-btn"><i data-lucide="x"></i></button>' : ""}
        `

    const input = item.querySelector("input")
    const removeBtn = item.querySelector(".remove-btn")

    input.addEventListener("input", (e) => {
      onUpdate(index, e.target.value)
    })

    if (removeBtn) {
      removeBtn.addEventListener("click", () => {
        onRemove(index)
      })
    }

    // Initialize Lucide icons
    if (window.lucide) {
      window.lucide.createIcons()
    }

    return item
  }

  // Form step item
  createStepItem(step = "", index = 0, onUpdate, onRemove, canRemove = true) {
    const item = document.createElement("div")
    item.className = "step-item"

    const t = window.app.translationManager.get.bind(window.app.translationManager)

    item.innerHTML = `
            <textarea class="form-input" rows="2" placeholder="${t("step")} ${index + 1}">${step}</textarea>
            ${canRemove ? '<button type="button" class="remove-btn"><i data-lucide="x"></i></button>' : ""}
        `

    const textarea = item.querySelector("textarea")
    const removeBtn = item.querySelector(".remove-btn")

    textarea.addEventListener("input", (e) => {
      onUpdate(index, e.target.value)
    })

    if (removeBtn) {
      removeBtn.addEventListener("click", () => {
        onRemove(index)
      })
    }

    // Initialize Lucide icons
    if (window.lucide) {
      window.lucide.createIcons()
    }

    return item
  }

  // Update footer statistics
  updateFooterStats(recipes) {
    const t = window.app.translationManager.get.bind(window.app.translationManager)
    const totalRecipes = recipes.length
    const favoriteRecipes = recipes.filter((r) => r.favorite).length
    const averageTime = totalRecipes > 0 ? Math.round(recipes.reduce((acc, r) => acc + r.time, 0) / totalRecipes) : 0
    const totalCooked = recipes.reduce((acc, r) => acc + r.timesCooked, 0)

    document.getElementById("total-recipes-count").textContent = totalRecipes
    document.getElementById("favorite-recipes-count").textContent = favoriteRecipes
    document.getElementById("average-time").textContent = averageTime
    document.getElementById("total-cooked").textContent = totalCooked
  }

  // Show/hide empty state
  toggleEmptyState(show) {
    const emptyState = document.getElementById("empty-state")
    const recipesGrid = document.getElementById("recipes-grid")

    if (show) {
      emptyState.style.display = "block"
      recipesGrid.style.display = "none"
    } else {
      emptyState.style.display = "none"
      recipesGrid.style.display = "grid"
    }
  }

  // Animate element
  animateElement(element, animationClass, duration = 300) {
    element.classList.add(animationClass)
    setTimeout(() => {
      element.classList.remove(animationClass)
    }, duration)
  }

  // Loading state
  showLoading(element, text = "Cargando...") {
    const loading = document.createElement("div")
    loading.className = "loading-overlay"
    loading.innerHTML = `
            <div class="loading"></div>
            <span>${text}</span>
        `
    element.appendChild(loading)
  }

  hideLoading(element) {
    const loading = element.querySelector(".loading-overlay")
    if (loading) {
      loading.remove()
    }
  }
}

// Export for global use
window.UIManager = UIManager
