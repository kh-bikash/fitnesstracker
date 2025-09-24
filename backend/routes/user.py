from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.models.user import User
from backend.app import db

user_bp = Blueprint('user', __name__)

@user_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        return jsonify(user.to_dict()), 200
    except Exception as e:
        return jsonify({'message': 'Server error', 'error': str(e)}), 500

@user_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        data = request.get_json()
        
        # Update user fields
        if 'name' in data:
            user.name = data['name']
        if 'age' in data:
            user.age = data['age']
        if 'gender' in data:
            user.gender = data['gender']
        if 'height' in data:
            user.height = data['height']
        if 'weight' in data:
            user.weight = data['weight']
        if 'fitnessGoals' in data:
            user.fitness_goals = data['fitnessGoals']
        
        db.session.commit()
        
        return jsonify(user.to_dict()), 200
    except Exception as e:
        return jsonify({'message': 'Server error', 'error': str(e)}), 500