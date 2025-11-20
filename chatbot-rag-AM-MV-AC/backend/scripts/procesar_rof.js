//IMPORTAR FS Y DOTENV

import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Función principal que procesa el archivo ROF
 * Lee el archivo de texto, divide en fragmentos, filtra los cortos,
 * crea un array de objetos con id, contenido, fuente y página,
 * guarda el resultado en JSON y muestra estadísticas.
 *
 * @returns {Array} chunks - Array de fragmentos procesados
 */
function procesarROF() {
    const rutaEntrada = 'datos/rof.txt';
    const rutaSalida = 'datos/chunks.json';

    // Leer archivo
    const texto = fs.readFileSync(rutaEntrada, 'utf8');

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

        chunks.push({
            id: id++,
            contenido: limpio,
            fuente: "rof.txt",
            pagina: null // Si no existe dato de página, se deja nulo
        });
    }

    // Guardar en datos/chunks.json
    fs.writeFileSync(rutaSalida, JSON.stringify(chunks, null, 2), 'utf8');

    // Cálculo total de caracteres sumando longitud de cada fragmento
    let totalCaracteres = 0;
    for (const c of chunks) {
    totalCaracteres += c.contenido.length;
    }

    // Evitar división por cero
    const promedio = chunks.length > 0 
        ? Math.round(totalCaracteres / chunks.length) 
        : 0;

    // Mostrar resultados en consola
    console.log("✅ ROF procesado exitosamente");
    console.log(`📊 Fragmentos generados: ${total}`);
    console.log(`📏 Tamaño promedio: ${promedio} caracteres`);
    console.log(`📄 Primer fragmento: "${chunks[0]?.contenido.substring(0, 50)}..."`);
    console.log(`⚠ Fragmentos descartados: ${descartados} (muy pequeños)`);
    return chunks;
}

// Ejecutar si se llama desde npm run procesar
procesarROF();