
// Seleccionar el carrusel y las imágenes
const carrusel = document.querySelector(".carrusel");
const imagenes = document.querySelectorAll(".carrusel img");

// Crear un índice para controlar la imagen actual
let indice = 0;

// Crear una función para cambiar la imagen
function cambiarImagen() {
    // Ocultar todas las imágenes
    imagenes.forEach(imagen => {
        imagen.style.display = "none";
    });
    // Mostrar la imagen correspondiente al índice
    imagenes[indice].style.display = "block";
    // Incrementar el índice, o volverlo a cero si llega al final
    indice++;
    if (indice == imagenes.length) {
        indice = 0;
    }
}

// Crear una función para retroceder la imagen
function retrocederImagen() {
    // Decrementar el índice, o llevarlo al final si llega al principio
    indice--;
    if (indice == -1) {
        indice = imagenes.length - 1;
    }
    // Ocultar todas las imágenes
    imagenes.forEach(imagen => {
        imagen.style.display = "none";
    });
    // Mostrar la imagen correspondiente al índice
    imagenes[indice].style.display = "block";
}

// Crear una variable para almacenar el intervalo de tiempo
let intervalo;

// Crear una función para iniciar el cambio automático de imágenes
function iniciarCarrusel() {
    // Asignar el intervalo de tiempo a la variable
    intervalo = setInterval(cambiarImagen, 3000);
}

// Crear una función para detener el cambio automático de imágenes
function detenerCarrusel() {
    // Limpiar el intervalo de tiempo de la variable
    clearInterval(intervalo);
}

// Mostrar la primera imagen al cargar la página
cambiarImagen();

// Iniciar el carrusel al cargar la página
iniciarCarrusel();


// pal menu tipo hamburguesa
function toggleMenu() {
    var menu = document.querySelector('.nav-menu');
    var hamburger = document.querySelector('.hamburger');

    
    menu.classList.toggle('active');
    hamburger.classList.toggle('change');
}


