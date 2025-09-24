import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts';
import { Activity, Flame, Target, TrendingUp, Users, Calendar } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

interface DashboardStats {
  totalWorkouts: number;
  weeklyWorkouts: number;
  totalCaloriesBurned: number;
  totalCaloriesConsumed: number;
  totalSteps: number;
  workoutHistory: any[];
  nutritionHistory: any[];
  progressHistory: any[];
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      name: 'Total Workouts',
      value: stats?.totalWorkouts || 0,
      icon: Activity,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'This Week',
      value: stats?.weeklyWorkouts || 0,
      icon: Calendar,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: 'Calories Burned',
      value: stats?.totalCaloriesBurned || 0,
      icon: Flame,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      name: 'Total Steps',
      value: stats?.totalSteps || 0,
      icon: TrendingUp,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  // Prepare chart data
  const workoutData = stats?.workoutHistory.slice(-7).map((workout, index) => ({
    date: new Date(workout.date).toLocaleDateString('en-US', { weekday: 'short' }),
    calories: workout.caloriesBurned || 0,
    duration: workout.duration || 0
  })) || [];

  const nutritionData = [
    { name: 'Consumed', value: stats?.totalCaloriesConsumed || 0 },
    { name: 'Burned', value: stats?.totalCaloriesBurned || 0 }
  ];

  const COLORS = ['#3B82F6', '#EF4444'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="text-blue-100 mt-2">Here's your fitness journey overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                  <Icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.name === 'Calories Burned' || stat.name === 'Total Steps' 
                      ? stat.value.toLocaleString()
                      : stat.value
                    }
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Workout Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Workout Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={workoutData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="calories" fill="#3B82F6" name="Calories Burned" />
              <Bar dataKey="duration" fill="#10B981" name="Duration (min)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Calories Overview */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Calories Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={nutritionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {nutritionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {stats?.workoutHistory.slice(-5).map((workout, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">{workout.exerciseName}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(workout.date).toLocaleDateString()} • {workout.duration} min
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{workout.caloriesBurned} cal</p>
                <p className="text-sm text-gray-500">{workout.sets} sets</p>
              </div>
            </div>
          ))}
          {(!stats?.workoutHistory.length || stats.workoutHistory.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No workouts recorded yet. Start your fitness journey!</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 rounded-lg text-blue-700 hover:bg-blue-100 transition-colors">
            <Activity className="h-6 w-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Log Workout</span>
          </button>
          <button className="p-4 bg-green-50 rounded-lg text-green-700 hover:bg-green-100 transition-colors">
            <Target className="h-6 w-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Add Meal</span>
          </button>
          <button className="p-4 bg-purple-50 rounded-lg text-purple-700 hover:bg-purple-100 transition-colors">
            <TrendingUp className="h-6 w-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Log Steps</span>
          </button>
          <button className="p-4 bg-red-50 rounded-lg text-red-700 hover:bg-red-100 transition-colors">
            <Users className="h-6 w-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Set Goal</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;