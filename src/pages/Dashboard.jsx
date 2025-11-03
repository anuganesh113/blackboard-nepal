import React from 'react';
import StatCard from '../components/StatCard';
import PieChartBox from '../components/Charts/PieChartBox';
import StudentsBarChart from '../components/Charts/StudentsBarChart';
import GenderBarChart from '../components/Charts/GenderBarChart';
import SoundNotificationDemo from '../components/SoundNotificationDemo';
import {
  Users,
  BookOpen,
  GraduationCap,
  Building2,
  UserCheck,
  Grid3x3,
  Award,
  TrendingUp,
} from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Students',
      value: '18',
      icon: Users,
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-blue-600',
    },
    {
      title: 'Total Teachers',
      value: '12',
      icon: UserCheck,
      gradientFrom: 'from-purple-500',
      gradientTo: 'to-purple-600',
    },
    {
      title: 'Total Courses',
      value: '24',
      icon: GraduationCap,
      gradientFrom: 'from-pink-500',
      gradientTo: 'to-pink-600',
    },
    {
      title: 'Total Subjects',
      value: '15',
      icon: BookOpen,
      gradientFrom: 'from-indigo-500',
      gradientTo: 'to-indigo-600',
    },
    {
      title: 'Total Batches',
      value: '8',
      icon: Grid3x3,
      gradientFrom: 'from-cyan-500',
      gradientTo: 'to-cyan-600',
    },
    {
      title: 'Total Classrooms',
      value: '10',
      icon: Building2,
      gradientFrom: 'from-emerald-500',
      gradientTo: 'to-emerald-600',
    },
    {
      title: 'Certificates Issued',
      value: '45',
      icon: Award,
      gradientFrom: 'from-amber-500',
      gradientTo: 'to-amber-600',
    },
    {
      title: 'Attendance Rate',
      value: '94.5%',
      icon: TrendingUp,
      gradientFrom: 'from-green-500',
      gradientTo: 'to-green-600',
    },
  ];

  return (
    <div className=" bg-gray-50 dark:bg-gray-900 transition-all duration-300">
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Dashboard
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Welcome to Black Board Learn+ School Management System
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              gradientFrom={stat.gradientFrom}
              gradientTo={stat.gradientTo}
            />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <PieChartBox />
          <StudentsBarChart />
        </div>

        {/* Sound Notification Demo */}
        <div className="mb-8">
          <SoundNotificationDemo />
        </div>

        {/* Gender Chart - Full Width */}
        <div className="mb-8">
          <GenderBarChart />
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-800 dark:text-white">
                  Active Students
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">This semester</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">18</p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-2">
              ↑ 12% from last month
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-800 dark:text-white">
                  Active Courses
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Currently running</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">24</p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-2">
              ↑ 3 new courses added
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-xl">
                <Award className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-800 dark:text-white">
                  Top Performers
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">This month</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">7</p>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
              Students with 95%+ score
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

