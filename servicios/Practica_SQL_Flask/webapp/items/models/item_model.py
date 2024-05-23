from users.models.db import db

class Items(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Integer, nullable=False)

    def __init__(self, name, price):
        self.name = name
        self.price = price

