document.addEventListener("DOMContentLoaded", () => {
  const socket = io();

  // Formulario de ingreso de productos

  const name = document.querySelector("#name");
  const price = document.querySelector("#price");
  const thumbnail = document.querySelector("#thumbnail");
  const form = document.getElementById("form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (name.value && price.value && thumbnail.value) {
      let producto = {
        name: name.value,
        price: price.value,
        thumbnail: thumbnail.value,
      };

      socket.emit("ingreso", producto);

      name.value = "";
      price.value = "";
      thumbnail.value = "";
    } else {
      alert("Por favor, complete todos los campos!!!");
    }
  });

  socket.on("productos", (data) => {
    render(data);
  });

  const render = (data) => {
    let html = data
      .map((producto) => {
        return `<tr style="vertical-align: middle">
              <td>${producto.name}</td>
              <td>${producto.price}</td>
              <td>
                <img src="${producto.thumbnail}" alt="${producto.name}" height="110" />
              </td>
            </tr>`;
      })
      .join(" ");
    document.getElementById("productos").innerHTML = html;
  };

  // Ingreso de mensaje para chat grupal
  let user = document.getElementById("mail");
  let mensaje = document.getElementById("message");

  const addMessage = () => {
    let message = {
      user: user.value,
      message: mensaje.value,
      date: new Date().toLocaleString(),
    };

    socket.emit("new-message", message);
    return false;
  };

  const renderMessages = (messages) => {
    let html = messages
      .map((message) => {
        return ` <div>
      <strong style="color:blue;">${message.user}</strong>
      <span style="color:brown;">${message.date}</span>
      <i style="color:green;">${message.message}</i>
      </div>
      `;
      })
      .join(" ");
    document.getElementById("insertMessages").innerHTML = html;
  };

  document.getElementById("formMessage").addEventListener("submit", (e) => {
    e.preventDefault();
    if (user.value) {
      addMessage();
      user.value = " ";
      mensaje.value = " ";
    } else {
      alert("Ingresar nombre de usuario para enviar un mensaje");
    }
  });

  socket.on("messages", (messages) => {
    renderMessages(messages);
  });
});
