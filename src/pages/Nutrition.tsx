import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Trash2, Apple, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

const API_BASE_URL = 'http://localhost:5000/api';

interface NutritionEntry {
  id: string;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  serving: number;
  date: string;
  mealType: string;
}

interface Food {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

const Nutrition: React.FC = () => {
  const [nutritionEntries, setNutritionEntries] = useState<NutritionEntry[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    serving: 1,
    date: format(new Date(), 'yyyy-MM-dd'),
    mealType: 'breakfast'
  });

  useEffect(() => {
    fetchNutritionEntries();
    fetchFoods();
  }, []);

  const fetchNutritionEntries = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/nutrition`);
      setNutritionEntries(response.data);
    } catch (error) {
      console.error('Failed to fetch nutrition entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFoods = async (search = '') => {
    try {
      const response = await axios.get(`${API_BASE_URL}/nutrition/foods?search=${search}`);
      setFoods(response.data);
    } catch (error) {
      console.error('Failed to fetch foods:', error);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    fetchFoods(term);
  };

  const handleAddFood = async () => {
    if (!selectedFood) return;

    try {
      const nutritionData = {
        foodName: selectedFood.name,
        calories: Math.round(selectedFood.calories * formData.serving),
        protein: Math.round(selectedFood.protein * formData.serving * 10) / 10,
        carbs: Math.round(selectedFood.carbs * formData.serving * 10) / 10,
        fats: Math.round(selectedFood.fats * formData.serving * 10) / 10,
        serving: formData.serving,
        date: formData.date,
        mealType: formData.mealType
      };

      await axios.post(`${API_BASE_URL}/nutrition`, nutritionData);
      fetchNutritionEntries();
      resetForm();
    } catch (error) {
      console.error('Failed to add nutrition entry:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this nutrition entry?')) {
      try {
        await axios.delete(`${API_BASE_URL}/nutrition/${id}`);
        fetchNutritionEntries();
      } catch (error) {
        console.error('Failed to delete nutrition entry:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      serving: 1,
      date: format(new Date(), 'yyyy-MM-dd'),
      mealType: 'breakfast'
    });
    setSelectedFood(null);
    setSearchTerm('');
    setShowModal(false);
  };

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

  // Calculate daily totals
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayEntries = nutritionEntries.filter(entry => 
    entry.date.split('T')[0] === today
  );
  
  const dailyTotals = todayEntries.reduce((totals, entry) => ({
    calories: totals.calories + entry.calories,
    protein: totals.protein + entry.protein,
    carbs: totals.carbs + entry.carbs,
    fats: totals.fats + entry.fats
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

  const dailyGoals = { calories: 2000, protein: 150, carbs: 250, fats: 67 };

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
          <h1 className="text-3xl font-bold text-gray-900">Nutrition Tracking</h1>
          <p className="mt-2 text-gray-600">Track your daily food intake and nutrition goals</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Food
        </button>
      </div>

      {/* Daily Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-2">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#3b82f6"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 36 * Math.min(dailyTotals.calories / dailyGoals.calories, 1)} ${2 * Math.PI * 36}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">
                  {Math.round((dailyTotals.calories / dailyGoals.calories) * 100)}%
                </span>
              </div>
            </div>
            <p className="text-lg font-bold text-gray-900">{dailyTotals.calories}</p>
            <p className="text-sm text-gray-500">Calories</p>
            <p className="text-xs text-gray-400">Goal: {dailyGoals.calories}</p>
          </div>

          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-2">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#10b981"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 36 * Math.min(dailyTotals.protein / dailyGoals.protein, 1)} ${2 * Math.PI * 36}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">
                  {Math.round((dailyTotals.protein / dailyGoals.protein) * 100)}%
                </span>
              </div>
            </div>
            <p className="text-lg font-bold text-gray-900">{Math.round(dailyTotals.protein * 10) / 10}g</p>
            <p className="text-sm text-gray-500">Protein</p>
            <p className="text-xs text-gray-400">Goal: {dailyGoals.protein}g</p>
          </div>

          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-2">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#f59e0b"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 36 * Math.min(dailyTotals.carbs / dailyGoals.carbs, 1)} ${2 * Math.PI * 36}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">
                  {Math.round((dailyTotals.carbs / dailyGoals.carbs) * 100)}%
                </span>
              </div>
            </div>
            <p className="text-lg font-bold text-gray-900">{Math.round(dailyTotals.carbs * 10) / 10}g</p>
            <p className="text-sm text-gray-500">Carbs</p>
            <p className="text-xs text-gray-400">Goal: {dailyGoals.carbs}g</p>
          </div>

          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-2">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#ef4444"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 36 * Math.min(dailyTotals.fats / dailyGoals.fats, 1)} ${2 * Math.PI * 36}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">
                  {Math.round((dailyTotals.fats / dailyGoals.fats) * 100)}%
                </span>
              </div>
            </div>
            <p className="text-lg font-bold text-gray-900">{Math.round(dailyTotals.fats * 10) / 10}g</p>
            <p className="text-sm text-gray-500">Fats</p>
            <p className="text-xs text-gray-400">Goal: {dailyGoals.fats}g</p>
          </div>
        </div>
      </div>

      {/* Today's Meals */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Today's Meals</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {mealTypes.map(mealType => {
            const mealEntries = todayEntries.filter(entry => entry.mealType === mealType);
            const mealTotals = mealEntries.reduce((totals, entry) => ({
              calories: totals.calories + entry.calories
            }), { calories: 0 });

            return (
              <div key={mealType} className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-medium text-gray-900 capitalize">{mealType}</h3>
                  <span className="text-sm text-gray-500">{mealTotals.calories} calories</span>
                </div>
                <div className="space-y-2">
                  {mealEntries.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Apple className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900">{entry.foodName}</p>
                          <p className="text-sm text-gray-500">
                            {entry.serving} serving • {entry.calories} cal • {entry.protein}g protein • {entry.carbs}g carbs • {entry.fats}g fats
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {mealEntries.length === 0 && (
                    <p className="text-gray-500 text-sm italic">No items added yet</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-96 overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add Food Item</h2>
            
            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search for food items..."
                />
              </div>
            </div>

            {/* Food List */}
            {!selectedFood && (
              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {foods.map(food => (
                  <button
                    key={food.id}
                    onClick={() => setSelectedFood(food)}
                    className="w-full text-left p-3 hover:bg-gray-50 border border-gray-200 rounded-lg"
                  >
                    <p className="font-medium text-gray-900">{food.name}</p>
                    <p className="text-sm text-gray-500">
                      {food.calories} cal • {food.protein}g protein • {food.carbs}g carbs • {food.fats}g fats
                    </p>
                  </button>
                ))}
                {foods.length === 0 && searchTerm && (
                  <p className="text-gray-500 text-center py-4">No foods found</p>
                )}
              </div>
            )}

            {/* Selected Food Form */}
            {selectedFood && (
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium text-gray-900">{selectedFood.name}</p>
                  <p className="text-sm text-gray-600">
                    Per serving: {selectedFood.calories} cal • {selectedFood.protein}g protein • {selectedFood.carbs}g carbs • {selectedFood.fats}g fats
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Servings</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={formData.serving}
                    onChange={(e) => setFormData({ ...formData, serving: parseFloat(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Meal Type</label>
                  <select
                    value={formData.mealType}
                    onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {mealTypes.map(type => (
                      <option key={type} value={type} className="capitalize">{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700">Total for this entry:</p>
                  <p className="text-sm text-gray-600">
                    {Math.round(selectedFood.calories * formData.serving)} calories • {' '}
                    {Math.round(selectedFood.protein * formData.serving * 10) / 10}g protein • {' '}
                    {Math.round(selectedFood.carbs * formData.serving * 10) / 10}g carbs • {' '}
                    {Math.round(selectedFood.fats * formData.serving * 10) / 10}g fats
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 mt-6 border-t">
              <button
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              {selectedFood && (
                <button
                  onClick={handleAddFood}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Add Food
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Nutrition;