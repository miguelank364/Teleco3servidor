echo "Instalando docker"

sudo apt-get update
sudo apt-get install -y docker.io
sudo usermod -aG docker vagrant
sudo systemctl enable docker
sudo systemctl start docker


echo "Configurando Firewall"
# Habilitar UFW 
sudo ufw allow ssh
sudo ufw enable

# Permitir solo los puertos necesarios para Docker Swarm
sudo ufw allow 2375/tcp
sudo ufw allow 2376/tcp
sudo ufw allow 2377/tcp
sudo ufw allow 7946/tcp
sudo ufw allow 7946/udp
sudo ufw allow 4789/udp
sudo ufw allow http