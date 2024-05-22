echo "Instalando apache2"

sudo apt-get update
sudo apt-get install apache2 -y


echo "Montando sitio web"

cd /etc/apache2/sites-available

sudo tee prueba1.conf > /dev/null <<EOF
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
EOF

echo "Desactivando el sitio por defecto y activando el nuevo sitio"
sudo a2dissite 000-default.conf
sudo a2ensite prueba1.conf

echo "Copiando ficheros de pagina web desde ./Sincronizado hacia la VM"
sudo mkdir /var/www/prueba
sudo cp -r /Sincronizado/ogistic/* /var/www/prueba


echo "Reiniciando el servicio apache2 para aplicar los cambios"
sudo systemctl restart apache2
echo "Configuración del servicio completada y servicio apache2 reiniciado"




