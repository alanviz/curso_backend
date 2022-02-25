import {fileURLToPath} from 'url';
import {dirname} from 'path'; 
import fs from 'fs';
import moment from 'moment';

const filename= fileURLToPath(import.meta.url);
const __dirname = dirname(filename); 

export async function saveMsg(str) {
    try{
        let data = await fs.promises.readFile(__dirname+'/files/messages.txt', 'utf-8');
        console.log('esto resulta de leer', data);
        let dataObj = JSON.parse(data);
        let horario = moment();
        horario = horario.format('DD/MM/YYYY HH:mm:ss');

        let objNew = {
            user: str.user,
            message: str.message,
            date: horario
        }

        dataObj.push(objNew);
            try{
                await fs.promises.writeFile(__dirname+'/files/messages.txt', JSON.stringify(dataObj, null, 2));
                return {status: "success", message: "El mensaje se añadio con exito", data: dataObj}
            } catch(err) {
                return {status: "error", message: "No se pudo añadir el mensaje ", err};
            }
        
    } catch(err){
        let horario = moment();
        horario = horario.format('YYYY-MM-DD HH:mm');


        let objNew = {
            user: str.user,
            message: str.message,
            date: horario
        }
        try {
            await fs.promises.writeFile(__dirname+'/files/messages.txt', JSON.stringify([objNew], null, 2));
            return {status:"success", message: "El mensaje se añadio con exito"};
        } catch(err) {
            return {status: "error", message: `No se pudo añadir el mensaje a carpeta inexistente: `, err}
        }
}
}

export default __dirname;