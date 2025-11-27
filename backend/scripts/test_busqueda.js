
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
async function buscarFragmentosSimilares(consulta, limite = 3) {

    async function generarEmbedding() {
        const respuesta = await fetch("http://localhost:11434/api/embed", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ model: "nomic-embed-text", input: consulta })
        });
        const datos = await respuesta.json();
        return datos.embeddings[0];
    }

    const fragmentos = await fetch("/fragmentos.json").then(r => r.json());
    const embeddingConsulta = await generarEmbedding();

    const resultados = fragmentos.map(frag => ({
        texto: frag.texto,
        similitud: calcularSimilitud(embeddingConsulta, frag.embedding)
    }));

    resultados.sort((a, b) => b.similitud - a.similitud);
    return resultados.slice(0, limite);
}

