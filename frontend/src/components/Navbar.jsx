import React from 'react';
import { Menu, Home, BarChart3 } from 'lucide-react';

const Navbar = ({ currentPage, setCurrentPage, onLogout }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-white">P2S</span>
            </div>
            <span className="text-xl font-bold">Prompt2Support</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-6">
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'demo', label: 'Demo', icon: Menu }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCurrentPage(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition
                  ${currentPage === id 
                    ? 'bg-gradient-to-r from-primary to-secondary text-white' 
                    : 'hover:bg-gray-100'
                  }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </div>

          {/* Login Button */}
          <button 
            onClick={() => alert('Login coming soon!')} 
            className="btn-primary"
          >
            Login
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4">
            {['home', 'dashboard', 'demo'].map((page) => (
              <button
                key={page}
                onClick={() => {
                  setCurrentPage(page);
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 capitalize"
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;