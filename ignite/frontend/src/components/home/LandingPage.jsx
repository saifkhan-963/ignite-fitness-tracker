import React, { useState, useEffect } from 'react'
import { Header } from './sections/Header'
import { Hero } from './sections/Hero'
import { Features } from './sections/Features';
import { Pricing } from './sections/Pricing';
import { Reviews } from './sections/Reviews';
import { Footer } from './sections/Footer';

export const LandingPage = () => {
  const [isVisible, setIsVisible] = useState({
    hero: false,
    features: false,
    pricing: false,
    reviews: false
  });
  const [activeSection, setActiveSection] = useState('home');

  const sections = ['home', 'features', 'pricing', 'reviews'];
  useEffect(() => {
    const handleScroll = () => {
      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          setIsVisible(prev => ({
            ...prev,
            [section]: rect.top <= window.innerHeight * 0.75
          }));
        }
      });
    };

    setIsVisible(prev => ({ ...prev, hero: true })); // Show hero section immediately
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <>
      <Header sections={sections} activeSection={activeSection} setActiveSection={setActiveSection} />
      <section
        id="home"
        className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-to-br from-[#FFF6DA] to-[#FFE4CC] dark:from-[#2A2D3E] dark:to-[#16182A]"
      >
        <Hero isVisible={isVisible} />
      </section>
      <section
        id="features"
        className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-500"
      >
        <Features isVisible={isVisible} />
      </section>
      <section
        id="pricing"
        className="py-20 bg-gradient-to-br from-[#FFF6DA] to-[#FFE4CC] dark:from-gray-900 dark:to-gray-900"
      >
        <Pricing isVisible={isVisible.pricing} />
      </section>
      <section
        id="reviews"
        className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-500"
      >
        <Reviews isVisible={isVisible} />
      </section>
      <section id="footer" className="pt-20 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900">
        <Footer activeSection={activeSection} setActiveSection={setActiveSection} />
      </section>

    </>
  )
}
