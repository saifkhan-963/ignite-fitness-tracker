import React from "react";
import { Zap, MapPin, Flag, Mic, Scale, Shield } from "lucide-react";

export const Features = ({isVisible}) => {
    const features = [
      {
        icon: Zap,
        title: "Truly Synchronous",
        description: "Both of you run at the exact same moment. Not share-after, not leaderboards — live, right now, together. No other app does this."
      },
      {
        icon: MapPin,
        title: "Route Moments",
        description: "Drop a photo or short video pinned to your GPS location mid-run. Your route becomes a living map of real moments, not just a stat line."
      },
      {
        icon: Flag,
        title: "Pursuit Mode",
        description: "Start behind your friend and close the gap live. Every meter matters. The most competitive running experience ever built. Coming soon."
      },
      {
        icon: Mic,
        title: "Voice During Runs",
        description: "Talk while you run. No phone calls, no switching apps — just your running partner in your ear, live, the whole session."
      },
      {
        icon: Scale,
        title: "Live Handicapping",
        description: "A beginner vs a veteran is still a fair race. IGNITE auto-balances the gap so every run is competitive regardless of fitness level."
      },
      {
        icon: Shield,
        title: "Never Lose a Run",
        description: "Every session is saved, always. No GPS glitch, no app crash, no lost data. Your run is yours permanently — unlike other apps."
      }
    ];
  
    return (
      <div className="container mx-auto px-6 transition-colors duration-500">
        <h2 className={`
    text-4xl font-bold text-center text-gray-900 dark:text-white mb-16 
    transition-all duration-500 transform 
    ${isVisible.features ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}
  `}>
        
          Built for the run. <span className="text-orange-500">Not the post.</span>
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
