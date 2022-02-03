                    // Referencias HTML
//---------------------------------------------------------------//

const lblNuevoTicket = document.querySelector('#lblNuevoTicket');
const btnCrear = document.querySelector('button'); //Porque en esta pantalla solo hay un boton puedo hacer referencia al boton
//---------------------------------------------------------------//


//Programacion de los diferentes eventos que estara escuchando el cliente en esta pantalla "nuevo-ticket"
const socket = io();

// Aca se estara escuchando el evento "connect" que basicamente es cuando el usuario se conecte al servidor desde esta pagina
socket.on('connect', () => {

    btnCrear.disabled = false; // En esta pantalla cuando el cliente se conecte al servidor, el boton estara habilitado,
                              // caso contrario cuando este desconectado del servidor este boton estara deshabilitado

});

// Aca se estara escuchando el evento "disconnect" que basicamente es cuando el usuario se desconecte del servidor desde esta pagina

socket.on('disconnect', () => {

    btnCrear.disabled = true;
});

// Aca se estara escuchando el evento "ultimo-ticket" que escuchara el evento emitido al presionar el boton en esta pantalla, y que retornara el ultimo ticket

socket.on('ultimo-ticket', (ultimo) => {

    lblNuevoTicket.innerText = 'Ticket:' + ultimo;
});


btnCrear.addEventListener( 'click', () => { //Este listener es el clik sobre el boton
    
    socket.emit('siguiente-ticket', null, ( ticket ) => { 
//De segundo argumento envio null porque no tengo ningun payload que enviar,
//En el tercer argumento voy a recibir el ticket que viene del callback socket.on(siguiente-Ticket) en el controlador

        lblNuevoTicket.innerText = ticket;
        console.log('Desde el server', ticket );
    });

});