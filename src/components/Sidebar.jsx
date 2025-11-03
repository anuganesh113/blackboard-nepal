import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/img/bb-logo.png';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Grid3x3,
  GraduationCap,
  UserCheck,
  Building2,
  UserCircle,
  TrendingUp,
  Award,
  DollarSign,
  Calendar,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [studentsExpanded, setStudentsExpanded] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Batches', path: '/batches', icon: Users },
    { name: 'Subjects', path: '/subjects', icon: BookOpen },
    { name: 'Sections', path: '/sections', icon: Grid3x3 },
    { name: 'Course', path: '/courses', icon: GraduationCap },
    { name: 'Teacher', path: '/teachers', icon: UserCheck },
    { name: 'Classroom', path: '/classrooms', icon: Building2 },
  ];

  const studentSubItems = [
    { name: 'Promote Student', path: '/students/promote', icon: TrendingUp },
    { name: 'Certificates', path: '/students/certificates', icon: Award },
    { name: 'Scholarship', path: '/students/scholarship', icon: DollarSign },
    { name: 'Attendance', path: '/students/attendance', icon: Calendar },
  ];

  const isActive = (path) => {
    if (path === '/subjects') {
      return location.pathname === path || location.pathname.startsWith('/subjects/');
    }
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen
          w-64 bg-white dark:bg-gray-900
          border-r border-gray-200 dark:border-gray-800
          transition-transform duration-300 ease-in-out
          z-40 overflow-y-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <img className='logo w-[185px] dark:w-full' src={logo} alt="logo" />
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-200
                  ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}

            {/* Students with submenu */}
            <div>
              <button
                onClick={() => setStudentsExpanded(!studentsExpanded)}
                className={`
                  w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl
                  transition-all duration-200
                  ${
                    location.pathname.startsWith('/students')
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <UserCircle className="w-5 h-5" />
                  <span className="font-medium">Student</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    studentsExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Submenu */}
              {studentsExpanded && (
                <div className="ml-4 mt-2 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                  {studentSubItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`
                        flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                        transition-all duration-200
                        ${
                          isActive(item.path)
                            ? 'bg-blue-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }
                      `}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

