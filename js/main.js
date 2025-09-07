// Carrito
let carrito = []
let Lista_carrito = document.getElementById('Lista_carrito'); // Esto esaba declaradao mucho mas abajo, pero a lo ultimo hice el caso de que si volviamos del checkout (teniendo las cosas antes agregadas al carrito), y como uso la funcion actualizar_carrito aca tengo que declarar la lista sino explota
let numero_tickets_en_carrito = document.getElementById('cantidad_compra');

// En el caso que volvamos de la pagina de checkout
const ticketsGuardados = JSON.parse(localStorage.getItem('Tickets'));
if(ticketsGuardados && ticketsGuardados.length > 0){ // aca verifico primero que exista (osea que habia un localStorage) y luego que tenga elementos
    carrito = ticketsGuardados; // sincronizo con el carrito local
    actualizar_carrito(carrito);
}

//  ---------------------------------------------------------------------------------------------------------

//    carga de datos desde el archivo database.json
const artistas = document.getElementById('artistas');
const url = './database/database.json';
const url_mala = './database/database_mala.json';

async function get_a_la_db(url){        // Asincronia ya que andetro uso el fetch con el await
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Algo esta funcionando mal en nuestros servidores, prueba en unos minutos`);
    }
    const datos = await response.json();

    if(datos && datos.length === 0){
        throw new Error(`Estamos teniendo problemas para reenderizar la pagina, intente luego`);
    }
    return datos;
}


async function carga_datos_botones_contador(url) {  // Cargo todas las tarjetas de artistas, botones con su respectiva logica
    try{
        let data_db = await get_a_la_db(url)
        data_db.forEach(artista => {
                    const card_artista = document.createElement('div');
                    card_artista.classList.add('headline');

                    card_artista.innerHTML = `
                        <img src="./imgs/artista${artista.id}.jpg" alt="Foto de ${artista.nombre}, con id ${artista.id}">
                        <p>Nombre: ${artista.nombre}</p>
                        <p>Genero: ${artista.genero}</p>
                        <p>Lugar: ${artista.lugar}</p>
                        <p>Precio: ${artista.precio}$</p>
                    `;
                    // contadores
                    const controles_cantidad = document.createElement('div');
                    controles_cantidad.classList.add('controles_cantidad');

                    const btnRestar = document.createElement('button');
                    btnRestar.textContent = '-';

                    const contador = document.createElement('p');
                    contador.textContent = '0';

                    const btnSumar = document.createElement('button');
                    btnSumar.textContent = '+';

                    // listeners individuales de suma y resta
                    btnSumar.addEventListener('click', () => {
                        contador.textContent = parseInt(contador.textContent) + 1;
                    });

                    btnRestar.addEventListener('click', () => {
                        const valor = parseInt(contador.textContent);
                        if (valor > 0) {
                            contador.textContent = valor - 1;
                        }
                    });

                    // meto los controles al fondo de la tarjeta de cada artista
                    controles_cantidad.appendChild(btnRestar);
                    controles_cantidad.appendChild(contador);
                    controles_cantidad.appendChild(btnSumar);

                    // crear botón de comprar y darle su funcion
                    const btn_comprar = document.createElement('button');
                    btn_comprar.textContent = 'Comprar';
                    btn_comprar.classList.add('btn_comprar');
                    btn_comprar.addEventListener('click', () => {
                        const cantidad = parseInt(contador.textContent);
                        if (cantidad > 0) {
                            carrito.push([artista.id, artista.nombre, artista.precio, cantidad])
                        } else {
                            Notiflix.Report.info(
                                'Ojo, no seleccionaste una cantidad',
                                'Selecciona al menos uno',
                                'okay',
                                () => {
                                    // no hace nada
                                }
                            );                        }
                        contador.textContent = 0;
                        actualizar_carrito(carrito);
                    });

                    card_artista.appendChild(controles_cantidad);   // meto el contenedor de los controles
                    card_artista.appendChild(btn_comprar);          // meto el boton
                    artistas.appendChild(card_artista);             // meto la tajeta con todo ya seteado
                });
    }catch (error) {                // Si algo falla informamos y dejamos resetar (en nuestro caso seguira dando error por la url_mala)
        Notiflix.Report.failure(
            'Huston tenemos un problema',
            error.message,
            'Volver a intentar',
            () => {
              location.reload();    // recarga toda la página
            }
        );
    }
}

carga_datos_botones_contador(url);

// actualizar el carrito
function actualizar_carrito(lista_de_tickets){
    let cantidad_tickets = lista_de_tickets.length; // Simbolito en el carrito que dice cuantas asignaciones hubo
    if(lista_de_tickets.length > 0){
        numero_tickets_en_carrito.innerHTML = cantidad_tickets;
    }else{
        numero_tickets_en_carrito.innerHTML = '';   // si no hay ninguna no dice 0, simplemente no muestra nada
    }
    Lista_carrito.innerHTML = ``; // reseteo
    lista_de_tickets.forEach( (ticket, index) =>{
        const Lista_carrito_individual = document.createElement('div');
        Lista_carrito_individual.classList.add('Lista_carrito_individual');
        Lista_carrito_individual.innerHTML = `
        <img src="./imgs/tickets.png" alt="img_ticket" />
        <p>Artista: ${ticket[1]}</p>
        <p>precio: ${ticket[2]}</p>
        <p>Cantidad: ${ticket[3]}</p>
        <p>Total: ${ticket[2]*ticket[3]}$</p>
        <p class="eliminar" id="ticket_${index}">X</p>
        `;

        // Botón eliminar
        const btnEliminar = Lista_carrito_individual.querySelector('.eliminar');
        btnEliminar.addEventListener('click', () => {
            carrito.splice(index, 1);   // elimina ese elemento
            actualizar_carrito(carrito);
        });

    Lista_carrito.appendChild(Lista_carrito_individual);
    });
}

// Movimiento del carrito, puramente estetidco
const section_carrito = document.getElementById('seccion_carrito');
const boton_carrito = document.getElementById('boton_carrito');
const contenedor_boton_carrito = document.getElementById('contenedor_boton_carrito');


boton_carrito.addEventListener('click', () => {
    if (section_carrito.style.right === '0px') {
        section_carrito.style.right = '-100%';
        contenedor_boton_carrito.style.right = '0%';
    } else {
        section_carrito.style.right = '0';
        contenedor_boton_carrito.style.right = '40%'; 
    }
});

// Boton para ir al checkout (sii esta todo bien), sino saltan los errores

const boton_confirmar = document.getElementById('boton_confirmar');

boton_confirmar.addEventListener('click', () => {
    try {
        contar_tickets_en_lista();
        localStorage.setItem("Tickets", JSON.stringify(carrito));
        window.location.href = "./pages/checkout.html"; // esto no lo vimos pero no encontre otra forma...

    } catch (error) {
        Notiflix.Report.failure(
            'No puedo venderte un carrito vacío',
            error.message,
            'Vamos de nuevo'
        );
    }
});

// Boton de borrar todo el carrito

const boton_borrar_carrito = document.getElementById('boton_borrar_carrito');

boton_borrar_carrito.addEventListener('click', () => {
    try {
        contar_tickets_en_lista(); // salta si no hay nada
        carrito = [];
        actualizar_carrito(carrito);
    } catch (error) {
        Notiflix.Report.failure(
            'No puedo borrar la nada misma',
            error.message,
            'Agreguemos uno Tickets, si?'
        );
    }
});

function contar_tickets_en_lista() {
    let items_en_carrito = carrito.length;
    if (items_en_carrito === 0) {
        throw new Error("No tenes Tickets agregados en tu carrito");
    }
    return items_en_carrito;
}