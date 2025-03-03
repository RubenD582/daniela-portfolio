import { BrowserRouter as Router, Link } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="sticky top-0 z-[50] w-full relative">
      <nav className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-5 flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-dancing-script text-gray-900 font-bold"
          >
            Daniela Alves
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-10 text-sm mt-2">
            <Link
              to="/"
              className="text-gray-500 hover:text-gray-800 border-b-2 border-transparent hover:border-gray-300 pb-1 transition"
            >
              HOME
            </Link>
            <Link
              to="/about"
              className="text-gray-500 hover:text-gray-800 border-b-2 border-transparent hover:border-gray-300 pb-1 transition"
            >
              ABOUT ME
            </Link>
            <Link
              to="/designs"
              className="text-gray-500 hover:text-gray-800 border-b-2 border-transparent hover:border-gray-300 pb-1 transition"
            >
              DESIGNS
            </Link>
            <Link
              to="/contact"
              className="text-gray-500 hover:text-gray-800 border-b-2 border-transparent hover:border-gray-300 pb-1 transition"
            >
              CONTACT
            </Link>
            <Link
              to="/guide"
              className="text-gray-500 hover:text-gray-800 border-b-2 border-transparent hover:border-gray-300 pb-1 transition"
            >
              GUIDE
            </Link>
          </div>
          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay with Fade In */}
      <div
        className={`absolute top-full left-0 w-full bg-white border-t border-b z-[50] transition-opacity duration-300 ease-in-out ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="px-4 py-4 space-y-4">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-gray-500 hover:text-gray-800 transition"
          >
            HOME
          </Link>
          <Link
            to="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-gray-500 hover:text-gray-800 transition"
          >
            ABOUT ME
          </Link>
          <Link
            to="/designs"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-gray-500 hover:text-gray-800 transition"
          >
            DESIGNS
          </Link>
          <Link
            to="/contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-gray-500 hover:text-gray-800 transition"
          >
            CONTACT
          </Link>
          <Link
            to="/guide"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-gray-500 hover:text-gray-800 transition"
          >
            GUIDE
          </Link>
        </div>
      </div>
    </div>
  );
}
