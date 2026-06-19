import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/elements/Elements';
import { authservice } from '../services/AuthService';
import { API_URL } from '../../data/variables';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/me/`, { headers: authservice().getAuthHeader() })
      .then(res => setProfile(res.data))
      .catch(err => console.error('Failed to fetch profile', err));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF6DA] to-[#FFE4CC] dark:from-[#2A2D3E] dark:to-[#16182A] transition-colors duration-500">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900/75 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-white/75">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-orange-500">IGNITE Dashboard</h1>
            {profile && (
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">Welcome back, {profile.username}</p>
            )}
          </div>
          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Runs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-600 dark:text-gray-300 font-semibold">Total Runs</h2>
              <span className="text-2xl">🏃</span>
            </div>
            <p className="text-4xl font-bold text-orange-500">{profile ? profile.total_runs : 0}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Keep up the great work!</p>
          </div>

          {/* Total Distance */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-600 dark:text-gray-300 font-semibold">Total Distance</h2>
              <span className="text-2xl">📍</span>
            </div>
            <p className="text-4xl font-bold text-orange-500">{profile ? profile.total_distance : 0}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">km total</p>
          </div>

          {/* Calories Burned */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-600 dark:text-gray-300 font-semibold">Calories Burned</h2>
              <span className="text-2xl">🔥</span>
            </div>
            <p className="text-4xl font-bold text-orange-500">0</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">kcal total</p>
          </div>

          {/* Current Streak */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-600 dark:text-gray-300 font-semibold">Current Streak</h2>
              <span className="text-2xl">⚡</span>
            </div>
            <p className="text-4xl font-bold text-orange-500">0</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">days in a row</p>
          </div>
        </div>

        {/* Placeholder Message */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <p className="text-center text-gray-600 dark:text-gray-300">
            More features coming soon! Track workouts, set goals, and compete with friends.
          </p>
        </div>
      </main>
    </div>
  );
};
