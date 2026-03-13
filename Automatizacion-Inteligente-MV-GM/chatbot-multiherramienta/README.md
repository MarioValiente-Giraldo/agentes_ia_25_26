# Chatbot Multiherramienta

Un chatbot completo que enruta consultas de usuarios a APIs externas (clima, países, Wikipedia) a través de automatización de flujos de trabajo N8N, respaldado por Ollama para análisis de intención con LLM y PostgreSQL para persistencia de conversaciones.

## Arquitectura

```
Navegador (React 19)
    │  POST /webhook/chat
    ▼
Flujo de Trabajo N8N
    ├── PostgreSQL  ← guardar mensaje del usuario
    ├── Ollama      ← clasificar intención (WEATHER / COUNTRY / WIKI / GENERAL)
    ├── Enrutador de cambio
    │     ├── WEATHER  → API de geocodificación + pronóstico de OpenMeteo
    │     ├── COUNTRY  → API REST de Países
    │     ├── WIKI     → API REST de Wikipedia
    │     └── GENERAL  → chat libre de Ollama
    ├── PostgreSQL  ← guardar respuesta del bot
    └── Responder al Webhook → { "output": "..." }
```

### Servicios
| Servicio   | Imagen                | Puerto | Propósito                      |
|------------|----------------------|--------|--------------------------------|
| postgres   | postgres:16-alpine   | 5432   | Historial de conversaciones    |
| ollama     | ollama/ollama        | 11434  | Análisis de intención LLM y chat|
| n8n        | n8nio/n8n:latest     | 5678   | Automatización de flujos       |
| frontend   | node:22-alpine (build)| 3000  | Interfaz de chat React         |

### APIs Externas (sin necesidad de claves API)
- **Clima**: [OpenMeteo](https://api.open-meteo.com) — geocodificación + pronóstico
- **Países**: [REST Countries](https://restcountries.com/v3.1)
- **Wikipedia**: [Wikipedia REST API](https://en.wikipedia.org/api/rest_v1)

---

## Inicio Rápido

### 1. Inicia todos los servicios

```bash
docker-compose up -d
```

Espera ~30 segundos para que todos los servicios se inicialicen.

### 2. Descarga el modelo de Ollama

```bash
docker exec chatbot-ollama ollama pull llama3.2
```

Esto descarga ~2 GB. Espera a que se complete antes de usar el chatbot.

### 3. Importa el flujo de trabajo de N8N

1. Abre N8N en **http://localhost:5678**
2. Crea una cuenta en la primera ejecución
3. Ve a **Workflows → Import from file**
4. Selecciona `n8n-workflow.json` desde la raíz del proyecto
5. Configura la credencial de PostgreSQL (ver abajo)
6. Activa el flujo de trabajo

### 4. Configura credenciales de PostgreSQL en N8N

Después de importar el flujo de trabajo:

1. Abre el flujo de trabajo importado
2. Haz clic en cualquier nodo de **PostgreSQL**
3. Haz clic en el campo **Credentials** → **Create new**
4. Completa:
   - **Host**: `postgres`
   - **Database**: `chatbot`
   - **User**: `chatbot`
   - **Password**: `chatbot123`
   - **Port**: `5432`
5. Guarda y aplica a ambos nodos de PostgreSQL en el flujo de trabajo
6. **Activa** el flujo de trabajo con el interruptor en la parte superior

### 5. Abre el frontend

Ve a **http://localhost:3000**

---

## Ejemplos de Uso

| Consulta | Intención | API Utilizada |
|----------|-----------|---------------|
| "¿Qué tiempo hace en Madrid?" | WEATHER | OpenMeteo |
| "Cuéntame sobre Francia" | COUNTRY | REST Countries |
| "¿Quién fue Einstein?" | WIKI | Wikipedia |
| "Hola, ¿cómo estás?" | GENERAL | Ollama |

---

## Endpoints

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `http://localhost:3000` | GET | Interfaz de chat frontend |
| `http://localhost:5678` | GET | Panel de control N8N |
| `http://localhost:5678/webhook/chat` | POST | Webhook de chat |
| `http://localhost:11434` | GET | API de Ollama |

### Carga útil del webhook
```json
{
  "message": "¿Qué tiempo hace en Barcelona?",
  "sessionId": "uuid-here"
}
```

### Respuesta del webhook
```json
{
  "output": "🌤️ Clima en Barcelona, Spain:\n\n🌡️ Temperatura actual: 18°C\n..."
}
```

---

## Desarrollo

### Ejecutar frontend localmente (fuera de Docker)

```bash
cd frontend
npm install
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook/chat npm run dev
```

### Ver historial de conversaciones (PostgreSQL)

```bash
docker exec -it chatbot-postgres psql -U chatbot -d chatbot -c "SELECT * FROM conversations ORDER BY created_at DESC LIMIT 20;"
```

### Verificar modelos de Ollama

```bash
docker exec chatbot-ollama ollama list
```

### Detener todos los servicios

```bash
docker-compose down
```

### Detener y eliminar todos los datos

```bash
docker-compose down -v
```

---

## Estructura del Proyecto

```
chatbot-multiherramienta/
├── docker-compose.yml      # Definición de todos los servicios
├── n8n-workflow.json       # Flujo de trabajo N8N (importar en UI de N8N)
├── README.md
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── index.css
        └── App.jsx
```

---

## Solución de Problemas

**El frontend muestra "Error al conectar"**
- Asegúrate de que N8N está ejecutándose y el flujo de trabajo está **activo**
- Verifica que las credenciales de PostgreSQL están configuradas en N8N

**Las respuestas de Ollama son lentas**
- La inferencia del LLM es intensiva en CPU sin GPU. Las primeras respuestas pueden tardar 30-60 segundos
- Las respuestas posteriores son más rápidas después de que el modelo se carga en memoria

**El flujo de trabajo de N8N no recibe solicitudes**
- Verifica que el flujo de trabajo está **activado** (interruptor en la esquina superior derecha)
- La ruta del webhook debe ser exactamente `chat` (URL: `/webhook/chat`)

**Error "model not found" de Ollama**
- Ejecuta `docker exec chatbot-ollama ollama pull llama3.2` y espera a que se complete
