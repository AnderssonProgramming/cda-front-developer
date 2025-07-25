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