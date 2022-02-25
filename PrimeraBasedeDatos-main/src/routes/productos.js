import express from 'express';
import cors from 'cors';
const router = express.Router();
import {io} from '../app.js';
import Productos from '../services/Productos.js'

router.use(express.json()); 
router.use(express.urlencoded({extended: true}));
router.use(cors());
const productosService = new Productos();


//GETS
router.get('/', (req,res) => {+
    productosService.getProducts().then(result => {
        res.send(result);
    })
})

router.get('/:id', (req, res) => {
    let pId = req.params.id; 
    pId = parseInt(pId);
    productosService.getProductById(pId).then(result => {
        res.send(result);
    })
})

//POSTS
router.post('/',(req,res)=>{
    let cuerpo = req.body;
    if(!cuerpo.title || !cuerpo.price || !cuerpo.thumbnail) return res.send({status:"error", message:"Not enough data"});
    productosService.registerProduct(cuerpo).then(result => {
        res.send(result);
        if(result.status==="success"){
            productosService.getProducts().then(result=>{
                io.emit('productsList',result);
            })
        }
    })
})

//PUTS
router.put('/:id', (req,res) => {
    let pId = parseInt(req.params.id);
    let body = req.body;
    productosService.updateProduct(pId,body).then(result => {
        res.send(result);
    })
})

// DELETES
router.delete('/:id', (req,res) => {
    let pId = parseInt(req.params.id);
    productosService.deleteProductById(pId).then(result => {
        res.send(result);
    })
})

export default router;