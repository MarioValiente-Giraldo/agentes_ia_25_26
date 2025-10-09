import { config } from 'dotenv';

config();


const PORT= process.env.PORT;
const NODE_ENV=process.env.NODE_ENV;
const SERVER_URL=process.env.SERVER_URL || "http://localhost:4000";
const AI_API_URL=process.env.AI_API_URL;
const HOST = process.env.HOST;
const URL_CLIENTE=process.env.URL_CLIENTE;



const traerPostVinos = async () => {
   try {
     const response = await fetch(`${URL_CLIENTE}`);
    const data = await response.json();
    console.log(data);
   } catch (error) {
    
   }
}

traerPostVinos();