import React, { useEffect, useState } from 'react';
import { ThemeToggle } from '../../components/elements/Elements';
import { Button } from '../../components/elements/Elements';
import { LoginModal, SignupModal } from '../../auth/Auth';

export const Header = ({sections, activeSection, setActiveSection}) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
  
    useEffect(() => {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 50);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
  
    const scrollToSection = (sectionId) => {
      const element = document.getElementById(sectionId);
      setActiveSection(sectionId);
      element?.scrollIntoView({ behavior: 'smooth' });
    };

    // Modal management functions
    const handleOpenLogin = () => {
      setShowSignup(false);
      setShowLogin(true);
    };

    const handleOpenSignup = () => {
      setShowLogin(false);
      setShowSignup(true);
    };

    const handleCloseLogin = () => {
      setShowLogin(false);
    };

    const handleCloseSignup = () => {
      setShowSignup(false);
    };

    const handleSwitchToSignup = () => {
      setShowLogin(false);
      setTimeout(() => setShowSignup(true), 300); // Delay to allow animation to complete
    };

    const handleSwitchToLogin = () => {
      setShowSignup(false);
      setTimeout(() => setShowLogin(true), 300); // Delay to allow animation to complete
    };
  
    return (
      <>
        <header className={`
          fixed w-full z-40 transition-all duration-300
          ${isScrolled ? 'bg-white dark:bg-gray-900/75 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-white/75' : 'bg-transparent'}
        `}>
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
            <button class="text-2xl font-bold text-orange-500 hover:scale-110 hover:shadow-lg transition-all duration-300 group relative" onClick={() => scrollToSection('home')}>
            <div class="absolute bottom-0 left-0 w-full h-1 bg-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>IGNITE</button>
              <nav className="hidden md:flex items-center space-x-8">
                {sections.map((section) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className={`
                      capitalize transition-colors duration-300
                      ${activeSection === section 
                        ? 'text-orange-500 border-b-2 border-orange-500' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-orange-500'
                      }
                    `}
                  >
                    {section}
                  </button>
                ))}
              </nav>
  
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <Button 
                  variant="secondary"
                  onClick={handleOpenLogin}
                >
                  Login
                </Button>
                <Button 
                  variant="primary"
                  onClick={handleOpenSignup}
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        </header>
  
        <LoginModal 
          isOpen={showLogin} 
          onClose={handleCloseLogin}
          onSwitchToSignup={handleSwitchToSignup}
        />
        <SignupModal 
          isOpen={showSignup} 
          onClose={handleCloseSignup}
          onSwitchToLogin={handleSwitchToLogin}
        />
      </>
    );
  };