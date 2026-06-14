import React from 'react'
import { Button } from '../../components/elements/Elements';
import { Heart } from 'lucide-react'

export const Pricing = ({isVisible}) => {
  return (
    <div className="container mx-auto px-6">
      <h2 className={`
        text-4xl font-bold text-center mb-16 dark:text-white
        transition-all duration-500 transform
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}
      `}>
        Choose Your Plan
      </h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {[
          {
            title: "Starter",
            price: "Free",
            features: ["Basic route tracking", "Community access", "5 routes per month"],
            color: "from-gray-200 to-gray-300"
          },
          {
            title: "Pro Runner",
            price: "$9.99",
            features: ["Advanced analytics", "Unlimited routes", "Personal coach", "Premium features"],
            color: "from-orange-500 to-pink-500",
            popular: true
          },
          {
            title: "Elite",
            price: "$19.99",
            features: ["Everything in Pro", "Priority support", "Custom training plans", "Race preparation"],
            color: "from-purple-500 to-indigo-500"
          }
        ].map((plan, index) => (
          <div 
            key={index}
            className={`
              relative rounded-2xl overflow-hidden
              transform-gpu transition-all duration-500
              hover:scale-105 hover:shadow-2xl
              ${plan.popular ? 'md:-mt-8 md:mb-8 scale-105' : ''}
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}
            `}
            style={{ transitionDelay: `${index * 200}ms` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r opacity-75 transition-opacity duration-300 hover:opacity-90"
                 style={{ 
                   backgroundImage: `linear-gradient(to right, ${plan.color})` 
                 }} 
            />
            <div className="relative p-8 bg-white dark:bg-gray-800 m-[2px] rounded-2xl h-full flex flex-col
                          transition-colors duration-300">
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-pink-500 
                              text-white px-4 py-1 rounded-bl-lg text-sm font-medium
                              transform transition-transform duration-300 hover:scale-105">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2 dark:text-white">{plan.title}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold dark:text-white">{plan.price}</span>
                <span className="text-gray-500 dark:text-gray-400">/month</span>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-600 dark:text-gray-300">
                    <Heart className="w-5 h-5 mr-2 text-pink-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                variant={plan.popular ? "primary" : "secondary"}
                className={`w-full ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600' 
                    : ''
                }`}
              >
                Get Started
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
