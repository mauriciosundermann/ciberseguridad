# Casos de Uso - CiberSegura

## 1. Actores del Sistema

### 1.1 Usuario Primario
- **Descripción**: Persona mayor de 50 años buscando aprender sobre ciberseguridad
- **Objetivo**: Completar actividades educativas y mejorar sus conocimientos
- **Dispositivos**: Computadora de escritorio, tablet, ocasionalmente smartphone

### 1.2 Sistema de Almacenamiento
- **Descripción**: LocalStorage del navegador
- **Objetivo**: Persistencia de datos del usuario

## 2. Casos de Uso Principales

### 2.1 Caso: Ver Dashboard
**Actor Principal**: Usuario

**Precondiciones**:
- Navegador web con soporte para LocalStorage
- Primera visita o regreso al sitio

**Flujo Principal**:
1. Usuario abre el sitio web
2. Sistema carga StorageManager y recupera datos
3. Sistema renderiza Dashboard con estadísticas
4. Usuario ve: Puntos, Nivel, Logros, Actividades Recientes

**Postcondiciones**:
- Dashboard visible y actualizado
- Usuario puede acceder a cualquier actividad

**Excepciones**:
- LocalStorage no disponible → Mostrar advertencia
- Datos corruptos → Crear nuevo perfil

---

### 2.2 Caso: Completar Quiz
**Actor Principal**: Usuario

**Precondiciones**:
- Dashboard visible
- JSON de preguntas cargado

**Flujo Principal**:
1. Usuario hace clic en "Quiz"
2. Sistema carga preguntas.json
3. Sistema muestra pregunta #1 de 10
4. Usuario selecciona opción
5. Usuario hace clic en "Responder"
6. Sistema valida respuesta
7. Sistema muestra retroalimentación
8. Usuario hace clic en "Siguiente"
9. Se repite hasta pregunta #10
10. Sistema calcula puntaje
11. Sistema registra actividad en LocalStorage
12. Sistema verifica logros
13. Usuario ve resultados finales

**Flujo Alterno - Respuesta Incorrecta**:
- En paso 7: Mostrar explicación de por qué es incorrecta
- Marcar opción correcta en rojo

**Postcondiciones**:
- Puntaje registrado
- Logros actualizados si corresponde
- Dashboard refleja nuevos datos

---

### 2.3 Caso: Detector de Phishing
**Actor Principal**: Usuario

**Precondiciones**:
- Dashboard visible
- JSON de correos cargado

**Flujo Principal**:
1. Usuario hace clic en "Detector de Phishing"
2. Sistema carga correos.json
3. Sistema muestra correo #1 de 6
4. Usuario marca elementos sospechosos
5. Usuario hace clic en "Verificar"
6. Sistema evalúa si detectó correctamente
7. Sistema muestra retroalimentación con explicación
8. Usuario avanza al siguiente correo
9. Se repite hasta correo #6
10. Sistema calcula precisión
11. Sistema registra actividad

**Criterio de Éxito**:
- Usuario debe detectar ≥70% de los elementos

**Postcondiciones**:
- Resultado registrado
- Estadísticas actualizadas

---

### 2.4 Caso: Jugar Crucigrama
**Actor Principal**: Usuario

**Precondiciones**:
- Dashboard visible
- JSON de crucigramas cargado

**Flujo Principal**:
1. Usuario hace clic en "Crucigrama"
2. Sistema carga crucigramas.json
3. Sistema renderiza grid con palabras cruzadas
4. Sistema muestra pistas horizontales y verticales
5. Usuario completa palabras
6. Usuario hace clic en "Verificar"
7. Sistema valida todas las palabras
8. Si está correcto → Mostrar éxito, avanzar
9. Si hay errores → Marcar en rojo, permitir reintentos
10. Se repite hasta crucigrama #3
11. Sistema registra puntaje total

**Postcondiciones**:
- Crucigrama completado registrado
- Puntos ganados

---

### 2.5 Caso: Ver Logros
**Actor Principal**: Usuario

**Precondiciones**:
- Dashboard renderizado
- Datos de logros en LocalStorage

**Flujo Principal**:
1. Usuario mira sección "Logros Desbloqueables"
2. Sistema muestra 5 logros disponibles
3. Logros desbloqueados muestran: ✓ Icono + Nombre
4. Logros bloqueados muestran: Opaco + Nombre
5. Usuario puede hacer hover para ver descripción

**Logros Disponibles**:
- Primer Quiz (10 pts)
- Phishing Master - Detectar 10 correctamente (50 pts)
- Crucigrama Pro - Completar 5 crucigramas (30 pts)
- Estudiante Dedicado - 7 días consecutivos (100 pts)
- Cibersegura - Completar todos los módulos (200 pts)

---

### 2.6 Caso: Acceder a Recursos
**Actor Principal**: Usuario

**Precondiciones**:
- Dashboard visible

**Flujo Principal**:
1. Usuario hace clic en "Recursos" en sidebar
2. Sistema muestra 4 opciones:
   - Glosario de Términos
   - Guías de Seguridad
   - Preguntas Frecuentes
   - Certificados
3. Usuario selecciona una opción
4. Sistema muestra contenido correspondiente

**Flujo Alterno - Descargar Certificado**:
1. Usuario hace clic en "Descargar Certificado"
2. Sistema muestra datos:
   - Nombre del usuario
   - Nivel alcanzado
   - Puntos totales
   - Actividades completadas
   - Logros desbloqueados
3. Sistema genera certificado

---

## 3. Escenarios de Interacción

### Escenario 1: Primer Usuario
```
Día 1:
- Abre la app → Ve Dashboard vacío
- Hace primer quiz → +50 puntos
- Desbloquea logro "Primer Quiz"
- Sube a Nivel 1 (Principiante)
```

### Escenario 2: Usuario Dedicado
```
Semana 1:
- Día 1: Quiz → 50 pts
- Día 2: Phishing × 2 → 60 pts
- Día 3: Crucigrama → 50 pts
- Día 4: Quiz × 2 → 100 pts
- Día 5: Phishing → 40 pts
- Día 6: Crucigrama → 50 pts
- Día 7: Todo → 200 pts
- Total: 550 pts
- Desbloquea: "Estudiante Dedicado" (+100)
- Sube a Nivel 3 (Avanzado)
```

### Escenario 3: Recuperación de Datos
```
- Usuario 1 usa navegador en casa
- Datos guardados en LocalStorage
- Usuario 1 abre la app en su computadora
- StorageManager recupera datos automáticamente
```

---

## 4. Requerimientos No Funcionales por Caso de Uso

### Performance
- Cargar quiz.json en < 500ms
- Renderizar dashboard en < 1s
- Respuesta interactiva en < 100ms

### Accesibilidad
- Todos los botones activables por teclado
- Contraste mínimo 4.5:1
- Mensajes de error claros

### Compatibilidad
- Funciona en Chrome, Firefox, Safari, Edge
- Responsive desde 320px
- Soporte móvil total

---

## 5. Flujo de Navegación Global

```
[Inicio] ↓
  ├→ [Quiz] → [Resultados] → [Dashboard]
  ├→ [Phishing] → [Resultados] → [Dashboard]
  ├→ [Crucigrama] → [Resultados] → [Dashboard]
  ├→ [Módulos] → [Dashboard]
  └→ [Recursos]
     ├→ [Glosario]
     ├→ [Guías]
     ├→ [FAQ]
     └→ [Certificado]
```

---

**Última actualización**: 2026-06-23
**Versión**: 1.0.0
