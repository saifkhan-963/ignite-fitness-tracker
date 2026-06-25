import React from 'react';

const Avatar = ({ initials, color }) => (
  <div
    className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-lg"
    style={{
      background: color,
      fontFamily: "'Space Grotesk', sans-serif"
    }}
  >
    {initials}
  </div>
);

export const Reviews = ({ isVisible }) => {
  const reviews = [
    {
      initials: 'AK',
      color: 'linear-gradient(135deg, #FF4D00, #ff7043)',
      name: 'Ahmed K.',
      role: 'Daily Runner · Karachi',
      comment: "I ran with my friend in London while I was in Karachi. It felt surreal — like we were actually together. I haven't missed a run since.",
      delay: 0
    },
    {
      initials: 'SR',
      color: 'linear-gradient(135deg, #f97316, #ec4899)',
      name: 'Sara R.',
      role: 'Beginner Runner · Dubai',
      comment: "I used to quit every run after 10 minutes. Knowing someone else is running at the exact same time as me changed everything. Three weeks, zero missed sessions.",
      delay: 200
    },
    {
      initials: 'JM',
      color: 'linear-gradient(135deg, #FF4D00, #f97316)',
      name: 'James M.',
      role: 'Competitive Runner · London',
      comment: "Strava is about showing off after. IGNITE is about showing up together. Completely different feeling — this is what running apps should have been all along.",
      delay: 400
    }
  ];

  return (
    <div className="container mx-auto px-6">
      <h2 className={`
        text-4xl font-bold text-center mb-4 text-[#1E1E1E] dark:text-white
        transform transition-all duration-700
        ${isVisible.reviews ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}
      `}>
        What early runners say
      </h2>
      <p className={`
        text-center text-gray-500 dark:text-gray-400 mb-12
        transform transition-all duration-700 delay-100
        ${isVisible.reviews ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}
      `}>
        From our early access community
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        {reviews.map((review, index) => (
          <div
            key={index}
            className={`
              bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm
              border border-gray-100 dark:border-gray-700
              transform transition-all duration-700 hover:-translate-y-2
              ${isVisible.reviews ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}
            `}
            style={{ transitionDelay: `${review.delay}ms` }}
          >
            <Avatar initials={review.initials} color={review.color} />
            <h3
              className="text-lg font-bold text-center text-[#1E1E1E] dark:text-white mb-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {review.name}
            </h3>
            <p className="text-[#FF3B00] text-center text-sm mb-4 font-medium">
              {review.role}
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-center italic leading-relaxed">
              "{review.comment}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};