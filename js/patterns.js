// Design Patterns and Architectural Components

// Observer Pattern for Event Management
class EventObserver {
  constructor() {
    this.observers = new Map()
  }

  subscribe(event, callback) {
    if (!this.observers.has(event)) {
      this.observers.set(event, [])
    }
    this.observers.get(event).push(callback)
  }

  unsubscribe(event, callback) {
    if (this.observers.has(event)) {
      const callbacks = this.observers.get(event)
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  notify(event, data) {
    if (this.observers.has(event)) {
      this.observers.get(event).forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`Error in observer for event ${event}:`, error)
        }
      })
    }
  }

  clear(event) {
    if (event) {
      this.observers.delete(event)
    } else {
      this.observers.clear()
    }
  }
}

// Singleton Pattern for Global State Management
class StateManager {
  constructor() {
    if (StateManager.instance) {
      return StateManager.instance
    }
    
    this.state = new window.AppState()
    this.observers = new EventObserver()
    this.history = []
    this.maxHistorySize = 50
    
    StateManager.instance = this
  }

  setState(newState) {
    const oldState = { ...this.state }
    this.state.setState(newState)
    
    // Add to history
    this.history.push({
      timestamp: new Date(),
      oldState,
      newState: { ...this.state }
    })
    
    // Limit history size
    if (this.history.length > this.maxHistorySize) {
      this.history.shift()
    }
    
    // Notify observers
    this.observers.notify('stateChanged', {
      oldState,
      newState: this.state
    })
  }

  getState() {
    return this.state
  }

  subscribe(event, callback) {
    this.observers.subscribe(event, callback)
  }

  unsubscribe(event, callback) {
    this.observers.unsubscribe(event, callback)
  }

  undo() {
    if (this.history.length > 0) {
      const lastState = this.history.pop()
      this.state = new window.AppState()
      Object.assign(this.state, lastState.oldState)
      this.observers.notify('stateChanged', {
        oldState: lastState.newState,
        newState: this.state
      })
    }
  }

  clearHistory() {
    this.history = []
  }
}

// Strategy Pattern for Different Export Formats
class ExportStrategy {
  export(data) {
    throw new Error('Export method must be implemented')
  }
}

class JSONExportStrategy extends ExportStrategy {
  export(data) {
    return JSON.stringify(data, null, 2)
  }
}

class CSVExportStrategy extends ExportStrategy {
  export(data) {
    if (!Array.isArray(data)) {
      data = [data]
    }
    
    const headers = Object.keys(data[0])
    const csvRows = [headers.join(',')]
    
    data.forEach(item => {
      const values = headers.map(header => {
        const value = item[header]
        return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
      })
      csvRows.push(values.join(','))
    })
    
    return csvRows.join('\n')
  }
}

class XMLExportStrategy extends ExportStrategy {
  export(data) {
    const xmlString = this.objectToXML(data, 'root')
    return '<?xml version="1.0" encoding="UTF-8"?>\n' + xmlString
  }
  
  objectToXML(obj, rootName) {
    let xml = `<${rootName}>`
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key]
        if (typeof value === 'object' && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(item => {
              xml += this.objectToXML(item, key)
            })
          } else {
            xml += this.objectToXML(value, key)
          }
        } else {
          xml += `<${key}>${value}</${key}>`
        }
      }
    }
    
    xml += `</${rootName}>`
    return xml
  }
}

// Factory Pattern for Creating UI Components
class UIComponentFactory {
  static createComponent(type, options = {}) {
    switch (type) {
      case 'button':
        return this.createButton(options)
      case 'input':
        return this.createInput(options)
      case 'select':
        return this.createSelect(options)
      case 'modal':
        return this.createModal(options)
      case 'card':
        return this.createCard(options)
      case 'rating':
        return this.createRating(options)
      default:
        throw new Error(`Unknown component type: ${type}`)
    }
  }

  static createButton(options) {
    const button = document.createElement('button')
    button.className = `btn ${options.variant || 'primary'}`
    button.textContent = options.text || 'Button'
    button.type = options.type || 'button'
    
    if (options.onclick) {
      button.addEventListener('click', options.onclick)
    }
    
    if (options.disabled) {
      button.disabled = true
    }
    
    return button
  }

  static createInput(options) {
    const input = document.createElement('input')
    input.type = options.type || 'text'
    input.className = 'form-control'
    input.placeholder = options.placeholder || ''
    input.value = options.value || ''
    
    if (options.required) {
      input.required = true
    }
    
    if (options.onchange) {
      input.addEventListener('input', options.onchange)
    }
    
    return input
  }

  static createSelect(options) {
    const select = document.createElement('select')
    select.className = 'form-control'
    
    if (options.options) {
      options.options.forEach(option => {
        const optionElement = document.createElement('option')
        optionElement.value = option.value
        optionElement.textContent = option.text
        if (option.selected) {
          optionElement.selected = true
        }
        select.appendChild(optionElement)
      })
    }
    
    if (options.onchange) {
      select.addEventListener('change', options.onchange)
    }
    
    return select
  }

  static createModal(options) {
    const modal = document.createElement('div')
    modal.className = 'modal'
    modal.style.display = 'none'
    
    const modalContent = document.createElement('div')
    modalContent.className = 'modal-content'
    
    const modalHeader = document.createElement('div')
    modalHeader.className = 'modal-header'
    modalHeader.innerHTML = `
      <h2>${options.title || 'Modal'}</h2>
      <button class="close-btn" onclick="this.closest('.modal').style.display='none'">×</button>
    `
    
    const modalBody = document.createElement('div')
    modalBody.className = 'modal-body'
    if (options.content) {
      modalBody.innerHTML = options.content
    }
    
    modalContent.appendChild(modalHeader)
    modalContent.appendChild(modalBody)
    modal.appendChild(modalContent)
    
    return modal
  }

  static createCard(options) {
    const card = document.createElement('div')
    card.className = 'recipe-card'
    
    card.innerHTML = `
      <div class="recipe-image">
        <img src="${options.image || 'placeholder.jpg'}" alt="${options.title || 'Recipe'}">
      </div>
      <div class="recipe-info">
        <h3>${options.title || 'Recipe Title'}</h3>
        <p class="category">${options.category || 'Category'}</p>
        <div class="recipe-meta">
          <span class="time">${options.time || '30'} min</span>
          <span class="difficulty">${options.difficulty || 'Medium'}</span>
        </div>
      </div>
    `
    
    if (options.onclick) {
      card.addEventListener('click', options.onclick)
    }
    
    return card
  }

  static createRating(options) {
    const rating = document.createElement('div')
    rating.className = 'star-rating'
    
    const value = options.value || 0
    const maxStars = options.maxStars || 5
    
    for (let i = 1; i <= maxStars; i++) {
      const star = document.createElement('span')
      star.className = 'star'
      star.innerHTML = '★'
      star.dataset.value = i
      
      if (i <= value) {
        star.classList.add('active')
      }
      
      if (options.interactive) {
        star.addEventListener('click', () => {
          if (options.onRating) {
            options.onRating(i)
          }
        })
      }
      
      rating.appendChild(star)
    }
    
    return rating
  }
}

// Command Pattern for Undo/Redo Functionality
class Command {
  execute() {
    throw new Error('Execute method must be implemented')
  }
  
  undo() {
    throw new Error('Undo method must be implemented')
  }
}

class AddRecipeCommand extends Command {
  constructor(recipe) {
    super()
    this.recipe = recipe
  }
  
  execute() {
    window.StorageManager.addRecipe(this.recipe)
    return this.recipe
  }
  
  undo() {
    window.StorageManager.deleteRecipe(this.recipe.id)
  }
}

class DeleteRecipeCommand extends Command {
  constructor(recipeId) {
    super()
    this.recipeId = recipeId
    this.recipe = null
  }
  
  execute() {
    this.recipe = window.StorageManager.getRecipe(this.recipeId)
    window.StorageManager.deleteRecipe(this.recipeId)
    return this.recipe
  }
  
  undo() {
    if (this.recipe) {
      window.StorageManager.addRecipe(this.recipe)
    }
  }
}

class UpdateRecipeCommand extends Command {
  constructor(recipeId, newData) {
    super()
    this.recipeId = recipeId
    this.newData = newData
    this.oldData = null
  }
  
  execute() {
    this.oldData = window.StorageManager.getRecipe(this.recipeId)
    window.StorageManager.updateRecipe(this.recipeId, this.newData)
    return this.newData
  }
  
  undo() {
    if (this.oldData) {
      window.StorageManager.updateRecipe(this.recipeId, this.oldData)
    }
  }
}

class CommandInvoker {
  constructor() {
    this.history = []
    this.currentPosition = -1
  }
  
  execute(command) {
    // Remove any commands after current position
    this.history = this.history.slice(0, this.currentPosition + 1)
    
    // Execute command
    const result = command.execute()
    
    // Add to history
    this.history.push(command)
    this.currentPosition++
    
    return result
  }
  
  undo() {
    if (this.currentPosition >= 0) {
      const command = this.history[this.currentPosition]
      command.undo()
      this.currentPosition--
      return true
    }
    return false
  }
  
  redo() {
    if (this.currentPosition < this.history.length - 1) {
      this.currentPosition++
      const command = this.history[this.currentPosition]
      command.execute()
      return true
    }
    return false
  }
  
  canUndo() {
    return this.currentPosition >= 0
  }
  
  canRedo() {
    return this.currentPosition < this.history.length - 1
  }
  
  clear() {
    this.history = []
    this.currentPosition = -1
  }
}

// Decorator Pattern for Recipe Enhancement
class RecipeDecorator {
  constructor(recipe) {
    this.recipe = recipe
  }
  
  getName() {
    return this.recipe.name
  }
  
  getDescription() {
    return this.recipe.description
  }
  
  getIngredients() {
    return this.recipe.ingredients
  }
  
  getSteps() {
    return this.recipe.steps
  }
}

class NutritionDecorator extends RecipeDecorator {
  constructor(recipe, nutritionData) {
    super(recipe)
    this.nutritionData = nutritionData
  }
  
  getDescription() {
    const baseDescription = super.getDescription()
    const nutrition = `Nutrition: ${this.nutritionData.calories} cal, ${this.nutritionData.protein}g protein`
    return `${baseDescription}\n${nutrition}`
  }
  
  getNutrition() {
    return this.nutritionData
  }
}

class TimerDecorator extends RecipeDecorator {
  constructor(recipe) {
    super(recipe)
    this.timers = []
  }
  
  addTimer(step, duration) {
    this.timers.push({ step, duration, started: null })
  }
  
  startTimer(stepIndex) {
    if (this.timers[stepIndex]) {
      this.timers[stepIndex].started = Date.now()
    }
  }
  
  getTimeRemaining(stepIndex) {
    const timer = this.timers[stepIndex]
    if (!timer || !timer.started) return null
    
    const elapsed = Date.now() - timer.started
    const remaining = timer.duration - elapsed
    return Math.max(0, remaining)
  }
}

// Adapter Pattern for Different Data Sources
class DataAdapter {
  adapt(data) {
    throw new Error('Adapt method must be implemented')
  }
}

class JSONAdapter extends DataAdapter {
  adapt(jsonData) {
    return JSON.parse(jsonData)
  }
}

class CSVAdapter extends DataAdapter {
  adapt(csvData) {
    const lines = csvData.split('\n')
    const headers = lines[0].split(',')
    const result = []
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',')
      const obj = {}
      
      headers.forEach((header, index) => {
        obj[header.trim()] = values[index] ? values[index].trim() : ''
      })
      
      result.push(obj)
    }
    
    return result
  }
}

class XMLAdapter extends DataAdapter {
  adapt(xmlData) {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlData, 'text/xml')
    return this.xmlToObject(xmlDoc.documentElement)
  }
  
  xmlToObject(node) {
    const obj = {}
    
    if (node.hasAttributes()) {
      obj['@attributes'] = {}
      for (const attr of node.attributes) {
        obj['@attributes'][attr.name] = attr.value
      }
    }
    
    if (node.hasChildNodes()) {
      for (const child of node.childNodes) {
        if (child.nodeType === 1) { // Element node
          const childObj = this.xmlToObject(child)
          if (obj[child.nodeName]) {
            if (!Array.isArray(obj[child.nodeName])) {
              obj[child.nodeName] = [obj[child.nodeName]]
            }
            obj[child.nodeName].push(childObj)
          } else {
            obj[child.nodeName] = childObj
          }
        } else if (child.nodeType === 3) { // Text node
          const text = child.nodeValue.trim()
          if (text) {
            obj['#text'] = text
          }
        }
      }
    }
    
    return obj
  }
}

// Module Pattern for Isolated Functionality
const RecipeAnalytics = (function() {
  let analytics = {
    views: {},
    searches: {},
    exports: {},
    cookingTimes: {}
  }
  
  function trackView(recipeId) {
    analytics.views[recipeId] = (analytics.views[recipeId] || 0) + 1
  }
  
  function trackSearch(query) {
    analytics.searches[query] = (analytics.searches[query] || 0) + 1
  }
  
  function trackExport(format) {
    analytics.exports[format] = (analytics.exports[format] || 0) + 1
  }
  
  function trackCookingTime(recipeId, time) {
    if (!analytics.cookingTimes[recipeId]) {
      analytics.cookingTimes[recipeId] = []
    }
    analytics.cookingTimes[recipeId].push(time)
  }
  
  function getAnalytics() {
    return { ...analytics }
  }
  
  function getMostViewed(limit = 10) {
    return Object.entries(analytics.views)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([id, count]) => ({ recipeId: id, views: count }))
  }
  
  function getMostSearched(limit = 10) {
    return Object.entries(analytics.searches)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([query, count]) => ({ query, searches: count }))
  }
  
  function getAverageCookingTime(recipeId) {
    const times = analytics.cookingTimes[recipeId]
    if (!times || times.length === 0) return null
    
    const total = times.reduce((sum, time) => sum + time, 0)
    return total / times.length
  }
  
  function reset() {
    analytics = {
      views: {},
      searches: {},
      exports: {},
      cookingTimes: {}
    }
  }
  
  return {
    trackView,
    trackSearch,
    trackExport,
    trackCookingTime,
    getAnalytics,
    getMostViewed,
    getMostSearched,
    getAverageCookingTime,
    reset
  }
})()

// Export patterns and utilities
window.EventObserver = EventObserver
window.StateManager = StateManager
window.ExportStrategy = ExportStrategy
window.JSONExportStrategy = JSONExportStrategy
window.CSVExportStrategy = CSVExportStrategy
window.XMLExportStrategy = XMLExportStrategy
window.UIComponentFactory = UIComponentFactory
window.Command = Command
window.AddRecipeCommand = AddRecipeCommand
window.DeleteRecipeCommand = DeleteRecipeCommand
window.UpdateRecipeCommand = UpdateRecipeCommand
window.CommandInvoker = CommandInvoker
window.RecipeDecorator = RecipeDecorator
window.NutritionDecorator = NutritionDecorator
window.TimerDecorator = TimerDecorator
window.DataAdapter = DataAdapter
window.JSONAdapter = JSONAdapter
window.CSVAdapter = CSVAdapter
window.XMLAdapter = XMLAdapter
window.RecipeAnalytics = RecipeAnalytics

// Initialize global state manager
window.GlobalState = new StateManager()
