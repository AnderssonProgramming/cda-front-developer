# 🏗️ Modelo de Conceptos - Cocina para Uno

**Proyecto del Curso CDA Front-End Developer**  
*Arquitectura y modelado de datos del sistema*

## Diagrama de Conceptos

```
[Usuario] ──── interactúa con ────► [Interfaz Web]
                                        │
                                        ▼
                               [Gestor de Recetas]
                                        │
                                        ▼
                              [Receta] ◄──► [LocalStorage]
                                 │
                        ┌────────┼────────┐
                        ▼        ▼        ▼
                  [Nombre]  [Ingredientes]  [Pasos]
                            [Tiempo]       [Categoría]
                            [Favorita]     [Imagen]
```

## Entidades del Sistema

### 1. Usuario
- **Descripción**: Persona que utiliza la aplicación para gestionar recetas
- **Atributos**: No se almacenan datos del usuario (aplicación anónima)
- **Comportamientos**:
  - Crear recetas
  - Buscar recetas
  - Marcar favoritas
  - Editar recetas
  - Eliminar recetas

### 2. Receta
- **Descripción**: Entidad principal que contiene toda la información de una receta de cocina
- **Atributos**:
  - `id`: Identificador único (timestamp de creación)
  - `nombre`: Nombre descriptivo de la receta
  - `ingredientes`: Array de strings con los ingredientes
  - `pasos`: Array de strings con los pasos de preparación
  - `tiempo`: Número entero representando minutos de preparación
  - `categoria`: Array de strings con las categorías
  - `favorita`: Boolean indicando si está marcada como favorita
  - `imagen`: String base64 con la imagen (opcional)
  - `fechaCreacion`: Timestamp de cuando fue creada
  - `fechaModificacion`: Timestamp de última modificación

### 3. Gestor de Recetas
- **Descripción**: Clase principal que maneja la lógica de negocio
- **Responsabilidades**:
  - CRUD de recetas (Create, Read, Update, Delete)
  - Filtrado y búsqueda
  - Gestión de favoritas
  - Persistencia en localStorage
  - Validación de datos

### 4. Interfaz Web
- **Descripción**: Capa de presentación que interactúa con el usuario
- **Componentes**:
  - Galería de recetas
  - Formulario de creación/edición
  - Barra de búsqueda
  - Filtros por categoría
  - Modal de detalle

## Estructura de Datos

### Objeto Receta (JavaScript)

```javascript
const receta = {
  id: 1626789123456,                    // timestamp único
  nombre: "Arepas con Queso",           // string requerido
  ingredientes: [                       // array requerido
    "2 tazas de harina de maíz",
    "1 taza de queso rallado",
    "1½ tazas de agua tibia",
    "1 cucharadita de sal"
  ],
  pasos: [                              // array requerido
    "Mezclar la harina con la sal",
    "Agregar agua tibia gradualmente",
    "Amasar hasta formar masa suave",
    "Agregar el queso y mezclar",
    "Formar las arepas",
    "Cocinar en plancha por 7-8 minutos por lado"
  ],
  tiempo: 25,                           // número en minutos
  categoria: ["Vegetariana", "Desayuno"], // array opcional
  favorita: false,                      // boolean
  imagen: "data:image/jpeg;base64,...", // string base64 opcional
  fechaCreacion: 1626789123456,         // timestamp
  fechaModificacion: 1626789123456      // timestamp
}
```

### Estructura de LocalStorage

```javascript
// Clave principal para el almacenamiento
const STORAGE_KEY = "cocina-para-uno-recetas";

// Estructura almacenada
const datosApp = {
  recetas: [receta1, receta2, ...],     // array de objetos receta
  configuracion: {
    temaOscuro: false,                  // preferencia de tema
    ultimaCategoria: "Todas"            // último filtro usado
  },
  version: "1.0"                        // versión de datos para migración
}
```

## Patrones de Diseño Aplicados

### 1. Constructor Pattern
```javascript
function Receta(nombre, ingredientes, pasos, tiempo) {
  this.id = Date.now();
  this.nombre = nombre;
  this.ingredientes = ingredientes;
  this.pasos = pasos;
  this.tiempo = tiempo;
  this.categoria = [];
  this.favorita = false;
  this.imagen = null;
  this.fechaCreacion = Date.now();
  this.fechaModificacion = Date.now();
}

// Métodos del prototipo
Receta.prototype.marcarFavorita = function() {
  this.favorita = !this.favorita;
  this.fechaModificacion = Date.now();
};
```

### 2. Singleton Pattern
```javascript
const GestorRecetas = (function() {
  let instancia;
  
  function crearInstancia() {
    return {
      recetas: [],
      agregarReceta: function(receta) { /* ... */ },
      eliminarReceta: function(id) { /* ... */ },
      buscarRecetas: function(termino) { /* ... */ },
      // ... más métodos
    };
  }
  
  return {
    getInstancia: function() {
      if (!instancia) {
        instancia = crearInstancia();
      }
      return instancia;
    }
  };
})();
```

### 3. Module Pattern
```javascript
const ModuloBusqueda = (function() {
  // Variables privadas
  let terminoBusqueda = "";
  let filtrosActivos = [];
  
  // Métodos privados
  function filtrarPorTermino(recetas, termino) {
    // lógica de filtrado
  }
  
  // API pública
  return {
    buscar: function(termino) {
      terminoBusqueda = termino;
      // lógica pública
    },
    aplicarFiltros: function(filtros) {
      filtrosActivos = filtros;
    }
  };
})();
```

## Flujo de Datos

### 1. Carga Inicial
```
Usuario abre app → Sistema lee localStorage → Renderiza galería
```

### 2. Creación de Receta
```
Usuario llena formulario → Validación → Crear objeto Receta → 
Guardar en array → Actualizar localStorage → Actualizar vista
```

### 3. Búsqueda
```
Usuario escribe → Capturar evento → Filtrar array → 
Actualizar vista → Mantener estado de búsqueda
```

### 4. Operaciones CRUD
```
Acción del usuario → Identificar receta por ID → 
Modificar array → Actualizar localStorage → Refrescar vista
```

## Consideraciones Técnicas

### Performance
- Uso de debounce en búsqueda para evitar filtrado excesivo
- Lazy loading de imágenes grandes
- Paginación virtual para muchas recetas

### Accesibilidad
- Roles ARIA apropiados
- Navegación por teclado
- Alt text para imágenes
- Contraste de colores adecuado

### Responsive Design
- Mobile-first approach
- Breakpoints: 320px, 768px, 1024px, 1440px
- Grid flexible para diferentes tamaños de pantalla

### Persistencia
- Validación de soporte de localStorage
- Fallback para navegadores sin soporte
- Compresión de datos para optimizar espacio
