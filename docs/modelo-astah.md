# 📊 Modelo para Astah - Cocina para Uno PWA

**Documento de especificación para modelado en Astah Studio**  
*Diagramas de conceptos y casos de uso del sistema*

---

## 🏗️ DIAGRAMA DE CONCEPTOS

### Conceptos Principales Identificados

#### 1. **USUARIO**
- **Definición**: Persona que utiliza la aplicación para gestionar su recetario personal
- **Atributos**: 
  - Ninguno (aplicación anónima sin registro)
- **Responsabilidades**:
  - Crear y gestionar recetas
  - Buscar y filtrar contenido
  - Exportar información
  - Configurar preferencias de la aplicación

#### 2. **RECETA**
- **Definición**: Entidad principal que contiene toda la información necesaria para preparar un plato
- **Atributos**:
  - `id: String` (identificador único timestamp)
  - `nombre: String` (título de la receta)
  - `ingredientes: Array<String>` (lista de ingredientes)
  - `pasos: Array<String>` (instrucciones de preparación)
  - `tiempo: Number` (tiempo en minutos)
  - `categoria: Array<String>` (categorías asignadas)
  - `favorita: Boolean` (marcada como favorita)
  - `imagen: String` (imagen en base64 opcional)
  - `fechaCreacion: Date` (timestamp de creación)
  - `fechaModificacion: Date` (timestamp de última edición)
- **Responsabilidades**:
  - Almacenar información completa del plato
  - Validar integridad de los datos
  - Proporcionar métodos de serialización

#### 3. **GESTOR_RECETAS**
- **Definición**: Controlador principal que maneja toda la lógica de negocio del sistema
- **Atributos**:
  - `recetas: Array<Receta>` (colección de recetas)
  - `filtroActivo: String` (filtro aplicado actualmente)
  - `terminoBusqueda: String` (término de búsqueda actual)
- **Responsabilidades**:
  - Operaciones CRUD sobre recetas
  - Filtrado y búsqueda inteligente
  - Gestión de favoritos
  - Validación de datos
  - Sincronización con almacenamiento

#### 4. **GESTOR_ALMACENAMIENTO**
- **Definición**: Componente responsable de la persistencia de datos en el navegador
- **Atributos**:
  - `claveAlmacenamiento: String` (clave para localStorage)
  - `versionDatos: String` (versión de la estructura de datos)
- **Responsabilidades**:
  - Guardar y recuperar datos de localStorage
  - Validar integridad de datos almacenados
  - Manejar migración de versiones
  - Proporcionar fallbacks para errores

#### 5. **GESTOR_EXPORTACION**
- **Definición**: Controlador especializado en generar y exportar recetas en múltiples formatos
- **Atributos**:
  - `formatosDisponibles: Array<String>` (PDF, JSON, CSV, TXT, Markdown, PNG)
  - `opcionesExportacion: Object` (configuraciones de export)
- **Responsabilidades**:
  - Generar documentos PDF con jsPDF
  - Crear imágenes PNG con html2canvas
  - Convertir datos a formatos estructurados
  - Manejar descarga de archivos
  - Validar datos antes de exportar

#### 6. **INTERFAZ_USUARIO**
- **Definición**: Capa de presentación que maneja toda la interacción visual con el usuario
- **Atributos**:
  - `temaActual: String` (claro/oscuro)
  - `modalAbierto: Boolean` (estado de modales)
  - `filtrosVisibles: Boolean` (visibilidad de filtros)
- **Responsabilidades**:
  - Renderizar elementos visuales
  - Capturar eventos del usuario
  - Mostrar feedback y notificaciones
  - Manejar responsive design
  - Gestionar animaciones y transiciones

### Relaciones entre Conceptos

```
USUARIO ──── interactúa_con ────► INTERFAZ_USUARIO
                                        │
                                        ▼
                               GESTOR_RECETAS
                                        │
                        ┌───────────────┼───────────────┐
                        ▼               ▼               ▼
                    RECETA    GESTOR_ALMACENAMIENTO  GESTOR_EXPORTACION
                        │               │               │
                        └───── persiste_en ─────────────┘
```

---

## 📋 MODELO DE CASOS DE USO

### Casos de Uso Principales

#### CU-01: **Crear Nueva Receta**
- **Actor**: Usuario
- **Descripción**: COMO usuario de la aplicación QUIERO poder crear una nueva receta con todos sus detalles PARA PODER almacenar mis recetas personales en el sistema
- **Precondiciones**: El usuario tiene la aplicación abierta
- **Flujo Principal**:
  1. Usuario hace clic en "Nueva Receta"
  2. Sistema abre modal de formulario
  3. Usuario ingresa nombre, ingredientes, pasos y tiempo
  4. Usuario selecciona categorías (opcional)
  5. Usuario agrega imagen (opcional)
  6. Usuario confirma creación
  7. Sistema valida datos
  8. Sistema guarda receta en almacenamiento
  9. Sistema actualiza interfaz con nueva receta
- **Postcondiciones**: Nueva receta queda almacenada y visible en la galería

#### CU-02: **Buscar Recetas**
- **Actor**: Usuario
- **Descripción**: COMO usuario con múltiples recetas QUIERO poder buscar recetas por nombre, ingredientes o categorías PARA PODER encontrar rápidamente la receta que necesito
- **Precondiciones**: Existen recetas en el sistema
- **Flujo Principal**:
  1. Usuario escribe en el campo de búsqueda
  2. Sistema aplica debounce de 300ms
  3. Sistema filtra recetas por coincidencias en nombre, ingredientes y categorías
  4. Sistema actualiza galería con resultados
  5. Sistema muestra contador de resultados
- **Postcondiciones**: Se muestran solo las recetas que coinciden con la búsqueda

#### CU-03: **Marcar Receta como Favorita**
- **Actor**: Usuario
- **Descripción**: COMO usuario que cocina frecuentemente QUIERO poder marcar mis recetas preferidas como favoritas PARA PODER acceder rápidamente a ellas mediante filtros
- **Precondiciones**: Existe al menos una receta en el sistema
- **Flujo Principal**:
  1. Usuario hace clic en el corazón de una receta
  2. Sistema cambia estado de favorita (true/false)
  3. Sistema actualiza ícono visual (lleno/vacío)
  4. Sistema guarda cambio en almacenamiento
  5. Sistema muestra notificación de confirmación
- **Postcondiciones**: Receta queda marcada/desmarcada como favorita

#### CU-04: **Filtrar por Categorías**
- **Actor**: Usuario
- **Descripción**: COMO usuario con recetas organizadas QUIERO poder filtrar por categorías específicas o ver solo favoritas PARA PODER navegar eficientemente por mi colección
- **Precondiciones**: Existen recetas con categorías asignadas
- **Flujo Principal**:
  1. Usuario selecciona filtro (Todas, Favoritas, o categoría específica)
  2. Sistema filtra array de recetas según criterio
  3. Sistema actualiza galería con recetas filtradas
  4. Sistema actualiza contadores dinámicos
  5. Sistema mantiene estado visual del filtro activo
- **Postcondiciones**: Se muestran solo las recetas que cumplen el criterio de filtrado

#### CU-05: **Ver Detalles de Receta**
- **Actor**: Usuario
- **Descripción**: COMO usuario interesado en cocinar QUIERO poder ver todos los detalles de una receta en formato completo PARA PODER seguir las instrucciones paso a paso
- **Precondiciones**: Existe la receta seleccionada
- **Flujo Principal**:
  1. Usuario hace clic en una tarjeta de receta
  2. Sistema abre modal de detalles
  3. Sistema muestra información completa (imagen, ingredientes, pasos, tiempo)
  4. Sistema proporciona opciones de acción (editar, exportar, cerrar)
- **Postcondiciones**: Usuario puede ver toda la información de la receta

#### CU-06: **Editar Receta Existente**
- **Actor**: Usuario
- **Descripción**: COMO usuario que quiere mejorar sus recetas QUIERO poder editar cualquier receta existente PARA PODER actualizar ingredientes, pasos o cualquier otro detalle
- **Precondiciones**: Existe la receta a editar
- **Flujo Principal**:
  1. Usuario hace clic en botón editar de una receta
  2. Sistema abre modal de formulario pre-poblado con datos actuales
  3. Usuario modifica campos deseados
  4. Usuario confirma cambios
  5. Sistema valida datos modificados
  6. Sistema actualiza receta en almacenamiento
  7. Sistema refresca interfaz con datos actualizados
- **Postcondiciones**: Receta queda actualizada con los nuevos datos

#### CU-07: **Eliminar Receta**
- **Actor**: Usuario
- **Descripción**: COMO usuario que mantiene su recetario organizado QUIERO poder eliminar recetas que ya no necesito PARA PODER mantener solo las recetas relevantes
- **Precondiciones**: Existe la receta a eliminar
- **Flujo Principal**:
  1. Usuario hace clic en botón eliminar de una receta
  2. Sistema muestra confirmación de eliminación
  3. Usuario confirma la acción
  4. Sistema elimina receta del almacenamiento
  5. Sistema actualiza interfaz removiendo la receta
  6. Sistema recalcula contadores
- **Postcondiciones**: Receta queda permanentemente eliminada

#### CU-08: **Exportar Receta en PDF**
- **Actor**: Usuario
- **Descripción**: COMO usuario que quiere compartir recetas QUIERO poder exportar una receta como documento PDF profesional PARA PODER imprimirla o compartirla fácilmente
- **Precondiciones**: Existe la receta a exportar
- **Flujo Principal**:
  1. Usuario hace clic en botón exportar de una receta
  2. Sistema abre modal de opciones de exportación
  3. Usuario selecciona formato PDF
  4. Usuario configura opciones adicionales (imagen, metadatos)
  5. Usuario confirma exportación
  6. Sistema genera PDF usando jsPDF
  7. Sistema descarga archivo automáticamente
- **Postcondiciones**: Archivo PDF se descarga con la receta formateada

#### CU-09: **Exportar Receta como Imagen**
- **Actor**: Usuario
- **Descripción**: COMO usuario activo en redes sociales QUIERO poder exportar una receta como imagen PNG PARA PODER compartirla visualmente en plataformas sociales
- **Precondiciones**: Existe la receta a exportar
- **Flujo Principal**:
  1. Usuario selecciona exportar como tarjeta PNG
  2. Sistema renderiza receta en formato de tarjeta visual
  3. Sistema usa html2canvas para capturar elemento DOM
  4. Sistema genera imagen PNG optimizada
  5. Sistema descarga archivo de imagen
- **Postcondiciones**: Imagen PNG de la receta se descarga lista para compartir

#### CU-10: **Cambiar Tema de la Aplicación**
- **Actor**: Usuario
- **Descripción**: COMO usuario que usa la aplicación en diferentes momentos del día QUIERO poder cambiar entre tema claro y oscuro PARA PODER tener una experiencia visual cómoda
- **Precondiciones**: La aplicación está cargada
- **Flujo Principal**:
  1. Usuario hace clic en botón de cambio de tema
  2. Sistema detecta tema actual
  3. Sistema cambia a tema opuesto (claro ↔ oscuro)
  4. Sistema aplica nuevas variables CSS
  5. Sistema guarda preferencia en almacenamiento local
- **Postcondiciones**: Interfaz cambia al tema seleccionado y se mantiene la preferencia

### Casos de Uso Secundarios

#### CU-11: **Instalar Aplicación PWA**
- **Actor**: Usuario
- **Descripción**: COMO usuario frecuente de la aplicación QUIERO poder instalarla como aplicación nativa PARA PODER acceder rápidamente sin abrir el navegador
- **Precondiciones**: Navegador compatible con PWA
- **Flujo Principal**:
  1. Sistema detecta capacidad de instalación
  2. Sistema muestra prompt de instalación
  3. Usuario acepta instalación
  4. Sistema registra Service Worker
  5. Aplicación queda instalada en el dispositivo
- **Postcondiciones**: Usuario puede abrir la app desde el launcher del dispositivo

#### CU-12: **Usar Aplicación Sin Conexión**
- **Actor**: Usuario
- **Descripción**: COMO usuario que cocina en cualquier lugar QUIERO poder usar la aplicación sin conexión a internet PARA PODER acceder a mis recetas aunque no tenga conectividad
- **Precondiciones**: Service Worker registrado, datos en caché
- **Flujo Principal**:
  1. Usuario abre aplicación sin conexión
  2. Service Worker intercepta requests
  3. Sistema sirve contenido desde caché
  4. Usuario puede navegar y usar funcionalidades básicas
- **Postcondiciones**: Usuario tiene acceso completo a recetas almacenadas localmente

---

## 🔄 RELACIONES ENTRE CASOS DE USO

### Dependencias
- **CU-02, CU-04** dependen de **CU-01** (necesita recetas para buscar/filtrar)
- **CU-03, CU-05, CU-06, CU-07** extienden **CU-01** (operaciones sobre recetas existentes)
- **CU-08, CU-09** incluyen **CU-05** (necesita acceso a detalles de receta)

### Actores del Sistema
- **Actor Primario**: Usuario (persona que usa la aplicación)
- **Actor Secundario**: Navegador Web (proporciona APIs necesarias)
- **Actor Secundario**: Sistema de Archivos (para descargas)

---

*Este documento contiene toda la información necesaria para crear los diagramas de conceptos y casos de uso en Astah Studio*
