FROM python:3.9.19-bullseye

# Crear un usuario no root
RUN useradd -m -d /home/nonroot -s /bin/bash nonroot

WORKDIR /sobel

# Instalar dependencias del sistema
RUN apt-get update && \
    apt-get install -y libgl1-mesa-glx

# Copiar archivos y directorios
COPY ./requirements.txt requirements.txt
COPY ./server.py server.py
COPY ./sobel_filter.py sobel_filter.py

# Cambiar la propiedad de los archivos al usuario no root
RUN chown -R nonroot:nonroot /sobel

# Cambiar al usuario no root
USER nonroot

# Instalar las dependencias de Python
RUN pip install --upgrade pip setuptools && \
    pip install -r requirements.txt

EXPOSE 5000


# CMD ["flask", "--app", "server", "run", "--host", "0.0.0.0"]

# Especificar la ruta completa de flask al definir CMD
CMD ["python", "-m", "flask", "--app", "server", "run", "--host", "0.0.0.0"]