from flask import Flask, render_template
from users.controllers.user_controller import user_controller
from users.models.db import db

from items.controllers.item_controller import item_controller
#from items.models.item_model import Item



app = Flask(__name__)
app.config.from_object('config.Config')
db.init_app(app)

# Registrando el blueprint del controlador de usuarios
app.register_blueprint(user_controller)

app.register_blueprint(item_controller)


# Ruta para renderizar el template index.html
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/edit/<string:id>')
def edit_user(id):
    print("id recibido",id)
    return render_template('edit.html', id=id)

@app.route('/edit-item/<string:id>')
def edit_item(id):
    print("id recibido",id)
    return render_template('edit-item.html', id=id)


if __name__ == '__main__':
    app.run()

