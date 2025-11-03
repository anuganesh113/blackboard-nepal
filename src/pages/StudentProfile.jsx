import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  User,
  Calendar,
  DollarSign,
  Download,
  Edit,
  Key,
  Eye,
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  Printer,
  Search,
  QrCode,
  Mail,
  Phone,
  MapPin,
  Calendar as CalendarIcon,
  UserCircle,
  Hash,
  Building2,
  Users
} from 'lucide-react';
import fallbackAvatarImage from '../assets/img/fallback-avatar.png';
import logoImage from '../assets/img/bb-logo.png';
import { Button, Card } from '../design-system';
import Toast from '../components/Toast';
import Tooltip from '../components/Tooltip';
import { useSound } from '../context/SoundContext';
import { DataTable } from '../components/ui';

const StudentProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { playNotificationSound } = useSound();
  const student = location.state?.student || {
    id: 1,
    rollNumber: '1',
    studentId: 'STU001',
    photo: null,
    name: 'John Doe',
    email: 'john.doe@example.com',
    contact: '1234567890',
    course: 'Class 8',
    section: 'A',
    batch: 'Batch 2082',
    symbolNumber: 'SYM001',
    registrationNumber: 'REG001',
    dob: '2010-05-15',
    gender: 'Male',
    parentName: 'John Doe Sr.',
    parentPAN: 'ABCDE1234F',
    address: '123 Main Street, City, State 12345',
    appliedDate: '2023-01-15',
    hasSibling: true,
    isEnabled: true
  };

  const [activeTab, setActiveTab] = useState('info');
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [attendanceData, setAttendanceData] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(student.batch || 'Batch 2082');

  // Document types and status
  const [documents] = useState([
    { type: 'Passport photo', status: 'uploaded', file: null },
    { type: 'School Certificate', status: 'pending', file: null },
    { type: 'Exam Results', status: 'uploaded', file: null },
    { type: 'Medical Certificate', status: 'pending', file: null }
  ]);

  // Recent transactions data
  const [recentTransactions] = useState([
    { id: 1, paymentFor: 'Tuition Fee', date: '2024-01-15', invoiceNo: 'INV-001', status: 'Paid', amount: 5000, discount: 500, fine: 0, paidAmount: 4500 },
    { id: 2, paymentFor: 'Library Fee', date: '2024-01-10', invoiceNo: 'INV-002', status: 'Paid', amount: 500, discount: 0, fine: 0, paidAmount: 500 },
    { id: 3, paymentFor: 'Sports Fee', date: '2024-01-05', invoiceNo: 'INV-003', status: 'Paid', amount: 300, discount: 0, fine: 0, paidAmount: 300 }
  ]);

  // Pending transactions data
  const [pendingTransactions, setPendingTransactions] = useState([
    { id: 1, dueDate: '2024-02-15', feeName: 'Tuition Fee', feeAmount: 5000, pendingAmount: 5000, fineAmount: 0, selected: false, payableAmount: 5000, fine: 0, discount: 0 },
    { id: 2, dueDate: '2024-02-20', feeName: 'Library Fee', feeAmount: 500, pendingAmount: 500, fineAmount: 50, selected: false, payableAmount: 500, fine: 50, discount: 0 }
  ]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleViewDocument = (docType) => {
    setToast({
      isVisible: true,
      message: `Viewing ${docType}`,
      type: 'info'
    });
  };

  const handleReUploadDocument = (docType) => {
    setToast({
      isVisible: true,
      message: `Re-upload ${docType}`,
      type: 'info'
    });
  };

  const handleSubmitFiles = () => {
    playNotificationSound('success');
    setToast({
      isVisible: true,
      message: 'Files submitted successfully!',
      type: 'success'
    });
  };

  const handleEditInfo = () => {
    setIsEditModalOpen(true);
  };

  const handleChangePassword = () => {
    setToast({
      isVisible: true,
      message: 'Change password functionality',
      type: 'info'
    });
  };

  const handleToggleEnabled = () => {
    playNotificationSound('success');
    setToast({
      isVisible: true,
      message: `Student ${student.isEnabled ? 'disabled' : 'enabled'} successfully`,
      type: 'success'
    });
  };

  const handleDownloadCard = () => {
    playNotificationSound('success');
    setToast({
      isVisible: true,
      message: 'Student ID card downloaded successfully!',
      type: 'success'
    });
  };

  const handleViewAttendance = () => {
    // Mock attendance data
    const mockAttendance = {
      totalDays: 20,
      presentDays: 18,
      absentDays: 2,
      percentage: 90
    };
    setAttendanceData(mockAttendance);
    setToast({
      isVisible: true,
      message: 'Attendance data loaded',
      type: 'success'
    });
  };

  const handleTogglePendingSelection = (id) => {
    setPendingTransactions(prev => prev.map(t => 
      t.id === id ? { ...t, selected: !t.selected } : t
    ));
  };

  const handlePayNow = () => {
    const selected = pendingTransactions.filter(t => t.selected);
    if (selected.length === 0) {
      setToast({
        isVisible: true,
        message: 'Please select at least one fee to pay',
        type: 'error'
      });
      return;
    }
    playNotificationSound('success');
    setToast({
      isVisible: true,
      message: `Processing payment for ${selected.length} fee(s)`,
      type: 'success'
    });
    // Remove paid fees
    setPendingTransactions(prev => prev.filter(t => !t.selected));
  };

  const totalPendingAmount = useMemo(() => {
    return pendingTransactions.reduce((sum, t) => sum + t.pendingAmount, 0);
  }, [pendingTransactions]);

  const totalDueAmount = useMemo(() => {
    return pendingTransactions
      .filter(t => t.selected)
      .reduce((sum, t) => sum + (t.payableAmount || t.pendingAmount) + t.fine - (t.discount || 0), 0);
  }, [pendingTransactions]);

  const tabs = [
    { id: 'info', label: 'Student Info', icon: User },
    { id: 'attendance', label: 'View Attendance', icon: Calendar },
    { id: 'fees', label: 'Fee & Payments', icon: DollarSign }
  ];

  // Recent transactions columns
  const recentTransactionColumns = useMemo(() => [
    { key: 'paymentFor', label: 'Payment For', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'invoiceNo', label: 'Invoice No', sortable: true },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (item) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.status === 'Paid' 
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
        }`}>
          {item.status}
        </span>
      )
    },
    { key: 'amount', label: 'Amount', sortable: true, render: (item) => `₹${item.amount}` },
    { key: 'discount', label: 'Discount', sortable: true, render: (item) => `₹${item.discount}` },
    { key: 'fine', label: 'Fine', sortable: true, render: (item) => `₹${item.fine}` },
    { key: 'paidAmount', label: 'Paid Amount', sortable: true, render: (item) => `₹${item.paidAmount}` }
  ], []);

  // Pending transactions columns
  const pendingTransactionColumns = useMemo(() => [
    {
      key: 'select',
      label: '',
      sortable: false,
      render: (item) => (
        <input
          type="checkbox"
          checked={item.selected || false}
          onChange={() => handleTogglePendingSelection(item.id)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
        />
      )
    },
    { key: 'dueDate', label: 'Due Date', sortable: true },
    { key: 'feeName', label: 'Fee Name', sortable: true },
    { key: 'feeAmount', label: 'Fee Amount', sortable: true, render: (item) => `₹${item.feeAmount}` },
    { key: 'pendingAmount', label: 'Pending Amount', sortable: true, render: (item) => `₹${item.pendingAmount}` },
    { key: 'fineAmount', label: 'Fine Amount', sortable: true, render: (item) => `₹${item.fineAmount}` },
    {
      key: 'payableAmount',
      label: 'Payable Amount',
      sortable: false,
      render: (item) => (
        <input
          type="number"
          value={item.payableAmount || item.pendingAmount}
          onChange={(e) => {
            setPendingTransactions(prev => prev.map(t => 
              t.id === item.id ? { ...t, payableAmount: parseFloat(e.target.value) || 0 } : t
            ));
          }}
          className="w-20 px-2 py-1 border rounded text-sm"
        />
      )
    },
    {
      key: 'fine',
      label: 'Fine',
      sortable: false,
      render: (item) => (
        <input
          type="number"
          value={item.fine || 0}
          onChange={(e) => {
            setPendingTransactions(prev => prev.map(t => 
              t.id === item.id ? { ...t, fine: parseFloat(e.target.value) || 0 } : t
            ));
          }}
          className="w-20 px-2 py-1 border rounded text-sm"
        />
      )
    },
    {
      key: 'discount',
      label: 'Discount',
      sortable: false,
      render: (item) => (
        <select
          value={item.discount || 0}
          onChange={(e) => {
            setPendingTransactions(prev => prev.map(t => 
              t.id === item.id ? { ...t, discount: parseFloat(e.target.value) || 0 } : t
            ));
          }}
          className="w-24 px-2 py-1 border rounded text-sm"
        >
          <option value={0}>None</option>
          <option value={100}>₹100</option>
          <option value={200}>₹200</option>
          <option value={500}>₹500</option>
        </select>
      )
    }
  ], []);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="overflow-y-auto bg-gradient-to-br from-slate-50 via-emerald-50/20 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 transition-all duration-500 min-h-screen">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20 pointer-events-none select-none">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 via-transparent to-indigo-50/30 dark:from-emerald-950/20 dark:via-transparent dark:to-indigo-950/20" />
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative z-10 p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Tooltip content="Back" position="top">
                <button
                  onClick={handleBack}
                  className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 group"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                </button>
              </Tooltip>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-emerald-900 to-indigo-900 dark:from-white dark:via-emerald-100 dark:to-indigo-100 bg-clip-text text-transparent">
                  View Student Profile
                </h1>
              </div>
            </div>
            
            {/* Student Summary */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">Due Amount</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">₹{totalPendingAmount}</p>
              </div>
              <div className="relative">
                <select className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 text-sm">
                  <option>School Admin</option>
                  <option>Admin 1</option>
                  <option>Admin 2</option>
                </select>
              </div>
            </div>
          </div>

          {/* Student Summary Bar */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/20 dark:border-slate-700/50 mb-6">
            <div className="flex items-center gap-4">
              <img
                src={student.photo || fallbackAvatarImage}
                alt={student.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = fallbackAvatarImage;
                }}
              />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{student.name}</h2>
                <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Hash className="w-4 h-4" />
                    {student.studentId}
                  </span>
                  <span className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {student.course}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {student.batch}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-2 shadow-lg border border-white/20 dark:border-slate-700/50">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg scale-105'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {/* Student Info Tab */}
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Profile Picture */}
              <div className="lg:col-span-1">
                <Card variant="elevated">
                  <div className="flex flex-col items-center p-6">
                    <img
                      src={student.photo || fallbackAvatarImage}
                      alt={student.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700 mb-4"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = fallbackAvatarImage;
                      }}
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Profile Picture</p>
                  </div>
                </Card>
              </div>

              {/* Center Column - Personal/Academic Info */}
              <div className="lg:col-span-1">
                <Card variant="elevated">
                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Personal Information</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Name</label>
                        <p className="text-gray-900 dark:text-white">{student.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Course</label>
                        <p className="text-gray-900 dark:text-white">{student.course}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Section</label>
                        <p className="text-gray-900 dark:text-white">{student.section}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Batch</label>
                        <p className="text-gray-900 dark:text-white">{student.batch}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          <Mail className="w-4 h-4" /> Email
                        </label>
                        <p className="text-gray-900 dark:text-white">{student.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          <Phone className="w-4 h-4" /> Contact
                        </label>
                        <p className="text-gray-900 dark:text-white">{student.contact}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" /> DOB
                        </label>
                        <p className="text-gray-900 dark:text-white">{student.dob}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Gender</label>
                        <p className="text-gray-900 dark:text-white">{student.gender}</p>
                      </div>
                      <div className="col-span-2">
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Parent Name</label>
                        <p className="text-gray-900 dark:text-white">{student.parentName}</p>
                      </div>
                      <div className="col-span-2">
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Parent PAN</label>
                        <p className="text-gray-900 dark:text-white">{student.parentPAN}</p>
                      </div>
                      <div className="col-span-2">
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          <MapPin className="w-4 h-4" /> Address
                        </label>
                        <p className="text-gray-900 dark:text-white">{student.address}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Applied Date</label>
                        <p className="text-gray-900 dark:text-white">{student.appliedDate}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Has Sibling</label>
                        <input
                          type="checkbox"
                          checked={student.hasSibling || false}
                          readOnly
                          className="w-4 h-4 text-blue-600"
                        />
                      </div>
                    </div>

                    {/* View Documents */}
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">View Documents</h4>
                      <div className="space-y-3">
                        {documents.map((doc, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                              <span className="text-sm font-medium text-gray-900 dark:text-white">{doc.type}</span>
                              {doc.status === 'uploaded' ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-500" />
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleViewDocument(doc.type)}
                                className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleReUploadDocument(doc.type)}
                                className="p-2 text-green-600 hover:text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                              >
                                <Upload className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-2">
                      <Button variant="success" onClick={handleSubmitFiles}>
                        Submit files
                      </Button>
                      <Button variant="secondary" icon={<Edit />} onClick={handleEditInfo}>
                        Edit Info
                      </Button>
                      <Button variant="primary" icon={<Key />} onClick={handleChangePassword}>
                        Change Password
                      </Button>
                      <Button 
                        variant={student.isEnabled ? "success" : "warning"} 
                        onClick={handleToggleEnabled}
                      >
                        {student.isEnabled ? 'Enabled' : 'Disabled'}
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Column - ID Card Preview */}
              <div className="lg:col-span-1">
                <Card variant="elevated">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-4">
                      Student ID Card
                    </h3>
                    <div className="bg-white rounded-xl shadow-xl border border-gray-300 overflow-hidden scale-90 origin-top">
                      {/* Card Header - Logo */}
                      <div className="bg-white py-6 px-4 flex justify-center border-b border-gray-200">
                        <img
                          src={logoImage}
                          alt="School Logo"
                          className="h-14 object-contain"
                        />
                      </div>
                      {/* Card Body */}
                      <div className="p-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={student.photo || fallbackAvatarImage}
                            alt={student.name}
                            className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = fallbackAvatarImage;
                            }}
                          />
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900">{student.name}</h4>
                            <p className="text-sm text-gray-600">{student.studentId}</p>
                            <p className="text-sm text-gray-600">{student.course} - {student.section}</p>
                            <p className="text-sm text-gray-600">{student.batch}</p>
                          </div>
                          <QrCode className="w-16 h-16 text-gray-400" />
                        </div>
                        <div className="text-center pt-2 border-t border-gray-200">
                          <p className="text-xs text-gray-500">ID Number: {student.registrationNumber || student.studentId}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button variant="primary" icon={<Download />} onClick={handleDownloadCard} fullWidth>
                        Download ID Card
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* View Attendance Tab */}
          {activeTab === 'attendance' && (
            <Card variant="elevated">
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Month</label>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      {months.map((month, idx) => (
                        <option key={idx} value={idx + 1}>{month}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Year</label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <Button variant="primary" onClick={handleViewAttendance}>
                      View
                    </Button>
                  </div>
                </div>

                {!attendanceData ? (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Click View to view the records</p>
                  </div>
                ) : (
                  <div className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Days</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{attendanceData.totalDays}</p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Present Days</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{attendanceData.presentDays}</p>
                      </div>
                      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Absent Days</p>
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">{attendanceData.absentDays}</p>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Percentage</p>
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{attendanceData.percentage}%</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Fee & Payments Tab */}
          {activeTab === 'fees' && (
            <div className="space-y-6">
              {/* Recent Transactions */}
              <Card variant="elevated">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Transactions</h3>
                    <div className="flex gap-2">
                      <Button variant="secondary" icon={<Printer />} size="sm">
                        Print
                      </Button>
                    </div>
                  </div>
                  <DataTable
                    data={recentTransactions}
                    columns={recentTransactionColumns}
                    searchConfig={{ placeholder: 'Search transactions...', searchFields: ['paymentFor', 'invoiceNo'] }}
                    paginationConfig={{ entriesPerPage: 10, showPagination: true }}
                  />
                </div>
              </Card>

              {/* Pending Transactions */}
              <Card variant="elevated">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Pending Transactions</h3>
                    <select
                      value={selectedBatch}
                      onChange={(e) => setSelectedBatch(e.target.value)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="Batch 2082">Batch 2082</option>
                      <option value="Batch 2083">Batch 2083</option>
                    </select>
                  </div>
                  <DataTable
                    data={pendingTransactions}
                    columns={pendingTransactionColumns}
                    searchConfig={{ placeholder: 'Search fees...', searchFields: ['feeName'] }}
                    paginationConfig={{ entriesPerPage: 10, showPagination: true }}
                  />
                  
                  {/* Total Fees Summary */}
                  <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Pending Amount</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{totalPendingAmount}</p>
                      </div>
                      {totalDueAmount > 0 && (
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Selected Total</p>
                          <p className="text-2xl font-bold text-red-600 dark:text-red-400">₹{totalDueAmount}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between items-center">
                    <Button variant="success" onClick={handlePayNow}>
                      Pay Now
                    </Button>
                    <Button variant="secondary" icon={<DollarSign />}>
                      Select Fee
                    </Button>
                  </div>
                </div>
              </Card>
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
    </div>
  );
};

export default StudentProfile;

