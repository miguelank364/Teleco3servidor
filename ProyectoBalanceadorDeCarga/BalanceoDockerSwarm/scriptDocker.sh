echo "Installing docker"

sudo apt-get update
sudo apt-get install -y docker.io
sudo usermod -aG docker vagrant
sudo systemctl enable docker
sudo systemctl start docker