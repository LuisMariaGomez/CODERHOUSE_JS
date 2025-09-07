// Recuperar los tickets guardados
const ticketsGuardados = JSON.parse(localStorage.getItem('Tickets'));
console.log("Tickets guardados:", ticketsGuardados);

// actualizar el carrito
let seccion_carrito_preview = document.getElementById('seccion_carrito_preview');

function actualizar_carrito_preview(tickets){
    seccion_carrito_preview.innerHTML = ``; // reseteo
    p_total_tickets = document.getElementById("total_sumado"); // el p del total en $$ de los tickets
    let total_tickets = 0;
    tickets.forEach( (ticket, index) =>{
        const preview_individual = document.createElement('div');   // el conjunto de tickets con su precio total, le hago el append al fondo de todo
        preview_individual.classList.add('preview_individual');
        preview_individual.innerHTML = `
            <img src="../imgs/tickets.png"/>
            <p>Artista: ${ticket[1]}</p>
            <p>Precio: $${ticket[2]}</p>
            <p>Cantidad: ${ticket[3]}</p>
            <p>Total: $${ticket[2] * ticket[3]}</p>
            <p class="eliminar" id="ticket_${index}">X</p>
        `;
        total_tickets += ticket[2] * ticket[3];     // vamos sumando todos los tickets anadidos 

        // Botón eliminar
        const btnEliminar_checkout = preview_individual.querySelector('.eliminar');
        btnEliminar_checkout.addEventListener('click', () => {
            total_tickets -= ticket[2] * ticket[3]  // le resto al total asu actualizo el valor
            p_total_tickets.innerHTML=`${total_tickets}$`;

            tickets.splice(index, 1);   // elimina ese elemento
            localStorage.setItem("Tickets", JSON.stringify(tickets)); // actualiza localStorage
            actualizar_carrito_preview(tickets);
            if(tickets.length === 0){   // reviso que si saco todo los mando de nuevo a la pagina principal
                Notiflix.Report.info(
                    'Has quitado todos los tickets',
                    'Como no hay nada que vender, veamos si encontramos algo que te guste...',
                    'Volvamos a la tienda',
                    function okCb() {
                        window.location.href = '../index.html';
                    }
                );
            }
        });

        seccion_carrito_preview.appendChild(preview_individual);
    });
    p_total_tickets.innerHTML=`${total_tickets}$`;
}

// Cargar los tickets al iniciar la página
actualizar_carrito_preview(ticketsGuardados);

// Chequeo de datos antes de confirmar la compra
const nombre_titular_tarjeta = document.getElementById("nombre_titular_tarjeta");
const dni_titular = document.getElementById("dni_titular");
const numero_tarjeta = document.getElementById("numero_tarjeta");
const codigo_seguridad = document.getElementById("codigo_seguridad");
const corre_electronico = document.getElementById("corre_electronico");
const boton_confirmar_compra = document.getElementById("boton_confirmar_compra");
const boton_cancelar_compra = document.getElementById("boton_cancelar_compra");


function control_labels(){
    let error_incompleto = false;
    let lista_campos_incompletos = [];
    let error_letras_en_campos_numericos = false;
    let lista_campos_con_errores_numericos = [];

    if(!nombre_titular_tarjeta.value.trim()){
        lista_campos_incompletos.push("Nombre del Titular de la tarjeta");
        error_incompleto = true;
    }
    
    if(!dni_titular.value.trim()){
        lista_campos_incompletos.push("DNI Titular");
        error_incompleto = true;
    } else if (!/^\d+$/.test(dni_titular.value.trim())) {
        lista_campos_con_errores_numericos.push("DNI Titular");
        error_letras_en_campos_numericos = true;
    } 
    
    if(!numero_tarjeta.value.trim()){
        lista_campos_incompletos.push("Número Tarjeta");
        error_incompleto = true;
    } else if (!/^\d+$/.test(numero_tarjeta.value.trim())) {
        lista_campos_con_errores_numericos.push("Número Tarjeta");
        error_letras_en_campos_numericos = true;
    }
     
    if(!codigo_seguridad.value.trim()){
        lista_campos_incompletos.push("Código de Seguridad");
        error_incompleto = true;
    } else if (!/^\d+$/.test(codigo_seguridad.value.trim())) {
        lista_campos_con_errores_numericos.push("Código de Seguridad");
        error_letras_en_campos_numericos = true;
    } 
    
    if(!corre_electronico.value.trim()){
        lista_campos_incompletos.push("Correo Electrónico");
        error_incompleto = true;
    }

    if(error_incompleto && error_letras_en_campos_numericos){
        throw new Error(`No rellenaste los siguientes campos: ${lista_campos_incompletos.join(', ')} y de paso los siguientes campos deben contener solo números: ${lista_campos_con_errores_numericos.join(', ')}`);
    }else if(error_incompleto){
        throw new Error(`No rellenaste los siguientes campos: ${lista_campos_incompletos.join(', ')}`);
    }else if(error_letras_en_campos_numericos){
        throw new Error(`Los siguientes campos deben contener solo números: ${lista_campos_con_errores_numericos.join(', ')}`);
    }
}


boton_confirmar_compra.addEventListener('click', () => {
    try {
        control_labels();
        control_tarjeta();

        const ticketsGuardados = JSON.parse(localStorage.getItem("Tickets")) || [];

        const nombreTitular = document.getElementById("nombre_titular_tarjeta").value;
        const dniTitular = document.getElementById("dni_titular").value;
        const numeroTarjeta = document.getElementById("numero_tarjeta").value;
        const codigoSeguridad = document.getElementById("codigo_seguridad").value;
        const correoElectronico = document.getElementById("corre_electronico").value;

        const { jsPDF } = window.jspdf; // Nuenp estas son cosas que me pedia la libreria

        // aca se crea el PDF
        const doc = new jsPDF();
        let y = 20;
        
        // encabezado
        doc.setFontSize(18);
        doc.text("Comprobante de Compra", 20, y);
        y += 10;

        // Datos del comprador
        doc.setFontSize(12);
        doc.text(`Nombre: ${nombreTitular}`, 20, y); y += 7; // estas cosas raras "y += 7" es para ir haciendo los saltos de linea por asi decirlo, sino todo se sobreescribe, el 20 seria el la posicion con respecto al eje x
        doc.text(`DNI: ${dniTitular}`, 20, y); y += 7;
        doc.text(`Tarjeta: **** **** **** ${numeroTarjeta.slice(-4)}`, 20, y); y += 7;
        doc.text(`Correo: ${correoElectronico}`, 20, y); y += 15;

        // Lista de tickets
        doc.setFontSize(14);
        doc.text("Tickets:", 20, y);
        y += 10;

        let total = 0;
        ticketsGuardados.forEach((ticket, index) => {   // Por cada lote de tickets hago una fila con su resumen
            const subtotal = ticket[2] * ticket[3];     // los subtotales los voy sumando al total mas abajo
            doc.text(`Ticket ${index + 1}: ${ticket[1]} - $${ticket[2]} x ${ticket[3]} = $${subtotal}`, 20, y);
            y += 10;
            total += subtotal;
        });

        // Total final
        y += 5;
        doc.setFontSize(14);
        doc.text(`TOTAL: $${total}`, 20, y);

        // Guardar el PDF
        doc.save("comprobante_compra.pdf");

        // Limpiar el carrito después de la compra exitosa
        localStorage.removeItem('Tickets');
        
        // Mostrar loading después de descargar el PDF
        Notiflix.Loading.standard('Descargando resumen de compra...');
            
        // Volver a la página principal después de un delay
        setTimeout(() => {
            Notiflix.Loading.remove();
            
            Notiflix.Report.success(
                'Listo el "Pollo"',
                'Ya el comprobante de tu compra esta en tus mannos',
                'Volvamos a la tienda',
                function okCb() {
                    window.location.href = '../index.html';
                }
            );
        }, 2000);

    } catch (error) {
        Notiflix.Report.failure(
            'Error en la Transacción',
            error.message,
            'Volver a intentar'
        );
    }
});

let autorizacion_de_tajeta = true // aca cambiamos el valor para que falle
function control_tarjeta(){
    if(autorizacion_de_tajeta == false){
        throw new Error('Hubo un problema con tu tarjeta, prueba mas tarde o revisa bien la informacion');
    }
}


boton_cancelar_compra.addEventListener('click', () => {
    Notiflix.Confirm.show(
        'Cancelar Compra',
        'Estás seguro de que quieres cancelar la compra? De todos modos, volveremos a la tienda con tus entradas ;)',
        'Sí, cancelar',
        'No, continuar',
        function okCb() {   // Usuario confirma la cancelación
            Notiflix.Loading.standard('Bien, volvemos a la tienda');
            
            // Volvemoss a la página principal después de un delay
            setTimeout(() => {
                Notiflix.Loading.remove();
                window.location.href = '../index.html';
            }, 2000);
        },
        function cancelCb() {   // cancelamos la acción, no hacemos nada
        }
    );
});