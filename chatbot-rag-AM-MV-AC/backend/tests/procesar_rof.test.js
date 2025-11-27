//Importaciones

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { procesarROF } from '../scripts/procesar_rof.js';


// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Crear un archivo de prueba antes de los tests
 */
beforeAll(() => {
    const testText = `
Este es un fragmento suficientemente largo para pasar el filtro de caracteres mínimos que hemos establecido en la función.

Fragmento pequeño.

Otro fragmento válido que debería aparecer en los resultados finales porque cumple con el requisito de longitud mínima establecido.
    `.trim();

    const datosDir = path.join(__dirname, '../datos');
    if (!fs.existsSync(datosDir)) {
        fs.mkdirSync(datosDir, { recursive: true });
    }

    fs.writeFileSync(path.join(datosDir, 'rof.txt'), testText, 'utf8');
});

/**
 * Limpiar archivos después de los tests
 */
afterAll(() => {
    const jsonPath = path.join(__dirname, '../datos/chunks.json');
    if (fs.existsSync(jsonPath)) fs.unlinkSync(jsonPath);
    
    const txtPath = path.join(__dirname, '../datos/rof.txt');
    if (fs.existsSync(txtPath)) fs.unlinkSync(txtPath);
});

describe('procesarROF', () => {
    test('Devuelve array de chunks con la estructura correcta', () => {
        const chunks = procesarROF();

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
        const chunks = procesarROF();
        
        // Todos los chunks deben tener >= 100 caracteres
        for (const c of chunks) {
            expect(c.contenido.length).toBeGreaterThanOrEqual(100);
        }
    });

    test('Genera archivo chunks.json', () => {
        procesarROF();
        
        const jsonPath = path.join(__dirname, '../datos/chunks.json');
        expect(fs.existsSync(jsonPath)).toBe(true);
        
        const contenido = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        expect(Array.isArray(contenido)).toBe(true);
    });
});
