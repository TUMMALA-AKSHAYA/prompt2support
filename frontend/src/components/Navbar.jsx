import React from 'react';
import { Menu, Home, BarChart3, LogOut } from 'lucide-react';

const Navbar = ({ currentPage, setCurrentPage, onLogout }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-purple-600 rounded-lg" />
            <span className="text-xl font-bold">Prompt2Support</span>
          </div>

          <div className="hidden md:flex gap-6">
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCurrentPage(id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  currentPage === id
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 border-t">
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setCurrentPage(id);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg ${
                  currentPage === id
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
