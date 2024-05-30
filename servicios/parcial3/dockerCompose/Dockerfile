# Usa una imagen base de Python
FROM python:3.9

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de requerimientos y de la aplicación al contenedor
COPY requirements.txt requirements.txt
COPY . .

# Instala las dependencias de Python
RUN pip install -r requirements.txt

# Establece la variable de entorno para Flask
ENV FLASK_APP=webapp/run.py

# Expone el puerto en el que Flask va a correr
EXPOSE 5000

# Comando para ejecutar la aplicación Flask
CMD ["flask", "run", "--host=0.0.0.0"]
