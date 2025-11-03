import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Download, 
  Edit, 
  User,
  BookOpen,
  Clock,
  ChevronRight,
  Star,
  CheckCircle,
  Hash,
  UserCircle
} from 'lucide-react';
import avatarImage from '../assets/img/avatar.png';
import fallbackAvatarImage from '../assets/img/fallback-avatar.png';
import logoImage from '../assets/img/bb-logo.png';
import signatureImage from '../assets/img/sign.png';
import { downloadTeacherCardsPDF } from '../utils/pdfGenerator';
import Toast from '../components/Toast';
import Tooltip from '../components/Tooltip';
import TeacherModal from '../components/TeacherModal';
import { useSound } from '../context/SoundContext';

const TeacherView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { playNotificationSound } = useSound();
  const teacher = location.state?.teacher;
  
  const [activeTab, setActiveTab] = useState('info');
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState(teacher);

  // If no teacher data, redirect back
  if (!currentTeacher) {
    navigate('/teachers');
    return null;
  }

  const handleBack = () => {
    navigate('/teachers');
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleSaveTeacher = (updatedTeacher) => {
    // Update the current teacher state
    setCurrentTeacher(updatedTeacher);
    
    // Show success message
    setToast({
      isVisible: true,
      message: 'Teacher information updated successfully!',
      type: 'success'
    });
    playNotificationSound('success');
    setIsEditModalOpen(false);
  };

  const handleDownloadCard = async () => {
    try {
      await downloadTeacherCardsPDF([currentTeacher.id], [currentTeacher]);
      setToast({
        isVisible: true,
        message: 'Teacher ID card downloaded successfully!',
        type: 'success'
      });
      playNotificationSound('success');
    } catch (error) {
      console.error('Error downloading card:', error);
      setToast({
        isVisible: true,
        message: 'Error downloading ID card. Please try again.',
        type: 'error'
      });
      playNotificationSound('error');
    }
  };

  const tabs = [
    { 
      id: 'info', 
      label: 'Teacher Info', 
      icon: User, 
      color: 'blue',
      description: 'Personal information and details',
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200',
      iconBg: 'bg-blue-100'
    },
    { 
      id: 'classes', 
      label: 'Classes and subject', 
      icon: BookOpen, 
      color: 'purple',
      description: 'Subject assignments and classes',
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-200',
      iconBg: 'bg-purple-100'
    },
    { 
      id: 'schedule', 
      label: 'View Schedule', 
      icon: Clock, 
      color: 'green',
      description: 'Timetable and schedule information',
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200',
      iconBg: 'bg-green-100'
    }
  ];

  return (
    <div className=" bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Tabs with Back Button */}
        <div className="flex items-center gap-4 mb-6">
          {/* Back Button */}
          <Tooltip content="Back to Teachers" position="top">
            <button
              onClick={handleBack}
              className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
            </button>
          </Tooltip>
          
          <div className="flex gap-0 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-8 py-3 font-semibold transition-all duration-200 border-b-2 ${
              activeTab === 'info'
                ? 'bg-blue-700 text-white border-blue-700 rounded-2xl'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-transparent hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Teacher Info
          </button>
          <button
            onClick={() => setActiveTab('classes')}
            className={`px-8 py-3 font-semibold transition-all duration-200 border-b-2 ${
              activeTab === 'classes'
                ? 'bg-blue-700 text-white border-blue-700 rounded-2xl'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-transparent hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Classes and subject
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-8 py-3 font-semibold transition-all duration-200 border-b-2 ${
              activeTab === 'schedule'
                ? 'bg-blue-700 text-white border-blue-700 rounded-2xl'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-transparent hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            View Schedule
          </button>
          </div>
        </div>

        {/* Content Area */}
        <div className={`grid grid-cols-1 gap-6 ${activeTab === 'info' ? 'lg:grid-cols-3' : 'lg:grid-cols-1'}`}>
          {/* Left Side - Teacher Info */}
          <div className={activeTab === 'info' ? 'lg:col-span-2' : 'lg:col-span-1'}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              {activeTab === 'info' && (
                <div className="space-y-8">
                  {/* Profile Image */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="w-40 h-40 rounded-full border-6 border-blue-500 shadow-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30">
                        <img
                          src={currentTeacher.profileImage || fallbackAvatarImage}
                          alt={currentTeacher.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = fallbackAvatarImage;
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Teacher Details */}
                  <div className="space-y-4">
                    {/* Teacher ID */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <Hash className="w-4 h-4 text-blue-500" />
                        <label className="text-base font-medium text-gray-500 dark:text-gray-300">
                          Teacher ID:
                      </label>
                      </div>
                      <p className="text-base font-semibold text-gray-900 dark:text-white">
                        {currentTeacher.teacherId}
                      </p>
                    </div>

                    {/* Name */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <UserCircle className="w-4 h-4 text-green-500" />
                        <label className="text-base font-medium text-gray-500 dark:text-gray-300">
                        Name:
                      </label>
                      </div>
                      <p className="text-base font-semibold text-gray-900 dark:text-white">
                        {currentTeacher.name}
                      </p>
                    </div>

                    {/* Email */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-blue-500" />
                        <label className="text-base font-medium text-gray-500 dark:text-gray-300">
                        Email:
                      </label>
                      </div>
                      <p className="text-base text-blue-600 dark:text-blue-300">
                        {currentTeacher.email}
                      </p>
                    </div>

                    {/* Contact Number */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-green-500" />
                        <label className="text-base font-medium text-gray-500 dark:text-gray-300">
                          Contact:
                      </label>
                      </div>
                      <p className="text-base font-semibold text-gray-900 dark:text-white">
                        {currentTeacher.mobile}
                      </p>
                    </div>

                    {/* Address */}
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-red-500" />
                        <label className="text-base font-medium text-gray-500 dark:text-gray-300">
                        Address:
                      </label>
                      </div>
                      <p className="text-base text-red-600 dark:text-red-300 text-right max-w-md">
                        {currentTeacher.address}
                      </p>
                    </div>
                  </div>

                  {/* Edit Button */}
                  <div className="pt-4">
                    <button
                      onClick={handleEdit}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-700 text-white rounded-xl font-semibold shadow-lg hover:bg-blue-800 hover:shadow-xl transition-all duration-200"
                    >
                      <Edit className="w-5 h-5" />
                      Edit Info
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'classes' && (
                <div className="space-y-6">
                  {/* Section Header */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Assigned Classes & Subjects
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Overview of teaching assignments and subject responsibilities
                    </p>
                  </div>

                  {/* Classes Container */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    {/* Classes and Subjects Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        {/* Table Header */}
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-center py-4 px-2 font-semibold text-gray-900 dark:text-white">
                              S. No.
                            </th>
                            <th className="text-center py-4 px-2 font-semibold text-gray-900 dark:text-white">
                              Classroom
                            </th>
                            <th className="text-center py-4 px-2 font-semibold text-gray-900 dark:text-white">
                              Course
                            </th>
                            <th className="text-center py-4 px-2 font-semibold text-gray-900 dark:text-white">
                              Subject
                            </th>
                          </tr>
                        </thead>
                        
                        {/* Table Body */}
                        <tbody>
                          {/* Row 1: Class 10-A */}
                          <tr className="border-b border-gray-100 dark:border-gray-700">
                            <td className="py-4 px-2 text-gray-900 dark:text-white font-medium text-center">
                              1
                            </td>
                            <td className="py-4 px-2 text-gray-900 dark:text-white text-center">
                              Class 10 - A
                            </td>
                            <td className="py-4 px-2 text-gray-900 dark:text-white text-center">
                              Class 10
                            </td>
                            <td className="py-4 px-2 text-gray-900 dark:text-white text-center">
                              <div className="flex flex-wrap gap-2 justify-center">
                                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                                  Maths
                                </span>
                                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
                                  Science
                                </span>
                                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">
                                  Computer
                                </span>
                                <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-full text-sm font-medium">
                                  OPT Maths
                                </span>
                              </div>
                            </td>
                          </tr>
                          
                          {/* Row 2: Class 9-A */}
                          <tr className="border-b border-gray-100 dark:border-gray-700">
                            <td className="py-4 px-2 text-gray-900 dark:text-white font-medium text-center">
                              2
                            </td>
                            <td className="py-4 px-2 text-gray-900 dark:text-white text-center">
                              Class 9 - A
                            </td>
                            <td className="py-4 px-2 text-gray-900 dark:text-white text-center">
                              Class 9
                            </td>
                            <td className="py-4 px-2 text-gray-900 dark:text-white text-center">
                              <div className="flex flex-wrap gap-2 justify-center">
                                <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded-full text-sm font-medium">
                                  Nepali
                          </span>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Summary Stats */}
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">2</div>
                          <div className="text-sm text-gray-600 dark:text-gray-100">Total Classes</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">5</div>
                          <div className="text-sm text-gray-600 dark:text-gray-100">Total Subjects</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'schedule' && (
                <div className="space-y-6">
                  {/* Section Header */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Weekly Schedule
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {currentTeacher.name}'s teaching schedule and timetable
                    </p>
                  </div>

                  {/* Schedule Container */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    {/* Weekly Schedule Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        {/* Schedule Header */}
                        <thead>
                          <tr className="bg-gray-900 dark:bg-gray-700">
                            <th className="py-4 px-3 text-white font-semibold text-center border-r border-gray-700 dark:border-gray-600">
                              Time
                            </th>
                            <th className="py-4 px-3 text-white font-semibold text-center border-r border-gray-700 dark:border-gray-600">
                              Sunday
                            </th>
                            <th className="py-4 px-3 text-white font-semibold text-center border-r border-gray-700 dark:border-gray-600">
                              Monday
                            </th>
                            <th className="py-4 px-3 text-white font-semibold text-center border-r border-gray-700 dark:border-gray-600">
                              Tuesday
                            </th>
                            <th className="py-4 px-3 text-white font-semibold text-center border-r border-gray-700 dark:border-gray-600">
                              Wednesday
                            </th>
                            <th className="py-4 px-3 text-white font-semibold text-center border-r border-gray-700 dark:border-gray-600">
                              Thursday
                            </th>
                            <th className="py-4 px-3 text-white font-semibold text-center border-r border-gray-700 dark:border-gray-600">
                              Friday
                            </th>
                            <th className="py-4 px-3 text-white font-semibold text-center">
                              Saturday
                            </th>
                          </tr>
                        </thead>
                        
                        {/* Schedule Body */}
                        <tbody>
                          {/* 8:00 AM - 9:00 AM */}
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="py-4 px-3 text-gray-900 dark:text-white font-medium text-center bg-gray-50 dark:bg-gray-700">
                              8:00 - 9:00 AM
                            </td>
                            <td className="py-4 px-3 text-gray-900 dark:text-white text-center">
                              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-lg p-2">
                                <div className="font-semibold">Class 10-A</div>
                                <div className="text-sm">Mathematics</div>
                              </div>
                            </td>
                            <td className="py-4 px-3 text-gray-900 dark:text-white text-center">
                              <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg p-2">
                                <div className="font-semibold">Class 9-A</div>
                                <div className="text-sm">Science</div>
                              </div>
                            </td>
                            <td className="py-4 px-3 text-gray-900 dark:text-white text-center">
                              <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-lg p-2">
                                <div className="font-semibold">Class 10-A</div>
                                <div className="text-sm">Computer</div>
                              </div>
                            </td>
                            <td className="py-4 px-3 text-gray-900 dark:text-white text-center">
                              <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-lg p-2">
                                <div className="font-semibold">Class 9-A</div>
                                <div className="text-sm">Nepali</div>
                              </div>
                            </td>
                            <td className="py-4 px-3 text-gray-900 dark:text-white text-center">
                              <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg p-2">
                                <div className="font-semibold">Class 10-A</div>
                                <div className="text-sm">OPT Maths</div>
                              </div>
                            </td>
                            <td className="py-4 px-3 text-gray-500 dark:text-gray-400 text-center">
                              <div className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-100 rounded-lg p-2">
                                <div className="text-sm">Weekend</div>
                              </div>
                            </td>
                            <td className="py-4 px-3 text-gray-500 dark:text-gray-400 text-center">
                              <div className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-100 rounded-lg p-2">
                                <div className="text-sm">Weekend</div>
                              </div>
                            </td>
                          </tr>

                          {/* 9:00 AM - 10:00 AM */}
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="py-4 px-3 text-gray-900 dark:text-white font-medium text-center bg-gray-50 dark:bg-gray-700">
                              9:00 - 10:00 AM
                            </td>
                            <td className="py-4 px-3 text-gray-500 dark:text-gray-400 text-center">
                              <div className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-100 rounded-lg p-2">
                                <div className="text-sm">Break</div>
                              </div>
                            </td>
                            <td className="py-4 px-3 text-gray-500 dark:text-gray-400 text-center">
                              <div className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-100 rounded-lg p-2">
                                <div className="text-sm">Break</div>
                              </div>
                            </td>
                            <td className="py-4 px-3 text-gray-500 dark:text-gray-400 text-center">
                              <div className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-100 rounded-lg p-2">
                                <div className="text-sm">Break</div>
                              </div>
                            </td>
                            <td className="py-4 px-3 text-gray-500 dark:text-gray-400 text-center">
                              <div className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-100 rounded-lg p-2">
                                <div className="text-sm">Break</div>
                              </div>
                            </td>
                            <td className="py-4 px-3 text-gray-500 dark:text-gray-400 text-center">
                              <div className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-100 rounded-lg p-2">
                                <div className="text-sm">Break</div>
                              </div>
                            </td>
                            <td className="py-4 px-3 text-gray-500 dark:text-gray-400 text-center">
                              <div className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-100 rounded-lg p-2">
                                <div className="text-sm">Weekend</div>
                              </div>
                            </td>
                            <td className="py-4 px-3 text-gray-500 dark:text-gray-400 text-center">
                              <div className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-100 rounded-lg p-2">
                                <div className="text-sm">Weekend</div>
                              </div>
                            </td>
                          </tr>

                          {/* 10:00 AM - 11:00 AM */}
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="py-4 px-3 text-gray-900 dark:text-white font-medium text-center bg-gray-50 dark:bg-gray-700">
                              10:00 - 11:00 AM
                            </td>
                            <td className="py-4 px-3 text-gray-900 dark:text-white text-center">
                              <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded-lg p-2">
                                <div className="font-semibold">Class 9-A</div>
                                <div className="text-sm">Mathematics</div>
                              </div>
                            </td>
                            <td className="py-4 px-3 text-gray-900 dark:text-white text-center">
                              <div className="bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-200 rounded-lg p-2">
                                <div className="font-semibold">Class 10-A</div>
                                <div className="text-sm">Science</div>
                              </div>
                            </td>
                            <td className="py-4 px-3 text-gray-900 dark:text-white text-center">
                              <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded-lg p-2">
                                <div className="font-semibold">Class 9-A</div>
                                <div className="text-sm">Nepali</div>
                              </div>
                            </td>
                            <td className="py-4 px-3 text-gray-900 dark:text-white text-center">
                              <div className="bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 rounded-lg p-2">
                                <div className="font-semibold">Class 10-A</div>
                                <div className="text-sm">Computer</div>
                              </div>
                            </td>
                            <td className="py-4 px-3 text-gray-900 dark:text-white text-center">
                              <div className="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-200 rounded-lg p-2">
                                <div className="font-semibold">Class 9-A</div>
                                <div className="text-sm">Science</div>
                              </div>
                            </td>
                            <td className="py-4 px-3 text-gray-500 dark:text-gray-400 text-center">
                              <div className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-100 rounded-lg p-2">
                                <div className="text-sm">Weekend</div>
                              </div>
                            </td>
                            <td className="py-4 px-3 text-gray-500 dark:text-gray-400 text-center">
                              <div className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-100 rounded-lg p-2">
                                <div className="text-sm">Weekend</div>
                              </div>
                            </td>
                          </tr>

                          {/* 11:00 AM - 12:00 PM */}
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="py-4 px-3 text-gray-900 dark:text-white font-medium text-center bg-gray-50 dark:bg-gray-700">
                              11:00 - 12:00 PM
                            </td>
                            <td className="py-4 px-3 text-gray-500 dark:text-gray-400 text-center">
                              <div className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-100 rounded-lg p-2">
                                <div className="text-sm">Lunch Break</div>
                              </div>
                            </td>
                            <td className="py-4 px-3 text-gray-500 dark:text-gray-400 text-center">
                              <div className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-100 rounded-lg p-2">
                                <div className="text-sm">Lunch Break</div>
                              </div>
                            </td>
                            <td className="py-4 px-3 text-gray-500 dark:text-gray-400 text-center">
                              <div className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-100 rounded-lg p-2">
                                <div className="text-sm">Lunch Break</div>
                              </div>
                            </td>
                            <td className="py-4 px-3 text-gray-500 dark:text-gray-400 text-center">
                              <div className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-100 rounded-lg p-2">
                                <div className="text-sm">Lunch Break</div>
                              </div>
                            </td>
                            <td className="py-4 px-3 text-gray-500 dark:text-gray-400 text-center">
                              <div className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-100 rounded-lg p-2">
                                <div className="text-sm">Lunch Break</div>
                              </div>
                            </td>
                            <td className="py-4 px-3 text-gray-500 dark:text-gray-400 text-center">
                              <div className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-100 rounded-lg p-2">
                                <div className="text-sm">Weekend</div>
                              </div>
                            </td>
                            <td className="py-4 px-3 text-gray-500 dark:text-gray-400 text-center">
                              <div className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-100 rounded-lg p-2">
                                <div className="text-sm">Weekend</div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Schedule Summary */}
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">5</div>
                          <div className="text-sm text-gray-600 dark:text-gray-100">Teaching Days</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">2</div>
                          <div className="text-sm text-gray-600 dark:text-gray-100">Classes</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - ID Card Preview (Only for Teacher Info tab) */}
          {activeTab === 'info' && (
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center">
                Teacher ID Card
              </h2>

              {/* ID Card Preview */}
                <div className="bg-white  rounded-xl shadow-xl border border-gray-300 overflow-hidden scale-[0.9]">
                {/* Card Header - Logo */}
                <div className="bg-white  py-6 px-4 flex justify-center">
                  <img
                    src={logoImage}
                    alt="Black Board Learn+"
                    className="h-14 object-contain"
                  />
                </div>

                {/* Card Body */}
                <div className="px-6 pb-8 pt-2 space-y-3">
                  {/* Profile Image */}
                  <div className="flex justify-center -mt-2">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-100 to-blue-200  p-1 shadow-lg">
                      <div className="w-full h-full rounded-full overflow-hidden bg-white ">
                        <img
                            src={currentTeacher.profileImage || fallbackAvatarImage}
                            alt={currentTeacher.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = fallbackAvatarImage;
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Teacher Name */}
                  <div className="text-center pt-2">
                    <h3 className="text-2xl font-bold text-blue-700">
                        {currentTeacher.name}
                    </h3>
                  </div>

                  {/* Teacher ID */}
                  <div className="text-center">
                    <p className="text-base font-bold text-blue-700">
                        {currentTeacher.teacherId}
                    </p>
                  </div>

                  {/* Contact Number */}
                  <div className="text-center pt-1">
                    <p className="text-base font-medium text-gray-900">
                        {currentTeacher.mobile}
                    </p>
                  </div>

                  {/* Signature */}
                  <div className="pt-6 pb-2">
                    <div className="flex justify-center mb-2">
                      <img
                        src={signatureImage}
                        alt="Signature"
                        className="h-10 object-contain"
                      />
                    </div>
                    <p className="text-base font-bold text-blue-700 text-center">
                      Authorized Signature
                    </p>
                  </div>
                </div>

                {/* Card Footer - Address */}
                <div className="bg-blue-700 text-white py-4 px-4 text-center">
                    <p className="text-base font-medium">{currentTeacher.address}</p>
                </div>
              </div>

              {/* Download Button */}
              <button
                onClick={handleDownloadCard}
                className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 bg-blue-700 text-white rounded-xl font-semibold shadow-lg hover:bg-blue-800 hover:shadow-xl transition-all duration-200"
              >
                <Download className="w-5 h-5" />
                Download
              </button>
            </div>
          </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
        duration={3000}
      />

      {/* Edit Teacher Modal */}
      <TeacherModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        teacher={currentTeacher}
        onSave={handleSaveTeacher}
        mode="edit"
      />
    </div>
  );
};

export default TeacherView;
