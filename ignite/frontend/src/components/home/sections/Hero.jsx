import React, { useState } from "react"
import runman from "../images/runman.png"
import { Button } from "../../components/elements/Elements"

export const Hero = ({ isVisible }) => {
    return (
        // <div className="absolute inset-0 bg-gradient-to-r from-[#FFF6DA]/90 to-transparent" />
        <div className="container mx-auto px-6 relative">
            <div className="flex flex-col md:flex-row items-center justify-between">
                <div
                    className={`md:w-1/2 space-y-6 transform transition-all duration-1000 ${isVisible.hero ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                        }`}
                >
                    {/* <h1 className="text-6xl font-bold text-[#1E1E1E]">
                IGNITE <br />
                <span className="text-red-500">YOUR LIFE</span>
              </h1>
              <p className="text-xl text-gray-600">
                Running is not just an exercise, <br />
                it's a lifestyle.
              </p> */}
                    <div class="text-[#1E1E1E] space-y-8 ml-10 dark:text-white">
                        <h1 class="text-7xl font-bold mb-6 tracking-tight">
                            <span class="text-8xl block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-600 transform transition-all duration-1000 delay-500">
                                IGNITE
                            </span>
                            <span class="block transform transition-all duration-1000 delay-300">
                                YOUR LIFE
                            </span>
                        </h1>
                        <p class="text-xl text-[#1E1E1E] max-w-2xl mx-auto leading-relaxed dark:text-white transition-all duration-1000 delay-300">
                            Running is not just an exercise,<br />
                             it's a lifestyle.
                        </p>
                        <div class="flex justify-start gap-4 mt-8">
                            <button class="px-4 py-2 rounded-lg font-medium hover:scale-105 transform transition-all duration-300 flex items-center gap-2 bg-[#FF3B00] hover:bg-[#ff5a2b] text-white group bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                                Start Your Journey
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wind w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"><path d="M12.8 19.6A2 2 0 1 0 14 16H2"></path><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"></path><path d="M9.8 4.4A2 2 0 1 1 11 8H2"></path></svg>
                            </button>
                            <Button className="group hover:scale-105 transform transition-all duration-300" variant="secondary">
                                Watch Demo
                                <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                            </Button>
                        </div>
                    </div>
                    {/* <Button 
                size="lg"
                className="group hover:scale-105 transform transition-all duration-300"
              >
                Start Now
                <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
              </Button> */}
                </div>
                <div
                    className={`md:w-1/2 mt-10 md:mt-0 transform transition-all duration-1000 ${isVisible.hero ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
                        }`}
                >
                    <div className="relative">
                        {/* <div 
                        // use the background from body or section tag and apply the gradient from solid to transparent, the gradient should apply after 50 percent of the image
                        className="absolute inset-0 bg-gradient-to-b from-white to-transparent"
                            style={{ 
                                background: 'linear-gradient(to bottom, rgba(255,255,255,0) 50%, rgba(255,255,255,1) 100%)',
                                maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
                                WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)'
                            }}
                        /> */}
                        <img
                            src={runman}

                            alt="Runner"
                            className="rounded-lg drop-shadow-2xl hover:shadow-red-500/20 transition-all duration-500 relative hover:scale-105 hover:drop-shadow-2xl transform"
                            style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.1))' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
