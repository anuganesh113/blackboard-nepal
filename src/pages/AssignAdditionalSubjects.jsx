import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Filter as FilterIcon, 
  RotateCcw, 
  ChevronDown,
  Search,
  ChevronLeft,
  ChevronRight,
  Save,
  ChevronUp,
  ChevronsUpDown,
  ArrowLeft
} from 'lucide-react';
import Toast from '../components/Toast';
import Tooltip from '../components/Tooltip';
import SearchableDropdown from '../components/SearchableDropdown';
import { DataTable } from '../components/ui';
import { Button, Card } from '../design-system';

const AssignAdditionalSubjects = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    batch: '',
    class: '',
    section: ''
  });

  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });
  
  // Additional subjects available for selection
  const additionalSubjects = [
    { id: 'drawing', name: 'Drawing Cursive' },
    { id: 'generalKnowledge', name: 'General Knowledge' },
    { id: 'hygiene', name: 'Hygiene' }
  ];

  // Sample student data - All students with their batch, class, and section info
  const [allStudents, setAllStudents] = useState([
    { id: 1, rollNo: 12, name: 'Aayusma B.C', drawing: false, generalKnowledge: false, hygiene: false, batchId: 1, classId: 10, sectionId: 'A' },
    { id: 2, rollNo: 13, name: 'Anmol B.c', drawing: false, generalKnowledge: false, hygiene: false, batchId: 1, classId: 10, sectionId: 'A' },
    { id: 3, rollNo: 17, name: 'Avaya Ayer', drawing: true, generalKnowledge: false, hygiene: false, batchId: 1, classId: 10, sectionId: 'A' },
    { id: 4, rollNo: 2, name: 'Bipin Sharma', drawing: false, generalKnowledge: true, hygiene: false, batchId: 1, classId: 10, sectionId: 'A' },
    { id: 5, rollNo: 9, name: 'Diya Malla', drawing: false, generalKnowledge: false, hygiene: true, batchId: 1, classId: 10, sectionId: 'A' },
    { id: 6, rollNo: 15, name: 'Grishma Bogati', drawing: false, generalKnowledge: false, hygiene: false, batchId: 1, classId: 10, sectionId: 'B' },
    { id: 7, rollNo: 16, name: 'Himansu Chunara', drawing: true, generalKnowledge: false, hygiene: false, batchId: 1, classId: 10, sectionId: 'A' },
    { id: 8, rollNo: 14, name: 'Nikita Khadka', drawing: false, generalKnowledge: false, hygiene: false, batchId: 1, classId: 10, sectionId: 'B' },
    { id: 9, rollNo: 5, name: 'Nosika Thapa', drawing: false, generalKnowledge: false, hygiene: false, batchId: 1, classId: 10, sectionId: 'A' },
    { id: 10, rollNo: 1, name: 'Parson Bahadur Bohara', drawing: false, generalKnowledge: false, hygiene: false, batchId: 1, classId: 10, sectionId: 'A' },
    { id: 11, rollNo: 4, name: 'Rajendra Saud', drawing: false, generalKnowledge: false, hygiene: false, batchId: 2, classId: 9, sectionId: 'A' },
    { id: 12, rollNo: 11, name: 'Rohit Dhami', drawing: false, generalKnowledge: false, hygiene: false, batchId: 1, classId: 10, sectionId: 'A' },
    { id: 13, rollNo: 3, name: 'Shusil Khadka', drawing: false, generalKnowledge: false, hygiene: false, batchId: 2, classId: 9, sectionId: 'B' },
    { id: 14, rollNo: 10, name: 'Sishir B.k', drawing: false, generalKnowledge: false, hygiene: false, batchId: 1, classId: 10, sectionId: 'A' },
    { id: 15, rollNo: 7, name: 'Sumant Awasthi', drawing: false, generalKnowledge: false, hygiene: false, batchId: 1, classId: 10, sectionId: 'A' },
    { id: 16, rollNo: 6, name: 'Supriya Awasthi', drawing: false, generalKnowledge: false, hygiene: false, batchId: 2, classId: 9, sectionId: 'A' },
    { id: 17, rollNo: 8, name: 'Uday Chaudhary', drawing: false, generalKnowledge: false, hygiene: false, batchId: 1, classId: 10, sectionId: 'A' },
  ]);

  const [hasFiltered, setHasFiltered] = useState(false);

  // Sample data for dropdowns
  const batches = [
    { id: 1, name: 'Batch 2082' },
    { id: 2, name: 'Batch 2081' },
    { id: 3, name: 'Batch 2080' }
  ];

  const classes = [
    { id: 1, name: 'Class 1' },
    { id: 2, name: 'Class 2' },
    { id: 3, name: 'Class 3' },
    { id: 4, name: 'Class 4' },
    { id: 5, name: 'Class 5' },
    { id: 6, name: 'Class 6' },
    { id: 7, name: 'Class 7' },
    { id: 8, name: 'Class 8' },
    { id: 9, name: 'Class 9' },
    { id: 10, name: 'Class 10' }
  ];

  const sections = [
    { id: 'A', name: 'A' },
    { id: 'B', name: 'B' },
    { id: 'C', name: 'C' }
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!filters.batch) {
      newErrors.batch = 'Batch is required';
    }
    if (!filters.class) {
      newErrors.class = 'Class is required';
    }
    return newErrors;
  };

  const handleFilter = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setHasFiltered(true);
    setCurrentPage(1); // Reset to first page after filtering
    
    // Count filtered students for the toast message
    let count = allStudents.length;
    if (filters.batch) {
      count = allStudents.filter(s => s.batchId === parseInt(filters.batch)).length;
    }
    if (filters.class) {
      count = allStudents.filter(s => 
        (!filters.batch || s.batchId === parseInt(filters.batch)) &&
        s.classId === parseInt(filters.class)
      ).length;
    }
    if (filters.section) {
      count = allStudents.filter(s => 
        (!filters.batch || s.batchId === parseInt(filters.batch)) &&
        (!filters.class || s.classId === parseInt(filters.class)) &&
        s.sectionId === filters.section
      ).length;
    }
    
    setToast({
      isVisible: true,
      message: `Filter applied! Found ${count} student(s).`,
      type: 'success'
    });
  };

  const handleReset = () => {
    setFilters({
      batch: '',
      class: '',
      section: ''
    });
    setErrors({});
    setSearchTerm('');
    setCurrentPage(1);
    setSortConfig({ key: null, direction: 'asc' });
    setHasFiltered(false);
    setToast({
      isVisible: true,
      message: 'Filters reset successfully!',
      type: 'info'
    });
  };

  const handleCheckboxChange = (studentId, subject) => {
    setAllStudents(prevStudents =>
      prevStudents.map(student =>
        student.id === studentId
          ? { ...student, [subject]: !student[subject] }
          : student
      )
    );
  };

  const handleSelectAll = (subject) => {
    const allChecked = currentData.every(student => student[subject]);
    const currentIds = currentData.map(s => s.id);
    setAllStudents(prevStudents =>
      prevStudents.map(student => 
        currentIds.includes(student.id)
          ? { ...student, [subject]: !allChecked }
          : student
      )
    );
  };

  const handleUpdate = () => {
    console.log('Updated student assignments:', allStudents);
    setToast({
      isVisible: true,
      message: 'Additional subjects assigned successfully!',
      type: 'success'
    });
  };

  // Filter, search, and sort data
  const filteredData = useMemo(() => {
    let filtered = [...allStudents];

    // Apply filter criteria only if hasFiltered is true
    if (hasFiltered) {
      // Filter by batch
      if (filters.batch) {
        filtered = filtered.filter(student => student.batchId === parseInt(filters.batch));
      }

      // Filter by class
      if (filters.class) {
        filtered = filtered.filter(student => student.classId === parseInt(filters.class));
      }

      // Filter by section
      if (filters.section) {
        filtered = filtered.filter(student => student.sectionId === filters.section);
      }
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNo.toString().includes(searchTerm)
      );
    }

    // Sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [allStudents, searchTerm, sortConfig, filters, hasFiltered]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Memoized column configuration for DataTable
  const columns = useMemo(() => [
    {
      key: 'id',
      label: 'S.No.',
      sortable: true,
      render: (item, column, index) => (
        <span className="text-sm text-gray-900 dark:text-gray-100">
          {startIndex + index + 1}
        </span>
      )
    },
    {
      key: 'rollNo',
      label: 'Roll No',
      sortable: true,
      render: (item) => (
        <span className="text-sm text-gray-900 dark:text-gray-100 font-medium">
          {item.rollNo}
        </span>
      )
    },
    {
      key: 'name',
      label: 'Student Name',
      sortable: true,
      render: (item) => (
        <span className="text-sm text-gray-900 dark:text-gray-100">
          {item.name}
        </span>
      )
    },
    ...additionalSubjects.map(subject => ({
      key: subject.id,
      label: subject.name,
      sortable: false,
      render: (item) => (
        <div className="flex flex-col items-center gap-1.5">
          <input
            type="checkbox"
            checked={item[subject.id]}
            onChange={() => handleCheckboxChange(item.id, subject.id)}
            className="w-4 h-4 rounded border-green-400 text-green-600 focus:ring-2 focus:ring-green-500 cursor-pointer accent-green-600 transition-all duration-200 hover:scale-110"
          />
        </div>
      )
    }))
  ], [startIndex, additionalSubjects, handleCheckboxChange]);

  // Memoized search configuration
  const searchConfig = useMemo(() => ({
    placeholder: 'Search students...',
    searchFields: ['name', 'rollNo'],
    onSearch: (term) => {
      setSearchTerm(term);
      setCurrentPage(1);
    }
  }), []);

  // Memoized pagination configuration
  const paginationConfig = useMemo(() => ({
    entriesPerPage: entriesPerPage,
    showEntriesSelector: true,
    showPagination: true,
    entriesOptions: [10, 25, 50, 100, -1],
    onEntriesChange: (value) => {
      setEntriesPerPage(value === -1 ? filteredData.length : value);
      setCurrentPage(1);
    }
  }), [entriesPerPage, filteredData.length]);

  const handleBack = () => {
    navigate('/subjects');
  };

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

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEntriesChange = (e) => {
    setEntriesPerPage(e.target.value === 'all' ? filteredData.length : Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className=" bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-950 dark:gray-900 transition-all duration-300">
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
                Assign Additional Subjects to Students
              </h1>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mb-6 overflow-hidden">
          {/* Filter Header */}
          <div className="bg-gray-50 dark:bg-gray-700/30 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
            <div className="flex items-center gap-2">
              <FilterIcon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Filter</h2>
            </div>
          </div>

          {/* Filter Form */}
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {/* Batch Dropdown */}
              <SearchableDropdown
                label="Batch"
                placeholder="Select Batch"
                options={batches.map(batch => ({ value: batch.id, label: batch.name }))}
                value={filters.batch}
                onChange={(batch) => {
                  setFilters(prev => ({ ...prev, batch }));
                  if (errors.batch) {
                    setErrors(prev => ({ ...prev, batch: '' }));
                  }
                }}
                error={errors.batch}
                required={true}
                multiple={false}
                searchable={true}
                optionKey="value"
                optionLabel="label"
              />

              {/* Class Dropdown */}
              <SearchableDropdown
                label="Class"
                placeholder="Select Class"
                options={classes.map(cls => ({ value: cls.id, label: cls.name }))}
                value={filters.class}
                onChange={(classId) => {
                  setFilters(prev => ({ ...prev, class: classId }));
                  if (errors.class) {
                    setErrors(prev => ({ ...prev, class: '' }));
                  }
                }}
                error={errors.class}
                required={true}
                multiple={false}
                searchable={true}
                optionKey="value"
                optionLabel="label"
              />

              {/* Section Dropdown */}
              <SearchableDropdown
                label="Section"
                placeholder="Nothing selected"
                options={sections.map(section => ({ value: section.id, label: section.name }))}
                value={filters.section}
                onChange={(section) => setFilters(prev => ({ ...prev, section }))}
                error=""
                required={false}
                multiple={false}
                searchable={true}
                optionKey="value"
                optionLabel="label"
              />

              {/* Action Buttons */}
              <div className="flex items-end gap-2">
                <Button
                  variant="success"
                  size="sm"
                  icon={<FilterIcon />}
                  onClick={handleFilter}
                >
                  Filter
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<RotateCcw />}
                  onClick={handleReset}
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced DataTable Container */}
        <Card variant="elevated">
          <DataTable
            data={currentData}
            columns={columns}
            searchConfig={searchConfig}
            paginationConfig={paginationConfig}
            emptyMessage={hasFiltered ? 'No students found matching the selected filters' : 'Please select batch and class, then click "Filter" to view students'}
            className=""
          />
        </Card>

        {/* Update Button */}
        <div className="mt-6">
          <Button
            variant="success"
            icon={<Save />}
            onClick={handleUpdate}
          >
            Update
          </Button>
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

export default AssignAdditionalSubjects;

