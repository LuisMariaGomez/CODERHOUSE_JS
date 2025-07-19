// ---------------------------------------------------
// Simulador basico de gestion de stock de productos.
// ---------------------------------------------------
// Posee 3 funciones principales:
// 1- CrearProducto: Agregar un producto a la lista de productos (nombre, precio y stock seteado en 0)
// 2- CargarStock: Agregar unidades al stock del producto ingresado
// 3- GenerarInforme: Generar un "informe" de los productos (nombre, precio y stock)

// LISTA QUE FUNCIONA COMO BASE DE DATOS -----------------------------------------------------------------------------------------------------------------------------

let ListaProductos = []; 

// VALIDACIONES -----------------------------------------------------------------------------------------------------------------------------

function ValidacioNombre(nombreProductoParValidar){
    if (nombreProductoParValidar === null) {  // Caso que cancelen
        return null;
    } else if (nombreProductoParValidar.length === 0) { // Caso en que no pongan nada
        alert("Debes ingresar un nombre válido");
        return null;
    }
    return nombreProductoParValidar; // Si todo okay, devuelvo el nombre ingresado
}

function ValidacionInt(precioParaValidar){
    if (precioParaValidar === null) {  // Caso que cancelen
        return null;
    }
    else if (precioParaValidar.length === 0 || isNaN(precioParaValidar) || precioParaValidar <= 0) {  // Caso que no pongan nada, algo que no sea un nuemro o un numero negativo
        alert("Debes ingresar un número válido y mayor a 0");
        return null;
    }
    return precioParaValidar; // Si todo okay, devuelvo el precio ingresado
}

function ProductosCargados(){
    if (ListaProductos.length != 0){
        return true;
    }
    alert("No tienes productos cargados")
    return false;
}

// CREAR PRODUCTO -----------------------------------------------------------------------------------------------------------------------------

function CrearProducto() {
    
    const nombreValidado = ValidacioNombre(prompt("Nombre del producto"));
    if (nombreValidado === null){
        return;
    }

    const precioValidado = ValidacionInt(prompt("Precio del producto"));
    if (precioValidado === null){
        return;
    }

    const Producto = [nombreValidado, precioValidado, 0]; //Seteamos el stock en 0

    ListaProductos.push(Producto);  // Guardo el poducto
    alert(`Producto agregado correctamente.\nNombre:${ListaProductos[ListaProductos.length - 1][0]}\nPrecio: ${ListaProductos[ListaProductos.length - 1][1]}`);
}


// CARGAR STOCK -----------------------------------------------------------------------------------------------------------------------------

function IndiceProducto(nombreProducto){

    for(var producto of ListaProductos){
        if(producto[0] == nombreProducto)
            return ListaProductos.indexOf(producto);
    }

    alert("Producto no encontrado")
    return null;
}

function CargarStock(){

    if(!ProductosCargados()){ // Si no hay objetos cargados ni empezamos a hacer algo
        return;
    }

    const indiceProducto = IndiceProducto(ValidacioNombre(prompt("Ingresar producto a re-stockear")));
    if (indiceProducto === null){
        return;
    }

    let stockAgregado = ValidacionInt(parseInt(prompt("Cuantas unidades agregar?")));
    if (stockAgregado === null){
        return;
    }

    ListaProductos[indiceProducto][2] += stockAgregado;  // Localizamos el producto y actualizamos el atributo Stock
    alert(`Stock actualizado. Nuevo stock de ${ListaProductos[indiceProducto][0]}: ${ListaProductos[indiceProducto][2]}`);   // Revision del stock por alerta
}

// DOCUMENTACION INFORME -----------------------------------------------------------------------------------------------------------------------------

function GenerarInformePorConsola() {
    if(!ProductosCargados()){ // Si no hay objetos cargados ni empezamos a buscar
        return null;
    }
    console.log("Lista de productos");
    ListaProductos.forEach(producto => {
        console.log(`Producto: ${producto[0]}, Precio: $ ${producto[1]}, Stock:  ${producto[2]}`);
    });
}

// LLAMADA A LAS FUNCIONES -----------------------------------------------------------------------------------------------------------------------------

var LlamadasActivas = true;

while(LlamadasActivas){

    const Entrada = prompt("Seleccionar Accion: \n1) Agregar Producto\n2) Agregar Stock\n3) Obtener informe\n4) Salir")
    if(Entrada == null){
        alert("Cancelado")
        break;
    }

    switch(parseInt(Entrada)){
        case(1):
            CrearProducto();
            break;
        case(2):
            CargarStock();
            break;
        case(3):
            GenerarInformePorConsola();
            break;
        case(4):
            LlamadasActivas = false;
            break;
        default:
            alert("Entrada invalida, volver a ingresar");
            break;
    }
}
