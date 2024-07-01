
const URL = "http://127.0.0.1:5000/"

// Al subir al servidor, deberá utilizarse la siguiente ruta. USUARIO debe ser reemplazado por el nombre de usuario de Pythonanywhere
//const URL = "https://USUARIO.pythonanywhere.com/"


// Realizamos la solicitud GET al servidor para obtener todos los productos.
fetch(URL + 'autos')
    .then(function (response) {
        if (response.ok) {
            //Si la respuesta es exitosa (response.ok), convierte el cuerpo de la respuesta de formato JSON a un objeto JavaScript y pasa estos datos a la siguiente promesa then.
            return response.json();
        } else {
            // Si hubo un error, lanzar explícitamente una excepción para ser "catcheada" más adelante
            throw new Error('Error al obtener los autos.');
        }
    })

    //Esta función maneja los datos convertidos del JSON.
    .then(function (data) {
        let tablaProductos = document.getElementById('tablaProductos'); //Selecciona el elemento del DOM donde se mostrarán los productos.

        // Iteramos sobre cada producto y agregamos filas a la tabla
        for (let producto of data) {
            let fila = document.createElement('tr'); //Crea una nueva fila de tabla (<tr>) para cada producto.
            fila.innerHTML = '<td>' + producto.codigo + '</td>' +
                '<td>' + producto.color + '</td>' +
                '<td>' + producto.modelo + '</td>' +
                '<td>' + producto.marca + '</td>' +
                '<td align="center">' + producto.cantidad + '</td>' +
                '<td align="center">' + producto.precio + '</td>' +
                // Mostrar miniatura de la imagen
                '<td><img class="imgAuto" src=../static/imagenes/' + producto.imagen_url +' alt="Imagen del auto"></td>'

            //Al subir al servidor, deberá utilizarse la siguiente ruta. USUARIO debe ser reemplazado por el nombre de usuario de Pythonanywhere
            //'<td><img src=https://www.pythonanywhere.com/user/USUARIO/files/home/USUARIO/mysite/static/imagenes/' + producto.imagen_url +' alt="Imagen del producto" style="width: 100px;"></td>' + '<td align="right">' + producto.proveedor + '</td>';

            //Una vez que se crea la fila con el contenido del producto, se agrega a la tabla utilizando el método appendChild del elemento tablaProductos.
            tablaProductos.appendChild(fila);
        }
    })

    //Captura y maneja errores, mostrando una alerta en caso de error al obtener los productos.
    .catch(function (error) {
        // Código para manejar errores
        alert('Error al obtener los autos.');
    });


