from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.models.workout import Workout
from backend.app import db
from datetime import datetime

workouts_bp = Blueprint('workouts', __name__)

@workouts_bp.route('', methods=['GET'])
@jwt_required()
def get_workouts():
    try:
        user_id = get_jwt_identity()
        workouts = Workout.query.filter_by(user_id=user_id).order_by(Workout.date.desc()).all()
        return jsonify([workout.to_dict() for workout in workouts]), 200
    except Exception as e:
        return jsonify({'message': 'Server error', 'error': str(e)}), 500

@workouts_bp.route('', methods=['POST'])
@jwt_required()
def create_workout():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        workout = Workout(
            user_id=user_id,
            exercise_name=data['exerciseName'],
            exercise_type=data['exerciseType'],
            sets=data.get('sets', 1),
            reps=data.get('reps', 1),
            duration=data['duration'],
            calories_burned=data.get('caloriesBurned', 0),
            date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
            notes=data.get('notes', '')
        )
        
        db.session.add(workout)
        db.session.commit()
        
        return jsonify(workout.to_dict()), 201
    except Exception as e:
        return jsonify({'message': 'Server error', 'error': str(e)}), 500

@workouts_bp.route('/<workout_id>', methods=['PUT'])
@jwt_required()
def update_workout(workout_id):
    try:
        user_id = get_jwt_identity()
        workout = Workout.query.filter_by(id=workout_id, user_id=user_id).first()
        
        if not workout:
            return jsonify({'message': 'Workout not found'}), 404
        
        data = request.get_json()
        
        if 'exerciseName' in data:
            workout.exercise_name = data['exerciseName']
        if 'exerciseType' in data:
            workout.exercise_type = data['exerciseType']
        if 'sets' in data:
            workout.sets = data['sets']
        if 'reps' in data:
            workout.reps = data['reps']
        if 'duration' in data:
            workout.duration = data['duration']
        if 'caloriesBurned' in data:
            workout.calories_burned = data['caloriesBurned']
        if 'date' in data:
            workout.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        if 'notes' in data:
            workout.notes = data['notes']
        
        db.session.commit()
        
        return jsonify(workout.to_dict()), 200
    except Exception as e:
        return jsonify({'message': 'Server error', 'error': str(e)}), 500

@workouts_bp.route('/<workout_id>', methods=['DELETE'])
@jwt_required()
def delete_workout(workout_id):
    try:
        user_id = get_jwt_identity()
        workout = Workout.query.filter_by(id=workout_id, user_id=user_id).first()
        
        if not workout:
            return jsonify({'message': 'Workout not found'}), 404
        
        db.session.delete(workout)
        db.session.commit()
        
        return jsonify({'message': 'Workout deleted successfully'}), 200
    except Exception as e:
        return jsonify({'message': 'Server error', 'error': str(e)}), 500