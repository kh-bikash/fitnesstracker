from backend.app import db
from datetime import datetime
import uuid

class ProgressEntry(db.Model):
    __tablename__ = 'progress_entries'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    weight = db.Column(db.Float)
    steps = db.Column(db.Integer, default=0)
    distance = db.Column(db.Float, default=0)  # in km
    active_minutes = db.Column(db.Integer, default=0)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'date': self.date.isoformat() if self.date else None,
            'weight': self.weight,
            'steps': self.steps,
            'distance': self.distance,
            'activeMinutes': self.active_minutes,
            'notes': self.notes,
            'createdAt': self.created_at.isoformat() if self.created_at else None
        }