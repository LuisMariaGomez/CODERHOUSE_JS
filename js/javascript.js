// DOCUMENTACION CREAR PRODUCTO -----------------------------------------------------------------------------------------------------------------------------

// Las funciones AsignarNombre y AsignarPrecio las declaro como un modulo aparte de CrearProducto para volver a llamarlas en caso de valores erroneos.

// - AsignarNombre recibe un string a travez de un prompt, ejecuta evaluciones, y devuelve null en caso de cancelar y en el caso ideal devuelve ese string.

// - AsignarPrecio recibe un int a travez de un prompt, ejecuta evaluciones, y devuelve null en caso de cancelar y en el caso ideal devuelve ese int.

// - CrearProducto invoca AsignarNombre y AsignarPrecio asignando sus valores primero a unas variables para verificar que no sean null (caso que se cancela el prompt).

// y luego estas variables se las asigna a los atributos correspondientes de un objeto "Producto", por ultimo el atributo stock se setea en 0.

// ------------------------------------------------------------------------------------------------------------------------------------------------------------

let ListaProductos = []; // Una lista de prodcutos que sera nuestra "Base de datos"

function AsignarNombre() {
    let nombreProducto = prompt("Nombre del producto");

    if (nombreProducto === null) {  // Caso que cancelen
        return null;
    } else if (nombreProducto.length === 0) { // Caso en que no pongan nada
    alert("Debes ingresar un nombre válido");
        return AsignarNombre(); // Llamo de nuevo la funcion para que vuelva a ingresar los datos
    } else {
        return nombreProducto; // Si todo okay, devuelvo el nombre ingresado (Sera asignado como atributo en la funcion CrearProducto)
    }
}

function AsignarPrecio() {
    let precioProducto = prompt("Precio del producto");

    if (precioProducto === null) {  // Caso que cancelen
        return null;
    }
    if (precioProducto.length === 0 || isNaN(precioProducto) || precioProducto <= 0) {  // Caso que no pongan nada, algo que no sea un nuemro o un numero negativo
        alert("Debes ingresar un número válido y mayor a 0");
        return AsignarPrecio();     // Llamo de nuevo la funcion para que vuelva a ingresar los datos
    }

    return precioProducto;  // Si todo okay, devuelvo el precio ingresado (Sera asignado como atributo en la funcion CrearProducto)
}

function CrearProducto() {
    const nombre = AsignarNombre();
    if (nombre === null){   // Caso que hayan cancelado cancelado
        return;
    }

    const precio = AsignarPrecio();
    if (precio === null){   // Caso que hayan cancelado cancelado
        return;
    }

    const Producto = {  // Seteo los atributos del objeto
        Nombre: nombre,
        Precio: precio,
        Stock: 0,
  };

    ListaProductos.push(Producto);  // Guardo el objeto
    alert("Producto agregado correctamente");
    console.log("Producto agregado", ListaProductos[ListaProductos.length - 1]);    // Revision de lo que se voy subiendo (ultimo obj de la lista)
}


// DOCUMENTACION CARGAR STOCK -----------------------------------------------------------------------------------------------------------------------------

// Las funciones BuscarPosicionProducto y AsignarStock las declaro como un modulo aparte de CrearProducto para volver a llamarlas en caso de valores erroneos.

// - BuscarPosicionProducto recibe un string a travez de un prompt, ejecuta evaluciones, y devuelve null en caso de cancelaro o que la lista de procutos este vacia, en el caso ideal devuelve el indice donde se encuentra el producto con el nnombre buscado.

// - AsignarStock recibe un int a travez de un prompt, ejecuta evaluciones, y devuelve null en caso de cancelar y en el caso ideal devuelve ese int.

// - CargarStock invoca BuscarPosicionProducto y AsignarStock obteniendo asi el indice donde se encuentra el producto, permitiendo acceder a el y asignar a su atributo stock el valor de stock que se quiere agregar. Finaliza mostrando el stock actualizado para controlar el fucionamiento.

// ------------------------------------------------------------------------------------------------------------------------------------------------------------

function BuscarPosicionProducto() {
    if(ListaProductos.length == 0){ // Si no hay objetos cargados ni empezamos a buscar
        alert("No tienes productos cargados")
        return null;
    }
    
    let nombreProducto = prompt("Ingresar producto a re-stockear");

    if (nombreProducto === null) { // Caso que cancelen
        return null;
    }else if (nombreProducto.length === 0) {    // Caso que no ingresen nada
        alert("Debes ingresar un nombre válido");
        return BuscarPosicionProducto();
    }

    for (let indice = 0; indice < ListaProductos.length; indice++) {    // recorremos los valores de incide
        if (ListaProductos[indice].Nombre === nombreProducto) { // Si entontramos el objeto que concuerde con el nombre retornamos el indice
        return indice;
        }
    }

    alert("El producto no está cargado");   // Si se recorre todo el largo de la lista sin encontrar nada nos indica que no esta cargado, devolvemos un null
    return null;
}


function AsignarStock() {
    let stockAgregado = prompt("Cuantas unidades agregar?");

    if (stockAgregado === null) {  // Caso que cancelen
        return null;
    }
    if (stockAgregado.length === 0 || isNaN(stockAgregado) || stockAgregado <= 0) {  // Caso que no pongan nada, algo que no sea un nuemro o un numero negativo
        alert("Debes ingresar un número válido y mayor a 0");
        return AsignarStock();     // Llamo de nuevo la funcion para que vuelva a ingresar los datos
    }

    return Number(stockAgregado);  // Si todo okay, devuelvo la cantida de stock que se quiere agregar, como un numero, sino lo toma como string y a la hora de sumar va a concatenar en vez de sumar
}

function CargarStock(){
    const indiceProducto = BuscarPosicionProducto();
    if (indiceProducto === null){   // Caso que hayan cancelado cancelado
        return;
    }

    const stockAgregado = AsignarStock();
    if (stockAgregado === null){    // Caso que hayan cancelado cancelado
        return;
    }

    ListaProductos[indiceProducto].Stock += stockAgregado;  // Localizamos el producto y actualizamos el atributo Stock
    alert(`Stock actualizado. Nuevo stock: ${ListaProductos[indiceProducto].Stock}`);   // Revision del stock
}

// DOCUMENTACION INFORME -----------------------------------------------------------------------------------------------------------------------------

//  - GenerarInforme recorre las lista de productos (si es que no esta vacia) devolviendo por cosola cada uno de los prodcutos juntos sis atributos

// ------------------------------------------------------------------------------------------------------------------------------------------------------------

function GenerarInforme() {
    if(ListaProductos.length == 0){ // Si no hay objetos cargados ni empezamos a buscar
        alert("No tienes productos cargados")
        return null;
    }
    console.log("Lista de productos")
    ListaProductos.forEach(producto => {
        console.log("Producto: " + producto.Nombre, "Precio: $" + producto.Precio, " Stock: " + producto.Stock)
    });
}