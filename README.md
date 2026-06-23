# CiberSegura - Portal Educativo de Ciberseguridad

![Versión](https://img.shields.io/badge/versi%C3%B3n-1.0.0-blue)
![Licencia](https://img.shields.io/badge/licencia-MIT-green)
![Estado](https://img.shields.io/badge/estado-Activo-brightgreen)

> **CiberSegura** es una plataforma educativa interactiva diseñada para enseñar ciberseguridad a personas mayores de 50 años, con tres juegos educativos: Quiz, Detector de Phishing y Crucigrama.

---

## 🎯 Características Principales

### ✅ Tres Juegos Interactivos
- **📝 Quiz**: 10 preguntas sobre ciberseguridad con retroalimentación inmediata
- **🕵️ Detector de Phishing**: Identifica elementos sospechosos en 6 correos
- **✏️ Crucigrama**: 3 puzzles con términos de seguridad

### 📊 Sistema de Gamificación
- **Puntos**: Acumula puntos por cada actividad completada
- **Niveles**: 4 niveles progresivos (Principiante → Experto)
- **Logros**: 5 logros desbloqueables con bonificaciones

### 📱 Diseño Responsivo
- Mobile-first (desde 320px)
- Compatible con tablet y desktop
- Optimizado para mayores de 50 años

### ♿ Accesibilidad WCAG AA
- Contraste de 4.5:1 mínimo
- Fuente de 16px base
- Navegación por teclado
- Modo claro

### 💾 Almacenamiento Local
- Datos guardados en LocalStorage
- Exportar/Importar datos
- Sin necesidad de backend

---

## 🚀 Inicio Rápido

### Opción 1: GitHub Pages (Recomendado)

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/cibersegura.git
cd cibersegura

# Configurar en GitHub
# Settings → Pages → Branch: main → Save

# Acceder
https://tu-usuario.github.io/cibersegura
```

### Opción 2: Servidor Local

```bash
# Python
python3 -m http.server 8000

# Node.js
npx http-server -p 8000

# Acceder
http://localhost:8000
```

---

## 📁 Estructura del Proyecto

```
cibersegura/
├── index.html                    # Punto de entrada
├── css/
│   ├── styles.css               # Estilos base (1000+ líneas)
│   ├── dashboard.css            # Componentes dashboard
│   └── games.css                # Componentes de juegos
├── js/
│   ├── app.js                   # Orquestador principal
│   ├── storage.js               # Gestión de datos
│   ├── dashboard.js             # Dashboard renderizado
│   ├── quiz.js                  # Motor del quiz
│   ├── phishing.js              # Detector de phishing
│   └── crossword.js             # Motor del crucigrama
├── data/
│   ├── quiz.json                # 10 preguntas
│   ├── phishing.json            # 6 emails phishing
│   ├── crossword.json           # 3 crucigramas
│   ├── modulos.json
│   ├── noticias.json
│   ├── fuentes.json
│   ├── glosario.json
│   └── configuracion.json
├── img/                         # Imágenes (opcional)
├── docs/
│   ├── arquitectura.md          # Documentación técnica
│   ├── casos-de-uso.md          # Casos de uso
│   ├── diagramas.md             # Diagramas Mermaid
│   ├── instalacion.md           # Guía de instalación
│   ├── mantenimiento.md         # Procedimientos
│   └── json-guide.md            # Cómo extender contenido
└── README.md                     # Este archivo
```

---

## 🎮 Cómo Usar

### Para Usuarios

1. **Abre el sitio**
   - Desktop: https://tu-usuario.github.io/cibersegura
   - Mobile: Abre en tu navegador favorito

2. **Completa tu primer quiz**
   - Haz clic en "Actividades" → "Quiz"
   - Responde 10 preguntas
   - Gana puntos y sube de nivel

3. **Detecta phishing**
   - Haz clic en "Detector de Phishing"
   - Marca elementos sospechosos
   - Aprende qué es phishing real

4. **Resuelve crucigramas**
   - Haz clic en "Crucigrama"
   - Usa pistas para completar palabras
   - Refuerza vocabulario de seguridad

### Para Administradores

- **Agregar preguntas quiz**: Ver [json-guide.md](docs/json-guide.md)
- **Actualizar noticias**: Editar `data/noticias.json`
- **Cambiar colores**: Editar CSS variables en `css/styles.css`
- **Monitoreo**: Ver [mantenimiento.md](docs/mantenimiento.md)

### Para Desarrolladores

- **Arquitectura**: Ver [arquitectura.md](docs/arquitectura.md)
- **Casos de uso**: Ver [casos-de-uso.md](docs/casos-de-uso.md)
- **Diagramas**: Ver [diagramas.md](docs/diagramas.md)
- **Instalar localmente**: Ver [instalacion.md](docs/instalacion.md)

---

## 📊 Sistema de Puntos

| Actividad | Puntos | Frecuencia |
|-----------|--------|-----------|
| Pregunta Quiz correcta | 10 | Por pregunta |
| Email Phishing correcto | 50 | Por email |
| Crucigrama completado | 50 | Por puzzle |
| Primer Quiz | +10 | Una vez |
| Phishing Master (10 correctos) | +50 | Una vez |
| Crucigrama Pro (5 completados) | +30 | Una vez |
| Estudiante Dedicado (7 días) | +100 | Una vez |
| Cibersegura (Todo completo) | +200 | Una vez |

---

## 🎖️ Niveles

| Nivel | Rango | Insignia |
|-------|-------|----------|
| Principiante | 0-100 | 🟡 |
| Intermedio | 101-250 | 🟠 |
| Avanzado | 251-500 | 🔴 |
| Experto | 500+ | 👑 |

---

## 📱 Compatibilidad

### Navegadores
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Dispositivos
- ✅ Desktop (1920x1080, 1366x768)
- ✅ Tablet (768x1024, 834x1194)
- ✅ Mobile (375x667, 414x896)

### Accesibilidad
- ✅ WCAG 2.1 Level AA
- ✅ Navegación por teclado (Tab, Enter, Escape)
- ✅ Contraste alto (4.5:1)
- ✅ Fuente legible (16px)

---

## 🔧 Tecnologías

```
HTML5 + CSS3 + JavaScript ES6+
├── No frameworks
├── No dependencias externas
├── LocalStorage API
└── Fetch API
```

**Ventajas**:
- ✅ Cero dependencias
- ✅ Muy rápido
- ✅ Funciona offline
- ✅ Fácil de mantener

---

## 📖 Documentación

| Documento | Propósito | Audiencia |
|-----------|----------|----------|
| [arquitectura.md](docs/arquitectura.md) | Diseño técnico | Developers |
| [casos-de-uso.md](docs/casos-de-uso.md) | Escenarios de uso | Product Managers |
| [diagramas.md](docs/diagramas.md) | Diagramas Mermaid | Architects |
| [instalacion.md](docs/instalacion.md) | Cómo instalar | DevOps |
| [mantenimiento.md](docs/mantenimiento.md) | Procedimientos | Admins |
| [json-guide.md](docs/json-guide.md) | Extender contenido | Educadores |

---

## 🐛 Troubleshooting

### Problema: JSON no carga
```
Solución: Usar servidor local, no abrir HTML directamente
python3 -m http.server 8000
```

### Problema: LocalStorage vacío
```
Solución: Normal en primera visita
Completar primera actividad para inicializar datos
```

### Problema: CSS no se ve
```
Solución: Verificar rutas relativas
Deben ser: css/styles.css (no /css/styles.css)
```

### Problema: Error en consola
```
Solución: Verificar orden de scripts en HTML
storage.js DEBE cargar antes que otros
```

---

## 📊 Estadísticas

### Contenido
- 10+ preguntas de quiz
- 6 ejemplos de phishing
- 3 crucigramas
- 5 logros desbloqueables
- 4 niveles de progresión

### Código
- 1500+ líneas CSS
- 1500+ líneas JavaScript
- 6 módulos independientes
- 0 dependencias externas

### Documentación
- 6 guías técnicas
- 11 diagramas Mermaid
- 8 checklists
- 50+ ejemplos de código

---

## 🤝 Contribuir

Para contribuir:
1. Fork el repositorio
2. Crea rama: `git checkout -b feature/mejora`
3. Commit cambios: `git commit -am 'Agrega mejora'`
4. Push: `git push origin feature/mejora`
5. Abre Pull Request

### Áreas donde podemos mejorar
- [ ] Agregar más preguntas quiz
- [ ] Crear nuevos crucigramas
- [ ] Mejorar diseño UI
- [ ] Traducir a otros idiomas
- [ ] Agregar soporte offline
- [ ] Crear PWA

---

## 📄 Licencia

MIT License - Libre para usar, modificar y distribuir

---

## 👥 Equipo

- **Idea Original**: [Tu Nombre]
- **Desarrollo**: CiberSegura Team
- **Diseño**: [Diseñador]
- **Contenido Educativo**: [Educador]

---

## 📞 Soporte

- 📧 Email: soporte@cibersegura.local
- 🐛 Reportar bug: GitHub Issues
- 💡 Sugerir mejora: GitHub Discussions
- 📚 Documentación: Ver carpeta `/docs`

---

## 🎓 Recursos Educativos

### Para Aprender Ciberseguridad
- [INCIBE](https://www.incibe.es/)
- [Mozilla Security](https://infosec.mozilla.org/)
- [OWASP](https://owasp.org/)

### Para Aprender a Desarrollar
- [MDN Web Docs](https://developer.mozilla.org/)
- [Web.dev](https://web.dev/)
- [JavaScript.info](https://javascript.info/)

---

## 🚀 Roadmap Futuro

- [ ] Versión 1.1: Más preguntas y crucigramas
- [ ] Versión 1.2: Interfaz en otros idiomas
- [ ] Versión 2.0: Backend con base de datos
- [ ] Versión 2.1: Aplicación móvil nativa
- [ ] Versión 3.0: IA para preguntas personalizadas

---

## 📈 Métricas

```
Performance:
- First Contentful Paint: < 1.5s
- Lighthouse Score: > 90
- Zero external requests
- Accessibility: WCAG AA

Usability:
- Time to first interaction: < 2s
- Number of clicks to quiz: 2
- Mobile user support: 100%
```

---

## 🙌 Reconocimientos

- Equipo de UX Design
- Comunidad de ciberseguridad
- Usuarios beta testers
- Mentores y asesores

---

**Última actualización**: 2026-06-23  
**Versión**: 1.0.0  
**Estado**: ✅ Producción  

---

Hecho con ❤️ para personas mayores de 50 años
