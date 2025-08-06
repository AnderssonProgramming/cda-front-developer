// Utility Functions
class Utils {
  // Generate unique ID
  static generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // Sanitize HTML to prevent XSS
  static sanitizeHTML(str) {
    const div = document.createElement("div")
    div.appendChild(document.createTextNode(str))
    return div.innerHTML
  }

  // Debounce function
  static debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  // Format relative date
  static formatRelativeDate(date, lang) {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const t = window.app.translationManager.get.bind(window.app.translationManager)

    if (diffDays === 0) return t("today")
    if (diffDays === 1) return t("yesterday")
    return t("daysAgo").replace("{days}", diffDays.toString())
  }

  // Check if device is mobile
  static isMobile() {
    return window.innerWidth <= 768
  }

  // Search matching
  static matchesSearch(text, search) {
    return text.toLowerCase().includes(search.toLowerCase())
  }

  // Get Unsplash image
  static async getUnsplashImage(query) {
    try {
      const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || 'demo-access-key'
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&client_id=${accessKey}`,
      )
      const data = await response.json()
      return data.results[0]?.urls?.small || "/placeholder.svg?height=300&width=400"
    } catch (error) {
      console.error("Error fetching Unsplash image:", error)
      return "/placeholder.svg?height=300&width=400"
    }
  }

  // Get ingredient image
  static async getIngredientImage(ingredient) {
    try {
      const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || 'demo-access-key'
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(ingredient + " food ingredient")}&per_page=1&client_id=${accessKey}`,
      )
      const data = await response.json()
      return data.results[0]?.urls?.thumb || "/placeholder.svg?height=50&width=50"
    } catch (error) {
      console.error("Error fetching ingredient image:", error)
      return "/placeholder.svg?height=50&width=50"
    }
  }

  // Show toast notification
  static showToast(message, type = "info", duration = 3000) {
    const toastContainer = document.getElementById("toast-container")
    if (!toastContainer) return

    const toast = document.createElement("div")
    toast.className = `toast ${type}`
    toast.textContent = message
    toastContainer.appendChild(toast)

    setTimeout(() => {
      toast.style.animation = "slideOut 0.3s ease forwards"
      toast.addEventListener("animationend", () => {
        toast.remove()
      })
    }, duration)
  }

  // Format file size
  static formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Deep clone object
  static deepClone(obj) {
    if (obj === null || typeof obj !== "object") return obj
    if (obj instanceof Date) return new Date(obj.getTime())
    if (obj instanceof Array) return obj.map((item) => Utils.deepClone(item))
    if (typeof obj === "object") {
      const clonedObj = {}
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = Utils.deepClone(obj[key])
        }
      }
      return clonedObj
    }
  }

  // Validate email
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Generate random color
  static getRandomColor() {
    const colors = [
      "#ef4444",
      "#f97316",
      "#f59e0b",
      "#eab308",
      "#84cc16",
      "#22c55e",
      "#10b981",
      "#14b8a6",
      "#06b6d4",
      "#0ea5e9",
      "#3b82f6",
      "#6366f1",
      "#8b5cf6",
      "#a855f7",
      "#d946ef",
      "#ec4899",
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  // Truncate text
  static truncateText(text, maxLength) {
    if (text.length <= maxLength) return text
    return text.substr(0, maxLength) + "..."
  }

  // Get contrast color (black or white) for a given background color
  static getContrastColor(hexColor) {
    // Remove # if present
    hexColor = hexColor.replace("#", "")

    // Convert to RGB
    const r = Number.parseInt(hexColor.substr(0, 2), 16)
    const g = Number.parseInt(hexColor.substr(2, 2), 16)
    const b = Number.parseInt(hexColor.substr(4, 2), 16)

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

    return luminance > 0.5 ? "#000000" : "#ffffff"
  }

  // Smooth scroll to element
  static scrollToElement(element, offset = 0) {
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
    const offsetPosition = elementPosition - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    })
  }

  // Check if element is in viewport
  static isInViewport(element) {
    const rect = element.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  }

  // Local storage with error handling
  static setLocalStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error("Error saving to localStorage:", error)
      return false
    }
  }

  static getLocalStorage(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error("Error reading from localStorage:", error)
      return defaultValue
    }
  }

  // Performance measurement
  static measurePerformance(name, fn) {
    const start = performance.now()
    const result = fn()
    const end = performance.now()
    console.log(`${name} took ${end - start} milliseconds`)
    return result
  }

  // Wait for element to exist
  static waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector)
      if (element) {
        resolve(element)
        return
      }

      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector)
        if (element) {
          observer.disconnect()
          resolve(element)
        }
      })

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      })

      setTimeout(() => {
        observer.disconnect()
        reject(new Error(`Element ${selector} not found within ${timeout}ms`))
      }, timeout)
    })
  }

  // Load script dynamically
  static async loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script")
      script.src = src
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    })
  }
}

// Export for global use
window.Utils = Utils
