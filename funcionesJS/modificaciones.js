
// ------------- MODIFICADO POR PAMELA---------------------------------------

const URL = "http://127.0.0.1:5000/"

//Al subir al servidor, deberá utilizarse la siguiente ruta. USUARIO debe ser reemplazado por el nombre de usuario de Pythonanywhere
//const URL = "https://USUARIO.pythonanywhere.com/"

// Variables de estado para controlar la visibilidad y los datos del formulario
let codigo = '';
let color = '';
let modelo = '';
let marca = '';
let cantidad = '';
let precio = '';
let imagen_url = '';
let imagenSeleccionada = null;
let imagenUrlTemp = null;
let mostrarDatosProducto = false;

document.getElementById('form-obtener-producto').addEventListener('submit', obtenerProducto);
document.getElementById('form-guardar-cambios').addEventListener('submit', guardarCambios);
document.getElementById('nuevaImagen').addEventListener('change', seleccionarImagen);

// Se ejecuta cuando se envía el formulario de consulta. Realiza una solicitud GET a la API y obtiene los datos del producto correspondiente al código ingresado.
function obtenerProducto(event) {
    event.preventDefault();
    codigo = document.getElementById('codigo').value;
    fetch(URL + 'autos/' + codigo)
        .then(response => {
            if (response.ok) {
                return response.json()
            } else {
                throw new Error('Error al obtener los datos del Auto.')
            }
        })
        .then(data => {
            color = data.color;
            modelo = data.modelo;
            marca = data.marca;
            cantidad = data.cantidad;
            precio = data.precio;
            imagen_url = data.imagen_url;
            mostrarDatosProducto = true; //Activa la vista del segundo formulario
            mostrarFormulario();
        })
        .catch(error => {
            alert('Código no encontrado.');
        });
}

// Muestra el formulario con los datos del producto
function mostrarFormulario() {
    if (mostrarDatosProducto) {
        document.getElementById('coloModificarr').value = color;
        document.getElementById('modeloModificar').value = modelo;
        document.getElementById('marcaModificar').value = marca;
        document.getElementById('cantidadModificar').value = cantidad;
        document.getElementById('precioModificar').value = precio;

        const imagenActual = document.getElementById('imagen-actual');
        if (imagen_url && !imagenSeleccionada) { // Verifica si imagen_url no está vacía y no se ha seleccionado una imagen

            imagenActual.src = '../static/imagenes/' + imagen_url;

            //Al subir al servidor, deberá utilizarse la siguiente ruta. USUARIO debe ser reemplazado por el nombre de usuario de Pythonanywhere
            //imagenActual.src = 'https://www.pythonanywhere.com/user/USUARIO/files/home/USUARIO/mysite/static/imagenes/' + imagen_url;

            imagenActual.style.display = 'block'; // Muestra la imagen actual
        } else {
            imagenActual.style.display = 'none'; // Oculta la imagen si no hay URL
        }

        document.getElementById('datos-producto').style.display = 'block';
    } else {
        document.getElementById('datos-producto').style.display = 'none';
    }
}

// Se activa cuando el usuario selecciona una imagen para cargar.
function seleccionarImagen(event) {
    const file = event.target.files[0];
    imagenSeleccionada = file;
    imagenUrlTemp = URL.createObjectURL(file); // Crea una URL temporal para la vista previa

    const imagenVistaPrevia = document.getElementById('imagen-vista-previa');
    imagenVistaPrevia.src = imagenUrlTemp;
    imagenVistaPrevia.style.display = 'block';
}

// Se usa para enviar los datos modificados del producto al servidor.
function guardarCambios(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('codigo', codigo);
    formData.append('color', document.getElementById('coloModificarr').value);
    formData.append('modelo', document.getElementById('modeloModificar').value);
    formData.append('marca', document.getElementById('marcaModificar').value);
    formData.append('cantidad', document.getElementById('cantidadModificar').value);
    formData.append('precio', document.getElementById('precioModificar').value);

    // Si se ha seleccionado una imagen nueva, la añade al formData. 
    if (imagenSeleccionada) {
        formData.append('imagen', imagenSeleccionada, imagenSeleccionada.name);
    }

    fetch(URL + 'autos/' + codigo, {
        method: 'PUT',
        body: formData,
    })
        .then(response => {
            if (response.ok) {
                return response.json()
            } else {
                throw new Error('Error al guardar los cambios del auto.')
            }
        })
        .then(data => {
            alert('Auto actualizado correctamente.');
            limpiarFormulario();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al actualizar el auto.');
        });
}

// Restablece todas las variables relacionadas con el formulario a sus valores iniciales, lo que efectivamente "limpia" el formulario.
function limpiarFormulario() {
    document.getElementById('codigo').value = '';
    document.getElementById('coloModificarr').value = '';
    document.getElementById('modeloModificar').value = '';
    document.getElementById('marcaModificar').value = '';
    document.getElementById('cantidadModificar').value = '';
    document.getElementById('precioModificar').value = '';
    document.getElementById('nuevaImagen').value = '';

    const imagenActual = document.getElementById('imagen-actual');
    imagenActual.style.display = 'none';

    const imagenVistaPrevia = document.getElementById('imagen-vista-previa');
    imagenVistaPrevia.style.display = 'none';

    codigo = '';
    color = '';
    modelo = '';
    marca = '';
    cantidad = '';
    precio = '';
    imagen_url = '';
    imagenSeleccionada = null;
    imagenUrlTemp = null;
    mostrarDatosProducto = false;

    document.getElementById('datos-producto').style.display = 'none';
}
