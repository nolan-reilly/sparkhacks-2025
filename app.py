from flask import Flask, render_template, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from enum import Enum
import treasure
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///prizes.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']= False
db = SQLAlchemy(app)
migrate= Migrate(app,db)

class PrizeWeight(Enum):
    COMMON = 1 
    UNCOMMON = 2
    RARE = 3
    EPIC = 4
    LEGENDARY = 5


class Business(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(100), nullable = False)
    prizes = db.relationship('Prize', backref='business', lazy=True)

    def to_dict(self):
        return{
            'id': self.id,
            'name': self.name,
        }
class Prize(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(100), nullable=False)
    rarity = db.Column(db.Enum(PrizeWeight), nullable= False)
    business_id = db.Column(db.Integer,db.ForeignKey('business.id'),nullable=False)

    def to_dict(self):
        return{
            'id': self.id,
            'name': self.name,
            'rarity':self.rarity.name,
            'business_id': self.business_id
        }
@app.route('/business', methods=['POST'])
def get_businesses():
    businesses = request.get_json()
    new_business = Business(
        name=businesses['name'],
    )
    db.session.add(new_business)
    db.session.commit()
    return jsonify(new_business.to_dict()), 201
@app.route('/prize',methods=['POST'])
def add_prize():
    prize = request.get_json()
    new_prize = Prize(
        name=prize['name'],
        rarity=PrizeWeight[prize['rarity']],
        business_id=prize['business_id']
    )
    db.session.add(new_prize)
    db.session.commit()
    return jsonify(new_prize.to_dict()), 201
@app.route('/prize',methods=['GET'])
def get_prizes():
    prizes = Prize.query.all()
    return jsonify([prize.to_dict() for prize in prizes])

@app.route('/business/<int:business_id>/prizes', methods=['GET'])
def get_business_prizes(business_id):
    prizes = Prize.query.filter_by(business_id=business_id).all()
    return jsonify([prize.to_dict() for prize in prizes])

@app.route('/')
def home():
    return render_template('index.html')


if __name__ == '__main__':
    with app.app_context():
        
        new_business = Business(name="Test Business")
        db.session.add(new_business)
        db.session.commit()

        new_prize = Prize(name="Test Prize", rarity=PrizeWeight.COMMON, business_id=new_business.id)
        db.session.add(new_prize)
        db.session.commit()

        print("Added Business and Prize Successfully!")
    
    app.run(debug=True)





