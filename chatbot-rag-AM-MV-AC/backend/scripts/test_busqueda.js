// Hacemos los imports necesarios 
import fs from 'fs';
import dotenv from 'dotenv';
import Database from 'better-sqlite3'; // Necesario para leer la BD SQLite

// Cargamos las variables de entorno
dotenv.config();

// Variables de entorno necesarias
const OLLAMA_URL = process.env.OLLAMA_URL;
const DB_PATH = process.env.DB_PATH; // Ruta a ./datos/rof_vectores.db
const EMBEDDING_MODEL = process.env.OLLAMA_MODEL_EMBEDDINGS || 'nomic-embed-text'; 

// --- Funciones de Utilidad ---

/**
 * @name generarEmbedding
 * Genera el embedding vectorial para un fragmento de texto dado (la consulta).
 * @param {string} text - La consulta del usuario.
 * @returns {number[] | null} El vector del embedding, o null si hay un error.
 */
async function generarEmbedding(text) {
    try {
        const response = await fetch(`${OLLAMA_URL}/api/embeddings`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: EMBEDDING_MODEL,
                prompt: text // Usa 'prompt' para el texto de entrada
            })
        });
        if (!response.ok) throw new Error("Respuesta de Ollama no válida.");

        const data = await response.json();
        return data.embedding;
    } catch (error) {
        console.error("⚠️ Error generando embedding de consulta:", error.message);
        return null;
    }
}

// --- Requisito: Similitud de Coseno ---

/**
 * @name calcularSimilitud
 * Calcula la Similitud de Coseno entre dos vectores (v1 y v2)[cite: 247].
 * La fórmula es: Cos(θ) = (v1 . v2) / (||v1|| * ||v2||)
 * Retorna un valor entre 0 y 1 (donde 1 es idéntico)[cite: 249].
 * @param {number[]} v1 - Vector 1 (Vector de la consulta)
 * @param {number[]} v2 - Vector 2 (Vector del fragmento de la BD)
 * @returns {number} Similitud de Coseno
 */
function calcularSimilitud(v1, v2) {
    if (v1.length !== v2.length) {
        return 0; 
    }

    let dotProduct = 0; // Producto Punto (numerador)
    let magnitudeA = 0; // Magnitud ||v1||
    let magnitudeB = 0; // Magnitud ||v2||

    // Calcular Producto Punto y la suma de cuadrados de las magnitudes
    for (let i = 0; i < v1.length; i++) {
        dotProduct += v1[i] * v2[i];
        magnitudeA += v1[i] * v1[i];
        magnitudeB += v2[i] * v2[i];
    }

    // Calcular la raíz cuadrada para obtener las magnitudes
    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    // Evitar división por cero
    if (magnitudeA === 0 || magnitudeB === 0) {
        return 0; 
    }

    // Aplicar la fórmula 
    return dotProduct / (magnitudeA * magnitudeB);
}

// --- Requisito: Búsqueda de Fragmentos ---

/**
 * @name buscarFragmentosSimilares
 * Genera el embedding de la consulta, lee la BD, calcula la similitud con cada fragmento
 * y devuelve los N fragmentos más similares [cite: 250-257].
 * @param {string} consulta - La pregunta del usuario.
 * @param {number} limite - Número máximo de resultados a devolver (N).
 */
async function buscarFragmentosSimilares(consulta, limite = 3) {
    console.log(`\n🔍 Buscando fragmentos similares a: "${consulta}"`); // Salida esperada [cite: 266]

    // 1. Generar embedding de la consulta [cite: 251]
    const queryVector = await generarEmbedding(consulta);
    if (!queryVector) {
        return [];
    }

    // 2. Conectar a la BD y obtener todos los fragmentos [cite: 256]
    const db = new Database(DB_PATH, { readonly: true });
    const fragmentos = db.prepare('SELECT contenido, embedding FROM fragmentos').all();
    db.close();
    
    let resultadosConSimilitud = [];

    // 3. Iterar y calcular similitud con cada fragmento
    for (const frag of fragmentos) {
        // El embedding está almacenado como JSON TEXT, hay que parsearlo
        const chunkVector = JSON.parse(frag.embedding);
        
        // Calcular la similitud de coseno [cite: 256]
        const similitud = calcularSimilitud(queryVector, chunkVector);

        resultadosConSimilitud.push({
            contenido: frag.contenido,
            similitud: similitud
        });
    }

    // 4. Ordenar y limitar resultados [cite: 257]
    resultadosConSimilitud.sort((a, b) => b.similitud - a.similitud);

    const topResultados = resultadosConSimilitud.slice(0, limite);
    
    // 5. Mostrar puntuación de similitud [cite: 258, 267-273]
    console.log(`\n📍 Resultados (similitud):`);
    topResultados.forEach((res, index) => {
        // Muestra puntuación de similitud [cite: 258]
        console.log(`${index + 1}. [${res.similitud.toFixed(3)}]`); 
        console.log(`"${res.contenido.substring(0, 50)}..."`); // Muestra un extracto
    });

    return topResultados;
}


// --- Función Principal de Ejecución de Pruebas ---

/**
 * @name ejecutarPruebasBusqueda
 * Función principal para ejecutar las consultas de prueba requeridas.
 */
async function ejecutarPruebasBusqueda() {
    // Verificar que la BD exista antes de intentar abrirla
    if (!fs.existsSync(DB_PATH)) {
        console.error(`❌ Base de datos no encontrada en ${DB_PATH}. Ejecute 'npm run ingesta' primero.`);
        return;
    }

    // Ejemplos de prueba con las consultas requeridas [cite: 260-262]
    await buscarFragmentosSimilares("¿Cuál es el horario de entrada?"); 
    await buscarFragmentosSimilares("¿Qué hacer ante inasistencias?"); 
    await buscarFragmentosSimilares("Uniforme del centro"); 
}

// Ejecutar si se llama directamente (npm run test-busqueda)
if (import.meta.url === `file://${process.argv[1]}`) {
    ejecutarPruebasBusqueda();
}
export { generarEmbedding, buscarFragmentosSimilares, calcularSimilitud };