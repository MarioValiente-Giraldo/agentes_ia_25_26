// Hacemos los imports necesarios 
import fs from 'fs';
import dotenv from 'dotenv';

// Cargamos las variables de entorno
dotenv.config();

const OLLAMA_URL = process.env.OLLAMA_URL;
const CHUNKS_PATH = process.env.CHUNKS_PATH;
const OUTPUT_PATH = process.env.OUTPUT_PATH;

/**
 * @name comprobarConexionOllama
 * Esta función comprueba si existe conexión con el servicio Ollama
 * usando el endpoint de embeddings que es compatible con el modelo.
 */
async function comprobarConexionOllama(){
    try{
        
        const response = await fetch(`${OLLAMA_URL}/api/embeddings`,{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "nomic-embed-text",
                prompt: "ping"
            })
        });
        
        if(!response.ok) {
            // Si falla, intentamos ver el error específico
            const errText = await response.text(); 
            throw new Error(`Ollama respondió con error: ${response.status} - ${errText}`);
        }

        console.log("✅ Conectado a Ollama");
    }catch(error){
        console.error("\n❌ Error de conexión con Ollama:", error.message);
        console.log("👉 Asegúrate de ejecutar: 'ollama pull nomic-embed-text'");
        process.exit(1); 
    }
}

/**
 * @name generarEmbedding
 * Genera el embedding vectorial (representación numérica) para un fragmento de texto dado.
 * Utiliza el endpoint /api/embeddings de Ollama con el modelo nomic-embed-text.
 * @param {string} text - El fragmento de texto a convertir en vector.
 * @returns {number[] | null} Un array de números que representa el vector, o null si hay un error.
 */
async function generarEmbedding(text){
    try{
        const response = await fetch(`${OLLAMA_URL}/api/embeddings`,{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "nomic-embed-text",
                prompt: text
            })
        });
        if(!response.ok) throw new Error("Respuesta no válida del servicio Ollama.");

        const data = await response.json();
        return data.embedding;
    }catch(error){
        console.error("⚠️ Error generando embedding:", error);
        return null;
    }
}

/**
 * @name procesarTodos
 * Función principal del script. 
 * 1. Verifica conexión a Ollama.
 * 2. Lee el archivo de fragmentos (chunks.json).
 * 3. Itera sobre cada fragmento, genera su embedding y muestra el progreso.
 * 4. Almacena todos los embeddings en el archivo de salida (embeddings.json).
 * 5. Muestra estadísticas finales (tiempo y dimensión).
 */
async function procesarTodos(){
    await comprobarConexionOllama();
    
    // Leemos los chunks
    if (!fs.existsSync(CHUNKS_PATH)) {
        console.error(`❌ No se encontró el archivo de chunks en: ${CHUNKS_PATH}`);
        process.exit(1);
    }

    console.log(`📝 Cargando fragmentos desde ${CHUNKS_PATH} ...`);
    const chunks = JSON.parse(fs.readFileSync(CHUNKS_PATH, "utf-8"));
    const totalChunks = chunks.length;
    console.log(`📝 Cargados ${totalChunks} fragmentos\n`);

    // Preparamos constantes para generar los embeddings
    console.log("Generando embeddings:");

    const resultados = [];
    const inicio = Date.now();
    let dimension = 0; // Para capturar la dimensión (ej. 768)

    // Recorremos y procesamos cada chunk 
    for (let i = 0; i < totalChunks; i++){
        const chunk = chunks[i];

        // Barra de progreso
        const progreso = Math.floor(((i + 1) / totalChunks) * 30);
        const barra = "█".repeat(progreso) + " ".repeat(30 - progreso);
        process.stdout.write(`\r[${barra}] ${i + 1}/${totalChunks}`);

        // Obtenemos el vector a partir del embedding del chunk
        // Intenta obtener el texto de 'contenido', 'texto' o 'chunk'
        const textoAProcesar = chunk.contenido || chunk.texto || chunk.chunk || "";
        const vector = await generarEmbedding(textoAProcesar);
        
        // Si no hay vector, saltamos este chunk pero no rompemos el proceso
        if (!vector) {
            console.error(`\n❌ Embedding NULL en chunk ID ${chunk.id}. Saltando...`);
            continue;
        }

        // Guardamos todo el objeto chunk original (id, contenido, fuente, pagina)
        // y le añadimos el campo embedding.
        resultados.push({
            ...chunk, 
            embedding: vector
        });

        // Capturar la dimensión solo una vez
        if (dimension === 0 && vector.length > 0) {
            dimension = vector.length;
        }
    }

    // Guardar solo una vez después de todo el procesamiento 
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(resultados, null, 2));

    const duracion = ((Date.now() - inicio) / 1000).toFixed(2);
    
    // Mostrar resultados finales
    console.log(`\n\n✅ Embeddings generados exitosamente`);
    console.log(`⏱️ Tiempo total: ${duracion} segundos`);
    console.log(`💾 Guardados en: ${OUTPUT_PATH}`);
    console.log(`📏 Dimensión de cada embedding: ${dimension}`);
}

// Ejecutamos la función principal directamente
procesarTodos();