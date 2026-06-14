import React from "react";
import { Map, BarChart2, Trophy, Users, Smartphone, User } from "lucide-react";

export const Features = ({isVisible}) => {
    const features = [
      {
        icon: Map,
        title: "Real-Time Tracking",
        description: "Track your runs with precision GPS mapping and get detailed insights about your performance."
      },
      {
        icon: BarChart2,
        title: "Advanced Analytics",
        description: "Deep dive into your running metrics with AI-powered insights and personalized recommendations."
      },
      {
        icon: Trophy,
        title: "Achievement System",
        description: "Earn badges, unlock achievements, and celebrate your milestones as you progress."
      },
      {
        icon: Users,
        title: "Global Community",
        description: "Connect with runners worldwide, share experiences, and participate in virtual races."
      },
      {
        icon: Smartphone,
        title: "Cross-Platform",
        description: "Seamlessly sync your data across all devices with our cloud-based platform."
      },
      {
        icon: User,
        title: "Personal Coach",
        description: "Get AI-powered training plans tailored to your goals and fitness level."
      }
    ];
  
    return (
      <div className="container mx-auto px-6 transition-colors duration-500">
        <h2 className={`
    text-4xl font-bold text-center text-gray-900 dark:text-white mb-16 
    transition-all duration-500 transform 
    ${isVisible.features ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}
  `}>
        
          Why Choose <span className="text-orange-500">IGNITE</span>?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index} 
              {...feature} 
              delay={index * 200} // Add delay for staggered animation
              isVisible={isVisible.features}
            />
          ))}
        </div>
      </div>
    );
  };

const FeatureCard = ({ icon: Icon, title, description, delay, isVisible }) => {
  return (
    <div 
      className={`group relative p-8 rounded-xl from-gray-100 to-gray-300 bg-gradient-to-br dark:from-gray-900 dark:to-black 
        hover:-translate-y-2 hover:scale-105 hover:shadow-2xl overflow-hidden transform-gpu 
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
      style={{ 
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        transitionDelay: `${delay}ms`
      }}
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-100 to-pink-100 
        dark:from-orange-600/20 dark:to-orange-900/20 opacity-0 
        group-hover:opacity-100 transition-opacity duration-500"
      />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-12 h-12 text-orange-500 transition-colors duration-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 
          transition-colors duration-500">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-700 
          dark:group-hover:text-gray-300 transition-colors duration-500">
          {description}
        </p>
      </div>
  
      {/* Hover Border Effect */}
      <div className="absolute inset-0 border-2 border-orange-500 opacity-0 
        group-hover:opacity-100 transition-opacity duration-500 rounded-xl" 
      />
    </div>
  );
};
