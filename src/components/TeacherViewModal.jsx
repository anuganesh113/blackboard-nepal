import React, { useEffect } from 'react';
import { X, User, Mail, Phone, MapPin, GraduationCap, DollarSign, Calendar, BookOpen, CheckCircle, XCircle } from 'lucide-react';

const TeacherViewModal = ({ isOpen, onClose, teacher }) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !teacher) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-t-2xl border-blue-200 dark:border-blue-700">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                  Teacher Details
                </h2>
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  View comprehensive teacher information
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Section */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 text-center">
                  <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-blue-600 dark:text-blue-400 font-bold text-2xl">
                      {teacher.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {teacher.name}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">
                    {teacher.designation}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    ID: {teacher.teacherId}
                  </p>
                  <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                    teacher.isActive 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {teacher.isActive ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    {teacher.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                      Contact Information
                    </h4>
                    
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                        <p className="text-gray-900 dark:text-white font-medium">{teacher.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Mobile</p>
                        <p className="text-gray-900 dark:text-white font-medium">{teacher.mobile}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                        <p className="text-gray-900 dark:text-white font-medium">{teacher.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                      Professional Information
                    </h4>
                    
                    <div className="flex items-start gap-3">
                      <GraduationCap className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Designation</p>
                        <p className="text-gray-900 dark:text-white font-medium">{teacher.designation}</p>
                      </div>
                    </div>

                    {teacher.salary && (
                      <div className="flex items-start gap-3">
                        <DollarSign className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Salary</p>
                          <p className="text-gray-900 dark:text-white font-medium">{teacher.salary}</p>
                        </div>
                      </div>
                    )}

                    {teacher.joinDate && (
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Join Date</p>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {new Date(teacher.joinDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Subjects */}
                {teacher.subjects && teacher.subjects.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                      <BookOpen className="w-5 h-5 inline mr-2" />
                      Subjects
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {teacher.subjects.map((subject, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-full border border-blue-200 dark:border-blue-700/30"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 rounded-b-2xl">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherViewModal;
