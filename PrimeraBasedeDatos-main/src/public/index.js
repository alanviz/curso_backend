const socket = io(); // instancia desde el lado del cliente
//---------------------------EVENTOS DE SOCKET --------------------------------------
socket.on('productsList',data=>{
    let products = data.payload;
    fetch('templates/productTable.handlebars').then(string=>string.text()).then(template=>{ // transforma la template en un texto plano
        const processedTemplate = Handlebars.compile(template); // compila la plantilla usando Handlebars
        const templateObject={
            productos: products
        }
        const html = processedTemplate(templateObject); //pasamos la plantilla procesada con el objeto para que substituya el array of pets
        let div = document.getElementById('productTable');
        div.innerHTML=html; // pega el contenido de templates en el div de index.html
    })
})

let input = document.getElementById('mensaje');
let sendButton = document.getElementById('enviar');
let user = document.getElementById('email');
sendButton.addEventListener('click', (e)=>{
    socket.emit('message', {user: user.value, message: input.value});
});

socket.on('welcome', data=>{
    console.log('el evento welcome ha sido escuchado',data);
});

socket.on('messagelog', data=>{
    let p = document.getElementById('log');
    let mensajes = data.map(message=>{
        return `<div><span class="user">${message.user} <span class="date">[${message.date}]</span> <span class="message">${message.message}</span></span></div>`
    }).join('');
    p.innerHTML= mensajes;
})

//-----------------------------FIN DE SOCKET ----------------------------------------------

document.addEventListener('submit', enviarFormulario);

function enviarFormulario(event) {
    event.preventDefault();
    let form = document.getElementById('productForm');
    let data = new FormData(form);
    fetch('/api/productos', {
        method: 'POST',
        body: data
    }).then(result => {
        return result.json();
    }).then(json => {
        Swal.fire({
            title: 'Exito',
            text: json.message,
            icon: 'success',
            timer: 2000,
        })
    })
}

document.getElementById("image").onchange = (e)=>{
    let read = new FileReader();
    read.onload = e =>{
        document.querySelector('.image-text').innerHTML = "Looking good :)"
        document.getElementById("preview").src = e.target.result;
    }
    
    read.readAsDataURL(e.target.files[0])
}