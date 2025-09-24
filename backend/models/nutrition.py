from backend.app import db
from datetime import datetime
import uuid

class NutritionEntry(db.Model):
    __tablename__ = 'nutrition_entries'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    food_name = db.Column(db.String(100), nullable=False)
    calories = db.Column(db.Integer, nullable=False)
    protein = db.Column(db.Float, default=0)
    carbs = db.Column(db.Float, default=0)
    fats = db.Column(db.Float, default=0)
    serving = db.Column(db.Float, default=1)
    date = db.Column(db.Date, nullable=False)
    meal_type = db.Column(db.String(20), nullable=False)  # breakfast, lunch, dinner, snack
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'foodName': self.food_name,
            'calories': self.calories,
            'protein': self.protein,
            'carbs': self.carbs,
            'fats': self.fats,
            'serving': self.serving,
            'date': self.date.isoformat() if self.date else None,
            'mealType': self.meal_type,
            'createdAt': self.created_at.isoformat() if self.created_at else None
        }

class FoodDatabase(db.Model):
    __tablename__ = 'food_database'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    calories = db.Column(db.Integer, nullable=False)  # per 100g
    protein = db.Column(db.Float, default=0)  # per 100g
    carbs = db.Column(db.Float, default=0)  # per 100g
    fats = db.Column(db.Float, default=0)  # per 100g
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'calories': self.calories,
            'protein': self.protein,
            'carbs': self.carbs,
            'fats': self.fats
        }