// Export Manager - Handles exporting recipes to various formats
class ExportManager {
  constructor(translationManager) {
    this.translation = translationManager
    this.currentRecipe = null
    this.progressInterval = null
    this.setupEventListeners()
  }

  setupEventListeners() {
    // Export modal close
    document.getElementById("export-modal-close").addEventListener("click", () => {
      this.closeExportModal()
    })

    // Format selection
    document.querySelectorAll(".export-format-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const format = e.currentTarget.getAttribute("data-format")
        this.exportRecipe(format)
      })
    })

    // Close modal when clicking outside
    document.getElementById("export-modal").addEventListener("click", (e) => {
      if (e.target.id === "export-modal") {
        this.closeExportModal()
      }
    })
  }

  openExportModal(recipe) {
    this.currentRecipe = recipe
    document.getElementById("export-modal").classList.add("active")
    document.body.style.overflow = "hidden"
    // Update translations for the modal content
    this.translation.updateUI()
  }

  closeExportModal() {
    document.getElementById("export-modal").classList.remove("active")
    document.body.style.overflow = ""
    this.currentRecipe = null
  }

  getExportOptions() {
    return {
      includeImage: document.getElementById("include-image").checked,
      includeStats: document.getElementById("include-stats").checked,
      includeNotes: document.getElementById("include-notes").checked,
      includeHistory: document.getElementById("include-history").checked,
    }
  }

  async exportRecipe(format) {
    if (!this.currentRecipe) return

    this.showExportLoading()

    try {
      const options = this.getExportOptions()

      switch (format) {
        case "pdf":
          await this.exportToPDF(this.currentRecipe, options)
          break
        case "json":
          this.exportToJSON(this.currentRecipe, options)
          break
        case "csv":
          this.exportToCSV(this.currentRecipe, options)
          break
        case "txt":
          this.exportToTXT(this.currentRecipe, options)
          break
        case "markdown":
          this.exportToMarkdown(this.currentRecipe, options)
          break
        case "recipe-card":
          await this.exportToRecipeCard(this.currentRecipe, options)
          break
        default:
          throw new Error(this.translation.get("unsupportedFormat"))
      }

      window.Utils.showToast(this.translation.get("exportSuccess"), "success")
      this.closeExportModal()
    } catch (error) {
      console.error("Export error:", error)
      window.Utils.showToast(`${this.translation.get("exportError")}: ${error.message}`, "error")
    } finally {
      this.hideExportLoading()
    }
  }

  // PDF Export using jsPDF and html2canvas
  async exportToPDF(recipe, options) {
    // Load jsPDF and html2canvas dynamically
    if (!window.jsPDF) {
      await window.Utils.loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js")
    }
    if (!window.html2canvas) {
      await window.Utils.loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js")
    }

    const { jsPDF } = window.jspdf
    const doc = new jsPDF("p", "mm", "a4") // Portrait, millimeters, A4 size

    let yPosition = 20
    const margin = 20
    const pageWidth = doc.internal.pageSize.width
    const lineHeight = 7
    const smallLineHeight = 5

    // Title
    doc.setFont("helvetica", "bold")
    doc.setFontSize(24)
    doc.setTextColor(239, 68, 68) // Primary Red
    doc.text(recipe.name, margin, yPosition)
    yPosition += 15

    // Recipe Image
    if (options.includeImage && recipe.image) {
      try {
        const imgData = await this.getImageAsBase64(recipe.image)
        const imgWidth = 80
        const imgHeight = (imgWidth / 400) * 300 // Maintain aspect ratio (400x300)
        doc.addImage(imgData, "JPEG", margin, yPosition, imgWidth, imgHeight)
        yPosition += imgHeight + 10
      } catch (error) {
        console.warn("Could not load recipe image for PDF:", error)
      }
    }

    // Basic Info
    doc.setFont("helvetica", "normal")
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0) // Black
    doc.text(
      `${this.translation.get("cookingTime")}: ${recipe.time} ${this.translation.get("minutes")}`,
      margin,
      yPosition,
    )
    doc.text(`${this.translation.get("servings")}: ${recipe.servings}`, margin + 60, yPosition)
    doc.text(
      `${this.translation.get("difficulty")}: ${this.translation.get(recipe.difficulty.toLowerCase())}`,
      margin + 120,
      yPosition,
    )
    yPosition += lineHeight

    doc.text(`${this.translation.get("finalRating")}: ${recipe.finalRating}/5 ⭐`, margin, yPosition)
    yPosition += lineHeight

    if (recipe.category && recipe.category.length > 0) {
      const categoriesText = recipe.category
        .map((cat) => this.translation.get(`categoryNames.${cat}`) || cat)
        .join(", ")
      doc.text(`${this.translation.get("categories")}: ${categoriesText}`, margin, yPosition)
      yPosition += lineHeight
    }
    yPosition += 5

    // Ingredients
    doc.setFont("helvetica", "bold")
    doc.setFontSize(16)
    doc.setTextColor(239, 68, 68)
    doc.text(this.translation.get("ingredients"), margin, yPosition)
    yPosition += 8

    doc.setFont("helvetica", "normal")
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    recipe.ingredients.forEach((ingredient) => {
      const lines = doc.splitTextToSize(`• ${ingredient}`, pageWidth - margin * 2)
      lines.forEach((line) => {
        if (yPosition + smallLineHeight > doc.internal.pageSize.height - margin) {
          doc.addPage()
          yPosition = margin
        }
        doc.text(line, margin + 5, yPosition)
        yPosition += smallLineHeight
      })
    })
    yPosition += 10

    // Steps
    doc.setFont("helvetica", "bold")
    doc.setFontSize(16)
    doc.setTextColor(239, 68, 68)
    doc.text(this.translation.get("steps"), margin, yPosition)
    yPosition += 8

    doc.setFont("helvetica", "normal")
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    recipe.steps.forEach((step, index) => {
      const lines = doc.splitTextToSize(`${index + 1}. ${step}`, pageWidth - margin * 2)
      lines.forEach((line) => {
        if (yPosition + smallLineHeight > doc.internal.pageSize.height - margin) {
          doc.addPage()
          yPosition = margin
        }
        doc.text(line, margin + 5, yPosition)
        yPosition += smallLineHeight
      })
      yPosition += 3 // Small gap between steps
    })

    // Statistics
    if (options.includeStats) {
      yPosition += 10
      doc.setFont("helvetica", "bold")
      doc.setFontSize(16)
      doc.setTextColor(239, 68, 68)
      doc.text(this.translation.get("cookingStats"), margin, yPosition)
      yPosition += 8

      doc.setFont("helvetica", "normal")
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      if (yPosition + lineHeight * 3 > doc.internal.pageSize.height - margin) {
        doc.addPage()
        yPosition = margin
      }
      doc.text(`${this.translation.get("timesCooked")}: ${recipe.timesCooked}`, margin, yPosition)
      yPosition += lineHeight
      doc.text(`${this.translation.get("manualRating")}: ${recipe.manualRating}/5`, margin, yPosition)
      yPosition += lineHeight
      doc.text(`${this.translation.get("autoRating")}: ${recipe.autoRating}/5`, margin, yPosition)
      yPosition += lineHeight
      if (recipe.lastCooked) {
        doc.text(
          `${this.translation.get("lastCooked")}: ${window.Utils.formatRelativeDate(recipe.lastCooked, this.translation.currentLanguage)}`,
          margin,
          yPosition,
        )
        yPosition += lineHeight
      }
    }

    // Notes
    if (options.includeNotes && recipe.notes) {
      yPosition += 10
      doc.setFont("helvetica", "bold")
      doc.setFontSize(16)
      doc.setTextColor(239, 68, 68)
      doc.text(this.translation.get("notes"), margin, yPosition)
      yPosition += 8

      doc.setFont("helvetica", "normal")
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      const noteLines = doc.splitTextToSize(`"${recipe.notes}"`, pageWidth - margin * 2)
      noteLines.forEach((line) => {
        if (yPosition + smallLineHeight > doc.internal.pageSize.height - margin) {
          doc.addPage()
          yPosition = margin
        }
        doc.text(line, margin + 5, yPosition)
        yPosition += smallLineHeight
      })
    }

    // Cooking History
    if (options.includeHistory && recipe.cookingHistory && recipe.cookingHistory.length > 0) {
      yPosition += 10
      doc.setFont("helvetica", "bold")
      doc.setFontSize(16)
      doc.setTextColor(239, 68, 68)
      doc.text(this.translation.get("cookingHistory"), margin, yPosition)
      yPosition += 8

      doc.setFont("helvetica", "normal")
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      recipe.cookingHistory.forEach((date, index) => {
        if (yPosition + smallLineHeight > doc.internal.pageSize.height - margin) {
          doc.addPage()
          yPosition = margin
        }
        doc.text(
          `• ${date.toLocaleDateString()} (${window.Utils.formatRelativeDate(date, this.translation.currentLanguage)})`,
          margin + 5,
          yPosition,
        )
        yPosition += smallLineHeight
      })
    }

    // Footer
    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(10)
      doc.setTextColor(128, 128, 128) // Gray
      doc.text(
        `${this.translation.get("generatedBy")} Cocina para Uno - ${new Date().toLocaleDateString()}`,
        margin,
        doc.internal.pageSize.height - 10,
      )
      doc.text(
        `${this.translation.get("page")} ${i} ${this.translation.get("of")} ${pageCount}`,
        doc.internal.pageSize.width - margin - 20,
        doc.internal.pageSize.height - 10,
      )
    }

    doc.save(`${this.sanitizeFilename(recipe.name)}.pdf`)
  }

  // JSON Export
  exportToJSON(recipe, options) {
    const exportData = {
      id: recipe.id,
      name: recipe.name,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      time: recipe.time,
      servings: recipe.servings,
      difficulty: recipe.difficulty,
      category: recipe.category,
      manualRating: recipe.manualRating,
      finalRating: recipe.finalRating,
      favorite: recipe.favorite,
      createdAt: recipe.createdAt.toISOString(),
    }

    if (options.includeImage) {
      exportData.image = recipe.image
      exportData.ingredientImages = recipe.ingredientImages
    }

    if (options.includeStats) {
      exportData.timesCooked = recipe.timesCooked
      exportData.autoRating = recipe.autoRating
      exportData.lastCooked = recipe.lastCooked?.toISOString() || null
    }

    if (options.includeNotes) {
      exportData.notes = recipe.notes
    }

    if (options.includeHistory) {
      exportData.cookingHistory = recipe.cookingHistory.map((date) => date.toISOString())
    }

    exportData.exportedAt = new Date().toISOString()
    exportData.exportedBy = "Cocina para Uno v1.0"

    this.downloadFile(
      JSON.stringify(exportData, null, 2),
      `${this.sanitizeFilename(recipe.name)}.json`,
      "application/json",
    )
  }

  // CSV Export
  exportToCSV(recipe, options) {
    const rows = []
    const t = this.translation.get.bind(this.translation)

    // Headers
    rows.push([t("field"), t("value")])

    // Basic info
    rows.push([t("recipeName"), recipe.name])
    rows.push([t("cookingTime"), `${recipe.time} ${t("minutes")}`])
    rows.push([t("servings"), recipe.servings])
    rows.push([t("difficulty"), t(recipe.difficulty.toLowerCase())])
    rows.push([t("finalRating"), `${recipe.finalRating}/5`])
    rows.push([t("favorites"), recipe.favorite ? t("yes") : t("no")])
    rows.push([t("categories"), recipe.category.map((cat) => t(`categoryNames.${cat}`) || cat).join("; ")])

    // Ingredients
    rows.push(["", ""]) // Empty row
    rows.push([t("ingredients").toUpperCase(), ""])
    recipe.ingredients.forEach((ingredient, index) => {
      rows.push([`${t("ingredient")} ${index + 1}`, ingredient])
    })

    // Steps
    rows.push(["", ""]) // Empty row
    rows.push([t("steps").toUpperCase(), ""])
    recipe.steps.forEach((step, index) => {
      rows.push([`${t("step")} ${index + 1}`, step])
    })

    // Statistics
    if (options.includeStats) {
      rows.push(["", ""]) // Empty row
      rows.push([t("cookingStats").toUpperCase(), ""])
      rows.push([t("timesCooked"), recipe.timesCooked])
      rows.push([t("manualRating"), `${recipe.manualRating}/5`])
      rows.push([t("autoRating"), `${recipe.autoRating}/5`])
      if (recipe.lastCooked) {
        rows.push([t("lastCooked"), recipe.lastCooked.toLocaleDateString()])
      }
    }

    // Notes
    if (options.includeNotes && recipe.notes) {
      rows.push(["", ""]) // Empty row
      rows.push([t("notes").toUpperCase(), ""])
      rows.push([t("notes"), recipe.notes])
    }

    // Cooking History
    if (options.includeHistory && recipe.cookingHistory && recipe.cookingHistory.length > 0) {
      rows.push(["", ""]) // Empty row
      rows.push([t("cookingHistory").toUpperCase(), ""])
      recipe.cookingHistory.forEach((date, index) => {
        rows.push([`${t("cookedOn")} ${index + 1}`, date.toLocaleDateString()])
      })
    }

    // Convert to CSV
    const csvContent = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n")

    this.downloadFile(csvContent, `${this.sanitizeFilename(recipe.name)}.csv`, "text/csv")
  }

  // TXT Export
  exportToTXT(recipe, options) {
    let content = ""
    const t = this.translation.get.bind(this.translation)

    // Title
    content += `${recipe.name.toUpperCase()}\n`
    content += "=".repeat(recipe.name.length) + "\n\n"

    // Basic info
    content += `⏱️ ${t("cookingTime")}: ${recipe.time} ${t("minutes")}\n`
    content += `👥 ${t("servings")}: ${recipe.servings}\n`
    content += `📊 ${t("difficulty")}: ${t(recipe.difficulty.toLowerCase())}\n`
    content += `⭐ ${t("finalRating")}: ${recipe.finalRating}/5\n`
    content += `❤️ ${t("favorites")}: ${recipe.favorite ? t("yes") : t("no")}\n`
    content += `🏷️ ${t("categories")}: ${recipe.category.map((cat) => t(`categoryNames.${cat}`) || cat).join(", ")}\n\n`

    // Ingredients
    content += `${t("ingredients").toUpperCase()}:\n`
    content += "-------------\n"
    recipe.ingredients.forEach((ingredient, index) => {
      content += `${index + 1}. ${ingredient}\n`
    })
    content += "\n"

    // Steps
    content += `${t("steps").toUpperCase()}:\n`
    content += "------------\n"
    recipe.steps.forEach((step, index) => {
      content += `${index + 1}. ${step}\n\n`
    })

    // Statistics
    if (options.includeStats) {
      content += `${t("cookingStats").toUpperCase()}:\n`
      content += "-------------\n"
      content += `${t("timesCooked")}: ${recipe.timesCooked}\n`
      content += `${t("manualRating")}: ${recipe.manualRating}/5\n`
      content += `${t("autoRating")}: ${recipe.autoRating}/5\n`
      if (recipe.lastCooked) {
        content += `${t("lastCooked")}: ${recipe.lastCooked.toLocaleDateString()}\n`
      }
      content += "\n"
    }

    // Notes
    if (options.includeNotes && recipe.notes) {
      content += `${t("notes").toUpperCase()}:\n`
      content += "-----------------\n"
      content += `${recipe.notes}\n\n`
    }

    // Cooking History
    if (options.includeHistory && recipe.cookingHistory && recipe.cookingHistory.length > 0) {
      content += `${t("cookingHistory").toUpperCase()}:\n`
      content += "-----------------\n"
      recipe.cookingHistory.forEach((date, index) => {
        content += `${index + 1}. ${date.toLocaleDateString()} (${window.Utils.formatRelativeDate(date, this.translation.currentLanguage)})\n`
      })
      content += "\n"
    }

    // Footer
    content += `\n---\n${t("generatedBy")} Cocina para Uno el ${new Date().toLocaleDateString()}\n`

    this.downloadFile(content, `${this.sanitizeFilename(recipe.name)}.txt`, "text/plain")
  }

  // Markdown Export
  exportToMarkdown(recipe, options) {
    let content = ""
    const t = this.translation.get.bind(this.translation)

    // Title
    content += `# ${recipe.name}\n\n`

    // Image
    if (options.includeImage && recipe.image) {
      content += `![${recipe.name}](${recipe.image})\n\n`
    }

    // Basic info
    content += `## ${t("basicInfo")}\n\n`
    content += `- **${t("cookingTime")}:** ${recipe.time} ${t("minutes")}\n`
    content += `- **${t("servings")}:** ${recipe.servings}\n`
    content += `- **${t("difficulty")}:** ${t(recipe.difficulty.toLowerCase())}\n`
    content += `- **${t("finalRating")}:** ${recipe.finalRating}/5 ⭐\n`
    content += `- **${t("favorites")}:** ${recipe.favorite ? t("yes") : t("no")}\n`
    content += `- **${t("categories")}:** ${recipe.category.map((cat) => t(`categoryNames.${cat}`) || cat).join(", ")}\n\n`

    // Ingredients
    content += `## 🥘 ${t("ingredients")}\n\n`
    recipe.ingredients.forEach((ingredient) => {
      content += `- ${ingredient}\n`
    })
    content += "\n"

    // Steps
    content += `## 👨‍🍳 ${t("steps")}\n\n`
    recipe.steps.forEach((step, index) => {
      content += `${index + 1}. ${step}\n\n`
    })

    // Statistics
    if (options.includeStats) {
      content += `## 📊 ${t("cookingStats")}\n\n`
      content += `- **${t("timesCooked")}:** ${recipe.timesCooked}\n`
      content += `- **${t("manualRating")}:** ${recipe.manualRating}/5\n`
      content += `- **${t("autoRating")}:** ${recipe.autoRating}/5\n`
      if (recipe.lastCooked) {
        content += `- **${t("lastCooked")}:** ${recipe.lastCooked.toLocaleDateString()}\n`
      }
      content += "\n"
    }

    // Notes
    if (options.includeNotes && recipe.notes) {
      content += `## 📝 ${t("notes")}\n\n`
      content += `> ${recipe.notes}\n\n`
    }

    // Cooking History
    if (options.includeHistory && recipe.cookingHistory && recipe.cookingHistory.length > 0) {
      content += `## 📜 ${t("cookingHistory")}\n\n`
      recipe.cookingHistory.forEach((date, index) => {
        content += `- ${date.toLocaleDateString()} (${window.Utils.formatRelativeDate(date, this.translation.currentLanguage)})\n`
      })
      content += "\n"
    }

    // Footer
    content += `---\n*${t("generatedBy")} Cocina para Uno el ${new Date().toLocaleDateString()}*\n`

    this.downloadFile(content, `${this.sanitizeFilename(recipe.name)}.md`, "text/markdown")
  }

  // Recipe Card Export (HTML to Image using html2canvas)
  async exportToRecipeCard(recipe, options) {
    // Load html2canvas dynamically
    if (!window.html2canvas) {
      await window.Utils.loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js")
    }

    const t = this.translation.get.bind(this.translation)

    // Create a temporary HTML element for the recipe card
    const tempDiv = document.createElement("div")
    tempDiv.style.width = "600px" // Fixed width for the card
    tempDiv.style.background = "linear-gradient(135deg, #fef2f2 0%, #fed7aa 100%)"
    tempDiv.style.padding = "40px"
    tempDiv.style.fontFamily = '"Inter", sans-serif'
    tempDiv.style.borderRadius = "20px"
    tempDiv.style.boxShadow = "0 20px 40px rgba(0,0,0,0.1)"
    tempDiv.style.color = "#1f2937"
    tempDiv.style.position = "absolute" // Hide it from view
    tempDiv.style.left = "-9999px"
    document.body.appendChild(tempDiv)

    let cardContent = `
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="
          font-size: 32px;
          font-weight: 700;
          background: linear-gradient(135deg, #ef4444, #f97316);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 10px 0;
        ">${recipe.name}</h1>
        <div style="display: flex; justify-content: center; gap: 20px; font-size: 14px; color: #6b7280;">
          <span>⏱️ ${recipe.time} ${t("minutes")}</span>
          <span>👥 ${recipe.servings} ${t("servings")}</span>
          <span>📊 ${t(recipe.difficulty.toLowerCase())}</span>
          <span>⭐ ${recipe.finalRating}/5</span>
        </div>
      </div>
    `

    if (options.includeImage && recipe.image) {
      cardContent += `
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="${recipe.image}" style="width: 300px; height: 200px; object-fit: cover; border-radius: 15px; box-shadow: 0 10px 20px rgba(0,0,0,0.1);" alt="${recipe.name}">
        </div>
      `
    }

    cardContent += `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
        <div>
          <h3 style="color: #ef4444; font-size: 18px; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
            🥘 ${t("ingredients")}
          </h3>
          <ul style="list-style: none; padding: 0; margin: 0;">
            ${recipe.ingredients
              .map(
                (ingredient) => `
              <li style="
                padding: 8px 0;
                border-bottom: 1px solid rgba(239, 68, 68, 0.1);
                color: #374151;
                font-size: 14px;
              ">• ${ingredient}</li>
            `,
              )
              .join("")}
          </ul>
        </div>
        
        <div>
          <h3 style="color: #ef4444; font-size: 18px; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
            👨‍🍳 ${t("steps")}
          </h3>
          <ol style="padding-left: 20px; margin: 0;">
            ${recipe.steps
              .map(
                (step, index) => `
              <li style="
                margin-bottom: 12px;
                color: #374151;
                font-size: 14px;
                line-height: 1.5;
              ">${step}</li>
            `,
              )
              .join("")}
          </ol>
        </div>
      </div>
    `

    if (options.includeNotes && recipe.notes) {
      cardContent += `
        <div style="margin-top: 30px; padding: 20px; background: rgba(59, 130, 246, 0.1); border-radius: 10px;">
          <h4 style="color: #3b82f6; margin: 0 0 10px 0;">📝 ${t("notes")}</h4>
          <p style="margin: 0; font-style: italic; color: #374151;">"${recipe.notes}"</p>
        </div>
      `
    }

    if (options.includeStats) {
      cardContent += `
        <div style="margin-top: 30px; padding: 20px; background: rgba(16, 185, 129, 0.1); border-radius: 10px;">
          <h4 style="color: #10b981; margin: 0 0 10px 0;">📊 ${t("cookingStats")}</h4>
          <p style="margin: 0; color: #374151;">${t("timesCooked")}: ${recipe.timesCooked}</p>
          <p style="margin: 0; color: #374151;">${t("manualRating")}: ${recipe.manualRating}/5</p>
          <p style="margin: 0; color: #374151;">${t("autoRating")}: ${recipe.autoRating}/5</p>
          ${recipe.lastCooked ? `<p style="margin: 0; color: #374151;">${t("lastCooked")}: ${recipe.lastCooked.toLocaleDateString()}</p>` : ""}
        </div>
      `
    }

    if (options.includeHistory && recipe.cookingHistory && recipe.cookingHistory.length > 0) {
      cardContent += `
        <div style="margin-top: 30px; padding: 20px; background: rgba(139, 92, 246, 0.1); border-radius: 10px;">
          <h4 style="color: #8b5cf6; margin: 0 0 10px 0;">📜 ${t("cookingHistory")}</h4>
          <ul style="list-style: none; padding: 0; margin: 0;">
            ${recipe.cookingHistory
              .map(
                (date) => `
              <li style="color: #374151; font-size: 14px;">• ${date.toLocaleDateString()} (${window.Utils.formatRelativeDate(date, this.translation.currentLanguage)})</li>
            `,
              )
              .join("")}
          </ul>
        </div>
      `
    }

    cardContent += `
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid rgba(239, 68, 68, 0.1);">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
          ${t("generatedBy")} Cocina para Uno • ${new Date().toLocaleDateString()}
        </p>
      </div>
    `
    tempDiv.innerHTML = cardContent

    try {
      const html2canvas = window.html2canvas // Declare the variable before using it
      const canvas = await html2canvas(tempDiv, {
        scale: 2, // Higher scale for better quality
        useCORS: true, // Important for images from external domains
        backgroundColor: null, // Transparent background if needed, or match card background
      })

      // Convert to blob and download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${this.sanitizeFilename(recipe.name)}-card.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }, "image/png")
    } finally {
      document.body.removeChild(tempDiv)
    }
  }

  // Utility methods
  async getImageAsBase64(url) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = "anonymous" // Required for CORS
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        resolve(canvas.toDataURL("image/jpeg", 0.8)) // Adjust quality as needed
      }
      img.onerror = (e) => {
        console.error("Error loading image for base64 conversion:", e)
        reject(new Error("Failed to load image for base64 conversion."))
      }
      img.src = url
    })
  }

  sanitizeFilename(filename) {
    return filename
      .replace(/[^a-z0-9\s]/gi, "")
      .replace(/\s+/g, "_")
      .toLowerCase()
  }

  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  showExportLoading() {
    const modalContent = document.querySelector("#export-modal .modal-content")
    if (!modalContent) return

    const loadingOverlay = document.createElement("div")
    loadingOverlay.className = "export-loading"
    loadingOverlay.innerHTML = `
      <div class="loading-spinner"></div>
      <p>${this.translation.get("exportingRecipe") || "Exportando receta..."}</p>
      <div class="export-progress-bar-container">
        <div class="export-progress-bar" id="export-progress-bar"></div>
      </div>
    `
    modalContent.appendChild(loadingOverlay)

    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15 // Simulate random progress
      if (progress > 95) progress = 95 // Don't reach 100% until complete
      const progressBar = document.getElementById("export-progress-bar")
      if (progressBar) {
        progressBar.style.width = `${progress}%`
      }
    }, 200)
    this.progressInterval = interval
  }

  hideExportLoading() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval)
    }
    const progressBar = document.getElementById("export-progress-bar")
    if (progressBar) {
      progressBar.style.width = "100%" // Ensure it completes
    }

    const loadingOverlay = document.querySelector(".export-loading")
    if (loadingOverlay) {
      setTimeout(() => {
        loadingOverlay.remove()
      }, 300) // Small delay to show 100%
    }
  }
}

// Export for global use
window.ExportManager = ExportManager
