import React, { useEffect } from 'react';
import { X, BookOpen, Users } from 'lucide-react';

const ClassroomDetailsModal = ({ isOpen, onClose, classroom, type }) => {
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

  if (!isOpen || !classroom) return null;

  // Prepare data according to type
  let title = '';
  let IconComponent = BookOpen;

  if (type === 'subjectTeachers') {
    title = 'Subjects and Teachers';
    IconComponent = BookOpen;
  } else if (type === 'subjects') {
    title = 'All Subjects';
    IconComponent = BookOpen;
  } else if (type === 'teachers') {
    title = 'All Teachers';
    IconComponent = Users;
  }

  // Combine subjects and teachers with mapping when available
  const subjects = Array.isArray(classroom.subjects) ? classroom.subjects : [];
  const teachers = Array.isArray(classroom.teachers) ? classroom.teachers : [];
  const mapping = classroom.subjectTeachers || {};

  const rows = subjects.map((subject, idx) => {
    const mapped = mapping[subject];
    const fallback = typeof teachers[idx] !== 'undefined' ? teachers[idx] : '-';
    const teacher = mapped || fallback || '-';
    return { subject, teacher };
  });

  const hasRows = rows.length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* Backdrop with click-outside-to-close */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto" role="dialog" aria-modal="true" aria-label={title}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
              <IconComponent className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {classroom.classroom}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {type === 'subjectTeachers' ? (
            hasRows ? (
              <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 shadow-sm">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 z-10 bg-gray-50/95 dark:bg-gray-900/90 backdrop-blur border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Subject</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Teacher</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800">
                    {rows.map((row, idx) => (
                      <tr
                        key={`${row.subject}-${idx}`}
                        className={`odd:bg-gray-100 dark:odd:bg-gray-800/60 hover:bg-blue-50/40 dark:hover:bg-blue-900/10 transition-colors`}
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-gray-100 font-medium">{row.subject}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-gray-100 font-semibold">{row.teacher}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400">No subjects found.</div>
            )
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(type === 'subjects' ? (classroom.subjects || []) : (classroom.teachers || [])).map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-4 rounded-lg border hover:shadow-md transition-all duration-200 ${
                    item === '-'
                      ? 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                      : 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700/30'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    item === '-' ? 'bg-gray-400' : 'bg-blue-500'
                  }`} />
                  <span className={`text-sm font-medium flex-1 ${
                    item === '-' 
                      ? 'text-gray-500 dark:text-gray-400' 
                      : 'text-blue-700 dark:text-blue-300'
                  }`}>
                    {item}
                  </span>
                  <div className={`text-xs font-semibold ${
                    item === '-' 
                      ? 'text-gray-400 dark:text-gray-500' 
                      : 'text-blue-500 dark:text-blue-400'
                  }`}>
                    #{index + 1}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Summary */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {type === 'subjectTeachers' ? 'Total Pairs' : (type === 'subjects' ? 'Total Subjects' : 'Total Teachers')}
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {type === 'subjectTeachers' ? rows.length : (type === 'subjects' ? (classroom.subjects?.length || 0) : (classroom.teachers?.length || 0))}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassroomDetailsModal;
