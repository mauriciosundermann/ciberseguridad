# Diagramas de Arquitectura - CiberSegura

## 1. Diagrama de Arquitectura General

```mermaid
graph TB
    Usuario["👤 Usuario (50+)"]
    HTML["📄 index.html"]
    CSS["🎨 CSS<br/>styles.css<br/>dashboard.css<br/>games.css"]
    JS["⚙️ JavaScript Módulos"]
    Storage["💾 LocalStorage<br/>Browser API"]
    JSON["📊 JSON Data Files"]
    
    Usuario -->|Abre| HTML
    HTML -->|Carga| CSS
    HTML -->|Carga| JS
    JS -->|Lee/Escribe| Storage
    JS -->|Carga| JSON
    
    classDef client fill:#e1f5ff
    classDef data fill:#f3e5f5
    classDef user fill:#fff3e0
    
    class HTML,CSS,JS client
    class Storage,JSON data
    class Usuario user
```

---

## 2. Arquitectura de Módulos JavaScript

```mermaid
graph LR
    app["📱 app.js<br/>Orquestador"]
    storage["💾 storage.js<br/>StorageManager"]
    dashboard["📊 dashboard.js<br/>Dashboard"]
    quiz["📝 quiz.js<br/>QuizGame"]
    phishing["🕵️ phishing.js<br/>PhishingGame"]
    crossword["✏️ crossword.js<br/>CrosswordGame"]
    
    app -->|Usa| storage
    app -->|Instancia| dashboard
    app -->|Instancia| quiz
    app -->|Instancia| phishing
    app -->|Instancia| crossword
    
    dashboard -->|Usa| storage
    quiz -->|Usa| storage
    phishing -->|Usa| storage
    crossword -->|Usa| storage
    
    classDef core fill:#1a73e8,stroke:#1a73e8,color:#fff
    classDef game fill:#2e7d32,stroke:#2e7d32,color:#fff
    classDef util fill:#7b1fa2,stroke:#7b1fa2,color:#fff
    
    class app core
    class quiz,phishing,crossword game
    class storage,dashboard util
```

---

## 3. Flujo de Ciclo de Vida de una Actividad

```mermaid
sequenceDiagram
    participant User as 👤 Usuario
    participant App as app.js
    participant Game as Game Class
    participant Storage as StorageManager
    participant Browser as Browser Storage
    
    User->>App: Hace clic en actividad
    activate App
    App->>App: goToSection()
    App->>Game: new Game()
    activate Game
    App->>Game: iniciar()
    Game->>Game: cargarDatos()
    Game->>Game: render()
    deactivate App
    
    loop Interacción
        User->>Game: Responde pregunta
        Game->>Game: validar()
        Game->>Game: renderRetroalimentacion()
    end
    
    User->>Game: Termina actividad
    Game->>Game: registrarResultado()
    Game->>Storage: addPuntos()
    activate Storage
    Storage->>Browser: setItem()
    deactivate Storage
    
    Storage->>Storage: getNivelActual()
    alt Logro desbloqueado
        Storage->>Storage: unlockAchievement()
        Storage->>Browser: setItem()
        Game->>User: Mostrar alerta
    end
    
    Game->>User: Mostrar resultados
    User->>App: Volver al dashboard
    deactivate Game
    App->>App: showDashboard()
```

---

## 4. Estado Global del Usuario

```mermaid
graph TB
    User["Usuario"]
    
    User -->|puntajeTotal| Points["Puntos<br/>0-∞"]
    User -->|nivel| Level["Nivel<br/>1-4"]
    User -->|logros| Achievements["Logros<br/>Array"]
    User -->|estadisticas| Stats["Estadísticas"]
    User -->|actividadesCompletadas| Activities["Actividades<br/>Array"]
    
    Level -->|Principiante| L1["0-100 pts"]
    Level -->|Intermedio| L2["101-250 pts"]
    Level -->|Avanzado| L3["251-500 pts"]
    Level -->|Experto| L4["500+ pts"]
    
    Achievements -->|A1| Ach1["Primer Quiz"]
    Achievements -->|A2| Ach2["Phishing Master"]
    Achievements -->|A3| Ach3["Crucigrama Pro"]
    Achievements -->|A4| Ach4["Estudiante Dedicado"]
    Achievements -->|A5| Ach5["Cibersegura"]
    
    Stats -->|Quiz| Q["Completados"]
    Stats -->|Phishing| P["Detectados"]
    Stats -->|Crucigrama| C["Resueltos"]
```

---

## 5. Diagrama de Flujo - Quiz

```mermaid
flowchart TD
    Start["Iniciar Quiz"]
    Load["Cargar preguntas.json"]
    Shuffle["Mezclar preguntas"]
    Display["Mostrar pregunta N"]
    User["Usuario elige opción"]
    Check{"¿Respuesta<br/>Correcta?"}
    Right["✓ Mostrar explicación"]
    Wrong["✗ Mostrar explicación"]
    Points["Sumar puntos"]
    Next{"¿Última<br/>pregunta?"}
    End["Mostrar resultados"]
    Save["Guardar en Storage"]
    Check_Achievement["Verificar logros"]
    
    Start --> Load
    Load --> Shuffle
    Shuffle --> Display
    Display --> User
    User --> Check
    Check -->|Sí| Right
    Check -->|No| Wrong
    Right --> Points
    Wrong --> Points
    Points --> Next
    Next -->|No| Display
    Next -->|Sí| End
    End --> Save
    Save --> Check_Achievement
    Check_Achievement --> Return["Volver al Dashboard"]
```

---

## 6. Diagrama de Flujo - Phishing Detector

```mermaid
flowchart TD
    Start["Iniciar Detector"]
    Load["Cargar correos.json"]
    Display["Mostrar correo N"]
    ShowElements["Mostrar elementos"]
    User["Usuario marca elementos"]
    Verify["Verificar selección"]
    Check{"¿≥70% correcto<br/>y SIN errores?"}
    Success["✓ Correcto"]
    Failure["✗ Intentar de nuevo"]
    Points["Sumar 50 pts"]
    Next{"¿Último<br/>correo?"}
    End["Mostrar resultados"]
    Save["Guardar resultado"]
    
    Start --> Load
    Load --> Display
    Display --> ShowElements
    ShowElements --> User
    User --> Verify
    Verify --> Check
    Check -->|Sí| Success
    Check -->|No| Failure
    Failure --> User
    Success --> Points
    Points --> Next
    Next -->|No| Display
    Next -->|Sí| End
    End --> Save
```

---

## 7. Diagrama de Flujo - Crucigrama

```mermaid
flowchart TD
    Start["Iniciar Crucigrama"]
    Load["Cargar crucigramas.json"]
    Render["Renderizar grid 15x15"]
    ShowClues["Mostrar pistas"]
    User["Usuario completa palabras"]
    Verify["Verificar todas las palabras"]
    Check{"¿Todas<br/>correctas?"}
    Incomplete["✗ Incompleto"]
    Complete["✓ Completado"]
    Points["Sumar 50 pts"]
    Next{"¿Último<br/>crucigrama?"}
    End["Mostrar puntos totales"]
    Save["Guardar resultado"]
    CheckAchieve["¿5 crucigramas?"]
    
    Start --> Load
    Load --> Render
    Render --> ShowClues
    ShowClues --> User
    User --> Verify
    Verify --> Check
    Check -->|No| Incomplete
    Incomplete --> User
    Check -->|Sí| Complete
    Complete --> Points
    Points --> Next
    Next -->|No| Render
    Next -->|Sí| End
    End --> Save
    Save --> CheckAchieve
```

---

## 8. Estructura de Datos LocalStorage

```mermaid
graph TB
    LS["LocalStorage<br/>cibersegura_usuario"]
    
    LS -->|usuario| Name["string"]
    LS -->|puntajeTotal| Score["number"]
    LS -->|nivel| Level["number 1-4"]
    LS -->|logros| Logros["array"]
    LS -->|actividadesCompletadas| Actvs["number"]
    LS -->|ultimaActividad| Last["timestamp"]
    LS -->|estadisticas| Stats["object"]
    LS -->|progreso| Prog["object"]
    
    Stats -->|quiz| SQ["number"]
    Stats -->|crucigrama| SC["number"]
    Stats -->|phishing| SP["number"]
    
    Prog -->|modulos| Mod["array"]
    Prog -->|actividadesRealizadas| AR["array"]
    
    Logros -->|L1| Pq["primer-quiz"]
    Logros -->|L2| Pm["phishing-master"]
    Logros -->|L3| Cp["crucigrama-pro"]
    Logros -->|L4| Ed["estudiante-dedicado"]
    Logros -->|L5| Cs["cibersegura"]
```

---

## 9. Responsividad - Diseño Adaptativo

```mermaid
graph TB
    Mobile["📱 Mobile<br/>≤480px"]
    Tablet["📱 Tablet<br/>480-768px"]
    Desktop["🖥️ Desktop<br/>≥768px"]
    
    Mobile -->|1 columna| Layout1["Sidebar colapsada<br/>Menu hamburguesa"]
    Tablet -->|2 columnas| Layout2["Sidebar flotante<br/>Grid 2"]
    Desktop -->|3+ columnas| Layout3["Sidebar fijo<br/>Grid 3-4"]
    
    Layout1 -->|Componentes| Mobile_Comp["Cards apiladas<br/>Botones 100% ancho<br/>Font 18px"]
    Layout2 -->|Componentes| Tablet_Comp["Cards 2x2<br/>Botones ajustados<br/>Font 16px"]
    Layout3 -->|Componentes| Desktop_Comp["Cards en grillas<br/>Botones normales<br/>Font 16px"]
```

---

## 10. Ciclo de Desbloqueo de Logros

```mermaid
graph TD
    Activity["Completar Actividad"]
    
    Activity -->|Quiz| Q["Contar Quiz"]
    Activity -->|Phishing| P["Contar Email"]
    Activity -->|Crucigrama| C["Contar Crucigrama"]
    Activity -->|Diario| D["Contar días"]
    
    Q -->|Primera vez| A1["Desbloquear<br/>Primer Quiz"]
    P -->|10 correctos| A2["Desbloquear<br/>Phishing Master"]
    C -->|5 completados| A3["Desbloquear<br/>Crucigrama Pro"]
    D -->|7 consecutivos| A4["Desbloquear<br/>Estudiante Dedicado"]
    
    A1 -->|+10 pts| Add
    A2 -->|+50 pts| Add
    A3 -->|+30 pts| Add
    A4 -->|+100 pts| Add
    
    Add["Sumar bonus<br/>a puntaje"]
    Add --> Update["Actualizar<br/>nivel si procede"]
    Update --> Show["Mostrar notificación"]
```

---

## 11. Stack Tecnológico

```mermaid
graph TB
    Client["🌐 Client Side"]
    
    Client -->|HTML| H["HTML5<br/>Semántico"]
    Client -->|CSS| C["CSS3<br/>Variables + Flexbox<br/>Grid"]
    Client -->|JS| J["Vanilla ES6+<br/>No frameworks"]
    
    J -->|Storage| S["LocalStorage API"]
    J -->|Async| A["Fetch API<br/>async/await"]
    
    Host["🔗 Hosting"]
    Host -->|GitHub Pages| GH["Static deployment<br/>No backend"]
    
    Browser["🎮 Browser APIs"]
    Browser -->|Storage| LS["localStorage"]
    Browser -->|Network| F["fetch()"]
    Browser -->|DOM| D["document API"]
```

---

**Última actualización**: 2026-06-23
**Versión**: 1.0.0
