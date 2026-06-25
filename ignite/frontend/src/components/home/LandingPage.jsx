import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from './sections/Header';
import { Hero } from './sections/Hero';
import { Features } from './sections/Features';
import { Waitlist } from './sections/Waitlist';
import { Reviews } from './sections/Reviews';
import { Footer } from './sections/Footer';
import { LoginModal, SignupModal } from '../auth/Auth';
import { useAuth } from '../contexts/AuthContext';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard');
    }
  }, [isLoggedIn, navigate]);

  const [isVisible, setIsVisible] = useState({
    hero: false,
    features: false,
    waitlist: false,
    reviews: false
  });

  const [activeSection, setActiveSection] = useState('home');
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const sections = ['home', 'features', 'waitlist', 'reviews'];

  const handleOpenLogin = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  const handleOpenSignup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  const handleSwitchToSignup = () => {
    setShowLogin(false);
    setTimeout(() => setShowSignup(true), 300);
  };

  const handleSwitchToLogin = () => {
    setShowSignup(false);
    setTimeout(() => setShowLogin(true), 300);
  };

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

    setIsVisible(prev => ({ ...prev, hero: true }));

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Header
        sections={sections}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onOpenLogin={handleOpenLogin}
        onOpenSignup={handleOpenSignup}
      />

      <section
        id="home"
        className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-to-br from-[#FFF6DA] to-[#FFE4CC] dark:from-[#2A2D3E] dark:to-[#16182A]"
      >
        <Hero isVisible={isVisible} onOpenSignup={handleOpenSignup} />
      </section>

      <section
        id="features"
        className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-500"
      >
        <Features isVisible={isVisible} />
      </section>

      <section
        id="waitlist"
        className="py-20 bg-gradient-to-br from-[#FFF6DA] to-[#FFE4CC] dark:from-gray-900 dark:to-gray-900"
      >
        <Waitlist isVisible={isVisible.waitlist} />
      </section>

      <section
        id="reviews"
        className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-500"
      >
        <Reviews isVisible={isVisible} />
      </section>

      <section
        id="footer"
        className="pt-20 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900"
      >
        <Footer activeSection={activeSection} setActiveSection={setActiveSection} />
      </section>

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToSignup={handleSwitchToSignup}
      />

      <SignupModal
        isOpen={showSignup}
        onClose={() => setShowSignup(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  );
};