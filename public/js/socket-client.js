                    // Referencias HTML
//---------------------------------------------------------------//
const lblOnline  = document.querySelector('#lblOnline');
const lblOffline = document.querySelector('#lblOffline');
const txtMensaje = document.querySelector('#txtMensaje');
const btnEnviar  = document.querySelector('#btnEnviar');
//---------------------------------------------------------------//


//Programacion de los diferentes eventos que estara escuchando el cliente en diferentes eventos
const socket = io();


// Aca se estara escuchando el evento "connect" que basicamente es cuando el usuario se conecte al servidor
socket.on('connect', () => {
    // console.log('Conectado');

    lblOffline.style.display = 'none';
    lblOnline.style.display  = '';

});

// Aca se estara escuchando el evento "disconnect" que basicamente es cuando el usuario se desconecte del servidor
socket.on('disconnect', () => {
    // console.log('Desconectado del servidor');

    lblOnline.style.display  = 'none';
    lblOffline.style.display = '';
});


// Aca se estara escuchando el evento "enviar-mensaje" el cual escuchara el evento que se emitira cuando se presione el boton,
// y que retornara un mensaje en la consola de los datos que pueda traer, por ejemplo de una base de datos
socket.on('enviar-mensaje', (payload) => {
    console.log( payload )
})

// El boton estara escuchando el evento click, y cuando se presione va a disparar el callback, lo que quiere decir que cada vez que
// se presione se va hacer referencia al mensaje que quiero enviar, en este ejemplo no se enviara nada, pero es para usarse por ejemplo
// con un dato que provenga de una base de datos que quiera enviar al front 
btnEnviar.addEventListener( 'click', () => {

    const mensaje = txtMensaje.value;
    const payload = {
        mensaje,
        id: '123ABC',
        fecha: new Date().getTime()
    }
    
    socket.emit( 'enviar-mensaje', payload, ( id ) => {
        console.log('Desde el server', id );
    });

});