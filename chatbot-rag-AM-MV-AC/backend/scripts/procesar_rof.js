//Importaciones

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

// Obtener directorio actual en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Función principal que procesa el archivo ROF
 * Lee el archivo de texto, divide en fragmentos, filtra los cortos,
 * crea un array de objetos con id, contenido, fuente y página,
 * guarda el resultado en JSON y muestra estadísticas.
 *
 * @param {string} rutaEntrada - Ruta del archivo de entrada (opcional)
 * @param {string} rutaSalida - Ruta del archivo de salida (opcional)
 * @returns {Array} chunks - Array de fragmentos procesados
 */
export function procesarROF(rutaEntrada = null, rutaSalida = null) {
    try {
        // Usar rutas por defecto si no se proporcionan
        const archivoEntrada = rutaEntrada || path.join(__dirname, '../datos/rof.txt');
        const archivoSalida = rutaSalida || path.join(__dirname, '../datos/chunks.json');

        // Leer archivo
        const texto = fs.readFileSync(archivoEntrada, 'utf8');

        // Dividir por líneas en blanco
        const fragmentos = texto.split(/\n\s*\n/);

        let chunks = [];
        let descartados = 0;
        let id = 1;

        for (const frag of fragmentos) {
            const limpio = frag.trim();

            // Filtrar fragmentos menores de 100 caracteres
            if (limpio.length < 100) {
                descartados++;
                continue;
            }

            // Usar el nombre del archivo de entrada como fuente
            const nombreFuente = path.basename(archivoEntrada);

            chunks.push({
                id: id++,
                contenido: limpio,
                fuente: nombreFuente,
                pagina: null
            });
        }

        // Guardar en archivo JSON
        fs.writeFileSync(archivoSalida, JSON.stringify(chunks, null, 2), 'utf8');

        // Cálculo total de caracteres
        let totalCaracteres = 0;
        for (const c of chunks) {
            totalCaracteres += c.contenido.length;
        }

        const promedio = chunks.length > 0 
            ? Math.round(totalCaracteres / chunks.length) 
            : 0;

        // Mostrar resultados en consola
        console.log("✅ ROF procesado exitosamente");
        console.log(`📊 Fragmentos generados: ${chunks.length}`);
        console.log(`📏 Tamaño promedio: ${promedio} caracteres`);
        console.log(`📄 Primer fragmento: "${chunks[0]?.contenido.substring(0, 50)}..."`);
        console.log(`⚠️ Fragmentos descartados: ${descartados} (muy pequeños)`);
        
        return chunks;
    } catch (error) {
        console.error('❌ Error al procesar ROF:', error.message);
        throw error;
    }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
    procesarROF();
}