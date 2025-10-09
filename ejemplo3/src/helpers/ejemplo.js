import { config } from 'dotenv';
import { exec } from 'child_process';

config();

const API_URL = process.env.API_BASE_URL;


export const  getAllUsers = () =>{
    const URL_BASE=`${API_URL}/users`;
    const cmd = `curl -s -X GET ${URL_BASE}`;
    console.log(cmd);
    
    exec(cmd,(error,stout,stderr)=>{
        if(error){
            console.error("Error al ejecutar el comando --->",error.message);
            return;
        }
        if(stderr){
            console.error("Error en la salida --->",stderr);
            return;
        }
        const data = JSON.parse(stout);
        console.log(data);
    
    })
}