//Fichero encargado de levantar una API_REST con Express
import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import dataAPISpanishBeer from './db/db.js';

config();


const PORT= process.env.PORT;
const NODE_ENV=process.env.NODE_ENV;
const SERVER_URL=process.env.SERVER_URL || "http://localhost:4000";
const AI_API_URL=process.env.AI_API_URL;
const HOST = process.env.HOST;

const app = express();

// CORS
app.use(cors());

// Voy a permitir JSON como cuerpo de peticiones

app.use(express.json());

//Middleware

app.use((req,res,next)=>{
    const timeDate = new Date().toISOString;
    console.log(`${timeDate} ${req.method} ${req.url} - IP ${req.ip}`);
    
    next();
});

//Bienvenida
app.get(`/`,(req,res)=>{
    res.json({
        message:"Mini API de Cervezas",
        version:"1.0.0",
        endpoints:{
            "GET /beers" : "Obtiene todos los post de mi api",
            "DELETE /beer/:id": "Elimina una cerveza por su ID"

        }

    })
});
app.get("/beer",(req,res)=>{
    console.log("Petición GET para traer los post de mi api");
    res.json({
        succes:true,
        data:dataAPISpanishBeer,
        // Para que se autoincremente necesito  count:beers.lenght
        count: dataAPISpanishBeer.lenght,

    });
});

// DELETE - Eliminar una cerveza por ID
app.delete("/beer/:id", (req, res) => {
    console.log("Petición DELETE para eliminar una cerveza"); 
    res.json({
        success: true,
        data:dataAPISpanishBeer,
        count: dataAPISpanishBeer.length
    });
});


//Escuchar el servidor 
app.listen(PORT,HOST,()=>{
    console.log(`🍄🍄🍄Servidor Mario🍄🍄🍄 -----> ${HOST}:${PORT}` );
})