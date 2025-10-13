import dotenv from "dotenv";
import { exec } from "child_process";
import util from "util";
import { uid } from "uid";

dotenv.config();

const execPromise = util.promisify(exec);
const BASE_URL = `${process.env.API_BASE_URL}:${process.env.PORT}/students`;
/**
 * Ejecuta un comando 'curl' en el shell del sistema operativo
 * y captura su salida de forma asíncrona.
 *
 * @param {string} curlCommand El comando completo de curl a ejecutar .
 * @returns {Promise<string | null>} Una promesa que se resuelve con la salida estándar (stdout) limpia del comando,
 * o 'null' si ocurre un error durante la ejecución.
 * @async
 */
async function runCurl(curlCommand) {
  try {
    //execPromise ejecuta el comando y no avanza hasta recibir su respuesta
    const { stdout, stderr } = await execPromise(curlCommand);

    // Si hay contenido en el error estándar, lo muestra como una advertencia
    if (stderr) console.error("⚠️ stderr:", stderr);

    // Retorna la salida estándar limpia (sin espacios o saltos de línea al inicio/final)
    return stdout.trim();
  } catch (error) {
    // Captura y registra cualquier error crítico de ejecución del comando
    console.error("❌ Error al ejecutar curl:", error.message);
    return null;
  }
}

/** Crear un estudiante */
async function createStudent(studentData) {
  const jsonData = JSON.stringify(studentData).replace(/"/g, '\\"');
  const curl = `curl -s -X POST ${BASE_URL} -H "Content-Type: application/json" -d "${jsonData}"`;
  const output = await runCurl(curl);
  try {
    const data = JSON.parse(output);
    console.log("✅ Estudiante creado:", data);
    return data;
  } catch {
    console.log("⚠️ Respuesta sin formato JSON:", output);
  }
}

/** Leer todos los estudiantes */
async function readAllStudents() {
  const curl = `curl -s -X GET ${BASE_URL}`;
  const output = await runCurl(curl);
  try {
    const data = JSON.parse(output);
    console.log("📚 Todos los estudiantes:", data);
    return data;
  } catch {
    console.log(output);
  }
}

/** Leer un estudiante por ID */
async function readStudentById(id) {
  const curl = `curl -s -X GET ${BASE_URL}/${id}`;
  const output = await runCurl(curl);
  try {
    const data = JSON.parse(output);
    console.log("👤 Estudiante encontrado:", data);
    return data;
  } catch {
    console.log(output);
  }
}

/** Actualizar estudiante (PUT) */
async function updateStudent(id, studentData) {
  const jsonData = JSON.stringify(studentData).replace(/"/g, '\\"');
  const curl = `curl -s -X PUT ${BASE_URL}/${id} -H "Content-Type: application/json" -d "${jsonData}"`;
  const output = await runCurl(curl);
  try {
    const data = JSON.parse(output);
    console.log("🔁 Estudiante actualizado:", data);
    return data;
  } catch {
    console.log(output);
  }
}

/** Actualización parcial (PATCH) */
async function patchStudent(id, partialData) {
  const jsonData = JSON.stringify(partialData).replace(/"/g, '\\"');
  const curl = `curl -s -X PATCH ${BASE_URL}/${id} -H "Content-Type: application/json" -d "${jsonData}"`;
  const output = await runCurl(curl);
  try {
    const data = JSON.parse(output);
    console.log("🧩 Estudiante actualizado parcialmente:", data);
    return data;
  } catch {
    console.log(output);
  }
}

/** Eliminar estudiante */
async function deleteStudent(id) {
  const curl = `curl -s -X DELETE ${BASE_URL}/${id}`;
  const output = await runCurl(curl);
  try {
    const data = JSON.parse(output);
    console.log("🗑️ Estudiante eliminado:", data);
    return data;
  } catch {
    console.log(output);
  }
}

/** Test CRUD completo */
async function testCrud() {
  console.log("\n=== INICIO DEL TEST CRUD ===\n");

  const newId = uid(4);
  const newStudent = {
    id: newId,
    name: "Mario Valiente",
    email: "mario.valiente@email.com",
    enrollmentDate: "2024-10-01",
    active: true,
    level: "beginner",
  };

  console.log(`[1] Creando estudiante con ID ${newId}...`);
  await createStudent(newStudent);

  console.log("\n[2] Leyendo todos los estudiantes...");
  await readAllStudents();

  console.log(`\n[3] Leyendo estudiante con ID ${newId}...`);
  await readStudentById(newId);

  console.log(`\n[4] Actualizando estudiante (PUT)...`);
  await updateStudent(newId, { ...newStudent, level: "advanced" });

  console.log(`\n[5] Actualizando parcialmente estudiante (PATCH)...`);
  await patchStudent(newId, { active: false });

  console.log(`\n[6] Eliminando estudiante...`);
  await deleteStudent(newId);

  console.log("\n=== FIN DEL TEST CRUD === ✅\n");
}

testCrud();

