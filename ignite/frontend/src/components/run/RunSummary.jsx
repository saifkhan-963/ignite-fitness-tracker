import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export const RunSummary = () => {
  const navigate = useNavigate()
  const location = useLocation()

  if (!location.state) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF6DA] to-[#FFE4CC] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
          <h1 className="text-3xl font-extrabold text-orange-500 mb-4">Run Complete!</h1>
          <p className="text-gray-600 mb-8">Run details are no longer available - start a new run!</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const { duration, results, winner_username } = location.state

  const handleShare = () => {
    const text = `I just ran on IGNITE! Time ${duration}. Join me - run together remotely!`
    if (navigator.share) {
      navigator.share({ title: 'IGNITE Run', text })
    } else {
      navigator.clipboard.writeText(text)
      alert('Copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF6DA] to-[#FFE4CC] dark:from-[#2A2D3E] dark:to-[#16182A]">
      <div className="container mx-auto px-6 py-12 max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-orange-500 mb-4">Run Complete!</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-widest mb-2">Total Time</p>
          <p className="text-6xl font-extrabold text-orange-500 tabular-nums tracking-tight mb-6">{duration}</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            🏆 {winner_username} wins!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {results.map(r => (
            <div key={r.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <p className="text-gray-700 dark:text-gray-200 font-bold text-lg mb-4">{r.username}</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Distance</span>
                  <span className="text-gray-800 dark:text-gray-100 font-bold">{r.distance.toFixed(2)} km</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Pace</span>
                  <span className="text-gray-800 dark:text-gray-100 font-bold">{r.pace}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors"
          >
            Run Again
          </button>
          <button
            onClick={handleShare}
            className="px-6 py-3 bg-white dark:bg-gray-800 border-2 border-orange-500 text-orange-500 font-bold rounded-xl hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors"
          >
            Share Result
          </button>
        </div>
      </div>
    </div>
  )
}
