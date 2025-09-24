from backend.app import db
from datetime import datetime
import uuid

class Workout(db.Model):
    __tablename__ = 'workouts'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    exercise_name = db.Column(db.String(100), nullable=False)
    exercise_type = db.Column(db.String(50), nullable=False)
    sets = db.Column(db.Integer, default=1)
    reps = db.Column(db.Integer, default=1)
    duration = db.Column(db.Integer, nullable=False)  # in minutes
    calories_burned = db.Column(db.Integer, default=0)
    date = db.Column(db.Date, nullable=False)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'exerciseName': self.exercise_name,
            'exerciseType': self.exercise_type,
            'sets': self.sets,
            'reps': self.reps,
            'duration': self.duration,
            'caloriesBurned': self.calories_burned,
            'date': self.date.isoformat() if self.date else None,
            'notes': self.notes,
            'createdAt': self.created_at.isoformat() if self.created_at else None
        }