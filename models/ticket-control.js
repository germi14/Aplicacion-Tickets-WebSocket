// Modelo de la logica de negocio de la aplicacion

const path = require('path');
const fs   = require('fs');

class Ticket {
//El ticket estara compuesto por dos propiedades, el numero y el escritorio cliente que este atendiendo los numeros
    constructor( numero, escritorio ) {
        this.numero = numero;
        this.escritorio = escritorio;
    }
}

class TicketControl {
// El control del ticket estara compuesto por cuatro propiedades, que serviran para registrar los tickets, conocer la fecha de coneccion
// el ultimo y los ultimos 4 numeros llamados
    constructor () {
        this.ultimo = 0;
        this.hoy      = new Date().getDate();
        this.tickets  = [];
        this.ultimos4 = [];


        this.init(); // Aca leemos el archivo data.json y establecemos las propiedades del mismo
    }

    get toJson(){ // Cuando se llame el TicketControl.toJson va a generar este objeto
        return {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4
        }
    }

    init(){ // Para inicializar la clase
        const {hoy, tickets, ultimo, ultimos4} = require('../db/data.json');
        // Utilizo la desestructuracion para que de esta manera extraer las variables del objeto guardado en ese path
        
        //Verifico si la aplicacion esta siendo ejecutada desde el mismo dia o desde el dia siguiente.
        if(hoy === this.hoy){
            this.tickets  = tickets;
            this.ultimo   = ultimo;
            this.ultimos4 = ultimos4;
        }else{
            this.guardarDB();
        }

    }

    //En esta aplicacion utilizo un archivo JSON como base de datos, los tickets generados seran guardados en este archivo, para que en
    //el caso que el servidor se caiga, mantener la informacion
    guardarDB(){
        const dbPath = path.join(__dirname,'../db/data.json'); //Construir el path donde se guardara el archivo
        fs.writeFileSync(dbPath, JSON.stringify( this.toJson) );
    //Guardo el archivo, pero el segundo argumento de esta funcion tiene que ser un string y como el metodo .toJson de mi clase retorna es un arreglo, debo convertirlo en un string, o directamente en un string json
    }


    //Al llamar este metodo del server, se va a crear un nuevo ticket, luego lo va a guardar en el archivo JSON, y por ultimo
    //va a retornar el mensaje con el ticket generado
    siguiente() {
        this.ultimo +=1;
        const ticket = new Ticket (this.ultimo, null);
        //Aca se le asigna el ultimo ticket, y como en este punto no se conoce que cliente lo esta llamando entonces se le asigna null

        this.tickets.push(ticket); // Aca se inserta el nuevo ticket en el arreglo de tickets

        this.guardarDB(); //Aca se guarda ese nuevo ticket en el archivo JSON, por si acaso se reinicia el backend
        return 'Ticket: '+ ticket.numero ;
        //Como la variable ticket hizo una instancia a la clase Ticket entonces hereda sus dos propiedades, una de ellas .numero
    }

    //Al llamar este metodo, se retornara el ticket que atendera el cliente llamado escritorio, el cual debe indicar cual es en la pantalla
    atenderTicket(escritorio){

        //Validar que existen tickets disponibles
        if(this.tickets.length ===0){
            console.log("no hay tickets disponibles");
            return null;      
        }

        //Validar que numero es
        const ticket = this.tickets.shift(); //este metodo toma el primer elemeto de un array y lo retorna
        //elimino el primer ticket del arreglo de tickets porque esta siendo atendiendo entonces debe borrarse,
        

    //El ticket a atender ahora es asignado al escritorio que se conecto y se anadira a arreglo "ulitmos4", que es lo que se va a mostrar en la pantalla publico.html 
        ticket.escritorio = escritorio;
        
        this.ultimos4.unshift( ticket ); // Se anade el tiket nuevo al inicio del arreglo "ultimos4"

        //Se valida que el arreglo es menor a 4, en el caso que sea mayor se iran borrandose la ultima posicion del arreglo, ya que
        //el arreglo solo debe almacenar los ultimos 4 tickets generados
        if ( this.ultimos4.length > 4 ) {
            this.ultimos4.splice(-1,1);
        }

        this.guardarDB(); // Aca guardo el arreglo "ultimos4" al archivo JSON (o a una posible BD)

        return ticket;
        //Retorna el ticket que este escritorio tiene que atender, en el caso que no haya aun tickets que asignar retorna un null  
    }
}

module.exports = TicketControl;