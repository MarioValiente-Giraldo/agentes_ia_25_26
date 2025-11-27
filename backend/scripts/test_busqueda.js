
/**
 * Función que calcula la similitud de coseno entre dos vectores
 * @param {object} v1- Primer vector
 * @param {object} v2 - Segundo vector
 * @return {number} - 0: No similitud, 1: Son
 */
function calcularSimilitud(v1, v2){

    const magnitudV1 = Math.sqrt(v1.reduce((suma, num) => {
        suma+= (num * num);
        return suma;
    }, 0));
    const magnitudV2 = Math.sqrt(v2.reduce((suma,num) => {
        suma+= (num * num);
        return suma;
    },0));

    const productoVectores = v1.reduce((suma, valor, indice) => {
        suma += (valor * v2[indice]);
        return suma;
    },0);

    const productoSimilitudes = magnitudV1 * magnitudV2;

    const similitud = productoVectores / productoSimilitudes;

    return similitud;

}

/**
 * Genera el embedding de la consulta y devuelve los fragmentos más similares con su puntuación
 * @param {string} consulta - Texto de la consulta
 * @param {number} limite - Número máximo de fragmentos a devolver
 * @return {Array} - Array de objetos con fragmento y puntuación
*/
async function buscarFragmentosSimilares(consulta, limite = 3){

    //generar embedding de la consulta

    const respuesta = await fetch("http://localhost:11434/api/embed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: "nomic-embed-text",
            input: consulta
        })
    });
    const datos = await respuesta.json();
    const embeddingConsulta = datos.embeddings[0];

    //leer base de datos de fragmentos

    async function leerBD(){
        const respuesta = await fetch("datos/embeddings.json");
        return await respuesta.json();

    }
    const fragmentos = await leerBD();

    // retorno n fragmentos con mayor similitud

    let resultados = [];
    for(const frag of fragmentos){
        const simil = calcularSimilitud(embeddingConsulta, frag.embedding);
        resultados.push({
            fragmento: frag.texto,
            similitud: simil
        });
    }
    resultados.sort((a,b)=> b.similitud - a.similitud);
    const mejores = resultados.slice(0,limite);

    //mostrar puntuaciones de similitud

    console.log("Similitudes: ");
    mejores.forEach(resultado =>{
        console.log(resultado.similitud.toFixed(4), "→", resultado.fragmento);
    });
    return mejores;
}

/**
 * Función para hacer ejemplos de prueba con consultas
 */
async function probarConsultas(){
    const consultas = [
        "¿Cuál es el horario de entrada?",
        "¿Qué hacer ante inasistencias?",
        "Uniforme del centro"
    ];
    for (const consulta of consultas){
        console.log(`\nResultado: ${consulta}`);
        const resultados = await buscarFragmentosSimilares(consulta); 
        resultados.forEach(res=> {
            console.log(res.similitud.toFixed(4), "→",res.fragmento);
        });
    }
}

