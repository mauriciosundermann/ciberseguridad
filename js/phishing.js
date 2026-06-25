/**
 * phishing.js - Detector Interactivo de Phishing
 * 
 * Módulo que permite a los usuarios identificar elementos
 * sospechosos en correos electrónicos fraudulentos.
 * 
 * @module phishing
 * @author CiberSegura Team
 * @version 1.0.0
 */

class PhishingGame {
  /**
   * Constructor del Detector de Phishing
   * @param {string} containerId - ID del elemento contenedor
   * @param {string} dataPath - Ruta del archivo phishing.json
   */
  constructor(containerId = 'app', dataPath = '/data/phishing.json') {
    this.container = document.getElementById(containerId);
    this.dataPath = dataPath;
    this.correos = [];
    this.correoActual = null;
    this.indexCorreoActual = 0;
    this.elementosSeleccionados = [];
    this.respuestasUsuario = [];
    this.puntaje = 0;
    this.storageManager = StorageManager;
    this.estadoJuego = 'cargando'; // cargando, jugando, finalizado
  }

  /**
   * Inicia el juego de phishing
   */
  async iniciar() {
    this.estadoJuego = 'cargando';
    await this.cargarCorreos();
    this.prepararJuego();
    this.render();
  }

  /**
   * Carga los correos desde el archivo JSON
   * @private
   */
  async cargarCorreos() {
    try {
      const response = await fetch(this.dataPath);
      this.correos = await response.json();
      // Mezclar los correos
      this.correos = this.mezclarArray([...this.correos]);
    } catch (error) {
      console.error('Error al cargar phishing:', error);
      this.mostrarError('Error al cargar los correos de ejemplo');
    }
  }

  /**
   * Prepara el juego
   * @private
   */
  prepararJuego() {
    this.indexCorreoActual = 0;
    this.elementosSeleccionados = [];
    this.respuestasUsuario = [];
    this.puntaje = 0;
    this.estadoJuego = 'jugando';
  }

  /**
   * Mezcla un array
   * @private
   * @param {Array} array - Array a mezclar
   * @returns {Array} Array mezclado
   */
  mezclarArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /**
   * Obtiene el correo actual
   * @private
   * @returns {Object} Correo actual
   */
  getCorreoActual() {
    return this.correos[this.indexCorreoActual];
  }

  /**
   * Renderiza el juego
   */
  render() {
    if (this.estadoJuego === 'cargando') {
      this.renderCargando();
    } else if (this.estadoJuego === 'jugando') {
      this.renderCorreo();
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
          <p>Cargando correos...</p>
        </div>
      </div>
    `;
  }

  /**
   * Renderiza el correo actual para análisis
   * @private
   */
  renderCorreo() {
    const correo = this.getCorreoActual();
    const totalCorreos = this.correos.length;
    const numeroCorreo = this.indexCorreoActual + 1;
    const riesgoClase = `riesgo-${correo.riesgo}`;
    const riesgoTexto = {
      'bajo': '🟢 Bajo',
      'medio': '🟡 Medio',
      'alto': '🔴 Alto',
      'muy_alto': '🔴🔴 Muy Alto'
    };

    const phishingHTML = `
      <div class="game-container">
        <div class="game-header">
          <h1 class="game-title">🕵️ Detector de Phishing</h1>
          <div class="game-instructions">
            Analiza este correo y marca los elementos que consideres sospechosos
          </div>
          <div class="game-progress">
            <span>Correo ${numeroCorreo} de ${totalCorreos}</span>
            <span>${Math.round((numeroCorreo / totalCorreos) * 100)}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${(numeroCorreo / totalCorreos) * 100}%"></div>
          </div>
        </div>

        <!-- Simulación de correo -->
        <div class="email-container">
          <div class="email-header">
            <div class="email-from">De: ${correo.remitente}</div>
            <div class="email-subject">Asunto: ${correo.asunto}</div>
          </div>
          <div class="email-body">${correo.cuerpo}</div>
        </div>

        <!-- Elementos seleccionables -->
        <div class="suspicious-elements">
          <h3 class="elements-title">Marca los elementos sospechosos:</h3>
          <div id="elementos-list">
            ${correo.elementos_sospechosos.map((elemento, index) => `
              <label class="element-check">
                <input type="checkbox" data-index="${index}" data-elemento="${elemento}">
                <span class="element-text">${elemento}</span>
                <span class="element-icon">✓</span>
              </label>
            `).join('')}
          </div>
        </div>

        <!-- Info adicional sobre riesgo -->
        <div style="padding: 16px; background: #f0f0f0; border-radius: 8px; margin: 16px 0;">
          <strong>Nivel de Riesgo Estimado:</strong> ${riesgoTexto[correo.riesgo] || 'Desconocido'}
        </div>

        <div class="game-buttons">
          <button class="btn btn-primary" id="btn-verificar">
            ✓ Verificar Respuesta
          </button>
          <button class="btn btn-outline" id="btn-volver">
            ← Volver al Dashboard
          </button>
        </div>

        <div id="feedback-container"></div>
      </div>
    `;

    this.container.innerHTML = phishingHTML;
    this.attachEventListeners();
  }

  /**
   * Renderiza los resultados finales
   * @private
   */
  renderResultados() {
    const totalCorreos = this.correos.length;
    const porcentaje = Math.round((this.puntaje / totalCorreos) * 100);

    let mensaje = '';
    let icono = '';

    if (porcentaje >= 80) {
      mensaje = '¡Excelente! Eres muy bueno detectando phishing';
      icono = '🌟';
    } else if (porcentaje >= 60) {
      mensaje = '¡Bien! Detectaste la mayoría de los intentos de phishing';
      icono = '⭐';
    } else {
      mensaje = 'Necesitas entrenar más para detectar phishing';
      icono = '📚';
    }

    const resultadosHTML = `
      <div class="game-container">
        <div class="quiz-results">
          <h1 class="results-title">${icono} ¡Análisis Completado!</h1>
          <div class="score-display">${this.puntaje}/${totalCorreos}</div>
          <div class="score-label">${porcentaje}% - ${mensaje}</div>

          <div class="results-summary">
            <div class="summary-item">
              <span>Correos Analizados Correctamente:</span>
              <strong>${this.puntaje}</strong>
            </div>
            <div class="summary-item">
              <span>Correos Analizados Incorrectamente:</span>
              <strong>${totalCorreos - this.puntaje}</strong>
            </div>
            <div class="summary-item">
              <span>Precisión:</span>
              <strong>${porcentaje}%</strong>
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

    // Adjuntar listeners
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
   * Adjunta event listeners
   * @private
   */
  attachEventListeners() {
    const btnVerificar = document.getElementById('btn-verificar');
    const btnVolver = document.getElementById('btn-volver');
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    // Marcar/desmarcar elementos
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        const label = checkbox.closest('.element-check');
        if (checkbox.checked) {
          label.style.background = 'rgba(211, 57, 39, 0.1)';
        } else {
          label.style.background = '';
        }
      });
    });

    btnVerificar.addEventListener('click', () => this.verificarRespuesta());
    btnVolver.addEventListener('click', () => {
      if (window.app && window.app.goToSection) {
        window.app.goToSection('inicio');
      }
    });
  }

  /**
   * Verifica la respuesta del usuario
   * @private
   */
  verificarRespuesta() {
    const correo = this.getCorreoActual();
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const elementosSeleccionados = Array.from(checkboxes).map(cb => cb.dataset.elemento);

    // Evaluar respuesta
    const esCorrect = this.evaluarSeleccion(
      elementosSeleccionados,
      correo.elementos_sospechosos
    );

    if (esCorrect) {
      this.puntaje++;
    }

    // Guardar respuesta
    this.respuestasUsuario.push({
      correoIndex: this.indexCorreoActual,
      respuesta: elementosSeleccionados,
      correcta: esCorrect
    });

    // Mostrar retroalimentación
    this.mostrarRetroalimentacion(esCorrect, correo);

    // Mostrar botón siguiente
    const btnVerificar = document.getElementById('btn-verificar');
    btnVerificar.style.display = 'none';

    const btnSiguiente = document.createElement('button');
    btnSiguiente.className = 'btn btn-primary';
    btnSiguiente.textContent = 'Siguiente Correo →';
    btnSiguiente.id = 'btn-siguiente';
    btnSiguiente.addEventListener('click', () => this.siguienteCorreo());
    document.querySelector('.game-buttons').insertBefore(btnSiguiente, btnVerificar.nextSibling);
  }

  /**
   * Evalúa si la selección es correcta
   * @private
   * @param {Array} seleccionado - Elementos seleccionados por el usuario
   * @param {Array} correcto - Elementos correctos
   * @returns {boolean} True si la evaluación es correcta
   */
  evaluarSeleccion(seleccionado, correcto) {
    // Debe seleccionar al menos 1 elemento
    if (seleccionado.length === 0) {
      return false;
    }

    // Todos los seleccionados deben estar en los correctos
    const todosCorrecto = seleccionado.every(item => correcto.includes(item));

    // Debe haber seleccionado la mayoría de los elementos correctos
    const mayoriaCorrecto = seleccionado.length >= Math.ceil(correcto.length * 0.7);

    return todosCorrecto && mayoriaCorrecto;
  }

  /**
   * Muestra retroalimentación sobre la respuesta
   * @private
   * @param {boolean} esCorrect - Si la respuesta es correcta
   * @param {Object} correo - Correo actual
   */
  mostrarRetroalimentacion(esCorrect, correo) {
    const container = document.getElementById('feedback-container');
    const clase = esCorrect ? 'success' : 'error';
    const titulo = esCorrect ? '✓ ¡Análisis Correcto!' : '✗ Análisis Incompleto';

    const feedbackHTML = `
      <div class="feedback ${clase}">
        <div class="feedback-title">${titulo}</div>
        <div class="feedback-text">
          <strong>Explicación:</strong><br>
          ${correo.explicacion}
          <br><br>
          <strong>Elementos Sospechosos:</strong>
          <ul>
            ${correo.elementos_sospechosos.map(e => `<li>${e}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;

    container.innerHTML = feedbackHTML;
  }

  /**
   * Avanza al siguiente correo
   * @private
   */
  siguienteCorreo() {
    this.indexCorreoActual++;

    if (this.indexCorreoActual < this.correos.length) {
      this.renderCorreo();
    } else {
      this.estadoJuego = 'finalizado';
      this.render();
    }
  }

  /**
   * Registra el resultado en LocalStorage
   * @private
   */
  registrarResultado() {
    const totalCorreos = this.correos.length;
    const puntos = Math.round((this.puntaje / totalCorreos) * 100);

    // Registrar actividad
    this.storageManager.registerActivity({
      tipo: 'phishing',
      puntos: puntos,
      detalles: {
        correctos: this.puntaje,
        totales: totalCorreos,
        porcentaje: Math.round((this.puntaje / totalCorreos) * 100)
      }
    });

    // Verificar logro "Phishing Master"
    const user = this.storageManager.getUser();
    if (user.estadisticas.phishing >= 10) {
      this.storageManager.unlockAchievement('phishing-master');
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
  module.exports = PhishingGame;
}
