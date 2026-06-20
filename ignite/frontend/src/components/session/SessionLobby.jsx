import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

export const SessionLobby = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);

  const fetchSession = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`/sessions/${id}/`);
      setSession(res.data);
    } catch (err) {
      setError('Failed to load session.');
    }
  }, [id]);

  useEffect(() => {
    axiosInstance.get('/me/')
      .then(res => setCurrentUser(res.data))
      .catch(() => setError('Failed to load user.'));
  }, []);

  useEffect(() => {
    fetchSession();
    const interval = setInterval(fetchSession, 3000);
    return () => clearInterval(interval);
  }, [fetchSession]);

  const handleStartRun = async () => {
    try {
      await axiosInstance.post(`/sessions/${id}/start/`);
    } catch {
      setError('Failed to start run.');
    }
  };

  useEffect(() => {
    if (session && session.status === 'active') {
      navigate(`/run/${id}`);
    }
  }, [session, id, navigate]);

  const handleLeave = async () => {
    navigate('/dashboard');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF6DA] to-[#FFE4CC] flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!session || !currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF6DA] to-[#FFE4CC] flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading session...</p>
      </div>
    );
  }

  const isHost = session.host === currentUser.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF6DA] to-[#FFE4CC] dark:from-[#2A2D3E] dark:to-[#16182A]">
      <header className="bg-white dark:bg-gray-900/75 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-white/75">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-orange-500">IGNITE Run Session</h1>
          <button
            onClick={handleLeave}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Leave Session
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-2xl">
        {isHost && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-widest mb-2">Invite Code</p>
            <p className="text-5xl font-extrabold text-orange-500 tracking-widest">{session.invite_code}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-3">Share this code with friends to join your session</p>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-700 dark:text-gray-200 font-semibold text-lg">Participants</h2>
            <span className="text-sm text-orange-500 font-medium">{session.participants.length} joined</span>
          </div>
          {session.participants.length === 0 ? (
            <p className="text-gray-400 text-sm">No participants yet.</p>
          ) : (
            <ul className="space-y-2">
              {session.participants.map((participantId) => (
                <li
                  key={participantId}
                  className="flex items-center gap-3 px-4 py-3 bg-orange-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-white font-bold text-sm">
                    {participantId === session.host ? 'H' : 'P'}
                  </div>
                  <span className="text-gray-700 dark:text-gray-200 text-sm">
                    {participantId === session.host ? 'Host' : `Runner ${participantId}`}
                    {participantId === currentUser.id && ' (You)'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-300 font-semibold">Status</span>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              session.status === 'waiting'
                ? 'bg-yellow-100 text-yellow-700'
                : session.status === 'active'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
            </span>
          </div>
        </div>

        {isHost && session.status === 'waiting' && (
          <button
            onClick={handleStartRun}
            className="w-full py-4 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg transition-colors shadow-lg"
          >
            Start Run
          </button>
        )}
      </main>
    </div>
  );
};
