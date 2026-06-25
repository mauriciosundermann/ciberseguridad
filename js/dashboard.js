/**
 * dashboard.js - Gestión del Panel de Control
 * 
 * Módulo responsable de renderizar y actualizar el dashboard
 * con estadísticas, logros y actividades recientes del usuario.
 * 
 * @module dashboard
 * @author CiberSegura Team
 * @version 1.0.0
 */

const tips = [
  "No compartir contraseñas por correo electrónico.",
  "Verificar siempre la dirección web antes de iniciar sesión.",
  "Los bancos no solicitan claves por WhatsApp y/o correo electrónico.",
  "Desconfiar de mensajes que generen urgencia.",
  "Mantener actualizados los dispositivos."
];
const randomTip =
  tips[Math.floor(Math.random() * tips.length)];

class Dashboard {
  /**
   * Constructor del Dashboard
   * @param {string} containerId - ID del elemento contenedor
   */
  constructor(containerId = 'app') {
    this.container = document.getElementById(containerId);
    this.storageManager = StorageManager;
  }

  /**
   * Renderiza el dashboard completo
   */
  render() {
    const user = this.storageManager.getUser();
    const stats = this.storageManager.getStats();
    const levelInfo = this.storageManager.getNivelInfo();

    const dashboardHTML = `
      <div class="dashboard">
        <div class="container">
          
        <!-- Header del Dashboard -->
          <div class="hero-section">
            <div class="hero-content">
              <h1 class="hero-title"><img src="assets/icons/logo.png" alt="CiberSegura" class="header-logo">
                CiberSegura
              </h1>
              <h2 class="hero-subtitle">
                Aprender a detectar fraudes digitales
              </h2>
              <p class="hero-description">
                Actividades prácticas para reconocer correos falsos,
                proteger datos personales y navegar de forma segura.
              </p>
              <div class="hero-level">
                Nivel ${user.nivel}: ${levelInfo.nombre}
              </div>
            </div>
          </div>
          
          <div class="tip-card">
            <div class="tip-icon">💡</div>
            <div>
              <strong>Consejo de hoy</strong>
              <p>
                ${randomTip}
              </p>
            </div>
          </div>

          <!-- Actividades -->
          <div class="activities-section">
            <h2 class="activities-title">🎯 Actividades de aprendizaje</h2>
            <p class="activities-description">
              Actividades para reforzar conocimientos sobre
              seguridad digital y protección de la información.
            </p>
            ${this.renderActionButtons()}
          </div>

          <!-- Estadísticas Principales -->
          <h2 class="stats-title">
            📊 Progreso
          </h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">⭐</div>
              <div class="stat-value">${stats.puntajeTotal}</div>
              <div class="stat-label">Puntos Totales</div>
            </div>

            <div class="stat-card stat-level">
              <div class="stat-icon">📈</div>
              <div class="stat-value">Nivel ${user.nivel}</div>
              <div class="stat-label">${levelInfo.nombre}</div>
            </div>

            <div class="stat-card stat-achievements">
              <div class="stat-icon">🏆</div>
              <div class="stat-value">${stats.logrosDesbloqueados}/${stats.logrosDisponibles}</div>
              <div class="stat-label">Logros</div>
            </div>

            <div class="stat-card stat-activities">
              <div class="stat-icon">✅</div>
              <div class="stat-value">${stats.actividadesCompletadas}</div>
              <div class="stat-label">Actividades Completadas</div>
            </div>
          </div>

          <!-- Barra de Progreso General -->
          <div class="progress-section">
            <div class="progress-title">Progreso al siguiente nivel</div>
            <div class="progress-item">
              <div class="progress-label">
                <span>
                  ${levelInfo.puntosMaximo === Infinity ? `${levelInfo.puntosActuales}+` : `
                  ${levelInfo.puntosActuales}/${levelInfo.puntosMaximo}`} puntos
                </span>
                <span>${Math.round(levelInfo.progreso)}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${levelInfo.progreso}%"></div>
              </div>
            </div>
          </div>

          <!-- Estadísticas de Actividades -->
          <div class="progress-section">
            <div class="progress-title">Desempeño por Actividad</div>
            
            <div class="progress-item">
              <div class="progress-label">
                <span>Quiz Completados</span>
                <span>${stats.estadisticas.quiz}</span>
              </div>
            </div>

            <div class="progress-item">
              <div class="progress-label">
                <span>Crucigramas Completados</span>
                <span>${stats.estadisticas.crucigrama}</span>
              </div>
            </div>

            <div class="progress-item">
              <div class="progress-label">
                <span>Correos sospechosos identificados</span>
                <span>${stats.estadisticas.phishing}</span>
              </div>
            </div>
          </div>

          <!-- Logros -->
          ${this.renderAchievements()}

          <!-- Actividades Recientes -->
          ${this.renderRecentActivities()}

          ${this.renderNoticias()}
        </div>
      </div>
    `;

    this.container.innerHTML = dashboardHTML;
    this.attachEventListeners();
  }

  /**
   * Renderiza la sección de logros
   * @private
   * @returns {string} HTML de logros
   */
  renderAchievements() {
    const achievements = this.storageManager.getAchievements();

    const achievementsHTML = achievements.map(achievement => `
      <div class="achievement-badge ${achievement.desbloqueado ? 'unlocked' : 'locked'}" 
           title="${achievement.descripcion}"
           data-achievement="${achievement.id}">
        <div class="achievement-icon">${achievement.icono}</div>
        <div class="achievement-name">${achievement.nombre}</div>
      </div>
    `).join('');

    return `
      <div class="achievements-section">
        <div class="achievements-title">🏅 Logros Desbloqueables</div>
        <div class="achievements-grid">
          ${achievementsHTML}
        </div>
      </div>
    `;
  }

  /**
   * Renderiza las actividades recientes
   * @private
   * @returns {string} HTML de actividades
   */
  renderRecentActivities() {
    const activities = this.storageManager.getRecentActivities(5);

    if (activities.length === 0) {
      return `
        <div class="recent-activities">
          <div class="recent-title">📋 Actividades Recientes</div>
          <p style="text-align: center; color: #999; padding: 20px;">
            Aún no hay actividades completadas. ¡Comenzar ahora!
          </p>
        </div>
      `;
    }

    const activitiesHTML = activities.map(activity => {
      const icons = {
        quiz: '📝',
        crucigrama: '✏️',
        phishing: '🕵️'
      };

      const fecha = new Date(activity.timestamp);
      const horaFormato = fecha.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      });

      return `
        <div class="activity-item">
          <div class="activity-icon">${icons[activity.tipo] || '✅'}</div>
          <div class="activity-info">
            <div class="activity-name">${this.getTipoActividad(activity.tipo)}</div>
            <div class="activity-time">${horaFormato}</div>
          </div>
          <div class="activity-score">+${activity.puntos} pts</div>
        </div>
      `;
    }).join('');

    return `
      <div class="recent-activities">
        <div class="recent-title">📋 Actividades Recientes</div>
        <div class="activity-list">
          ${activitiesHTML}
        </div>
      </div>
    `;
  }

  /**
   * Obtiene el nombre legible de un tipo de actividad
   * @private
   * @param {string} tipo - Tipo de actividad
   * @returns {string} Nombre del tipo de actividad
   */
  getTipoActividad(tipo) {
    const tipos = {
      quiz: 'Quiz de Ciberseguridad',
      crucigrama: 'Crucigrama',
      phishing: 'Detector de Phishing'
    };
    return tipos[tipo] || 'Actividad';
  }

  /**
   * Renderiza los botones de acción para acceder a actividades
   * @private
   * @returns {string} HTML de botones de acción
   */
  renderActionButtons() {
    return `
      <div class="dashboard-actions">
        <button class="action-button" data-action="quiz">
          <div class="action-card">
            <div class="action-icon">📝</div>
            <div class="action-title">Quiz de Seguridad</div>
            <div class="action-description">
              Evaluación de conocimientos sobre protección digital.
            </div>
          </div>
        </button>

        <button class="action-button" data-action="phishing">
          <div class="action-card">
            <div class="action-icon">🕵️</div>
            <div class="action-title">Detector de correos sospechosos</div>
            <div class="action-description">
              Es importante aprender a indentificar elementos engañosos.
            </div>
          </div>
        </button>

        <button class="action-button" data-action="crossword">
          <div class="action-card">
            <div class="action-icon">✏️</div>
            <div class="action-title">Crucigrama</div>
            <div class="action-description">
              Ampliar el vocabulario digital es una barrera primordial de seguridad.
            </div>
          </div>
        </button>

        <button class="action-button" data-action="recursos">
          <div class="action-card">
            <div class="action-icon">🎓</div>
            <div class="action-title">Centro de Aprendizaje</div>
            <div class="action-description">
              Contenido adicional para reforzar conocimientos sobre seguridad digital.
            </div>
          </div>
        </button>
      </div>
    `;
  }

  /**
   * Adjunta event listeners a los elementos del dashboard
   * @private
   */
  attachEventListeners() {
    // Botones de acción
    const actionButtons = document.querySelectorAll('.action-button');
    actionButtons.forEach(button => {
      button.addEventListener('click', () => {
        const action = button.dataset.action;
        this.handleActionClick(action);
      });
    });

    // Logros con tooltip
    const achievementBadges = document.querySelectorAll('.achievement-badge');
    achievementBadges.forEach(badge => {
      badge.addEventListener('mouseenter', () => {
        const tooltipId = `tooltip-${badge.dataset.achievement}`;
        if (!document.getElementById(tooltipId)) {
          const tooltip = document.createElement('div');
          tooltip.id = tooltipId;
          tooltip.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            pointer-events: none;
            z-index: 1000;
          `;
          document.body.appendChild(tooltip);
        }
      });
    });
  }

  /**
   * Maneja el clic en botones de acción
   * @private
   * @param {string} action - Acción a realizar
   */
  handleActionClick(action) {
    // Esto será implementado por la app principal
    if (window.app && window.app.goToSection) {
      window.app.goToSection(action);
    }
  }

  /**
   * Actualiza el dashboard con nuevos datos
   */
  update() {
    this.render();
  }

  /**
   * Muestra una notificación emergente
   * @param {Object} config - Configuración de la notificación
   * @param {string} config.titulo - Título de la notificación
   * @param {string} config.mensaje - Mensaje de la notificación
   * @param {string} config.tipo - Tipo: 'exito', 'advertencia', 'error'
   * @param {number} config.duracion - Duración en milisegundos
   */
  showNotification(config) {
    const {
      titulo = '',
      mensaje = '',
      tipo = 'exito',
      duracion = 3000
    } = config;

    const notification = document.createElement('div');
    notification.className = `notification notification-${tipo}`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${tipo === 'exito' ? '#34a853' : tipo === 'error' ? '#d33927' : '#fbbc04'};
      color: ${tipo === 'error' || tipo === 'exito' ? 'white' : 'black'};
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      max-width: 400px;
      animation: slideIn 0.3s ease;
    `;

    let contenido = mensaje;
    if (titulo) {
      contenido = `<strong>${titulo}</strong><br>${mensaje}`;
    }

    notification.innerHTML = contenido;
    document.body.appendChild(notification);

    // Añadir animación CSS
    if (!document.getElementById('notification-styles')) {
      const style = document.createElement('style');
      style.id = 'notification-styles';
      style.textContent = `
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(400px);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Remover después del tiempo especificado
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, duracion);
  }

  renderNoticias() {

    if (
      !window.app ||
      !window.app.newsManager
    ) {
      return '';
    }

    return window.app
      .newsManager
      .render();
  }

}

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Dashboard;
}
