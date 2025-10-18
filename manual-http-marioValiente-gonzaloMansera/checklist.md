# Checklist Proyecto Manual HTTP

## 🏗 Parte 1: Configuración inicial

- [X] Crear carpeta del proyecto: `manual-http-[nombre-iniciales-apellidos]` (Mario Valiente)
- [X] Inicializar proyecto Node.js con `npm init` (Mario Valiente)
- [x] Completar datos en `package.json` (nombre, versión, descripción, autor) (Mario Valiente)
- [x] Instalar dependencias: `json-server` y `dotenv` (Gonzalo Mansera)
- [x] Configurar `"type": "module"` en `package.json` (Gonzalo Mansera)
- [x] Añadir scripts en `package.json`:
  - [x] `"server:up"` (Gonzalo Mansera)
  - [x] `"crud:curl"` (Gonzalo Mansera)
  - [x] `"validate"` (Gonzalo Mansera)
- [x] Crear estructura de carpetas:
  - [x] `src/` (Gonzalo Mansera)
  - [x] `src/db/` (Gonzalo Mansera)
  - [x] `scripts/` (Gonzalo Mansera)
  - [x] `images/` (Gonzalo Mansera)
- [X] Crear `.env` con variables: `PORT`, `API_BASE_URL`, `NODE_ENV` (Mario Valiente)
- [X] Crear `.env.example` (Mario Valiente)
- [X] Crear `.gitignore` con exclusiones necesarias (Mario Valiente)
- [x] Crear `src/db/db.json` con estructura inicial (`students`, `courses`, `enrollments`) (Gonzalo Mansera)

## 💻 Parte 2: Script CRUD (`crud-curl.js`)

- [X] Importar y configurar `dotenv` (Mario Valiente)
- [X] Construir `BASE_URL` desde variables de entorno (Mario Valiente)
- [X] Implementar funciones:
  - [X] `createStudent(studentData)` (Mario Valiente)
  - [X]`readAllStudents()` (Mario Valiente)
  - [X] `readStudentById(id)` (Mario Valiente)
  - [X] `updateStudent(id, studentData)` (Mario Valiente)
  - [X] `patchStudent(id, partialData)` (Mario Valiente)
  - [X] `deleteStudent(id)` (Mario Valiente)
- [X] Ejecutar todas las funciones en orden con mensajes claros (Mario Valiente)

## 📚 Parte 3: Documentación CRUD con cURL

- [x] Documentar operaciones CRUD:
  - [x] CREATE (Gonzalo Mansera)
  - [x] READ ALL (Gonzalo Mansera)
  - [x] READ BY ID (Gonzalo Mansera)
  - [x] UPDATE (Gonzalo Mansera)
  - [x] PATCH (Gonzalo Mansera)
  - [x] DELETE (Gonzalo Mansera)
- [x] Incluir comando cURL completo (Gonzalo Mansera)
- [x] Explicar cada parte del comando (flags, método HTTP, headers) (Gonzalo Mansera)
- [x] Incluir respuesta HTTP real (headers + body) (Gonzalo Mansera)
- [x] Explicar código de estado HTTP (Gonzalo Mansera)
- [x] Guardar documentación en `README.md` (Gonzalo Mansera)

## ⚡ Parte 4: Thunder Client

- [ ] Crear colección `CRUD Students API` (Mario Valiente)
- [ ] Configurar entorno de variables (`baseUrl`, `port`, `fullUrl`) (Mario Valiente)
- [X] Crear peticiones:
  - [X] CREATE Student (POST) (Mario Valiente)
  - [X] GET All Students (GET) (Mario Valiente)
  - [X] GET Student by ID (GET) (Mario Valiente)
  - [X] UPDATE Student (PUT) (Mario Valiente)
  - [X] PATCH Student (PATCH) (Mario Valiente)
  - [X] DELETE Student (DELETE) (Mario Valiente)
- [X] Realizar capturas de cada petición (request + response) (Mario Valiente)
- [X] Guardar capturas en `images/` (Mario Valiente)
- [x] Documentar uso y capturas en `README.md` (Gonzalo Mansera)

## 📝 Parte 5: REST Client

- [x] Crear archivo `peticiones-crud.http` (Gonzalo Mansera)
- [X] Definir variables (@baseUrl, @port, @apiUrl) (Gonzalo Mansera)
- [X] Implementar peticiones:
  - [X] CREATE Student (Gonzalo Mansera)
  - [X] READ All Students (Gonzalo Mansera)
  - [X] READ Student by ID (Gonzalo Mansera)
  - [X] READ estudiantes activos (Gonzalo Mansera)
  - [X] READ filtrar por nivel (Gonzalo Mansera)
  - [X] UPDATE Student (PUT) (Gonzalo Mansera)
  - [X] PATCH Student (Gonzalo Mansera)
  - [X] DELETE Student (Gonzalo Mansera)
- [X] Probar todas las peticiones desde VS Code (Gonzalo Mansera)

## ✅ Parte 6: Script de validación

- [X] Crear `scripts/validate.sh` (Mario Valiente)
- [X] Validar existencia de:
  - [X] `package.json` (Mario Valiente)
  - [X] `src/db/db.json` (Mario Valiente)
  - [X] `.gitignore` (Mario Valiente)
  - [X] `.env.example` (Mario Valiente)
  - [X] `README.md` (Mario Valiente)
  - [X] `checklist.md` (Mario Valiente)
  - [X] `peticiones-crud.http` (Mario Valiente)
- [X] Validar carpetas: `src/`, `scripts/`, `images/` (Mario Valiente)
- [X] Validar archivo `src/crud-curl.js` (Mario Valiente)
- [X] Validar configuración de `package.json`:
  - [X] `"type": "module"` (Mario Valiente)
  - [X] Dependencias (Mario Valiente)
  - [X] Scripts (Mario Valiente)
- [X] Verificar al menos 6 capturas en `images/` (Mario Valiente)
- [X] Mostrar mensaje de validación completa (Mario Valiente)
- [X] Dar permisos de ejecución y probar en terminal (Mario Valiente)

## 🌿 Parte 7: Git y GitHub

- [X] Crear repositorio en GitHub con nombre correcto (Mario Valiente)
- [X] Añadir al profesor como colaborador (Mario Valiente)
- [X] Inicializar Git en proyecto local (Mario Valiente)
- [X] Conectar repositorio remoto (Gonzalo Mansera)
- [x] Crear rama `main` y subir código inicial (Mario Valiente)
- [x] Crear rama `m1/http-request-response` (Mario Valiente)
- [x] Hacer commits incrementales por cada fase (Mario Valiente y Gonzalo Mansera)
- [X] Usar convención en mensajes de commit (`feat:`, `docs:`, `fix:`) (Mario Valiente y Gonzalo Mansera)
- [x] Subir rama y crear Pull Request hacia `main` (Gonzalo Mansera)
- [x] Incluir en PR: resumen, división de trabajo, dificultades, soluciones (Gonzalo Mansera)
- [x] Asignar al profesor como reviewer (Gonzalo Mansera)
- [x] Tras aprobación, actualizar `main` local (Gonzalo Mansera)
- [x] Crear tag `M1/http-request-response` y subirlo (Mario Valiente)