/**
 * crossword.js - Juego de Crucigrama de Ciberseguridad
 * 
 * Módulo interactivo para resolver crucigramas con términos
 * relacionados con ciberseguridad.
 * 
 * @module crossword
 * @author CiberSegura Team
 * @version 1.0.0
 */

class CrosswordGame {
  /**
   * Constructor del Crucigrama
   * @param {string} containerId - ID del elemento contenedor
   * @param {string} dataPath - Ruta del archivo crossword.json
   */
  constructor(containerId = 'app', dataPath = '/data/crossword.json') {
    this.container = document.getElementById(containerId);
    this.dataPath = dataPath;
    this.crucigramas = [];
    this.crucigrama = null;
    this.indexCrucigrama = 0;
    this.respuestas = {};
    this.puntaje = 0;
    this.storageManager = StorageManager;
    this.estadoJuego = 'cargando';
  }

  /**
   * Inicia el juego de crucigramas
   */
  async iniciar() {
    this.estadoJuego = 'cargando';
    await this.cargarCrucigramas();
    this.prepararJuego();
    this.render();
  }

  /**
   * Carga los crucigramas desde JSON
   * @private
   */
  async cargarCrucigramas() {
    try {
      const response = await fetch(this.dataPath);
      this.crucigramas = await response.json();
    } catch (error) {
      console.error('Error al cargar crucigramas:', error);
      this.mostrarError('Error al cargar los crucigramas');
    }
  }

  /**
   * Prepara el juego
   * @private
   */
  prepararJuego() {
    this.indexCrucigrama = 0;
    this.respuestas = {};
    this.puntaje = 0;
    this.estadoJuego = 'jugando';
  }

  /**
   * Obtiene el crucigrama actual
   * @private
   * @returns {Object} Crucigrama actual
   */
  getCrucigrama() {
    return this.crucigramas[this.indexCrucigrama];
  }

  /**
   * Renderiza el juego
   */
  render() {
    if (this.estadoJuego === 'cargando') {
      this.renderCargando();
    } else if (this.estadoJuego === 'jugando') {
      this.renderCrucigrama();
    } else if (this.estadoJuego === 'finalizado') {
      this.renderResultados();
    }
  }

  /**
   * Renderiza pantalla de carga
   * @private
   */
  renderCargando() {
    this.container.innerHTML = `
      <div class="game-container">
        <div style="text-align: center; padding: 40px;">
          <div style="font-size: 32px; margin-bottom: 20px;">⏳</div>
          <p>Cargando crucigramas...</p>
        </div>
      </div>
    `;
  }

  /**
   * Renderiza el crucigrama actual
   * @private
   */
  renderCrucigrama() {
    this.crucigrama = this.getCrucigrama();
    const totalCrucigramas = this.crucigramas.length;
    const numeroCrucigrama = this.indexCrucigrama + 1;

    // Generar grid
    const gridHTML = this.generarGrid();

    // Separar pistas en horizontal y vertical
    const { horizontal, vertical } = this.agruparPistas();

    const crosswordHTML = `
      <div class="game-container">
        <div class="game-header">
          <h1 class="game-title">✏️ Crucigrama de Ciberseguridad</h1>
          <div class="game-instructions">
            Completa todas las palabras usando las pistas proporcionadas
          </div>
          <div class="game-progress">
            <span>Crucigrama ${numeroCrucigrama} de ${totalCrucigramas}</span>
            <span>${Math.round((numeroCrucigrama / totalCrucigramas) * 100)}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${(numeroCrucigrama / totalCrucigramas) * 100}%"></div>
          </div>
        </div>

        <!-- Grid del Crucigrama -->
        <div style="text-align: center; margin: 20px 0;">
          ${gridHTML}
        </div>

        <!-- Pistas -->
        <div class="crossword-clues">
          <div class="clues-section">
            <div class="clues-title">→ Horizontales</div>
            ${horizontal.map(p => `
              <div class="clue-item">
                <span class="clue-number">${p.numero}</span>
                <span class="clue-text">${p.pista}</span>
              </div>
            `).join('')}
          </div>

          <div class="clues-section">
            <div class="clues-title">↓ Verticales</div>
            ${vertical.map(p => `
              <div class="clue-item">
                <span class="clue-number">${p.numero}</span>
                <span class="clue-text">${p.pista}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="game-buttons">
          <button class="btn btn-primary" id="btn-verificar">
            ✓ Verificar Respuesta
          </button>
          <button class="btn btn-secondary" id="btn-limpiar">
            🔄 Limpiar Todo
          </button>
          <button class="btn btn-outline" id="btn-volver">
            ← Volver al Dashboard
          </button>
        </div>

        <div id="feedback-container"></div>
      </div>
    `;

    this.container.innerHTML = crosswordHTML;
    this.attachEventListeners();
  }

  /**
   * Genera el grid HTML del crucigrama
   * @private
   * @returns {string} HTML del grid
   */
  generarGrid() {

    let maxRow = 0;
    let maxCol = 0;

    this.crucigrama.palabras.forEach(palabra => {

      const finFila =
        palabra.orientacion === 'vertical'
          ? palabra.fila + palabra.palabra.length - 1
          : palabra.fila;

      const finCol =
        palabra.orientacion === 'horizontal'
          ? palabra.columna + palabra.palabra.length - 1
          : palabra.columna;

      maxRow = Math.max(maxRow, finFila);
      maxCol = Math.max(maxCol, finCol);
    });

    const usadas = {};

    this.crucigrama.palabras.forEach(palabra => {

      let row = palabra.fila;
      let col = palabra.columna;

      for (let i = 0; i < palabra.palabra.length; i++) {

        usadas[`${row}-${col}`] = true;

        if (palabra.orientacion === 'horizontal') {
          col++;
        } else {
          row++;
        }
      }
    });

    let grid = `
        <div class="crossword-wrapper">
            <div class="column-labels">
    `;

    for (let c = 1; c <= maxCol; c++) {
      grid += `<div class="coord">${c}</div>`;
    }

    grid += `
            </div>
            <div class="crossword-grid">
    `;

    for (let row = 1; row <= maxRow; row++) {

      grid += `
            <div class="crossword-row">
                <div class="row-label">${row}</div>
        `;

      for (let col = 1; col <= maxCol; col++) {

        const key = `${row}-${col}`;

        if (!usadas[key]) {

          grid += `
                    <div class="crossword-empty"></div>
                `;

          continue;
        }

        const inicio =
          this.crucigrama.palabras.find(
            p =>
              p.fila === row &&
              p.columna === col
          );

        grid += `
                <div class="crossword-cell">

                    ${inicio
            ? `<span class="crossword-number">
                                ${inicio.posicion.split('-')[0]}
                              </span>`
            : ''
          }

                    <input
                        type="text"
                        maxlength="1"
                        data-row="${row}"
                        data-col="${col}"
                    >

                </div>
            `;
      }

      grid += `</div>`;
    }

    grid += `
            </div>
        </div>
    `;

    return grid;
  }

  /**
   * Agrupa pistas por orientación
   * @private
   * @returns {Object} Pistas agrupadas
   */
  agruparPistas() {
    const horizontal = [];
    const vertical = [];
    let numH = 1, numV = 1;

    this.crucigrama.palabras.forEach(palabra => {
      if (palabra.orientacion === 'horizontal') {
        horizontal.push({
          numero: numH++,
          pista: palabra.pista
        });
      } else {
        vertical.push({
          numero: numV++,
          pista: palabra.pista
        });
      }
    });

    return { horizontal, vertical };
  }

  /**
   * Adjunta event listeners
   * @private
   */
  attachEventListeners() {
    const inputs = document.querySelectorAll('.crossword-cell input');
    const btnVerificar = document.getElementById('btn-verificar');
    const btnLimpiar = document.getElementById('btn-limpiar');
    const btnVolver = document.getElementById('btn-volver');

    // Manejar entrada de datos
    inputs.forEach(input => {

      input.addEventListener('input', e => {

        e.target.value =
          e.target.value.toUpperCase();

        const siguiente =
          this.getNextCell(e.target);

        if (
          e.target.value &&
          siguiente
        ) {
          siguiente.focus();
        }

        this.guardarProgreso();
      });

      input.addEventListener('keydown', e => {

        const row =
          parseInt(e.target.dataset.row);

        const col =
          parseInt(e.target.dataset.col);

        if (
          e.key === 'Backspace' &&
          !e.target.value
        ) {

          const anterior =
            document.querySelector(
              `[data-row="${row}"][data-col="${col - 1}"]`
            );

          if (anterior) {
            anterior.focus();
          }
        }
      });
    });

    btnVerificar.addEventListener('click', () => this.verificarRespuesta());
    btnLimpiar.addEventListener('click', () => {
      inputs.forEach(input => input.value = '');
      inputs[0].focus();
    });
    btnVolver.addEventListener('click', () => {
      if (window.app && window.app.goToSection) {
        window.app.goToSection('inicio');
      }
    });
  }

  /**
   * Verifica la respuesta
   * @private
   */
  verificarRespuesta() {

    let correctas = 0;

    this.crucigrama.palabras.forEach(palabra => {

      const esCorrecta =
        this.verificarPalabra(palabra);

      let row = palabra.fila;
      let col = palabra.columna;

      for (let i = 0; i < palabra.palabra.length; i++) {

        const input =
          document.querySelector(
            `[data-row="${row}"][data-col="${col}"]`
          );

        input.classList.remove(
          'correct',
          'incorrect'
        );

        input.classList.add(
          esCorrecta
            ? 'correct'
            : 'incorrect'
        );

        if (palabra.orientacion === 'horizontal') {
          col++;
        } else {
          row++;
        }
      }

      if (esCorrecta) {
        correctas++;
      }
    });

    const completo =
      correctas ===
      this.crucigrama.palabras.length;

    if (completo) {

      this.puntaje += 50;

      this.mostrarRetroalimentacion(true);

    } else {

      this.mostrarRetroalimentacion(false);
    }
  }

  /**
   * Verifica una celda individual
   * @private
   * @param {number} row - Fila
   * @param {number} col - Columna
   * @param {string} valor - Valor ingresado
   * @returns {boolean} True si es correcto
   */
  verificarPalabra(palabra) {

    let respuesta = '';

    let row = palabra.fila;
    let col = palabra.columna;

    for (let i = 0; i < palabra.palabra.length; i++) {

      const input =
        document.querySelector(
          `[data-row="${row}"][data-col="${col}"]`
        );

      respuesta +=
        (input?.value || '').toUpperCase();

      if (palabra.orientacion === 'horizontal') {
        col++;
      } else {
        row++;
      }
    }

    return this.normalizarTexto(respuesta) ===
      this.normalizarTexto(palabra.palabra);
  }

  /**
   * Muestra retroalimentación
   * @private
   * @param {boolean} esCorrect - Si es correcto
   */
  mostrarRetroalimentacion(esCorrect) {
    const container = document.getElementById('feedback-container');
    if (esCorrect) {
      container.innerHTML = `
        <div class="feedback success">
          <div class="feedback-title">✓ ¡Crucigrama Completado!</div>
          <div class="feedback-text">
            ¡Excelente! Has completado el crucigrama correctamente. +50 puntos
          </div>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="feedback error">
          <div class="feedback-title">✗ Respuestas Incompletas</div>
          <div class="feedback-text">
            Verifica que todas las palabras estén correctas
          </div>
        </div>
      `;
    }
  }

  /**
   * Avanza al siguiente crucigrama
   * @private
   */
  siguienteCrucigrama() {
    this.indexCrucigrama++;

    if (this.indexCrucigrama < this.crucigramas.length) {
      this.renderCrucigrama();
    } else {
      this.estadoJuego = 'finalizado';
      this.render();
    }
  }

  /**
   * Renderiza resultados finales
   * @private
   */
  renderResultados() {
    const totalCrucigramas = this.crucigramas.length;

    const resultadosHTML = `
      <div class="game-container">
        <div class="quiz-results">
          <h1 class="results-title">✏️ ¡Crucigramas Completados!</h1>
          <div class="score-display">${this.puntaje} puntos</div>
          <div class="score-label">¡Excelente desempeño!</div>

          <div class="results-summary">
            <div class="summary-item">
              <span>Crucigramas Completados:</span>
              <strong>${totalCrucigramas}</strong>
            </div>
            <div class="summary-item">
              <span>Puntos Ganados:</span>
              <strong>${this.puntaje}</strong>
            </div>
          </div>

          <div class="game-buttons">
            <button class="btn btn-primary" id="btn-repetir">
              🔄 Intentar de Nuevo
            </button>
            <button class="btn btn-secondary" id="btn-dashboard">
              📊 Volver al Dashboard
            </button>
          </div>
        </div>
      </div>
    `;

    this.container.innerHTML = resultadosHTML;

    // Registrar resultado
    this.registrarResultado();

    const btnRepetir = document.getElementById('btn-repetir');
    const btnDashboard = document.getElementById('btn-dashboard');

    btnRepetir.addEventListener('click', () => this.iniciar());
    btnDashboard.addEventListener('click', () => {
      if (window.app && window.app.goToSection) {
        window.app.goToSection('inicio');
      }
    });
  }

  /**
   * Registra el resultado
   * @private
   */
  registrarResultado() {
    this.storageManager.registerActivity({
      tipo: 'crucigrama',
      puntos: this.puntaje,
      detalles: {
        crucigramas: this.indexCrucigrama
      }
    });

    // Verificar logro
    const user = this.storageManager.getUser();
    if (user.estadisticas.crucigrama >= 5) {
      this.storageManager.unlockAchievement('crucigrama-pro');
    }
  }

  /**
   * Muestra un mensaje de error
   * @private
   * @param {string} mensaje - Mensaje de error
   */
  mostrarError(mensaje) {
    this.container.innerHTML = `
      <div class="game-container">
        <div style="text-align: center; padding: 40px;">
          <div style="font-size: 32px; margin-bottom: 20px;">❌</div>
          <p>${mensaje}</p>
          <button class="btn btn-primary" onclick="location.reload()">
            Reintentar
          </button>
        </div>
      </div>
    `;
  }

  normalizarTexto(texto) {

    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase();
  }

  getNextCell(currentInput) {

    const row =
      parseInt(currentInput.dataset.row);

    const col =
      parseInt(currentInput.dataset.col);

    const palabra =
      this.obtenerPalabraActiva(row, col);

    if (!palabra) return null;

    let nextRow = row;
    let nextCol = col;

    if (palabra.orientacion === 'horizontal') {

      nextCol++;

    } else {

      nextRow++;
    }

    return document.querySelector(
      `[data-row="${nextRow}"][data-col="${nextCol}"]`
    );
  }

  obtenerPalabraActiva(row, col) {

    return this.crucigrama.palabras.find(p => {

      if (p.orientacion === 'horizontal') {

        return (
          row === p.fila &&
          col >= p.columna &&
          col < p.columna + p.palabra.length
        );
      }

      return (
        col === p.columna &&
        row >= p.fila &&
        row < p.fila + p.palabra.length
      );
    });
  }

}

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CrosswordGame;
}
