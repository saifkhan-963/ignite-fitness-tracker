import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

export const RunScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const startedAtRef = useRef(null);

  const fetchSession = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`/sessions/${id}/`);
      setSession(res.data);
      if (res.data.started_at && !startedAtRef.current) {
        startedAtRef.current = new Date(res.data.started_at).getTime();
      }
    } catch {
      // silently keep showing last known data
    }
  }, [id]);

  useEffect(() => {
    axiosInstance.get('/me/').then(res => setCurrentUser(res.data));
  }, []);

  useEffect(() => {
    fetchSession();
    const interval = setInterval(fetchSession, 3000);
    return () => clearInterval(interval);
  }, [fetchSession]);

  useEffect(() => {
    const tick = setInterval(() => {
      if (startedAtRef.current) {
        setElapsed(Math.floor((Date.now() - startedAtRef.current) / 1000));
      }
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  // PLACEHOLDER: simulated GPS stats until real GPS is wired up
  const getSimulatedStats = (participantId) => {
    const seed = (participantId % 5) + 1;
    const pace = 3 + seed * 0.1; // m/s, slightly different per participant
    const distanceKm = (elapsed * pace) / 1000;
    const paceMinPerKm = pace > 0 ? (1000 / pace / 60) : 0;
    const paceStr = `${Math.floor(paceMinPerKm)}:${String(Math.round((paceMinPerKm % 1) * 60)).padStart(2, '0')} /km`;
    return { distanceKm, paceStr };
  };

  if (!session || !currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF6DA] to-[#FFE4CC] flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading run...</p>
      </div>
    );
  }

  const participantStats = (session.participants_data || []).map(p => ({
    ...p,
    ...getSimulatedStats(p.id),
  }));

  const leader = participantStats.reduce((a, b) => (a.distanceKm >= b.distanceKm ? a : b), participantStats[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF6DA] to-[#FFE4CC] dark:from-[#2A2D3E] dark:to-[#16182A]">
      <header className="bg-white dark:bg-gray-900/75 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-white/75">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-orange-500">IGNITE Live Run</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            End Run
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-2xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-widest mb-2">Elapsed Time</p>
          <p className="text-7xl font-extrabold text-orange-500 tabular-nums tracking-tight">
            {formatTime(elapsed)}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {participantStats.map(p => {
            const isYou = p.id === currentUser.id;
            const isLeading = p.id === leader.id && participantStats.length > 1;
            const label = `${p.username}${isYou ? ' (You)' : ''}`;

            return (
              <div
                key={p.id}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 relative border-2 ${
                  isYou ? 'border-orange-400' : 'border-transparent'
                }`}
              >
                {isLeading && (
                  <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Leading
                  </span>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center text-white font-bold">
                    {p.id === session.host ? 'H' : 'P'}
                  </div>
                  <span className="text-gray-700 dark:text-gray-200 font-semibold">{label}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">Distance</span>
                    <span className="text-gray-800 dark:text-gray-100 font-bold text-lg">
                      {p.distanceKm.toFixed(2)} km
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">Pace</span>
                    <span className="text-gray-800 dark:text-gray-100 font-bold text-lg">
                      {p.paceStr}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
