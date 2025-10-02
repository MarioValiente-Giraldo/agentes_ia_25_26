# Checklist Proyecto Manual HTTP

## 🏗 Parte 1: Configuración inicial

- [X] Crear carpeta del proyecto: `manual-http-[nombre-iniciales-apellidos]` (Mario Valiente)

- [ ] Inicializar proyecto Node.js con `npm init` (Mario Valiente)

- [ ] Completar datos en `package.json` (nombre, versión, descripción, autor)

- [ ] Instalar dependencias: `json-server` y `dotenv`

- [ ] Configurar `"type": "module"` en `package.json`

- [ ] Añadir scripts en `package.json`:

  - [ ] `"server:up"`

  - [ ] `"crud:curl"`

  - [ ] `"validate"`

- [ ] Crear estructura de carpetas:

  - [ ] `src/`

  - [ ] `src/db/`

  - [ ] `scripts/`

  - [ ] `images/`

- [ ] Crear `.env` con variables: `PORT`, `API_BASE_URL`, `NODE_ENV`

- [ ] Crear `.env.example`

- [ ] Crear `.gitignore` con exclusiones necesarias

- [ ] Crear `src/db/db.json` con estructura inicial (`students`, `courses`, `enrollments`)

## 💻 Parte 2: Script CRUD (`crud-curl.js`)
- [ ] Importar y configurar `dotenv`

- [ ] Construir `BASE_URL` desde variables de entorno

- [ ] Implementar funciones:

  - [ ] `createStudent(studentData)`

  - [ ] `readAllStudents()`

  - [ ] `readStudentById(id)`

  - [ ] `updateStudent(id, studentData)`

  - [ ] `patchStudent(id, partialData)`

  - [ ] `deleteStudent(id)`

- [ ] Ejecutar todas las funciones en orden con mensajes claros

## 📚 Parte 3: Documentación CRUD con cURL
- [ ] Documentar operaciones CRUD:

  - [ ] CREATE

  - [ ] READ ALL

  - [ ] READ BY ID

  - [ ] UPDATE

  - [ ] PATCH

  - [ ] DELETE

- [ ] Incluir comando cURL completo

- [ ] Explicar cada parte del comando (flags, método HTTP, headers)

- [ ] Incluir respuesta HTTP real (headers + body)

- [ ] Explicar código de estado HTTP

- [ ] Guardar documentación en `README.md`

## ⚡ Parte 4: Thunder Client
- [ ] Crear colección `CRUD Students API`

- [ ] Configurar entorno de variables (`baseUrl`, `port`, `fullUrl`)

- [ ] Crear peticiones:

  - [ ] CREATE Student (POST)

  - [ ] GET All Students (GET)

  - [ ] GET Student by ID (GET)

  - [ ] UPDATE Student (PUT)

  - [ ] PATCH Student (PATCH)

  - [ ] DELETE Student (DELETE)

- [ ] Realizar capturas de cada petición (request + response)

- [ ] Guardar capturas en `images/`

- [ ] Documentar uso y capturas en `README.md`

## 📝 Parte 5: REST Client
- [ ] Crear archivo `peticiones-crud.http`

- [ ] Definir variables (@baseUrl, @port, @apiUrl)

- [ ] Implementar peticiones:

  - [ ] CREATE Student

  - [ ] READ All Students

  - [ ] READ Student by ID

  - [ ] READ estudiantes activos

  - [ ] READ filtrar por nivel

  - [ ] UPDATE Student (PUT)

  - [ ] PATCH Student

  - [ ] DELETE Student

- [ ] Probar todas las peticiones desde VS Code

## ✅ Parte 6: Script de validación
- [ ] Crear `scripts/validate.sh`

- [ ] Validar existencia de:

  - [ ] `package.json`

  - [ ] `src/db/db.json`

  - [ ] `.gitignore`

  - [ ] `.env.example`

  - [ ] `README.md`

  - [ ] `checklist.md`

  - [ ] `peticiones-crud.http`

- [ ] Validar carpetas: `src/`, `scripts/`, `images/`

- [ ] Validar archivo `src/crud-curl.js`

- [ ] Validar configuración de `package.json`:

  - [ ] `"type": "module"`

  - [ ] Dependencias

  - [ ] Scripts

- [ ] Verificar al menos 6 capturas en `images/`

- [ ] Mostrar mensaje de validación completa

- [ ] Dar permisos de ejecución y probar en terminal


## 🌿 Parte 7: Git y GitHub
- [ ] Crear repositorio en GitHub con nombre correcto

- [ ] Añadir al profesor como colaborador

- [ ] Inicializar Git en proyecto local

- [ ] Conectar repositorio remoto

- [ ] Crear rama `main` y subir código inicial

- [ ] Crear rama `m1/http-request-response`

- [ ] Hacer commits incrementales por cada fase

- [ ] Usar convención en mensajes de commit (`feat:`, `docs:`, `fix:`)

- [ ] Subir rama y crear Pull Request hacia `main`

- [ ] Incluir en PR: resumen, división de trabajo, dificultades, soluciones

- [ ] Asignar al profesor como reviewer

- [ ] Tras aprobación, actualizar `main` local

- [ ] Crear tag `M1/http-request-response` y subirlo