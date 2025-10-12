import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Bell,
  User,
  Menu,
  X,
  Package,
  Settings,
  Sun,
  Moon,
  LogIn,
  UserPlus,
  LayoutDashboard,
} from 'lucide-react';
import logo from "../assets/growEasy3.jpg"
const Navbar= ({
  isAuthenticated = false,
  currentTheme = 'light',
  onThemeToggle,
  onDashboard,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div
              className="flex-shrink-0 flex items-center cursor-pointer"
              onClick={onDashboard}
            >
              <img src={logo} className="h-8 w-8  rounded-full text-green-500" />
              <span className="ml-2 text-xl font-bold text-gray-700 dark:text-gray-300">
                <Link to="/">
                        growEasy
                </Link>
        
              </span>
            </div>
          </div>
          {isAuthenticated && (
            <div className="hidden md:block flex-1 max-w-lg mx-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search products, categories, suppliers..."
                  className="w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
              </div>
            </div>
          )}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={onThemeToggle}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {currentTheme === 'light' ? (
                <Moon className="h-6 w-6" />
              ) : (
                <Sun className="h-6 w-6" />
              )}
            </button>
            {isAuthenticated ? (
              <>
                <button
                  onClick={onDashboard}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span className="text-sm font-medium">Dashboard</span>
                </button>
                <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Bell className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </button>
                <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Settings className="h-6 w-6" />
                </button>
                <div className="relative">
                  <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                    <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        John Doe
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Admin
                      </p>
                    </div>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                to="/login"
                 
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LogIn className="h-5 w-5" />
                  <span className="text-sm font-medium">Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-2 px-4 py-2 bg-green-800 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <UserPlus className="h-5 w-5" />
                  <span className="text-sm">Register</span>
                </Link>
              </>
            )}
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-300 dark:border-gray-600">
          <div className="px-4 pt-4 pb-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>
            <div className="pt-4 border-t border-gray-300 dark:border-gray-600 space-y-4">
              <button
                onClick={onThemeToggle}
                className="flex items-center space-x-3 w-full p-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {currentTheme === 'light' ? (
                  <Moon className="h-6 w-6" />
                ) : (
                  <Sun className="h-6 w-6" />
                )}
                <span className="text-sm font-medium">
                  Switch to {currentTheme === 'light' ? 'Dark' : 'Light'} Mode
                </span>
              </button>
              {isAuthenticated ? (
                <>
                  <button
                    onClick={onDashboard}
                    className="flex items-center space-x-3 w-full p-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <LayoutDashboard className="h-6 w-6" />
                    <span className="text-sm font-medium">Dashboard</span>
                  </button>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          John Doe
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Admin
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Bell className="h-6 w-6" />
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          3
                        </span>
                      </button>
                      <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Settings className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <Link
                   to="/login"
                    className="flex items-center justify-center space-x-2 w-full px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
                  >
                    <LogIn className="h-5 w-5" />
                    <span className="text-sm font-medium">Login</span>
                  </Link>

                  <Link
                    to="/signup"
                    className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <UserPlus className="h-5 w-5" />
                    <span className="text-sm">Register</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;