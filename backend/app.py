from flask import Flask
from flask_cors import CORS
from datetime import timedelta
import os

from backend.extensions import db, jwt

def create_app():
    app = Flask(__name__)

    # Keep your original config
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'fitness-tracker-secret-key-change-in-production')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///fitness_tracker.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-string-change-in-production')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    CORS(app)

    # Register blueprints (keep all your original ones)
    from backend.routes.auth import auth_bp
    from backend.routes.user import user_bp
    from backend.routes.workouts import workouts_bp
    from backend.routes.nutrition import nutrition_bp
    from backend.routes.goals import goals_bp
    from backend.routes.progress import progress_bp
    from backend.routes.dashboard import dashboard_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(user_bp, url_prefix='/api/user')
    app.register_blueprint(workouts_bp, url_prefix='/api/workouts')
    app.register_blueprint(nutrition_bp, url_prefix='/api/nutrition')
    app.register_blueprint(goals_bp, url_prefix='/api/goals')
    app.register_blueprint(progress_bp, url_prefix='/api/progress')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')

    # Create tables & seed your original data
    with app.app_context():
        db.create_all()
        from backend.seed_data import seed_sample_data
        seed_sample_data()

    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
