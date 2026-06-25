import React, { useState } from 'react';
import axios from 'axios';

export const Waitlist = ({ isVisible }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await axios.post('http://127.0.0.1:8000/api/waitlist/', { email });
      setSubmitted(true);
    } catch (err) {
      if (err.response?.status === 200) {
        setSubmitted(true);
      } else {
        alert('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`
      container mx-auto px-6 max-w-2xl text-center
      transition-all duration-700 transform
      ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}
    `}>
      <span
        className="inline-block text-orange-500 text-xs font-semibold uppercase tracking-widest mb-4"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        Early Access
      </span>

      <h2
        className="text-4xl md:text-5xl font-bold text-[#1E1E1E] dark:text-white mb-4 tracking-tight"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        Be first to run live.
      </h2>

      <p className="text-gray-600 dark:text-gray-400 text-lg mb-10 leading-relaxed">
        IGNITE is in early access. Drop your email and we'll reach out as soon as your spot opens.
      </p>

      {submitted ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-10">
          <span className="text-4xl block mb-4">🔥</span>
          <h3
            className="text-2xl font-bold text-[#1E1E1E] dark:text-white mb-2"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            You're on the list.
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            We'll reach out when your spot opens. Get your running shoes ready.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex gap-3 flex-wrap justify-center"
        >
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="flex-1 min-w-[240px] px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700
              bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-200"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-7 py-3.5 rounded-xl font-semibold text-white
              bg-gradient-to-r from-orange-500 to-pink-500
              hover:from-orange-600 hover:to-pink-600
              hover:scale-105 transform transition-all duration-300
              disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {loading ? 'Joining...' : 'Join Waitlist'}
          </button>
        </form>
      )}
    </div>
  );
};