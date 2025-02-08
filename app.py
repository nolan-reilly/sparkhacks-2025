from flask import Flask, render_template, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from enum import Enum
import random
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
@app.route('/lottery', methods=['GET'])
def run_lottery():
    prizes = Prize.query.all()
    if not prizes:
        return jsonify({'error'})
    prize_weight = {
        PrizeWeight.COMMON: 0.70,
        PrizeWeight.UNCOMMON: 0.20,
        PrizeWeight.RARE:0.08,
        PrizeWeight.EPIC:0.0095,
        PrizeWeight.LEGENDARY:0.0005
    }
    weights = [prize_weight[prize.rarity] for prize in prizes]
    lottery_pick = random.choices(prizes, weights=weights,k=1)[0]
    return jsonify({'winner':lottery_pick.to_dict()})

@app.route('/')
def home():
    return render_template('index.html')

@app.route("/lottery-page")
def lottery():
    return render_template('lottery.html')
if __name__ == '__main__':
    app.run(debug=True)





