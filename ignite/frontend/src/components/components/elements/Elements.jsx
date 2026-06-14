import React, {useState, useEffect} from 'react'
import { Sun, Moon, X, Loader, Check } from 'lucide-react'

// Button Component with loading state
export const Button = ({ children, variant = 'primary', icon: Icon, className = '', loading = false, ...props }) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 relative';
  const variants = {
    primary: 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white disabled:bg-orange-300',
    secondary: 'border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white disabled:opacity-50',
    ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800 disabled:hover:bg-transparent'
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className} hover:scale-105 transform transition-all duration-300`} 
      disabled={loading}
      {...props}
    >
      {loading ? (
        <Loader className="w-5 h-5 animate-spin" />
      ) : (
        <>
          {Icon && <Icon className="w-5 h-5" />}
          {children}
        </>
      )}
      {/* Button press effect overlay */}
      <span className="absolute inset-0 bg-black opacity-0 transition-opacity duration-100 rounded-lg hover:opacity-5 active:opacity-10" />
    </button>
  );
};

// Enhanced Input Component
export const Input = ({ label, icon: Icon, error, success, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 
                         transition-colors duration-200">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <Icon className={`absolute left-3 w-5 h-5 z-10
            ${error ? 'text-red-500' : 
              success ? 'text-green-500' : 
              isFocused ? 'text-orange-500' : 'text-gray-400'}
            transition-colors duration-200`}
          />
        )}
        <input
          {...props}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full rounded-lg border bg-white dark:bg-gray-800
            transition-all duration-200
            ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2
            ${error 
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
              : success
              ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
              : 'border-gray-300 dark:border-gray-600 focus:ring-orange-500 focus:border-orange-500'}
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            dark:text-white
          `}
        />
        {/* Success/Error icons */}
        {(error || success) && (
          <div className="absolute right-3">
            {error && <X className="w-5 h-5 text-red-500" />}
            {success && <Check className="w-5 h-5 text-green-500" />}
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1 animate-slideIn">
          {error}
        </p>
      )}
    </div>
  );
};

// Theme Toggle Component
export const ThemeToggle = () => {
    const [isDark, setIsDark] = useState(false);
  
    useEffect(() => {
      const theme = localStorage.getItem('theme') || 'light';
      setIsDark(theme === 'dark');
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }, []);
  
    const toggleTheme = () => {
      const newTheme = isDark ? 'light' : 'dark';
      setIsDark(!isDark);
      localStorage.setItem('theme', newTheme);
      document.documentElement.classList.toggle('dark', !isDark);
    };
  
    return (
      <Button 
        variant="ghost" 
        onClick={toggleTheme}
        icon={isDark ? Sun : Moon}
        className="text-gray-600 dark:text-gray-300"
        aria-label="Toggle theme"
      />
    );
  };

// Enhanced Modal Component with animations
export const Modal = ({ isOpen, onClose, children, title }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
      // Delay removing the modal from DOM until animation completes
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8
        ${isAnimating ? 'animate-fade-in' : 'animate-fadeOut'}`}
      style={{ 
        animation: isAnimating 
          ? 'fadeIn 0.3s ease-out forwards'
          : 'fadeOut 0.3s ease-in forwards'
      }}
    >
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300
          ${isAnimating ? 'opacity-50' : 'opacity-0'}`}
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className={`relative bg-white dark:bg-gray-800 rounded-lg w-full max-w-md
          shadow-xl transform transition-all duration-300 max-h-[90vh]
          flex flex-col
          ${isAnimating 
            ? 'animate-modalIn opacity-100 scale-100' 
            : 'animate-modalOut opacity-0 scale-95'}`}
        style={{ 
          animation: isAnimating 
            ? 'modalIn 0.3s ease-out forwards'
            : 'modalOut 0.3s ease-in forwards',
        }}
      >
        {/* Header - Fixed */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white 
            transform transition-all duration-300">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300
              transition-all duration-200 rounded-full p-1
              hover:bg-gray-100 dark:hover:bg-gray-700
              transform hover:rotate-90"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Content - Scrollable */}
        <div className={`flex-1 overflow-y-auto p-6
          scrollbar-thin scrollbar-thumb-rounded-md
          scrollbar-track-transparent
          hover:scrollbar-thumb-scrollbar-lightHover
          dark:hover:scrollbar-thumb-scrollbar-darkHover
          scrollbar-thumb-scrollbar-light
          dark:scrollbar-thumb-scrollbar-dark
          transform transition-all duration-300 delay-100
          ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

// Add these animations to your tailwind.config.js
/**
 * @keyframes fadeIn {
 *   from { opacity: 0; }
 *   to { opacity: 1; }
 * }
 * @keyframes fadeOut {
 *   from { opacity: 1; }
 *   to { opacity: 0; }
 * }
 * @keyframes modalIn {
 *   from { 
 *     opacity: 0;
 *     transform: scale(0.95) translateY(10px);
 *   }
 *   to { 
 *     opacity: 1;
 *     transform: scale(1) translateY(0);
 *   }
 * }
 * @keyframes modalOut {
 *   from { 
 *     opacity: 1;
 *     transform: scale(1) translateY(0);
 *   }
 *   to { 
 *     opacity: 0;
 *     transform: scale(0.95) translateY(10px);
 *   }
 * }
 */
