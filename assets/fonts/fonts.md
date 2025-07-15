# 🎨 Guía de Identidad Visual - Cocina para Uno

**Manual de marca y estilo para el proyecto**

## 🎯 Concepto de Marca

**Cocina para Uno (One-Cooking)** es una aplicación que celebra la independencia culinaria y la creatividad personal en la cocina. La identidad visual debe transmitir:

- **Calidez**: Como el ambiente de una cocina hogareña
- **Simplicidad**: Interfaz limpia y fácil de usar
- **Creatividad**: Inspiración para experimentar con recetas
- **Modernidad**: Diseño contemporáneo y fresco

## 🎨 Paleta de Colores

### Colores Primarios
- **Naranja Principal**: `#FF6B35` - Color vibrante que representa la pasión por cocinar
- **Blanco**: `#FFFFFF` - Limpieza y espacio en la interfaz
- **Gris Carbón**: `#2C3E50` - Textos principales y elementos de contraste

### Colores Secundarios
- **Verde Fresco**: `#27AE60` - Ingredientes frescos, categorías vegetarianas
- **Rojo Tomate**: `#E74C3C` - Acentos, favoritos, elementos de acción
- **Amarillo Mantequilla**: `#F1C40F` - Destacados, etiquetas especiales
- **Azul Cielo**: `#3498DB` - Enlaces, información adicional

### Colores de Apoyo
- **Gris Claro**: `#ECF0F1` - Fondos sutiles, separadores
- **Gris Medio**: `#95A5A6` - Textos secundarios, placeholders
- **Crema**: `#FDF6E3` - Fondos cálidos alternativos

## 📝 Tipografía

### Fuente Principal: Inter
- **Uso**: Títulos principales, navegación, botones
- **Características**: Moderna, legible, excellent en pantallas
- **Pesos**: Regular (400), Medium (500), SemiBold (600), Bold (700)

### Fuente Secundaria: Lora
- **Uso**: Textos largos, descripción de pasos, ingredientes
- **Características**: Serif amigable, fácil lectura en párrafos
- **Pesos**: Regular (400), Medium (500)

### Fuente Monoespaciada: Fira Code
- **Uso**: Código, datos técnicos, timestamps
- **Características**: Excelente para desarrollo y debugging

## 🖼️ Elementos Visuales

### Iconografía
- **Estilo**: Line icons con esquinas redondeadas
- **Grosor**: 2px de stroke
- **Tamaño base**: 24px
- **Biblioteca recomendada**: Feather Icons o Lucide

### Fotografía
- **Estilo**: Imágenes cálidas y naturales de comida
- **Iluminación**: Natural, evitar flash directo
- **Composición**: Close-ups de platos, ingredientes frescos
- **Filtros**: Ligero aumento de calidez y saturación

### Ilustraciones
- **Estilo**: Flat design con toques orgánicos
- **Elementos**: Utensilios de cocina, ingredientes, patrones sutiles
- **Uso**: Estados vacíos, onboarding, decoración

## 📐 Espaciado y Grid

### Sistema de Espaciado (Base 8px)
- **XS**: 4px
- **SM**: 8px  
- **MD**: 16px
- **LG**: 24px
- **XL**: 32px
- **XXL**: 48px

### Grid Responsivo
- **Móvil**: 1 columna con márgenes de 16px
- **Tablet**: 2-3 columnas con gap de 24px
- **Desktop**: 3-4 columnas con gap de 32px
- **Desktop XL**: Hasta 5 columnas, máximo 1200px de ancho

## 🎭 Componentes de UI

### Botones
- **Primario**: Fondo `#FF6B35`, texto blanco, border-radius 8px
- **Secundario**: Borde `#FF6B35`, texto `#FF6B35`, fondo transparente
- **Terciario**: Solo texto `#FF6B35`, sin fondo ni borde

### Tarjetas
- **Sombra**: `0 4px 12px rgba(0,0,0,0.1)`
- **Border-radius**: 12px
- **Padding**: 16px en móvil, 24px en desktop
- **Hover**: Sombra más pronunciada y ligero lift

### Formularios
- **Inputs**: Border-radius 6px, border `#ECF0F1`, focus `#FF6B35`
- **Labels**: Texto `#2C3E50`, font-weight 500
- **Placeholders**: Texto `#95A5A6`

## 🌟 Estados y Microinteracciones

### Hover Effects
- **Botones**: Ligero oscurecimiento del color base (-10%)
- **Tarjetas**: Elevación con transform: translateY(-2px)
- **Enlaces**: Subrayado animado

### Loading States
- **Skeleton**: Fondo `#ECF0F1` con shimmer effect
- **Spinners**: Color `#FF6B35` con animación suave

### Transiciones
- **Duración**: 200ms para hover, 300ms para cambios de estado
- **Easing**: ease-out para naturales, ease-in-out para reversibles

## 🍳 Elementos Temáticos

### Metáforas Visuales
- **Ingredientes**: Chips con colores suaves
- **Tiempo**: Iconos de reloj y timer
- **Dificultad**: Sistema de estrellas o chefs
- **Favoritos**: Corazones con animación de "like"

### Categorías de Recetas
- **Desayuno**: `#F39C12` (Naranja amanecer)
- **Almuerzo**: `#E67E22` (Naranja medio)
- **Cena**: `#D35400` (Naranja oscuro)
- **Postres**: `#E91E63` (Rosa dulce)
- **Vegetariana**: `#27AE60` (Verde natural)
- **Rápida**: `#F1C40F` (Amarillo velocidad)

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile First */
@media (min-width: 480px)  { /* Móvil grande */ }
@media (min-width: 768px)  { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1440px) { /* Desktop XL */ }
```

### Adaptaciones por Dispositivo
- **Móvil**: Navegación por tabs, FAB para agregar recetas
- **Tablet**: Sidebar con filtros, grid de 2-3 columnas
- **Desktop**: Header completo, grid de 3-4 columnas

## ♿ Accesibilidad

### Contraste
- **Texto normal**: Mínimo 4.5:1
- **Texto grande**: Mínimo 3:1
- **Elementos UI**: Mínimo 3:1

### Navegación
- **Teclado**: Todos los elementos interactivos accesibles por tab
- **Screen readers**: Roles ARIA apropiados
- **Focus**: Indicadores visibles y claros

### Lenguaje
- **Textos**: Claros y concisos
- **Alt text**: Descriptivo para imágenes
- **Labels**: Explícitos para formularios

---

*Esta guía debe ser la referencia principal para mantener consistencia visual en toda la aplicación*