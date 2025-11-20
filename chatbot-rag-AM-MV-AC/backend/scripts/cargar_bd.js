import fs from 'fs';
import Database from 'better-sqlite3'; 
import dotenv from 'dotenv';
dotenv.config(); // Carga las variables del archivo .env

// --- Leer rutas desde .env ---
const DB_PATH = process.env.DB_PATH; // Ruta de la base de datos SQLite
const JSON_PATH = process.env.JSON_PATH; // Ruta del archivo JSON con embeddings

// --- Validación de las rutas ---
if (!DB_PATH || !JSON_PATH) {
    console.error("❌ No se cargaron las variables de .env"); 
    process.exit(1);
}


// --- Función para mostrar barra de progreso ---
function mostrarProgreso(actual, total) {
    const longitud = 20; // Longitud de la barra
    const porcentaje = actual / total; // Porcentaje completado
    const completado = Math.round(longitud * porcentaje); // Cuántos bloques mostrar
    const barra = '█'.repeat(completado) + '-'.repeat(longitud - completado); // Construir barra
    process.stdout.write(`\r[${barra}] ${actual}/${total} ${Math.round(porcentaje * 100)}%`); // Imprime barra en la misma línea
    if (actual === total) process.stdout.write('\n'); // Salto de línea al terminar
}

// --- Inicializar BD ---
function inicializarBD() {
    console.log('🗄 Inicializando base de datos...');
    const db = new Database(DB_PATH); // Abrir o crear la base de datos
    db.exec(`
        CREATE TABLE IF NOT EXISTS fragmentos ( 
            id INTEGER PRIMARY KEY, // ID autoincremental
            contenido TEXT NOT NULL, // Texto del fragmento
            embedding TEXT NOT NULL, // Embedding en formato JSON
            fuente TEXT, // Fuente del fragmento (opcional)
            pagina INTEGER, // Número de página (opcional)
            creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP // Fecha de creación automática
        )
    `);
    console.log("✅ Tabla 'fragmentos' creada");
    return db; // Devolver objeto de la base de datos
}

// --- Insertar fragmentos ---
function insertarFragmentos(db) {
    if (!fs.existsSync(JSON_PATH)) {
        console.error('No se encontró embeddings.json'); // Error si no existe el JSON
        return;
    }

    const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8')); // Leer y parsear JSON
    console.log(`📥 Insertando ${data.length} fragmentos...`);

    // Preparar sentencias SQL
    const insertStmt = db.prepare(`
        INSERT INTO fragmentos (contenido, embedding, fuente, pagina)
        VALUES (?, ?, ?, ?)
    `); // Inserción de fragmentos
    const checkStmt = db.prepare(`SELECT id FROM fragmentos WHERE contenido = ?`); // Comprobar existencia

    // Transacción para insertar muchos fragmentos de manera eficiente
    const insertMany = db.transaction((fragments) => {
        fragments.forEach((f, i) => {
            const exists = checkStmt.get(f.contenido); // Verificar si el fragmento ya existe
            if (!exists) {
                insertStmt.run(
                    f.contenido,
                    JSON.stringify(f.embedding), // Guardar embedding como JSON
                    f.fuente || null, // Fuente opcional
                    f.pagina || null  // Página opcional
                );
            }
            mostrarProgreso(i + 1, fragments.length); // Actualizar barra de progreso
        });
    });

    insertMany(data); // Ejecutar la transacción
    console.log('✅ Base de datos cargada exitosamente');
}

// --- Verificar BD ---
function verificarBD(db) {
    const count = db.prepare('SELECT COUNT(*) AS total FROM fragmentos').get().total; // Contar fragmentos
    const sizeBytes = fs.statSync(DB_PATH).size; // Tamaño del archivo de la DB
    const sizeMB = (sizeBytes / (1024 * 1024)).toFixed(1); // Convertir a MB
    const integrity = db.prepare('PRAGMA integrity_check').get()['integrity_check']; // Comprobar integridad

    console.log(`📊 Fragmentos en BD: ${count}`);
    console.log(`💾 Tamaño de archivo: ${sizeMB} MB`);
    if (integrity !== 'ok') {
        console.error('❌ Error de integridad en la base de datos');
    } else {
        console.log('✅ Integridad de la BD verificada');
}
}

// --- Flujo principal ---
function main() {
    // Crear carpeta si no existe 
    const carpeta = DB_PATH.includes('/') ? DB_PATH.split('/').slice(0, -1).join('/') : '.';
    if (!fs.existsSync(carpeta)) fs.mkdirSync(carpeta, { recursive: true });

    const db = inicializarBD(); // Inicializar la base de datos
    insertarFragmentos(db); // Insertar fragmentos desde JSON
    verificarBD(db); // Verificar base de datos
}

// Ejecutar el programa
main();
