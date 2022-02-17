const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
let multer = require("multer");

let storage = multer.diskStorage({
  destination: function (__, __, callback) {
    callback(null, "uploads");
  },
  filename: function (__, file, callback) {
    callback(null, `${file.fieldname}-${Date.now()}`);
  },
});

let upload = multer({storage});

router.use(express.json());
router.use(express.urlencoded({extended: true}));

let container = {};
const productosJson = fs.readFileSync(
  path.resolve(__dirname, "../persistencia/productos.json"),
  "utf-8"
);

productos.push(new Producto("Chocolate", 450, "/chocolate.jpg"));
productos.push(new Producto("Avena", 280, "/avena.jpg"));

const productos = JSON.parse(productosJson);

class Producto {
  constructor(title, price, thumbnail) {
    this.id = productos.length + 1;
    this.title = title;
    this.price = price;
    this.thumbnail = thumbnail;
    this.timestamp = Date.now();
  }
}

let removerItem = (array, item) => {
  let i = array.indexOf(item);
  i !== -1 && array.splice(i, 1);
};

// Rutas primera entrega del proyecto
router.get("/listar/:id?", (req, res) => {
  try {
    if (productos.length == 0) {
      res.status(404).json({Error: "No hay productos cargados"});
    } else if (req.params.id <= productos.length) {
      res.status(200).json(productos[req.params.id - 1]);
    } else if (req.params.id > productos.length) {
      res.status(404).json({Error: "Producto no encontrado"});
    } else {
      res.status(200).json(productos);
    }
  } catch (error) {
    res.status(500).json({error});
  }
});

router.post("/agregar", (req, res) => {
  let title = req.body.title;
  let price = parseInt(req.body.price);
  let thumbnail = req.body.thumbnail;

  try {
    productos.push(new Producto(title, price, thumbnail));
    console.log(productos);
    fs.writeFileSync(
      path.resolve(__dirname, "../persistencia/productos.json"),
      JSON.stringify(productos),
      "utf-8"
    );
    return res.status(200).json(productos[productos.length - 1]);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/actualizar/:id", (req, res) => {
  try {
    let id = parseInt(req.params.id);
    productos[id - 1] = {
      id,
      title: req.body.title,
      price: parseInt(req.body.price),
      thumbnail: req.body.thumbnail,
    };
    res.json(productos[id - 1]);
  } catch (error) {
    throw new Error(error);
  }
});

router.delete("/borrar/:id", (req, res) => {
  try {
    let id = parseInt(req.params.id);

    if (id < productos.length) {
      res.status(200).json(productos[id - 1]);
      removerItem(productos, productos[id - 1]);
    } else {
      res.status(200).json({msg: "No hay productos"});
    }
  } catch (error) {
    throw new Error(error);
  }
});
// Fin de rutas primera entrega del proyecto

// Extras al desafío
router.get("/vista", (_, res) => {
  container["productos"] = productos;
  res.render("main", container);
});

router.post("/guardarform", upload.single("thumbnail"), (req, res, next) => {
  let title = req.body.title;
  let price = parseInt(req.body.price);
  let thumbnail = req.file.path;

  try {
    if (!req.file) {
      const error = new Error("no hay archivos");
      error.httpStatusCode = 400;
      return next(error);
    }

    productos.push(new Producto(title, price, thumbnail));
    res.redirect("/");
  } catch (error) {
    res.status(404).json(error);
  }
});
module.exports = router;
