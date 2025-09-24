import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Activity, Clock, Flame } from 'lucide-react';
import { format } from 'date-fns';

const API_BASE_URL = 'http://localhost:5000/api';

interface Workout {
  id: string;
  exerciseName: string;
  exerciseType: string;
  sets: number;
  reps: number;
  duration: number;
  caloriesBurned: number;
  date: string;
  notes?: string;
}

const Workouts: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    exerciseName: '',
    exerciseType: 'cardio',
    sets: 1,
    reps: 1,
    duration: 30,
    caloriesBurned: 0,
    date: format(new Date(), 'yyyy-MM-dd'),
    notes: ''
  });

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/workouts`);
      setWorkouts(response.data);
    } catch (error) {
      console.error('Failed to fetch workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingWorkout) {
        await axios.put(`${API_BASE_URL}/workouts/${editingWorkout.id}`, formData);
      } else {
        await axios.post(`${API_BASE_URL}/workouts`, formData);
      }
      fetchWorkouts();
      resetForm();
    } catch (error) {
      console.error('Failed to save workout:', error);
    }
  };

  const handleEdit = (workout: Workout) => {
    setEditingWorkout(workout);
    setFormData({
      exerciseName: workout.exerciseName,
      exerciseType: workout.exerciseType,
      sets: workout.sets,
      reps: workout.reps,
      duration: workout.duration,
      caloriesBurned: workout.caloriesBurned,
      date: workout.date.split('T')[0],
      notes: workout.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await axios.delete(`${API_BASE_URL}/workouts/${id}`);
        fetchWorkouts();
      } catch (error) {
        console.error('Failed to delete workout:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      exerciseName: '',
      exerciseType: 'cardio',
      sets: 1,
      reps: 1,
      duration: 30,
      caloriesBurned: 0,
      date: format(new Date(), 'yyyy-MM-dd'),
      notes: ''
    });
    setEditingWorkout(null);
    setShowModal(false);
  };

  const exerciseTypes = ['cardio', 'strength', 'flexibility', 'sports', 'other'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workouts</h1>
          <p className="mt-2 text-gray-600">Track your exercise activities and progress</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Workout
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Workouts</p>
              <p className="text-2xl font-bold text-gray-900">{workouts.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-50 rounded-lg">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Duration</p>
              <p className="text-2xl font-bold text-gray-900">
                {workouts.reduce((sum, w) => sum + w.duration, 0)} min
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-50 rounded-lg">
              <Flame className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Calories Burned</p>
              <p className="text-2xl font-bold text-gray-900">
                {workouts.reduce((sum, w) => sum + w.caloriesBurned, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Workouts List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Your Workouts</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {workouts.map((workout) => (
            <div key={workout.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Activity className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{workout.exerciseName}</h3>
                    <p className="text-sm text-gray-500 capitalize">{workout.exerciseType}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Sets x Reps</p>
                    <p className="font-medium text-gray-900">{workout.sets} x {workout.reps}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium text-gray-900">{workout.duration} min</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Calories</p>
                    <p className="font-medium text-gray-900">{workout.caloriesBurned}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium text-gray-900">
                      {format(new Date(workout.date), 'MMM dd')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(workout)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(workout.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              {workout.notes && (
                <div className="mt-3 ml-14">
                  <p className="text-sm text-gray-600">{workout.notes}</p>
                </div>
              )}
            </div>
          ))}
          {workouts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No workouts recorded yet. Add your first workout to get started!</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingWorkout ? 'Edit Workout' : 'Add New Workout'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Exercise Name</label>
                <input
                  type="text"
                  required
                  value={formData.exerciseName}
                  onChange={(e) => setFormData({ ...formData, exerciseName: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Push-ups, Running, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Exercise Type</label>
                <select
                  value={formData.exerciseType}
                  onChange={(e) => setFormData({ ...formData, exerciseType: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {exerciseTypes.map(type => (
                    <option key={type} value={type} className="capitalize">{type}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sets</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.sets}
                    onChange={(e) => setFormData({ ...formData, sets: parseInt(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reps</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.reps}
                    onChange={(e) => setFormData({ ...formData, reps: parseInt(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Calories Burned</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.caloriesBurned}
                    onChange={(e) => setFormData({ ...formData, caloriesBurned: parseInt(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Notes (optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any additional notes..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingWorkout ? 'Update' : 'Add'} Workout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workouts;