import { BrowserRouter as Router, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Desktop link classes
  const desktopBaseClasses = "text-sm pb-1 transition";
  const desktopInactive = "text-gray-400 hover:text-gray-800";
  const desktopActive = "text-gray-800";

  // Mobile link classes (unchanged)
  const mobileBaseClasses = "block text-lg transition px-2 py-1 rounded";
  const mobileInactive = "text-gray-500 hover:text-gray-800 hover:bg-gray-100";
  const mobileActive = "text-gray-800 bg-gray-100";

  return (
    <div className="sticky top-0 z-[50] w-full">
      <nav className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-5 flex justify-between items-center">
          <NavLink to="/" className="text-2xl font-dancing-script text-gray-900 font-bold">
            Daniela Alves
          </NavLink>
          
          {/* Desktop Menu (hidden on small screens) */}
          <div className="hidden md:flex space-x-10 mt-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `${desktopBaseClasses} ${
                  isActive ? desktopActive : desktopInactive
                }`
              }
            >
              HOME
            </NavLink>
            {/* <NavLink
              to="/about"
              className={({ isActive }) =>
                `${desktopBaseClasses} ${
                  isActive ? desktopActive : desktopInactive
                }`
              }
            >
              ABOUT ME
            </NavLink> */}
            <NavLink
              to="/designs"
              className={({ isActive }) =>
                `${desktopBaseClasses} ${
                  isActive ? desktopActive : desktopInactive
                }`
              }
            >
              DESIGNS
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `${desktopBaseClasses} ${
                  isActive ? desktopActive : desktopInactive
                }`
              }
            >
              CONTACT
            </NavLink>
            <NavLink
              to="/guide"
              className={({ isActive }) =>
                `${desktopBaseClasses} ${
                  isActive ? desktopActive : desktopInactive
                }`
              }
            >
              GUIDE
            </NavLink>
            <NavLink
              to="/faq"
              className={({ isActive }) =>
                `${desktopBaseClasses} ${
                  isActive ? desktopActive : desktopInactive
                }`
              }
            >
              FAQ
            </NavLink>
          </div>

          {/* Mobile Menu Icon (shown on small screens) */}
          <div className="md:hidden">
            <button
              aria-label="Toggle menu"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay (fades in/out) */}
      <div
        className={`
          absolute top-full left-0 w-full bg-white border-t border-b z-[50]
          transition-opacity duration-300 ease-in-out
          ${isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      >
        <div className="px-4 py-4 space-y-2">
          <NavLink
            to="/"
            end
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              `${mobileBaseClasses} ${
                isActive ? mobileActive : mobileInactive
              }`
            }
          >
            HOME
          </NavLink>
          {/* <NavLink
            to="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              `${mobileBaseClasses} ${
                isActive ? mobileActive : mobileInactive
              }`
            }
          >
            ABOUT ME
          </NavLink> */}
          <NavLink
            to="/designs"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              `${mobileBaseClasses} ${
                isActive ? mobileActive : mobileInactive
              }`
            }
          >
            DESIGNS
          </NavLink>
          <NavLink
            to="/contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              `${mobileBaseClasses} ${
                isActive ? mobileActive : mobileInactive
              }`
            }
          >
            CONTACT
          </NavLink>
          <NavLink
            to="/guide"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              `${mobileBaseClasses} ${
                isActive ? mobileActive : mobileInactive
              }`
            }
          >
            GUIDE
          </NavLink>
          <NavLink
            to="/faq"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              `${mobileBaseClasses} ${
                isActive ? mobileActive : mobileInactive
              }`
            }
          >
            FAQ
          </NavLink>
        </div>
      </div>
    </div>
  );
}
