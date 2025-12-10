import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { generarEmbedding } from '../scripts/test_busqueda.js'; // tu función original

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Archivos de prueba
const outputPath = path.join(__dirname, '../datos/embeddings.json');
const chunksEmbeddings = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

/**
 * Función para calcular similitud de coseno entre vectores
 */
function calcularSimilitud(v1, v2) {
  if (!v1 || !v2) throw new Error('Embeddings inválidos');
  const dot = v1.reduce((sum, val, i) => sum + val * v2[i], 0);
  const mag1 = Math.sqrt(v1.reduce((sum, val) => sum + val * val, 0));
  const mag2 = Math.sqrt(v2.reduce((sum, val) => sum + val * val, 0));
  return mag1 && mag2 ? dot / (mag1 * mag2) : 0;
}

/**
 * Función para buscar fragmentos más similares
 */
function buscarFragmentosSimilares(embeddingConsulta, chunks, limite = 3) {
  const resultados = chunks.map(c => ({
    id: c.id,
    texto: c.texto || c.contenido || "",
    similitud: calcularSimilitud(embeddingConsulta, c.embedding)
  }));
  resultados.sort((a, b) => b.similitud - a.similitud);
  return resultados.slice(0, limite);
}

describe('Búsqueda semántica con Ollama', () => {
  const consultas = [
    "¿Cuál es el horario de entrada?",
    "¿Qué hacer ante inasistencias?",
    "Uniforme del centro"
  ];

  consultas.forEach(consulta => {
    test(`Buscar fragmentos similares a: "${consulta}"`, async () => {
      const embConsulta = await generarEmbedding(consulta); // aquí llama a Ollama
      if (!embConsulta) throw new Error('No se pudo generar el embedding');

      const resultados = buscarFragmentosSimilares(embConsulta, chunksEmbeddings, 3);

      console.log(`\nResultados para: "${consulta}"`);
      resultados.forEach((r, i) => console.log(`${i+1}. [${r.similitud.toFixed(2)}] ${r.texto}`));

      expect(resultados.length).toBeGreaterThan(0);
      resultados.forEach(r => {
        expect(r).toHaveProperty('texto');
        expect(r).toHaveProperty('similitud');
        expect(r.similitud).toBeGreaterThanOrEqual(0);
        expect(r.similitud).toBeLessThanOrEqual(1);
      });
    });
  });
});
