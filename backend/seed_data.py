from backend.app import db
from backend.models.nutrition import FoodDatabase
from backend.models.user import User

def seed_sample_data():
    # Check if food database is already seeded
    if FoodDatabase.query.count() > 0:
        return
    
    # Seed food database
    foods = [
        {"name": "Chicken Breast", "calories": 165, "protein": 31, "carbs": 0, "fats": 3.6},
        {"name": "Brown Rice", "calories": 216, "protein": 5, "carbs": 45, "fats": 1.8},
        {"name": "Broccoli", "calories": 55, "protein": 3.7, "carbs": 11, "fats": 0.6},
        {"name": "Salmon", "calories": 208, "protein": 22, "carbs": 0, "fats": 12},
        {"name": "Avocado", "calories": 160, "protein": 2, "carbs": 9, "fats": 15},
        {"name": "Quinoa", "calories": 222, "protein": 8, "carbs": 39, "fats": 3.6},
        {"name": "Greek Yogurt", "calories": 100, "protein": 17, "carbs": 6, "fats": 0.4},
        {"name": "Spinach", "calories": 23, "protein": 2.9, "carbs": 3.6, "fats": 0.4},
        {"name": "Sweet Potato", "calories": 86, "protein": 1.6, "carbs": 20, "fats": 0.1},
        {"name": "Almonds", "calories": 579, "protein": 21, "carbs": 22, "fats": 50},
        {"name": "Banana", "calories": 89, "protein": 1.1, "carbs": 23, "fats": 0.3},
        {"name": "Oats", "calories": 389, "protein": 17, "carbs": 66, "fats": 7},
        {"name": "Eggs", "calories": 155, "protein": 13, "carbs": 1.1, "fats": 11},
        {"name": "Tuna", "calories": 132, "protein": 28, "carbs": 0, "fats": 1.3},
        {"name": "Cottage Cheese", "calories": 98, "protein": 11, "carbs": 3.4, "fats": 4.3}
    ]
    
    for food_data in foods:
        food = FoodDatabase(**food_data)
        db.session.add(food)
    
    # Create a demo user
    demo_user = User.query.filter_by(email='demo@example.com').first()
    if not demo_user:
        demo_user = User(
            email='demo@example.com',
            name='Demo User',
            age=25,
            gender='other',
            height=175.0,
            weight=70.0,
            fitness_goals=['General Fitness', 'Weight Loss']
        )
        demo_user.set_password('password123')
        db.session.add(demo_user)
    
    db.session.commit()
    print("Sample data seeded successfully!")