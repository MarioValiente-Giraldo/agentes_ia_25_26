import express from "express";
import cors from "cors";
import { config } from "dotenv";
import Database from 'better-sqlite3';
import { generarEmbedding, calcularSimilitud } from './scripts/test_busqueda.js';

config();

const app = express();

const PORT = Number(process.env.PORT) || 3002;
const HOST = process.env.HOST || "0.0.0.0";

const OLLAMA_URL = process.env.OLLAMA_URL;
const OLLAMA_MODEL_LLM = process.env.OLLAMA_MODEL_LLM;
const DB_PATH = process.env.DB_PATH || './backend/datos/rof_vectores.db';

// Middlewares
app.use(cors());
app.use(express.json());

// Inicializar base de datos
let db;
try {
  db = new Database(DB_PATH);
  console.log('✅ Base de datos conectada');
} catch (error) {
  console.error('❌ Error conectando a la base de datos:', error.message);
}

// ==================== FUNCIONES AUXILIARES ====================

/**
 * Busca fragmentos similares en la base de datos usando similitud de coseno
 * Usa las funciones ya existentes en test_busqueda.js
 */
function buscarFragmentosSimilares(embeddingConsulta, limite = 3) {
  try {
    // Obtener todos los fragmentos de la BD
    const fragmentos = db.prepare('SELECT * FROM fragmentos').all();

    // Calcular similitud con cada fragmento
    const resultados = fragmentos.map(frag => {
      const embedding = JSON.parse(frag.embedding);
      const similitud = calcularSimilitud(embeddingConsulta, embedding);

      return {
        id: frag.id,
        contenido: frag.contenido,
        fuente: frag.fuente,
        pagina: frag.pagina,
        similitud: similitud
      };
    });

    // Ordenar por similitud descendente y tomar los top N
    resultados.sort((a, b) => b.similitud - a.similitud);
    return resultados.slice(0, limite);
  } catch (error) {
    console.error('❌ Error buscando fragmentos:', error);
    return [];
  }
}

/**
 * Genera respuesta usando Ollama con contexto RAG
 */
async function generarRespuestaConContexto(consulta, contexto) {
  try {
    const prompt = `Eres un asistente especializado en el Reglamento de Organización y Funcionamiento (ROF) de un centro educativo.

Contexto relevante del ROF:
${contexto}

Pregunta del usuario: ${consulta}

Instrucciones:
- Responde de forma clara, concisa y profesional
- Basa tu respuesta ÚNICAMENTE en el contexto proporcionado
- Si la información no está en el contexto, indícalo claramente
- Usa un tono amigable pero informativo
- Si es relevante, cita el fragmento específico del ROF

Respuesta:`;

    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL_LLM,
        prompt: prompt,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error('Error al generar respuesta');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('❌ Error generando respuesta:', error);
    return 'Lo siento, hubo un error al generar la respuesta.';
  }
}

// ==================== RUTAS ====================

/**
 * Ruta raíz - Información del servidor
 */
app.get('/', (req, res) => {
  res.json({
    message: '🤖 Servidor RAG funcionando',
    version: '1.0.0',
    endpoints: {
      consulta: 'POST /api/consulta - Consulta con RAG completo (búsqueda + generación)',
      busqueda: 'POST /api/busqueda - Solo búsqueda por similitud',
      health: 'GET /api/health - Estado del servidor'
    }
  });
});

/**
 * Health check - Verifica estado del sistema
 */
app.get('/api/health', (req, res) => {
  try {
    // Verificar BD
    const count = db.prepare('SELECT COUNT(*) as total FROM fragmentos').get();
    
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        fragmentos: count.total,
        path: DB_PATH
      },
      ollama: {
        url: OLLAMA_URL,
        model_llm: OLLAMA_MODEL_LLM
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

/**
 * Endpoint principal: Consulta con RAG completo
 * Búsqueda semántica + Generación de respuesta con LLM
 */
app.post("/api/consulta", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ 
      error: "Debe enviar un prompt válido.",
      ejemplo: { prompt: "¿Cuál es el horario de entrada?" }
    });
  }

  try {
    console.log('\n🔍 ==========================================');
    console.log('📝 Consulta recibida:', prompt);
    console.log('==========================================');

    // 1. Generar embedding de la consulta usando función existente
    console.log('📊 Generando embedding de la consulta...');
    const embeddingConsulta = await generarEmbedding(prompt);
    
    if (!embeddingConsulta) {
      return res.status(500).json({
        error: 'No se pudo generar el embedding. ¿Está Ollama corriendo?',
        sugerencia: 'Ejecuta: docker compose up -d'
      });
    }
    console.log(`✅ Embedding generado (dimensión: ${embeddingConsulta.length})`);

    // 2. Buscar fragmentos similares en la BD
    console.log('🔎 Buscando fragmentos similares...');
    const fragmentosSimilares = buscarFragmentosSimilares(embeddingConsulta, 3);

    if (fragmentosSimilares.length === 0) {
      console.log('⚠️  No se encontraron fragmentos relevantes');
      return res.json({
        respuesta: 'No encontré información relevante en el ROF sobre tu consulta. ¿Podrías reformular la pregunta?',
        fragmentos: []
      });
    }

    console.log(`✅ Encontrados ${fragmentosSimilares.length} fragmentos relevantes:`);
    fragmentosSimilares.forEach((f, i) => {
      console.log(`   ${i + 1}. Similitud: ${(f.similitud * 100).toFixed(1)}%`);
    });

    // 3. Construir contexto a partir de los fragmentos
    const contexto = fragmentosSimilares
      .map((f, i) => `[Fragmento ${i + 1}]:\n${f.contenido}`)
      .join('\n\n---\n\n');

    // 4. Generar respuesta con el LLM
    console.log('🤖 Generando respuesta con Ollama...');
    const respuesta = await generarRespuestaConContexto(prompt, contexto);
    console.log('✅ Respuesta generada exitosamente');
    console.log('==========================================\n');

    // 5. Enviar respuesta al frontend
    res.json({
      respuesta: respuesta,
      fragmentos: fragmentosSimilares.map(f => ({
        contenido: f.contenido.length > 200 
          ? f.contenido.substring(0, 200) + '...' 
          : f.contenido,
        similitud: f.similitud.toFixed(3),
        fuente: f.fuente
      })),
      metadata: {
        total_fragmentos_analizados: fragmentosSimilares.length,
        similitud_maxima: fragmentosSimilares[0]?.similitud.toFixed(3)
      }
    });

  } catch (error) {
    console.error('❌ Error en /api/consulta:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message,
      sugerencia: 'Verifica que Ollama esté corriendo y la BD exista'
    });
  }
});

/**
 * Endpoint alternativo: Solo búsqueda por similitud (sin LLM)
 * Útil para debugging y testing
 */
app.post('/api/busqueda', async (req, res) => {
  const { prompt, limite = 5 } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ 
      error: "Debe enviar un prompt válido.",
      ejemplo: { prompt: "horario de entrada", limite: 5 }
    });
  }

  try {
    console.log('\n🔍 Búsqueda simple recibida:', prompt);

    // Generar embedding
    const embeddingConsulta = await generarEmbedding(prompt);
    
    if (!embeddingConsulta) {
      return res.status(500).json({
        error: 'No se pudo generar el embedding'
      });
    }

    // Buscar fragmentos
    const resultados = buscarFragmentosSimilares(embeddingConsulta, limite);

    console.log(`✅ ${resultados.length} resultados encontrados\n`);

    res.json({
      consulta: prompt,
      total_resultados: resultados.length,
      resultados: resultados.map((r, i) => ({
        posicion: i + 1,
        similitud: (r.similitud * 100).toFixed(1) + '%',
        similitud_raw: r.similitud.toFixed(3),
        contenido: r.contenido,
        fuente: r.fuente,
        pagina: r.pagina
      }))
    });

  } catch (error) {
    console.error('❌ Error en /api/busqueda:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

/**
 * Endpoint de prueba para verificar Ollama
 */
app.get('/api/test-ollama', async (req, res) => {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`);
    const data = await response.json();
    
    res.json({
      status: 'Ollama conectado',
      url: OLLAMA_URL,
      modelos: data.models || []
    });
  } catch (error) {
    res.status(500).json({
      status: 'Ollama desconectado',
      error: error.message,
      sugerencia: 'Ejecuta: docker compose up -d'
    });
  }
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('❌ Error no manejado:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: err.message
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    endpoint_solicitado: req.path,
    endpoints_disponibles: {
      consulta: 'POST /api/consulta',
      busqueda: 'POST /api/busqueda',
      health: 'GET /api/health',
      test_ollama: 'GET /api/test-ollama'
    }
  });
});

// Iniciar servidor
app.listen(PORT, HOST, () => {
  console.log('\n🚀 ================================================');
  console.log(`   Servidor RAG Chatbot iniciado correctamente`);
  console.log('   ================================================');
  console.log(`   📡 URL: http://${HOST}:${PORT}`);
  console.log(`   🔍 Ollama: ${OLLAMA_URL}`);
  console.log(`   🤖 Modelo LLM: ${OLLAMA_MODEL_LLM}`);
  console.log(`   💾 Base de datos: ${DB_PATH}`);
  console.log('   ================================================');

  // Verificar conexión a BD al iniciar
  try {
    const count = db.prepare('SELECT COUNT(*) as total FROM fragmentos').get();
    console.log(`   ✅ BD conectada: ${count.total} fragmentos cargados`);
  } catch (error) {
    console.error('   ❌ Error con la BD:', error.message);
    console.error('   💡 Ejecuta: npm run ingesta');
  }
  
  console.log('   ================================================\n');
  console.log('   💡 Endpoints disponibles:');
  console.log('   • POST /api/consulta - Consulta con RAG');
  console.log('   • POST /api/busqueda - Solo búsqueda');
  console.log('   • GET  /api/health - Estado del sistema');
  console.log('   • GET  /api/test-ollama - Test conexión Ollama');
  console.log('   ================================================\n');
});