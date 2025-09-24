from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.models.progress import ProgressEntry
from backend.app import db
from datetime import datetime

progress_bp = Blueprint('progress', __name__)

@progress_bp.route('', methods=['GET'])
@jwt_required()
def get_progress():
    try:
        user_id = get_jwt_identity()
        entries = ProgressEntry.query.filter_by(user_id=user_id).order_by(ProgressEntry.date.desc()).all()
        return jsonify([entry.to_dict() for entry in entries]), 200
    except Exception as e:
        return jsonify({'message': 'Server error', 'error': str(e)}), 500

@progress_bp.route('', methods=['POST'])
@jwt_required()
def create_progress_entry():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        entry = ProgressEntry(
            user_id=user_id,
            date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
            weight=data.get('weight'),
            steps=data.get('steps', 0),
            distance=data.get('distance', 0),
            active_minutes=data.get('activeMinutes', 0),
            notes=data.get('notes', '')
        )
        
        db.session.add(entry)
        db.session.commit()
        
        return jsonify(entry.to_dict()), 201
    except Exception as e:
        return jsonify({'message': 'Server error', 'error': str(e)}), 500

@progress_bp.route('/<entry_id>', methods=['PUT'])
@jwt_required()
def update_progress_entry(entry_id):
    try:
        user_id = get_jwt_identity()
        entry = ProgressEntry.query.filter_by(id=entry_id, user_id=user_id).first()
        
        if not entry:
            return jsonify({'message': 'Progress entry not found'}), 404
        
        data = request.get_json()
        
        if 'weight' in data:
            entry.weight = data['weight']
        if 'steps' in data:
            entry.steps = data['steps']
        if 'distance' in data:
            entry.distance = data['distance']
        if 'activeMinutes' in data:
            entry.active_minutes = data['activeMinutes']
        if 'notes' in data:
            entry.notes = data['notes']
        if 'date' in data:
            entry.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        
        db.session.commit()
        
        return jsonify(entry.to_dict()), 200
    except Exception as e:
        return jsonify({'message': 'Server error', 'error': str(e)}), 500

@progress_bp.route('/<entry_id>', methods=['DELETE'])
@jwt_required()
def delete_progress_entry(entry_id):
    try:
        user_id = get_jwt_identity()
        entry = ProgressEntry.query.filter_by(id=entry_id, user_id=user_id).first()
        
        if not entry:
            return jsonify({'message': 'Progress entry not found'}), 404
        
        db.session.delete(entry)
        db.session.commit()
        
        return jsonify({'message': 'Progress entry deleted successfully'}), 200
    except Exception as e:
        return jsonify({'message': 'Server error', 'error': str(e)}), 500