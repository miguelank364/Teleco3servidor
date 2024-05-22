
#Desde la carpeta /BalanceoDocker ejecutar
vagrant up

#Para ejecutar comandos desde cada máquina conectese a ellas usando ssh
vagrant ssh <manager/worker1/worker2>

#En manager - Inicia un nuevo cluster de nodos docker estableciendo como maestro la maquina manager. 
docker swarm init --advertise-addr 192.168.50.30

#En worker1 y worker2 - Une las maquinas worker como nodos del cluster. (Puede copiar y pegar el comando proporcionado por en la respuesta de ejecución del codigo anterior)
#En mi caso es:
docker swarm join --token SWMTKN-1-2v1kbjeigvlkbns0bb87wltto6uy6ttd65gqj9lk96b9fg8vi8-3ojl0kuq2onva4szpvuzn4pto 192.168.50.30:2377

#En manager - (Levanta un servicio http con apache y lo replica 6 veces entre los nodos worker, además monta un volumen para importar una pagina web ubicada en /sicro/ogistic)
docker service create --name apache --publish published=80,target=80 --replicas 6 --constraint 'node.role != manager' --mount type=bind,source="/sincro/ogistic/",target=/usr/local/apache2/htdocs/ httpd

#----------Lista de comandos útiles para dockerSwarn ---------
#listar servicios
docker service ls
#Ver detalle del servicio
docker service inspect apache
#Ver estado de las tareas de un servicio
docker service ps apache
#Ver logs del servicio
docker service logs apache

#(Opcional) Instala un servicio que ejecute docker swarn visualizer para tener una interfaz gráfica de las VM con sus servicios y tareas
docker service create --name=viz --publish=8080:8080 --constraint=node.role==manager --mount=type=bind,src=/var/run/docker.sock,dst=/var/run/docker.sock dockersamples/visualizer
#Se accede a la interfaz gráfica mediante el navegador conectadonse al manager por el puerto 8080
#http://192.168.50.30:8080
#------------------------------------------------------------

#-----------Pruebas de carga con artillery ------------------
#En maquina host, en windows se be instalar node.js y npm, para instalar artillery
#para instalación de node.js diríjase a https://nodejs.org/en/download/prebuilt-installer
#Para verificar si se instaló correctamente use 
node -v
npm -v

npm install -g artillery

#Es posible que la ejecución de scripts esté bloqueada en windows, para permitirla, abra una terminal como administrador y ejecute
Set-ExecutionPolicy RemoteSigned
#Si después desea restaurar las políticas originales y restringir la ejecución de scripts utilice
Set-ExecutionPolicy Restricted

#Para ejecutar prueba de carga y genera reporte(Ejecutar desde directorio ./artillery)
artillery run load-test.yml -o report.json
#Genera un reporte en HTML para ver en navegador
artillery report -o report.html report.json


#Usando artillery cloud
#Use su propia key de artillery que se genera cuando se registra en artillery cloud
#En mi caso:
artillery run load-test.yml --record --key a9_rlNB1NoK0TShdCeB39jG5Kjgdn0uW-jx








