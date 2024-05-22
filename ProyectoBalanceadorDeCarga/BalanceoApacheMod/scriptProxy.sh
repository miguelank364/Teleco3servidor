echo "Instalando apache2"

sudo apt-get update
sudo apt-get install apache2 -y


echo "Activando mod_proxy_balancer y dependencias"

sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod proxy_balancer
sudo a2enmod lbmethod_byrequests


echo "Montando balanceador de carga"

cd /etc/apache2/sites-available

sudo tee loadBalancer.conf > /dev/null <<EOF
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

    ErrorLog \${APACHE_LOG_DIR}/balanceador_error.log
    CustomLog \${APACHE_LOG_DIR}/balanceador_access.log combined
</VirtualHost>
EOF

echo "Desactivando el sitio por defecto y activando el nuevo sitio"
sudo a2dissite 000-default.conf
sudo a2ensite loadBalancer.conf

echo "Reiniciando el servicio apache2 para aplicar los cambios"
sudo systemctl restart apache2
echo "Configuración del servicio completada y servicio apache2 reiniciado"


echo "Instalando servidor DNS bind9"

sudo apt-get install bind9 -y

echo "Editando el archivo de configuración named.conf.local"

sudo tee -a /etc/bind/named.conf.local > /dev/null <<EOF

// be authoritative for the localhost forward and reverse zones, and for
// broadcast zones as per RFC 1912

/*Zona directa*/
zone "balanceo-carga.com" {
    type master;
    file "/etc/bind/db.balanceo-carga.com";
};

/*Zona inversa*/
zone "50.168.192.in-addr.arpa" {
    type master;
    file "/etc/bind/db.192";
};

EOF

echo "Creando el archivo de configuración de la zona directa"
cd /etc/bind
sudo tee db.balanceo-carga.com > /dev/null <<EOF
;
; BIND data file for local loopback interface
;
\$TTL    604800
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
EOF

echo "Creando el archivo de configuración de la zona inversa"
sudo tee db.192 > /dev/null <<EOF
;
; BIND reverse data file for broadcast zone
;
\$TTL    604800
@       IN      SOA     ns.balanceo-carga.com. root.balanceo-carga.com. (
                              1         ; Serial
                         604800         ; Refresh
                          86400         ; Retry
                        2419200         ; Expire
                         604800 )       ; Negative Cache TTL
;
@       IN      NS      ns.
3       IN      PTR     ns.balanceo-carga.com.
EOF

echo "Reiniciando el servicio BIND9 para aplicar los cambios"
sudo systemctl restart bind9
echo "Configuración DNS completada y servicio BIND9 reiniciado"


