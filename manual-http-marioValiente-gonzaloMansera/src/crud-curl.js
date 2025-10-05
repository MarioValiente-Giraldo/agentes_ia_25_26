import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = `${process.env.API_BASE_URL}:${process.env.PORT}/students`;
/**
 *  Crea un estudiante
 * @param {Object} studentData - Parametro que contiene los datos del estudiante a crear 
 */
function createStudent(studentData){
    const curl = `curl -X POST ${BASE_URL} -H "Content-Type: application/json" -d '${JSON.stringify(studentData)}'`;
    console.log(curl)
}

function readAllStudents(){
    const curl = `curl -X GET ${BASE_URL}`;
    console.log(curl);
}

function readStudentById(id){
    const curl = `curl -X GET ${BASE_URL}/${id}`;
    console.log(curl);
}

function updateStudent(id, studentData){
    const curl = `curl -X PUT ${BASE_URL}/${id} -H "Content-Type: application/json" -d '${JSON.stringify(studentData)}'`;
    console.log(curl)
}

function patchStudent(id, partialData){
    const curl = `curl -X PATCH ${BASE_URL}/${id} -H "Content-Type: application/json" -d '${JSON.stringify(partialData)}'`;
    console.log(curl);
}

function deleteStudent(id){
    const curl = `curl -X DELETE ${BASE_URL}/${id}`;
    console.log(curl);

}


function testCrud() {
  const newStudent = {
    id: 1,
    name: "Mario Valiente",
    email: "mario.valiente@email.com",
    enrollmentDate: "2024-10-01",
    active: true,
    level: "beginner"
  };

  console.log("\n=== INICIO DEL TEST CRUD ===");

  // 1. Crear
  console.log("\n[1] Creando estudiante...");
  createStudent(newStudent);
  console.log("✅ Estudiante creado\n");

  // 2. Leer todos
  console.log("[2] Leyendo todos los estudiantes...");
  readAllStudents();
  console.log("✅ Se listaron todos los estudiantes\n");

  // 3. Leer por ID
  console.log("[3] Leyendo estudiante por ID...");
  readStudentById(newStudent.id);
  console.log(`✅ Estudiante con ID ${newStudent.id} obtenido\n`);

  // 4. Actualizar (PUT)
  console.log("[4] Actualizando estudiante...");
  updateStudent(newStudent.id, {
    ...newStudent,
    level: "advanced", // cambiamos un campo
  });
  console.log("✅ Estudiante actualizado completamente (nivel avanzado)\n");

  // 5. Actualizar parcialmente
  console.log("[5] Actualizando parcialmente estudiant...");
  patchStudent(newStudent.id, { active: false });
  console.log("✅ Estudiante actualizado parcialmente (activo=false)\n");

  // 6. Eliminar
  console.log("[6] Eliminando estudiante...");
  deleteStudent(newStudent.id);
  console.log("✅ Estudiante eliminado\n");

  console.log("=== FIN DEL TEST CRUD ===\n");
}

testCrud();



