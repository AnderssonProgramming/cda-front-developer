# 💼 Casos de Uso - Cocina para Uno

**Proyecto del Curso CDA Front-End Developer**  
*Documentación detallada de casos de uso*

## Casos de Uso Principales (Mínimos Requeridos)

### 1. Buscar una receta

- **Actor**: Usuario
- **Descripción**: El usuario puede buscar recetas existentes mediante palabras clave
- **Precondiciones**: 
  - El usuario está en la página principal
  - Existen recetas almacenadas en el sistema
- **Flujo Principal**:
  1. El usuario hace clic en la barra de búsqueda
  2. El usuario escribe palabras clave (nombre de receta o ingrediente)
  3. El sistema filtra las recetas en tiempo real mientras el usuario escribe
  4. Se muestran resultados por título o ingredientes coincidentes
  5. El usuario puede hacer clic en cualquier resultado para ver el detalle
- **Flujo Alternativo**:
  - Si no hay resultados, se muestra mensaje "No se encontraron recetas"
  - El usuario puede limpiar la búsqueda para ver todas las recetas
- **Postcondiciones**: Las recetas filtradas se muestran en la galería

### 2. Agregar una nueva receta

- **Actor**: Usuario
- **Descripción**: El usuario puede crear y guardar nuevas recetas personalizadas
- **Precondiciones**: El usuario está en la página principal
- **Flujo Principal**:
  1. El usuario hace clic en el botón "Nueva Receta" o "+"
  2. Se abre un formulario modal o nueva vista
  3. El usuario completa los campos requeridos:
     - Nombre de la receta
     - Lista de ingredientes
     - Pasos de preparación
     - Tiempo estimado
     - Categoría(s)
     - Imagen (opcional)
  4. El sistema valida que los campos obligatorios estén completos
  5. El usuario hace clic en "Guardar"
  6. El sistema almacena la receta en localStorage
  7. La nueva receta aparece en la galería principal
- **Flujo Alternativo**:
  - Si faltan campos obligatorios, se muestran mensajes de error
  - El usuario puede cancelar y volver a la vista principal
- **Postcondiciones**: Nueva receta creada y visible en la galería

### 3. Guardar recetas como favoritas

- **Actor**: Usuario
- **Descripción**: El usuario puede marcar y filtrar sus recetas preferidas
- **Precondiciones**: 
  - Existen recetas en el sistema
  - El usuario está visualizando una receta
- **Flujo Principal**:
  1. El usuario hace clic en el ícono de corazón en una tarjeta de receta
  2. El ícono cambia de estado (vacío a lleno, cambio de color)
  3. La receta se marca como favorita en el sistema
  4. El usuario puede acceder al filtro "Favoritas"
  5. Al activar el filtro, solo se muestran las recetas marcadas como favoritas
- **Flujo Alternativo**:
  - El usuario puede quitar de favoritos haciendo clic nuevamente
  - Si no hay favoritas, se muestra mensaje informativo
- **Postcondiciones**: Receta marcada/desmarcada como favorita

## Casos de Uso Adicionales (Funcionalidades Extendidas)

### 4. Ver detalle de una receta

- **Actor**: Usuario
- **Descripción**: Visualizar información completa de una receta específica
- **Precondiciones**: El usuario está en la galería de recetas
- **Flujo Principal**:
  1. El usuario hace clic en una tarjeta de receta
  2. Se abre un modal o vista detallada con:
     - Imagen grande de la receta
     - Lista completa de ingredientes con cantidades
     - Pasos numerados de preparación
     - Tiempo de cocción
     - Categorías
     - Opción de marcar como favorita
  3. El usuario puede navegar por la información
  4. El usuario cierra el modal o regresa a la galería
- **Postcondiciones**: Usuario ha visualizado información completa

### 5. Editar una receta existente

- **Actor**: Usuario
- **Descripción**: Modificar recetas previamente creadas
- **Precondiciones**: 
  - La receta existe en el sistema
  - El usuario está en vista de detalle o galería
- **Flujo Principal**:
  1. El usuario hace clic en el botón "Editar" (ícono de lápiz)
  2. Se abre el formulario de edición precargado con datos existentes
  3. El usuario modifica los campos deseados
  4. El sistema valida los cambios
  5. El usuario guarda los cambios
  6. La receta actualizada se refleja en la galería
- **Postcondiciones**: Receta modificada y actualizada en el sistema

### 6. Eliminar una receta

- **Actor**: Usuario
- **Descripción**: Remover recetas no deseadas del sistema
- **Precondiciones**: La receta existe en el sistema
- **Flujo Principal**:
  1. El usuario hace clic en el botón "Eliminar" (ícono de papelera)
  2. Se muestra un modal de confirmación
  3. El usuario confirma la eliminación
  4. La receta se remueve del localStorage
  5. La receta desaparece de la galería
- **Flujo Alternativo**:
  - El usuario puede cancelar la eliminación
- **Postcondiciones**: Receta eliminada permanentemente

### 7. Filtrar por categorías

- **Actor**: Usuario
- **Descripción**: Organizar recetas por tipo (Vegetarianas, Postres, Rápidas, etc.)
- **Precondiciones**: Existen recetas con categorías asignadas
- **Flujo Principal**:
  1. El usuario accede al menú de filtros
  2. Se muestran las categorías disponibles
  3. El usuario selecciona una o más categorías
  4. La galería se filtra mostrando solo recetas de esas categorías
  5. El usuario puede limpiar filtros para ver todas las recetas
- **Postcondiciones**: Galería filtrada por categorías seleccionadas

### 8. Persistencia de datos

- **Actor**: Sistema
- **Descripción**: Mantener recetas guardadas entre sesiones
- **Precondiciones**: El navegador soporta localStorage
- **Flujo Principal**:
  1. Cuando el usuario crea/modifica/elimina una receta
  2. El sistema automáticamente guarda los cambios en localStorage
  3. Al recargar la página o volver a la aplicación
  4. El sistema carga las recetas desde localStorage
  5. Las recetas se muestran tal como las dejó el usuario
- **Postcondiciones**: Datos persistentes entre sesiones

## Actores del Sistema

- **Usuario Principal**: Persona que cocina para sí misma y utiliza la aplicación para gestionar sus recetas
- **Sistema**: Aplicación web que maneja la lógica de negocio y persistencia local

## Reglas de Negocio

1. **RN001**: Toda receta debe tener al menos nombre, un ingrediente y un paso de preparación
2. **RN002**: El tiempo de cocción debe ser un valor numérico positivo en minutos
3. **RN003**: Las categorías son opcionales pero recomendadas para mejor organización
4. **RN004**: Los datos se almacenan localmente, no requiere conexión a internet
5. **RN005**: No hay límite en el número de recetas que puede crear un usuario
6. **RN006**: Las imágenes se almacenan como base64 para mantener la funcionalidad offline