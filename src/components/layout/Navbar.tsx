
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, GavelIcon } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-judicial-blue rounded-full flex items-center justify-center">
                <GavelIcon size={20} className="text-white" />
              </div>
              <span className="font-serif text-2xl text-judicial-blue">NyaySetu</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/chatbot" className="nav-link">Chatbot</Link>
            <Link to="/learn" className="nav-link">Learn</Link>
            <Link to="/legal-aid" className="nav-link">Legal Aid</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/chatbot" className="btn-primary">Try Demo</Link>
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-judicial-blue">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="px-2 pt-2 pb-4 space-y-2">
            <Link 
              to="/" 
              className="block px-3 py-2 text-judicial-gray hover:text-judicial-blue hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="block px-3 py-2 text-judicial-gray hover:text-judicial-blue hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/chatbot" 
              className="block px-3 py-2 text-judicial-gray hover:text-judicial-blue hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Chatbot
            </Link>
            <Link 
              to="/learn" 
              className="block px-3 py-2 text-judicial-gray hover:text-judicial-blue hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Learn
            </Link>
            <Link 
              to="/legal-aid" 
              className="block px-3 py-2 text-judicial-gray hover:text-judicial-blue hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Legal Aid
            </Link>
            <Link 
              to="/profile" 
              className="block px-3 py-2 text-judicial-gray hover:text-judicial-blue hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
            <div className="pt-2">
              <Link 
                to="/chatbot" 
                className="btn-primary w-full text-center block"
                onClick={() => setIsMenuOpen(false)}
              >
                Try Demo
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
