# 🍲 Cocina para Uno (One-Cooking) - Recetario Dinámico

**Proyecto del Curso CDA Front-End Developer**  
*Semana 05: Descripción web app (07 Jul - 12 Jul)*

## 📖 Descripción del Proyecto

**Cocina para Uno o One-Cooking** es una maqueta de sistema web diseñado como un recetario dinámico para personas que cocinan por sí mismas y buscan organizar sus recetas favoritas de manera práctica y eficiente.

La aplicación permite a los usuarios buscar, crear, editar y gestionar recetas con ingredientes, pasos detallados, tiempos de cocción y sistema de favoritos. Está pensada como una solución liviana, intuitiva y sin necesidad de backend, utilizando tecnologías web modernas para crear una experiencia fluida y responsive.

## 🎯 Objetivo

Desarrollar una maqueta funcional que demuestre la aplicación práctica de las cinco tecnologías del curso:

1. **HTML** - Estructura semántica y formularios
2. **CSS** - Diseño responsive y layout moderno  
3. **JavaScript** - Interactividad y manipulación del DOM
4. **JS Objects** - Modelado de datos estructurados
5. **JS Patterns** - Implementación de patrones de diseño

## 💼 Casos de Uso

### Casos de Uso Principales (Mínimos Requeridos)

#### 1. Buscar una receta
- **Actor**: Usuario
- **Descripción**: El usuario puede buscar recetas existentes mediante palabras clave
- **Flujo**: 
  - El usuario escribe en la barra de búsqueda
  - El sistema filtra las recetas en tiempo real
  - Se muestran resultados por título o ingredientes

#### 2. Agregar una nueva receta
- **Actor**: Usuario  
- **Descripción**: El usuario puede crear y guardar nuevas recetas personalizadas
- **Flujo**:
  - El usuario completa un formulario con datos de la receta
  - El sistema valida la información ingresada
  - La nueva receta se guarda y aparece en la galería

#### 3. Guardar recetas como favoritas
- **Actor**: Usuario
- **Descripción**: El usuario puede marcar y filtrar sus recetas preferidas
- **Flujo**:
  - El usuario hace clic en el ícono de corazón
  - La receta se marca como favorita
  - Puede filtrar para ver solo las favoritas

### Casos de Uso Adicionales (Funcionalidades Extendidas)

#### 4. Ver detalle de una receta
- **Actor**: Usuario
- **Descripción**: Visualizar información completa de una receta específica
- **Flujo**: Modal o vista expandida con ingredientes, pasos y tiempo completo

#### 5. Editar una receta existente
- **Actor**: Usuario
- **Descripción**: Modificar recetas previamente creadas
- **Flujo**: Formulario precargado con datos existentes para edición

#### 6. Eliminar una receta
- **Actor**: Usuario  
- **Descripción**: Remover recetas no deseadas del sistema
- **Flujo**: Confirmación de eliminación y remoción permanente

#### 7. Filtrar por categorías
- **Actor**: Usuario
- **Descripción**: Organizar recetas por tipo (Vegetarianas, Postres, Rápidas, etc.)
- **Flujo**: Sistema de etiquetas y filtros múltiples

#### 8. Persistencia de datos
- **Actor**: Sistema
- **Descripción**: Mantener recetas guardadas entre sesiones
- **Flujo**: Almacenamiento automático en localStorage del navegador

## 🛠️ Aplicación de Tecnologías

### HTML
- Estructura semántica con `<header>`, `<main>`, `<section>`
- Formularios para creación/edición de recetas
- Cards de recetas con información organizada
- Modal/dialog para vista detallada

### CSS  
- **Grid Layout** para galería de recetas estilo Pinterest
- **Responsive Design** con media queries para móvil/tablet/desktop
- Efectos hover y transiciones suaves
- Sistema de colores y tipografía coherente
- Modo claro/oscuro (opcional)

### JavaScript
- **Filtrado en tiempo real** de recetas
- **Manipulación del DOM** para crear/editar/eliminar elementos
- **Event listeners** para interacciones del usuario
- **LocalStorage** para persistencia de datos
- Validación de formularios

### JS Objects
- **Estructura de datos** para cada receta:
```javascript
const receta = {
  id: timestamp,
  nombre: "Arepas con Queso",
  ingredientes: ["Harina de maíz", "Queso", "Agua", "Sal"],
  pasos: ["Mezclar ingredientes", "Formar arepas", "Asar"],
  tiempo: 20,
  categoria: ["Vegetariana", "Cena"],
  favorita: false,
  imagen: base64String
}
```

### JS Patterns
- **Constructor Pattern** para crear instancias de recetas
- **Singleton Pattern** para gestor central de recetas  
- **Module Pattern** para organización del código

## 🏗️ Arquitectura del Sistema

### Estructura de Archivos
```
cda-front-developer/
├── index.html              # Página principal
├── css/
│   └── styles.css          # Estilos principales
├── js/
│   ├── main.js            # Lógica principal y eventos
│   ├── objects.js         # Definición de objetos Receta
│   └── patterns.js        # Implementación de patrones
├── assets/
│   ├── img/              # Imágenes del proyecto
│   └── fonts/            # Fuentes personalizadas
└── docs/
    ├── casos-uso.md      # Documentación de casos de uso
    └── retrospective.md  # Análisis de tecnologías aplicadas
```

### Modelo de Conceptos
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

## 📱 Diseño de Interfaz (Concepto)

### Vista Principal
- **Header**: Título de la app + barra de búsqueda
- **Barra de acciones**: Botón "Nueva receta" + filtros
- **Galería**: Grid responsive de tarjetas de recetas
- **Footer**: Información adicional y estadísticas

### Tarjeta de Receta
- Imagen representativa
- Título de la receta
- Tiempo de preparación
- Íconos de categoría
- Botón de favorito
- Acciones (ver, editar, eliminar)

### Modal de Detalle
- Imagen grande de la receta
- Lista de ingredientes
- Pasos numerados de preparación
- Información de tiempo y categorías
- Botones de acción

## 🔄 Funcionalidades Avanzadas (Opcional)

- **Temporizador de cocción** integrado
- **Exportación a PDF** para impresión
- **Subida de imágenes** personalizadas
- **Sistema de puntuación** y comentarios
- **Modo offline** con Service Workers
- **Animaciones** y transiciones avanzadas

## 📅 Cronograma de Desarrollo

- **S05** (07-12 Jul): ✅ Descripción web app
- **S06** (14-19 Jul): Boceto web app
- **S07** (21-26 Jul): Diseño e implementación
- **S08** (28 Jul-01 Ago): Revisión y dudas
- **S09** (04-09 Ago): Entrega final

## 🎓 Productos de Entrega

1. **Código fuente** completo y documentado
2. **Casos de uso** detallados y modelo de conceptos
3. **Bocetos de interfaz** y diseño visual  
4. **Retrospectiva técnica** con análisis de cada tecnología aplicada
5. **Presentación** para revisión

---

*Proyecto desarrollado como parte del curso CDA Front-End Developer*  
*Universidad: Escuela Colombiana de Ingeniería Julio Garavito*  
*Periodo: Julio-Agosto 2025*