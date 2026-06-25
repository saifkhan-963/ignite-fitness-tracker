import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../../components/elements/Elements';
import { Button } from '../../components/elements/Elements';
import { useAuth } from '../../contexts/AuthContext';


export const Header = ({sections, activeSection, setActiveSection, onOpenLogin, onOpenSignup}) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();
    const { isLoggedIn, logout } = useAuth();

    const handleLogout = () => {
      logout();
      navigate('/');
    };

    const handleDashboard = () => {
      navigate('/dashboard');
    };
  
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

    
  
    return (
      <>
        <header className={`
          fixed w-full z-40 transition-all duration-300
          ${isScrolled ? 'bg-white dark:bg-gray-900/75 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-white/75' : 'bg-transparent'}
        `}>
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
            <button className="text-2xl font-bold text-orange-500 hover:scale-110 hover:shadow-lg transition-all duration-300 group relative" onClick={() => scrollToSection('home')}>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>IGNITE</button>
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
                {isLoggedIn ? (
                  <>
                    <Button 
                      variant="primary"
                      onClick={handleDashboard}
                    >
                      Dashboard
                    </Button>
                    <Button 
                      variant="secondary"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="secondary"
                      onClick={onOpenLogin}
                    >
                      Login
                    </Button>
                    <Button 
                      variant="primary"
                      onClick={onOpenSignup}
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>
  
        
      </>
    );
  };