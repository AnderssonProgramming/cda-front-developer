/**
 * COCINA PARA UNO - MAIN APPLICATION
 * Complete functional application with PWA, multi-language and auto-image features
 * Author: CDA Front Developer
 * Date: 2025
 * Version: 4.0.0 - Fixed and Enhanced
 */

/**
 * Global Configuration
 */
const APP_CONFIG = {
  version: '4.0.0',
  name: 'Cocina para Uno',
  themeKey: 'oneCooking-theme',
  languageKey: 'oneCooking-language',
  recipesKey: 'oneCooking-recipes',
  favoritesKey: 'oneCooking-favorites',
  imageFormats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
  maxFileSize: 5 * 1024 * 1024, // 5MB
  autoSaveDelay: 1000
};

/**
 * Multi-language support - Translations with more languages
 */
const TRANSLATIONS = {
  es: {
    flag: '🇪🇸',
    name: 'Español',
    appTitle: 'Cocina para Uno',
    appSubtitle: 'Tu recetario personal',
    searchPlaceholder: 'Buscar recetas, ingredientes...',
    newRecipe: 'Nueva Receta',
    allRecipes: 'Todas',
    favorites: 'Favoritas',
    categories: 'Categorías',
    recipes: 'Recetas',
    emptyStateTitle: '¡Comienza tu aventura culinaria!',
    emptyStateDescription: 'Crea tu primera receta y comienza a organizar tu colección personal de recetas',
    addFirstRecipe: '+ Agregar mi primera receta',
    noResultsTitle: 'No se encontraron recetas',
    noResultsDescription: 'Intenta con otros términos de búsqueda o agrega una nueva receta',
    clearSearch: 'Limpiar búsqueda',
    view: 'Ver receta',
    edit: 'Editar receta',
    share: 'Compartir receta',
    delete: 'Eliminar receta',
    close: 'Cerrar',
    ingredients: 'Ingredientes',
    preparation: 'Preparación',
    notes: 'Notas',
    cookingTime: 'Tiempo de cocción',
    difficulty: 'Dificultad',
    servings: 'Porciones',
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    warning: 'Advertencia',
    info: 'Información',
    recipeTitle: 'Título de la receta',
    recipeDescription: 'Descripción',
    addIngredient: 'Agregar ingrediente',
    addStep: 'Agregar paso',
    saveRecipe: 'Guardar receta',
    cancel: 'Cancelar',
    installApp: 'Instalar App',
    updateAvailable: 'Actualización disponible',
    updateNow: 'Actualizar ahora',
    later: 'Más tarde',
    connectionRestored: 'Conexión restaurada',
    offlineMode: 'Modo sin conexión activado',
    linkCopied: 'Enlace copiado al portapapeles',
    addedToFavorites: 'agregada a favoritos',
    removedFromFavorites: 'quitada de favoritos',
    recipeDeleted: 'eliminada correctamente',
    language: 'Idioma',
    changeLanguage: 'Cambiar idioma',
    changed: 'cambiado',
    searchingImage: 'Buscando imagen automática...',
    imageFound: 'Imagen encontrada automáticamente',
    imageNotFound: 'No se pudo encontrar imagen automática'
  },
  en: {
    flag: '🇺🇸',
    name: 'English',
    appTitle: 'Cooking for One',
    appSubtitle: 'Your personal recipe book',
    searchPlaceholder: 'Search recipes, ingredients...',
    newRecipe: 'New Recipe',
    allRecipes: 'All',
    favorites: 'Favorites',
    categories: 'Categories',
    recipes: 'Recipes',
    emptyStateTitle: 'Start your culinary adventure!',
    emptyStateDescription: 'Create your first recipe and start organizing your personal recipe collection',
    addFirstRecipe: '+ Add my first recipe',
    noResultsTitle: 'No recipes found',
    noResultsDescription: 'Try other search terms or add a new recipe',
    clearSearch: 'Clear search',
    view: 'View recipe',
    edit: 'Edit recipe',
    share: 'Share recipe',
    delete: 'Delete recipe',
    close: 'Close',
    ingredients: 'Ingredients',
    preparation: 'Preparation',
    notes: 'Notes',
    cookingTime: 'Cooking time',
    difficulty: 'Difficulty',
    servings: 'Servings',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Information',
    recipeTitle: 'Recipe title',
    recipeDescription: 'Description',
    addIngredient: 'Add ingredient',
    addStep: 'Add step',
    saveRecipe: 'Save recipe',
    cancel: 'Cancel',
    installApp: 'Install App',
    updateAvailable: 'Update available',
    updateNow: 'Update now',
    later: 'Later',
    connectionRestored: 'Connection restored',
    offlineMode: 'Offline mode activated',
    linkCopied: 'Link copied to clipboard',
    addedToFavorites: 'added to favorites',
    removedFromFavorites: 'removed from favorites',
    recipeDeleted: 'deleted successfully',
    language: 'Language',
    changeLanguage: 'Change language',
    changed: 'changed',
    searchingImage: 'Searching for automatic image...',
    imageFound: 'Image found automatically',
    imageNotFound: 'Could not find automatic image'
  },
  fr: {
    flag: '🇫🇷',
    name: 'Français',
    appTitle: 'Cuisine pour Un',
    appSubtitle: 'Votre livre de recettes personnel',
    searchPlaceholder: 'Rechercher recettes, ingrédients...',
    newRecipe: 'Nouvelle Recette',
    allRecipes: 'Toutes',
    favorites: 'Favoris',
    categories: 'Catégories',
    recipes: 'Recettes',
    emptyStateTitle: 'Commencez votre aventure culinaire!',
    emptyStateDescription: 'Créez votre première recette et commencez à organiser votre collection personnelle',
    addFirstRecipe: '+ Ajouter ma première recette',
    noResultsTitle: 'Aucune recette trouvée',
    noResultsDescription: 'Essayez d\'autres termes de recherche ou ajoutez une nouvelle recette',
    clearSearch: 'Effacer la recherche',
    view: 'Voir la recette',
    edit: 'Modifier la recette',
    share: 'Partager la recette',
    delete: 'Supprimer la recette',
    close: 'Fermer',
    ingredients: 'Ingrédients',
    preparation: 'Préparation',
    notes: 'Notes',
    cookingTime: 'Temps de cuisson',
    difficulty: 'Difficulté',
    servings: 'Portions',
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    warning: 'Avertissement',
    info: 'Information',
    recipeTitle: 'Titre de la recette',
    recipeDescription: 'Description',
    addIngredient: 'Ajouter ingrédient',
    addStep: 'Ajouter étape',
    saveRecipe: 'Sauvegarder recette',
    cancel: 'Annuler',
    installApp: 'Installer App',
    updateAvailable: 'Mise à jour disponible',
    updateNow: 'Mettre à jour maintenant',
    later: 'Plus tard',
    connectionRestored: 'Connexion restaurée',
    offlineMode: 'Mode hors ligne activé',
    linkCopied: 'Lien copié dans le presse-papiers',
    addedToFavorites: 'ajoutée aux favoris',
    removedFromFavorites: 'retirée des favoris',
    recipeDeleted: 'supprimée avec succès',
    language: 'Langue',
    changeLanguage: 'Changer de langue',
    changed: 'changé',
    searchingImage: 'Recherche d\'image automatique...',
    imageFound: 'Image trouvée automatiquement',
    imageNotFound: 'Impossible de trouver une image automatique'
  },
  de: {
    flag: '🇩🇪',
    name: 'Deutsch',
    appTitle: 'Kochen für Eine Person',
    appSubtitle: 'Ihr persönliches Rezeptbuch',
    searchPlaceholder: 'Rezepte, Zutaten suchen...',
    newRecipe: 'Neues Rezept',
    allRecipes: 'Alle',
    favorites: 'Favoriten',
    categories: 'Kategorien',
    recipes: 'Rezepte',
    emptyStateTitle: 'Beginnen Sie Ihr kulinarisches Abenteuer!',
    emptyStateDescription: 'Erstellen Sie Ihr erstes Rezept und organisieren Sie Ihre persönliche Rezeptsammlung',
    addFirstRecipe: '+ Mein erstes Rezept hinzufügen',
    noResultsTitle: 'Keine Rezepte gefunden',
    noResultsDescription: 'Versuchen Sie andere Suchbegriffe oder fügen Sie ein neues Rezept hinzu',
    clearSearch: 'Suche löschen',
    view: 'Rezept ansehen',
    edit: 'Rezept bearbeiten',
    share: 'Rezept teilen',
    delete: 'Rezept löschen',
    close: 'Schließen',
    ingredients: 'Zutaten',
    preparation: 'Zubereitung',
    notes: 'Notizen',
    cookingTime: 'Kochzeit',
    difficulty: 'Schwierigkeit',
    servings: 'Portionen',
    loading: 'Laden...',
    error: 'Fehler',
    success: 'Erfolg',
    warning: 'Warnung',
    info: 'Information',
    recipeTitle: 'Rezept Titel',
    recipeDescription: 'Beschreibung',
    addIngredient: 'Zutat hinzufügen',
    addStep: 'Schritt hinzufügen',
    saveRecipe: 'Rezept speichern',
    cancel: 'Abbrechen',
    installApp: 'App installieren',
    updateAvailable: 'Update verfügbar',
    updateNow: 'Jetzt aktualisieren',
    later: 'Später',
    connectionRestored: 'Verbindung wiederhergestellt',
    offlineMode: 'Offline-Modus aktiviert',
    linkCopied: 'Link in die Zwischenablage kopiert',
    addedToFavorites: 'zu Favoriten hinzugefügt',
    removedFromFavorites: 'aus Favoriten entfernt',
    recipeDeleted: 'erfolgreich gelöscht',
    language: 'Sprache',
    changeLanguage: 'Sprache ändern',
    changed: 'geändert',
    searchingImage: 'Automatisches Bild suchen...',
    imageFound: 'Bild automatisch gefunden',
    imageNotFound: 'Automatisches Bild nicht gefunden'
  },
  it: {
    flag: '🇮🇹',
    name: 'Italiano',
    appTitle: 'Cucinare per Uno',
    appSubtitle: 'Il tuo ricettario personale',
    searchPlaceholder: 'Cerca ricette, ingredienti...',
    newRecipe: 'Nuova Ricetta',
    allRecipes: 'Tutte',
    favorites: 'Preferite',
    categories: 'Categorie',
    recipes: 'Ricette',
    emptyStateTitle: 'Inizia la tua avventura culinaria!',
    emptyStateDescription: 'Crea la tua prima ricetta e inizia a organizzare la tua collezione personale',
    addFirstRecipe: '+ Aggiungi la mia prima ricetta',
    noResultsTitle: 'Nessuna ricetta trovata',
    noResultsDescription: 'Prova altri termini di ricerca o aggiungi una nuova ricetta',
    clearSearch: 'Cancella ricerca',
    view: 'Visualizza ricetta',
    edit: 'Modifica ricetta',
    share: 'Condividi ricetta',
    delete: 'Elimina ricetta',
    close: 'Chiudi',
    ingredients: 'Ingredienti',
    preparation: 'Preparazione',
    notes: 'Note',
    cookingTime: 'Tempo di cottura',
    difficulty: 'Difficoltà',
    servings: 'Porzioni',
    loading: 'Caricamento...',
    error: 'Errore',
    success: 'Successo',
    warning: 'Avvertimento',
    info: 'Informazione',
    recipeTitle: 'Titolo ricetta',
    recipeDescription: 'Descrizione',
    addIngredient: 'Aggiungi ingrediente',
    addStep: 'Aggiungi passaggio',
    saveRecipe: 'Salva ricetta',
    cancel: 'Annulla',
    installApp: 'Installa App',
    updateAvailable: 'Aggiornamento disponibile',
    updateNow: 'Aggiorna ora',
    later: 'Più tardi',
    connectionRestored: 'Connessione ripristinata',
    offlineMode: 'Modalità offline attivata',
    linkCopied: 'Link copiato negli appunti',
    addedToFavorites: 'aggiunta ai preferiti',
    removedFromFavorites: 'rimossa dai preferiti',
    recipeDeleted: 'eliminata con successo',
    language: 'Lingua',
    changeLanguage: 'Cambia lingua',
    changed: 'cambiato',
    searchingImage: 'Ricerca immagine automatica...',
    imageFound: 'Immagine trovata automaticamente',
    imageNotFound: 'Impossibile trovare immagine automatica'
  },
  pt: {
    flag: '🇵🇹',
    name: 'Português',
    appTitle: 'Cozinhar para Um',
    appSubtitle: 'Seu livro de receitas pessoal',
    searchPlaceholder: 'Buscar receitas, ingredientes...',
    newRecipe: 'Nova Receita',
    allRecipes: 'Todas',
    favorites: 'Favoritas',
    categories: 'Categorias',
    recipes: 'Receitas',
    emptyStateTitle: 'Comece sua aventura culinária!',
    emptyStateDescription: 'Crie sua primeira receita e comece a organizar sua coleção pessoal',
    addFirstRecipe: '+ Adicionar minha primeira receita',
    noResultsTitle: 'Nenhuma receita encontrada',
    noResultsDescription: 'Tente outros termos de busca ou adicione uma nova receita',
    clearSearch: 'Limpar busca',
    view: 'Ver receita',
    edit: 'Editar receita',
    share: 'Compartilhar receita',
    delete: 'Excluir receita',
    close: 'Fechar',
    ingredients: 'Ingredientes',
    preparation: 'Preparo',
    notes: 'Notas',
    cookingTime: 'Tempo de cozimento',
    difficulty: 'Dificuldade',
    servings: 'Porções',
    loading: 'Carregando...',
    error: 'Erro',
    success: 'Sucesso',
    warning: 'Aviso',
    info: 'Informação',
    recipeTitle: 'Título da receita',
    recipeDescription: 'Descrição',
    addIngredient: 'Adicionar ingrediente',
    addStep: 'Adicionar passo',
    saveRecipe: 'Salvar receita',
    cancel: 'Cancelar',
    installApp: 'Instalar App',
    updateAvailable: 'Atualização disponível',
    updateNow: 'Atualizar agora',
    later: 'Mais tarde',
    connectionRestored: 'Conexão restaurada',
    offlineMode: 'Modo offline ativado',
    linkCopied: 'Link copiado para área de transferência',
    addedToFavorites: 'adicionada aos favoritos',
    removedFromFavorites: 'removida dos favoritos',
    recipeDeleted: 'excluída com sucesso',
    language: 'Idioma',
    changeLanguage: 'Mudar idioma',
    changed: 'alterado',
    searchingImage: 'Buscando imagem automática...',
    imageFound: 'Imagem encontrada automaticamente',
    imageNotFound: 'Não foi possível encontrar imagem automática'
  }
};

/**
 * Current language global variable
 */
let currentLanguage = localStorage.getItem(APP_CONFIG.languageKey) || 'es';

/**
 * Translation helper function
 */
function t(key) {
  return TRANSLATIONS[currentLanguage]?.[key] || key;
}

/**
 * DOM Elements Cache
 */
const DOM = {
  loadingScreen: null,
  searchInput: null,
  searchClear: null,
  searchResults: null,
  themeToggle: null,
  filterButtons: null,
  recipesGrid: null,
  emptyState: null,
  noResults: null,
  recipeModal: null,
  recipeFormModal: null,
  recipeForm: null,
  toastContainer: null,
  languageToggle: null,
  languageMenu: null,
  languageOptions: null
};

/**
 * Initialize DOM elements
 */
function initializeDOM() {
  console.log('🔧 Initializing DOM elements...');
  
  DOM.loadingScreen = document.getElementById('loading-screen');
  DOM.searchInput = document.getElementById('search-input');
  DOM.searchClear = document.querySelector('.search__clear');
  DOM.searchResults = document.getElementById('search-results-count');
  DOM.themeToggle = document.querySelector('.theme-toggle');
  DOM.filterButtons = document.querySelectorAll('.filter-btn');
  DOM.recipesGrid = document.getElementById('recipes-grid');
  DOM.emptyState = document.getElementById('empty-state');
  DOM.noResults = document.getElementById('no-results');
  DOM.recipeModal = document.getElementById('recipe-modal');
  DOM.recipeFormModal = document.getElementById('recipe-form-modal');
  DOM.recipeForm = document.getElementById('recipe-form');
  DOM.toastContainer = document.getElementById('toast-container');
  DOM.languageToggle = document.querySelector('.language-selector__toggle');
  DOM.languageMenu = document.querySelector('.language-selector__dropdown');
  DOM.languageOptions = document.querySelectorAll('.language-selector__option');
  
  console.log('🔧 DOM elements initialized:');
  console.log('- themeToggle:', !!DOM.themeToggle);
  console.log('- searchInput:', !!DOM.searchInput);
  console.log('- languageToggle:', !!DOM.languageToggle);
}

/**
 * Recipe class definition
 */
class Recipe {
  constructor(data = {}) {
    this.id = data.id || Date.now().toString() + Math.random().toString(36).substring(2, 9);
    this.title = data.title || '';
    this.description = data.description || '';
    this.ingredients = data.ingredients || [];
    this.steps = data.steps || [];
    this.cookingTime = data.cookingTime || 0;
    this.difficulty = data.difficulty || 'Fácil';
    this.servings = data.servings || 1;
    this.categories = data.categories || [];
    this.imageUrl = data.imageUrl || '';
    this.notes = data.notes || '';
    this.dateCreated = data.dateCreated || new Date().toISOString();
    this.dateModified = data.dateModified || new Date().toISOString();
    this.isFavorite = data.isFavorite || false;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      ingredients: this.ingredients,
      steps: this.steps,
      cookingTime: this.cookingTime,
      difficulty: this.difficulty,
      servings: this.servings,
      categories: this.categories,
      imageUrl: this.imageUrl,
      notes: this.notes,
      dateCreated: this.dateCreated,
      dateModified: this.dateModified,
      isFavorite: this.isFavorite
    };
  }

  static fromJSON(data) {
    return new Recipe(data);
  }
}

/**
 * Singleton Pattern Base Class
 */
class SingletonPattern {
  constructor() {
    if (this.constructor.instance) {
      return this.constructor.instance;
    }
    this.constructor.instance = this;
    this.initialize();
    return this;
  }

  initialize() {
    // Override in subclasses
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new this();
    }
    return this.instance;
  }
}

/**
 * Observer Pattern implementation
 */
const ObserverPattern = {
  observers: {},

  subscribe(event, callback) {
    if (!this.observers[event]) {
      this.observers[event] = [];
    }
    this.observers[event].push(callback);
  },

  unsubscribe(event, callback) {
    if (this.observers[event]) {
      this.observers[event] = this.observers[event].filter(obs => obs !== callback);
    }
  },

  notifyObservers(event, data) {
    if (this.observers[event]) {
      this.observers[event].forEach(callback => callback(data));
    }
  }
};

/**
 * Auto-Image Service for recipes and ingredients
 */
class ImageService {
  static imageCache = new Map();
  static searchHistory = new Map();

  static async searchImage(query, type = 'recipe', size = '400x300') {
    try {
      console.log(`🔍 Searching image for: "${query}" (type: ${type})`);
      
      // Check cache first
      const cacheKey = `${query}-${type}-${size}`;
      if (this.imageCache.has(cacheKey)) {
        const cachedUrl = this.imageCache.get(cacheKey);
        console.log(`✅ Found cached image for "${query}"`);
        return cachedUrl;
      }

      // Show searching toast
      showToast('info', t('searchingImage'), { autoDismiss: true });

      // Generate a realistic image URL
      const imageUrl = this.generateRealisticImageUrl(query, type, size);
      
      // Cache the result
      this.imageCache.set(cacheKey, imageUrl);
      this.searchHistory.set(query, { url: imageUrl, timestamp: Date.now() });
      
      // Small delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log(`✅ Image found for "${query}": ${imageUrl}`);
      showToast('success', t('imageFound'), { autoDismiss: true });
      
      return imageUrl;
    } catch (error) {
      console.error('❌ Error searching for image:', error);
      showToast('warning', t('imageNotFound'), { autoDismiss: true });
      return this.getDefaultImage(type);
    }
  }

  static generateRealisticImageUrl(query, type, size) {
    // First try food-specific sources, then fallback to generic
    const [width, height] = size.split('x');
    
    // Try food-specific image sources first
    const foodSources = [
      // Try Unsplash with food-specific keywords
      `https://source.unsplash.com/${width}x${height}/?${encodeURIComponent(query)},food,cooking,recipe`,
      `https://source.unsplash.com/featured/${width}x${height}/?${encodeURIComponent(query)},delicious,meal`,
      `https://source.unsplash.com/${width}x${height}/?${encodeURIComponent(query)},cuisine,dish`,
    ];
    
    // Generate a consistent seed based on query
    let seed = 0;
    for (let i = 0; i < query.length; i++) {
      seed += query.charCodeAt(i);
    }
    
    // Select food source based on seed, with picsum as fallback
    const sourceIndex = seed % (foodSources.length + 1);
    
    if (sourceIndex < foodSources.length) {
      // Use food-specific source
      const selectedSource = foodSources[sourceIndex];
      console.log(`🍽️ Using food image source for "${query}": ${selectedSource}`);
      return selectedSource;
    } else {
      // Fallback to picsum with seed for consistency
      const fallbackUrl = `https://picsum.photos/seed/${seed}/${width}/${height}`;
      console.log(`🖼️ Using fallback image source for "${query}": ${fallbackUrl}`);
      return fallbackUrl;
    }
  }

  static generateImageId(query, type) {
    // Generate a predictable but varied image ID based on query
    const baseIds = {
      recipe: ['1565299543268', '1565299507', '1565299458', '1565299401', '1565299344'],
      ingredient: ['1506368249284', '1506368204', '1506368158', '1506368123', '1506368087']
    };
    
    const seeds = baseIds[type] || baseIds.recipe;
    const index = query.length % seeds.length;
    return seeds[index];
  }

  static buildImageUrl(imageId, size) {
    // Using Unsplash as example (in real app, use your preferred image service)
    return `https://images.unsplash.com/photo-${imageId}?w=${size.split('x')[0]}&h=${size.split('x')[1]}&fit=crop&crop=center&auto=format&q=80`;
  }

  static getDefaultImage(type) {
    const defaults = {
      recipe: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="60" fill="%236b7280">🍲</text></svg>',
      ingredient: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="60" fill="%236b7280">🥘</text></svg>'
    };
    return defaults[type] || defaults.recipe;
  }

  static UNSPLASH_ACCESS_KEY = 'B-kNU-wr__MAHOQg45xN_NZy4tHPqSsguoMNUif8jvk';
  static UNSPLASH_BASE_URL = 'https://api.unsplash.com/search/photos';

  static async searchUnsplashImage(query, type = 'food') {
    try {
      const searchQuery = `${query} ${type}`;
      const url = `${this.UNSPLASH_BASE_URL}?query=${encodeURIComponent(searchQuery)}&client_id=${this.UNSPLASH_ACCESS_KEY}&per_page=1&orientation=landscape`;
      
      console.log(`🔍 Searching Unsplash for: "${searchQuery}"`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const photo = data.results[0];
        const imageUrl = photo.urls.regular;
        console.log(`✅ Unsplash image found: ${imageUrl}`);
        return imageUrl;
      } else {
        console.log(`❌ No Unsplash images found for: "${searchQuery}"`);
        return null;
      }
    } catch (error) {
      console.error('❌ Unsplash API error:', error);
      return null;
    }
  }

  static async searchIngredientImage(ingredient) {
    try {
      console.log(`🥕 Searching ingredient image: ${ingredient}`);
      
      // Check cache first
      const cacheKey = `ingredient-${ingredient}`;
      if (this.imageCache.has(cacheKey)) {
        console.log(`✅ Found cached image for ingredient "${ingredient}"`);
        return this.imageCache.get(cacheKey);
      }
      
      // Try Unsplash first
      const unsplashImage = await this.searchUnsplashImage(ingredient, 'ingredient food');
      if (unsplashImage) {
        this.imageCache.set(cacheKey, unsplashImage);
        return unsplashImage;
      }
      
      // Fallback to search method
      return await this.searchImage(ingredient, 'ingredient', '200x200');
    } catch (error) {
      console.error('Error searching ingredient image:', error);
      return this.getDefaultImage('ingredient');
    }
  }

  static async searchRecipeImage(recipeName) {
    try {
      console.log(`🍽️ Searching recipe image: ${recipeName}`);
      
      // Check cache first
      const cacheKey = `recipe-${recipeName}`;
      if (this.imageCache.has(cacheKey)) {
        console.log(`✅ Found cached image for recipe "${recipeName}"`);
        return this.imageCache.get(cacheKey);
      }
      
      // Try Unsplash first
      const unsplashImage = await this.searchUnsplashImage(recipeName, 'food dish recipe');
      if (unsplashImage) {
        this.imageCache.set(cacheKey, unsplashImage);
        return unsplashImage;
      }
      
      // Fallback to search method
      return await this.searchImage(recipeName, 'recipe', '400x300');
    } catch (error) {
      console.error('Error searching recipe image:', error);
      return this.getDefaultImage('recipe');
    }
  }
}

/**
 * Language Manager for multi-language support
 */
class LanguageManager extends SingletonPattern {
  initialize() {
    this.currentLanguage = currentLanguage;
    this.availableLanguages = Object.keys(TRANSLATIONS).map(code => ({
      code,
      name: TRANSLATIONS[code].name,
      flag: TRANSLATIONS[code].flag
    }));
    
    this.setupLanguageSelector();
  }

  setupLanguageSelector() {
    if (!DOM.languageToggle || !DOM.languageMenu) {
      console.warn('Language selector elements not found');
      return;
    }

    // Update current language display
    this.updateLanguageDisplay();
    
    // Add event listeners
    this.addLanguageSelectorListeners();
  }

  updateLanguageDisplay() {
    const currentLangData = TRANSLATIONS[this.currentLanguage];
    if (!currentLangData) return;

    console.log(`🔄 Updating language display to: ${currentLangData.flag} ${currentLangData.name}`);

    // Update toggle button
    const flagElement = DOM.languageToggle.querySelector('.language-selector__flag');
    const textElement = DOM.languageToggle.querySelector('.language-selector__code');
    
    if (flagElement) flagElement.textContent = currentLangData.flag;
    if (textElement) textElement.textContent = currentLangData.code?.toUpperCase() || currentLangData.name.substring(0, 2).toUpperCase();

    // Update language options
    DOM.languageOptions.forEach(option => {
      const langCode = option.getAttribute('data-lang');
      const isActive = langCode === this.currentLanguage;
      
      option.setAttribute('aria-current', isActive);
      
      if (isActive) {
        option.classList.add('language-selector__option--active');
      } else {
        option.classList.remove('language-selector__option--active');
      }

      // Update option display
      const langData = TRANSLATIONS[langCode];
      if (langData) {
        const optionFlag = option.querySelector('.language-selector__option-flag');
        const optionText = option.querySelector('.language-selector__name');
        
        if (optionFlag) optionFlag.textContent = langData.flag;
        if (optionText) optionText.textContent = langData.name;
      }
    });
  }

  addLanguageSelectorListeners() {
    // Toggle dropdown
    DOM.languageToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const isOpen = !DOM.languageMenu.hasAttribute('hidden');
      
      if (isOpen) {
        DOM.languageMenu.setAttribute('hidden', '');
        DOM.languageToggle.setAttribute('aria-expanded', 'false');
      } else {
        DOM.languageMenu.removeAttribute('hidden');
        DOM.languageToggle.setAttribute('aria-expanded', 'true');
      }
    });

    // Language option selection
    DOM.languageOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        e.preventDefault();
        const newLanguage = option.getAttribute('data-lang');
        this.changeLanguage(newLanguage);
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.language-selector')) {
        DOM.languageMenu.setAttribute('hidden', '');
        DOM.languageToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !DOM.languageMenu.hasAttribute('hidden')) {
        DOM.languageMenu.setAttribute('hidden', '');
        DOM.languageToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  changeLanguage(newLanguage) {
    if (newLanguage === this.currentLanguage) return;

    const oldLanguage = this.currentLanguage;
    this.currentLanguage = newLanguage;
    currentLanguage = newLanguage;

    // Save to localStorage
    localStorage.setItem(APP_CONFIG.languageKey, newLanguage);

    // Update HTML lang attribute
    document.documentElement.lang = newLanguage;

    // Update display
    this.updateLanguageDisplay();

    // Hide dropdown
    DOM.languageMenu.setAttribute('hidden', '');
    DOM.languageMenu.classList.remove('language-selector__dropdown--open');
    DOM.languageToggle.setAttribute('aria-expanded', 'false');

    // Trigger language change event
    ObserverPattern.notifyObservers('languageChanged', { 
      from: oldLanguage, 
      to: newLanguage 
    });

    // Update all UI text
    this.updateUITexts();

    // Show success message
    const langName = this.availableLanguages.find(l => l.code === newLanguage)?.name;
    showToast('success', `${t('language')} ${t('changed')}: ${langName}`);
  }

  updateUITexts() {
    // Update document title
    document.title = `🍲 ${t('appTitle')} | ${t('appSubtitle')}`;

    // Update header
    const headerTitle = document.querySelector('.header__title .header__text');
    const headerSubtitle = document.querySelector('.header__subtitle');
    
    if (headerTitle) headerTitle.textContent = t('appTitle');
    if (headerSubtitle) headerSubtitle.textContent = t('appSubtitle');

    // Update search placeholder
    if (DOM.searchInput) {
      DOM.searchInput.setAttribute('placeholder', t('searchPlaceholder'));
    }

    // Update buttons
    const newRecipeBtn = document.querySelector('.btn--add-recipe .btn__text');
    if (newRecipeBtn) newRecipeBtn.textContent = t('newRecipe');

    // Update filter buttons
    const allBtn = document.querySelector('[data-filter="all"] .filter-btn__text');
    const favBtn = document.querySelector('[data-filter="favorites"] .filter-btn__text');
    const catBtn = document.querySelector('.dropdown__trigger .filter-btn__text');
    
    if (allBtn) allBtn.textContent = t('allRecipes');
    if (favBtn) favBtn.textContent = t('favorites');
    if (catBtn) catBtn.textContent = t('categories');

    // Update empty state
    const emptyTitle = document.querySelector('.empty-state__title');
    const emptyDesc = document.querySelector('.empty-state__description');
    const emptyBtn = document.querySelector('.btn--add-first-recipe .btn__text');
    
    if (emptyTitle) emptyTitle.textContent = t('emptyStateTitle');
    if (emptyDesc) emptyDesc.textContent = t('emptyStateDescription');
    if (emptyBtn) emptyBtn.textContent = t('addFirstRecipe');

    // Update no results state
    const noResultsTitle = document.querySelector('.no-results__title');
    const noResultsDesc = document.querySelector('.no-results__description');
    
    if (noResultsTitle) noResultsTitle.textContent = t('noResultsTitle');
    if (noResultsDesc) noResultsDesc.textContent = t('noResultsDescription');

    // Update stats labels
    const statLabels = document.querySelectorAll('.stat-item__label');
    if (statLabels.length >= 3) {
      statLabels[0].textContent = t('recipes');
      statLabels[1].textContent = t('favorites');
      statLabels[2].textContent = t('categories');
    }

    // Update form modal if it exists
    const formTitle = document.getElementById('form-modal-title');
    if (formTitle) formTitle.textContent = t('newRecipe');

    // Update theme toggle aria-label
    if (DOM.themeToggle) {
      const isDark = document.body.getAttribute('data-theme') === 'dark';
      DOM.themeToggle.setAttribute('aria-label', 
        isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
      );
    }

    // Re-render recipes if app is available
    if (window.app) {
      window.app.render();
    }
  }
}

/**
 * Toast Factory for notifications
 */
class ToastFactory {
  static create(type, message, options = {}) {
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    
    const icons = {
      success: '✅',
      error: '❌', 
      warning: '⚠️',
      info: 'ℹ️',
      loading: '⏳'
    };

    toast.innerHTML = `
      <div class="toast__content">
        <span class="toast__icon" aria-hidden="true">${icons[type] || 'ℹ️'}</span>
        <span class="toast__message">${message}</span>
        ${options.dismissible !== false ? `
          <button class="toast__close" aria-label="${t('close')}">
            <span aria-hidden="true">×</span>
          </button>
        ` : ''}
      </div>
    `;

    // Auto dismiss
    if (options.autoDismiss !== false) {
      setTimeout(() => {
        if (toast.parentNode) {
          toast.remove();
        }
      }, options.duration || (type === 'loading' ? 8000 : 4000));
    }

    // Close button functionality
    const closeBtn = toast.querySelector('.toast__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => toast.remove());
    }

    return toast;
  }
}

/**
 * Global toast function
 */
function showToast(type, message, options = {}) {
  if (!DOM.toastContainer) return;

  const toast = ToastFactory.create(type, message, options);
  DOM.toastContainer.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('toast--show');
  });

  return toast;
}

/**
 * Theme Manager for dark/light mode
 */
class ThemeManager extends SingletonPattern {
  initialize() {
    this.currentTheme = localStorage.getItem(APP_CONFIG.themeKey) || 'light';
    this.applyTheme();
    this.setupThemeToggle();
  }

  applyTheme() {
    console.log(`🎨 Applying theme: ${this.currentTheme}`);
    
    // Apply theme to both body AND document element for full coverage
    document.body.setAttribute('data-theme', this.currentTheme);
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    
    console.log(`✅ data-theme="${this.currentTheme}" applied to body and html`);
    
    // Also add/remove CSS classes for better compatibility
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${this.currentTheme}`);
    
    console.log(`✅ CSS class "theme-${this.currentTheme}" applied to body`);
    
    this.updateThemeToggle();
    
    console.log(`✅ Theme applied: ${this.currentTheme}`);
  }

  updateThemeToggle() {
    console.log('🔄 Updating theme toggle UI...');
    
    if (!DOM.themeToggle) {
      console.warn('❌ Cannot update theme toggle - button not found');
      return;
    }

    const isDark = this.currentTheme === 'dark';
    const icon = DOM.themeToggle.querySelector('.theme-toggle__icon');
    
    if (icon) {
      icon.textContent = isDark ? '☀️' : '🌙';
      console.log(`🔄 Icon updated to: ${icon.textContent}`);
    } else {
      console.warn('❌ Theme toggle icon not found');
    }
    
    DOM.themeToggle.setAttribute('aria-pressed', isDark.toString());
    DOM.themeToggle.setAttribute('aria-label', 
      isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
    );
    
    console.log(`✅ Theme toggle updated for ${this.currentTheme} mode`);
  }

  setupThemeToggle() {
    console.log('🔧 Setting up theme toggle...');
    console.log('DOM.themeToggle:', DOM.themeToggle);
    
    if (!DOM.themeToggle) {
      console.warn('❌ Theme toggle setup failed - button not found');
      // Try to find it again
      DOM.themeToggle = document.querySelector('.theme-toggle');
      console.log('🔄 Retry finding theme toggle:', DOM.themeToggle);
      
      if (!DOM.themeToggle) {
        console.error('❌ Theme toggle button not found in DOM!');
        return;
      }
    }

    console.log('🔧 Setting up theme toggle...');
    
    DOM.themeToggle.addEventListener('click', (e) => {
      e.preventDefault();
      console.log(`🖱️ Theme toggle clicked. Current: ${this.currentTheme}`);
      this.toggleTheme();
    });
    
    console.log('✅ Theme toggle event listener added');
  }

  toggleTheme() {
    const oldTheme = this.currentTheme;
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    
    console.log(`🔄 Toggling theme: ${oldTheme} → ${this.currentTheme}`);
    
    localStorage.setItem(APP_CONFIG.themeKey, this.currentTheme);
    this.applyTheme();
    
    showToast('info', `Tema ${this.currentTheme === 'dark' ? 'oscuro' : 'claro'} activado`);
  }
}

/**
 * PWA Manager for app-like features
 */
class PWAManager extends SingletonPattern {
  initialize() {
    this.deferredPrompt = null;
    this.setupPWAFeatures();
  }

  setupPWAFeatures() {
    // Service Worker registration
    this.registerServiceWorker();
    
    // Install prompt handling
    this.setupInstallPrompt();
    
    // Online/offline detection
    this.setupOnlineDetection();
  }

  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('./sw.js');
        console.log('✅ Service Worker registered:', registration);
      } catch (error) {
        console.error('❌ Service Worker registration failed:', error);
      }
    }
  }

  setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallButton();
    });
  }

  showInstallButton() {
    // You can implement an install button here
    console.log('📱 App can be installed');
  }

  setupOnlineDetection() {
    window.addEventListener('online', () => {
      showToast('success', t('connectionRestored'));
    });

    window.addEventListener('offline', () => {
      showToast('warning', t('offlineMode'));
    });
  }
}

/**
 * Main Application Class
 */
class OneCookingApp {
  constructor() {
    this.recipes = [];
    this.favorites = new Set();
    this.currentFilter = 'all';
    this.categoryFilter = null;
    this.searchQuery = '';
    this.initialized = false;
  }

  async init() {
    try {
      console.log('🔧 Initializing Cocina para Uno...');
      
      // Load data
      this.loadRecipes();
      this.loadFavorites();
      
      // Setup UI
      this.setupEventListeners();
      this.updateStats(); // ✅ Actualizar estadísticas en inicialización
      this.render();
      
      // Mark as initialized
      this.initialized = true;
      
      console.log('✅ Application initialized successfully');
      
    } catch (error) {
      console.error('❌ Application initialization failed:', error);
      showToast('error', 'Error al inicializar la aplicación');
    }
  }

  loadRecipes() {
    try {
      const stored = localStorage.getItem(APP_CONFIG.recipesKey);
      this.recipes = stored ? JSON.parse(stored).map(data => Recipe.fromJSON(data)) : [];
    } catch (error) {
      console.error('Error loading recipes:', error);
      this.recipes = [];
    }
  }

  loadFavorites() {
    try {
      const stored = localStorage.getItem(APP_CONFIG.favoritesKey);
      this.favorites = new Set(stored ? JSON.parse(stored) : []);
    } catch (error) {
      console.error('Error loading favorites:', error);
      this.favorites = new Set();
    }
  }

  saveRecipes() {
    try {
      localStorage.setItem(APP_CONFIG.recipesKey, JSON.stringify(this.recipes));
    } catch (error) {
      console.error('Error saving recipes:', error);
    }
  }

  saveFavorites() {
    try {
      localStorage.setItem(APP_CONFIG.favoritesKey, JSON.stringify([...this.favorites]));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }

  setupEventListeners() {
    // Add recipe buttons
    const addRecipeBtn = document.querySelector('.btn--add-recipe');
    const addFirstRecipeBtn = document.querySelector('.btn--add-first-recipe');
    
    if (addRecipeBtn) {
      addRecipeBtn.addEventListener('click', () => this.showRecipeForm());
    }
    
    if (addFirstRecipeBtn) {
      addFirstRecipeBtn.addEventListener('click', () => this.showRecipeForm());
    }

    // Search functionality
    if (DOM.searchInput) {
      DOM.searchInput.addEventListener('input', this.debounce((e) => {
        this.searchQuery = e.target.value.trim();
        this.render();
        this.updateSearchClear();
      }, 300));
    }

    if (DOM.searchClear) {
      DOM.searchClear.addEventListener('click', () => {
        DOM.searchInput.value = '';
        this.searchQuery = '';
        this.render();
        this.updateSearchClear();
      });
    }

    // Filter buttons
    DOM.filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.setActiveFilter(btn.dataset.filter);
        this.render();
      });
    });

    // Categories dropdown
    this.setupCategoriesDropdown();
  }

  setupCategoriesDropdown() {
    const dropdownTrigger = document.querySelector('.dropdown__trigger');
    const categoriesMenu = document.getElementById('categories-menu');
    
    if (!dropdownTrigger || !categoriesMenu) return;

    // Toggle dropdown
    dropdownTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = !categoriesMenu.hasAttribute('hidden');
      
      if (isOpen) {
        categoriesMenu.setAttribute('hidden', '');
        dropdownTrigger.setAttribute('aria-expanded', 'false');
      } else {
        this.populateCategoriesDropdown();
        categoriesMenu.removeAttribute('hidden');
        dropdownTrigger.setAttribute('aria-expanded', 'true');
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.dropdown')) {
        categoriesMenu.setAttribute('hidden', '');
        dropdownTrigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  populateCategoriesDropdown() {
    const categoriesMenu = document.getElementById('categories-menu');
    if (!categoriesMenu) return;

    // Get unique categories from all recipes
    const uniqueCategories = new Set();
    this.recipes.forEach(recipe => {
      recipe.categories.forEach(category => uniqueCategories.add(category));
    });

    // Clear existing items
    categoriesMenu.innerHTML = '';

    // Add "All Categories" option
    const allItem = document.createElement('button');
    allItem.className = 'dropdown__item';
    allItem.textContent = t('allRecipes');
    allItem.addEventListener('click', () => {
      this.setActiveFilter('all');
      this.render();
      categoriesMenu.setAttribute('hidden', '');
      document.querySelector('.dropdown__trigger').setAttribute('aria-expanded', 'false');
    });
    categoriesMenu.appendChild(allItem);

    // Add each category
    Array.from(uniqueCategories).sort().forEach(category => {
      const categoryItem = document.createElement('button');
      categoryItem.className = 'dropdown__item';
      categoryItem.textContent = category;
      categoryItem.addEventListener('click', () => {
        this.filterByCategory(category);
        categoriesMenu.setAttribute('hidden', '');
        document.querySelector('.dropdown__trigger').setAttribute('aria-expanded', 'false');
      });
      categoriesMenu.appendChild(categoryItem);
    });

    // If no categories exist, show message
    if (uniqueCategories.size === 0) {
      const noCategories = document.createElement('div');
      noCategories.className = 'dropdown__item dropdown__item--disabled';
      noCategories.textContent = 'No hay categorías disponibles';
      categoriesMenu.appendChild(noCategories);
    }
  }

  filterByCategory(category) {
    this.currentFilter = 'category';
    this.categoryFilter = category;
    
    // Update filter button states
    DOM.filterButtons.forEach(btn => {
      btn.classList.remove('filter-btn--active');
      btn.setAttribute('aria-pressed', 'false');
    });

    // Update dropdown trigger to show active category
    const dropdownTrigger = document.querySelector('.dropdown__trigger .filter-btn__text');
    if (dropdownTrigger) {
      dropdownTrigger.textContent = category;
    }

    this.render();
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  updateSearchClear() {
    if (!DOM.searchClear) return;
    
    if (this.searchQuery) {
      DOM.searchClear.removeAttribute('hidden');
    } else {
      DOM.searchClear.setAttribute('hidden', '');
    }
  }

  updateFilterCounters() {
    const totalRecipes = this.recipes.length;
    const favoriteRecipes = this.recipes.filter(recipe => this.favorites.has(recipe.id)).length;
    
    // Update "Todas" counter
    const allCounter = document.querySelector('[data-count="all"]');
    if (allCounter) {
      allCounter.textContent = totalRecipes;
    }
    
    // Update "Favoritas" counter
    const favoritesCounter = document.querySelector('[data-count="favorites"]');
    if (favoritesCounter) {
      favoritesCounter.textContent = favoriteRecipes;
    }
  }

  setActiveFilter(filter) {
    this.currentFilter = filter;
    this.categoryFilter = null; // Reset category filter
    
    // Reset dropdown trigger text
    const dropdownTrigger = document.querySelector('.dropdown__trigger .filter-btn__text');
    if (dropdownTrigger) {
      dropdownTrigger.textContent = t('categories');
    }
    
    DOM.filterButtons.forEach(btn => {
      const isActive = btn.dataset.filter === filter;
      btn.classList.toggle('filter-btn--active', isActive);
      btn.setAttribute('aria-pressed', isActive);
    });
  }

  getFilteredRecipes() {
    let filtered = [...this.recipes];

    // Apply search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(recipe => 
        recipe.title.toLowerCase().includes(query) ||
        recipe.description.toLowerCase().includes(query) ||
        recipe.ingredients.some(ing => ing.toLowerCase().includes(query)) ||
        recipe.categories.some(cat => cat.toLowerCase().includes(query))
      );
    }

    // Apply type filter
    if (this.currentFilter === 'favorites') {
      filtered = filtered.filter(recipe => this.favorites.has(recipe.id));
    } else if (this.currentFilter === 'category' && this.categoryFilter) {
      filtered = filtered.filter(recipe => 
        recipe.categories.includes(this.categoryFilter)
      );
    }

    return filtered;
  }

  render() {
    const filteredRecipes = this.getFilteredRecipes();
    this.renderRecipes(filteredRecipes);
    this.updateStats();
    this.updateResultsCount(filteredRecipes.length);
    this.updateFilterCounters(); // Update filter button counters
  }

  renderRecipes(recipes) {
    if (!DOM.recipesGrid) return;

    if (recipes.length === 0) {
      this.showEmptyState();
      return;
    }

    this.hideEmptyState();
    
    DOM.recipesGrid.innerHTML = recipes.map(recipe => this.createRecipeCard(recipe)).join('');
    
    // Add event listeners to recipe cards
    this.setupRecipeCardListeners();
  }

  createRecipeCard(recipe) {
    const isFavorite = this.favorites.has(recipe.id);
    
    return `
      <article class="recipe-card" data-recipe-id="${recipe.id}" role="gridcell">
        <header class="recipe-card__header">
          <div class="recipe-card__image">
            <img 
              src="${recipe.imageUrl || ImageService.getDefaultImage('recipe')}" 
              alt="${recipe.title}"
              class="recipe-card__img"
              loading="lazy"
              onerror="this.src='${ImageService.getDefaultImage('recipe')}'"
            >
            <button 
              class="recipe-card__favorite ${isFavorite ? 'recipe-card__favorite--active' : ''}"
              aria-label="${isFavorite ? t('removedFromFavorites') : t('addedToFavorites')}"
              data-action="toggle-favorite"
              title="${isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}"
              type="button"
            >
              <span class="recipe-card__favorite-icon" aria-hidden="true">${isFavorite ? '❤️' : '🤍'}</span>
            </button>
          </div>
        </header>
        
        <div class="recipe-card__content">
          <div class="recipe-card__info">
            <h3 class="recipe-card__title">${recipe.title}</h3>
            
            <div class="recipe-card__stats">
              <div class="recipe-card__stat">
                <span class="recipe-card__stat-icon" aria-hidden="true">⏰</span>
                <span class="recipe-card__stat-text">${recipe.cookingTime} min</span>
              </div>
              ${recipe.servings ? `
                <div class="recipe-card__stat">
                  <span class="recipe-card__stat-icon" aria-hidden="true">🍽️</span>
                  <span class="recipe-card__stat-text">${recipe.servings} ${recipe.servings === 1 ? 'porción' : 'porciones'}</span>
                </div>
              ` : ''}
              ${recipe.difficulty ? `
                <div class="recipe-card__stat">
                  <span class="recipe-card__stat-icon" aria-hidden="true">📊</span>
                  <span class="recipe-card__stat-text">${recipe.difficulty}</span>
                </div>
              ` : ''}
            </div>
            
            ${recipe.description ? `
              <p class="recipe-card__description">${recipe.description}</p>
            ` : ''}
            
            ${recipe.categories.length > 0 ? `
              <div class="recipe-card__categories">
                ${recipe.categories.map(cat => `
                  <span class="category-tag category-tag--${cat.toLowerCase().replace(/\s+/g, '-')}">${cat}</span>
                `).join('')}
              </div>
            ` : ''}
          </div>
          
          <footer class="recipe-card__actions">
            <button 
              class="btn btn--secondary btn--small"
              data-action="view"
              aria-label="Ver receta ${recipe.title}"
              title="Ver receta completa"
              type="button"
            >
              <span class="btn__icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </span>
              <span class="btn__text">Ver</span>
            </button>
            <button 
              class="btn btn--outline btn--small"
              data-action="edit"
              aria-label="Editar receta ${recipe.title}"
              title="Editar receta"
              type="button"
            >
              <span class="btn__icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                  <path d="m15 5 4 4"/>
                </svg>
              </span>
              <span class="btn__text">Editar</span>
            </button>
            <button 
              class="btn btn--danger btn--small"
              data-action="delete"
              aria-label="Eliminar receta ${recipe.title}"
              title="Eliminar receta"
              type="button"
            >
              <span class="btn__icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 6h18"/>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                  <path d="M8 6V4c0-1 1-2 2-2h4c0 1 1 2 2h4v2"/>
                </svg>
              </span>
              <span class="btn__text">Eliminar</span>
            </button>
          </footer>
        </div>
      </article>
    `;
  }

  setupRecipeCardListeners() {
    const cards = DOM.recipesGrid.querySelectorAll('.recipe-card');
    
    cards.forEach(card => {
      const recipeId = card.dataset.recipeId;
      const recipe = this.recipes.find(r => r.id === recipeId);
      
      if (!recipe) return;

      // Main card click (view recipe)
      card.addEventListener('click', (e) => {
        // Don't trigger if clicking on a button
        if (e.target.closest('button')) return;
        this.showRecipeDetails(recipe);
      });

      // Action buttons
      const viewBtn = card.querySelector('[data-action="view"]');
      const editBtn = card.querySelector('[data-action="edit"]');
      const deleteBtn = card.querySelector('[data-action="delete"]');
      const favoriteBtn = card.querySelector('[data-action="toggle-favorite"]');

      if (viewBtn) {
        viewBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.showRecipeDetails(recipe);
        });
      }

      if (editBtn) {
        editBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.showRecipeForm(recipe);
        });
      }

      if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.deleteRecipe(recipe.id);
        });
      }

      if (favoriteBtn) {
        favoriteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          console.log(`🔄 Toggling favorite for recipe: ${recipe.title}`);
          this.toggleFavorite(recipe.id);
        });
      }
    });
  }

  showEmptyState() {
    if (DOM.emptyState) DOM.emptyState.removeAttribute('hidden');
    if (DOM.noResults) DOM.noResults.setAttribute('hidden', '');
    if (DOM.recipesGrid) DOM.recipesGrid.innerHTML = '';
  }

  hideEmptyState() {
    if (DOM.emptyState) DOM.emptyState.setAttribute('hidden', '');
    if (DOM.noResults) DOM.noResults.setAttribute('hidden', '');
  }

  updateStats() {
    // Actualizar estadísticas en la sección de estadísticas
    const totalStat = document.querySelector('[data-stat="total"]');
    const favoritesStat = document.querySelector('[data-stat="favorites"]');
    const categoriesStat = document.querySelector('[data-stat="categories"]');

    if (totalStat) totalStat.textContent = this.recipes.length;
    if (favoritesStat) favoritesStat.textContent = this.favorites.size;
    if (categoriesStat) {
      const uniqueCategories = new Set(this.recipes.flatMap(r => r.categories));
      categoriesStat.textContent = uniqueCategories.size;
    }

    // ✅ FIJO: Actualizar contadores en los botones de filtro
    const allCount = document.querySelector('[data-count="all"]');
    const favoritesCount = document.querySelector('[data-count="favorites"]');
    
    if (allCount) allCount.textContent = this.recipes.length;
    if (favoritesCount) favoritesCount.textContent = this.favorites.size;
  }

  updateResultsCount(count) {
    if (!DOM.searchResults) return;
    
    if (this.searchQuery) {
      DOM.searchResults.textContent = `${count} resultado${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''}`;
    } else {
      DOM.searchResults.textContent = '';
    }
  }

  showRecipeForm(recipe = null) {
    if (!DOM.recipeFormModal) {
      console.error('Recipe form modal not found');
      return;
    }

    const isEdit = recipe !== null;
    const modalTitle = document.getElementById('form-modal-title');
    
    if (modalTitle) {
      modalTitle.textContent = isEdit ? `${t('edit')}: ${recipe.title}` : t('newRecipe');
    }

    // Reset and populate form
    this.resetRecipeForm();
    if (isEdit) {
      this.populateRecipeForm(recipe);
    }

    // Setup form listeners
    this.setupRecipeFormListeners(recipe);
    
    // Show modal
    DOM.recipeFormModal.showModal();
    
    // Focus first input
    const firstInput = DOM.recipeFormModal.querySelector('input[type="text"]');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }

  resetRecipeForm() {
    if (!DOM.recipeForm) return;
    
    DOM.recipeForm.reset();
    
    // Reset dynamic lists
    this.resetDynamicList('ingredients-list');
    this.resetDynamicList('steps-list');
    
    // Clear categories
    const categoriesTags = document.getElementById('categories-tags');
    if (categoriesTags) {
      categoriesTags.innerHTML = '';
    }

    // Clear image preview
    const imagePreview = document.getElementById('image-preview');
    if (imagePreview) {
      imagePreview.innerHTML = '';
      imagePreview.setAttribute('hidden', '');
    }
  }

  populateRecipeForm(recipe) {
    // Basic fields
    const nameInput = DOM.recipeForm.querySelector('#recipe-name');
    const timeInput = DOM.recipeForm.querySelector('#recipe-time');
    
    if (nameInput) nameInput.value = recipe.title;
    if (timeInput) timeInput.value = recipe.cookingTime;

    // Populate ingredients
    if (recipe.ingredients.length > 0) {
      const ingredientsList = document.getElementById('ingredients-list');
      if (ingredientsList) {
        ingredientsList.innerHTML = '';
        recipe.ingredients.forEach((ingredient, index) => {
          const imageUrl = recipe.ingredientImages?.[index] || '';
          this.addDynamicListItem('ingredients-list', 'text', t('addIngredient'), ingredient, imageUrl);
        });
      }
    }

    // Populate steps
    if (recipe.steps.length > 0) {
      const stepsList = document.getElementById('steps-list');
      if (stepsList) {
        stepsList.innerHTML = '';
        recipe.steps.forEach(step => {
          this.addDynamicListItem('steps-list', 'textarea', t('addStep'), step);
        });
      }
    }

    // Populate categories
    recipe.categories.forEach(category => {
      this.addCategory(category);
    });

    // Show image if exists
    if (recipe.imageUrl) {
      this.showImagePreview(recipe.imageUrl);
    }
  }

  resetDynamicList(listId) {
    const list = document.getElementById(listId);
    if (!list) return;
    
    const isIngredients = listId.includes('ingredients');
    const inputType = isIngredients ? 'text' : 'textarea';
    const placeholder = isIngredients ? 'Ej: 2 tazas de harina' : 'Describe este paso...';
    
    list.innerHTML = `
      <div class="dynamic-list__item">
        <label for="${listId}-0" class="dynamic-list__label">
          ${isIngredients ? 'Ingrediente 1' : 'Paso 1'}
        </label>
        ${inputType === 'textarea' ? `
          <textarea 
            id="${listId}-0"
            name="${isIngredients ? 'ingredients[]' : 'steps[]'}"
            class="form-textarea dynamic-list__textarea"
            rows="3"
            placeholder="${placeholder}"
            required
          ></textarea>
        ` : `
          <input 
            type="text"
            id="${listId}-0"
            name="${isIngredients ? 'ingredients[]' : 'steps[]'}"
            class="form-input dynamic-list__input"
            placeholder="${placeholder}"
            required
          >
        `}
        <button 
          type="button" 
          class="btn btn--icon btn--remove-item"
          aria-label="Eliminar ${isIngredients ? 'ingrediente' : 'paso'}"
          disabled
        >
          <span aria-hidden="true">−</span>
        </button>
      </div>
    `;
  }

  addDynamicListItem(listId, inputType = 'text', buttonText = '', value = '', imageUrl = '') {
    const list = document.getElementById(listId);
    if (!list) return;

    const items = list.querySelectorAll('.dynamic-list__item');
    const index = items.length;
    const isIngredients = listId.includes('ingredients');
    
    const itemDiv = document.createElement('div');
    itemDiv.className = 'dynamic-list__item';
    
    const label = isIngredients ? `Ingrediente ${index + 1}` : `Paso ${index + 1}`;
    const name = isIngredients ? 'ingredients[]' : 'steps[]';
    const placeholder = isIngredients ? 'Ej: 2 tazas de harina' : 'Describe este paso...';
    
    itemDiv.innerHTML = `
      <label for="${listId}-${index}" class="dynamic-list__label">
        ${label}
      </label>
      <div class="dynamic-list__input-group">
        ${inputType === 'textarea' ? `
          <textarea 
            id="${listId}-${index}"
            name="${name}"
            class="form-textarea dynamic-list__textarea"
            rows="3"
            placeholder="${placeholder}"
            required
          >${value}</textarea>
        ` : `
          <input 
            type="text"
            id="${listId}-${index}"
            name="${name}"
            class="form-input dynamic-list__input"
            placeholder="${placeholder}"
            value="${value}"
            required
          >
        `}
        
        ${isIngredients ? `
          <div class="ingredient-image-input">
            <label for="${listId}-image-${index}" class="ingredient-image-label">
              📷 Imagen del ingrediente (opcional)
            </label>
            <input 
              type="file"
              id="${listId}-image-${index}"
              name="ingredient_images[]"
              class="form-input ingredient-image-file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/avif"
              data-ingredient-index="${index}"
            >
            <small class="form-help">O se buscará automáticamente al guardar</small>
          </div>
        ` : ''}
      </div>
      
      <button 
        type="button" 
        class="btn btn--icon btn--remove-item"
        aria-label="Eliminar ${isIngredients ? 'ingrediente' : 'paso'}"
      >
        <span aria-hidden="true">−</span>
      </button>
    `;

    list.appendChild(itemDiv);

    // Add remove functionality
    const removeBtn = itemDiv.querySelector('.btn--remove-item');
    removeBtn.addEventListener('click', () => {
      itemDiv.remove();
      this.updateDynamicListLabels(listId);
    });

    // ✅ FIJO: Auto-búsqueda de imagen para ingredientes con file upload
    if (isIngredients && !value) {
      const input = itemDiv.querySelector('.dynamic-list__input');
      const imageFileInput = itemDiv.querySelector('.ingredient-image-file');
      
      if (input) {
        input.addEventListener('blur', async (e) => {
          const ingredient = e.target.value.trim();
          // Solo buscar si hay nombre de ingrediente y no hay archivo seleccionado
          if (ingredient.length > 2 && imageFileInput && !imageFileInput.files.length) {
            try {
              showToast('info', `Buscando imagen para: ${ingredient}`);
              const imageUrl = await ImageService.searchIngredientImage(ingredient);
              if (imageUrl) {
                // Crear un archivo a partir de la URL de Unsplash
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                const file = new File([blob], `${ingredient.replace(/\s+/g, '_')}.jpg`, { type: 'image/jpeg' });
                
                // Crear un DataTransfer para simular la selección de archivo
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                imageFileInput.files = dataTransfer.files;
                
                showToast('success', `Imagen encontrada para: ${ingredient}`);
              } else {
                showToast('warning', `No se encontró imagen para: ${ingredient}`);
              }
            } catch (error) {
              console.error('Error searching ingredient image:', error);
              showToast('error', `Error buscando imagen para: ${ingredient}`);
            }
          }
        });
      }
    }

    this.updateDynamicListLabels(listId);
  }

  updateDynamicListLabels(listId) {
    const list = document.getElementById(listId);
    if (!list) return;

    const items = list.querySelectorAll('.dynamic-list__item');
    const isIngredients = listId.includes('ingredients');
    
    items.forEach((item, index) => {
      const label = item.querySelector('.dynamic-list__label');
      const removeBtn = item.querySelector('.btn--remove-item');
      
      if (label) {
        label.textContent = isIngredients ? `Ingrediente ${index + 1}` : `Paso ${index + 1}`;
      }
      
      if (removeBtn) {
        removeBtn.disabled = items.length === 1;
      }
    });
  }

  async searchIngredientImage(ingredient) {
    try {
      showToast('loading', `${t('searchingImage')} "${ingredient}"...`);
      
      const imageUrl = await ImageService.searchIngredientImage(ingredient);
      
      if (imageUrl) {
        showToast('success', `${t('imageFound')} "${ingredient}"`);
      }
      
      return imageUrl;
    } catch (error) {
      console.error('Error searching ingredient image:', error);
      showToast('warning', `${t('imageNotFound')} "${ingredient}"`);
      return null;
    }
  }

  addCategory(categoryText) {
    const categoriesTags = document.getElementById('categories-tags');
    if (!categoriesTags || !categoryText.trim()) return;

    const categoryTag = document.createElement('span');
    categoryTag.className = 'category-tag';
    categoryTag.innerHTML = `
      <span class="category-tag__text">${categoryText}</span>
      <button type="button" class="category-tag__remove" aria-label="Eliminar categoría ${categoryText}">
        <span aria-hidden="true">×</span>
      </button>
    `;

    // Add remove functionality
    const removeBtn = categoryTag.querySelector('.category-tag__remove');
    removeBtn.addEventListener('click', () => {
      categoryTag.remove();
    });

    categoriesTags.appendChild(categoryTag);
  }

  setupRecipeFormListeners(editingRecipe = null) {
    if (!DOM.recipeForm) return;

    // Remove existing listeners
    const newForm = DOM.recipeForm.cloneNode(true);
    DOM.recipeForm.parentNode.replaceChild(newForm, DOM.recipeForm);
    DOM.recipeForm = newForm;

    // Recipe name input with auto-image search
    const nameInput = DOM.recipeForm.querySelector('#recipe-name');
    if (nameInput) {
      nameInput.addEventListener('blur', async (e) => {
        const recipeName = e.target.value.trim();
        if (recipeName.length > 2 && !editingRecipe) {
          await this.searchAndSetRecipeImage(recipeName);
        }
      });
    }

    // Add ingredient button
    const addIngredientBtn = DOM.recipeForm.querySelector('.btn--add-ingredient');
    if (addIngredientBtn) {
      addIngredientBtn.addEventListener('click', () => {
        this.addDynamicListItem('ingredients-list', 'text', t('addIngredient'));
      });
    }

    // Add step button
    const addStepBtn = DOM.recipeForm.querySelector('.btn--add-step');
    if (addStepBtn) {
      addStepBtn.addEventListener('click', () => {
        this.addDynamicListItem('steps-list', 'textarea', t('addStep'));
      });
    }

    // Categories input
    const categoriesInput = DOM.recipeForm.querySelector('#category-input');
    if (categoriesInput) {
      categoriesInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const category = e.target.value.trim();
          if (category) {
            this.addCategory(category);
            e.target.value = '';
          }
        }
      });
    }

    // File upload handling
    const fileInput = DOM.recipeForm.querySelector('#recipe-image');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        this.handleFileUpload(e.target.files[0]);
      });
    }

    // Form submission
    DOM.recipeForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleFormSubmit(e, editingRecipe);
    });

    // Cancel button
    const cancelBtn = DOM.recipeForm.querySelector('.btn--cancel');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        DOM.recipeFormModal.close();
      });
    }

    // Close button
    const closeBtn = DOM.recipeFormModal.querySelector('.modal__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        DOM.recipeFormModal.close();
      });
    }
  }

  async searchAndSetRecipeImage(recipeName) {
    try {
      showToast('loading', `${t('searchingImage')} "${recipeName}"...`);
      
      const imageUrl = await ImageService.searchRecipeImage(recipeName);
      
      if (imageUrl) {
        this.showImagePreview(imageUrl);
        showToast('success', `${t('imageFound')} "${recipeName}"`);
      }
      
      return imageUrl;
    } catch (error) {
      console.error('Error fetching recipe image:', error);
      showToast('warning', `${t('imageNotFound')} "${recipeName}"`);
      return null;
    }
  }

  handleFileUpload(file) {
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
    if (!validTypes.includes(file.type)) {
      showToast('error', 'Formato de archivo no válido. Use JPG, PNG, WebP o AVIF.');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > APP_CONFIG.maxFileSize) {
      showToast('error', 'El archivo es demasiado grande. Máximo 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target.result;
      this.showImagePreview(imageUrl, file.name);
      showToast('success', 'Imagen cargada correctamente');
    };

    reader.onerror = () => {
      showToast('error', 'Error al cargar la imagen');
    };

    reader.readAsDataURL(file);
  }

  showImagePreview(imageUrl, fileName) {
    const preview = document.getElementById('image-preview');
    if (!preview) return;

    preview.innerHTML = `
      <div class="image-preview">
        <img src="${imageUrl}" alt="Vista previa" class="image-preview__img">
        <div class="image-preview__info">
          <span class="image-preview__name">${fileName}</span>
          <button type="button" class="image-preview__remove" onclick="this.closest('.image-preview').parentElement.innerHTML = ''; this.closest('.image-preview').parentElement.hidden = true;">
            ✕
          </button>
        </div>
      </div>
    `;
    preview.hidden = false;
  }

  createRecipe(data) {
    const recipe = new Recipe(data);
    this.recipes.push(recipe);
    this.saveRecipes();
    this.updateStats(); // ✅ Actualizar estadísticas
    this.render();
    
    showToast('success', `Receta "${recipe.title}" creada exitosamente`);
  }

  updateRecipe(id, data) {
    const index = this.recipes.findIndex(r => r.id === id);
    if (index === -1) return;

    const recipe = this.recipes[index];
    Object.assign(recipe, data);
    recipe.dateModified = new Date().toISOString();
    
    this.saveRecipes();
    this.updateStats(); // ✅ Actualizar estadísticas
    this.render();
    
    showToast('success', `Receta "${recipe.title}" actualizada exitosamente`);
  }

  deleteRecipe(id) {
    const recipe = this.recipes.find(r => r.id === id);
    if (!recipe) return;

    if (confirm(`¿Estás seguro de que quieres eliminar la receta "${recipe.title}"?`)) {
      this.recipes = this.recipes.filter(r => r.id !== id);
      this.favorites.delete(id);
      
      this.saveRecipes();
      this.saveFavorites();
      this.updateStats(); // ✅ Actualizar estadísticas
      this.render();
      
      showToast('success', `Receta "${recipe.title}" ${t('recipeDeleted')}`);
    }
  }

  toggleFavorite(id) {
    const recipe = this.recipes.find(r => r.id === id);
    if (!recipe) return;

    if (this.favorites.has(id)) {
      this.favorites.delete(id);
      showToast('info', `"${recipe.title}" ${t('removedFromFavorites')}`);
    } else {
      this.favorites.add(id);
      showToast('success', `"${recipe.title}" ${t('addedToFavorites')}`);
    }

    this.saveFavorites();
    this.updateStats(); // ✅ Actualizar estadísticas
    this.render();
  }

  showRecipeDetails(recipe) {
    console.log('🔍 Opening recipe details for:', recipe.title);
    console.log('🔍 DOM.recipeModal exists:', !!DOM.recipeModal);
    
    if (!DOM.recipeModal) {
      console.error('❌ Recipe modal not found - trying to find it again');
      DOM.recipeModal = document.getElementById('recipe-modal');
      if (!DOM.recipeModal) {
        console.error('❌ Recipe modal still not found in DOM');
        return;
      }
    }

    // Populate modal content with recipe details
    const modalContent = DOM.recipeModal.querySelector('.modal__content');
    modalContent.innerHTML = `
      <header class="modal__header">
        <div class="modal__header-content">
          <h2 class="modal__title">${recipe.title}</h2>
          <div class="recipe-badges">
            ${recipe.categories.map(cat => `
              <span class="category-badge category-badge--${cat.toLowerCase().replace(/\s+/g, '-')}">${cat}</span>
            `).join('')}
          </div>
        </div>
        <button type="button" class="modal__close" aria-label="${t('close')}">
          <span aria-hidden="true">×</span>
        </button>
      </header>
      
      <div class="modal__body">
        <div class="recipe-detail">
          <div class="recipe-hero">
            <div class="recipe-hero__image">
              <img src="${recipe.imageUrl || ImageService.getDefaultImage('recipe')}" 
                   alt="${recipe.title}" 
                   class="recipe-hero__img"
                   loading="lazy">
            </div>
            
            <div class="recipe-hero__info">
              <div class="recipe-stats">
                <div class="recipe-stat">
                  <div class="recipe-stat__icon">⏱️</div>
                  <div class="recipe-stat__content">
                    <span class="recipe-stat__value">${recipe.cookingTime}</span>
                    <span class="recipe-stat__label">minutos</span>
                  </div>
                </div>
                <div class="recipe-stat">
                  <div class="recipe-stat__icon">🍽️</div>
                  <div class="recipe-stat__content">
                    <span class="recipe-stat__value">${recipe.servings || 1}</span>
                    <span class="recipe-stat__label">porciones</span>
                  </div>
                </div>
                <div class="recipe-stat">
                  <div class="recipe-stat__icon">📊</div>
                  <div class="recipe-stat__content">
                    <span class="recipe-stat__value">${recipe.difficulty || 'Fácil'}</span>
                    <span class="recipe-stat__label">dificultad</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="recipe-content">
            <section class="recipe-section">
              <h3 class="recipe-section__title">
                <span class="recipe-section__icon">🥕</span>
                <span class="recipe-section__text">${t('ingredients')}</span>
              </h3>
              <div class="ingredients-grid">
                ${recipe.ingredients.map((ingredient, index) => {
                  const imageUrl = recipe.ingredientImages?.[index];
                  return `
                    <div class="ingredient-card ${imageUrl ? 'ingredient-card--with-image' : ''}">
                      ${imageUrl ? `
                        <div class="ingredient-card__image">
                          <img src="${imageUrl}" alt="${ingredient}" class="ingredient-image" loading="lazy" onerror="this.parentElement.style.display='none'">
                        </div>
                      ` : ''}
                      <div class="ingredient-card__content">
                        <span class="ingredient-card__text">${ingredient}</span>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </section>
            
            <section class="recipe-section">
              <h3 class="recipe-section__title">
                <span class="recipe-section__icon">👩‍🍳</span>
                <span class="recipe-section__text">${t('preparation')}</span>
              </h3>
              <div class="steps-timeline">
                ${recipe.steps.map((step, index) => `
                  <div class="step-card">
                    <div class="step-card__number">${index + 1}</div>
                    <div class="step-card__content">
                      <p class="step-card__text">${step}</p>
                    </div>
                  </div>
                `).join('')}
              </div>
            </section>
            
            ${recipe.notes ? `
              <section class="recipe-section">
                <h3 class="recipe-section__title">
                  <span class="recipe-section__icon">📝</span>
                  <span class="recipe-section__text">${t('notes')}</span>
                </h3>
                <div class="recipe-notes">
                  <p>${recipe.notes}</p>
                </div>
              </section>
            ` : ''}
          </div>
        </div>
      </div>
      
      <footer class="modal__footer">
        <div class="modal__footer-actions">
          <button type="button" class="btn btn--secondary" onclick="this.closest('dialog').close()">
            <span class="btn__icon">←</span>
            ${t('close')}
          </button>
          <button type="button" class="btn btn--primary" onclick="app.showRecipeForm(${JSON.stringify(recipe).replace(/"/g, '&quot;')})">
            <span class="btn__icon">✏️</span>
            ${t('edit')}
          </button>
        </div>
      </footer>
    `;

    // Show modal
    DOM.recipeModal.showModal();

    // Add close button functionality
    const closeBtn = DOM.recipeModal.querySelector('.modal__close');
    closeBtn.addEventListener('click', () => {
      DOM.recipeModal.close();
    });

    // Close on backdrop click
    DOM.recipeModal.addEventListener('click', (e) => {
      if (e.target === DOM.recipeModal) {
        DOM.recipeModal.close();
      }
    });
  }

  async handleFormSubmit(event, editingRecipe = null) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const recipeData = await this.extractRecipeData(formData);
    
    if (!this.validateRecipeData(recipeData)) {
      return;
    }

    if (editingRecipe) {
      this.updateRecipe(editingRecipe.id, recipeData);
    } else {
      this.createRecipe(recipeData);
    }

    DOM.recipeFormModal.close();
  }

  async extractRecipeData(formData) {
    const data = {
      title: formData.get('name')?.trim() || '',
      cookingTime: parseInt(formData.get('time')) || 0,
      servings: parseInt(formData.get('servings')) || 1,
      difficulty: formData.get('difficulty') || 'Fácil',
      ingredients: formData.getAll('ingredients[]').filter(ing => ing.trim()),
      ingredientImages: [],
      steps: formData.getAll('steps[]').filter(step => step.trim()),
      categories: []
    };

    // Process ingredient images (files + auto-search)
    const ingredientImageFiles = formData.getAll('ingredient_images[]');
    const ingredients = formData.getAll('ingredients[]').filter(ing => ing.trim());
    
    data.ingredientImages = await Promise.all(ingredients.map(async (ingredient, index) => {
      const file = ingredientImageFiles[index];
      
      if (file && file.size > 0) {
        // Use uploaded file
        return URL.createObjectURL(file);
      } else if (ingredient.trim().length > 2) {
        // Auto-search for ingredient image
        try {
          console.log(`🔍 Auto-searching image for ingredient: ${ingredient}`);
          const imageUrl = await ImageService.searchIngredientImage(ingredient);
          return imageUrl || '';
        } catch (error) {
          console.error(`Error searching image for ${ingredient}:`, error);
          return '';
        }
      }
      return '';
    }));

    // Extract categories from tags
    const categoriesTags = document.querySelectorAll('.category-tag__text');
    data.categories = Array.from(categoriesTags).map(tag => tag.textContent.trim());

    // Get image URL from preview (uploaded file) or auto-search
    const imagePreview = document.querySelector('.image-preview__img');
    if (imagePreview) {
      data.imageUrl = imagePreview.src;
    }

    return data;
  }

  validateRecipeData(data) {
    if (!data.title) {
      showToast('error', 'El título de la receta es obligatorio');
      return false;
    }

    if (data.ingredients.length === 0) {
      showToast('error', 'Debe agregar al menos un ingrediente');
      return false;
    }

    if (data.steps.length === 0) {
      showToast('error', 'Debe agregar al menos un paso de preparación');
      return false;
    }

    return true;
  }
}

/**
 * APPLICATION INITIALIZATION
 */

/**
 * Initialize application when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('🍲 Cocina para Uno - Starting application...');
  
  try {
    // Initialize DOM elements
    initializeDOM();
    
    // Initialize managers
    PWAManager.getInstance();
    ThemeManager.getInstance();
    LanguageManager.getInstance();
    
    // Initialize main application
    window.app = new OneCookingApp();
    window.app.init();
    
    console.log('✅ Application initialized successfully');
    
    // Hide loading screen
    if (DOM.loadingScreen) {
      setTimeout(() => {
        DOM.loadingScreen.style.display = 'none';
      }, 500);
    }
    
  } catch (error) {
    console.error('❌ Application initialization failed:', error);
    
    // Show error message to user
    showToast('error', 
      'Error al inicializar la aplicación. Por favor, recarga la página.'
    );
  }
});

/**
 * Handle page visibility changes for better performance
 */
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && window.app?.initialized) {
    // Refresh data when page becomes visible again
    window.app.render();
  }
});

/**
 * Global error handler
 */
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  showToast('error', 'Ha ocurrido un error inesperado');
});

/**
 * Unhandled promise rejection handler
 */
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  showToast('error', 'Error de conexión o procesamiento');
  event.preventDefault();
});
