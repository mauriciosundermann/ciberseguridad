# Documentación Técnica - Portal CiberSegura

## 1. Visión General del Proyecto

Portal educativo interactivo sobre ciberseguridad diseñado específicamente para personas mayores de 50 años, con enfoque en alfabetización académica. Utiliza tecnología web moderna (HTML5, CSS3, JavaScript ES6+) sin dependencias externas.

**Stack Tecnológico:**
- HTML5 semántico
- CSS3 responsive
- JavaScript vanilla (ES6+)
- LocalStorage para persistencia
- JSON para datos externos
- GitHub Pages para hosting

## 2. Arquitectura del Sistema

```
CiberSegura (Aplicación Web)
├── Frontend (Cliente)
│   ├── HTML5 (Estructura semántica)
│   ├── CSS3 (Estilos responsive)
│   ├── JavaScript (Lógica de aplicación)
│   └── LocalStorage (Persistencia local)
├── Datos Estáticos (JSON)
│   ├── quiz.json (Preguntas y respuestas)
│   ├── phishing.json (Ejemplos de correos)
│   └── crossword.json (Palabras de crucigrama)
└── Módulos Temáticos
    ├── Módulo 1: Contraseñas Seguras
    ├── Módulo 2: Alfabetización Digital
    └── Módulos Adicionales
```

## 3. Componentes Principales

### 3.1 Sistema de Almacenamiento (LocalStorage)

**Estructura de datos del usuario:**
```json
{
  "usuario": "Invitado",
  "puntajeTotal": 0,
  "nivel": 1,
  "logros": [],
  "actividadesCompletadas": 0,
  "ultimaActividad": "2026-06-23T10:00:00Z",
  "estadisticas": {
    "quiz": 0,
    "crucigrama": 0,
    "phishing": 0
  },
  "progreso": {
    "modulos": [],
    "actividadesRealizadas": []
  }
}
```

### 3.2 Módulos de Actividades

#### 3.2.1 Detector de Phishing
- **Objetivo:** Identificar elementos sospechosos en correos electrónicos
- **Tipo:** Juego interactivo
- **Datos:** phishing.json
- **Mecánica:**
  1. Mostrar correo aleatorio
  2. Permitir seleccionar elementos sospechosos
  3. Validar selecciones
  4. Mostrar retroalimentación educativa
  5. Registrar puntaje

#### 3.2.2 Quiz de Ciberseguridad
- **Objetivo:** Evaluar conocimientos básicos
- **Tipo:** Evaluación formativa
- **Datos:** quiz.json
- **Mecánica:**
  1. Mostrar pregunta con opciones múltiples
  2. Capturar respuesta del usuario
  3. Mostrar retroalimentación inmediata
  4. Calcular puntaje
  5. Guardar resultado

#### 3.2.3 Crucigrama de Ciberseguridad
- **Objetivo:** Reforzar terminología técnica
- **Tipo:** Juego cognitivo
- **Datos:** crossword.json
- **Mecánica:**
  1. Mostrar parrilla de crucigrama
  2. Validar palabras conforme se escriben
  3. Sistema de pistas
  4. Completación automática
  5. Registro de progreso

### 3.3 Sistema de Niveles

**Estructura de niveles:**
- **Nivel 1:** Principiante (0-100 puntos)
- **Nivel 2:** Intermedio (101-250 puntos)
- **Nivel 3:** Avanzado (251-500 puntos)
- **Nivel 4:** Experto (501+ puntos)

### 3.4 Sistema de Logros

**Tipos de logros:**
- Primer Quiz: Completar primer quiz
- Phishing Master: Detectar 10 phishing correctamente
- Crucigrama Pro: Completar 5 crucigramas
- Estudiante Dedicado: Acumular 7 días consecutivos
- Cibersegura: Completar todos los módulos

## 4. Flujo de Datos

```
Usuario Interactúa
    ↓
JavaScript captura evento
    ↓
Valida entrada
    ↓
Calcula puntaje/progreso
    ↓
Actualiza LocalStorage
    ↓
Actualiza Dashboard
    ↓
Muestra retroalimentación
```

## 5. Estructura de Directorios

```
site/
├── index.html                    # Página principal
├── css/
│   ├── styles.css               # Estilos globales
│   ├── dashboard.css            # Estilos del dashboard
│   └── games.css                # Estilos de juegos
├── js/
│   ├── app.js                   # Inicialización de app
│   ├── storage.js               # Gestión de LocalStorage
│   ├── dashboard.js             # Lógica del dashboard
│   ├── quiz.js                  # Lógica del quiz
│   ├── phishing.js              # Lógica del detector de phishing
│   └── crossword.js             # Lógica del crucigrama
├── data/
│   ├── quiz.json                # Preguntas del quiz
│   ├── phishing.json            # Ejemplos de phishing
│   ├── crossword.json           # Palabras del crucigrama
│   ├── modulos.json             # Módulos temáticos
│   ├── fuentes.json             # Fuentes bibliográficas
│   ├── glosario.json            # Términos y definiciones
│   └── configuracion.json       # Configuración global
└── docs/
    ├── arquitectura.md          # Este archivo
    ├── casos-de-uso.md          # Especificación de casos de uso
    ├── diagramas.md             # Diagramas en Mermaid
    ├── instalacion.md           # Guía de instalación
    ├── mantenimiento.md         # Guía de mantenimiento
    └── json-guide.md            # Guía para agregar contenido
```

## 6. Patrón de Diseño: Modular MVC-Light

### Separación de responsabilidades:

**Model (Datos):**
- `storage.js`: Gestión de datos en LocalStorage
- Archivos JSON: Datos estáticos de contenido

**View (Presentación):**
- `styles.css`, `dashboard.css`, `games.css`: Estilos visuales
- Elementos HTML: Estructura semántica

**Controller (Lógica):**
- `app.js`: Orquestador principal
- `quiz.js`, `phishing.js`, `crossword.js`: Lógica de actividades
- `dashboard.js`: Gestión de panel de control

## 7. Ciclo de Vida de la Aplicación

### Inicialización:
1. Cargar HTML
2. Cargar CSS
3. Ejecutar `app.js`
4. Inicializar `storage.js`
5. Cargar datos JSON
6. Renderizar dashboard
7. Activar event listeners

### Durante la sesión:
1. Usuario interactúa
2. Capturar evento
3. Procesar lógica
4. Actualizar datos
5. Guardar en LocalStorage
6. Actualizar UI
7. Mostrar retroalimentación

### Cierre de sesión:
- Datos persisten en LocalStorage
- Pueden ser sincronizados en futuras sesiones

## 8. Consideraciones de Accesibilidad (WCAG 2.1 AA)

### Para Usuarios Mayores de 50 Años:

**Tipografía:**
- Tamaño mínimo: 16px
- Familia: Arial, Verdana, sans-serif
- Contraste: Mínimo 4.5:1

**Colores:**
- Paleta simple y clara
- Evitar rojo-verde (daltonismo común)
- Alto contraste

**Interactividad:**
- Botones grandes (mín. 48px × 48px)
- Hover/focus estados claros
- Confirmaciones antes de acciones destructivas

**Navegación:**
- Menú simple y predecible
- Breadcrumbs claros
- Skip links

**Contenido:**
- Lenguaje simple
- Descripciones amplias
- Sin flashes (mayor riesgo de convulsiones)

## 9. Seguridad y Privacidad

### Datos Locales:
- Todo se almacena localmente en el navegador
- No se envían datos a servidores externos
- Usuario puede limpiar datos en cualquier momento
- GDPR compliant (sin recopilación de datos personales)

### Buenas Prácticas:
- Validar entrada de usuario
- Sanitizar datos antes de mostrar
- Usar Content Security Policy (si es necesario)
- HTTPS en producción

## 10. Requerimientos No Funcionales

**Performance:**
- Carga inicial < 2 segundos
- Respuesta interactiva < 100ms
- Sin bloqueadores de renderizado

**Compatibilidad:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Navegadores móviles modernos

**Responsividad:**
- Mobile First (320px+)
- Tablet (768px+)
- Desktop (1024px+)

**Accesibilidad:**
- WCAG 2.1 Nivel AA
- Screen reader compatible
- Keyboard navigation

## 11. Extensibilidad

### Para agregar nuevas actividades:

1. Crear archivo JavaScript en `/js/nuevaActividad.js`
2. Crear estilos en `/css/games.css`
3. Crear datos en `/data/nuevaActividad.json`
4. Registrar en `app.js`
5. Agregar acceso en índice

### Para agregar módulos:

1. Agregar entrada en `modulos.json`
2. Crear contenido temático
3. Agregar a la navegación
4. Crear rutas en `app.js`

## 12. Testing

### Pruebas Manuales Recomendadas:

- **Funcionalidad:** Cada actividad completa
- **Almacenamiento:** Verificar persistencia
- **Navegación:** Todos los enlaces
- **Accesibilidad:** Zoom, keyboard, screen reader
- **Responsividad:** Múltiples tamaños de pantalla
- **Compatibilidad:** Navegadores principales

### Checklist:

```
[ ] Datos se guardan y persisten
[ ] Puntajes se calculan correctamente
[ ] Logros se desbloquean apropiadamente
[ ] Dashboard se actualiza en tiempo real
[ ] Diseño es responsive
[ ] Texto es legible
[ ] Todos los botones funcionan
[ ] No hay errores en consola
[ ] Performance es aceptable
```

## 13. Mantenimiento

### Actualización de contenido:

1. Editar archivos JSON en `/data/`
2. No requiere recompilación
3. Cambios visibles inmediatamente

### Actualización de código:

1. Editar archivos JS/CSS
2. Comprobar compatibilidad
3. Probar en múltiples navegadores
4. Publicar en GitHub Pages

### Respaldo:

1. Exportar JSON regularmente
2. Controlar versiones en Git
3. Documentar cambios en commits

---

**Última actualización:** 2026-06-23
**Versión:** 1.0.0
**Autor:** Equipo de Desarrollo CiberSegura
