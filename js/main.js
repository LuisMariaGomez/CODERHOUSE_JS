// Dejo dos funciones para testear, una que agrega arqueros y otra que agrega números al azar en los tiros de cada arquero, 
// uso unos metodos que tal vez no vimos en clase pero son los mas sencillos para testear, dejarlos fuera de los criterios 
// de evaluación por favor.

// CARGA DE ARQUEROS

let ListaDeArqueros = [];
let idArquero = 1;

// Cargar Arqueros
// Si ya hay 8 arqueros, ya no hay botón de guardar arqueros (asi que no se puede acceder a esta funcion), se habilita el botón de iniciar torneo (para pasar a la siguiente instancia)
function agregarArquero() { // Esta función se encarga de agregar un arquero al array ListaDeArqueros a través del botón AgregarArquero
    const nombre = document.getElementById("nombre").value;
    const club = document.getElementById("club").value;
    const categoria = document.getElementById("categoria").value;
    
    if (nombre && club && categoria) {
        document.getElementById("mensajeDeAlerta").innerText = ""; // Limpiamos el mensaje de alerta
        ListaDeArqueros.push({ id: idArquero++, nombre: nombre, club: club, categoria: categoria });
        document.getElementById("formArquero").reset(); // Limpiamos el formulario después de agregar el arquero
    } else {
        document.getElementById("mensajeDeAlerta").innerText = "Por favor, completa todos los campos.";
        return;
    }
}

const botonGuardar = document.getElementById("guardarArquero");
if (botonGuardar) { // Verificamos si el botón existe para evitar errores si no está en el HTML
    botonGuardar.onclick = () => {
        agregarArquero();
        rellenarListaArquerosYActualizarContador();
    }
}

// Eliminar Arqueros
// Y elimina el botón de iniciar torneo si existe y vuelve a agregar el botón de guardar arqueros
function elimiarArqueros() { // Esta función se encarga de eliminar todos los arqueros del array ListaDeArqueros
    if (ListaDeArqueros.length === 0) {
        document.getElementById("mensajeDeAlerta").innerText = "No hay arqueros para eliminar.";
        return;
    }
    if (ListaDeArqueros.length == 8) { // Si hay 8 arqueros, eliminamos localStorage
        localStorage.clear(); // Limpiamos el localStorage
    }
    ListaDeArqueros = [];
    document.getElementById("formArquero").reset();
    document.getElementById("mensajeDeAlerta").innerText = "Todos los arqueros han sido eliminados.";
    const botonInicioTorneo = document.getElementById("botonInicioTorneo");
    if (botonInicioTorneo) { // Verificamos si esta en el HTML antes de intentar eliminarlo, ya que si no tenemos los 8 arqueros no existe y da error al querer eliminarlo
        formulario.removeChild(botonInicioTorneo.parentElement); // El botón está dentro de un <a> asi que eliminamos el padre
    }
    formulario.insertBefore(botonGuardar, borrarArqueros); // Lo agregamos en la posición correcta, sino lo agrega al final (no es la posicion original)
    rellenarListaArquerosYActualizarContador();
}

const botonEliminar = document.getElementById("borrarArqueros");
if (botonEliminar) { // Verificamos si el botón existe para evitar errores si no está en el HTML
    botonEliminar.onclick = () => {
        elimiarArqueros();
    }
}

let formulario = document.getElementById("formArquero");
let tituloArquerosRegistrados = document.getElementById("tituloArquerosRegistrados");
let ListaDeArquerosGuardados = document.getElementById("listaArqueros");

// Esta función se encarga de rellenar la lista de arqueros guardados y actualizar el contador de arqueros registrados
// También habilita el botón de iniciar torneo si hay 8 arqueros registrados eliminando tambien el botón de guardar arqueros
// Al final guarda los arqueros en localStorage

if (tituloArquerosRegistrados) { // Verificamos si el título existe para evitar errores si no está en el HTML
    function rellenarListaArquerosYActualizarContador() {
        ListaDeArquerosGuardados.innerHTML = "";    // Limpiamos la lista antes de rellenarla, sino de la forma en que lo planteo haria algo como 
                                                    // arquero1, al agregar otro: arquero1 - arquero1 -arquero2, al agregar otro: arquero1 - arquero1 -arquero2- arquero1 -arquero2 -arquero 3 
                                                    // (o sea va agregando la lista total al final manteniendo el contenido anterior)
        ListaDeArqueros.forEach(arquero => {
            ListaDeArquerosGuardados.innerHTML += `
                <div>
                    <strong>Nombre: ${arquero.nombre}</strong>
                    <strong> Club: ${arquero.club}</strong>
                    <strong> Categoría: ${arquero.categoria}</strong>
                </div>
            `;
        });

        tituloArquerosRegistrados.textContent = `Arqueros Registrados: ${ListaDeArqueros.length}/8`;

        if (ListaDeArqueros.length == 8) { // Si hay 8 arqueros, habilitamos el botón de torneo y deshabilitamos el botón de guardar
            tituloArquerosRegistrados.textContent += " - Torneo Habilitado";

            let anchorBotonInicioTorneo = document.createElement("a");
            anchorBotonInicioTorneo.href = "./pages/clasificatoria.html"; // Redirige a la página de clasificatoria
            formulario.appendChild(anchorBotonInicioTorneo);
            let botonInicioTorneo = document.createElement("button");
            botonInicioTorneo.id = "botonInicioTorneo";
            botonInicioTorneo.innerText = "Iniciar Torneo";
            botonInicioTorneo.type = "button";
            anchorBotonInicioTorneo.appendChild(botonInicioTorneo);

            formulario.removeChild(document.getElementById("guardarArquero")); // Eliminamos el botón de guardar arqueros
            ListaDeArqueros.sort((a, b) => a.id - b.id); // Ordenamos los arqueros por id
            localStorage.setItem("arqueros", JSON.stringify(ListaDeArqueros)); // Guardamos los arqueros en localStorage
        }
    }

    // Cargar 7 arqueros de prueba al iniciar la página así se prueba más rápido
    for (let i = 1; i <= 7; i++) {
        ListaDeArqueros.push({
            id: i + 1, // El id empieza en 2 porque el primero es 1 y lo agregamos con el formulario
            nombre: `Arquero${i}`,
            club: `Club${i}`,
            categoria: `Categoria${i}`
        });
    }
    rellenarListaArquerosYActualizarContador();
}

// CLASIFICATORIA
// Las "moscas" son los tiros perfectos, en el centro del 10, se usan para desempatar
// Son 3 tiradas por arquero, cada tirada tiene 3 tiros

const arquerosEnLocalStorage = JSON.parse(localStorage.getItem('arqueros'));
let container_casificatoria = document.getElementById("container_casificatoria");
let contenedoresArqueros = document.getElementById("contenedorPorArquero");
if (container_casificatoria && arquerosEnLocalStorage && contenedoresArqueros) {
    contenedoresArqueros.innerHTML = "";
    arquerosEnLocalStorage.forEach(arquero => {
        let tiradasHTML = "";
        for (let i = 0; i < 3; i++) {
            tiradasHTML += `<div class="divTirada"><strong>Tirada ${i + 1}:</strong>`;
            for (let j = 0; j < 3; j++) {
                tiradasHTML += `<input required class="tiro" placeholder="Tiro ${j}" id="tiro-${arquero.id}-${i}-${j}">`;
            }
            tiradasHTML += `</div>`;
        }
        contenedoresArqueros.innerHTML += `
            <div class="arquero">
                <strong>Nombre: ${arquero.nombre}</strong>
                <strong> Club: ${arquero.club}</strong>
                <strong> Categoría: ${arquero.categoria}</strong>
                <p>Puntos:</p>
                ${tiradasHTML}
            </div>
        `;
    });

    let botonFinalizarClasificatoria = document.getElementById("terminarClasificatoria");
    botonFinalizarClasificatoria.onclick = () => {
        arquerosEnLocalStorage.forEach(arquero => {
            let ListapuntosArquero = [];
            let moscasArquero = 0;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    let punto = document.getElementById(`tiro-${arquero.id}-${i}-${j}`).value;
                    if (punto === "x") {
                        moscasArquero++;
                        ListapuntosArquero.push(10);
                    } else {
                        ListapuntosArquero.push(parseInt(punto));
                    }
                }
            }
            let puntosArquero = ListapuntosArquero.reduce((totalPuntos, number) => totalPuntos + number, 0);
            arquerosEnLocalStorage.splice(arquero.id - 1, 1, {
                id: arquero.id,
                nombre: arquero.nombre,
                club: arquero.club,
                puntos: puntosArquero,
                moscas: moscasArquero
            });
        });

        arquerosEnLocalStorage.sort((a, b) => {
            if (b.puntos === a.puntos) {
                return b.moscas - a.moscas;
            }
            return b.puntos - a.puntos;
        });

        // El 1er puesto se enfrenta al 8vo, el 2do al 7mo, etc.
        let contenedorResultadosClasificatoria = document.getElementById("contenedorResultadosClasificatoria");
        contenedorResultadosClasificatoria.innerHTML = ""; // Limpiamos el contenedor de resultados

        for (let i = 0; i < (arquerosEnLocalStorage.length) / 2; i++) {
            contenedorResultadosClasificatoria.innerHTML += `
                <div class="ArquerosEnfrentados">
                    <strong>Par ${i + 1}:</strong>
                    <p>Nombre: ${arquerosEnLocalStorage[i].nombre}, Club: ${arquerosEnLocalStorage[i].club} vs Nombre: ${arquerosEnLocalStorage[(arquerosEnLocalStorage.length - 1) - i].nombre}, Club: ${arquerosEnLocalStorage[(arquerosEnLocalStorage.length - 1) - i].club}</p>
                </div>
            `;
        }
    };

    // Función para testear: agrega número al azar en los tiros de cada arquero
    arquerosEnLocalStorage.forEach(arquero => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let random = Math.floor(Math.random() * 12); // 0-10 es número, 11 es "x"
                let punto = document.getElementById(`tiro-${arquero.id}-${i}-${j}`);
                punto.value = (random === 11) ? "x" : random;
            }
        }
    });
}

// Perdon por el tema de a veces usar if(existe tal elemento), no sabia si dividir el código en dos archivos o dejarlo todo junto, espero que no sea un problema, si lo es, puedo dividirlo en dos archivos y dejar el código de la clasificatoria en otro archivo js.