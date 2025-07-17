// Rating Calculator - Handles recipe rating logic
class RatingCalculator {
  // Calculate automatic rating based on usage patterns
  static calculateAutoRating(recipe) {
    let score = 0

    // Factor 1: Cooking frequency (40% weight)
    const cookingFrequency = Math.min(recipe.timesCooked / 10, 1) * 2 // Max 2 puntos
    score += cookingFrequency

    // Factor 2: Favorite status (20% weight)
    if (recipe.favorite) {
      score += 1
    }

    // Factor 3: Age vs usage ratio (20% weight)
    const daysSinceCreated = Math.floor((Date.now() - recipe.createdAt.getTime()) / (1000 * 60 * 60 * 24))
    // Normalize by age, max 1 point
    const ageUsageRatio =
      daysSinceCreated > 0 ? recipe.timesCooked / Math.max(daysSinceCreated / 7, 1) : recipe.timesCooked
    score += Math.min(ageUsageRatio, 1)

    // Factor 4: Recency of use (20% weight)
    if (recipe.lastCooked) {
      const daysSinceCooked = Math.floor((Date.now() - recipe.lastCooked.getTime()) / (1000 * 60 * 60 * 24))
      // Decays over 30 days, max 1 point
      const recencyScore = Math.max(0, 1 - daysSinceCooked / 30)
      score += recencyScore
    }

    // Ensure score is between 1 and 5
    return Math.min(Math.max(Math.round(score), 1), 5)
  }

  // Calculate final hybrid rating (70% manual, 30% automatic)
  static calculateFinalRating(manualRating, autoRating) {
    // 70% manual, 30% automático
    return Math.round(manualRating * 0.7 + autoRating * 0.3)
  }

  // Update all ratings for a given recipe object
  static updateRecipeRatings(recipe) {
    recipe.autoRating = this.calculateAutoRating(recipe)
    recipe.finalRating = this.calculateFinalRating(recipe.manualRating, recipe.autoRating)
    return recipe
  }

  // Get global statistics for all recipes
  static getGlobalStats(recipes) {
    if (recipes.length === 0) {
      return {
        averageManual: 0,
        averageAuto: 0,
        averageFinal: 0,
        totalCookings: 0,
        mostCooked: null,
        leastCooked: null,
        newestRecipe: null,
        oldestRecipe: null,
        categoryDistribution: {},
      }
    }

    const totalManual = recipes.reduce((sum, r) => sum + r.manualRating, 0)
    const totalAuto = recipes.reduce((sum, r) => sum + r.autoRating, 0)
    const totalFinal = recipes.reduce((sum, r) => sum + r.finalRating, 0)
    const totalCookings = recipes.reduce((sum, r) => sum + r.timesCooked, 0)

    const sortedByCooked = [...recipes].sort((a, b) => b.timesCooked - a.timesCooked)
    const sortedByDate = [...recipes].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    const categoryDistribution = recipes.reduce((acc, recipe) => {
      recipe.category.forEach((cat) => {
        acc[cat] = (acc[cat] || 0) + 1
      })
      return acc
    }, {})

    return {
      averageManual: Math.round((totalManual / recipes.length) * 10) / 10,
      averageAuto: Math.round((totalAuto / recipes.length) * 10) / 10,
      averageFinal: Math.round((totalFinal / recipes.length) * 10) / 10,
      totalCookings,
      mostCooked: sortedByCooked[0],
      leastCooked: sortedByCooked[sortedByCooked.length - 1],
      newestRecipe: sortedByDate[recipes.length - 1],
      oldestRecipe: sortedByDate[0],
      categoryDistribution,
    }
  }

  // Get trending recipes (high auto rating, recent activity)
  static getTrendingRecipes(recipes, limit = 5) {
    return recipes
      .filter((recipe) => recipe.timesCooked > 0) // Only recipes that have been cooked
      .sort((a, b) => {
        // Primary sort: auto rating (descending)
        if (b.autoRating !== a.autoRating) {
          return b.autoRating - a.autoRating
        }
        // Secondary sort: last cooked date (descending)
        const aLastCooked = a.lastCooked ? a.lastCooked.getTime() : 0
        const bLastCooked = b.lastCooked ? b.lastCooked.getTime() : 0
        return bLastCooked - aLastCooked
      })
      .slice(0, limit)
  }

  // Get recommended recipes (high final rating, not cooked recently)
  static getRecommendedRecipes(recipes, limit = 5) {
    const now = Date.now()
    const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000 // Recipes not cooked in the last month

    return recipes
      .filter((recipe) => {
        return !recipe.lastCooked || recipe.lastCooked.getTime() < oneMonthAgo
      })
      .sort((a, b) => b.finalRating - a.finalRating) // Sort by final rating (descending)
      .slice(0, limit)
  }

  // Get recipe insights (e.g., "needs more cooking", "very popular")
  static getRecipeInsights(recipe, language = "es") {
    const insights = []
    const t = window.app.translationManager.get.bind(window.app.translationManager)

    if (recipe.timesCooked === 0) {
      insights.push({ type: "info", message: t("insightNotCooked") })
    } else if (recipe.timesCooked >= 10) {
      insights.push({ type: "success", message: t("insightVeryPopular") })
    }

    if (recipe.autoRating >= 4) {
      insights.push({ type: "success", message: t("insightHighAutoRating") })
    }

    if (recipe.lastCooked) {
      const daysSince = Math.floor((Date.now() - recipe.lastCooked.getTime()) / (1000 * 60 * 60 * 24))
      if (daysSince > 60) {
        // Not cooked in 2 months
        insights.push({ type: "warning", message: t("insightNotCookedRecently") })
      }
    }

    if (Math.abs(recipe.manualRating - recipe.autoRating) >= 2) {
      insights.push({ type: "info", message: t("insightRatingMismatch") })
    }

    return insights
  }
}

// Export for global use
window.RatingCalculator = RatingCalculator
