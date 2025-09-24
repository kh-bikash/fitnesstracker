from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.models.goal import Goal
from backend.app import db
from datetime import datetime

goals_bp = Blueprint('goals', __name__)

@goals_bp.route('', methods=['GET'])
@jwt_required()
def get_goals():
    try:
        user_id = get_jwt_identity()
        goals = Goal.query.filter_by(user_id=user_id).order_by(Goal.created_at.desc()).all()
        return jsonify([goal.to_dict() for goal in goals]), 200
    except Exception as e:
        return jsonify({'message': 'Server error', 'error': str(e)}), 500

@goals_bp.route('', methods=['POST'])
@jwt_required()
def create_goal():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        goal = Goal(
            user_id=user_id,
            title=data['title'],
            description=data.get('description', ''),
            target_value=data['targetValue'],
            current_value=data.get('currentValue', 0),
            unit=data['unit'],
            category=data['category'],
            target_date=datetime.strptime(data['targetDate'], '%Y-%m-%d').date(),
            status=data.get('status', 'active')
        )
        
        db.session.add(goal)
        db.session.commit()
        
        return jsonify(goal.to_dict()), 201
    except Exception as e:
        return jsonify({'message': 'Server error', 'error': str(e)}), 500

@goals_bp.route('/<goal_id>', methods=['PUT'])
@jwt_required()
def update_goal(goal_id):
    try:
        user_id = get_jwt_identity()
        goal = Goal.query.filter_by(id=goal_id, user_id=user_id).first()
        
        if not goal:
            return jsonify({'message': 'Goal not found'}), 404
        
        data = request.get_json()
        
        if 'title' in data:
            goal.title = data['title']
        if 'description' in data:
            goal.description = data['description']
        if 'targetValue' in data:
            goal.target_value = data['targetValue']
        if 'currentValue' in data:
            goal.current_value = data['currentValue']
        if 'unit' in data:
            goal.unit = data['unit']
        if 'category' in data:
            goal.category = data['category']
        if 'targetDate' in data:
            goal.target_date = datetime.strptime(data['targetDate'], '%Y-%m-%d').date()
        if 'status' in data:
            goal.status = data['status']
        
        db.session.commit()
        
        return jsonify(goal.to_dict()), 200
    except Exception as e:
        return jsonify({'message': 'Server error', 'error': str(e)}), 500

@goals_bp.route('/<goal_id>', methods=['DELETE'])
@jwt_required()
def delete_goal(goal_id):
    try:
        user_id = get_jwt_identity()
        goal = Goal.query.filter_by(id=goal_id, user_id=user_id).first()
        
        if not goal:
            return jsonify({'message': 'Goal not found'}), 404
        
        db.session.delete(goal)
        db.session.commit()
        
        return jsonify({'message': 'Goal deleted successfully'}), 200
    except Exception as e:
        return jsonify({'message': 'Server error', 'error': str(e)}), 500