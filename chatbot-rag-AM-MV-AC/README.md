
# 🧠 Chatbot RAG para el ROF del Centro Educativo

Este proyecto consiste en el desarrollo de un chatbot especializado en consultas sobre el Reglamento de Organización y Funcionamiento (ROF) de un centro educativo.
Para lograr respuestas precisas y basadas en el documento oficial, se implementa un sistema RAG (Retrieval-Augmented Generation). 

---

## 1) Descripción del proyecto

### 🔍¿Qué es RAG?

- Un RAG (Retrieval-Augmented Generation) es una técnica que combina:
    - **Recuperación de información** (search) mediante embeddings y vectores.
    - **Generación aumentada de respuestas** usando modelos de IA.
- Cuando un usuario pregunta algo, el sistema:
    1. Busca fragmentos del ROF relevantes (usando similitud vectorial).
    2. Pasa esos fragmentos al modelo generativo.
    3. Produce una respuesta precisa y fundamentada.



### 🧩 ¿Qué es un embedding?

Un **embedding** es una representación numérica de un texto en forma de vector.
Permite medir similitud entre textos:

- Textos similares → vectores cercanos
- Búsqueda → similitud de coseno

Los embeddings hacen posible el sistema RAG porque permiten encontrar rápidamente qué partes del ROF son relevantes para cada pregunta.


### 🗂️ Flujo de ingesta de datos

El proceso de ingesta transforma el ROF en un formato utilizable para RAG:

**1. Procesar** → El ROF se divide en fragmentos (“chunks”).
**2. Embeddings** → Cada fragmento se convierte en un vector numérico.
**3. Cargar-BD** → Los vectores y chunks se insertan en una base de datos.
**4. Búsqueda** → Se utiliza similitud de coseno para localizar fragmentos relevantes.

---

## 2) Requisitos

### 🧰 Software necesario

- Node.js v20+
- npm 10+
- Docker 24+
- Docker Compose V2
- Git
- Visual Studio Code
- Extensión REST Client para VS Code (para tests)

### 🦙 Ollama

- Instalado localmente
- Modelos necesarios:

```bash
ollama pull nomic-embed-text
ollama pull mistral
```

- Ollama debe responder en:

```bash
http://localhost:11434
```

### 📄 Documentos requeridos

- ROF del centro educativo en formato texto plano (.txt)

---

## 3) Instalación

1. Clonar respositorio

```bash
git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo
```

2. Instalar dependencias

```bash
npm install
```

3. Descargar archivo del ROF

- Colocarlo en `/data/rof.txt`

4. Configurar variables de entorno

- Crear `.env`

```bash
OLLAMA_URL=http://localhost:11434
DB_PATH=./database.sqlite3
```

---

## 4) Ejecución completa del proceso

- Ejecuta el pipeline completo:

```bash
npm run ingesta
```

---

## 5) Scripts individuales

**1️⃣ Procesar el ROF**

```bash
npm run procesar
```

**2️⃣ Generar embeddings**

```bash
npm run embeddings
```

**3️⃣ Cargar datos en la base de datos**

```bash
npm run cargar-bd
```

**4️⃣ Test de búsqueda semántica**

```bash
npm run test-busqueda
```

---

## 6) Estructura de datos

📌 `chunks.json`
- Contiene los fragmentos procesados:
```json
{
  "id": 1,
  "texto": "Contenido del fragmento...",
  "longitud": 250
}
```

📌 `embeddings.json`
- Vectores generados por Ollama:
```json
{
  "id": 1,
  "vector": [0.12, -0.80, 0.44, ...]
}
```

📌 Tabla `fragmentos` en SQLite3
- Contiene los fragmentos procesados:
    - `id`
    - `texto`
    - `vector` (JSON / BLOB)
    - `longitud`

    La base de datos soporta búsquedas mediante similitud de coseno.

--- 

##  7) ¿Qué es un embedding? 

Un **embedding** es una forma de convertir texto en un vector numérico que captura su significado.
Gracias a esto podemos:
- Comparar textos por similitud
- Hacer RAG con documentos largos
- Construir buscadores semánticos
- Evitar búsquedas literales por palabras clave

🔸Fundamentos:
- Representación vectorial del significado
- Vectores cercanos → textos parecidos
- Similitud de coseno → métrica estándar

---

## 8) Decisiones de diseño

### 🗄️ ¿Por qué SQLite3?

- Ligero y portable
- No requiere servidor
- Fácil de consultar desde Node.js
- Ideal para prototipos educativos
- Suficiente para almacenar cientos o miles de vectores

### 🧠 ¿Por qué `nomic-embed-text`?

- Optimizado para crear embeddings
- Excelente calidad semántica
- Ligero y rápido en CPU
- Disponible directamente en Ollama

### ✂️ Tamaño mínimo de fragmentos (100 caracteres)

- Evita trozos demasiado pequeños
- Asegura coherencia semántica
- Reduce ruido en los embeddings

---

## 9) Próximas fases

- Sistema de consultas (próximo hito)
- Backend en Node.js para:
  - Recibir preguntas
  - Buscar fragmentos relevantes en la BD
  - Invocar un LLM (Mstral) para generar respuestas fundamentadas
- Frontend web para preguntar al chatbot
- Contenerización completa con Docker Compose (backend, frontend, ollama)