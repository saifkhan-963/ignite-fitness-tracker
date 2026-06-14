import React from 'react'

export const Reviews = ({isVisible}) => {
  return (
    <div className="container mx-auto px-6">
          <h2 className={`text-4xl font-bold text-center mb-12 text-[#1E1E1E] dark:text-white transform transition-all duration-700 ${
            isVisible.reviews ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            What Our Runners Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Marathon Runner",
                comment: "IGNITE has transformed my running routine. The tracking features are incredibly accurate!",
                delay: 0
              },
              {
                name: "Mike Chen",
                role: "Casual Runner",
                comment: "Perfect for beginners! The achievement system keeps me motivated to run regularly.",
                delay: 200
              },
              {
                name: "Emily Davis",
                role: "Trail Runner",
                comment: "The route mapping feature is amazing for discovering new running paths in my area.",
                delay: 400
              }
            ].map((review, index) => (
              <div
                key={index}
                className={`
                  bg-[#FFF6DA] dark:bg-gray-800 rounded-xl p-6 shadow-lg
                  transform transition-all duration-700 hover:-translate-y-2
                  ${isVisible.reviews ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}
                `}
                style={{ transitionDelay: `${review.delay}ms` }}
              >
                <img 
                  src="/api/placeholder/100/100" 
                  alt={review.name} 
                  className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-[#FF3B00]"
                />
                <h3 className="text-xl font-bold text-center text-[#1E1E1E] dark:text-white">{review.name}</h3>
                <p className="text-[#FF3B00] text-center mb-4">{review.role}</p>
                <p className="text-gray-600 dark:text-gray-300 text-center italic">"{review.comment}"</p>
              </div>
            ))}
          </div>
        </div>
  )
}
