import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Save, Plus, User, Mail, Phone, MapPin, GraduationCap, DollarSign, 
  Calendar, Eye, EyeOff, Upload, FileText, Award, BookOpen, 
  Building, Users, Clock, AlertCircle, Loader2,
  ChevronDown, Search, Check, ChevronRight, ArrowRight, ArrowLeft, Trash2
} from 'lucide-react';
import Toast from './Toast';
import SearchableDropdown from './SearchableDropdown';

const TeacherModal = ({ isOpen, onClose, teacher, onSave, mode = 'edit' }) => {
  const [formData, setFormData] = useState({
    // Personal Details
    name: '',
    dateOfBirth: '',
    gender: '',
    
    // Contact Information
    email: '',
    mobile: '',
    address: '',
    
    // Professional Details
    designation: '',
    qualifications: [],
    subjects: [],
    experience: '',
    role: 'Teacher',
    
    // Administrative Information
    joinDate: '',
    department: '',
    password: '',
    profilePicture: null,
    
    // Additional Fields
    salary: '',
    isActive: true
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [qualificationInput, setQualificationInput] = useState('');
  const [qualificationAttachment, setQualificationAttachment] = useState(null);
  const [trainingInput, setTrainingInput] = useState({
    institute: '',
    title: '',
    duration: '',
    completedDate: ''
  });
  const [trainings, setTrainings] = useState([]);
  const [otherInfo, setOtherInfo] = useState({
    citizenshipNo: '',
    citizenshipFront: null,
    citizenshipBack: null,
    licenseNo: '',
    licenseDocument: null,
    nid: '',
    nidDocument: null,
    panNo: '',
    panDocument: null
  });
  const [isSubjectsOpen, setIsSubjectsOpen] = useState(false);
  const [subjectsSearch, setSubjectsSearch] = useState('');
  const subjectsDropdownRef = useRef(null);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });
  const [showAlert, setShowAlert] = useState(false);

  // Available designations
  const designations = [
    'Principal',
    'Vice Principal',
    'Senior Teacher',
    'Teacher',
    'Assistant Teacher',
    'Subject Teacher',
    'Math Teacher',
    'Science Teacher',
    'English Teacher',
    'Nepali Teacher',
    'Social Studies Teacher',
    'Computer Teacher',
    'Physical Education Teacher',
    'Art Teacher',
    'Music Teacher',
    'Bus Staff',
    'Administrative Staff',
    'Librarian',
    'Counselor'
  ];

  // Available departments
  const departments = [
    'Academic',
    'Administration',
    'Science',
    'Mathematics',
    'English',
    'Social Studies',
    'Computer Science',
    'Physical Education',
    'Arts',
    'Music',
    'Transportation',
    'Library',
    'Counseling'
  ];

  // Available subjects
  const allSubjects = [
    'Mathematics', 'Science', 'English', 'Nepali', 'Social Studies',
    'Computer', 'Physical Education', 'Art', 'Music', 'Literature',
    'History', 'Geography', 'Economics', 'Physics', 'Chemistry',
    'Biology', 'Statistics', 'Administration', 'Management',
    'Transportation', 'Vehicle Management'
  ];

  // Available genders
  const genders = ['Male', 'Female', 'Other'];

  // Available roles
  const roles = [
    'Teacher', 
    'Driver', 
    'IT Head', 
    'Accountant', 
    'Senior Coordinator', 
    'Admin Head', 
    'Principal', 
    'Accountant / Library', 
    'Co-Admin'
  ];

  useEffect(() => {
    if (teacher && mode === 'edit') {
      setFormData({
        name: teacher.name || '',
        dateOfBirth: teacher.dateOfBirth || '',
        gender: teacher.gender || '',
        email: teacher.email || '',
        mobile: teacher.mobile || '',
        address: teacher.address || '',
        designation: teacher.designation || '',
        qualifications: teacher.qualifications || [],
        subjects: teacher.subjects || [],
        experience: teacher.experience || '',
        role: teacher.role || 'Teacher',
        joinDate: teacher.joinDate || '',
        department: teacher.department || '',
        password: '',
        profilePicture: teacher.profilePicture || null,
        salary: teacher.salary || '',
        isActive: teacher.isActive ?? true
      });
    } else {
      setFormData({
        name: '',
        dateOfBirth: '',
        gender: '',
        email: '',
        mobile: '',
        address: '',
        designation: '',
        qualifications: [],
        subjects: [],
        experience: '',
        role: 'Teacher',
        joinDate: '',
        department: '',
        password: '',
        profilePicture: null,
        salary: '',
        isActive: true
      });
    }
    setErrors({});
    setCurrentStep(1);
    setQualificationInput('');
    setQualificationAttachment(null);
    setTrainingInput({ institute: '', title: '', duration: '', completedDate: '' });
    setTrainings([]);
    setOtherInfo({ 
      citizenshipNo: '', 
      citizenshipFront: null, 
      citizenshipBack: null, 
      licenseNo: '', 
      licenseDocument: null, 
      nid: '', 
      nidDocument: null, 
      panNo: '', 
      panDocument: null 
    });
  }, [teacher, mode, isOpen]);

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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (subjectsDropdownRef.current && !subjectsDropdownRef.current.contains(event.target)) {
        setIsSubjectsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    let newValue = type === 'checkbox' ? checked : value;
    
    // Handle file uploads
    if (type === 'file') {
      newValue = files[0] || null;
    }
    
    // Convert string 'true'/'false' to boolean for isActive
    if (name === 'isActive') {
      newValue = value === 'true';
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleOtherInfoChange = (e) => {
    const { name, value, type, files } = e.target;
    setOtherInfo(prev => ({
      ...prev,
      [name]: type === 'file' ? (files && files[0]) : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleTrainingInputChange = (e) => {
    const { name, value } = e.target;
    setTrainingInput(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[`training${name.charAt(0).toUpperCase() + name.slice(1)}`]) {
      setErrors(prev => ({ ...prev, [`training${name.charAt(0).toUpperCase() + name.slice(1)}`]: '' }));
    }
  };

  const addQualification = () => {
    if (qualificationInput.trim()) {
      const newQualification = {
        id: Date.now(),
        title: qualificationInput.trim(),
        attachment: qualificationAttachment
      };
      setFormData(prev => ({
        ...prev,
        qualifications: [...prev.qualifications, newQualification]
      }));
      setQualificationInput('');
      setQualificationAttachment(null);
      
      // Clear qualification error
      if (errors.qualificationTitle) {
        setErrors(prev => ({ ...prev, qualificationTitle: '' }));
      }
    } else {
      setErrors(prev => ({ ...prev, qualificationTitle: 'Qualification title is required' }));
    }
  };

  const removeQualification = (index) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index)
    }));
  };

  const handleQualificationAttachmentChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        qualifications: prev.qualifications.map((qual, i) => 
          i === index ? { ...qual, attachment: file } : qual
        )
      }));
    }
  };

  const addTraining = () => {
    const newErrors = {};
    
    if (!trainingInput.institute.trim()) {
      newErrors.trainingInstitute = 'Institute name is required';
    }
    if (!trainingInput.title.trim()) {
      newErrors.trainingTitle = 'Training title is required';
    }
    if (!trainingInput.duration.trim()) {
      newErrors.trainingDuration = 'Duration is required';
    }
    if (!trainingInput.completedDate.trim()) {
      newErrors.trainingCompletedDate = 'Completed date is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...newErrors }));
      return;
    }
    
      const newTraining = {
        id: Date.now(),
        ...trainingInput
      };
      setTrainings(prev => [...prev, newTraining]);
      setTrainingInput({ institute: '', title: '', duration: '', completedDate: '' });
    
    // Clear training errors
    setErrors(prev => ({ 
      ...prev, 
      trainingInstitute: '', 
      trainingTitle: '', 
      trainingDuration: '', 
      trainingCompletedDate: '' 
    }));
  };

  const removeTraining = (id) => {
    setTrainings(prev => prev.filter(training => training.id !== id));
  };

  // Filter subjects based on search
  const filteredSubjects = allSubjects.filter(subject =>
    subject.toLowerCase().includes(subjectsSearch.toLowerCase())
  );

  // Handle subject selection
  const handleSubjectSelect = (subject) => {
    if (formData.subjects.includes(subject)) {
      setFormData(prev => ({
        ...prev,
        subjects: prev.subjects.filter(s => s !== subject)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        subjects: [...prev.subjects, subject]
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.designation.trim()) {
      newErrors.designation = 'Designation is required';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile.replace(/\D/g, ''))) {
      newErrors.mobile = 'Mobile number must be 10 digits';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }
    if (!formData.password.trim() && mode === 'create') {
      newErrors.password = 'Password is required';
    } else if (formData.password.trim()) {
      if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      } else if (!/(?=.*[A-Z])/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one uppercase letter';
      } else if (!/(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one number';
      } else if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one special character';
      }
    }
    if (formData.subjects.length === 0) {
      newErrors.subjects = 'Please select at least one subject';
    }
    
    return newErrors;
  };

  const validate = () => {
    const newErrors = {};
    
    // Basic Info validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile.replace(/\D/g, ''))) {
      newErrors.mobile = 'Mobile number must be 10 digits';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.designation.trim()) {
      newErrors.designation = 'Designation is required';
    }
    if (!formData.password.trim() && mode === 'create') {
      newErrors.password = 'Password is required';
    } else if (formData.password.trim()) {
      if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      } else if (!/(?=.*[A-Z])/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one uppercase letter';
      } else if (!/(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one number';
      } else if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one special character';
      }
    }
    if (formData.subjects.length === 0) {
      newErrors.subjects = 'Please select at least one subject';
    }
    
    // Citizenship validation - all three fields must be filled together
    const hasCitizenshipNo = otherInfo.citizenshipNo && otherInfo.citizenshipNo.trim();
    const hasCitizenshipFront = otherInfo.citizenshipFront;
    const hasCitizenshipBack = otherInfo.citizenshipBack;
    
    if (hasCitizenshipNo || hasCitizenshipFront || hasCitizenshipBack) {
      if (!hasCitizenshipNo) {
        newErrors.citizenshipNo = 'Citizenship number is required';
      }
      if (!hasCitizenshipFront) {
        newErrors.citizenshipFront = 'Citizenship front image is required';
      }
      if (!hasCitizenshipBack) {
        newErrors.citizenshipBack = 'Citizenship back image is required';
      }
    }
    
    // License validation - both fields must be filled together
    const hasLicenseNo = otherInfo.licenseNo && otherInfo.licenseNo.trim();
    const hasLicenseDocument = otherInfo.licenseDocument;
    
    if (hasLicenseNo || hasLicenseDocument) {
      if (!hasLicenseNo) {
        newErrors.licenseNo = 'License number is required';
      }
      if (!hasLicenseDocument) {
        newErrors.licenseDocument = 'License document is required';
      }
    }
    
    // NID validation - both fields must be filled together
    const hasNid = otherInfo.nid && otherInfo.nid.trim();
    const hasNidDocument = otherInfo.nidDocument;
    
    if (hasNid || hasNidDocument) {
      if (!hasNid) {
        newErrors.nid = 'NID is required';
      }
      if (!hasNidDocument) {
        newErrors.nidDocument = 'NID document is required';
      }
    }
    
    // PAN validation - both fields must be filled together
    const hasPanNo = otherInfo.panNo && otherInfo.panNo.trim();
    const hasPanDocument = otherInfo.panDocument;
    
    if (hasPanNo || hasPanDocument) {
      if (!hasPanNo) {
        newErrors.panNo = 'PAN number is required';
      }
      if (!hasPanDocument) {
        newErrors.panDocument = 'PAN document is required';
      }
    }
    
    return newErrors;
  };

  const handleSubmit = async () => {
    // IMPORTANT: Only validate and submit when on step 4 (Others section)
    // Data will NOT be added to the table unless the "Add" button is clicked on step 4
    if (currentStep !== 4) {
      // Prevent submission on any step other than step 4
      return;
    }
    
    // Check if basic info is filled before allowing submission
    const isBasicInfoFilled = formData.designation && 
                               formData.name && 
                               formData.email && 
                               formData.mobile && 
                               formData.address && 
                               formData.dateOfBirth && 
                               (mode === 'edit' || formData.password) && 
                               formData.subjects.length > 0;
    
    if (!isBasicInfoFilled) {
      setShowAlert(true);
      return;
    }
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const teacherData = {
        ...formData,
        qualifications: formData.qualifications,
        trainings: trainings,
        otherInfo: otherInfo
      };
      
      onSave(teacherData);
      
      setToast({ isVisible: true, message: 'Teacher information saved successfully!', type: 'success' });
      
      // Close modal after showing toast
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error saving teacher:', error);
      setToast({ isVisible: true, message: 'Failed to save. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    // Validate current step before moving to next
    if (currentStep === 1) {
      const stepErrors = validateStep1();
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        return;
      }
    }
    
    // Clear errors if validation passed
    setErrors({});
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      dateOfBirth: '',
      gender: '',
      email: '',
      mobile: '',
      address: '',
      designation: '',
      qualifications: [],
      subjects: [],
      experience: '',
      role: 'Teacher',
      password: '',
      profilePicture: null,
      salary: '',
      isActive: true
    });
    setErrors({});
    setCurrentStep(1);
    setQualificationInput('');
    setQualificationAttachment(null);
    setTrainingInput({ institute: '', title: '', duration: '', completedDate: '' });
    setTrainings([]);
    setOtherInfo({ 
      citizenshipNo: '', 
      citizenshipFront: null, 
      citizenshipBack: null, 
      licenseNo: '', 
      licenseDocument: null, 
      nid: '', 
      nidDocument: null, 
      panNo: '', 
      panDocument: null 
    });
  };

  if (!isOpen) return null;

  const steps = [
    { id: 1, name: 'Basic Info', icon: User },
    { id: 2, name: 'Qualifications', icon: Award },
    { id: 3, name: 'Trainings', icon: BookOpen },
    { id: 4, name: 'Others', icon: FileText }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-7xl transform transition-all overflow-visible">
          {/* Header */}
          <div className={`flex items-center justify-between p-6 border-b bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-t-2xl ${
            mode === 'create' 
              ? 'border-green-200 dark:border-green-700' 
              : 'border-blue-200 dark:border-blue-700'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${
                mode === 'create' 
                  ? 'bg-green-500' 
                  : 'bg-blue-500'
              }`}>
                {mode === 'create' ? <Plus className="w-6 h-6 text-white" /> : <Save className="w-6 h-6 text-white" />}
              </div>
              <h2 className={`text-2xl font-bold ${
                mode === 'create' 
                  ? 'text-green-700 dark:text-green-400' 
                  : 'text-blue-700 dark:text-blue-400'
              }`}>
                {mode === 'edit' ? 'Update Teacher' : 'Add New Teacher'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex">
            {/* Left Sidebar - Navigation */}
            <div className="w-64 bg-gray-50 dark:bg-gray-900 p-6 border-r border-gray-200 dark:border-gray-700 rounded-2xl">
              <div className="space-y-2">
                {steps.map((step) => {
                  const Icon = step.icon;
                  const isActive = currentStep === step.id;
                  
                  return (
                    <button
                      key={step.id}
                      onClick={() => setCurrentStep(step.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{step.name}</span>
                    </button>
                  );
                })}
              </div>
              </div>

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-visible">
              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                {/* Step 1: Basic Info */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Basic Info</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Designation */}
              <div>
                <SearchableDropdown
                  label="Designation"
                  placeholder="Select Designation"
                  options={designations}
                  value={formData.designation}
                  onChange={(designation) => {
                    setFormData(prev => ({ ...prev, designation }));
                    if (errors.designation) {
                      setErrors(prev => ({ ...prev, designation: '' }));
                    }
                  }}
                  error={errors.designation}
                  required={true}
                  multiple={false}
                  searchable={true}
                />
              </div>

                      {/* Role */}
                      <div>
                        <SearchableDropdown
                          label="Role"
                          placeholder="Select Role"
                          options={roles}
                          value={formData.role || "Teacher"}
                          onChange={(role) => setFormData(prev => ({ ...prev, role }))}
                          error=""
                          required={false}
                          multiple={false}
                          searchable={true}
                        />
                      </div>

                      {/* Full Name */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter Teacher name."
                          className={`w-full px-4 py-3 rounded-xl border ${
                            errors.name 
                              ? 'border-red-500 focus:ring-red-500' 
                              : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                          } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200`}
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                        )}
                      </div>

              {/* Email */}
              <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                          placeholder="Enter email address."
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.email 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Mobile */}
              <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Mobile <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                          placeholder="Enter mobile number."
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.mobile 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200`}
                />
                {errors.mobile && (
                  <p className="mt-1 text-sm text-red-500">{errors.mobile}</p>
                )}
              </div>

              {/* Address */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Address <span className="text-red-500">*</span>
                </label>
                        <input
                          type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                          placeholder="Enter teacher current address."
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.address 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                          } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200`}
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                )}
              </div>

                      {/* Date of Birth */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Date Of Birth <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-xl border ${
                            errors.dateOfBirth 
                              ? 'border-red-500 focus:ring-red-500' 
                              : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                          } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 transition-all duration-200 [color-scheme:light] dark:[color-scheme:dark]`}
                        />
                        {errors.dateOfBirth && (
                          <p className="mt-1 text-sm text-red-500">{errors.dateOfBirth}</p>
                        )}
                      </div>

                      {/* Password */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter password."
                            className={`w-full px-4 py-3 pr-12 rounded-xl border ${
                              errors.password 
                                ? 'border-red-500 focus:ring-red-500' 
                                : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                            } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                        )}
                      </div>


                      {/* Profile Picture */}
                      <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Profile Picture
                </label>
                        <div className="flex items-center gap-3">
                      <input
                            type="file"
                            name="profilePicture"
                            onChange={handleChange}
                            accept="image/*"
                            className="hidden"
                            id="profilePicture"
                          />
                          <label
                            htmlFor="profilePicture"
                            className="px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 rounded-lg hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800/30 dark:hover:to-indigo-800/30 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all duration-300 cursor-pointer text-sm font-medium flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Choose File
                          </label>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formData.profilePicture ? formData.profilePicture.name : 'No file chosen'}
                          </span>
                        </div>
                      </div>

                      {/* Assign Subjects */}
                      <div className="relative overflow-visible" ref={subjectsDropdownRef}>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Assign Subjects <span className="text-red-500">*</span>
                    </label>
                        
                        {/* Custom Dropdown Button */}
                        <button
                          type="button"
                          onClick={() => setIsSubjectsOpen(!isSubjectsOpen)}
                          className={`w-full px-4 py-3 rounded-xl border ${
                            errors.subjects 
                              ? 'border-red-500 focus:ring-red-500' 
                              : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                          } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 transition-all duration-200 flex items-center justify-between min-h-[48px]`}
                        >
                          <div className="flex-1 flex flex-wrap gap-1.5 items-center">
                            {formData.subjects.length === 0 ? (
                              <span className="text-gray-500 dark:text-gray-400">Nothing selected</span>
                            ) : (
                              formData.subjects.map((subject) => (
                                <span
                                  key={subject}
                                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-md border border-blue-200 dark:border-blue-700/30"
                                >
                                  {subject}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSubjectSelect(subject);
                                    }}
                                    className="ml-1 p-0.5 text-blue-500 hover:bg-blue-200 dark:hover:bg-blue-800 rounded transition-colors duration-200"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </span>
                              ))
                            )}
                          </div>
                          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isSubjectsOpen ? 'rotate-180' : ''} ml-2 flex-shrink-0`} />
                        </button>

                        {/* Dropdown Menu */}
                        {isSubjectsOpen && (
                          <div className="absolute z-50 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-lg max-h-64 overflow-hidden"
                               style={{ 
                                 bottom: '100%',
                                 left: '0',
                                 right: '0',
                                 marginBottom: '0',
                                 marginTop: '-2rem'
                               }}>
                            {/* Search Input */}
                            <div className="p-3 border-b border-gray-200 dark:border-gray-600">
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                  type="text"
                                  placeholder="Search subjects..."
                                  value={subjectsSearch}
                                  onChange={(e) => setSubjectsSearch(e.target.value)}
                                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                />
                              </div>
                            </div>

                            {/* Header */}
                            <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600">
                              Choose Subjects
                            </div>

                            {/* Subjects List */}
                            <div className="max-h-48 overflow-y-auto">
                              {filteredSubjects.map((subject) => (
                                <button
                                  key={subject}
                                  type="button"
                                  onClick={() => handleSubjectSelect(subject)}
                                  className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center justify-between ${
                                    formData.subjects.includes(subject) 
                                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                                      : 'text-gray-900 dark:text-gray-100'
                                  }`}
                                >
                                  <span>{subject}</span>
                                  {formData.subjects.includes(subject) && (
                                    <Check className="w-4 h-4 text-green-500" />
                                  )}
                                </button>
                              ))}
                              {filteredSubjects.length === 0 && (
                                <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                                  No subjects found
                                </div>
                              )}
                            </div>
                </div>
                        )}

                {errors.subjects && (
                  <p className="mt-1 text-sm text-red-500">{errors.subjects}</p>
                )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Qualifications */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Qualifications Info</h3>
                    
                    <div className="space-y-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Qualification Title */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Qualification Title
                        </label>
                          <input
                            type="text"
                            value={qualificationInput}
                              onChange={(e) => {
                                setQualificationInput(e.target.value);
                                if (errors.qualificationTitle) {
                                  setErrors(prev => ({ ...prev, qualificationTitle: '' }));
                                }
                              }}
                            placeholder="Enter Qualification Title"
                              className={`w-full px-4 py-3 rounded-xl border ${
                                errors.qualificationTitle 
                                  ? 'border-red-500 focus:ring-red-500' 
                                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                              } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200`}
                            />
                            {errors.qualificationTitle && (
                              <p className="mt-1 text-sm text-red-500">{errors.qualificationTitle}</p>
                            )}
                          </div>

                          {/* Attachment Field */}
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                              Attachment
                            </label>
                            <div className="flex items-center gap-3">
                              <input
                                type="file"
                                onChange={(e) => setQualificationAttachment(e.target.files[0] || null)}
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                className="hidden"
                                id="qualification-attachment"
                              />
                              <label
                                htmlFor="qualification-attachment"
                                className="px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 rounded-lg hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800/30 dark:hover:to-indigo-800/30 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all duration-300 cursor-pointer text-sm font-medium flex items-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                Choose File
                              </label>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {qualificationAttachment ? qualificationAttachment.name : 'No file chosen'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Add Button */}
                          <button
                            type="button"
                            onClick={addQualification}
                          className="w-full px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                          Add Qualification
                          </button>
                      </div>

                      {formData.qualifications.length > 0 && (
                        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                          <div className="bg-blue-600 text-white px-4 py-3">
                            <div className="grid grid-cols-12 gap-4 text-sm font-semibold">
                              <div className="col-span-1">S.No.</div>
                              <div className="col-span-6">Qualification Title</div>
                              <div className="col-span-4">Attachment</div>
                              <div className="col-span-1">Action</div>
                            </div>
                          </div>
                          <div className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                            {formData.qualifications.map((qualification, index) => (
                              <div key={qualification.id || index} className="px-4 py-3">
                                <div className="grid grid-cols-12 gap-4 items-center">
                                  <div className="col-span-1 text-sm text-gray-600 dark:text-gray-400">{index + 1}.</div>
                                  <div className="col-span-6 text-sm text-gray-900 dark:text-gray-100">{qualification.title}</div>
                                  <div className="col-span-4 text-sm text-gray-500 dark:text-gray-400">
                                    {qualification.attachment ? qualification.attachment.name : 'No file'}
                                  </div>
                                  <div className="col-span-1 flex justify-center">
                                <button
                                  type="button"
                                  onClick={() => removeQualification(index)}
                                      className="p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Trainings */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Trainings Info</h3>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        {/* Institute Name */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Institute Name
                          </label>
                          <input
                            type="text"
                            name="institute"
                            value={trainingInput.institute}
                            onChange={handleTrainingInputChange}
                            placeholder="Enter Institute Name"
                            className={`w-full px-4 py-3 rounded-xl border ${
                              errors.trainingInstitute 
                                ? 'border-red-500 focus:ring-red-500' 
                                : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                            } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200`}
                          />
                          {errors.trainingInstitute && (
                            <p className="mt-1 text-sm text-red-500">{errors.trainingInstitute}</p>
                          )}
                        </div>

                        {/* Training Title */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Training Title
                          </label>
                          <input
                            type="text"
                            name="title"
                            value={trainingInput.title}
                            onChange={handleTrainingInputChange}
                            placeholder="Enter Training Title"
                            className={`w-full px-4 py-3 rounded-xl border ${
                              errors.trainingTitle 
                                ? 'border-red-500 focus:ring-red-500' 
                                : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                            } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200`}
                          />
                          {errors.trainingTitle && (
                            <p className="mt-1 text-sm text-red-500">{errors.trainingTitle}</p>
                          )}
                        </div>

                        {/* Duration */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Duration <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="duration"
                            value={trainingInput.duration}
                            onChange={handleTrainingInputChange}
                            placeholder="Enter Duration (e.g., 3 months)"
                            className={`w-full px-4 py-3 rounded-xl border ${
                              errors.trainingDuration 
                                ? 'border-red-500 focus:ring-red-500' 
                                : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                            } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200`}
                          />
                          {errors.trainingDuration && (
                            <p className="mt-1 text-sm text-red-500">{errors.trainingDuration}</p>
                          )}
                        </div>

                        {/* Completed Date */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Completed Date <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            name="completedDate"
                            value={trainingInput.completedDate}
                            onChange={handleTrainingInputChange}
                            placeholder="mm/dd/yyyy"
                            className={`w-full px-4 py-3 rounded-xl border ${
                              errors.trainingCompletedDate 
                                ? 'border-red-500 focus:ring-red-500' 
                                : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                            } bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 [color-scheme:light] dark:[color-scheme:dark]`}
                          />
                          {errors.trainingCompletedDate && (
                            <p className="mt-1 text-sm text-red-500">{errors.trainingCompletedDate}</p>
                          )}
                        </div>

                        {/* Attachment */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Attachment
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="file"
                              name="attachment"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                setTrainingInput(prev => ({ ...prev, attachment: file }));
                              }}
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                              className="hidden"
                              id="training-attachment"
                            />
                            <label
                              htmlFor="training-attachment"
                              className="px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 rounded-lg hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800/30 dark:hover:to-indigo-800/30 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all duration-300 cursor-pointer text-sm font-medium flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              Choose File
                            </label>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {trainingInput.attachment ? trainingInput.attachment.name : 'No file chosen'}
                            </span>
                        </div>
                      </div>
                      
                      </div>
                      
                      {/* Add Button */}
                      <button
                        type="button"
                        onClick={addTraining}
                        className="w-full px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Training
                      </button>

                      {trainings.length > 0 && (
                        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                          <div className="bg-blue-600 text-white px-4 py-3">
                            <div className="grid grid-cols-7 gap-4 text-sm font-semibold">
                              <div>S.No.</div>
                              <div>Institute Name</div>
                              <div>Training Title</div>
                              <div>Duration</div>
                              <div>Completed Date</div>
                              <div>Attachment</div>
                              <div>Action</div>
                            </div>
                          </div>
                          <div className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                            {trainings.map((training, index) => (
                              <div key={training.id} className="px-4 py-3">
                                <div className="grid grid-cols-7 gap-4 items-center">
                                  <div className="text-sm text-gray-600 dark:text-gray-400">{index + 1}.</div>
                                <div className="text-sm text-gray-900 dark:text-gray-100">{training.institute}</div>
                                <div className="text-sm text-gray-900 dark:text-gray-100">{training.title}</div>
                                <div className="text-sm text-gray-900 dark:text-gray-100">{training.duration}</div>
                                <div className="text-sm text-gray-900 dark:text-gray-100">{training.completedDate}</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {training.attachment ? training.attachment.name : 'No file'}
                                  </div>
                                  <div className="flex justify-center">
                                <button
                                  type="button"
                                  onClick={() => removeTraining(training.id)}
                                  className="p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 4: Others */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Other Info</h3>
                    
                    <div className="space-y-6">
                      {/* Citizenship No. - Full Width */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Citizen Ship No.
                        </label>
                        <input
                          type="text"
                          name="citizenshipNo"
                          value={otherInfo.citizenshipNo}
                          onChange={handleOtherInfoChange}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                            }
                          }}
                          placeholder="Citizen Ship No."
                          className={`w-full px-4 py-3 rounded-xl border ${
                            errors.citizenshipNo 
                              ? 'border-red-500 focus:ring-red-500' 
                              : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                          } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200`}
                        />
                        {errors.citizenshipNo && (
                          <p className="mt-1 text-sm text-red-500">{errors.citizenshipNo}</p>
                        )}
                      </div>

                      {/* Citizenship Front and Back - Same Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Citizenship Front
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="file"
                              name="citizenshipFront"
                              className="hidden"
                              id="citizenshipFront"
                              onChange={handleOtherInfoChange}
                              accept="image/*,.pdf"
                            />
                            <label 
                              htmlFor="citizenshipFront"
                              className={`px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 ${
                                errors.citizenshipFront 
                                  ? 'border-red-500' 
                                  : 'border-blue-200 dark:border-blue-700'
                              } text-blue-700 dark:text-blue-300 rounded-lg hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800/30 dark:hover:to-indigo-800/30 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all duration-300 cursor-pointer text-sm font-medium flex items-center gap-2`}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              Choose File
                            </label>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {otherInfo.citizenshipFront ? otherInfo.citizenshipFront.name : 'No file chosen'}
                            </span>
                          </div>
                          {errors.citizenshipFront && (
                            <p className="mt-1 text-sm text-red-500">{errors.citizenshipFront}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Citizenship Back 
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="file"
                              name="citizenshipBack"
                              className="hidden"
                              id="citizenshipBack"
                              onChange={handleOtherInfoChange}
                              accept="image/*,.pdf"
                            />
                            <label
                              htmlFor="citizenshipBack"
                              className={`px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 ${
                                errors.citizenshipBack 
                                  ? 'border-red-500' 
                                  : 'border-blue-200 dark:border-blue-700'
                              } text-blue-700 dark:text-blue-300 rounded-lg hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800/30 dark:hover:to-indigo-800/30 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all duration-300 cursor-pointer text-sm font-medium flex items-center gap-2`}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              Choose File
                            </label>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {otherInfo.citizenshipBack ? otherInfo.citizenshipBack.name : 'No file chosen'}
                            </span>
                          </div>
                          {errors.citizenshipBack && (
                            <p className="mt-1 text-sm text-red-500">{errors.citizenshipBack}</p>
                          )}
                        </div>
                      </div>

                      {/* Other Fields - 2 Column Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            License No. 
                          </label>
                          <input
                            type="text"
                            name="licenseNo"
                            value={otherInfo.licenseNo}
                            onChange={handleOtherInfoChange}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                              }
                            }}
                            placeholder="License No."
                            className={`w-full px-4 py-3 rounded-xl border ${
                              errors.licenseNo 
                                ? 'border-red-500 focus:ring-red-500' 
                                : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                            } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200`}
                          />
                          {errors.licenseNo && (
                            <p className="mt-1 text-sm text-red-500">{errors.licenseNo}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            License Document 
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="file"
                              name="licenseDocument"
                              className="hidden"
                              id="licenseDocument"
                              onChange={handleOtherInfoChange}
                              accept="image/*,.pdf"
                            />
                            <label 
                              htmlFor="licenseDocument"
                              className={`px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 ${
                                errors.licenseDocument 
                                  ? 'border-red-500' 
                                  : 'border-blue-200 dark:border-blue-700'
                              } text-blue-700 dark:text-blue-300 rounded-lg hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800/30 dark:hover:to-indigo-800/30 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all duration-300 cursor-pointer text-sm font-medium flex items-center gap-2`}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              Choose File
                            </label>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {otherInfo.licenseDocument ? otherInfo.licenseDocument.name : 'No file chosen'}
                            </span>
                          </div>
                          {errors.licenseDocument && (
                            <p className="mt-1 text-sm text-red-500">{errors.licenseDocument}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            NID 
                          </label>
                          <input
                            type="text"
                            name="nid"
                            value={otherInfo.nid}
                            onChange={handleOtherInfoChange}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                              }
                            }}
                            placeholder="NID"
                            className={`w-full px-4 py-3 rounded-xl border ${
                              errors.nid 
                                ? 'border-red-500 focus:ring-red-500' 
                                : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                            } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200`}
                          />
                          {errors.nid && (
                            <p className="mt-1 text-sm text-red-500">{errors.nid}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            NID Document
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="file"
                              name="nidDocument"
                              className="hidden"
                              id="nidDocument"
                              onChange={handleOtherInfoChange}
                              accept="image/*,.pdf"
                            />
                            <label 
                              htmlFor="nidDocument"
                              className={`px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 ${
                                errors.nidDocument 
                                  ? 'border-red-500' 
                                  : 'border-blue-200 dark:border-blue-700'
                              } text-blue-700 dark:text-blue-300 rounded-lg hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800/30 dark:hover:to-indigo-800/30 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all duration-300 cursor-pointer text-sm font-medium flex items-center gap-2`}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              Choose File
                            </label>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {otherInfo.nidDocument ? otherInfo.nidDocument.name : 'No file chosen'}
                            </span>
                          </div>
                          {errors.nidDocument && (
                            <p className="mt-1 text-sm text-red-500">{errors.nidDocument}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            PAN No. 
                          </label>
                          <input
                            type="text"
                            name="panNo"
                            value={otherInfo.panNo}
                            onChange={handleOtherInfoChange}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                              }
                            }}
                            placeholder="PAN No."
                            className={`w-full px-4 py-3 rounded-xl border ${
                              errors.panNo 
                                ? 'border-red-500 focus:ring-red-500' 
                                : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                            } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200`}
                          />
                          {errors.panNo && (
                            <p className="mt-1 text-sm text-red-500">{errors.panNo}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            PAN Document 
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="file"
                              name="panDocument"
                              className="hidden"
                              id="panDocument"
                              onChange={handleOtherInfoChange}
                              accept="image/*,.pdf"
                            />
                            <label
                              htmlFor="panDocument"
                              className={`px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 ${
                                errors.panDocument 
                                  ? 'border-red-500' 
                                  : 'border-blue-200 dark:border-blue-700'
                              } text-blue-700 dark:text-blue-300 rounded-lg hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800/30 dark:hover:to-indigo-800/30 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all duration-300 cursor-pointer text-sm font-medium flex items-center gap-2`}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              Choose File
                            </label>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {otherInfo.panDocument ? otherInfo.panDocument.name : 'No file chosen'}
                            </span>
                          </div>
                          {errors.panDocument && (
                            <p className="mt-1 text-sm text-red-500">{errors.panDocument}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-3">
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={prevStep}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 ${
                          mode === 'create'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                            : 'bg-gradient-to-r from-blue-500 to-purple-600'
                        }`}
                      >
                        <ArrowLeft className="w-5 h-5" />
                        Previous
                      </button>
                    )}
                    
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                    >
                      Reset
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    {currentStep < 4 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 ${
                          mode === 'create'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                            : 'bg-gradient-to-r from-blue-500 to-purple-600'
                        }`}
                      >
                        <ArrowRight className="w-5 h-5" />
                        Next
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                          mode === 'create'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                            : 'bg-gradient-to-r from-blue-500 to-purple-600'
                        }`}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            {mode === 'create' ? <Plus className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                            {mode === 'edit' ? 'Update' : 'Add'}
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Beautiful Alert Modal */}
      {showAlert && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
            onClick={() => setShowAlert(false)}
          />
          
          {/* Alert Content */}
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full transform animate-scaleIn">
            {/* Icon */}
            <div className="flex flex-col items-center pt-8 pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Incomplete Information
              </h3>
              
              {/* Message */}
              <p className="text-center text-gray-600 dark:text-gray-400 px-6 mb-6">
                Please fill the details in <span className="font-semibold text-blue-600 dark:text-blue-400">Basic Info</span> first before submitting the form.
              </p>
            </div>
            
            {/* Actions */}
            <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowAlert(false)}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAlert(false);
                  setCurrentStep(1);
                }}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                Go to Basic Info
              </button>
            </div>
          </div>
        </div>
      )}
      
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

export default TeacherModal;
