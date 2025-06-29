import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import { scrollToElement } from './scrollUtils';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Add custom keyframes for the animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      // Show navbar when at top of page
      if (currentScrollY < 10) {
        setIsVisible(true);
      } 
      // Hide navbar when scrolling down, show when scrolling up
      else if (currentScrollY > lastScrollY && currentScrollY > 0) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileNavClick = (action) => {
    if (typeof action === 'function') {
      action();
    }
    setIsMobileMenuOpen(false);
  };

  const handleScrollToSection = (sectionId, duration = 2500) => {
    // Check if we're on the home page
    const isOnHomePage = location.pathname === '/';
    
    if (isOnHomePage) {
      // We're already on home, just scroll
      scrollToElement(sectionId, duration);
    } else {
      // Navigate to home first using React Router
      navigate('/');
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        scrollToElement(sectionId, duration);
      }, 300);
    }
  };

  const handleGalleryClick = () => {
    navigate('/designs');
  };

  return (
    <>
      {/* Main Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-stone-200 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Brand */}
          <NavLink
            to="/"
            className="text-2xl font-dancing-script text-gray-900 font-bold mt-2"
          >
            Daniela Alves
          </NavLink>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#"
              className="text-stone-600 hover:text-stone-900 transition-colors text-sm font-light uppercase"
            >
              Home
            </a>
            <button
              onClick={() => handleScrollToSection('services')}
              className="text-stone-600 hover:text-stone-900 transition-colors text-sm font-light uppercase"
            >
              Services
            </button>
            
            {/* Gallery Link */}
            <button
              onClick={handleGalleryClick}
              className="text-stone-600 hover:text-stone-900 transition-colors text-sm font-light uppercase"
            >
              Gallery
            </button>

            <button
              onClick={() => handleScrollToSection('testimonials')}
              className="text-stone-600 hover:text-stone-900 transition-colors text-sm font-light uppercase"
            >
              Client Stories
            </button>
            <button
              onClick={() => handleScrollToSection('faq')}
              className="text-stone-600 hover:text-stone-900 transition-colors text-sm font-light uppercase"
            >
              FAQ
            </button>
            <button
              onClick={() => handleScrollToSection('book-form')}
              className="text-stone-600 hover:text-stone-900 transition-colors text-sm font-light uppercase"
            >
              Contact
            </button>
            <a
              href="https://wa.me/27661043677?text=Hi%20Daniela!%20I'd%20like%20to%20book%20an%20appointment.%20My%20name%20is%20____%20and%20I'm%20interested%20in%20____."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-stone-900 text-white px-6 py-2 text-sm font-light hover:bg-stone-800 transition-colors uppercase"
            >
              Book Now
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden relative w-6 h-6 flex flex-col justify-center items-center z-50"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span className={`block h-0.5 w-6 bg-gray-900 transition-all duration-300 ease-in-out absolute ${
              isMobileMenuOpen ? 'rotate-45' : 'translate-y-[-4px]'
            }`} />
            <span className={`block h-0.5 w-6 bg-gray-900 transition-all duration-300 ease-in-out ${
              isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
            }`} />
            <span className={`block h-0.5 w-6 bg-gray-900 transition-all duration-300 ease-in-out absolute ${
              isMobileMenuOpen ? '-rotate-45' : 'translate-y-[4px]'
            }`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ease-in-out top-[73px] ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        {/* Background Overlay */}
        <div 
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Side Panel */}
        <div className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          {/* Navigation Links */}
          <div className="flex flex-col h-full">
            <div className="flex-1 py-6">
              <nav className="space-y-1">
                <a
                  href="/"
                  onClick={() => handleMobileNavClick()}
                  className="flex items-center px-6 py-3 text-stone-700 hover:text-stone-900 hover:bg-stone-50 transition-colors group"
                >
                  <span className="font-medium uppercase">Home</span>
                  <ChevronRight size={16} className="ml-auto text-stone-400 group-hover:text-stone-600 transition-colors" />
                </a>
                
                <button
                  onClick={() => handleMobileNavClick(() => handleScrollToSection('services'))}
                  className="flex items-center w-full px-6 py-3 text-left text-stone-700 hover:text-stone-900 hover:bg-stone-50 transition-colors group"
                >
                  <span className="font-medium uppercase">Services</span>
                  <ChevronRight size={16} className="ml-auto text-stone-400 group-hover:text-stone-600 transition-colors" />
                </button>

                {/* Gallery Link */}
                <button
                  onClick={() => handleMobileNavClick(handleGalleryClick)}
                  className="flex items-center w-full px-6 py-3 text-left text-stone-700 hover:text-stone-900 hover:bg-stone-50 transition-colors group"
                >
                  <span className="font-medium uppercase">Gallery</span>
                  <ChevronRight size={16} className="ml-auto text-stone-400 group-hover:text-stone-600 transition-colors" />
                </button>

                <button
                  onClick={() => handleMobileNavClick(() => handleScrollToSection('testimonials'))}
                  className="flex items-center w-full px-6 py-3 text-left text-stone-700 hover:text-stone-900 hover:bg-stone-50 transition-colors group"
                >
                  <span className="font-medium uppercase">Client Stories</span>
                  <ChevronRight size={16} className="ml-auto text-stone-400 group-hover:text-stone-600 transition-colors" />
                </button>

                <button
                  onClick={() => handleMobileNavClick(() => handleScrollToSection('faq'))}
                  className="flex items-center w-full px-6 py-3 text-left text-stone-700 hover:text-stone-900 hover:bg-stone-50 transition-colors group"
                >
                  <span className="font-medium uppercase">FAQ</span>
                  <ChevronRight size={16} className="ml-auto text-stone-400 group-hover:text-stone-600 transition-colors" />
                </button>

                <button
                  onClick={() => handleMobileNavClick(() => handleScrollToSection('book-form'))}
                  className="flex items-center w-full px-6 py-3 text-left text-stone-700 hover:text-stone-900 hover:bg-stone-50 transition-colors group"
                >
                  <span className="font-medium uppercase">Contact</span>
                  <ChevronRight size={16} className="ml-auto text-stone-400 group-hover:text-stone-600 transition-colors" />
                </button>
              </nav>
            </div>

            {/* Book Now Button */}
            <div className="p-6 border-t border-stone-100">
              <a
                href="https://wa.me/27661043677?text=Hi%20Daniela!%20I'd%20like%20to%20book%20an%20appointment.%20My%20name%20is%20____%20and%20I'm%20interested%20in%20____."
                onClick={() => setIsMobileMenuOpen(false)}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-stone-900 text-white px-6 py-3 text-center font-medium hover:bg-stone-800 transition-colors uppercase"
              >
                Book Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}