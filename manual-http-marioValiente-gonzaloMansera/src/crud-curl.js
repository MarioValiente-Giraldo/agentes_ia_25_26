import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = `${API_BASE_UR}:${PORT}`;
/**
 *  Crea un estudiante
 * @param {Object} studentData - Parametro que contiene los datos del estudiante a crear 
 */
function createStudent(studentData){
    const curl = `curl -X POST ${BASE_URL} -H "Content-Type: application/json" -d '${studentData}'`;
    console.log(curl)
}

function readAllStudent(){
    const curl = `curl -X GET ${BASE_URL}`;
    console.log(curl);
}

function readStudentById(id){
    const curl = `curl -X GET ${BASE_URL}/${id}`;
    console.log(curl);
}