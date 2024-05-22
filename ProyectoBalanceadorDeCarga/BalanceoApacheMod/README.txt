#La carpeta actual contiene un vagrantFile que provisiona las máquinas mediante scripts, lo único que hay que hacer es encender las máquinas 
#Mediante el vagrantFile que se encuentra en la carpeta, esto automáticamente descarga todas las dependencias, configura y monta los servidores
# y el balanceador de carga, además de un servidor DNS que registra un dominio www.balanceo-carga.com

vagrant up

#De lo contrario, a continuación se describe el proceso para realizarlo manualmente :)

---------------Configuración inicial---------------------
#Creación de las máquinas virtuales
#Teniendo instalado vagrant y virtualbox se procede a crear el vagrant file que es donde se instancian las maquinas virtuales a crear
vagrant init

#Una vez obtenido el archivo vagrantfile se proceden a crear las maquinas necesarias para el balanceo
#En este caso se utilizarán 3 maquinas virtuales, copiar y pegar la siguiente configuración en el archivo vagrantfile
#NOTA: No olvide abrir el archivo con un editor de texto para modificarlo

# -*- mode: ruby -*-
# vi: set ft=ruby :
Vagrant.configure("2") do |config|
	config.vm.define :proyecto do |proyecto|
	proyecto.vm.box = "bento/ubuntu-22.04"
	proyecto.vm.network :private_network, ip: "192.168.50.3"
	proyecto.vm.hostname = "proyecto"
 end
	config.vm.define :prueba do |prueba|
	prueba.vm.box = "bento/ubuntu-22.04"
	prueba.vm.network :private_network, ip: "192.168.50.2"
	prueba.vm.hostname = "prueba"
 end
 	config.vm.define :backend1 do |backend1|
	backend1.vm.box = "bento/ubuntu-22.04"
	backend1.vm.network :private_network, ip: "192.168.50.4"
	backend1.vm.hostname = "backend1"
	backend1.vm.synced_folder "C:/Users/Usuario/Documents/Proyecto_Teleco/Sincronizado","/vagrant/Sincronizado"
	
 end
 	config.vm.define :backend2 do |backend2|
	backend2.vm.box = "bento/ubuntu-22.04"
	backend2.vm.network :private_network, ip: "192.168.50.5"
	backend2.vm.hostname = "backend2"
	backend2.vm.synced_folder "C:/Users/Usuario/Documents/Proyecto_Teleco/Sincronizado","/vagrant/Sincronizado"

#Una vez configurado el vagrant file se procede a iniciar las maquinas para que sean correctamente aprovisionadas
#NOTA: este proceso puede tardar entre 30min y 1 hora
#ejecutamos una ventana de comandos o terminal en cualquier aplicación que lo permita, ya sea cmd, powershell, visual studio, mobaxterm, etc.
#y luego nos movemos al directorio donde se encuentra el vagrantfile (./vagrantfile) de la siguiente forma
cd C:\Users\Usuario\Documents\Proyecto_Teleco

#Una vez dentro de la carpeta del vagrant file encendemos las maquinas
vagrant up

#NOTA: inicialmente se encienden todas las maquinas para que sean aprovisionadas 
#luego se puede encender una por una en caso de no necesitar trabajar con todas las máquinas a la vez con el comando
vagrant up <nombre de la maquina virtual>

#Luego de provisional las máquinas virtuales se procede a acceder a la maquina donde se va a configurar el balanceador
#en este caso será la máquina proyecto
vagrant ssh proyecto

---------------Configuración Balanceo de carga---------------------


#Una vez dentro de la maquina virtual se procede a instalar apache
sudo apt-get install apache2 -y

#inicialmente se deben habilitar los siguientes modulos

sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod proxy_balancer
sudo a2enmod lbmethod_byrequests

#Luego nos dirigimos a la siguiente ruta
cd /etc/apache2/sites-available

#Una vez allí se crea un archivo de texto
sudo vim <nombre>.conf

#Dentro del archivo se debe poner la siguiente configuración

<VirtualHost *:80>
    ServerAdmin webmaster@localhost
    ServerName localhost

    <Proxy balancer://mycluster>
        BalancerMember http://192.168.50.4:80
        BalancerMember http://192.168.50.5:80
    </Proxy>

    ProxyPreserveHost On
    ProxyPass / balancer://mycluster/
    ProxyPassReverse / balancer://mycluster/

    ErrorLog ${APACHE_LOG_DIR}/balanceador_error.log
    CustomLog ${APACHE_LOG_DIR}/balanceador_access.log combined

</VirtualHost>

#Guardamos y salimos

---------------Configuración DNS---------------------

#Ahora se procede a configurar el dns, para esto se debe instalar los respectivos paquetes
sudo apt-get install bind9 -y

#editamos el archivo de configuración named.conf.local
sudo vim /etc/bind/named.conf.local

#en donde se crearan las zonas de la siguiente forma

// be authoritative for the localhost forward and reverse zones, and for
// broadcast zones as per RFC 1912

/*Zona directa*/
zone "balanceo-carga.com" {
        type master;
        file "/etc/bind/db.balanceo.com";
};

/*Zona inversa*/
zone "50.168.192.in-addr.arpa" {
        type master;
        file "/etc/bind/db.192";
};

#Guardamos y salimos

#Ahora creamos un archivo de configuración con el nombre del dominio creado
sudo vim db.balanceo-carga.com

#el cual contendrá la información de la zona directa

;
; BIND data file for local loopback interface
;
$TTL    604800
@       IN      SOA     balanceo-carga.com. root.balanceo-carga.com. (
                              2         ; Serial
                         604800         ; Refresh
                          86400         ; Retry
                        2419200         ; Expire
                         604800 )       ; Negative Cache TTL
;
@       IN      NS      ns.balanceo-carga.com.
ns      IN      A       192.168.50.3
www     IN      CNAME   ns

#Luego se crea otro para la zona inversa
vim db.192

#que contiene la siguiente información

;
; BIND reverse data file for broadcast zone
;
$TTL    604800
@       IN      SOA     ns.balanceo-carga.com. root.balanceo-carga.com. (
                              1         ; Serial
                         604800         ; Refresh
                          86400         ; Retry
                        2419200         ; Expire
                         604800 )       ; Negative Cache TTL
;
@       IN      NS      ns.
3       IN      PTR     ns.balanceo-carga.com.

#Se reinicia el servicio y ya la pagina se accedería como www.balanceo-carga.com
sudo systemctl restart bind9

---------------Configuración servidores backend---------------------

#Ahora se procede a configurar los servidores backend los cuales van a contener la página web a la que deseamos ingresar
vagrant ssh backend1

#Se debe instalar apache en estas maquinas también
sudo apt-get install apache2

#se crea un nuevo archivo de configuración de la misma forma que con el balanceo de carga pero ahora con la ruta del
#archivo index.html que se desea mostrar, en este caso la ruta será /var/www/prueba
sudo vim /etc/apache2/sites-available/prueba1.conf

#el cual contiene la siguiente información:

<VirtualHost *:80>
    ServerAdmin localhost
    DocumentRoot /var/www/prueba
    ServerName localhost

    <Directory /var/www/prueba>
        Options Indexes FollowSymLinks MultiViews
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>

#Guardamos y salimos

#Luego se crea el archvito index.html con el codigo html de la pagina que deseamos mostrar
sudo vim /var/www/prueba/index.html

#Una vez finalizado esto solo falta habilitar el sitio creado para el servidor
sudo a2ensite prueba1.conf

#Se reinicia el servicio de apache para que coja los cambios
sudo systemctl restart apache2

#Se verifica el estado activo del servicio
sudo systemctl status apache2

#Repetimos esta misma configuración para el otro servidor (backend2) que va a tener el mismo archivo index

#Finalmente se realiza la prueba del funcionamiento del balanceador ingresando la siguiente dirección a un navegador web
#www.balanceo-carga.com

#Debe cargar la pagina que se configuró en ambos servidores 

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
#En mi caso
artillery run load-test.yml --record --key a9_rlNB1NoK0TShdCeB39jG5Kjgdn0uW-jx