# Guía de Instalación y Despliegue - CiberSegura

## 1. Requisitos Previos

### Mínimos
- Navegador web moderno (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Conexión a internet (solo para primera carga)
- Acceso a servidor local (para desarrollo)

### Opcionales
- Git (para versión control)
- Python 3.x (para servidor local)
- Node.js + npm (para herramientas de construcción)

---

## 2. Opción A: Despliegue en GitHub Pages (Recomendado)

### Paso 1: Preparar Repositorio
```bash
# Crear repositorio en GitHub
# https://github.com/new

# Clonar o crear proyecto
git clone https://github.com/TU_USUARIO/cibersegura.git
cd cibersegura
```

### Paso 2: Estructura de Carpetas
```
cibersegura/
├── index.html
├── css/
│   ├── styles.css
│   ├── dashboard.css
│   └── games.css
├── js/
│   ├── app.js
│   ├── storage.js
│   ├── dashboard.js
│   ├── quiz.js
│   ├── phishing.js
│   └── crossword.js
├── data/
│   ├── quiz.json
│   ├── phishing.json
│   ├── crossword.json
│   ├── modulos.json
│   ├── noticias.json
│   ├── fuentes.json
│   ├── glosario.json
│   └── configuracion.json
├── img/
│   └── (imágenes opcionales)
├── docs/
│   ├── arquitectura.md
│   ├── casos-de-uso.md
│   ├── diagramas.md
│   ├── instalacion.md
│   ├── mantenimiento.md
│   └── json-guide.md
└── README.md
```

### Paso 3: Configurar GitHub Pages
```bash
# En Settings → Pages
# Branch: main
# Folder: / (root)
# Save
```

### Paso 4: Verificar Despliegue
- URL: `https://TU_USUARIO.github.io/cibersegura`
- Esperar 1-2 minutos para activación
- Verificar que todos los archivos se cargan correctamente

---

## 3. Opción B: Servidor Local para Desarrollo

### Python 3.x (Recomendado)
```bash
cd /ruta/al/proyecto
python3 -m http.server 8000

# Acceder: http://localhost:8000
```

### Node.js + http-server
```bash
# Instalar globalmente
npm install -g http-server

# Ejecutar
http-server -p 8000

# Acceder: http://localhost:8000
```

### Live Server (VS Code)
```bash
# Instalar extensión "Live Server"
# Click derecho en index.html → Open with Live Server
```

---

## 4. Verificación Post-Instalación

### Checklist
- [ ] Página carga sin errores (F12 → Console)
- [ ] Sidebar visible y navegable
- [ ] Dashboard se renderiza correctamente
- [ ] Quiz carga preguntas desde quiz.json
- [ ] Phishing carga correos desde phishing.json
- [ ] Crucigrama carga puzzles desde crossword.json
- [ ] LocalStorage funciona (crear usuario, guardar puntos)
- [ ] Responsive design funciona en móvil
- [ ] Botones activables por teclado

### Troubleshooting

**Problema**: Error de CORS al cargar JSON
```
Solución: Usar servidor local, no abrir HTML directamente
python3 -m http.server 8000
```

**Problema**: LocalStorage vacío
```
Solución: Normal en primera visita
- Usar app normalmente
- LocalStorage se llena al completar primera actividad
```

**Problema**: CSS no carga
```
Solución: Verificar rutas relativas en index.html
- Debe ser: css/styles.css (no /css/styles.css)
```

**Problema**: JavaScript error en consola
```
Solución: Verificar que StorageManager está definido
- Verificar orden de scripts en index.html
- storage.js debe cargar antes que otros
```

---

## 5. Configuración de Sitio

### Personalización Básica

#### Cambiar Nombre
En `index.html` → Sidebar:
```html
<div class="brand">🛡️ Mi Sitio de Seguridad</div>
```

#### Cambiar Colores
En `css/styles.css` → Variables CSS:
```css
:root {
  --color-primary: #1a73e8;      /* Azul principal */
  --color-success: #2e7d32;      /* Verde de éxito */
  --color-warning: #f57c00;      /* Naranja de alerta */
}
```

#### Agregar Logo
```html
<img src="img/logo.png" alt="Logo" style="width: 40px; margin-right: 10px;">
```

---

## 6. Actualizaciones de Contenido

### Agregar Nuevas Preguntas Quiz
Ver [json-guide.md](json-guide.md)

### Agregar Nuevos Correos Phishing
Ver [json-guide.md](json-guide.md)

### Agregar Nuevos Crucigramas
Ver [json-guide.md](json-guide.md)

---

## 7. Rendimiento y Optimización

### Métricas Objetivo
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

### Optimizaciones Implementadas
- ✓ CSS minificado (opcional)
- ✓ JavaScript modular
- ✓ Lazy loading de componentes
- ✓ LocalStorage caching

### Para Optimizar Más
```bash
# Minificar CSS
npm install -g csso-cli
csso css/styles.css -o css/styles.min.css

# Minificar JS
npm install -g terser
terser js/app.js -o js/app.min.js
```

---

## 8. Seguridad

### Consideraciones
- ✓ No almacena datos sensibles en LocalStorage
- ✓ No realiza peticiones a servidores externos
- ✓ No ejecuta código dinámico (eval)
- ✓ Validación de entrada en todos los formularios

### Headers Recomendados
En `.github/workflows/pages.yml` (si usa GitHub Actions):
```yaml
- name: Set HTTP headers
  run: |
    mkdir -p _headers
    echo "
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
    " > _headers
```

---

## 9. Backup y Recuperación

### Exportar Datos de Usuario
```javascript
// En consola del navegador
const userData = StorageManager.export();
console.log(userData);
// Copiar y guardar en archivo JSON
```

### Importar Datos de Usuario
```javascript
// En consola del navegador
const backupData = '[JSON AQUÍ]';
StorageManager.import(backupData);
location.reload();
```

---

## 10. Mantenimiento Periódico

### Semanal
- Revisar consola JavaScript por errores
- Verificar que JSON se cargan correctamente

### Mensual
- Revisar datos de usuarios (si aplica)
- Actualizar contenido educativo si es necesario

### Anual
- Revisar compatibilidad con navegadores nuevos
- Actualizar dependencias (si usa npm)
- Revisar seguridad

---

## 11. Recursos Adicionales

### Documentación
- [Casos de Uso](casos-de-uso.md)
- [Diagramas](diagramas.md)
- [Guía JSON](json-guide.md)
- [Mantenimiento](mantenimiento.md)

### Enlaces
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [MDN LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 12. Soporte

### Reportar Problemas
1. Abrir issue en GitHub
2. Incluir:
   - Navegador y versión
   - URL completa
   - Pasos para reproducir
   - Screenshot de consola

### Contacto
- Email: soporte@cibersegura.local
- Comunidad: Foro de ciberseguridad

---

**Última actualización**: 2026-06-23
**Versión**: 1.0.0
**Mantenedor**: CiberSegura Team
