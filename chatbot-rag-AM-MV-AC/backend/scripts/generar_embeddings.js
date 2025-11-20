//Hacemos los imports necesarios 
import fs from 'fs';
import dotenv from 'dotenv';

//Cargamos las variables de entorno
dotenv.config();

const OLLAMA_URL = process.env.OLLAMA_URL;
const CHUNKS_PATH = process.env.CHUNKS_PATH;
const OUTPUT_PATH = process.env.OUTPUT_PATH;
/**
 * Esta función comprobará si tenemos conexión con Ollama
 */
async function comprobarConexionOllama(){
    try{
        const response = await fetch(OLLAMA_URL,{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "nomic-embed-text",
                prompt: "ping"
            })
        });
        if(!response.ok)throw new Error();

        console.log("✅ Conectado a Ollama");
    }catch(error){
        console.log("\n❌ No se pudo conectar a Ollama. ¿Está ejecutándose?");
    }
}

async function generarEmbedding(text){
    try{
        const response = await fetch(OLLAMA_URL,{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "nomic-embed-text",
                prompt: texto
            })
        });
        if(!response.ok) throw new Error("Respuesta no válida");

        const data = await response.json();
        return data.embedding;
    }catch(error){
        console.error("⚠️ Error generando embedding:", err);
    }
}

async function procesarTodos(){
    await comprobarConexionOllama();
    
    //Leemos los chunks
    console.log(`📝 Cargando fragmentos desde ${CHUNKS_PATH} ...`);
    const chunks = JSON.parse(fs.readFileSync(CHUNKS_PATH, "utf-8"));
    const totalChunks = chunks.length;
    console.log(`📝 Cargados ${total} fragmentos\n`);

    //Preparamos constantes para generar los embeddings
    console.log("Generando embeddings:");

    const resultados = [];
    const inicio = Date.now();

    //Recorremos y procesamos cada chunk 
    for (let i = 0; i < totalChunks; i++){
        const chunk = chunks[i];

        //Barra de progreso
        const progreso = Math.floor(((i + 1) / total) * 30);
        const barra = "█".repeat(progreso) + " ".repeat(30 - progreso);
        process.stdout.write(`\r[${barra}] ${i + 1}/${total}`);

        //Obtenemos el vector a partir del embedding del chunk
        const vector = await generarEmbedding(chunk.texto || chunk.chunk || "");
        
        //Si no hay vector nos saldrá un error
        if (!vector) {
        console.error("\n❌ Embedding NULL. Abortando.");
        }

        //Si hay vector, lo introduceremos en nuestro array resultado
        resultados.push({
        id: chunk.id,
        embedding: vector
        });

        //Guarda todos los embeddings generados en la ruta indicada en .env.
        fs.writeFileSync(OUTPUT_PATH, JSON.stringify(resultados, null, 2));

    
    }


}