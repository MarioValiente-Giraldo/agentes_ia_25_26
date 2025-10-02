//IMPORTACIONES
import dotenv from "dotenv";

//AÑADO LAS VARIABLES .env A ESTE FICHERO
dotenv.config();

//Todas las varibales están en process.env.NOMBRE_DE_LA_VARIABLE

//Mostrar por consola las varivables de ENTORNO.
console.log("URL de acceso:", process.env.URL);
console.log("Puerto:", process.env.PORT);
console.log(`URL con puerto, ${process.env.URL}:${Number(process.env.PORT)+1}`);