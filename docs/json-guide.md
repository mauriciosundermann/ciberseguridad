# Guía de Extensión JSON - CiberSegura

## 1. Estructura General

Todos los archivos JSON utilizan estructura UTF-8 válida. Las claves y valores deben estar entre comillas dobles.

---

## 2. Quiz.json - Agregar Nuevas Preguntas

### Estructura Base
```json
{
  "preguntas": [
    {
      "id": 1,
      "pregunta": "¿Qué es una contraseña segura?",
      "opciones": [
        "Una contraseña corta y fácil de recordar",
        "Una contraseña con mínimo 12 caracteres, mayúsculas, minúsculas, números y símbolos",
        "Tu fecha de nacimiento",
        "El nombre de tu mascota"
      ],
      "respuesta_correcta": 1,
      "explicacion": "Una contraseña segura debe tener al menos 12 caracteres...",
      "modulo": "contraseñas",
      "dificultad": "facil"
    }
  ]
}
```

### Campos Explicados
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | number | Identificador único, secuencial |
| `pregunta` | string | Texto de la pregunta |
| `opciones` | array | Array de 4 opciones de respuesta |
| `respuesta_correcta` | number | Índice de la opción correcta (0-3) |
| `explicacion` | string | Explicación detallada |
| `modulo` | string | Tema de la pregunta |
| `dificultad` | string | `facil`, `medio`, o `avanzado` |

### Ejemplo Completo - Agregar Pregunta
```json
{
  "preguntas": [
    // ... preguntas existentes ...
    {
      "id": 11,
      "pregunta": "¿Qué significa 2FA?",
      "opciones": [
        "2 Factor Authentication - Autenticación de dos factores",
        "2 File Access - Acceso a dos archivos",
        "2 Firewall Applications - Dos aplicaciones de firewall",
        "Fast Authentication - Autenticación rápida"
      ],
      "respuesta_correcta": 0,
      "explicacion": "2FA (Autenticación de Dos Factores) requiere dos métodos de verificación diferentes, como contraseña + código SMS. Esto aumenta significativamente la seguridad de tus cuentas.",
      "modulo": "autenticacion",
      "dificultad": "medio"
    }
  ]
}
```

### Validación
```bash
# Usar validador JSON online
# https://jsonlint.com/
# O en terminal
python3 -m json.tool quiz.json > /dev/null && echo "✓ Válido" || echo "✗ Error"
```

---

## 3. Phishing.json - Agregar Correos

### Estructura Base
```json
{
  "correos": [
    {
      "id": 1,
      "asunto": "Verificación de seguridad requerida",
      "remitente": "security@bankmail.fake",
      "cuerpo": "Estimado cliente, detectamos actividad inusual...",
      "elementos_sospechosos": [
        {
          "id": "elem1",
          "ubicacion": "remitente",
          "descripcion": "Dirección de email con dominio falso"
        },
        {
          "id": "elem2",
          "ubicacion": "cuerpo",
          "descripcion": "Lenguaje urgente sin especificar cuenta"
        }
      ],
      "explicacion": "Este es un email phishing común...",
      "riesgo": "muy_alto",
      "dificultad": "facil"
    }
  ]
}
```

### Campos Explicados
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | number | Identificador único |
| `asunto` | string | Línea de asunto del email |
| `remitente` | string | Dirección de remitente (falsa o legítima) |
| `cuerpo` | string | Contenido del email |
| `elementos_sospechosos` | array | Array de elementos a detectar |
| `explicacion` | string | Por qué es phishing |
| `riesgo` | string | `bajo`, `medio`, `alto`, `muy_alto` |
| `dificultad` | string | `facil`, `medio`, `avanzado` |

### Ejemplo - Agregar Email
```json
{
  "id": 7,
  "asunto": "¡Ganaste un premio! Reclama ahora",
  "remitente": "premios@loteriafake.net",
  "cuerpo": "¡Felicidades! Tu email fue seleccionado como ganador. Haz clic AQUÍ para reclamar tu premio de $50,000. Este oferta expira en 24 horas. Responde con tus datos bancarios.",
  "elementos_sospechosos": [
    {
      "id": "elem1",
      "ubicacion": "asunto",
      "descripcion": "Promesa de dinero - táctica común"
    },
    {
      "id": "elem2",
      "ubicacion": "remitente",
      "descripcion": "Dominio falso (.net en lugar de .gov)"
    },
    {
      "id": "elem3",
      "ubicacion": "cuerpo",
      "descripcion": "Solicita datos bancarios directamente"
    },
    {
      "id": "elem4",
      "ubicacion": "cuerpo",
      "descripcion": "Presión temporal - expira en 24 horas"
    }
  ],
  "explicacion": "Este es un email de estafa de lotería. Las loterías legítimas nunca solicitan dinero ni datos bancarios por email. El remitente usa un dominio falso y presión temporal para urgir la acción.",
  "riesgo": "muy_alto",
  "dificultad": "facil"
}
```

---

## 4. Crossword.json - Agregar Crucigramas

### Estructura Base
```json
{
  "crucigramas": [
    {
      "id": 1,
      "nombre": "Crucigrama Fácil",
      "dificultad": "facil",
      "palabras": [
        {
          "palabra": "CONTRASENA",
          "posicion": 1,
          "fila": 1,
          "columna": 1,
          "orientacion": "horizontal",
          "pista": "Código secreto que protege tus cuentas"
        }
      ]
    }
  ]
}
```

### Campos Explicados
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `palabra` | string | Palabra en MAYÚSCULAS, sin tildes |
| `posicion` | number | Número de pista secuencial |
| `fila` | number | Fila en grid (1-15) |
| `columna` | number | Columna en grid (1-15) |
| `orientacion` | string | `horizontal` o `vertical` |
| `pista` | string | Descripción para resolver |

### Ejemplo - Agregar Crucigrama Avanzado
```json
{
  "id": 4,
  "nombre": "Crucigrama Avanzado",
  "dificultad": "avanzado",
  "palabras": [
    {
      "palabra": "VULNERABILIDAD",
      "posicion": 1,
      "fila": 3,
      "columna": 1,
      "orientacion": "horizontal",
      "pista": "Debilidad en un sistema que puede ser explotada"
    },
    {
      "palabra": "FIREWALL",
      "posicion": 2,
      "fila": 1,
      "columna": 3,
      "orientacion": "vertical",
      "pista": "Sistema de seguridad que filtra tráfico de red"
    },
    {
      "palabra": "ENCRIPTACION",
      "posicion": 3,
      "fila": 6,
      "columna": 1,
      "orientacion": "horizontal",
      "pista": "Proceso de convertir datos a código ilegible"
    }
  ]
}
```

### Guía para Crear Crucigramas
1. Planificar en papel primero
2. Usar grid de 15x15
3. Asegurar que palabras se crucen
4. Escribir pistas claras pero desafiantes
5. Validar coordenadas manualmente
6. Probar en la app

---

## 5. Módulos.json - Estructura Base

```json
{
  "modulos": [
    {
      "id": 1,
      "nombre": "Contraseñas Seguras",
      "descripcion": "Aprende a crear contraseñas robustas",
      "icono": "🔐",
      "temas": [
        "Requisitos de seguridad",
        "Gestores de contraseñas",
        "Cambio periódico"
      ],
      "duracion": "15 minutos"
    }
  ]
}
```

---

## 6. Noticias.json - Estructura Base

```json
{
  "noticias": [
    {
      "id": 1,
      "titulo": "Nueva alerta de seguridad: Vulnerabilidad en navegador",
      "fecha": "2026-06-23",
      "fuente": "CERT",
      "enlace": "https://example.com",
      "resumen": "Se descubrió una vulnerabilidad crítica..."
    }
  ]
}
```

---

## 7. Fuentes.json - Estructura Base

```json
{
  "fuentes": [
    {
      "id": 1,
      "nombre": "INCIBE - Instituto Nacional de Ciberseguridad",
      "url": "https://www.incibe.es/",
      "descripcion": "Información oficial sobre ciberseguridad",
      "tipo": "oficial"
    }
  ]
}
```

---

## 8. Glosario.json - Estructura Base

```json
{
  "terminos": [
    {
      "termino": "Phishing",
      "categoria": "Ataques",
      "definicion": "Técnica para obtener información personal mediante email falso",
      "ejemplos": [
        "Email de banco falso",
        "Mensaje de WhatsApp haciéndose pasar por empresa"
      ]
    }
  ]
}
```

---

## 9. Validación Completa de JSON

### Script de Validación
```python
#!/usr/bin/env python3
import json
import sys

def validar_json(archivo):
    try:
        with open(archivo, 'r', encoding='utf-8') as f:
            data = json.load(f)
        print(f"✓ {archivo} es válido")
        return True
    except json.JSONDecodeError as e:
        print(f"✗ Error en {archivo}: {e}")
        return False

archivos = [
    'data/quiz.json',
    'data/phishing.json',
    'data/crossword.json'
]

for archivo in archivos:
    if not validar_json(archivo):
        sys.exit(1)

print("\n✓ Todos los archivos JSON son válidos")
```

### Ejecutar
```bash
python3 validar.py
```

---

## 10. Mejores Prácticas

### ✓ Hacer
- Usar UTF-8 encoding
- Validar JSON antes de commitar
- Usar indentación de 2 espacios
- Incluir comentarios en documentación
- Probar nuevo contenido en navegador

### ✗ Evitar
- Dejar comas al final de arrays
- Usar caracteres especiales sin escape
- Tener IDs duplicados
- Olvidar comillas dobles en strings
- Dejar comentarios en JSON (no permite)

---

## 11. Template para Nueva Pregunta Quiz

Copiar y personalizar:
```json
{
  "id": INSERT_ID,
  "pregunta": "Tu pregunta aquí?",
  "opciones": [
    "Opción A - Correcta",
    "Opción B - Distractor",
    "Opción C - Distractor",
    "Opción D - Distractor"
  ],
  "respuesta_correcta": 0,
  "explicacion": "Explicación detallada de la respuesta correcta...",
  "modulo": "nombre_modulo",
  "dificultad": "facil|medio|avanzado"
}
```

---

## 12. Template para Nuevo Email Phishing

```json
{
  "id": INSERT_ID,
  "asunto": "Asunto del email",
  "remitente": "correo@falso.com",
  "cuerpo": "Cuerpo del email con elementos sospechosos...",
  "elementos_sospechosos": [
    {
      "id": "elem1",
      "ubicacion": "remitente|asunto|cuerpo|enlaces",
      "descripcion": "Descripción del elemento sospechoso"
    }
  ],
  "explicacion": "Explicación de por qué es phishing...",
  "riesgo": "bajo|medio|alto|muy_alto",
  "dificultad": "facil|medio|avanzado"
}
```

---

## 13. Cálculo de Puntos

### Quiz
- Pregunta correcta: 10 puntos
- Deducción incorrecta: -3 puntos (opcional)
- Por quiz completado: Bonus de 0-50 según precisión

### Phishing
- Email correcto (≥70% elementos): 50 puntos

### Crucigrama
- Por crucigrama completado: 50 puntos

### Bonus por Logros
- Primer Quiz: 10 puntos
- Phishing Master (10 correctos): 50 puntos
- Crucigrama Pro (5 completados): 30 puntos
- Estudiante Dedicado (7 días): 100 puntos
- Cibersegura (Todos): 200 puntos

---

**Última actualización**: 2026-06-23
**Versión**: 1.0.0
