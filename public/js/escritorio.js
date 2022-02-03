                    // Referencias HTML
//---------------------------------------------------------------//
const lblEscritorio = document.querySelector('h1');
const btnAtender    = document.querySelector('button');
const lblTicket     = document.querySelector('small');
const divAlerta     = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes');
//---------------------------------------------------------------//


//Obtener los parametros de la direccion URL en el navegador
const buscarParametrosURL = new URLSearchParams(window.location.search);

//Verifico si fue ingresado el escritorio que se conectara al servidor
if( !buscarParametrosURL.has('escritorio')){
    window.location = 'index.html'; // Aqui redirige al usuario al index
    throw new Error('El url escritorio es obligatorio');
}

const escritorio = buscarParametrosURL.get('escritorio');
lblEscritorio.innerHTML = escritorio;

divAlerta.style.display = 'none';

//Programacion de los diferentes eventos que estara escuchando el cliente en esta pantalla "escritorio"
const socket = io();


// Aca se estara escuchando el evento "connect" que basicamente es cuando el usuario se conecte al servidor desde esta pagina
socket.on('connect', () => {

    btnAtender.disabled = false;
//Es decir cuando el cliente se conecte al servidor en esta pantalla, el boton estara habilitado,
//caso contrario cuando se desconecte del servidor este boton estara deshabilitado

});

// Aca se estara escuchando el evento "disconnect" que basicamente es cuando el usuario se desconecte del servidor desde esta pagina
socket.on('disconnect', () => {
    // console.log('Desconectado del servidor');

    btnAtender.disabled = true;
});

// Aca se estara escuchando el evento "tickets-pendientes" que escuchara el evento emitido cuando existan tickets pendientes en cola
// este evento es llamado desde el controlador
socket.on('tickets-pendientes',(payload)=>{
    if(payload ===0){
        lblPendientes.style.display = 'none';
    }else{
        lblPendientes.style.display = '';
        lblPendientes.innerText = payload ;
    }
    lblPendientes.innerText = payload 
});


btnAtender.addEventListener( 'click', () => { //Este listener es el clik sobre el boton
    
    socket.emit('atender-ticket', {escritorio}, ({ok, ticket, msg}) =>{
        
        if(!ok){
            lblTicket.innerHTML = 'No se esta atendiendo a nadie mas, no hay tickets disponibles';
            return divAlerta.style.display = '';
        }

        lblTicket.innerHTML = 'Ticket '+ ticket.numero;
    });

});