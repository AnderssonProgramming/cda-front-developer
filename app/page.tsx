"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import {
  Search,
  Plus,
  Heart,
  Clock,
  Users,
  Filter,
  Moon,
  Sun,
  Globe,
  Star,
  ChefHat,
  Utensils,
  Trash2,
  Edit,
  Eye,
  X,
  Save,
  Sparkles,
  ImageIcon,
  MessageSquare,
  TrendingUp,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"

// Tipos de datos actualizados
interface Recipe {
  id: string
  name: string
  ingredients: string[]
  ingredientImages: string[]
  steps: string[]
  time: number
  category: string[]
  favorite: boolean
  image: string
  manualRating: number // Calificación manual del usuario
  autoRating: number // Calificación automática calculada
  finalRating: number // Calificación final híbrida
  servings: number
  difficulty: "Fácil" | "Medio" | "Difícil"
  createdAt: Date
  lastCooked?: Date
  timesCooked: number
  notes: string
  cookingHistory: Date[]
}

// Traducciones expandidas
const translations = {
  es: {
    title: "Cocina para Uno",
    subtitle: "Tu recetario personal dinámico",
    search: "Buscar recetas o ingredientes...",
    newRecipe: "Nueva Receta",
    favorites: "Favoritos",
    all: "Todas",
    categories: "Categorías",
    time: "Tiempo",
    servings: "Porciones",
    difficulty: "Dificultad",
    ingredients: "Ingredientes",
    steps: "Pasos",
    rating: "Calificación",
    manualRating: "Tu Calificación",
    autoRating: "Popularidad",
    finalRating: "Calificación Final",
    save: "Guardar",
    cancel: "Cancelar",
    edit: "Editar",
    delete: "Eliminar",
    view: "Ver",
    addRecipe: "Agregar Receta",
    editRecipe: "Editar Receta",
    recipeName: "Nombre de la receta",
    addIngredient: "Agregar ingrediente",
    addStep: "Agregar paso",
    selectCategory: "Seleccionar categoría",
    selectDifficulty: "Seleccionar dificultad",
    minutes: "minutos",
    easy: "Fácil",
    medium: "Medio",
    hard: "Difícil",
    noRecipes: "No hay recetas disponibles",
    createFirst: "Crea tu primera receta",
    footer: "Hecho con ❤️ para cocineros solitarios",
    deleteConfirm: "¿Estás seguro de eliminar esta receta?",
    recipeAdded: "Receta agregada exitosamente",
    recipeUpdated: "Receta actualizada exitosamente",
    recipeDeleted: "Receta eliminada exitosamente",
    statistics: "Estadísticas",
    totalRecipes: "Total de recetas",
    favoriteRecipes: "Favoritas",
    averageTime: "Tiempo promedio",
    technologies: "Tecnologías",
    loadingImage: "Cargando imagen...",
    notes: "Notas Personales",
    addNotes: "Agregar notas...",
    timesCooked: "Veces cocinada",
    lastCooked: "Última vez",
    markAsCooked: "Marcar como Cocinada",
    never: "Nunca",
    today: "Hoy",
    yesterday: "Ayer",
    daysAgo: "hace {days} días",
    rateRecipe: "Califica esta receta",
    cookingStats: "Estadísticas de Cocción",
    categoryNames: {
      Desayuno: "Desayuno",
      Almuerzo: "Almuerzo",
      Cena: "Cena",
      Postre: "Postre",
      Snack: "Snack",
      Vegetariano: "Vegetariano",
      Vegano: "Vegano",
      "Sin Gluten": "Sin Gluten",
      Rápido: "Rápido",
      Saludable: "Saludable",
    },
  },
  en: {
    title: "One Cooking",
    subtitle: "Your dynamic personal recipe book",
    search: "Search recipes or ingredients...",
    newRecipe: "New Recipe",
    favorites: "Favorites",
    all: "All",
    categories: "Categories",
    time: "Time",
    servings: "Servings",
    difficulty: "Difficulty",
    ingredients: "Ingredients",
    steps: "Steps",
    rating: "Rating",
    manualRating: "Your Rating",
    autoRating: "Popularity",
    finalRating: "Final Rating",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    view: "View",
    addRecipe: "Add Recipe",
    editRecipe: "Edit Recipe",
    recipeName: "Recipe name",
    addIngredient: "Add ingredient",
    addStep: "Add step",
    selectCategory: "Select category",
    selectDifficulty: "Select difficulty",
    minutes: "minutes",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    noRecipes: "No recipes available",
    createFirst: "Create your first recipe",
    footer: "Made with ❤️ for solo cooks",
    deleteConfirm: "Are you sure you want to delete this recipe?",
    recipeAdded: "Recipe added successfully",
    recipeUpdated: "Recipe updated successfully",
    recipeDeleted: "Recipe deleted successfully",
    statistics: "Statistics",
    totalRecipes: "Total recipes",
    favoriteRecipes: "Favorites",
    averageTime: "Average time",
    technologies: "Technologies",
    loadingImage: "Loading image...",
    notes: "Personal Notes",
    addNotes: "Add notes...",
    timesCooked: "Times cooked",
    lastCooked: "Last cooked",
    markAsCooked: "Mark as Cooked",
    never: "Never",
    today: "Today",
    yesterday: "Yesterday",
    daysAgo: "{days} days ago",
    rateRecipe: "Rate this recipe",
    cookingStats: "Cooking Statistics",
    categoryNames: {
      Desayuno: "Breakfast",
      Almuerzo: "Lunch",
      Cena: "Dinner",
      Postre: "Dessert",
      Snack: "Snack",
      Vegetariano: "Vegetarian",
      Vegano: "Vegan",
      "Sin Gluten": "Gluten Free",
      Rápido: "Quick",
      Saludable: "Healthy",
    },
  },
  fr: {
    title: "Cuisine pour Un",
    subtitle: "Votre livre de recettes personnel dynamique",
    search: "Rechercher des recettes ou des ingrédients...",
    newRecipe: "Nouvelle Recette",
    favorites: "Favoris",
    all: "Toutes",
    categories: "Catégories",
    time: "Temps",
    servings: "Portions",
    difficulty: "Difficulté",
    ingredients: "Ingrédients",
    steps: "Étapes",
    rating: "Note",
    manualRating: "Votre Note",
    autoRating: "Popularité",
    finalRating: "Note Finale",
    save: "Sauvegarder",
    cancel: "Annuler",
    edit: "Modifier",
    delete: "Supprimer",
    view: "Voir",
    addRecipe: "Ajouter une Recette",
    editRecipe: "Modifier la Recette",
    recipeName: "Nom de la recette",
    addIngredient: "Ajouter un ingrédient",
    addStep: "Ajouter une étape",
    selectCategory: "Sélectionner une catégorie",
    selectDifficulty: "Sélectionner la difficulté",
    minutes: "minutes",
    easy: "Facile",
    medium: "Moyen",
    hard: "Difficile",
    noRecipes: "Aucune recette disponible",
    createFirst: "Créez votre première recette",
    footer: "Fait avec ❤️ pour les cuisiniers solitaires",
    deleteConfirm: "Êtes-vous sûr de supprimer cette recette?",
    recipeAdded: "Recette ajoutée avec succès",
    recipeUpdated: "Recette mise à jour avec succès",
    recipeDeleted: "Recette supprimée avec succès",
    statistics: "Statistiques",
    totalRecipes: "Total des recettes",
    favoriteRecipes: "Favoris",
    averageTime: "Temps moyen",
    technologies: "Technologies",
    loadingImage: "Chargement de l'image...",
    notes: "Notes Personnelles",
    addNotes: "Ajouter des notes...",
    timesCooked: "Fois cuisinée",
    lastCooked: "Dernière fois",
    markAsCooked: "Marquer comme Cuisinée",
    never: "Jamais",
    today: "Aujourd'hui",
    yesterday: "Hier",
    daysAgo: "il y a {days} jours",
    rateRecipe: "Noter cette recette",
    cookingStats: "Statistiques de Cuisine",
    categoryNames: {
      Desayuno: "Petit-déjeuner",
      Almuerzo: "Déjeuner",
      Cena: "Dîner",
      Postre: "Dessert",
      Snack: "Collation",
      Vegetariano: "Végétarien",
      Vegano: "Végétalien",
      "Sin Gluten": "Sans Gluten",
      Rápido: "Rapide",
      Saludable: "Sain",
    },
  },
  pt: {
    title: "Cozinha para Um",
    subtitle: "Seu livro de receitas pessoal dinâmico",
    search: "Buscar receitas ou ingredientes...",
    newRecipe: "Nova Receita",
    favorites: "Favoritos",
    all: "Todas",
    categories: "Categorias",
    time: "Tempo",
    servings: "Porções",
    difficulty: "Dificuldade",
    ingredients: "Ingredientes",
    steps: "Passos",
    rating: "Avaliação",
    manualRating: "Sua Avaliação",
    autoRating: "Popularidade",
    finalRating: "Avaliação Final",
    save: "Salvar",
    cancel: "Cancelar",
    edit: "Editar",
    delete: "Excluir",
    view: "Ver",
    addRecipe: "Adicionar Receita",
    editRecipe: "Editar Receita",
    recipeName: "Nome da receita",
    addIngredient: "Adicionar ingrediente",
    addStep: "Adicionar passo",
    selectCategory: "Selecionar categoria",
    selectDifficulty: "Selecionar dificuldade",
    minutes: "minutos",
    easy: "Fácil",
    medium: "Médio",
    hard: "Difícil",
    noRecipes: "Nenhuma receita disponível",
    createFirst: "Crie sua primeira receita",
    footer: "Feito com ❤️ para cozinheiros solitários",
    deleteConfirm: "Tem certeza de que deseja excluir esta receita?",
    recipeAdded: "Receita adicionada com sucesso",
    recipeUpdated: "Receita atualizada com sucesso",
    recipeDeleted: "Receita excluída com sucesso",
    statistics: "Estatísticas",
    totalRecipes: "Total de receitas",
    favoriteRecipes: "Favoritas",
    averageTime: "Tempo médio",
    technologies: "Tecnologias",
    loadingImage: "Carregando imagem...",
    notes: "Notas Pessoais",
    addNotes: "Adicionar notas...",
    timesCooked: "Vezes cozinhada",
    lastCooked: "Última vez",
    markAsCooked: "Marcar como Cozinhada",
    never: "Nunca",
    today: "Hoje",
    yesterday: "Ontem",
    daysAgo: "há {days} dias",
    rateRecipe: "Avaliar esta receita",
    cookingStats: "Estatísticas de Cozinha",
    categoryNames: {
      Desayuno: "Café da manhã",
      Almuerzo: "Almoço",
      Cena: "Jantar",
      Postre: "Sobremesa",
      Snack: "Lanche",
      Vegetariano: "Vegetariano",
      Vegano: "Vegano",
      "Sin Gluten": "Sem Glúten",
      Rápido: "Rápido",
      Saludable: "Saudável",
    },
  },
  it: {
    title: "Cucina per Uno",
    subtitle: "Il tuo libro di ricette personale dinamico",
    search: "Cerca ricette o ingredienti...",
    newRecipe: "Nuova Ricetta",
    favorites: "Preferiti",
    all: "Tutte",
    categories: "Categorie",
    time: "Tempo",
    servings: "Porzioni",
    difficulty: "Difficoltà",
    ingredients: "Ingredienti",
    steps: "Passaggi",
    rating: "Valutazione",
    manualRating: "La Tua Valutazione",
    autoRating: "Popolarità",
    finalRating: "Valutazione Finale",
    save: "Salva",
    cancel: "Annulla",
    edit: "Modifica",
    delete: "Elimina",
    view: "Visualizza",
    addRecipe: "Aggiungi Ricetta",
    editRecipe: "Modifica Ricetta",
    recipeName: "Nome della ricetta",
    addIngredient: "Aggiungi ingrediente",
    addStep: "Aggiungi passaggio",
    selectCategory: "Seleziona categoria",
    selectDifficulty: "Seleziona difficoltà",
    minutes: "minuti",
    easy: "Facile",
    medium: "Medio",
    hard: "Difficile",
    noRecipes: "Nessuna ricetta disponibile",
    createFirst: "Crea la tua prima ricetta",
    footer: "Fatto con ❤️ per cuochi solitari",
    deleteConfirm: "Sei sicuro di voler eliminare questa ricetta?",
    recipeAdded: "Ricetta aggiunta con successo",
    recipeUpdated: "Ricetta aggiornata con successo",
    recipeDeleted: "Ricetta eliminata con successo",
    statistics: "Statistiche",
    totalRecipes: "Totale ricette",
    favoriteRecipes: "Preferite",
    averageTime: "Tempo medio",
    technologies: "Tecnologie",
    loadingImage: "Caricamento immagine...",
    notes: "Note Personali",
    addNotes: "Aggiungi note...",
    timesCooked: "Volte cucinata",
    lastCooked: "Ultima volta",
    markAsCooked: "Segna come Cucinata",
    never: "Mai",
    today: "Oggi",
    yesterday: "Ieri",
    daysAgo: "{days} giorni fa",
    rateRecipe: "Valuta questa ricetta",
    cookingStats: "Statistiche di Cucina",
    categoryNames: {
      Desayuno: "Colazione",
      Almuerzo: "Pranzo",
      Cena: "Cena",
      Postre: "Dolce",
      Snack: "Spuntino",
      Vegetariano: "Vegetariano",
      Vegano: "Vegano",
      "Sin Gluten": "Senza Glutine",
      Rápido: "Veloce",
      Saludable: "Salutare",
    },
  },
}

const categories = [
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

// Función para calcular calificación automática
const calculateAutoRating = (recipe: Recipe): number => {
  let score = 0

  // Factor 1: Frecuencia de uso (40% del peso)
  const cookingFrequency = Math.min(recipe.timesCooked / 10, 1) * 2 // Max 2 puntos
  score += cookingFrequency

  // Factor 2: Si es favorito (20% del peso)
  if (recipe.favorite) {
    score += 1
  }

  // Factor 3: Antigüedad vs uso (20% del peso)
  const daysSinceCreated = Math.floor((Date.now() - recipe.createdAt.getTime()) / (1000 * 60 * 60 * 24))
  const ageUsageRatio =
    daysSinceCreated > 0 ? recipe.timesCooked / Math.max(daysSinceCreated / 7, 1) : recipe.timesCooked
  score += Math.min(ageUsageRatio, 1)

  // Factor 4: Recencia de uso (20% del peso)
  if (recipe.lastCooked) {
    const daysSinceCooked = Math.floor((Date.now() - recipe.lastCooked.getTime()) / (1000 * 60 * 60 * 24))
    const recencyScore = Math.max(0, 1 - daysSinceCooked / 30) // Decae en 30 días
    score += recencyScore
  }

  return Math.min(Math.max(Math.round(score), 1), 5)
}

// Función para calcular calificación final híbrida
const calculateFinalRating = (manualRating: number, autoRating: number): number => {
  // 70% manual, 30% automático
  return Math.round(manualRating * 0.7 + autoRating * 0.3)
}

// Recetas iniciales actualizadas
const initialRecipes: Recipe[] = [
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
    cookingHistory: [new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)],
  },
]

export default function CocinaParaUno() {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showFavorites, setShowFavorites] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState<"es" | "en" | "fr" | "pt" | "it">("es")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null)
  const [loadingImages, setLoadingImages] = useState<boolean[]>([])

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    ingredients: [""],
    ingredientImages: [""],
    steps: [""],
    time: 15,
    category: [] as string[],
    servings: 1,
    difficulty: "Fácil" as Recipe["difficulty"],
    manualRating: 5,
    notes: "",
  })

  const t = translations[language]

  // Cargar datos del localStorage
  useEffect(() => {
    const savedRecipes = localStorage.getItem("recipes")
    const savedDarkMode = localStorage.getItem("darkMode")
    const savedLanguage = localStorage.getItem("language")

    if (savedRecipes) {
      const parsed: Recipe[] = JSON.parse(savedRecipes)

      const migrated = parsed.map((r) => {
        const createdAt = r.createdAt ? new Date(r.createdAt as unknown as string) : new Date()
        const lastCooked = r.lastCooked ? new Date(r.lastCooked as unknown as string) : undefined
        const cookingHistory = r.cookingHistory?.map((d) => new Date(d as unknown as string)) ?? []

        const base: Partial<Recipe> = {
          ingredientImages: r.ingredientImages ?? [],
          manualRating: r.manualRating ?? 5,
          autoRating: r.autoRating ?? 1,
          finalRating: r.finalRating ?? 5,
          timesCooked: r.timesCooked ?? 0,
          notes: r.notes ?? "",
        }

        const autoRating = calculateAutoRating({
          ...r,
          ...base,
          createdAt,
          lastCooked,
          cookingHistory,
        } as Recipe)

        const finalRating = calculateFinalRating(base.manualRating!, autoRating)

        return {
          ...r,
          ...base,
          createdAt,
          lastCooked,
          cookingHistory,
          autoRating,
          finalRating,
        } as Recipe
      })

      setRecipes(migrated)
    }
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode))
    }
    if (savedLanguage) {
      setLanguage(savedLanguage as "es" | "en" | "fr" | "pt" | "it")
    }
  }, [])

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem("recipes", JSON.stringify(recipes))
  }, [recipes])

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode))
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  // Función para obtener imagen de Unsplash
  const getUnsplashImage = async (query: string): Promise<string> => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&client_id=B-kNU-wr__MAHOQg45xN_NZy4tHPqSsguoMNUif8jvk`,
      )
      const data = await response.json()
      return data.results[0]?.urls?.small || "/placeholder.svg?height=300&width=400"
    } catch (error) {
      return "/placeholder.svg?height=300&width=400"
    }
  }

  // Función para obtener imagen de ingrediente
  const getIngredientImage = async (ingredient: string): Promise<string> => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(ingredient + " ingredient food")}&per_page=1&client_id=B-kNU-wr__MAHOQg45xN_NZy4tHPqSsguoMNUif8jvk`,
      )
      const data = await response.json()
      return data.results[0]?.urls?.thumb || "/placeholder.svg?height=50&width=50"
    } catch (error) {
      return "/placeholder.svg?height=50&width=50"
    }
  }

  // Función para formatear fecha relativa
  const formatRelativeDate = (date: Date): string => {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return t.today
    if (diffDays === 1) return t.yesterday
    return t.daysAgo.replace("{days}", diffDays.toString())
  }

  // Filtrar recetas
  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesSearch =
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients.some((ingredient) => ingredient.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "all" || recipe.category.includes(selectedCategory)
      const matchesFavorites = !showFavorites || recipe.favorite

      return matchesSearch && matchesCategory && matchesFavorites
    })
  }, [recipes, searchTerm, selectedCategory, showFavorites])

  // Manejar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) return

    const image = await getUnsplashImage(formData.name)

    // Obtener imágenes para ingredientes
    const ingredientImages = await Promise.all(
      formData.ingredients.filter((i) => i.trim()).map((ingredient) => getIngredientImage(ingredient)),
    )

    const now = new Date()
    const autoRating = 1 // Nueva receta empieza con rating automático bajo
    const finalRating = calculateFinalRating(formData.manualRating, autoRating)

    const newRecipe: Recipe = {
      id: editingRecipe?.id || Date.now().toString(),
      name: formData.name,
      ingredients: formData.ingredients.filter((i) => i.trim()),
      ingredientImages,
      steps: formData.steps.filter((s) => s.trim()),
      time: formData.time,
      category: formData.category,
      favorite: editingRecipe?.favorite || false,
      image,
      manualRating: formData.manualRating,
      autoRating,
      finalRating,
      servings: formData.servings,
      difficulty: formData.difficulty,
      createdAt: editingRecipe?.createdAt || now,
      timesCooked: editingRecipe?.timesCooked || 0,
      notes: formData.notes,
      cookingHistory: editingRecipe?.cookingHistory || [],
    }

    if (editingRecipe) {
      setRecipes((prev) => prev.map((r) => (r.id === editingRecipe.id ? newRecipe : r)))
      toast({ title: t.recipeUpdated })
    } else {
      setRecipes((prev) => [...prev, newRecipe])
      toast({ title: t.recipeAdded })
    }

    resetForm()
    setIsAddDialogOpen(false)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      ingredients: [""],
      ingredientImages: [""],
      steps: [""],
      time: 15,
      category: [],
      servings: 1,
      difficulty: "Fácil",
      manualRating: 5,
      notes: "",
    })
    setEditingRecipe(null)
    setLoadingImages([])
  }

  const handleEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe)
    setFormData({
      name: recipe.name,
      ingredients: recipe.ingredients,
      ingredientImages: recipe.ingredientImages,
      steps: recipe.steps,
      time: recipe.time,
      category: recipe.category,
      servings: recipe.servings,
      difficulty: recipe.difficulty,
      manualRating: recipe.manualRating,
      notes: recipe.notes,
    })
    setIsAddDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm(t.deleteConfirm)) {
      setRecipes((prev) => prev.filter((r) => r.id !== id))
      toast({ title: t.recipeDeleted })
    }
  }

  const toggleFavorite = (id: string) => {
    setRecipes((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const updated = { ...r, favorite: !r.favorite }
          const autoRating = calculateAutoRating(updated)
          const finalRating = calculateFinalRating(updated.manualRating, autoRating)
          return { ...updated, autoRating, finalRating }
        }
        return r
      }),
    )
  }

  // Marcar como cocinada
  const markAsCooked = (id: string) => {
    const now = new Date()
    setRecipes((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const updated = {
            ...r,
            timesCooked: r.timesCooked + 1,
            lastCooked: now,
            cookingHistory: [...r.cookingHistory, now],
          }
          const autoRating = calculateAutoRating(updated)
          const finalRating = calculateFinalRating(updated.manualRating, autoRating)
          return { ...updated, autoRating, finalRating }
        }
        return r
      }),
    )
    toast({ title: "¡Receta marcada como cocinada! 👨‍🍳" })
  }

  // Actualizar calificación manual
  const updateManualRating = (id: string, rating: number) => {
    setRecipes((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const updated = { ...r, manualRating: rating }
          const finalRating = calculateFinalRating(rating, r.autoRating)
          return { ...updated, finalRating }
        }
        return r
      }),
    )
  }

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ""],
      ingredientImages: [...prev.ingredientImages, ""],
    }))
    setLoadingImages((prev) => [...prev, false])
  }

  const addStep = () => {
    setFormData((prev) => ({ ...prev, steps: [...prev.steps, ""] }))
  }

  const updateIngredient = async (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => (i === index ? value : ing)),
    }))

    // Obtener imagen del ingrediente si hay valor
    if (value.trim()) {
      setLoadingImages((prev) => prev.map((loading, i) => (i === index ? true : loading)))
      const ingredientImage = await getIngredientImage(value)
      setFormData((prev) => ({
        ...prev,
        ingredientImages: prev.ingredientImages.map((img, i) => (i === index ? ingredientImage : img)),
      }))
      setLoadingImages((prev) => prev.map((loading, i) => (i === index ? false : loading)))
    }
  }

  const updateStep = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.map((step, i) => (i === index ? value : step)),
    }))
  }

  const removeIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
      ingredientImages: prev.ingredientImages.filter((_, i) => i !== index),
    }))
    setLoadingImages((prev) => prev.filter((_, i) => i !== index))
  }

  const removeStep = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index),
    }))
  }

  const cycleLanguage = () => {
    const languages = ["es", "en", "fr", "pt", "it"] as const
    const currentIndex = languages.indexOf(language)
    const nextIndex = (currentIndex + 1) % languages.length
    setLanguage(languages[nextIndex])
  }

  // Componente de estrellas clickeables
  const StarRating = ({
    rating,
    onRatingChange,
    readonly = false,
  }: {
    rating: number
    onRatingChange?: (rating: number) => void
    readonly?: boolean
  }) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !readonly && onRatingChange?.(star)}
            className={`${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"} transition-transform`}
            disabled={readonly}
          >
            <Star className={`h-4 w-4 ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-400"}`} />
          </button>
        ))}
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${darkMode ? "dark bg-gray-900" : "bg-gradient-to-br from-red-50 to-orange-50"}`}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-red-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl">
                <ChefHat className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  {t.title}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">{t.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={cycleLanguage}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Globe className="h-4 w-4 mr-1" />
                {language.toUpperCase()}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDarkMode(!darkMode)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={t.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-red-200 focus:border-red-500 focus:ring-red-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
              />
            </div>

            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40 border-red-200 focus:border-red-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                  <SelectItem value="all">{t.all}</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {t.categoryNames[cat] || cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant={showFavorites ? "default" : "outline"}
                onClick={() => setShowFavorites(!showFavorites)}
                className={
                  showFavorites
                    ? "bg-red-500 hover:bg-red-600"
                    : "border-red-200 text-red-600 hover:bg-red-50 dark:border-gray-600 dark:text-red-400 dark:hover:bg-red-900/20"
                }
              >
                <Heart className={`h-4 w-4 mr-2 ${showFavorites ? "fill-current" : ""}`} />
                {t.favorites}
              </Button>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg"
                    onClick={resetForm}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t.newRecipe}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-gray-800 dark:border-gray-600">
                  <DialogHeader>
                    <DialogTitle className="text-red-600 dark:text-red-400">
                      {editingRecipe ? t.editRecipe : t.addRecipe}
                    </DialogTitle>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Input
                        placeholder={t.recipeName}
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        className="border-red-200 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-800 dark:text-gray-200">{t.time}</label>
                        <Input
                          type="number"
                          value={formData.time}
                          onChange={(e) => setFormData((prev) => ({ ...prev, time: Number.parseInt(e.target.value) }))}
                          className="border-red-200 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-800 dark:text-gray-200">{t.servings}</label>
                        <Input
                          type="number"
                          value={formData.servings}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, servings: Number.parseInt(e.target.value) }))
                          }
                          className="border-red-200 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-800 dark:text-gray-200">{t.difficulty}</label>
                        <Select
                          value={formData.difficulty}
                          onValueChange={(value: Recipe["difficulty"]) =>
                            setFormData((prev) => ({ ...prev, difficulty: value }))
                          }
                        >
                          <SelectTrigger className="border-red-200 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                            <SelectItem value="Fácil">{t.easy}</SelectItem>
                            <SelectItem value="Medio">{t.medium}</SelectItem>
                            <SelectItem value="Difícil">{t.hard}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Calificación Manual */}
                    <div>
                      <label className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2 block">
                        {t.manualRating}
                      </label>
                      <StarRating
                        rating={formData.manualRating}
                        onRatingChange={(rating) => setFormData((prev) => ({ ...prev, manualRating: rating }))}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2 block">
                        {t.ingredients}
                      </label>
                      {formData.ingredients.map((ingredient, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <div className="flex-shrink-0 w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                            {loadingImages[index] ? (
                              <div className="text-xs text-gray-500 dark:text-gray-400">{t.loadingImage}</div>
                            ) : formData.ingredientImages?.[index] &&
                              formData.ingredientImages[index] !== "/placeholder.svg?height=50&width=50" ? (
                              <img
                                src={formData.ingredientImages[index] || "/placeholder.svg"}
                                alt={ingredient}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                          <Input
                            value={ingredient}
                            onChange={(e) => updateIngredient(index, e.target.value)}
                            placeholder={`${t.ingredients} ${index + 1}`}
                            className="border-red-200 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                          />
                          {formData.ingredients.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeIngredient(index)}
                              className="text-red-600 border-red-200 hover:bg-red-50 dark:border-gray-600 dark:text-red-400 dark:hover:bg-red-900/20"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addIngredient}
                        className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent dark:border-gray-600 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {t.addIngredient}
                      </Button>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2 block">
                        {t.steps}
                      </label>
                      {formData.steps.map((step, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <Textarea
                            value={step}
                            onChange={(e) => updateStep(index, e.target.value)}
                            placeholder={`Paso ${index + 1}`}
                            className="border-red-200 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                            rows={2}
                          />
                          {formData.steps.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeStep(index)}
                              className="text-red-600 border-red-200 hover:bg-red-50 dark:border-gray-600 dark:text-red-400 dark:hover:bg-red-900/20"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addStep}
                        className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent dark:border-gray-600 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {t.addStep}
                      </Button>
                    </div>

                    {/* Notas Personales */}
                    <div>
                      <label className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2 block">
                        {t.notes}
                      </label>
                      <Textarea
                        value={formData.notes}
                        onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                        placeholder={t.addNotes}
                        className="border-red-200 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddDialogOpen(false)}
                        className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        {t.cancel}
                      </Button>
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {t.save}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {filteredRecipes.length === 0 ? (
          <div className="text-center py-16">
            <div className="p-4 bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/20 dark:to-orange-900/20 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <Utensils className="h-12 w-12 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">{t.noRecipes}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{t.createFirst}</p>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t.newRecipe}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRecipes.map((recipe) => (
              <Card
                key={recipe.id}
                className="group hover:shadow-xl transition-all duration-300 border-red-100 dark:border-gray-700 overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
              >
                <div className="relative">
                  <img
                    src={recipe.image || "/placeholder.svg"}
                    alt={recipe.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => toggleFavorite(recipe.id)}
                      className={`p-2 backdrop-blur-sm ${recipe.favorite ? "bg-red-500 text-white" : "bg-white/80 text-red-500"}`}
                    >
                      <Heart className={`h-4 w-4 ${recipe.favorite ? "fill-current" : ""}`} />
                    </Button>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                      <StarRating rating={recipe.finalRating} readonly />
                    </div>
                  </div>
                  {recipe.timesCooked > 0 && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-green-500 text-white text-xs">{recipe.timesCooked}x</Badge>
                    </div>
                  )}
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-red-600 transition-colors">
                    {recipe.name}
                  </CardTitle>
                  <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {recipe.time} {t.minutes}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {recipe.servings}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {recipe.category.slice(0, 2).map((cat) => (
                      <Badge
                        key={cat}
                        variant="secondary"
                        className="text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                      >
                        {t.categoryNames[cat] || cat}
                      </Badge>
                    ))}
                    {recipe.category.length > 2 && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                      >
                        +{recipe.category.length - 2}
                      </Badge>
                    )}
                  </div>

                  {/* Estadísticas de cocción */}
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    <div className="flex items-center justify-between">
                      <span>
                        {t.timesCooked}: {recipe.timesCooked}
                      </span>
                      <span>
                        {t.lastCooked}: {recipe.lastCooked ? formatRelativeDate(recipe.lastCooked) : t.never}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        recipe.difficulty === "Fácil"
                          ? "border-green-300 text-green-700 dark:border-green-600 dark:text-green-400"
                          : recipe.difficulty === "Medio"
                            ? "border-yellow-300 text-yellow-700 dark:border-yellow-600 dark:text-yellow-400"
                            : "border-red-300 text-red-700 dark:border-red-600 dark:text-red-400"
                      }`}
                    >
                      {recipe.difficulty === "Fácil" ? t.easy : recipe.difficulty === "Medio" ? t.medium : t.hard}
                    </Badge>

                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => markAsCooked(recipe.id)}
                        className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
                        title={t.markAsCooked}
                      >
                        <ChefHat className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedRecipe(recipe)
                          setIsViewDialogOpen(true)
                        }}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(recipe)}
                        className="p-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-900/20"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(recipe.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* View Recipe Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-gray-800 dark:border-gray-600">
          {selectedRecipe && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <Sparkles className="h-6 w-6" />
                  {selectedRecipe.name}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                <img
                  src={selectedRecipe.image || "/placeholder.svg"}
                  alt={selectedRecipe.name}
                  className="w-full h-64 object-cover rounded-lg"
                />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <Clock className="h-6 w-6 mx-auto mb-1 text-red-500" />
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {selectedRecipe.time} {t.minutes}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <Users className="h-6 w-6 mx-auto mb-1 text-orange-500" />
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {selectedRecipe.servings} {t.servings}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {selectedRecipe.difficulty === "Fácil"
                        ? t.easy
                        : selectedRecipe.difficulty === "Medio"
                          ? t.medium
                          : t.hard}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Calendar className="h-6 w-6 mx-auto mb-1 text-blue-500" />
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {selectedRecipe.timesCooked}x
                    </div>
                  </div>
                </div>

                {/* Sistema de Calificación Híbrido */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">{t.rateRecipe}</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t.manualRating}</div>
                      <StarRating
                        rating={selectedRecipe.manualRating}
                        onRatingChange={(rating) => updateManualRating(selectedRecipe.id, rating)}
                      />
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {selectedRecipe.manualRating}/5
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t.autoRating}</div>
                      <div className="flex items-center justify-center space-x-1">
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                        <StarRating rating={selectedRecipe.autoRating} readonly />
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{selectedRecipe.autoRating}/5</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t.finalRating}</div>
                      <StarRating rating={selectedRecipe.finalRating} readonly />
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {selectedRecipe.finalRating}/5
                      </div>
                    </div>
                  </div>
                </div>

                {/* Estadísticas de Cocción */}
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    {t.cookingStats}
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">{t.timesCooked}:</span>
                      <span className="font-medium ml-2 text-gray-800 dark:text-gray-200">
                        {selectedRecipe.timesCooked}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">{t.lastCooked}:</span>
                      <span className="font-medium ml-2 text-gray-800 dark:text-gray-200">
                        {selectedRecipe.lastCooked ? formatRelativeDate(selectedRecipe.lastCooked) : t.never}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedRecipe.category.map((cat) => (
                    <Badge key={cat} className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                      {t.categoryNames[cat] || cat}
                    </Badge>
                  ))}
                </div>

                <Separator className="dark:bg-gray-600" />

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Utensils className="h-5 w-5 text-red-500" />
                    {t.ingredients}
                  </h3>
                  <ul className="space-y-2">
                    {selectedRecipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                          {selectedRecipe.ingredientImages?.[index] &&
                          selectedRecipe.ingredientImages[index] !== "/placeholder.svg?height=50&width=50" ? (
                            <img
                              src={selectedRecipe.ingredientImages[index] || "/placeholder.svg"}
                              alt={ingredient}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          )}
                        </div>
                        <span className="text-gray-800 dark:text-gray-200">{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <ChefHat className="h-5 w-5 text-red-500" />
                    {t.steps}
                  </h3>
                  <ol className="space-y-3">
                    {selectedRecipe.steps.map((step, index) => (
                      <li key={index} className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                        <div className="flex-shrink-0 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1 text-gray-800 dark:text-gray-200">{step}</div>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Notas Personales */}
                {selectedRecipe.notes && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-red-500" />
                      {t.notes}
                    </h3>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-gray-800 dark:text-gray-200 italic">"{selectedRecipe.notes}"</p>
                    </div>
                  </div>
                )}

                {/* Botón para marcar como cocinada */}
                <div className="flex justify-center pt-4">
                  <Button
                    onClick={() => markAsCooked(selectedRecipe.id)}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                  >
                    <ChefHat className="h-4 w-4 mr-2" />
                    {t.markAsCooked}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-white/20 rounded-xl">
                  <ChefHat className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">{t.title}</h3>
              </div>
              <p className="text-red-100">{t.subtitle}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-3">{t.statistics}</h4>
              <div className="space-y-2 text-red-100">
                <div>
                  {t.totalRecipes}: {recipes.length}
                </div>
                <div>
                  {t.favoriteRecipes}: {recipes.filter((r) => r.favorite).length}
                </div>
                <div>
                  {t.averageTime}: {Math.round(recipes.reduce((acc, r) => acc + r.time, 0) / recipes.length || 0)} min
                </div>
                <div>Total cocinadas: {recipes.reduce((acc, r) => acc + r.timesCooked, 0)}</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">{t.technologies}</h4>
              <div className="text-red-100 text-sm">
                <div>• Next.js 15 + React</div>
                <div>• TypeScript</div>
                <div>• Tailwind CSS</div>
                <div>• PWA Ready</div>
                <div>• Unsplash API</div>
                <div>• Sistema Híbrido de Rating</div>
              </div>
            </div>
          </div>

          <Separator className="my-6 bg-white/20" />

          <div className="text-center text-red-100">
            <p>{t.footer}</p>
            <p className="text-sm mt-2">CDA Front-End Developer • Julio Garavito • 2025</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
