# Chatbot Multiherramienta

A full-stack chatbot that routes user queries to external APIs (weather, countries, Wikipedia) through N8N workflow automation, backed by Ollama for LLM intent analysis and PostgreSQL for conversation persistence.

## Architecture

```
Browser (React 19)
    │  POST /webhook/chat
    ▼
N8N Workflow
    ├── PostgreSQL  ← save user message
    ├── Ollama      ← classify intent (WEATHER / COUNTRY / WIKI / GENERAL)
    ├── Switch router
    │     ├── WEATHER  → OpenMeteo geocoding + forecast API
    │     ├── COUNTRY  → REST Countries API
    │     ├── WIKI     → Wikipedia REST API
    │     └── GENERAL  → Ollama free chat
    ├── PostgreSQL  ← save bot response
    └── Respond to Webhook → { "output": "..." }
```

### Services
| Service    | Image                 | Port  | Purpose                        |
|------------|-----------------------|-------|--------------------------------|
| postgres   | postgres:16-alpine    | 5432  | Conversation history           |
| ollama     | ollama/ollama         | 11434 | LLM intent analysis & chat     |
| n8n        | n8nio/n8n:latest      | 5678  | Workflow automation            |
| frontend   | node:22-alpine (build)| 3000  | React chat UI                  |

### External APIs (no API keys needed)
- **Weather**: [OpenMeteo](https://api.open-meteo.com) — geocoding + forecast
- **Countries**: [REST Countries](https://restcountries.com/v3.1)
- **Wikipedia**: [Wikipedia REST API](https://en.wikipedia.org/api/rest_v1)

---

## Quick Start

### 1. Start all services

```bash
docker-compose up -d
```

Wait ~30 seconds for all services to initialize.

### 2. Pull the Ollama model

```bash
docker exec chatbot-ollama ollama pull llama3.2
```

This downloads ~2 GB. Wait until complete before using the chatbot.

### 3. Import the N8N workflow

1. Open N8N at **http://localhost:5678**
2. Create an account on first run
3. Go to **Workflows → Import from file**
4. Select `n8n-workflow.json` from this project root
5. Configure the PostgreSQL credential (see below)
6. Activate the workflow

### 4. Configure PostgreSQL credentials in N8N

After importing the workflow:

1. Open the imported workflow
2. Click any **PostgreSQL** node
3. Click the **Credentials** field → **Create new**
4. Fill in:
   - **Host**: `postgres`
   - **Database**: `chatbot`
   - **User**: `chatbot`
   - **Password**: `chatbot123`
   - **Port**: `5432`
5. Save and apply to both PostgreSQL nodes in the workflow
6. **Activate** the workflow with the toggle at the top

### 5. Open the frontend

Go to **http://localhost:3000**

---

## Usage Examples

| Query | Intent | API Used |
|-------|--------|----------|
| "¿Qué tiempo hace en Madrid?" | WEATHER | OpenMeteo |
| "Cuéntame sobre Francia" | COUNTRY | REST Countries |
| "¿Quién fue Einstein?" | WIKI | Wikipedia |
| "Hola, ¿cómo estás?" | GENERAL | Ollama |

---

## Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `http://localhost:3000` | GET | Frontend chat UI |
| `http://localhost:5678` | GET | N8N dashboard |
| `http://localhost:5678/webhook/chat` | POST | Chat webhook |
| `http://localhost:11434` | GET | Ollama API |

### Webhook payload
```json
{
  "message": "¿Qué tiempo hace en Barcelona?",
  "sessionId": "uuid-here"
}
```

### Webhook response
```json
{
  "output": "🌤️ Clima en Barcelona, Spain:\n\n🌡️ Temperatura actual: 18°C\n..."
}
```

---

## Development

### Run frontend locally (outside Docker)

```bash
cd frontend
npm install
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook/chat npm run dev
```

### View conversation history (PostgreSQL)

```bash
docker exec -it chatbot-postgres psql -U chatbot -d chatbot -c "SELECT * FROM conversations ORDER BY created_at DESC LIMIT 20;"
```

### Check Ollama models

```bash
docker exec chatbot-ollama ollama list
```

### Stop all services

```bash
docker-compose down
```

### Stop and remove all data

```bash
docker-compose down -v
```

---

## Project Structure

```
chatbot-multiherramienta/
├── docker-compose.yml      # All services definition
├── n8n-workflow.json       # N8N workflow (import into N8N UI)
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

## Troubleshooting

**Frontend shows "Error al conectar"**
- Make sure N8N is running and the workflow is **active**
- Check that the PostgreSQL credentials are configured in N8N

**Ollama responses are slow**
- LLM inference is CPU-intensive without a GPU. First responses can take 30-60 seconds
- Subsequent responses are faster after the model is loaded in memory

**N8N workflow not receiving requests**
- Verify the workflow is **activated** (toggle in top right)
- The webhook path must be exactly `chat` (URL: `/webhook/chat`)

**"model not found" error from Ollama**
- Run `docker exec chatbot-ollama ollama pull llama3.2` and wait for completion
