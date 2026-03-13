import fs from 'fs';
import dotenv from 'dotenv';
// Importamos las funciones esenciales de búsqueda semántica desde el script principal.
// NOTA: Estas funciones deben ser exportadas al final de tu script test_busqueda.js
import { 
    generarEmbedding, 
    buscarFragmentosSimilares, 
    calcularSimilitud 
} from '../scripts/test_busqueda.js'; 

dotenv.config();

// Obtenemos la ruta a la base de datos desde las variables de entorno.
const DB_PATH = process.env.DB_PATH;

// --- SUITE DE PRUEBAS ---

describe('Búsqueda Semántica (RAG) con Ollama y Similitud de Coseno', () => {

    // 1. Prueba Unitaria de la función de Similitud de Coseno
    test('La función calcularSimilitud debe retornar 1 para vectores idénticos', () => {
        const v1 = [1, 0, -1, 0.5];
        const v2 = [1, 0, -1, 0.5];
        // Utilizamos toBeCloseTo para manejar posibles errores de precisión flotante en JavaScript.
        expect(calcularSimilitud(v1, v2)).toBeCloseTo(1);
    });

    // 2. Prueba de la funcionalidad completa de Búsqueda
    
    // Consultas de prueba según los requisitos del proyecto.
    const consultas = [
        "¿Cuál es el horario de entrada?",
        "¿Qué hacer ante inasistencias?",
        "Uniforme del centro" 
    ];
    
    // Iteramos sobre cada consulta para crear una prueba individual (test).
    consultas.forEach(consulta => {
        test(`El script de búsqueda debe devolver fragmentos relevantes para: "${consulta}"`, async () => {

            // Verificamos la existencia de la BD para evitar fallos de I/O antes de la búsqueda.
            if (!fs.existsSync(DB_PATH)) {
                // Si la BD no existe, no podemos probar la búsqueda.
                console.warn(`\n⚠️ La BD no existe en ${DB_PATH}. Saltando prueba de búsqueda.`);
                return;
            }

            // Ejecutamos la función completa de búsqueda semántica.
            const topResultados = await buscarFragmentosSimilares(consulta, 3);
            
            // --- Validaciones (Assertions) ---

            // Muestra los resultados en consola para una inspección manual de la relevancia.
            console.log(`\nResultados de Búsqueda para: "${consulta}"`);
            // Nota: Aquí se usa 'contenido' ya que es la clave que retorna el script principal.
            topResultados.forEach((r, i) => console.log(`${i+1}. [${r.similitud.toFixed(3)}] ${r.contenido.substring(0, 50)}...`));

            // Asegura que se haya devuelto al menos un resultado.
            expect(topResultados.length).toBeGreaterThan(0);
            
            // Itera sobre los resultados para validar la estructura y el rango de la similitud.
            topResultados.forEach(r => {
                expect(r).toHaveProperty('contenido'); 
                expect(r).toHaveProperty('similitud');
                // La similitud debe estar entre 0 y 1
                expect(r.similitud).toBeGreaterThanOrEqual(0);
                expect(r.similitud).toBeLessThanOrEqual(1);
            });
        }, 30000); // Aumentamos el timeout para dar tiempo a la llamada externa de Ollama.
    });
});