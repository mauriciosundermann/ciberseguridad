#!/bin/bash

# CiberSegura - Script de Inicio Rápido
# Este script ayuda a levantar CiberSegura localmente para desarrollo

echo "🛡️  CiberSegura - Portal Educativo de Ciberseguridad"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Detectar sistema operativo
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="Linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macOS"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    OS="Windows"
else
    OS="Unknown"
fi

echo "Sistema detectado: $OS"
echo ""

# Mostrar opciones
echo "Selecciona una opción para iniciar:"
echo ""
echo "1) 🐍 Python (Recomendado - Incluido en la mayoría de sistemas)"
echo "2) 📦 Node.js (Requiere instalación previa)"
echo "3) 🍎 macOS - Abrir con Live Server"
echo "4) 📂 Mostrar instrucciones de GitHub Pages"
echo ""

read -p "Ingresa el número de tu opción (1-4): " option

case $option in
    1)
        echo ""
        echo "Iniciando con Python..."
        echo ""
        
        # Verificar si Python está instalado
        if command -v python3 &> /dev/null; then
            echo "✓ Python encontrado"
            echo ""
            echo "Iniciando servidor en http://localhost:8000"
            echo "Presiona Ctrl+C para detener"
            echo ""
            sleep 2
            python3 -m http.server 8000
        else
            echo "❌ Python no encontrado"
            echo "Instálalo desde https://www.python.org/"
            exit 1
        fi
        ;;
    2)
        echo ""
        echo "Iniciando con Node.js..."
        echo ""
        
        # Verificar si Node está instalado
        if command -v node &> /dev/null; then
            # Verificar si http-server está instalado
            if command -v http-server &> /dev/null; then
                echo "✓ Node.js y http-server encontrados"
                echo ""
                echo "Iniciando servidor en http://localhost:8000"
                echo "Presiona Ctrl+C para detener"
                echo ""
                sleep 2
                http-server -p 8000
            else
                echo "http-server no está instalado"
                read -p "¿Deseas instalarlo globalmente? (s/n): " install
                if [[ $install == "s" ]]; then
                    echo "Instalando http-server..."
                    npm install -g http-server
                    echo ""
                    echo "Iniciando servidor en http://localhost:8000"
                    echo "Presiona Ctrl+C para detener"
                    echo ""
                    sleep 2
                    http-server -p 8000
                else
                    echo "Instalación cancelada"
                    exit 1
                fi
            fi
        else
            echo "❌ Node.js no encontrado"
            echo "Instálalo desde https://nodejs.org/"
            exit 1
        fi
        ;;
    3)
        if [[ "$OS" == "macOS" ]]; then
            echo ""
            echo "Para usar Live Server en macOS:"
            echo "1. Instala la extensión 'Live Server' en VS Code"
            echo "2. Click derecho en index.html"
            echo "3. Selecciona 'Open with Live Server'"
            echo ""
            exit 0
        else
            echo "❌ Esta opción es solo para macOS"
            exit 1
        fi
        ;;
    4)
        echo ""
        echo "Despliegue en GitHub Pages"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "1. Crea un repositorio en GitHub:"
        echo "   https://github.com/new"
        echo ""
        echo "2. Clona el proyecto:"
        echo "   git clone https://github.com/TU_USUARIO/cibersegura.git"
        echo "   cd cibersegura"
        echo ""
        echo "3. Configura GitHub Pages:"
        echo "   - Ve a Settings → Pages"
        echo "   - Branch: main"
        echo "   - Folder: / (root)"
        echo "   - Save"
        echo ""
        echo "4. Espera 1-2 minutos y accede a:"
        echo "   https://TU_USUARIO.github.io/cibersegura"
        echo ""
        echo "Más información: docs/instalacion.md"
        echo ""
        exit 0
        ;;
    *)
        echo "❌ Opción inválida"
        exit 1
        ;;
esac
