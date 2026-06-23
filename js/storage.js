/**
 * storage.js - Gestión de LocalStorage
 * 
 * Módulo responsable de la persistencia de datos del usuario.
 * Almacena puntuaciones, logros, progreso y estadísticas.
 * 
 * @module storage
 * @author CiberSegura Team
 * @version 1.0.0
 */

class StorageManager {
  /**
   * Clave principal del almacenamiento en LocalStorage
   * @private
   * @constant {string}
   */
  static STORAGE_KEY = 'cibersegura_usuario';

  /**
   * Estructura por defecto del usuario
   * @private
   * @constant {Object}
   */
  static DEFAULT_USER = {
    usuario: 'Invitado',
    puntajeTotal: 0,
    nivel: 1,
    logros: [],
    actividadesCompletadas: 0,
    ultimaActividad: new Date().toISOString(),
    estadisticas: {
      quiz: 0,
      crucigrama: 0,
      phishing: 0
    },
    progreso: {
      modulos: [],
      actividadesRealizadas: []
    },
    configuracion: {
      notificaciones: true,
      tema: 'claro'
    }
  };

  /**
   * Niveles del sistema
   * @private
   * @constant {Array}
   */
  static LEVELS = [
    { nivel: 1, nombre: 'Usuario Básico', minPuntos: 0, maxPuntos: 100 },
    { nivel: 2, nombre: 'Navegante Seguro', minPuntos: 101, maxPuntos: 250 },
 { nivel: 3, nombre: 'Protector Digital', minPuntos: 251, maxPuntos: 500 },
 { nivel: 4, nombre: 'Analista Junior', minPuntos: 501, maxPuntos: 1000 },
 { nivel: 5, nombre: 'Analista Senior', minPuntos: 1001, maxPuntos: 2000 },
 { nivel: 6, nombre: 'Especialista', minPuntos: 2001, maxPuntos: 3500 },
 { nivel: 7, nombre: 'Experto', minPuntos: 3501, maxPuntos: 5000 },
 { nivel: 8, nombre: 'Consultor', minPuntos: 5001, maxPuntos: 7500 },
 { nivel: 9, nombre: 'Arquitecto', minPuntos: 7501, maxPuntos: 10000 },
 { nivel: 10, nombre: 'Maestro de Ciberseguridad', minPuntos: 10001, maxPuntos: Infinity }
  ];

  /**
   * Logros disponibles
   * @private
   * @constant {Array}
   */
  static ACHIEVEMENTS = [
    {
      id: 'primer-quiz',
      nombre: 'Primer Paso',
      descripcion: 'Completar el primer quiz',
      icono: '🎯',
      puntos: 10
    },
    {
      id: 'phishing-master',
      nombre: 'Detector de Phishing',
      descripcion: 'Detectar correctamente 10 phishing',
      icono: '🕵️',
      puntos: 50
    },
    {
      id: 'crucigrama-pro',
      nombre: 'Experto en Crucigramas',
      descripcion: 'Completar 5 crucigramas',
      icono: '✏️',
      puntos: 30
    },
    {
      id: 'estudiante-dedicado',
      nombre: 'Estudiante Dedicado',
      descripcion: 'Completar 7 días consecutivos',
      icono: '📚',
      puntos: 100
    },
    {
      id: 'cibersegura',
      nombre: 'Cibersegura',
      descripcion: 'Completar todos los módulos',
      icono: '🛡️',
      puntos: 200
    }
  ];

  /**
   * Obtiene los datos del usuario actual
   * @returns {Object} Datos del usuario
   */
  static getUser() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : this.DEFAULT_USER;
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
      return JSON.parse(
        JSON.stringify(this.DEFAULT_USER)
      );
    }
  }

  /**
   * Guarda los datos del usuario en LocalStorage
   * @param {Object} userData - Datos del usuario a guardar
   * @returns {boolean} True si se guardó exitosamente
   */
  static saveUser(userData) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Error al guardar datos del usuario:', error);
      return false;
    }
  }

  /**
   * Añade puntos al usuario y actualiza el nivel si es necesario
   * @param {number} puntos - Cantidad de puntos a añadir
   * @returns {Object} Objeto con información del cambio
   */
  static addPuntos(puntos) {
    const user = this.getUser();
    const puntosAnteriores = user.puntajeTotal;
    user.puntajeTotal += puntos;

    // Actualizar nivel
    const nivelAnterior = user.nivel;
    user.nivel = this.getNivelActual(user.puntajeTotal);

    this.saveUser(user);

    return {
      puntosAñadidos: puntos,
      puntosTotal: user.puntajeTotal,
      nivelCambio: user.nivel > nivelAnterior,
      nivelAnterior: nivelAnterior,
      nivelNuevo: user.nivel
    };
  }

  /**
   * Obtiene el nivel actual basado en los puntos
   * @param {number} puntos - Cantidad de puntos
   * @returns {number} Nivel correspondiente
   */
  static getNivelActual(puntos) {
    const level = this.LEVELS.find(
      l => puntos >= l.minPuntos && puntos <= l.maxPuntos
    );
    return level ? level.nivel : 1;
  }

  /**
   * Obtiene información detallada del nivel actual
   * @returns {Object} Información del nivel
   */
  static getNivelInfo() {
    const user = this.getUser();
    const levelInfo = this.LEVELS.find(l => l.nivel === user.nivel);
    const nextLevel = this.LEVELS.find(l => l.nivel === user.nivel + 1);

    let progreso = 100;

if (nextLevel) {
    progreso =
        ((user.puntajeTotal - levelInfo.minPuntos) /
        (levelInfo.maxPuntos - levelInfo.minPuntos)) * 100;
}

    return {
      nivel: user.nivel,
      nombre: levelInfo.nombre,
      puntosActuales: user.puntajeTotal,
      puntosMinimo: levelInfo.minPuntos,
      puntosMaximo: levelInfo.maxPuntos,
      siguienteNivel: nextLevel ? nextLevel.nombre : 'Máximo alcanzado',
      puntosParaSiguiente: nextLevel ? nextLevel.minPuntos - user.puntajeTotal : 0,
      progreso
    };
  }

  /**
   * Desbloquea un logro si aún no está desbloqueado
   * @param {string} achievementId - ID del logro a desbloquear
   * @returns {Object} Información del logro
   */
  static unlockAchievement(achievementId) {
    const user = this.getUser();
    const achievement = this.ACHIEVEMENTS.find(a => a.id === achievementId);

    if (!achievement) {
      return { exito: false, mensaje: 'Logro no encontrado' };
    }

    if (user.logros.includes(achievementId)) {
      return { exito: false, mensaje: 'Logro ya desbloqueado' };
    }

    user.logros.push(achievementId);

    // Añadir puntos del logro
    if (achievement.puntos) {
      user.puntajeTotal += achievement.puntos;
      user.nivel = this.getNivelActual(user.puntajeTotal);
    }

    this.saveUser(user);

    return {
      exito: true,
      logro: achievement,
      puntosGanados: achievement.puntos
    };
  }

  /**
   * Obtiene todos los logros con su estado (desbloqueado o no)
   * @returns {Array} Array de logros con estado
   */
  static getAchievements() {
    const user = this.getUser();
    return this.ACHIEVEMENTS.map(achievement => ({
      ...achievement,
      desbloqueado: user.logros.includes(achievement.id)
    }));
  }

  /**
   * Registra una actividad completada
   * @param {Object} actividad - Objeto con datos de la actividad
   * @returns {boolean} True si se registró exitosamente
   */
  static registerActivity(actividad) {
    const user = this.getUser();

    // Validar estructura de la actividad
    if (
    !actividad.tipo ||
    typeof actividad.puntos !== 'number'
) {
    return false;
}

    // Crear registro de actividad
    const activityRecord = {
      tipo: actividad.tipo,
      puntos: actividad.puntos,
      timestamp: new Date().toISOString(),
      detalles: actividad.detalles || {}
    };

    // Guardar en historial
    if (!Array.isArray(user.progreso.actividadesRealizadas)) {
      user.progreso.actividadesRealizadas = [];
    }

    user.progreso.actividadesRealizadas.push(activityRecord);
    user.actividadesCompletadas++;
    user.ultimaActividad = new Date().toISOString();

    // Actualizar estadísticas específicas
    if (actividad.tipo === 'quiz') {
      user.estadisticas.quiz++;
    } else if (actividad.tipo === 'crucigrama') {
      user.estadisticas.crucigrama++;
    } else if (actividad.tipo === 'phishing') {
      user.estadisticas.phishing++;
    }

    // Añadir puntos
    user.puntajeTotal += actividad.puntos;
    user.nivel = this.getNivelActual(user.puntajeTotal);

    this.saveUser(user);
    return true;
  }

  /**
   * Obtiene las últimas actividades realizadas
   * @param {number} cantidad - Número de actividades a retornar
   * @returns {Array} Array de actividades recientes
   */
  static getRecentActivities(cantidad = 5) {
    const user = this.getUser();
    const activities = user.progreso.actividadesRealizadas || [];
    return activities.slice(-cantidad).reverse();
  }

  /**
   * Obtiene estadísticas generales del usuario
   * @returns {Object} Objeto con estadísticas
   */
  static getStats() {
    const user = this.getUser();
    const activities = user.progreso.actividadesRealizadas || [];

    return {
      puntajeTotal: user.puntajeTotal,
      nivel: user.nivel,
      actividadesCompletadas: user.actividadesCompletadas,
      logrosDesbloqueados: user.logros.length,
      logrosDisponibles: this.ACHIEVEMENTS.length,
      estadisticas: user.estadisticas,
      ultimaActividad: user.ultimaActividad,
      actividadesTotales: activities.length,
      puntosPorActividad: activities.length > 0 
        ? (user.puntajeTotal / activities.length).toFixed(2)
        : 0
    };
  }

  /**
   * Limpia todos los datos del usuario (reinicia el juego)
   * @returns {boolean} True si se limpió exitosamente
   */
  static reset() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error al limpiar datos:', error);
      return false;
    }
  }

  /**
   * Exporta los datos del usuario como JSON
   * @returns {string} JSON serializado del usuario
   */
  static export() {
    const user = this.getUser();
    return JSON.stringify(user, null, 2);
  }

  /**
   * Importa datos del usuario desde JSON
   * @param {string} jsonData - Datos en formato JSON
   * @returns {Object} Resultado de la importación
   */
  static import(jsonData) {
    try {
      const userData = JSON.parse(jsonData);
      // Validar estructura básica
      if (
    typeof userData.usuario === 'undefined' ||
    typeof userData.puntajeTotal === 'undefined'
) {
    return {
        exito: false,
        mensaje: 'Formato JSON inválido'
    };
}
      this.saveUser(userData);
      return { exito: true, mensaje: 'Datos importados correctamente' };
    } catch (error) {
      return { exito: false, mensaje: 'Error al importar: ' + error.message };
    }
  }

  /**
   * Verifica si el almacenamiento local está disponible
   * @returns {boolean} True si LocalStorage está disponible
   */
  static isAvailable() {
    try {
      const test = '__test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }
}

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StorageManager;
}
