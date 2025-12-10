//Importaciones

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { procesarROF } from '../scripts/procesar_rof.js';

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// USAR ARCHIVOS DE PRUEBA SEPARADOS
const datosDir = path.join(__dirname, '../datos');
const rofTestPath = path.join(datosDir, 'rofTest.txt');
const chunksTestPath = path.join(datosDir, 'chunksTest.json');

/**
 * Crear un archivo de prueba antes de los tests
 */
beforeAll(() => {
    // Crear directorio si no existe
    if (!fs.existsSync(datosDir)) {
        fs.mkdirSync(datosDir, { recursive: true });
    }

    // Crear archivo de prueba con separaciones correctas
    const testText = `Este es un fragmento suficientemente largo para pasar el filtro de caracteres mínimos que hemos establecido en la función.

Fragmento pequeño.

Otro fragmento válido que debería aparecer en los resultados finales porque cumple con el requisito de longitud mínima establecido.`;

    fs.writeFileSync(rofTestPath, testText, 'utf8');
});

/**
 * Limpiar archivos después de los tests
 */
afterAll(() => {
    // Limpiar SOLO archivos de prueba
    if (fs.existsSync(chunksTestPath)) fs.unlinkSync(chunksTestPath);
    if (fs.existsSync(rofTestPath)) fs.unlinkSync(rofTestPath);
});

describe('procesarROF', () => {
    test('Devuelve array de chunks con la estructura correcta', () => {
        // PASAR RUTAS DE PRUEBA
        const chunks = procesarROF(rofTestPath, chunksTestPath);

        // Devuelve un array
        expect(Array.isArray(chunks)).toBe(true);

        // Tiene elementos
        expect(chunks.length).toBeGreaterThan(0);

        // Verificar que cada chunk tiene las propiedades
        for (const c of chunks) {
            expect(c).toHaveProperty('id');
            expect(c).toHaveProperty('contenido');
            expect(c).toHaveProperty('fuente');
            expect(c).toHaveProperty('pagina');
            expect(typeof c.id).toBe('number');
            expect(typeof c.contenido).toBe('string');
        }

        // Verificar que se descartan fragmentos pequeños (< 100 caracteres)
        expect(chunks.length).toBe(2); // solo los 2 fragmentos válidos
    });

    test('Filtra correctamente fragmentos pequeños', () => {
        const chunks = procesarROF(rofTestPath, chunksTestPath);
        
        // Todos los chunks deben tener >= 100 caracteres
        for (const c of chunks) {
            expect(c.contenido.length).toBeGreaterThanOrEqual(100);
        }
    });

    test('Genera archivo chunks.json', () => {
        procesarROF(rofTestPath, chunksTestPath);
        
        // Verificar que se creó el archivo de prueba
        expect(fs.existsSync(chunksTestPath)).toBe(true);
        
        const contenido = JSON.parse(fs.readFileSync(chunksTestPath, 'utf8'));
        expect(Array.isArray(contenido)).toBe(true);
    });
});