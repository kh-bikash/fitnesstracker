from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.models.workout import Workout
from backend.models.nutrition import NutritionEntry
from backend.models.progress import ProgressEntry
from backend.app import db
from datetime import datetime, timedelta
from sqlalchemy import func

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    try:
        user_id = get_jwt_identity()
        
        # Get all user data
        workouts = Workout.query.filter_by(user_id=user_id).all()
        nutrition = NutritionEntry.query.filter_by(user_id=user_id).all()
        progress = ProgressEntry.query.filter_by(user_id=user_id).all()
        
        # Calculate date ranges
        today = datetime.now().date()
        week_ago = today - timedelta(days=7)
        
        # Filter for this week
        weekly_workouts = [w for w in workouts if w.date >= week_ago]
        weekly_nutrition = [n for n in nutrition if n.date >= week_ago]
        
        # Calculate totals
        total_calories_burned = sum(w.calories_burned or 0 for w in weekly_workouts)
        total_calories_consumed = sum(n.calories or 0 for n in weekly_nutrition)
        total_steps = sum(p.steps or 0 for p in progress)
        
        # Prepare workout history (last 30 workouts)
        workout_history = sorted(workouts, key=lambda x: x.date, reverse=True)[:30]
        nutrition_history = sorted(nutrition, key=lambda x: x.date, reverse=True)[:30]
        progress_history = sorted(progress, key=lambda x: x.date, reverse=True)[:30]
        
        stats = {
            'totalWorkouts': len(workouts),
            'weeklyWorkouts': len(weekly_workouts),
            'totalCaloriesBurned': total_calories_burned,
            'totalCaloriesConsumed': total_calories_consumed,
            'totalSteps': total_steps,
            'workoutHistory': [w.to_dict() for w in workout_history],
            'nutritionHistory': [n.to_dict() for n in nutrition_history],
            'progressHistory': [p.to_dict() for p in progress_history]
        }
        
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({'message': 'Server error', 'error': str(e)}), 500