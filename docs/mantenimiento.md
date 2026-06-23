# Guía de Mantenimiento - CiberSegura

## 1. Introducción

Este documento describe los procedimientos de mantenimiento regular y excepcional para mantener CiberSegura en funcionamiento óptimo.

---

## 2. Mantenimiento Diario (5 minutos)

### 2.1 Verificación de Funcionamiento
```bash
# Acceder al sitio
https://tu-usuario.github.io/cibersegura

# Verificar:
- [ ] Página carga completamente
- [ ] Sidebar es visible
- [ ] Dashboard renderiza
- [ ] No hay errores en consola (F12)
```

### 2.2 Monitoreo de Errores
1. Abrir DevTools (F12)
2. Revisar pestaña "Console"
3. Si hay errores: Tomar screenshot y registrar
4. Nota: Warnings de deprecación son normales

---

## 3. Mantenimiento Semanal (30 minutos)

### 3.1 Revisión de Contenido
```bash
# Verificar cada JSON carga correctamente
- [ ] quiz.json
- [ ] phishing.json
- [ ] crossword.json
- [ ] modulos.json
- [ ] noticias.json
```

### 3.2 Prueba de Funcionalidad Completa

#### Quiz
1. Completar un quiz
2. Verificar que puntos se guardan
3. Verificar que puntaje se suma al total

#### Phishing
1. Completar un detector
2. Verificar retroalimentación
3. Verificar que resultado se registra

#### Crucigrama
1. Completar un crucigrama
2. Verificar validación correcta/incorrecta
3. Verificar puntos asignados

### 3.3 Prueba en Múltiples Dispositivos
```
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] Navegadores: Chrome, Firefox, Safari, Edge
```

### 3.4 Limpieza de LocalStorage
Si hay problemas:
```javascript
// En consola del navegador
StorageManager.reset();
location.reload();
```

---

## 4. Mantenimiento Mensual (2 horas)

### 4.1 Revisión de Seguridad
```bash
# Verificar no hay:
- [ ] Contraseñas en código
- [ ] APIs expuestas
- [ ] CORS issues
- [ ] XSS vulnerabilities
```

### 4.2 Análisis de Rendimiento

#### Lighthouse (Chrome DevTools)
1. Abre DevTools (F12)
2. Pestaña "Lighthouse"
3. Genera reporte
4. Objetivo: Score > 90

#### Métricas Objetivo
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- Total Blocking Time: < 200ms

### 4.3 Revisión de Analytics (si aplica)
- Usuarios activos
- Actividades completadas
- Tasa de abandono
- Errores más comunes

### 4.4 Actualización de Contenido
- [ ] ¿Hay noticias obsoletas? Reemplazar
- [ ] ¿Hay fuentes muertas? Actualizar enlaces
- [ ] ¿Hay spelling errors? Corregir

---

## 5. Mantenimiento Trimestral (4 horas)

### 5.1 Auditoría Completa

#### Código
```bash
# Revisar cambios recientes
git log --oneline -20

# Verificar ramas
git branch -a

# Revisar commits
git diff main..develop
```

#### Estructura
- [ ] Todos los archivos presentes
- [ ] Rutas correctas en HTML
- [ ] No hay archivos huérfanos
- [ ] Documentación al día

### 5.2 Prueba de Backup/Recuperación
```javascript
// Exportar
const backup = StorageManager.export();
console.log(backup);

// Guardar en archivo JSON
// Limpiar localStorage
StorageManager.reset();

// Importar
StorageManager.import(backup);
location.reload();
```

### 5.3 Prueba de Escalabilidad
- Agregar 50 preguntas al quiz
- Agregar 10 crucigramas
- Agregar 10 emails
- Verificar rendimiento sigue bien

### 5.4 Revisión de Accesibilidad
```bash
# Usar herramienta WAVE
# https://wave.webaim.org/

Revisar:
- [ ] Contraste de colores
- [ ] Etiquetas en formularios
- [ ] Navegación por teclado
- [ ] Descripciones alt en imágenes
```

---

## 6. Mantenimiento Anual (8 horas)

### 6.1 Revisión de Tecnologías
- [ ] ¿Nuevas versiones de navegadores?
- [ ] ¿Cambios en Web Standards?
- [ ] ¿Nuevas APIs disponibles?
- [ ] ¿Cambios de seguridad?

### 6.2 Actualización de Dependencias
```bash
# Si usa npm
npm update

# Si usa pip (herramientas)
pip install --upgrade
```

### 6.3 Migración/Modernización
- [ ] ¿Cambiar a nueva framework?
- [ ] ¿Agregar PWA support?
- [ ] ¿Agregar backend?
- [ ] ¿Cambiar hosting?

---

## 7. Tareas Recurrentes

### 7.1 Actualización de Noticias
**Frecuencia**: Semanal
**Tiempo**: 10 minutos
**Proceso**:
1. Editar `data/noticias.json`
2. Agregar nueva entrada en inicio del array
3. Validar JSON
4. Commit a Git
5. Verificar en producción

### 7.2 Revisión de Preguntas Quiz
**Frecuencia**: Mensual
**Tiempo**: 30 minutos
**Proceso**:
1. Revisar quiz.json
2. Eliminar preguntas confusas
3. Agregar nuevas preguntas
4. Verificar respuestas correctas
5. Validar JSON
6. Prueba en app

### 7.3 Actualización de Glosario
**Frecuencia**: Mensual
**Tiempo**: 20 minutos
**Proceso**:
1. Editar data/glosario.json
2. Revisar definiciones
3. Agregar nuevos términos
4. Mejorar ejemplos
5. Validar JSON

---

## 8. Procedimientos de Emergencia

### 8.1 Sitio Caído

**Síntoma**: Página en blanco o error 404

**Diagnóstico**:
1. Verificar estado de GitHub Pages
2. Revisar configuración en Settings
3. Verificar rama correcta (main)
4. Revisar build status

**Solución**:
```bash
git pull origin main
git push origin main
# Esperar 1-2 minutos
```

### 8.2 JSON No Se Carga

**Síntoma**: Error en consola, datos vacíos

**Diagnóstico**:
1. Verificar archivo existe
2. Validar JSON con jsonlint.com
3. Revisar ruta en código

**Solución**:
```bash
python3 -m json.tool data/quiz.json
# Si hay error, arreglarlo
# Commit y push
```

### 8.3 LocalStorage Corruptos

**Síntoma**: Errores al abrir, datos pérdida

**Diagnóstico**:
1. Abrir DevTools
2. Ejecutar: `localStorage.getItem('cibersegura_usuario')`
3. Verificar JSON válido

**Solución**:
```javascript
// Opción 1: Limpiar todo
localStorage.clear();

// Opción 2: Restaurar desde backup
StorageManager.import(backupData);
```

### 8.4 Rendimiento Pobre

**Síntoma**: Sitio lento, cuelga

**Diagnóstico**:
1. Abrir DevTools → Performance
2. Grabar sesión
3. Buscar bottlenecks
4. Revisar red requests

**Soluciones**:
- Comprimir imágenes
- Minificar CSS/JS
- Optimizar JSON
- Agregar caching

---

## 9. Checklists por Rol

### Para Administrador
```
Diario:
- [ ] Verificar que sitio está online
- [ ] Revisar consola por errores

Semanal:
- [ ] Prueba completa de funcionalidad
- [ ] Revisar noticias obsoletas
- [ ] Backup de datos

Mensual:
- [ ] Análisis de rendimiento
- [ ] Revisión de contenido
- [ ] Pruebas cross-browser

Anual:
- [ ] Auditoría completa
- [ ] Actualización de deps
- [ ] Revisión de seguridad
```

### Para Desarrollador
```
Antes de Push:
- [ ] npm test (si aplica)
- [ ] Validar JSON
- [ ] Prueba manual
- [ ] Revisar consola

En Producción:
- [ ] Esperar confirmación en staging
- [ ] Deploy a main
- [ ] Verificar en live
- [ ] Monitorear errores

Regularmente:
- [ ] Code review
- [ ] Refactoring
- [ ] Documentación
- [ ] Testing
```

### Para Educador
```
Semanal:
- [ ] Agregar noticias educativas
- [ ] Actualizar glosario
- [ ] Revisar preguntas

Mensual:
- [ ] Analizar usabilidad
- [ ] Recopilar feedback
- [ ] Planificar mejoras

Trimestral:
- [ ] Crear nuevo módulo
- [ ] Revisar objetivos
- [ ] Ajustar dificultad
```

---

## 10. Escalada de Problemas

```
Nivel 1 (Usuario):
- Problemas de navegación
- No recuerda contraseña
→ Solución: Limpiar cache/cookies

Nivel 2 (Administrador):
- JSON no carga
- Errores en consola
→ Solución: Validar archivo, revisar rutas

Nivel 3 (Desarrollador):
- Bugs en lógica
- Refactoring
→ Solución: Debug, unit tests, deploy

Nivel 4 (DevOps):
- GitHub Pages caído
- Cambio de hosting
→ Solución: Infra review, migration plan
```

---

## 11. Documentación de Cambios

### Template de Commit
```
git commit -m "Tipo: Descripción breve

Descripción detallada de qué cambió y por qué.

Archivo(s): data/quiz.json
Cambio: Agregadas 5 preguntas nuevas
Impacto: Aumenta variabilidad de quiz
Testing: ✓ Probado en 3 navegadores
"
```

### Versionado Semántico
- `1.0.0` - Versión inicial
- `1.1.0` - Nuevas preguntas (minor)
- `1.0.1` - Bug fix (patch)
- `2.0.0` - Cambio mayor (breaking)

---

## 12. Recursos Útiles

### Herramientas
- [JSONLint](https://jsonlint.com/) - Validar JSON
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Performance
- [WAVE](https://wave.webaim.org/) - Accesibilidad
- [Can I Use](https://caniuse.com/) - Compatibilidad

### Documentación
- [MDN Web Docs](https://developer.mozilla.org/)
- [GitHub Pages Guide](https://docs.github.com/en/pages)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Contactos
- DevOps: devops@cibersegura.local
- Desarrollo: dev@cibersegura.local
- Educación: edu@cibersegura.local
- Soporte: soporte@cibersegura.local

---

## 13. Métricas de Monitoreo

### Indicadores Clave

| Métrica | Objetivo | Frecuencia |
|---------|----------|-----------|
| Uptime | 99.9% | Diario |
| Performance Score | >90 | Semanal |
| Accessibility | WCAG AA | Mensual |
| Error Rate | <0.1% | Diario |
| Response Time | <1s | Diario |
| Users Activos | >10 | Semanal |

### Dashboard de Monitoreo
```javascript
// Comando para ejecutar en consola
console.table(StorageManager.getStats());
```

---

**Última actualización**: 2026-06-23
**Versión**: 1.0.0
**Próxima revisión**: 2026-07-23
