import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Upload,
  FileText,
  Eye,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import Toast from '../components/Toast';
import Tooltip from '../components/Tooltip';
import SearchableDropdown from '../components/SearchableDropdown';
import { useSound } from '../context/SoundContext';

const AssignSyllabus = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { notifySuccess, notifyError, notifyInfo } = useSound();
  const subject = location.state?.subject || { name: 'Nepali Oral', code: 'NEP001' };
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);
  
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'sno', direction: 'asc' });
  
  // Error states
  const [courseError, setCourseError] = useState('');
  const [fileError, setFileError] = useState('');

  // Sample data for assigned syllabi
  const [assignedSyllabi, setAssignedSyllabi] = useState([
    { id: 1, courseName: 'Ukg', syllabusFile: 'ukg_syllabus.pdf', uploadDate: '2024-01-15', fileUrl: null, fileObject: null },
    { id: 2, courseName: 'Lkg', syllabusFile: 'lkg_syllabus.pdf', uploadDate: '2024-01-10', fileUrl: null, fileObject: null }
  ]);

  const courses = ['Ukg', 'Lkg', 'Nursery', 'Class 1', 'Class 2', 'Class 3'];

  const handleBack = () => {
    navigate('/subjects');
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        notifyError('Invalid file type');
        setToast({
          isVisible: true,
          message: 'Invalid file type. Only JPG, PNG, and PDF files are allowed.',
          type: 'error'
        });
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        notifyError('File size exceeds limit');
        setToast({
          isVisible: true,
          message: 'File size exceeds 5MB limit.',
          type: 'error'
        });
        return;
      }

      setSelectedFile(file);
      setFileError('');
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleAssign = () => {
    // Clear previous errors
    setCourseError('');
    setFileError('');

    // Validate inputs
    let hasError = false;
    
    if (!selectedCourse) {
      setCourseError('Please select a class.');
      hasError = true;
    }

    if (!selectedFile) {
      setFileError('Please select a syllabus file.');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // Create a blob URL for the file
    const fileUrl = URL.createObjectURL(selectedFile);

    // Check if course already has a syllabus
    const existingIndex = assignedSyllabi.findIndex(item => item.courseName === selectedCourse);
    
    if (existingIndex !== -1) {
      // Revoke old blob URL if exists
      if (assignedSyllabi[existingIndex].fileUrl) {
        URL.revokeObjectURL(assignedSyllabi[existingIndex].fileUrl);
      }
      
      // Update existing syllabus
      const updatedSyllabi = [...assignedSyllabi];
      updatedSyllabi[existingIndex] = {
        ...updatedSyllabi[existingIndex],
        syllabusFile: selectedFile.name,
        uploadDate: new Date().toISOString().split('T')[0],
        fileUrl: fileUrl,
        fileObject: selectedFile
      };
      setAssignedSyllabi(updatedSyllabi);
      notifySuccess('Syllabus updated');
      setToast({
        isVisible: true,
        message: 'Syllabus updated successfully!',
        type: 'success'
      });
    } else {
      // Add new syllabus
      const newSyllabus = {
        id: Math.max(...assignedSyllabi.map(s => s.id), 0) + 1,
        courseName: selectedCourse,
        syllabusFile: selectedFile.name,
        uploadDate: new Date().toISOString().split('T')[0],
        fileUrl: fileUrl,
        fileObject: selectedFile
      };
      setAssignedSyllabi([...assignedSyllabi, newSyllabus]);
      notifySuccess('Syllabus assigned');
      setToast({
        isVisible: true,
        message: 'Syllabus assigned successfully!',
        type: 'success'
      });
    }

    // Reset form
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleViewSyllabus = (syllabusFile, fileUrl) => {
    if (fileUrl) {
      // Open the file in a new tab
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
      notifyInfo(`Opening ${syllabusFile}`);
      setToast({
        isVisible: true,
        message: `Opening ${syllabusFile}...`,
        type: 'success'
      });
    } else {
      // If no file URL exists (for older/sample data)
      notifyError('No file available');
      setToast({
        isVisible: true,
        message: 'No file available to view. Please upload a syllabus first.',
        type: 'error'
      });
    }
  };

  // Cleanup blob URLs when component unmounts
  useEffect(() => {
    const currentSyllabi = assignedSyllabi;
    return () => {
      currentSyllabi.forEach(item => {
        if (item.fileUrl) {
          URL.revokeObjectURL(item.fileUrl);
        }
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sorting logic
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronsUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-blue-500" />
      : <ChevronDown className="w-4 h-4 text-blue-500" />;
  };

  // Filter and sort data
  const filteredData = assignedSyllabi.filter(item =>
    item.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortConfig.key === 'sno') {
      return sortConfig.direction === 'asc' ? a.id - b.id : b.id - a.id;
    }
    if (sortConfig.key === 'courseName') {
      return sortConfig.direction === 'asc'
        ? a.courseName.localeCompare(b.courseName)
        : b.courseName.localeCompare(a.courseName);
    }
    return 0;
  });

  // Pagination logic
  const totalEntries = sortedData.length;
  const totalPages = entriesPerPage === -1 ? 1 : Math.ceil(totalEntries / entriesPerPage);
  const startIndex = entriesPerPage === -1 ? 0 : (currentPage - 1) * entriesPerPage;
  const endIndex = entriesPerPage === -1 ? totalEntries : Math.min(startIndex + entriesPerPage, totalEntries);
  const paginatedData = entriesPerPage === -1 ? sortedData : sortedData.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className=" bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 transition-all duration-300">
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <Tooltip content="Back to Subjects" position="top">
            <button
              onClick={handleBack}
                className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 group"
            >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
            </button>
            </Tooltip>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-emerald-900 to-indigo-900 dark:from-white dark:via-emerald-100 dark:to-indigo-100 bg-clip-text text-transparent">
                Assign Syllabus - {subject.name}
              </h1>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Form */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 space-y-6">
              {/* Assign Subject Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Assign Subject<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={subject.name}
                  disabled
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-not-allowed focus:outline-none"
                />
              </div>

              {/* Course Dropdown */}
              <SearchableDropdown
                label="Class"
                placeholder="-- Please Select Class --"
                options={courses}
                value={selectedCourse}
                onChange={(course) => {
                  setSelectedCourse(course);
                  if (course) {
                    setCourseError('');
                  }
                }}
                error={courseError}
                required={true}
                multiple={false}
                searchable={true}
              />

              {/* View Syllabus Link - Only show when class is selected */}
              {selectedCourse && (
                <div>
                  <button
                    onClick={() => {
                      const existingSyllabus = assignedSyllabi.find(s => s.courseName === selectedCourse);
                      if (existingSyllabus) {
                        handleViewSyllabus(existingSyllabus.syllabusFile, existingSyllabus.fileUrl);
                      } else {
                        setToast({
                          isVisible: true,
                          message: 'No syllabus assigned for this course yet.',
                          type: 'info'
                        });
                      }
                    }}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-sm underline transition-colors duration-200"
                  >
                    View Syllabus
                  </button>
                </div>
              )}

              {/* File Upload Section - Only show when class is selected */}
              {selectedCourse && (
                <div>
                  <p className="text-xs text-red-500 mb-3">
                    ** Accepted Only JPG,PNG and PDF (Max : 5MB)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleBrowseClick}
                      className={`px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 ${fileError ? 'border-red-500 dark:border-red-500' : 'border-blue-200 dark:border-blue-700'} text-blue-700 dark:text-blue-300 rounded-lg hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800/30 dark:hover:to-indigo-800/30 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all duration-300 cursor-pointer text-sm font-medium flex items-center gap-2`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Browse Syllabus
                    </button>
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex-1 truncate">
                      {selectedFile ? selectedFile.name : 'No file chosen'}
                    </span>
                  </div>
                  
                  {/* Error Message */}
                  {fileError && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {fileError}
                    </p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={handleAssign}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                >
                  Assign
                </button>
              </div>
                      </div>
                    </div>
                    
          {/* Right Side - Data Table */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Table Controls */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  {/* Entries Per Page */}
                    <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Show</span>
                      <select
                      value={entriesPerPage}
                      onChange={(e) => {
                        setEntriesPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={-1}>All</option>
                      </select>
                    <span className="text-sm text-gray-600 dark:text-gray-400">entries</span>
                  </div>

                  {/* Search */}
                  <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Search:</span>
                      <input
                        type="text"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="flex-1 sm:w-48 px-4 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      placeholder="Search classes..."
                    />
                  </div>
                </div>
                    </div>
                    
              {/* Table */}
              <div className="relative">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0 z-20 shadow-sm border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-3 py-2 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleSort('sno')}
                          className="flex items-center justify-center gap-1.5 font-semibold text-sm text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 mx-auto"
                        >
                          Sl.No
                          {getSortIcon('sno')}
                        </button>
                      </th>
                      <th className="px-3 py-2 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleSort('courseName')}
                          className="flex items-center justify-center gap-1.5 font-semibold text-sm text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 mx-auto"
                        >
                          Class Name
                          {getSortIcon('courseName')}
                        </button>
                      </th>
                      <th className="px-3 py-2 text-center whitespace-nowrap">
                        <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                          Syllabus
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                    {paginatedData.length > 0 ? (
                      paginatedData.map((item, index) => (
                        <tr
                          key={item.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                        >
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 text-center">
                            {startIndex + index + 1}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-medium text-center">
                            {item.courseName}
                          </td>
                          <td className="px-4 py-3 text-sm text-center">
                            <Tooltip content="View Syllabus" position="top">
                              <button
                                onClick={() => handleViewSyllabus(item.syllabusFile, item.fileUrl)}
                                className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200 mx-auto"
                              >
                                <Eye style={{ width: '1.2rem', height: '1.2rem', color: '#5791c6' }} />
                              </button>
                            </Tooltip>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                          No matching records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                    </div>
                    
              {/* Pagination */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  {/* Info */}
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {totalEntries > 0 ? startIndex + 1 : 0} to {Math.min(endIndex, totalEntries)} of{' '}
                    {totalEntries} entries
                    </div>
                    
                  {/* Pagination Controls */}
                  {entriesPerPage !== -1 && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
                          currentPage === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700'
                            : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                            currentPage === i + 1
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                              : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}

                        <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages || totalEntries === 0}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
                          currentPage === totalPages || totalEntries === 0
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700'
                            : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                  )}
                </div>
                </div>
            </div>
          </div>
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
    </div>
  );
};

export default AssignSyllabus;
