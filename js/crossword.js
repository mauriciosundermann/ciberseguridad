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
    // Crear matriz vacía (max 15x15)
    const size = 15;
    const matrix = Array(size).fill(null).map(() => Array(size).fill('black'));

    // Colocar palabras
    this.crucigrama.palabras.forEach(palabra => {
      let row = palabra.fila - 1;
      let col = palabra.columna - 1;

      for (let char of palabra.palabra) {
        matrix[row][col] = char;
        if (palabra.orientacion === 'horizontal') {
          col++;
        } else {
          row++;
        }
      }
    });

    // Generar HTML
    let grid = '<div class="crossword-grid">';
    for (let i = 0; i < size; i++) {
      grid += '<div class="crossword-row">';
      for (let j = 0; j < size; j++) {
        if (matrix[i][j] === 'black') {
          grid += '<div class="crossword-cell black"></div>';
        } else {
          const id = `cell-${i}-${j}`;
          grid += `
            <div class="crossword-cell">
              <input type="text" 
                     id="${id}" 
                     maxlength="1" 
                     data-row="${i}" 
                     data-col="${j}"
                     autocomplete="off">
            </div>
          `;
        }
      }
      grid += '</div>';
    }
    grid += '</div>';

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
    inputs.forEach((input, index) => {
      input.addEventListener('input', (e) => {
        e.target.value = e.target.value.toUpperCase();

        // Mover al siguiente input automáticamente
        if (e.target.value.length === 1 && index < inputs.length - 1) {
          inputs[index + 1].focus();
        }
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
          inputs[index - 1].focus();
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
    const inputs = document.querySelectorAll('.crossword-cell input');
    let respuestasCorrectas = 0;
    let totalPalabras = this.crucigrama.palabras.length;

    inputs.forEach(input => {
      const valor = input.value.toUpperCase();
      if (valor) {
        const row = parseInt(input.dataset.row);
        const col = parseInt(input.dataset.col);

        // Verificar si es correcto
        const esCorrect = this.verificarCelda(row, col, valor);
        if (esCorrect) {
          input.classList.add('correct');
          respuestasCorrectas++;
        } else {
          input.classList.add('incorrect');
        }
      }
    });

    // Calcular puntuación
    const esCompleto = respuestasCorrectas === inputs.length && inputs.length > 0;

    if (esCompleto) {
      this.puntaje += 50;
      this.mostrarRetroalimentacion(true);
    } else {
      this.mostrarRetroalimentacion(false);
    }

    // Crear botón siguiente
    const btnVerificar = document.getElementById('btn-verificar');
    if (esCompleto) {
      btnVerificar.style.display = 'none';
      const btnSiguiente = document.createElement('button');
      btnSiguiente.className = 'btn btn-primary';
      btnSiguiente.textContent = 'Siguiente →';
      btnSiguiente.id = 'btn-siguiente';
      btnSiguiente.addEventListener('click', () => this.siguienteCrucigrama());
      document.querySelector('.game-buttons').insertBefore(btnSiguiente, btnVerificar.nextSibling);
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
  verificarCelda(row, col, valor) {
    // Buscar la palabra que contiene esta celda
    for (let palabra of this.crucigrama.palabras) {
      let r = palabra.fila - 1;
      let c = palabra.columna - 1;

      for (let i = 0; i < palabra.palabra.length; i++) {
        if (r === row && c === col) {
          return palabra.palabra[i].toUpperCase() === valor;
        }

        if (palabra.orientacion === 'horizontal') {
          c++;
        } else {
          r++;
        }
      }
    }

    return false;
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
}

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CrosswordGame;
}
