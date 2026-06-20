import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/elements/Elements';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [joinCode, setJoinCode] = useState('');

  useEffect(() => {
    axiosInstance.get('/me/')
      .then(res => setProfile(res.data))
      .catch(err => console.error('Failed to fetch profile', err));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCreateSession = async () => {
    try {
      const res = await axiosInstance.post('/sessions/create/', {});
      navigate(`/session/${res.data.id}`);
    } catch (err) {
      console.error('Failed to create session', err);
    }
  };

  const handleJoinSession = async () => {
    try {
      const res = await axiosInstance.post('/sessions/join/', { invite_code: joinCode });
      navigate(`/session/${res.data.id}`);
    } catch (err) {
      console.error('Failed to join session', err);
    }
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

        {/* Run Session Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleCreateSession}
            className="flex-1 py-4 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg transition-colors shadow-lg"
          >
            Create Run
          </button>
          <button
            onClick={() => setShowJoinInput(prev => !prev)}
            className="flex-1 py-4 rounded-lg bg-white dark:bg-gray-800 border-2 border-orange-500 text-orange-500 font-bold text-lg hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors shadow-lg"
          >
            Join Run
          </button>
        </div>

        {showJoinInput && (
          <div className="mt-4 flex gap-3">
            <input
              type="text"
              value={joinCode}
              onChange={e => setJoinCode(e.target.value.toUpperCase())}
              placeholder="Enter invite code"
              maxLength={8}
              className="flex-1 px-4 py-3 rounded-lg border-2 border-orange-300 focus:border-orange-500 outline-none font-mono text-lg tracking-widest uppercase dark:bg-gray-800 dark:text-white"
            />
            <button
              onClick={handleJoinSession}
              className="px-6 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold transition-colors"
            >
              Join
            </button>
          </div>
        )}

        {/* Placeholder Message */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <p className="text-center text-gray-600 dark:text-gray-300">
            More features coming soon! Track workouts, set goals, and compete with friends.
          </p>
        </div>
      </main>
    </div>
  );
};
