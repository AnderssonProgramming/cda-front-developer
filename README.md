# 🍲 Cocina para Uno (One-Cooking) - Recetario Dinámico

**Proyecto del Curso CDA Front-End Developer**  
*Semana 05: ✅ Descripción web app | Semana 06: ✅ Boceto web app | Semana 07: 🚧 Diseño*

## 📖 Descripción del Proyecto

**Cocina para Uno (One-Cooking)** es un recetario dinámico diseñado para personas que cocinan por sí mismas. La aplicación permite buscar, crear, editar y gestionar recetas con un sistema de favoritos, utilizando tecnologías web modernas para crear una experiencia fluida y responsive.

## 🎯 Tecnologías Aplicadas

1. **HTML** - Estructura semántica y formularios accesibles
2. **CSS** - Grid Layout responsive y sistema de design tokens
3. **JavaScript** - Búsqueda en tiempo real y manipulación del DOM
4. **JS Objects** - Modelado robusto de datos con validación
5. **JS Patterns** - Arquitectura escalable con Singleton, Factory y Observer

## 💼 Funcionalidades Principales

### Casos de Uso Implementados (8 total)
- ✅ **Buscar recetas** - Filtrado en tiempo real por nombre/ingredientes
- ✅ **Agregar recetas** - Formulario completo con validación
- ✅ **Sistema de favoritos** - Marcado y filtrado de recetas preferidas
- ✅ **Ver detalles** - Modal con información completa
- ✅ **Editar recetas** - Modificación de recetas existentes
- ✅ **Eliminar recetas** - Remoción con confirmación
- ✅ **Filtrar por categorías** - Organización por tipo de comida
- ✅ **Persistencia local** - Almacenamiento en localStorage

## � Diseño y Mockups

### Mockups Figma
El diseño visual está completado y documentado en Figma, incluyendo:

![Mockup Principal](assets/img/oneCooking-Mockup.png)
*Vista principal con galería de recetas y barra de búsqueda*

![Formulario Agregar](assets/img/agregar-receta.png)
*Modal para crear nuevas recetas con validación*

![Búsqueda en Tiempo Real](assets/img/busqueda-tiempo-real.png)
*Filtrado dinámico mientras el usuario escribe*

### Características del Diseño
- **Responsive Design**: Mobile-first con breakpoints para tablet y desktop
- **Identidad Visual**: Paleta cálida con naranja principal (#FF6B35)
- **Tipografía**: Inter para UI, Lora para contenido
- **Grid Layout**: Sistema flexible que se adapta automáticamente
- **Microinteracciones**: Hover effects y transiciones suaves

## 🏗️ Arquitectura del Sistema

```
📁 Proyecto
├── 📄 index.html              # Página principal
├── 📁 css/
│   └── 📄 styles.css          # Estilos organizados con metodología BEM
├── 📁 js/
│   ├── 📄 main.js            # Lógica principal y event handlers
│   ├── 📄 objects.js         # Clases Receta y validaciones
│   └── 📄 patterns.js        # Singleton, Factory, Observer patterns
├── 📁 assets/
│   ├── 📁 img/              # Mockups y recursos visuales
│   └── 📁 fonts/            # Guía de identidad visual
└── 📁 docs/
    ├── 📄 casos-uso.md      # 8 casos de uso detallados
    ├── 📄 concepts-model.md # Modelo de datos y arquitectura
    └── 📄 retrospective.md  # Análisis técnico por tecnología
```

## 📅 Cronograma de Desarrollo

- **S05** (07-12 Jul): ✅ **Descripción web app** - Casos de uso y planificación
- **S06** (14-19 Jul): ✅ **Boceto web app** - Mockups Figma e identidad visual  
- **S07** (21-26 Jul): � **Diseño** - Implementación HTML/CSS/JavaScript
- **S08** (28 Jul-01 Ago): ⏳ **Dudas** - Testing y refinamiento
- **S09** (04-09 Ago): ⏳ **Entrega final** - Documentación y presentación

## 🎓 Documentación Técnica

La documentación completa está organizada en la carpeta `docs/`:

- **[Casos de Uso](docs/casos-uso.md)** - Especificación detallada de las 8 funcionalidades
- **[Modelo de Conceptos](docs/concepts-model.md)** - Arquitectura de datos y patrones aplicados  
- **[Retrospectiva](docs/retrospective.md)** - Análisis técnico de cada tecnología aplicada
- **[Identidad Visual](assets/fonts/fonts.md)** - Manual de marca y guía de estilos

## � Funcionalidades Avanzadas

Para demostrar dominio técnico avanzado, el proyecto incluye:

- **Algoritmo de búsqueda inteligente** con scoring de relevancia
- **Sistema de persistencia robusto** con validación y migración de datos
- **Arquitectura modular** usando patrones de diseño profesionales
- **Accesibilidad nivel AA** con navegación por teclado y ARIA
- **Performance optimizada** con debouncing y lazy loading

## 🎨 Identidad Visual

- **Paleta Principal**: Naranja (#FF6B35), Blanco, Gris Carbón (#2C3E50)
- **Tipografía**: Inter (UI), Lora (contenido), Fira Code (código)
- **Iconografía**: Line icons con esquinas redondeadas
- **Espaciado**: Sistema base 8px para consistencia
- **Animaciones**: 200-300ms con easing natural

---

**Estado Actual**: Semana 06 completada ✅ | **Próximo**: Implementación (Semana 07) 🚧

*Proyecto desarrollado como parte del curso CDA Front-End Developer*  
*Universidad: Escuela Colombiana de Ingeniería Julio Garavito*  
*Periodo: Julio-Agosto 2025*