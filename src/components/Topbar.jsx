import React, { useState, useRef, useEffect } from 'react';
import { Search, Sun, Moon, UserCircle, ChevronDown, Key, LogOut, Volume2, VolumeX } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSound } from '../context/SoundContext';
import Tooltip from './Tooltip';

const Topbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { soundEnabled, toggleSound, notifyNavigation } = useSound();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle theme toggle with navigation notification
  const handleThemeToggle = () => {
    notifyNavigation(`Switched to ${theme === 'light' ? 'dark' : 'light'} mode`);
    toggleTheme();
  };

  const handleChangePassword = () => {
    setIsDropdownOpen(false);
    // Add your change password logic here
    console.log('Change password clicked');
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    // Add your logout logic here
    console.log('Logout clicked');
  };

  return (
    <header className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-all duration-300">
      <div className="flex justify-between items-center p-4 md:p-6">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 ml-4">
          {/* Sound Toggle */}
          <Tooltip content={soundEnabled ? 'Disable sound notifications' : 'Enable sound notifications'} position="bottom">
            <button
              onClick={toggleSound}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
              aria-label="Toggle sound notifications"
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <VolumeX className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </Tooltip>

          {/* Dark Mode Toggle */}
          <Tooltip content={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'} position="bottom">
            <button
              onClick={handleThemeToggle}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </Tooltip>

          {/* Profile with Dropdown */}
          <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transition-all duration-200"
              >
                <UserCircle className="w-6 h-6" />
                <span className="hidden md:block font-medium">School Admin</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-2">
                  <button
                    onClick={handleChangePassword}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                  >
                    <Key className="w-5 h-5" />
                    <span className="font-medium">Change Password</span>
                  </button>
                  
                  <div className="my-1 border-t border-gray-200 dark:border-gray-700"></div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Log out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;

