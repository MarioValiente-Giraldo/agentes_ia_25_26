# ✅ Checklist - Proyecto Chatbot RAG

Este documento sirve como lista de verificación y seguimiento para el desarrollo del Chatbot RAG basado en el Reglamento de Organización y Funcionamiento (ROF).

---

## 🎬 Parte 1: Configuración Inicial del Proyecto

| # | Tarea | Estado | Asignado a | Observaciones |
| :--- | :--- | :--- | :--- | :--- |
| **1.1** | **🏗 Inicialización del proyecto** | |  | |
| 1.1.1 | Crear carpeta del proyecto: `chatbot-rag-[tu-nombre-iniciales]` | [x] | Mario | |
| 1.1.2 | Inicializar repositorio Git: `git init` | ☐ | Mario | |
| 1.1.3 | Crear rama de trabajo: `git checkout -b hito2/rag-embeddings` | [x] | Mario | |
| **1.2** | **📦 Instalación de dependencias** | | | |
| 1.2.1 | Crear `package.json`: `npm init -y` | [x] | Mario | |
| 1.2.2 | Instalar dependencias de producción: `npm install dotenv better-sqlite3 express` | [x] | Mario | |
| 1.2.3 | Instalar dependencias de desarrollo: `npm install --save-dev nodemon` | [x] | Mario | |
| **1.3** | **⚙ Configuración de package.json** | | | |
| 1.3.1 | Configurar como ESM: `"type": "module"` | [x] | Mario | |
| 1.3.2 | Añadir script: `"procesar"` | ☐ | | |
| 1.3.3 | Añadir script: `"embeddings"` | ☐ | | |
| 1.3.4 | Añadir script: `"cargar-bd"` | ☐ | | |
| 1.3.5 | Añadir script: `"ingesta"` | ☐ | | |
| 1.3.6 | Añadir script: `"test-busqueda"` | ☐ | | |
| 1.3.7 | Añadir script: `"dev"` | ☐ | | |
| **1.4** | **📂 Estructura de carpetas** | |  | |
| 1.4.1 | Crear carpeta `datos/` | [x] | Mario | |
| 1.4.2 | Crear carpeta `scripts/` | [x] | Mario | |
| 1.4.3 | Crear carpeta `backend/` | [x] | Mario | |
| **1.5** | **🔧 Archivos de configuración** | |  | |
| 1.5.1 | Crear archivo `.env` con variables | [x] | Mario | |
| 1.5.2 | Crear `.env.example` (template) | [x] | Mario | |
| 1.5.3 | Crear `.gitignore` con exclusiones necesarias | [x] | Mario | |
| **1.6** | **📄 Archivo ROF** | |  | |
| 1.6.1 | Obtener ROF del centro en formato texto | [x] | Mario | |
| 1.6.2 | Guardar en `datos/rof.txt` | [x] | Mario | |
| 1.6.3 | Verificar que tenga al menos 5000 caracteres | [x] | Mario | |

---

## 💻 Parte 2: Scripts de Ingesta de Datos

| # | Tarea | Archivo | Estado | Asignado a | Observaciones |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **2.1** | **📄 `scripts/procesar_rof.js`** | `procesar_rof.js` | |  | |
| 2.1.1 | Implementar `procesarROF()`: Leer `datos/rof.txt` | ☐ | Adam | |
| 2.1.2 | Dividir texto en párrafos (`\n\n`) | ☐ | Adam | |
| 2.1.3 | Filtrar fragmentos menores a 100 caracteres | ☐ | Adam | |
| 2.1.4 | Crear array con estructura: `{id, contenido, fuente, pagina}` | ☐ | Adam | |
| 2.1.5 | Guardar resultado en `datos/chunks.json` | ☐ | Adam | |
| 2.1.6 | Mostrar estadísticas en consola | ☐ | Adam | |
| 2.1.7 | Probar ejecución: `npm run procesar` | ☐ | Adam | |
| **2.2** | **🔧 `scripts/generar_embeddings.js`** | `generar_embeddings.js` | |  | |
| 2.2.1 | Implementar `generarEmbedding(texto)` (POST a Ollama) | ☐ | Mario | |
| 2.2.2 | Implementar `procesarTodos()`: Leer `datos/chunks.json` | ☐ | Mario | |
| 2.2.3 | Generar embedding por cada chunk | ☐ | Mario | |
| 2.2.4 | Guardar en `datos/embeddings.json` | ☐ | Mario | |
| 2.2.5 | Mostrar estadísticas (progreso, tiempo, dimensión) | ☐ | Mario | |
| 2.2.6 | Probar ejecución: `npm run embeddings` | ☐ | Mario | |
| **2.3** | **💾 `scripts/cargar_bd.js`** | `cargar_bd.js` | |  | |
| 2.3.1 | Implementar `inicializarBD()`: Crear `datos/rof_vectores.db` | ☐ | Ale | |
| 2.3.2 | Crear tabla `fragmentos` con campos correctos | ☐ | Ale | |
| 2.3.3 | Implementar `insertarFragmentos()`: Leer `datos/embeddings.json` | ☐ | Ale | |
| 2.3.4 | Usar transacciones (`BEGIN`, `COMMIT`) para la inserción | ☐ | Ale | |
| 2.3.5 | Implementar `verificarBD()` (contar fragmentos) | ☐ | Ale | |
| 2.3.6 | Probar ejecución: `npm run cargar-bd` | ☐ | Ale | |
| **2.4** | **🔍 `scripts/test_busqueda.js`** | `test_busqueda.js` | |  | |
| 2.4.1 | Implementar `calcularSimilitud(v1, v2)` (Coseno) | [x] | Claudia | |
| 2.4.2 | Implementar `buscarFragmentosSimilares(consulta, limite=3)` | [x] | Claudia | |
| 2.4.3 | Generar embedding de consulta y buscar en BD | ☐ | Claudia | |
| 2.4.4 | Mostrar N fragmentos más similares y su puntuación | ☐ | Claudia | |
| 2.4.5 | Crear ejemplos de prueba (e.g., Horario, Inasistencias, Uniforme) | ☐ | Claudia | |
| 2.4.6 | Probar ejecución: `npm run test-busqueda` | ☐ | Claudia | |

---

## 🐳 Parte 3: Dockerización

| # | Tarea | Estado | Asignado a | Observaciones |
| :--- | :--- | :--- | :--- | :--- |
| 3.1 | **🐳 Docker Compose para Ollama** | |  | |
| 3.1.1 | Crear archivo `docker-compose.yml` | ☐ | | |
| 3.1.2 | Levantar contenedor: `docker compose up -d` | ☐ | | |
| 3.1.3 | Verificar: `curl http://localhost:11434/api/tags` | ☐ | | |
| 3.1.4 | Descargar modelo de embeddings: `docker exec ollama_rag ollama pull nomic-embed-text` | ☐ | | |
| 3.1.5 | Descargar modelo LLM: `docker exec ollama_rag ollama pull mistral` | ☐ | | |

---

## 📖 Parte 4: Documentación

| # | Tarea | Archivo | Estado | Asignado a | Observaciones |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 4.1 | **📖 `README.md`** | `README.md` | [x] | Claudia | |
| 4.1.1 | Descripción del proyecto (RAG, embeddings, flujo) | [x] | Claudia | |
| 4.1.2 | Requisitos (Node.js, Docker, Ollama, ROF) | [x] | Claudia | |
| 4.1.3 | Instalación (clonar, instalar, configurar) | [x] | Claudia | |
| 4.1.4 | Ejecución completa (`npm run ingesta`) | [x] | Claudia | |
| 4.1.5 | Scripts individuales | [x] | Claudia | |
| 4.1.6 | Estructura de datos (archivos y tabla `fragmentos`) | [x] | Claudia | |
| 4.1.7 | Explicación: ¿Qué es un embedding? | ☐ | | |
| 4.1.8 | Decisiones de diseño (SQLite3, nomic-embed-text, tamaño mínimo) | [x] | Claudia | |
| 4.1.9 | Próximas Fases (backend, frontend) | [x] | Claudia | |

---

## 🧪 Parte 5: Validación y Tests

| # | Tarea | Archivo | Estado | Asignado a | Observaciones |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 5.1 | **🧪 `validacion.http`** | `validacion.http` | |  | |
| 5.1.1 | Crear archivo `validacion.http` | ☐ | Mario | |
| 5.1.2 | Añadir test de Ollama: `GET http://localhost:11434/api/tags` | ☐ | Mario | |
| 5.1.3 | Añadir verificación de generación de embeddings | ☐ | Mario | |
| 5.1.4 | Añadir verificación de BD creada | ☐ | Mario | |

---

## 🌿 Parte 6: Git y Control de Versiones

| # | Tarea | Estado | Asignado a | Observaciones |
| :--- | :--- | :--- | :--- | :--- |
| 6.1 | Hacer commit inicial (`git commit -m "feat: Inicialización del proyecto y estructura básica"`) | ☐ | | |
| 6.2 | Commit tras cada script completado (`procesar`, `embeddings`, `cargar-bd`) | ☐ | | |
| 6.3 | Push a repositorio remoto | ☐ | | |
| 6.4 | Crear Pull Request (si aplica) | ☐ | | |

---