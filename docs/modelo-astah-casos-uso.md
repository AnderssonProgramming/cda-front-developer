# 📊 Modelo para Astah - Cocina para Uno PWA

**Documento de especificación para modelado en Astah Studio**  
*Casos de uso estructurados para diagrama en Astah*

---

## 🎯 CASOS DE USO ESTRUCTURADOS

### 📊 CONSULTAS GERENCIALES

#### CU-01: Consultar estadísticas de uso de recetas
**COMO** administrador del sistema **QUIERO** poder consultar estadísticas de uso de recetas (total de recetas, favoritas, categorías más utilizadas) **PARA PODER** analizar el comportamiento de uso de la aplicación y tomar decisiones de mejora.

#### CU-02: Consultar métricas de rendimiento del sistema
**COMO** administrador del sistema **QUIERO** poder consultar métricas de rendimiento (tiempo de carga, operaciones por segundo, uso de almacenamiento) **PARA PODER** optimizar la experiencia del usuario y el rendimiento general.

#### CU-03: Consultar reportes de exportación
**COMO** administrador del sistema **QUIERO** poder consultar reportes de exportación (formatos más utilizados, frecuencia de exportación) **PARA PODER** entender las preferencias de los usuarios y mejorar las funcionalidades.

#### CU-04: Consultar análisis de categorías
**COMO** administrador del sistema **QUIERO** poder consultar análisis de categorías (distribución de recetas por categoría, tendencias de uso) **PARA PODER** optimizar la organización y clasificación del contenido.

#### CU-05: Consultar estado del almacenamiento
**COMO** administrador del sistema **QUIERO** poder consultar el estado del almacenamiento local (espacio utilizado, límites, integridad de datos) **PARA PODER** garantizar la persistencia adecuada de la información.

---

### ⚙️ CONSULTAS OPERATIVAS

#### CU-06: Consultar recetas por búsqueda en tiempo real
**COMO** usuario de la aplicación **QUIERO** poder consultar recetas mediante búsqueda en tiempo real por nombre, ingredientes o categorías **PARA PODER** encontrar rápidamente las recetas que necesito para cocinar.

#### CU-07: Consultar filtros de categorías disponibles
**COMO** usuario organizador **QUIERO** poder consultar todos los filtros de categorías disponibles en el sistema **PARA PODER** navegar eficientemente por mi colección de recetas organizadas.

#### CU-08: Consultar recetas marcadas como favoritas
**COMO** usuario frecuente **QUIERO** poder consultar específicamente las recetas que he marcado como favoritas **PARA PODER** acceder rápidamente a mis preparaciones preferidas.

#### CU-09: Consultar detalles completos de una receta
**COMO** usuario que va a cocinar **QUIERO** poder consultar todos los detalles completos de una receta (ingredientes, pasos, tiempo, imagen) **PARA PODER** seguir las instrucciones paso a paso durante la preparación.

#### CU-10: Consultar opciones de exportación disponibles
**COMO** usuario que quiere compartir **QUIERO** poder consultar todas las opciones de exportación disponibles (PDF, PNG, JSON, CSV, TXT, Markdown) **PARA PODER** elegir el formato más adecuado según mis necesidades.

#### CU-11: Consultar tema actual de la aplicación
**COMO** usuario visual **QUIERO** poder consultar el tema actual de la aplicación (claro u oscuro) **PARA PODER** tener una experiencia visual cómoda según el momento del día.

#### CU-12: Consultar estado de conectividad para funciones offline
**COMO** usuario móvil **QUIERO** poder consultar el estado de conectividad y funciones offline disponibles **PARA PODER** usar la aplicación sin conexión a internet cuando sea necesario.

---

## 🎭 ACTORES DEL SISTEMA

### Actor Principal
- **Usuario**: Persona que utiliza la aplicación para gestionar su recetario personal

### Actores Secundarios
- **Navegador Web**: Proporciona APIs necesarias (localStorage, Service Worker, etc.)
- **Sistema de Archivos**: Maneja las descargas de archivos exportados
- **Service Worker**: Gestiona caché y funcionalidad offline

---

## 🔗 RELACIONES ENTRE CASOS DE USO

### Dependencias Funcionales
- Los casos **CU-06 a CU-18** dependen de **CU-13** (necesitan recetas existentes)
- Los casos **CU-10, CU-15, CU-16** extienden **CU-09** (requieren acceso a detalles)
- Los casos **CU-01 a CU-05** incluyen múltiples casos operativos para generar métricas

### Jerarquía de Prioridad
1. **Críticos**: CU-13, CU-14, CU-18 (funcionalidad básica CRUD)
2. **Importantes**: CU-06, CU-07, CU-09 (navegación y consulta)
3. **Complementarios**: CU-01 a CU-05 (análisis gerencial)

---

## 📋 GUÍA PARA ASTAH STUDIO

### Pasos para crear el diagrama:
1. **Crear Actor "Usuario"** como actor principal
2. **Agrupar casos de uso** en tres paquetes:
   - Paquete "Consultas Gerenciales" (CU-01 a CU-05)
   - Paquete "Consultas Operativas" (CU-06 a CU-12)
   - Paquete "Funciones CRUD" (CU-13 a CU-18)
3. **Establecer relaciones**:
   - Actor Usuario conectado a todos los casos de uso
   - Relaciones de dependencia según especificado arriba
   - Relaciones de extensión para casos relacionados

### Convenciones de modelado:
- **Formato de nombre**: Todos los casos inician con "Consultar"
- **Estructura**: COMO...QUIERO...PARA PODER
- **Numeración**: CU-01 a CU-18 secuencial
- **Agrupación**: Por tipo funcional (gerencial, operativo, CRUD)

---

## 🔧 OPERACIONES CRUD POR CONCEPTO Y ACTOR

### 📝 **CONCEPTO: RECETA**
**Actor Principal: Usuario Doméstico**

**C:** *Crear Receta*
- Debe poder agregar nueva receta con título, ingredientes, instrucciones y tiempo
- Validar que todos los campos obligatorios estén completos
- Asignar ID único automáticamente
- Permitir agregar imagen opcional

**R:** *Leer Receta*
- Consultar receta completa por ID
- Listar todas las recetas disponibles
- Filtrar recetas por categoría, tiempo o ingredientes
- Visualizar receta con formato legible

**U:** *Actualizar Receta*
- Modificar título, ingredientes, instrucciones o tiempo
- Actualizar imagen de la receta
- Cambiar categoría asignada
- Mantener historial de cambios (opcional)

**D:** *Eliminar Receta*
- Remover receta del sistema permanentemente
- Confirmar eliminación antes de proceder
- Mantener integridad referencial con otras entidades

### 🏷️ **CONCEPTO: CATEGORÍA**
**Actor Principal: Usuario Doméstico**

**C:** *Crear Categoría*
- Definir nueva categoría con nombre único
- Asignar descripción y color distintivo
- Validar que no exista categoría duplicada

**R:** *Leer Categoría*
- Consultar información completa de categoría
- Listar todas las categorías disponibles
- Obtener recetas asociadas a cada categoría

**U:** *Actualizar Categoría*
- Modificar nombre, descripción o color
- Reasignar recetas a categoría actualizada
- Validar unicidad del nombre

**D:** *Eliminar Categoría*
- Remover categoría del sistema
- Reasignar recetas a categoría por defecto
- Confirmar eliminación y efectos en recetas

### 👤 **CONCEPTO: USUARIO**
**Actor Principal: Usuario Doméstico**

**C:** *Crear Usuario*
- Registrar nuevo usuario en el sistema
- Definir preferencias iniciales de cocina
- Establecer configuración de interfaz

**R:** *Leer Usuario*
- Consultar perfil y preferencias del usuario
- Obtener historial de recetas creadas
- Visualizar estadísticas de uso

**U:** *Actualizar Usuario*
- Modificar preferencias de cocina
- Actualizar configuración de interfaz
- Cambiar datos del perfil

**D:** *Eliminar Usuario*
- Remover cuenta de usuario del sistema
- Mantener o anonimizar recetas creadas
- Limpiar datos personales según privacidad

### 📤 **CONCEPTO: EXPORTACIÓN**
**Actor Principal: Usuario Doméstico**

**C:** *Crear Exportación*
- Generar archivo de exportación en formato seleccionado
- Incluir recetas seleccionadas por el usuario
- Aplicar formato específico (PDF, JSON, CSV, etc.)

**R:** *Leer Exportación*
- Consultar historial de exportaciones realizadas
- Verificar estado de exportación en proceso
- Descargar archivo de exportación completado

**U:** *Actualizar Exportación*
- Modificar configuración de formato de exportación
- Actualizar selección de recetas a exportar
- Cambiar parámetros de formato

**D:** *Eliminar Exportación*
- Remover archivos de exportación del sistema
- Limpiar historial de exportaciones
- Liberar espacio de almacenamiento

### 🔍 **CONCEPTO: BÚSQUEDA**
**Actor Principal: Usuario Doméstico**

**C:** *Crear Búsqueda*
- Definir criterios de búsqueda personalizados
- Guardar búsquedas frecuentes como favoritas
- Establecer filtros complejos combinados

**R:** *Leer Búsqueda*
- Ejecutar búsqueda con criterios especificados
- Consultar búsquedas guardadas
- Obtener resultados filtrados y ordenados

**U:** *Actualizar Búsqueda*
- Modificar criterios de búsquedas guardadas
- Refinar filtros existentes
- Actualizar parámetros de ordenamiento

**D:** *Eliminar Búsqueda*
- Remover búsquedas guardadas
- Limpiar historial de búsquedas
- Eliminar filtros personalizados

### ⚙️ **CONCEPTO: CONFIGURACIÓN**
**Actor Principal: Usuario Doméstico**

**C:** *Crear Configuración*
- Establecer configuración inicial del sistema
- Definir preferencias de idioma y formato
- Configurar opciones de accesibilidad

**R:** *Leer Configuración*
- Consultar configuración actual del sistema
- Obtener preferencias de usuario
- Verificar configuraciones por defecto

**U:** *Actualizar Configuración*
- Modificar preferencias de interfaz
- Cambiar configuración de idioma
- Actualizar opciones de accesibilidad

**D:** *Eliminar Configuración*
- Restaurar configuración a valores por defecto
- Limpiar preferencias personalizadas
- Resetear configuración de usuario

---

*Este documento está estructurado específicamente para crear diagramas de casos de uso en Astah Studio con el formato requerido y operaciones CRUD detalladas*
