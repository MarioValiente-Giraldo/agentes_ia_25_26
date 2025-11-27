//Importaciones
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { procesarROF } from '../scripts/procesar_rof.js';

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const datosDir = path.join(__dirname, '../datos');
const rofPath = path.join(datosDir, 'rofTest.txt');
const chunkPath = path.join(datosDir, 'chunkTest.json');

/** Crear archivos de prueba antes de los tests */
beforeAll(() => {
  if (!fs.existsSync(datosDir)) {
    fs.mkdirSync(datosDir, { recursive: true });
  }

  // Crear ROF temporal con separaciones correctas (doble salto de línea)
  const testText = `Este es un fragmento suficientemente largo para pasar el filtro de caracteres mínimos que hemos establecido en la función.

Fragmento pequeño.

Otro fragmento válido que debería aparecer en los resultados finales porque cumple con el requisito de longitud mínima establecido.`;

  fs.writeFileSync(rofPath, testText, 'utf8');
});

/** Limpiar archivos después de los tests */
afterAll(() => {
  if (fs.existsSync(rofPath)) fs.unlinkSync(rofPath);
  if (fs.existsSync(chunkPath)) fs.unlinkSync(chunkPath);
});

describe('procesarROF', () => {
  test('Devuelve array de chunks con la estructura correcta', () => {
    const chunks = procesarROF(rofPath, chunkPath);

    expect(Array.isArray(chunks)).toBe(true);
    expect(chunks.length).toBeGreaterThan(0);

    for (const c of chunks) {
      expect(c).toHaveProperty('id');
      expect(c).toHaveProperty('contenido');
      expect(c).toHaveProperty('fuente');
      expect(c).toHaveProperty('pagina');
      expect(typeof c.id).toBe('number');
      expect(typeof c.contenido).toBe('string');
    }

    expect(chunks.length).toBe(2); // solo los 2 fragmentos válidos
  });

  test('Filtra correctamente fragmentos pequeños', () => {
    const chunks = procesarROF(rofPath, chunkPath);
    for (const c of chunks) {
      expect(c.contenido.length).toBeGreaterThanOrEqual(100);
    }
  });

  test('Genera archivo chunkTest.json', () => {
    procesarROF(rofPath, chunkPath);
    expect(fs.existsSync(chunkPath)).toBe(true);
    const contenido = JSON.parse(fs.readFileSync(chunkPath, 'utf8'));
    expect(Array.isArray(contenido)).toBe(true);
  });
});
