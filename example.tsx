import { useState } from 'react';
import { Search, Plus, Heart, Clock, ChefHat, Users, Filter, Edit, Trash2, X } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Textarea } from './components/ui/textarea';
import { Label } from './components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { ImageWithFallback } from './components/figma/ImageWithFallback';

// Datos de ejemplo para las recetas
const recetasEjemplo = [
  {
    id: 1,
    nombre: "Arepas con Queso",
    ingredientes: ["Harina de maíz", "Queso blanco", "Agua", "Sal"],
    pasos: ["Mezclar harina con agua tibia y sal", "Formar bolas y aplanar", "Asar en plancha por ambos lados", "Abrir y rellenar con queso"],
    tiempo: 20,
    categoria: "Desayuno",
    favorita: true,
    imagen: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop"
  },
  {
    id: 2,
    nombre: "Pasta Carbonara",
    ingredientes: ["Pasta", "Huevo", "Queso parmesano", "Panceta", "Pimienta negra"],
    pasos: ["Cocinar pasta al dente", "Freír panceta hasta dorar", "Mezclar huevo con queso", "Combinar todo fuera del fuego"],
    tiempo: 15,
    categoria: "Cena",
    favorita: false,
    imagen: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop"
  },
  {
    id: 3,
    nombre: "Ensalada César",
    ingredientes: ["Lechuga romana", "Crutones", "Queso parmesano", "Aderezo césar", "Pollo a la plancha"],
    pasos: ["Lavar y cortar lechuga", "Cocinar pollo y cortar en tiras", "Mezclar todos los ingredientes", "Servir inmediatamente"],
    tiempo: 10,
    categoria: "Almuerzo",
    favorita: true,
    imagen: "https://images.unsplash.com/photo-1551248429-40975aa4de74?w=400&h=300&fit=crop"
  },
  {
    id: 4,
    nombre: "Brownie de Chocolate",
    ingredientes: ["Chocolate negro", "Mantequilla", "Azúcar", "Huevos", "Harina", "Nueces"],
    pasos: ["Derretir chocolate con mantequilla", "Batir huevos con azúcar", "Incorporar chocolate derretido", "Añadir harina y hornear"],
    tiempo: 45,
    categoria: "Postre",
    favorita: false,
    imagen: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop"
  },
  {
    id: 5,
    nombre: "Smoothie Verde",
    ingredientes: ["Espinaca", "Manzana verde", "Plátano", "Jugo de limón", "Agua", "Miel"],
    pasos: ["Lavar espinaca y manzana", "Cortar frutas en trozos", "Licuar todos los ingredientes", "Servir con hielo"],
    tiempo: 5,
    categoria: "Bebida",
    favorita: true,
    imagen: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&h=300&fit=crop"
  },
  {
    id: 6,
    nombre: "Quesadillas de Pollo",
    ingredientes: ["Tortillas de harina", "Pollo desmenuzado", "Queso oaxaca", "Cebolla", "Pimientos", "Especias"],
    pasos: ["Saltear pollo con vegetales", "Rellenar tortillas con pollo y queso", "Cocinar en sartén hasta dorar", "Cortar y servir caliente"],
    tiempo: 25,
    categoria: "Cena",
    favorita: false,
    imagen: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop"
  }
];

const categorias = ["Todos", "Desayuno", "Almuerzo", "Cena", "Postre", "Bebida"];

export default function App() {
  const [recetas, setRecetas] = useState(recetasEjemplo);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todos");
  const [soloFavoritas, setSoloFavoritas] = useState(false);
  const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevaReceta, setNuevaReceta] = useState({
    nombre: "",
    ingredientes: "",
    pasos: "",
    tiempo: "",
    categoria: "Desayuno",
    imagen: ""
  });

  // Filtrar recetas
  const recetasFiltradas = recetas.filter(receta => {
    const coincideBusqueda = receta.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                            receta.ingredientes.some(ingrediente => 
                              ingrediente.toLowerCase().includes(busqueda.toLowerCase())
                            );
    const coincideCategoria = categoriaFiltro === "Todos" || receta.categoria === categoriaFiltro;
    const coincideFavoritas = !soloFavoritas || receta.favorita;
    
    return coincideBusqueda && coincideCategoria && coincideFavoritas;
  });

  const toggleFavorito = (id) => {
    setRecetas(recetas.map(receta => 
      receta.id === id ? { ...receta, favorita: !receta.favorita } : receta
    ));
  };

  const eliminarReceta = (id) => {
    setRecetas(recetas.filter(receta => receta.id !== id));
  };

  const agregarReceta = () => {
    if (nuevaReceta.nombre && nuevaReceta.ingredientes && nuevaReceta.pasos) {
      const receta = {
        id: Date.now(),
        nombre: nuevaReceta.nombre,
        ingredientes: nuevaReceta.ingredientes.split(',').map(i => i.trim()),
        pasos: nuevaReceta.pasos.split('\n').filter(p => p.trim()),
        tiempo: parseInt(nuevaReceta.tiempo) || 30,
        categoria: nuevaReceta.categoria,
        favorita: false,
        imagen: nuevaReceta.imagen || "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop"
      };
      setRecetas([...recetas, receta]);
      setNuevaReceta({
        nombre: "",
        ingredientes: "",
        pasos: "",
        tiempo: "",
        categoria: "Desayuno",
        imagen: ""
      });
      setMostrarFormulario(false);
    }
  };

  const getCategoriaColor = (categoria) => {
    const colores = {
      "Desayuno": "bg-yellow-100 text-yellow-800",
      "Almuerzo": "bg-green-100 text-green-800",
      "Cena": "bg-blue-100 text-blue-800",
      "Postre": "bg-pink-100 text-pink-800",
      "Bebida": "bg-purple-100 text-purple-800"
    };
    return colores[categoria] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <ChefHat className="h-8 w-8 text-orange-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Cocina para Uno</h1>
                <p className="text-sm text-gray-600">Tu recetario personal dinámico</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-600">{recetas.length} recetas</span>
            </div>
          </div>
          
          {/* Barra de búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar recetas o ingredientes..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10 pr-4 py-2 w-full max-w-md"
            />
          </div>
        </div>
      </header>

      {/* Barra de acciones */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Dialog open={mostrarFormulario} onOpenChange={setMostrarFormulario}>
                <DialogTrigger asChild>
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Receta
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Agregar Nueva Receta</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="nombre">Nombre de la receta</Label>
                      <Input
                        id="nombre"
                        value={nuevaReceta.nombre}
                        onChange={(e) => setNuevaReceta({...nuevaReceta, nombre: e.target.value})}
                        placeholder="Ej: Tacos al Pastor"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ingredientes">Ingredientes (separados por comas)</Label>
                      <Textarea
                        id="ingredientes"
                        value={nuevaReceta.ingredientes}
                        onChange={(e) => setNuevaReceta({...nuevaReceta, ingredientes: e.target.value})}
                        placeholder="Ej: Tortillas, Carne al pastor, Piña, Cebolla, Cilantro"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="pasos">Pasos de preparación (uno por línea)</Label>
                      <Textarea
                        id="pasos"
                        value={nuevaReceta.pasos}
                        onChange={(e) => setNuevaReceta({...nuevaReceta, pasos: e.target.value})}
                        placeholder="Paso 1: Calentar tortillas&#10;Paso 2: Colocar carne&#10;Paso 3: Agregar piña y verduras"
                        rows={4}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="tiempo">Tiempo (minutos)</Label>
                        <Input
                          id="tiempo"
                          type="number"
                          value={nuevaReceta.tiempo}
                          onChange={(e) => setNuevaReceta({...nuevaReceta, tiempo: e.target.value})}
                          placeholder="30"
                        />
                      </div>
                      <div>
                        <Label htmlFor="categoria">Categoría</Label>
                        <Select value={nuevaReceta.categoria} onValueChange={(value) => setNuevaReceta({...nuevaReceta, categoria: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categorias.slice(1).map(cat => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="imagen">URL de imagen (opcional)</Label>
                      <Input
                        id="imagen"
                        value={nuevaReceta.imagen}
                        onChange={(e) => setNuevaReceta({...nuevaReceta, imagen: e.target.value})}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setMostrarFormulario(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={agregarReceta} className="bg-orange-600 hover:bg-orange-700">
                        Agregar Receta
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="flex items-center space-x-4">
              <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button
                variant={soloFavoritas ? "default" : "outline"}
                onClick={() => setSoloFavoritas(!soloFavoritas)}
                className={soloFavoritas ? "bg-red-600 hover:bg-red-700" : ""}
              >
                <Heart className={`h-4 w-4 mr-2 ${soloFavoritas ? 'fill-current' : ''}`} />
                Favoritas
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Galería de recetas */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recetasFiltradas.map(receta => (
            <Card key={receta.id} className="group hover:shadow-lg transition-shadow duration-200 overflow-hidden">
              <CardHeader className="p-0">
                <div className="relative">
                  <ImageWithFallback
                    src={receta.imagen}
                    alt={receta.nombre}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 rounded-full p-0 bg-white/80 hover:bg-white"
                      onClick={() => toggleFavorito(receta.id)}
                    >
                      <Heart className={`h-4 w-4 ${receta.favorita ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                    </Button>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <Badge className={getCategoriaColor(receta.categoria)}>
                      {receta.categoria}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-lg leading-tight">{receta.nombre}</CardTitle>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {receta.tiempo} min
                  </div>
                  <div className="text-xs">
                    {receta.ingredientes.length} ingredientes
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setRecetaSeleccionada(receta)}>
                        Ver Receta
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center justify-between">
                          {receta.nombre}
                          <Badge className={getCategoriaColor(receta.categoria)}>
                            {receta.categoria}
                          </Badge>
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <ImageWithFallback
                          src={receta.imagen}
                          alt={receta.nombre}
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {receta.tiempo} minutos
                          </div>
                          <div>
                            {receta.ingredientes.length} ingredientes
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold mb-2">Ingredientes:</h3>
                          <ul className="list-disc list-inside space-y-1">
                            {receta.ingredientes.map((ingrediente, idx) => (
                              <li key={idx} className="text-sm">{ingrediente}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold mb-2">Preparación:</h3>
                          <ol className="list-decimal list-inside space-y-2">
                            {receta.pasos.map((paso, idx) => (
                              <li key={idx} className="text-sm">{paso}</li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      onClick={() => eliminarReceta(receta.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {recetasFiltradas.length === 0 && (
          <div className="text-center py-12">
            <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron recetas</h3>
            <p className="text-gray-600 mb-4">
              {busqueda || categoriaFiltro !== "Todos" || soloFavoritas
                ? "Intenta cambiar los filtros de búsqueda"
                : "¡Agrega tu primera receta para comenzar!"
              }
            </p>
            <Button 
              onClick={() => setMostrarFormulario(true)}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Receta
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Estadísticas</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Total de recetas: {recetas.length}</p>
                <p>Favoritas: {recetas.filter(r => r.favorita).length}</p>
                <p>Tiempo promedio: {Math.round(recetas.reduce((acc, r) => acc + r.tiempo, 0) / recetas.length)} min</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Categorías</h3>
              <div className="flex flex-wrap gap-2">
                {categorias.slice(1).map(cat => {
                  const count = recetas.filter(r => r.categoria === cat).length;
                  return (
                    <Badge key={cat} variant="secondary" className="text-xs">
                      {cat} ({count})
                    </Badge>
                  );
                })}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Acerca de</h3>
              <p className="text-sm text-gray-600">
                Cocina para Uno - Tu recetario personal dinámico. 
                Proyecto del curso CDA Front-End Developer.
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Universidad: Escuela Colombiana de Ingeniería Julio Garavito
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}