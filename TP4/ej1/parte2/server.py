from image_utils import split_image, join_image
from flask import Flask, request, send_file, jsonify
import cv2
import numpy as np
import io
import os

app = Flask(__name__)

@app.route("/api/split", methods=['POST'])
def split():
    if request.method == 'POST':
        # Obtiene de las variables de entorno la cantidad de partes que en que divirá la imagen            
        num_fragments = os.environ.get('FRAGMENTS_COUNT')
        num_fragments = int(num_fragments)
        
        # Verificar que num_fragments esté dentro del rango permitido
        if num_fragments < 1 or num_fragments > 10:
            return "Bad request: el número de fragmentos debe estar entre 1 y 15", 400
            
        # Verifica si hay un archivo adjunto de imagen en la solicitud
        if 'image' in request.files:
            # Obtén el archivo adjunto de la imagen
            image_file = request.files['image']
            
            # Lee los datos binarios de la imagen
            image_data = image_file.read()
            
            # Convierte los datos binarios en una matriz numpy
            nparr = np.frombuffer(image_data, np.uint8)
            
            # Decodifica la imagen de la matriz numpy
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            # Verifica si la imagen se ha cargado correctamente
            if image is None:
                return "Bad request: error al procesar la imagen", 400
            
            # Aplica el filtro Sobel a la imagen. Fragments en un array con los paths a los fragmentos de imagen
            fragments = split_image(image, num_fragments)
            
            # TODO: enviar cada uno de los fragmentos a los workers para que le apliquen sobel
            
            final_image = join_image(fragments)
            
            # Devuelve la imagen procesada
            return send_file(final_image, mimetype='image/png', as_attachment=True)
    else:
        return "Método no permitido o imagen no adjunta", 405  # Método no permitido o imagen no adjunta

            # return f"El tiempo total de ejecución fue de {tiempo:.2f} segundos"