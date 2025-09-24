# Comprehensive Fitness Tracker Application

A full-stack fitness tracking application built with **Python Flask** backend and **React + TailwindCSS** frontend. Track workouts, nutrition, goals, and progress with a beautiful, responsive interface.

## 🚀 Features

### Authentication & User Management
- JWT-based authentication
- Secure user registration and login
- Profile management with personal metrics
- BMI calculation and health insights

### Workout Tracking
- Add daily workouts with detailed information
- Track exercise type, sets, reps, duration, and calories
- Edit and delete workout entries
- Comprehensive workout history

### Nutrition Tracking
- Extensive food database with nutritional information
- Daily meal tracking by meal type
- Nutrition goals and progress monitoring
- Visual daily nutrition summary

### Goals & Progress
- Set custom fitness goals with target dates
- Track progress towards goals
- Goal categorization and status management
- Progress visualization

### Dashboard & Analytics
- Comprehensive fitness dashboard
- Charts and graphs for progress visualization
- Weekly and monthly activity summaries
- Recent activity feed

## 🛠️ Tech Stack

### Backend
- **Python Flask** - Web framework
- **SQLAlchemy** - Database ORM
- **Flask-JWT-Extended** - JWT authentication
- **SQLite** - Database (perfect for Replit)
- **Flask-CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **Axios** - API client

## 📦 Installation & Setup

### For Replit (Recommended)

1. **Clone or fork this repository** to your Replit account

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

4. **Run the application:**
   ```bash
   npm run dev
   ```

   This will start both the Flask backend (port 5000) and React frontend (port 5173)

### For Local Development

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd fitness-tracker-app
   ```

2. **Set up Python virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

5. **Set up environment variables (optional):**
   ```bash
   cp .env.example .env
   # Edit .env with your preferred settings
   ```

6. **Run the application:**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Environment Variables

The application uses the following environment variables (all optional with sensible defaults):

```env
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-here
DATABASE_URL=sqlite:///fitness_tracker.db
FLASK_ENV=development
PORT=5000
```

### Database

The application uses SQLite by default, which is perfect for Replit and local development. The database is automatically created and seeded with sample data on first run.

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Token refresh

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Workouts
- `GET /api/workouts` - Get all workouts
- `POST /api/workouts` - Create new workout
- `PUT /api/workouts/:id` - Update workout
- `DELETE /api/workouts/:id` - Delete workout

### Nutrition
- `GET /api/nutrition` - Get nutrition entries
- `POST /api/nutrition` - Create nutrition entry
- `DELETE /api/nutrition/:id` - Delete nutrition entry
- `GET /api/nutrition/foods` - Search food database

### Goals
- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create new goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

### Progress
- `GET /api/progress` - Get progress entries
- `POST /api/progress` - Create progress entry
- `PUT /api/progress/:id` - Update progress entry
- `DELETE /api/progress/:id` - Delete progress entry

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## 🎨 UI Components

The application features a modern, responsive design with:

- **Dashboard** - Overview of fitness metrics and recent activity
- **Workouts** - Comprehensive workout tracking and history
- **Nutrition** - Food logging with nutritional breakdown
- **Goals** - Goal setting and progress tracking
- **Profile** - Personal information and health metrics

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation and sanitization
- SQL injection prevention through SQLAlchemy ORM

## 🌱 Sample Data

The application comes with pre-seeded data including:
- Comprehensive food database (15+ common foods)
- Demo user account (email: demo@example.com, password: password123)

## 🚀 Deployment

### Replit Deployment
The application is configured to run seamlessly on Replit with no additional configuration required.

### Other Platforms
For deployment on other platforms:

1. Set appropriate environment variables
2. Install Python and Node.js dependencies
3. Build the frontend: `npm run build`
4. Run the Flask backend: `python backend/app.py`
5. Serve the built frontend files

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Charts by [Recharts](https://recharts.org/)
- Styling by [TailwindCSS](https://tailwindcss.com/)
- Backend framework [Flask](https://flask.palletsprojects.com/)

## 📞 Support

If you have any questions or need help with setup, please open an issue in the repository or contact the maintainers.

---

**Happy Tracking! 🏋️‍♂️💪**