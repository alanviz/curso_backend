//Para iniciar servidor
//npm install
//node index.js

const express = require('express');
const bp = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');

const router = express.Router();

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(bp.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));

app.engine('hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: 'hbs'
}));

app.set('view engine', 'hbs')


const productos = [
    {
        id: 1,
        titulo: 'Remera',
        precio: 2000,
        miniatura: 'https://ferreira.vteximg.com.br/arquivos/ids/338374-588-588/fi_cl873140_1.jpg?v=637201696755500000'
    }
];


router.get('/', (req, res) => {
    let existe;
    if (productos.length > 0) {
        existe = true;
    }else{
        existe = false;
    }
    res.status(200).render('plantilla', {productos: productos, bandera: existe})
});

router.get('/:id', (req, res) => {
    if (productos.length > 0) {
        for (let i = 0; i < productos.length; i++) {
            if (productos[i].id == req.params.id) {
               return res.status(200).json(productos[i]);
            }
        }
    }
    res.status(404).json({error: 'Producto no encontrado'})
});

router.delete('/:id', (req, res) => {
    if (productos.length > 0) {
        for (let i = 0; i < productos.length; i++) {
            if (productos[i].id == req.params.id) {
                productos.splice(i, 1)
               return res.status(200).json({
                   msj: 'Producto eliminado',
                   productos: productos.length > 0 ? productos : 'No quedan productos cargados'
               });
            }
        }
    }
    res.status(404).json({error: 'Producto no encontrado'})
});

router.post('/', (req, res) => {
    let producto = req.body;
    if (productos.length > 0) {
        let ultimo = productos.length - 1
        
        producto['id'] = productos[ultimo].id + 1;
    } else {
        producto['id'] = 1;
    };
    productos.push(producto)
    console.log(productos);
    let existe;
    if (productos.length > 0) {
        existe = true;
    }else{
        existe = false;
    }
    res.status(200).render('plantilla', {productos: productos, bandera: existe})
});

router.put('/:id', (req, res) => {
    let producto = req.body
    let id = req.params.id;
    producto['id'] = id;

    if (productos.length > 0) {
        for (let i = 0; i < productos.length; i++) {
            if (productos[i].id == id) {
                productos[i] = producto;
                return res.status(200).json({
                    msj: 'Producto editado',
                    producto: producto,
                    productos
                });
            }
        }
    };
    res.status(404).json({error: 'Producto no encontrado'})

})

app.use('/api/productos', router);

/* Servidor */
const PORT = 8080;
const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto: ${PORT}`);
});
server.on('error', err => {
    console.log('Error', err);
})