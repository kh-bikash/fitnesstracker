from backend.app import db
from datetime import datetime
import uuid

class Goal(db.Model):
    __tablename__ = 'goals'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    target_value = db.Column(db.Float, nullable=False)
    current_value = db.Column(db.Float, default=0)
    unit = db.Column(db.String(20), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    target_date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(20), default='active')  # active, completed, paused
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'title': self.title,
            'description': self.description,
            'targetValue': self.target_value,
            'currentValue': self.current_value,
            'unit': self.unit,
            'category': self.category,
            'targetDate': self.target_date.isoformat() if self.target_date else None,
            'status': self.status,
            'createdAt': self.created_at.isoformat() if self.created_at else None
        }