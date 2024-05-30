from flask import Blueprint, request, jsonify
from items.models.item_model import Items
from users.models.db import db

item_controller = Blueprint('item_controller', __name__)

@item_controller.route('/api/items', methods=['GET'])
def get_items():
    print("listado de items")
    items = Items.query.all()
    result = [{'id':item.id, 'name': item.name, 'price': item.price} for item in items]
    return jsonify(result)

# Get single item by id
@item_controller.route('/api/items/<int:item_id>', methods=['GET'])
def get_item(item_id):
    print("obteniendo item")
    item = Items.query.get_or_404(item_id)
    return jsonify({'id':item.id, 'name': item.name, 'price': item.price})

@item_controller.route('/api/items', methods=['POST'])
def create_item():
    print("creando item")
    data = request.json
    #new_item = Items(name="oscar", email="oscar@gmail", itemname="omondragon", password="123")
    new_item = Items(name=data['name'], price=data['price'])
    db.session.add(new_item)
    db.session.commit()
    return jsonify({'message': 'Item created successfully'}), 201

# Update an existing item
@item_controller.route('/api/items/<int:item_id>', methods=['PUT'])
def update_item(item_id):
    print("actualizando item")
    item = Items.query.get_or_404(item_id)
    data = request.json
    item.name = data['name']
    item.price = data['price']
    db.session.commit()
    return jsonify({'message': 'Item updated successfully'})

# Delete an existing item
@item_controller.route('/api/items/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    item = Items.query.get_or_404(item_id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': 'Item deleted successfully'})
