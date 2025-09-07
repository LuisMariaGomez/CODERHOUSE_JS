Simulador de compra de entradas a recitales de música electrónica.

----------------------

Funcionalidad principal

La aplicación simula un ecommerce sencillo de entradas:
    Listado dinámico de artistas
    Los artistas se cargan desde un archivo externo database/database.json utilizando fetch.
    Cada artista muestra: foto, nombre, género, lugar y precio.
Carrito de compras
    Se pueden seleccionar cantidades para cada artista con botones (+/-).
    Con el botón Comprar, los ítems se agregan al carrito.
El carrito permite:
    Ver el detalle (artista, precio, cantidad, total).
    Eliminar productos individuales.
    Borrar todo el carrito.
Se guarda automáticamente en localStorage, de forma que si se refresca o se vuelve más tarde, el contenido se recupera.

Checkout:
    Al confirmar la compra desde el carrito, se redirige a pages/checkout.html.
    Allí se muestran los tickets seleccionados, el total y un formulario de pago ficticio. (si son muchos el div contenedor hace scroll para no romper la estructura grafica)

Validaciones incluidas:
    Campos obligatorios (nombre, DNI, número de tarjeta, código de seguridad, correo).
    Validación de campos numéricos (DNI, tarjeta, código).

Finalización de compra:
    Si los datos son correctos, se genera un PDF con el comprobante usando la librería jsPDF.
    Se vacía el carrito y se muestra un mensaje de confirmación con Notiflix.
    El usuario es redirigido nuevamente al inicio.

----------------------

Librerías usadas:
    Notiflix (notificaciones y mensajes interactivos)
    jsPDF (generación de comprobante en PDF) este estuvo complicado el formateo sobre todo con el tema de las "y" (que no entendia porque se pisaba todo), me guie con ayuda de la IA de cursor

----------------------

Casos posibles de error:

Archivo JSON inaccesible
    Si la URL del archivo de base de datos falla o se cambia (ejemplo: url_mala), se dispara un error controlado.
    El usuario ve un mensaje de error con Notiflix y la opción de reintentar (recarga de la página).

Formulario incompleto o inválido en el checkout
    Si algún campo está vacío → se avisa con mensaje de error.
    Si campos numéricos contienen letras (DNI, tarjeta, código) → también se muestra error.

Carrito vacío
    No se permite avanzar al checkout si no hay productos.
    Si se intenta borrar un carrito vacío, también se controla y se muestra un mensaje UX-friendly.

Tarjeta rechazada
    Dentro del codigo hay un campo "autorizacion_de_tajeta" que en true deja que el flujo corra normalmente, pero en false simula un rechazo de tarjeta

----------------------

Guía de uso (ejemplar/todo okay):
    Abrir index.html en el navegador.
    Seleccionar entradas de los artistas disponibles.
    Revisar el carrito (botón arriba a la derecha).
    Confirmar la compra → se redirige al checkout.
    Completar los datos de pago ficticios.
    Descargar el comprobante en PDF y volver a la tienda.