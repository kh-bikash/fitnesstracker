from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.models.nutrition import NutritionEntry, FoodDatabase
from backend.app import db
from datetime import datetime

nutrition_bp = Blueprint('nutrition', __name__)

@nutrition_bp.route('', methods=['GET'])
@jwt_required()
def get_nutrition():
    try:
        user_id = get_jwt_identity()
        entries = NutritionEntry.query.filter_by(user_id=user_id).order_by(NutritionEntry.date.desc()).all()
        return jsonify([entry.to_dict() for entry in entries]), 200
    except Exception as e:
        return jsonify({'message': 'Server error', 'error': str(e)}), 500

@nutrition_bp.route('', methods=['POST'])
@jwt_required()
def create_nutrition_entry():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        entry = NutritionEntry(
            user_id=user_id,
            food_name=data['foodName'],
            calories=data['calories'],
            protein=data.get('protein', 0),
            carbs=data.get('carbs', 0),
            fats=data.get('fats', 0),
            serving=data.get('serving', 1),
            date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
            meal_type=data['mealType']
        )
        
        db.session.add(entry)
        db.session.commit()
        
        return jsonify(entry.to_dict()), 201
    except Exception as e:
        return jsonify({'message': 'Server error', 'error': str(e)}), 500

@nutrition_bp.route('/<entry_id>', methods=['DELETE'])
@jwt_required()
def delete_nutrition_entry(entry_id):
    try:
        user_id = get_jwt_identity()
        entry = NutritionEntry.query.filter_by(id=entry_id, user_id=user_id).first()
        
        if not entry:
            return jsonify({'message': 'Nutrition entry not found'}), 404
        
        db.session.delete(entry)
        db.session.commit()
        
        return jsonify({'message': 'Nutrition entry deleted successfully'}), 200
    except Exception as e:
        return jsonify({'message': 'Server error', 'error': str(e)}), 500

@nutrition_bp.route('/foods', methods=['GET'])
def get_foods():
    try:
        search = request.args.get('search', '').lower()
        query = FoodDatabase.query
        
        if search:
            query = query.filter(FoodDatabase.name.ilike(f'%{search}%'))
        
        foods = query.limit(20).all()
        return jsonify([food.to_dict() for food in foods]), 200
    except Exception as e:
        return jsonify({'message': 'Server error', 'error': str(e)}), 500