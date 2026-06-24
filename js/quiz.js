/**
 * quiz.js - Gestor de Quiz de Ciberseguridad
 * 
 * Módulo responsable de cargar, mostrar y evaluar preguntas
 * del quiz sobre ciberseguridad.
 * 
 * @module quiz
 * @author CiberSegura Team
 * @version 1.0.0
 */

class QuizGame {
  /**
   * Constructor del Quiz
   * @param {string} containerId - ID del elemento contenedor
   * @param {string} dataPath - Ruta del archivo quiz.json
   */
  constructor(containerId = 'app', dataPath = '/data/quiz.json') {
    this.container = document.getElementById(containerId);
    this.dataPath = dataPath;
    this.preguntas = [];
    this.preguntasActuales = [];
    this.indicePregunta = 0;
    this.respuestasUsuario = [];
    this.puntaje = 0;
    this.storageManager = StorageManager;
    this.estadoJuego = 'cargando'; // cargando, jugando, finalizado
  }

  /**
   * Inicia el quiz cargando los datos
   */
  async iniciar() {
    this.estadoJuego = 'cargando';
    await this.cargarPreguntas();
    this.prepararJuego();
    this.render();
  }

  /**
   * Carga las preguntas desde el archivo JSON
   * @private
   */
  async cargarPreguntas() {
    try {
      const response = await fetch(this.dataPath);
      this.preguntas = await response.json();
      
      // Mezclar las preguntas aleatoriamente
      this.preguntasActuales = this.mezclarArray([...this.preguntas]);
    } catch (error) {
      console.error('Error al cargar quiz:', error);
      this.mostrarError('Error al cargar las preguntas');
    }
  }

  /**
   * Prepara el juego inicializando variables
   * @private
   */
  prepararJuego() {
    this.indicePregunta = 0;
    this.respuestasUsuario = [];
    this.puntaje = 0;
    this.estadoJuego = 'jugando';
  }

  /**
   * Mezcla un array usando el algoritmo de Fisher-Yates
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
   * Obtiene la pregunta actual
   * @private
   * @returns {Object} Pregunta actual
   */
  getPreguntaActual() {
    return this.preguntasActuales[this.indicePregunta];
  }

  /**
   * Renderiza el quiz completo
   */
  render() {
    if (this.estadoJuego === 'cargando') {
      this.renderCargando();
    } else if (this.estadoJuego === 'jugando') {
      this.renderPregunta();
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
          <p>Cargando quiz...</p>
        </div>
      </div>
    `;
  }

  /**
   * Renderiza la pregunta actual
   * @private
   */
  renderPregunta() {
    const pregunta = this.getPreguntaActual();
    const totalPreguntas = this.preguntasActuales.length;
    const numeroPregunta = this.indicePregunta + 1;

    const opcionesHTML = pregunta.opciones.map((opcion, index) => `
      <div class="option" data-index="${index}">
        <input type="radio" 
               id="option-${index}" 
               name="respuesta" 
               value="${index}"
               aria-label="Opción ${String.fromCharCode(65 + index)}">
        <label for="option-${index}">${opcion}</label>
      </div>
    `).join('');

    const dificultadClase = `dificultad-${pregunta.dificultad || 'facil'}`;

    const quizHTML = `
      <div class="game-container">
        <div class="game-header">
          <h1 class="game-title">📝 Quiz de Ciberseguridad</h1>
          <div class="game-progress">
            <span>Pregunta ${numeroPregunta} de ${totalPreguntas}</span>
            <span>${Math.round((numeroPregunta / totalPreguntas) * 100)}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${(numeroPregunta / totalPreguntas) * 100}%"></div>
          </div>
        </div>

        <div class="quiz-question">
          <div class="question-number">Pregunta ${numeroPregunta}</div>
          <h2 class="question-text">${pregunta.pregunta}</h2>
          <span class="question-difficulty">Dificultad: ${this.capitalizarPrimeraLetra(pregunta.dificultad)}</span>

          <div class="quiz-options" id="quiz-options">
            ${opcionesHTML}
          </div>

          <div id="feedback-container"></div>
        </div>

        <div class="game-buttons">
          <button class="btn btn-primary" id="btn-siguiente" style="display: none;">
            Siguiente →
          </button>
          <button class="btn btn-secondary" id="btn-responder">
            Responder
          </button>
          <button class="btn btn-outline" id="btn-volver">
            ← Volver al Dashboard
          </button>
        </div>
      </div>
    `;

    this.container.innerHTML = quizHTML;
    this.attachEventListeners();
  }

  /**
   * Renderiza los resultados finales del quiz
   * @private
   */
  renderResultados() {
    const totalPreguntas = this.preguntasActuales.length;
    const porcentaje = Math.round((this.puntaje / totalPreguntas) * 100);
    const esCorrecto = porcentaje >= 60;

    let mensaje = '';
    let icono = '';

    if (porcentaje >= 90) {
      mensaje = '¡Excelente! Eres un experto en ciberseguridad';
      icono = '🌟';
    } else if (porcentaje >= 75) {
      mensaje = '¡Muy bien! Tienes buenos conocimientos de ciberseguridad';
      icono = '⭐';
    } else if (porcentaje >= 60) {
      mensaje = 'Bien, pero puedes mejorar. ¡Intenta de nuevo!';
      icono = '👍';
    } else {
      mensaje = 'Necesitas estudiar más sobre ciberseguridad';
      icono = '📚';
    }

    const resultadosHTML = `
      <div class="game-container">
        <div class="quiz-results">
          <h1 class="results-title">${icono} ¡Quiz Completado!</h1>
          <div class="score-display">${this.puntaje}/${totalPreguntas}</div>
          <div class="score-label">${porcentaje}% - ${mensaje}</div>

          <div class="results-summary">
            <div class="summary-item">
              <span>Respuestas Correctas:</span>
              <strong>${this.puntaje}</strong>
            </div>
            <div class="summary-item">
              <span>Respuestas Incorrectas:</span>
              <strong>${totalPreguntas - this.puntaje}</strong>
            </div>
            <div class="summary-item">
              <span>Porcentaje de Acierto:</span>
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

    // Registrar actividad y validar logros
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
   * Adjunta event listeners a los controles del quiz
   * @private
   */
  attachEventListeners() {
    const btnResponder = document.getElementById('btn-responder');
    const btnSiguiente = document.getElementById('btn-siguiente');
    const btnVolver = document.getElementById('btn-volver');
    const opciones = document.querySelectorAll('.option');

    // Manejar selección de opciones
    opciones.forEach(opcion => {
      opcion.addEventListener('click', () => {
        opciones.forEach(o => o.classList.remove('selected'));
        opcion.classList.add('selected');
        opcion.querySelector('input[type="radio"]').checked = true;
      });
    });

    // Botón responder
    btnResponder.addEventListener('click', () => this.evaluarRespuesta());

    // Botón siguiente
    if (btnSiguiente) {
      btnSiguiente.addEventListener('click', () => this.siguientePregunta());
    }

    // Botón volver
    if (btnVolver) {
      btnVolver.addEventListener('click', () => {
        if (window.app && window.app.goToSection) {
          window.app.goToSection('inicio');
        }
      });
    }
  }

  /**
   * Evalúa la respuesta del usuario
   * @private
   */
  evaluarRespuesta() {
    const opciones = document.querySelectorAll('.option');
    const opcionSeleccionada = Array.from(opciones).find(o => 
      o.querySelector('input[type="radio"]').checked
    );

    if (!opcionSeleccionada) {
      alert('Por favor, selecciona una opción');
      return;
    }

    const pregunta = this.getPreguntaActual();
    const indexRespuesta = parseInt(opcionSeleccionada.dataset.index);
    const esCorrect = indexRespuesta === pregunta.respuesta_correcta;

    // Guardar respuesta
    this.respuestasUsuario.push({
      preguntaIndex: this.indicePregunta,
      respuesta: indexRespuesta,
      correcta: esCorrect
    });

    if (esCorrect) {
      this.puntaje++;
    }

    // Mostrar retroalimentación
    this.mostrarRetroalimentacion(esCorrect, pregunta);

    // Mostrar siguiente botón
    const btnResponder = document.getElementById('btn-responder');
    const btnSiguiente = document.getElementById('btn-siguiente');

    btnResponder.style.display = 'none';
    btnSiguiente.style.display = 'inline-flex';
  }

  /**
   * Muestra la retroalimentación de la respuesta
   * @private
   * @param {boolean} esCorrect - Si la respuesta es correcta
   * @param {Object} pregunta - Objeto de la pregunta
   */
  mostrarRetroalimentacion(esCorrect, pregunta) {
    const container = document.getElementById('feedback-container');
    const clase = esCorrect ? 'success' : 'error';
    const titulo = esCorrect ? '✓ ¡Correcto!' : '✗ Respuesta Incorrecta';

    const feedbackHTML = `
      <div class="feedback ${clase}">
        <div class="feedback-title">${titulo}</div>
        <div class="feedback-text">
          ${pregunta.explicacion}
        </div>
      </div>
    `;

    container.innerHTML = feedbackHTML;

    // Marcar opciones correctamente e incorrectamente
    const opciones = document.querySelectorAll('.option');
    opciones.forEach((opcion, index) => {
      opcion.style.pointerEvents = 'none';
      if (index === pregunta.respuesta_correcta) {
        opcion.classList.add('correct');
      } else if (index === parseInt(opcion.dataset.index) && !esCorrect) {
        opcion.classList.add('incorrect');
      }
    });
  }

  /**
   * Avanza a la siguiente pregunta
   * @private
   */
  siguientePregunta() {
    this.indicePregunta++;

    if (this.indicePregunta < this.preguntasActuales.length) {
      this.renderPregunta();
    } else {
      this.estadoJuego = 'finalizado';
      this.render();
    }
  }

  /**
   * Registra el resultado del quiz en LocalStorage
   * @private
   */
  registrarResultado() {
    const totalPreguntas = this.preguntasActuales.length;
    const puntos = Math.round((this.puntaje / totalPreguntas) * 100);

    // Registrar actividad
    this.storageManager.registerActivity({
      tipo: 'quiz',
      puntos: puntos,
      detalles: {
        correctas: this.puntaje,
        totales: totalPreguntas,
        porcentaje: Math.round((this.puntaje / totalPreguntas) * 100)
      }
    });

    // Verificar logro "Primer Quiz"
    const user = this.storageManager.getUser();
    if (user.estadisticas.quiz === 1) {
      this.storageManager.unlockAchievement('primer-quiz');
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

  /**
   * Capitaliza la primera letra de un string
   * @private
   * @param {string} str - String a capitalizar
   * @returns {string} String capitalizado
   */
  capitalizarPrimeraLetra(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
  }
}

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = QuizGame;
}
