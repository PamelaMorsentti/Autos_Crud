from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from werkzeug.utils import secure_filename
import os
import time
import logging

app = Flask(__name__)
CORS(app)  # Habilitar CORS para todas las rutas

logging.basicConfig(level=logging.DEBUG)


class Catalogo:
    def __init__(self, host, user, password, database):
        self.conn = mysql.connector.connect(
            host=host,
            user=user,
            password=password
        )
        self.cursor = self.conn.cursor()

        try:
            self.cursor.execute(f"USE {database}")
        except mysql.connector.Error as err:
            if err.errno == mysql.connector.errorcode.ER_BAD_DB_ERROR:
                self.cursor.execute(f"CREATE DATABASE {database}")
                self.conn.database = database
            else:
                raise err

        self.cursor.execute('''CREATE TABLE IF NOT EXISTS autos (
            codigo INT AUTO_INCREMENT PRIMARY KEY,
            color VARCHAR(50) NOT NULL,
            modelo VARCHAR(15) NOT NULL,
            marca VARCHAR(50) NOT NULL,
            cantidad INT NOT NULL,
            precio DECIMAL(10, 2) NOT NULL,
            imagen_url VARCHAR(255))''')
        self.conn.commit()

        self.cursor.close()
        self.cursor = self.conn.cursor(dictionary=True)

    def agregar_auto(self, color, modelo, marca, cantidad, precio, imagen):
        sql = "INSERT INTO autos (color, modelo, marca, cantidad, precio, imagen_url) VALUES (%s, %s, %s, %s, %s, %s)"
        valores = (color, modelo, marca, cantidad, precio, imagen)
        self.cursor.execute(sql, valores)
        self.conn.commit()
        return self.cursor.lastrowid

    def consultar_auto(self, codigo):
        self.cursor.execute(f"SELECT * FROM autos WHERE codigo = {codigo}")
        return self.cursor.fetchone()

    def modificar_auto(self, codigo, nuevo_color, nuevo_modelo, nueva_marca, nueva_cantidad, nuevo_precio, nueva_imagen):
        sql = "UPDATE autos SET color = %s, modelo = %s, marca = %s, cantidad = %s, precio = %s, imagen_url = %s WHERE codigo = %s"
        valores = (nuevo_color, nuevo_modelo, nueva_marca,
                   nueva_cantidad, nuevo_precio, nueva_imagen, codigo)
        self.cursor.execute(sql, valores)
        self.conn.commit()
        return self.cursor.rowcount > 0

    def listar_autos(self):
        self.cursor.execute("SELECT * FROM autos")
        autos = self.cursor.fetchall()
        return autos

    def eliminar_auto(self, codigo):
        self.cursor.execute(f"DELETE FROM autos WHERE codigo = {codigo}")
        self.conn.commit()
        return self.cursor.rowcount > 0

    def mostrar_auto(self, codigo):
        producto = self.consultar_auto(codigo)
        if producto:
            print("-" * 40)
            print(f"Código.....: {producto['codigo']}")
            print(f"color: {producto['color']}")
            print(f"modelo: {producto['modelo']}")
            print(f"marca: {producto['marca']}")
            print(f"Cantidad...: {producto['cantidad']}")
            print(f"Precio.....: {producto['precio']}")
            print(f"imagen.....: {producto['imagen_url']}")
        else:
            print("-" * 40)
            print("producto no encontrado.")

    def __del__(self):
        self.cursor.close()
        self.conn.close()


catalogo = Catalogo(
    host='PamelaValeria.mysql.pythonanywhere-services.com',
    user='PamelaValeria',
    password='PythonAnyWhere_123',
    database='PamelaValeria$mi_app'
)

RUTA_DESTINO = '/home/PamelaValeria/mysite/static/imagenes'
if not os.path.exists(RUTA_DESTINO):
    os.makedirs(RUTA_DESTINO)


@app.route("/autos", methods=["GET"])
def listar_autos():
    autos = catalogo.listar_autos()
    return jsonify(autos)


@app.route("/autos/<int:codigo>", methods=["GET"])
def mostrar_auto(codigo):
    auto = catalogo.consultar_auto(codigo)
    if auto:
        return jsonify(auto), 201
    else:
        return "Producto no encontrado", 404


@app.route("/autos", methods=["POST"])
def agregar_auto():
    try:
        color = request.form['color']
        modelo = request.form['modelo']
        marca = request.form['marca']
        cantidad = request.form['cantidad']
        precio = request.form['precio']
        imagen = request.files['imagen']

        if imagen:
            nombre_imagen = secure_filename(imagen.filename)
            nombre_base, extension = os.path.splitext(nombre_imagen)
            nombre_imagen = f"{nombre_base}_{int(time.time())}{extension}"
            nuevo_codigo = catalogo.agregar_auto(
                color, modelo, marca, cantidad, precio, nombre_imagen)
            if nuevo_codigo:
                imagen.save(os.path.join(RUTA_DESTINO, nombre_imagen))
                return jsonify({"mensaje": "Auto agregado correctamente.", "codigo": nuevo_codigo, "imagen": nombre_imagen}), 201
            else:
                return jsonify({"mensaje": "Error al agregar el auto."}), 500
        else:
            return jsonify({"mensaje": "No se ha proporcionado ninguna imagen."}), 400
    except Exception as e:
        logging.error(f"Error al agregar el auto: {e}")
        return jsonify({"mensaje": f"Error al agregar el auto: {str(e)}"}), 500


@app.route("/autos/<int:codigo>", methods=["PUT"])
def modificar_auto(codigo):
    try:
        nuevo_color = request.form.get('color')
        nuevo_modelo = request.form.get('modelo')
        nueva_marca = request.form.get('marca')
        nueva_cantidad = request.form.get('cantidad')
        nuevo_precio = request.form.get('precio')

        if 'imagen' in request.files:
            imagen = request.files['imagen']
            nombre_imagen = secure_filename(imagen.filename)
            nombre_base, extension = os.path.splitext(nombre_imagen)
            nombre_imagen = f"{nombre_base}_{int(time.time())}{extension}"
            imagen.save(os.path.join(RUTA_DESTINO, nombre_imagen))

            producto = catalogo.consultar_auto(codigo)
            if producto:
                imagen_vieja = producto["imagen_url"]
                ruta_imagen = os.path.join(RUTA_DESTINO, imagen_vieja)
                if os.path.exists(ruta_imagen):
                    os.remove(ruta_imagen)
        else:
            producto = catalogo.consultar_auto(codigo)
            if producto:
                nombre_imagen = producto["imagen_url"]
            else:
                return jsonify({"mensaje": "Auto no encontrado"}), 404

        if catalogo.modificar_auto(codigo, nuevo_color, nuevo_modelo, nueva_marca, nueva_cantidad, nuevo_precio, nombre_imagen):
            return jsonify({"mensaje": "Auto modificado"}), 200
        else:
            return jsonify({"mensaje": "Error al modificar el auto"}), 500
    except Exception as e:
        logging.error(f"Error al modificar el auto: {e}")
        return jsonify({"mensaje": f"Error al modificar el auto: {str(e)}"}), 500


@app.route("/autos/<int:codigo>", methods=["DELETE"])
def eliminar_auto(codigo):
    try:
        producto = catalogo.consultar_auto(codigo)
        if producto:
            imagen_vieja = producto["imagen_url"]
            ruta_imagen = os.path.join(RUTA_DESTINO, imagen_vieja)
            if os.path.exists(ruta_imagen):
                os.remove(ruta_imagen)
            if catalogo.eliminar_auto(codigo):
                return jsonify({"mensaje": "Auto eliminado"}), 200
            else:
                return jsonify({"mensaje": "Error al eliminar el auto"}), 500
        else:
            return jsonify({"mensaje": "Auto no encontrado"}), 404
    except Exception as e:
        logging.error(f"Error al eliminar el auto: {e}")
        return jsonify({"mensaje": f"Error al eliminar el auto: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=True)
