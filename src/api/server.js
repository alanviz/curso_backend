const express = require("express");
const app = express();
const handlebars = require("express-handlebars");
const fs = require("fs");
const path = require("path");

// Middlewares
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Routes
app.use("/productos", require("../routes/productos.route"));
app.use("/carrito", require("../routes/carrito.route"));
app.use(express.static("public"));

// Web Sockets
const http = require("http").Server(app);
const io = require("socket.io")(http);

let jsonMessages = fs.readFileSync(
  path.resolve(__dirname, "../persistencia/messages.json"),
  "utf-8"
);

let arrayMessages = JSON.parse(jsonMessages);
let arrayProductos = [];

io.on("connection", (socket) => {
  io.sockets.emit("productos", arrayProductos);
  io.sockets.emit("messages", arrayMessages);

  socket.on("ingreso", (data) => {
    arrayProductos.push(data);
    io.sockets.emit("productos", arrayProductos);
  });

  socket.on("new-message", (message) => {
    arrayMessages.push(message);
    const jsonMessages = JSON.stringify(arrayMessages);
    fs.writeFileSync(
      path.resolve(__dirname, "../persistencia/messages.json"),
      jsonMessages,
      "utf-8"
    );
    io.sockets.emit("messages", arrayMessages);
  });
});

// Hbs
app.engine(
  "hbs",
  handlebars({
    layoutsDir: __dirname + "../../../views/layouts",
    extname: "hbs",
    defaultLayout: "index.hbs",
  })
);

app.set("view engine", "hbs");

// Settings
const server = http.listen(8080, () => {
  console.log(`Servidor corriendo en el puerto ${server.address().port}`);
});
