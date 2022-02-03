// Controlador principal de las funciones de la aplicacion

const TicketControl = require("../models/ticket-control");


const ticketControl = new TicketControl(); 
//Se creara una nueva instancia de TicketControl, se dispara su constructor, este constructor dispara el metodo init, en este metodo
//se va a leer el archivo "data.json"

const socketController = (socket) => {
// Este controlador estara escuchando que sucede en esta parte del servidor, pero no reinicia el controlador anterior

    //Todos los eventos se disparan cuando un cliente se conecta
    socket.emit('ultimo-ticket', ticketControl.ultimo);
    socket.emit('estado-actual', ticketControl.ultimos4);
    socket.emit('tickets-pendientes',ticketControl.tickets.length);
    
// Aca se estara escuchando el evento 'siguiente-ticket' el cual se ejecutara cuando se presione el boton en la pantalla nuevo-ticket.html
    socket.on('siguiente-ticket', ( payload, callback ) => { //En el callback se envia el siguiente ticket a mostrar
        
        const siguiente = ticketControl.siguiente();
        callback(siguiente);
        socket.broadcast.emit('tickets-pendientes',ticketControl.tickets.length);
        //Notifica que hay un nuevo ticket pendiente de asignar
    });

// Aca se estara escuchando el evento 'atender-ticket' el cual se ejecutara cuando se presione el boton en la pantalla escritorio.html
    socket.on('atender-ticket', ( {escritorio}, callback ) => {
        
        //Validar si el escritorio fue ingresado
        if(!escritorio){
            return callback({
                ok: false,
                msg: 'Es obligatorio el url escritorio'
            });
        }

        const ticket = ticketControl.atenderTicket(escritorio); 
        
        
        socket.broadcast.emit('estado-actual', ticketControl.ultimos4); // Asigno un nuevo ticket

        socket.emit('tickets-pendientes',ticketControl.tickets.length);
        socket.broadcast.emit('tickets-pendientes',ticketControl.tickets.length);
        //Con el .broadcast se notifica a todos los clientes conectados

        //Verifico que se haya atendido todos los tickets de la cola
        if(!ticket){
            callback({
                ok: false,
                msg: 'Ya no hay tickets pendientes'
            });
        } else{
            callback({
                ok: true,
                ticket
            })
        }

    })

}


module.exports = {
    socketController
}

