/**
 * app.js - Aplicación Principal de CiberSegura
 * 
 * Módulo orquestador que coordina la navegación y el flujo
 * de la aplicación de ciberseguridad.
 * 
 * @module app
 * @author CiberSegura Team
 * @version 1.0.0
 */

class CiberSeguraApp {
  /**
   * Constructor de la aplicación
   * @param {string} containerId - ID del elemento contenedor principal
   */
  constructor(containerId = 'app') {
    this.appContainer = document.getElementById(containerId);
    this.currentSection = 'inicio';
    this.dashboard = null;
    this.quizGame = null;
    this.phishingGame = null;
    this.crosswordGame = null;
    this.storageManager = StorageManager;
    this.resourcesManager = new ResourcesManager();
    this.newsManager = new NewsManager();

    // Hacer la app global para acceso desde otros módulos
    window.app = this;
  }

  /**
   * Inicializa la aplicación
   */
  async init() {
    console.log('Inicializando CiberSegura...');

    // Verificar disponibilidad de LocalStorage
    if (!this.storageManager.isAvailable()) {
      this.mostrarError('LocalStorage no está disponible. Algunos datos no se guardarán.');
    }

    // carga resourceManager
    await this.resourcesManager.loadModules();
    await this.newsManager.load();

    // Configurar navegación
    this.setupNavigation();

    // Mostrar dashboard inicial
    this.goToSection('inicio');



    console.log('✓ CiberSegura inicializada correctamente');
  }

  /**
   * Configura los listeners de navegación
   * @private
   */
  setupNavigation() {
    const navLinks = document.querySelectorAll('.sidebar-link');

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();

        // Obtener la sección del href o data-action
        let section = link.getAttribute('href')?.replace('#', '') ||
          link.dataset.action;

        this.goToSection(section);

        // Actualizar clase active
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Cerrar sidebar en mobile
        this.closeMobileMenu();
      });
    });

    // Configurar botón del menú
    this.setupMobileMenu();
  }

  /**
   * Configura el menú móvil
   * @private
   */
  setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menuClose = document.querySelector('.menu-close');
    const sidebar = document.querySelector('.sidebar');

    if (menuToggle) {
      menuToggle.addEventListener('click', () => {
        sidebar.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    }

    if (menuClose) {
      menuClose.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    }
  }

  /**
   * Cierra el menú móvil
   * @private
   */
  closeMobileMenu() {
    const sidebar = document.querySelector('.sidebar');

    if (sidebar) {
      sidebar.classList.remove('active');
    }

    document.body.style.overflow = 'auto';
  }

  /**
   * Navega a una sección
   * @param {string} section - Nombre de la sección
   */
  goToSection(section) {
    console.log(`Navegando a: ${section}`);

    this.currentSection = section;

    switch (section) {
      case 'inicio':
        this.showDashboard();
        break;
      case 'quiz':
        this.startQuiz();
        break;
      case 'phishing':
        this.startPhishing();
        break;
      case 'crossword':
        this.startCrossword();
        break;
      case 'recursos':
        this.showRecursos();
        break;
      case 'actividades':
        this.showActividades();
        break;
      default:
        this.showDashboard();
    }
  }

  /**
   * Muestra el dashboard
   * @private
   */
  showDashboard() {
    // Limpiar contenedor
    this.appContainer.innerHTML = '';

    // Crear dashboard
    this.dashboard = new Dashboard('main-content');
    this.dashboard.render();
  }

  /**
   * Inicia el quiz
   * @private
   */
  startQuiz() {
    this.appContainer.innerHTML = '';

    this.quizGame = new QuizGame('main-content', 'data/quiz.json');
    this.quizGame.iniciar();
  }

  /**
   * Inicia el detector de phishing
   * @private
   */
  startPhishing() {
    this.appContainer.innerHTML = '';

    this.phishingGame = new PhishingGame('main-content', 'data/phishing.json');
    this.phishingGame.iniciar();
  }

  /**
   * Inicia el crucigrama
   * @private
   */
  startCrossword() {
    this.appContainer.innerHTML = '';

    this.crosswordGame = new CrosswordGame('main-content', 'data/crossword.json');
    this.crosswordGame.iniciar();
  }

  showRecursos() {

    if (
      !this.resourcesManager.modules ||
      this.resourcesManager.modules.length === 0
    ) {

      this.mostrarError(
        'No se pudo cargar el Centro de Aprendizaje.'
      );

      return;
    }

    this.appContainer.innerHTML =
      this.resourcesManager.render();
  }
  openModule(moduleId) {

    const module =
      this.resourcesManager.getModule(moduleId);

    if (!module) {
      return;
    }

    const mainContent =
      document.getElementById('main-content');

    mainContent.innerHTML =
      this.resourcesManager.renderModule(
        moduleId
      );
  }
  /**
   * Muestra las actividades
   * @private
   */
  showActividades() {
    const stats = this.storageManager.getStats();

    const actividadesHTML = `
      <div class="main-content">
        <div class="container">
          <h1 style="margin-bottom: 30px;">✅ Actividades Disponibles</h1>

          <div class="grid grid-2">
            <div class="card action-button" onclick="app.goToSection('quiz')">
              <div class="action-icon">📝</div>
              <div class="action-title">Quiz de Ciberseguridad</div>
              <p style="margin: 10px 0; color: #666;">
                Completados: ${stats.estadisticas.quiz}
              </p>
            </div>

            <div class="card action-button" onclick="app.goToSection('phishing')">
              <div class="action-icon">🕵️</div>
              <div class="action-title">Detector de Phishing</div>
              <p style="margin: 10px 0; color: #666;">
                Completados: ${stats.estadisticas.phishing}
              </p>
            </div>

            <div class="card action-button" onclick="app.goToSection('crossword')">
              <div class="action-icon">✏️</div>
              <div class="action-title">Crucigrama</div>
              <p style="margin: 10px 0; color: #666;">
                Completados: ${stats.estadisticas.crucigrama}
              </p>
            </div>
          </div>

          <div style="margin-top: 30px; text-align: center;">
            <button class="btn btn-secondary" onclick="app.goToSection('inicio')">
              ← Volver al Dashboard
            </button>
          </div>
        </div>
      </div>
    `;

    this.appContainer.innerHTML = actividadesHTML;
  }

  /**
   * Muestra el glosario
   */
  showGlosario() {
    const glosarioHTML = `
      <div class="main-content">
        <div class="container">
          <h1 style="margin-bottom: 30px;">📖 Glosario de Términos</h1>

          <div class="card">
            <div class="card-body">
              <h3>Términos Comunes en Ciberseguridad</h3>
              <dl style="margin-top: 20px;">
                <dt style="font-weight: bold; margin-top: 15px;">Phishing</dt>
                <dd>Técnica fraudulenta para obtener información personal mediante correos o mensajes falsos.</dd>

                <dt style="font-weight: bold; margin-top: 15px;">Malware</dt>
                <dd>Software malicioso diseñado para dañar o explotar sistemas informáticos.</dd>

                <dt style="font-weight: bold; margin-top: 15px;">Contraseña</dt>
                <dd>Código secreto que protege el acceso a cuentas y dispositivos.</dd>

                <dt style="font-weight: bold; margin-top: 15px;">Dos Factores</dt>
                <dd>Sistema de seguridad que requiere dos formas diferentes de verificación.</dd>

                <dt style="font-weight: bold; margin-top: 15px;">Firewall</dt>
                <dd>Barrera de seguridad que controla el tráfico de red entre dispositivos.</dd>
              </dl>
            </div>
          </div>

          <div style="margin-top: 30px; text-align: center;">
            <button class="btn btn-secondary" onclick="app.goToSection('recursos')">
              ← Volver a Recursos
            </button>
          </div>
        </div>
      </div>
    `;

    this.appContainer.innerHTML = glosarioHTML;
  }

  /**
   * Muestra las guías de seguridad
   */
  showGuias() {
    const guiasHTML = `
      <div class="main-content">
        <div class="container">
          <h1 style="margin-bottom: 30px;">🛡️ Guías de Seguridad</h1>

          <div class="grid">
            <div class="card">
              <div class="card-header">
                <h3>Consejos para Contraseñas Seguras</h3>
              </div>
              <div class="card-body">
                <ul style="padding-left: 20px;">
                  <li>✓ Usa mínimo 12 caracteres</li>
                  <li>✓ Mezcla mayúsculas, minúsculas, números y símbolos</li>
                  <li>✓ No uses información personal</li>
                  <li>✓ Usa contraseñas diferentes en cada cuenta</li>
                  <li>✓ Cambia tus contraseñas regularmente</li>
                </ul>
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <h3>Cómo Evitar Phishing</h3>
              </div>
              <div class="card-body">
                <ul style="padding-left: 20px;">
                  <li>✓ Verifica el remitente del correo</li>
                  <li>✓ No hagas clic en enlaces sospechosos</li>
                  <li>✓ Busca el candado en la URL</li>
                  <li>✓ Si tienes duda, accede manualmente</li>
                  <li>✓ Reporta correos sospechosos</li>
                </ul>
              </div>
            </div>
          </div>

          <div style="margin-top: 30px; text-align: center;">
            <button class="btn btn-secondary" onclick="app.goToSection('recursos')">
              ← Volver a Recursos
            </button>
          </div>
        </div>
      </div>
    `;

    this.appContainer.innerHTML = guiasHTML;
  }

  /**
   * Muestra preguntas frecuentes
   */
  showFAQ() {
    const faqHTML = `
      <div class="main-content">
        <div class="container">
          <h1 style="margin-bottom: 30px;">❓ Preguntas Frecuentes</h1>

          <div class="card">
            <div class="card-body">
              <h3 style="margin-bottom: 20px; color: var(--color-primary);">¿Cómo comienzo?</h3>
              <p>Comienza en el Dashboard. Puedes acceder a cualquier actividad desde allí.</p>

              <h3 style="margin-bottom: 20px; margin-top: 20px; color: var(--color-primary);">¿Dónde se guardan mis datos?</h3>
              <p>Todos tus datos se guardan localmente en tu navegador usando LocalStorage.</p>

              <h3 style="margin-bottom: 20px; margin-top: 20px; color: var(--color-primary);">¿Puedo descargar mis datos?</h3>
              <p>Sí, puedes exportar tus datos desde las opciones de tu perfil.</p>

              <h3 style="margin-bottom: 20px; margin-top: 20px; color: var(--color-primary);">¿Hay límite de intentos?</h3>
              <p>No, puedes repetir las actividades cuantas veces desees.</p>
            </div>
          </div>

          <div style="margin-top: 30px; text-align: center;">
            <button class="btn btn-secondary" onclick="app.goToSection('recursos')">
              ← Volver a Recursos
            </button>
          </div>
        </div>
      </div>
    `;

    this.appContainer.innerHTML = faqHTML;
  }

  /**
   * Descarga certificado
   */
  downloadCertificate() {
    const user = this.storageManager.getUser();
    const stats = this.storageManager.getStats();

    alert(`
      Certificado de Participación
      
      Nombre: ${user.usuario}
      Nivel: ${user.nivel}
      Puntos: ${stats.puntajeTotal}
      Actividades Completadas: ${stats.actividadesCompletadas}
      Logros: ${stats.logrosDesbloqueados}/${stats.logrosDisponibles}
      
      ¡Felicidades por tu dedicación en aprender ciberseguridad!
    `);
  }

  /**
   * Muestra un error
   * @private
   * @param {string} mensaje - Mensaje de error
   */
  mostrarError(mensaje) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger';
    alert.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10000;
      max-width: 500px;
    `;
    alert.innerHTML = `
      <span class="alert-icon">⚠️</span>
      <div>${mensaje}</div>
    `;
    document.body.appendChild(alert);

    setTimeout(() => alert.remove(), 5000);
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const app = new CiberSeguraApp('main-content');
  app.init();
});
