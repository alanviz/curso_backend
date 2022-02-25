import express from 'express';
import cors from 'cors';
import {engine} from 'express-handlebars';
import Contenedor from './classes/Contenedor.js';
import productosRouter from './routes/productos.js';
import messagesRouter from './routes/messages.js';
import upload from './services/uploader.js';
import __dirname from './utils.js';
import {Server} from 'socket.io';
import { saveMsg } from './utils.js';
import Messages from './services/Messages.js';

const messagesService = new Messages();

const app = express();
const PORT = process.env.PORT || 8080;
const productos = new Contenedor('./files/productos.txt');

const server = app.listen(PORT, () => {
    console.log("Servidor escuchando en: ", PORT)
});

export const io = new Server(server);

app.engine('handlebars',engine())
app.set('views',__dirname+'/views')
app.set('view engine','handlebars')

app.use(express.json()); 
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use((req,res,next)=>{
    console.log(new Date().toTimeString().split(" ")[0], req.method, req.url);
    next();
})
app.use(express.static(__dirname+'/public'));
app.use('/api/productos', productosRouter);
app.use('/api/messages', messagesRouter);

app.post('/api/uploadfile',upload.fields([
    {
        name:'file', maxCount:1
    },
    {
        name:"documents", maxCount:3
    }
]),(req,res)=>{
    const files = req.files;
    if(!files||files.length===0){
        res.status(500).send({messsage:"No se subió archivo"})
    }
    res.send(files);
})

app.get('/view/productos',(req,res)=>{
    productos.getAll().then(result=>{
        let info = result.payload;
        let preparedObject = {
            productos : info
        }
        res.render('productos',preparedObject);
    })
})

let messages = [];

//socket
io.on('connection', async socket=>{
    console.log(`El socket ${socket.id} se ha conectado`)
    let products = await productos.getAll();
    socket.emit('productsList',products);
    console.log('Cliente conectado');
    socket.emit('messagelog', messages); // solo envia el historial de mensajes al cliente que se acaba de conectar
    socket.emit('welcome', 'BIENVENIDO A MI SOCKET'); // welcome es el nombre del evento, luego que quiero enviar al otro lado
    socket.on('message', data=>{
         const messageArr = messagesService.registerMessage(data);
         messageArr.then(result => {
             io.emit('messagelog', result.data);
         });
    })
})