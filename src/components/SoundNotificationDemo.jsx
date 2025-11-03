import React from 'react';
import { useSound } from '../context/SoundContext';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  Navigation, 
  FileText, 
  Download, 
  Upload, 
  LogIn, 
  LogOut,
  Settings,
  Volume2,
  VolumeX
} from 'lucide-react';

const SoundNotificationDemo = () => {
  const {
    soundEnabled,
    toggleSound,
    globalVolume,
    updateGlobalVolume,
    notificationTypes,
    toggleNotificationType,
    updateNotificationVolume,
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
    notifyNavigation,
    notifyFormSubmit,
    notifyExport,
    notifyImport,
    notifyLogin,
    notifyLogout
  } = useSound();

  const demoButtons = [
    {
      icon: <CheckCircle className="w-4 h-4" />,
      label: 'Success',
      onClick: () => notifySuccess('Operation completed successfully!'),
      color: 'bg-green-500 hover:bg-green-600',
      enabled: notificationTypes.success.enabled
    },
    {
      icon: <XCircle className="w-4 h-4" />,
      label: 'Error',
      onClick: () => notifyError('Something went wrong!'),
      color: 'bg-red-500 hover:bg-red-600',
      enabled: notificationTypes.error.enabled
    },
    {
      icon: <AlertTriangle className="w-4 h-4" />,
      label: 'Warning',
      onClick: () => notifyWarning('Please check your input!'),
      color: 'bg-yellow-500 hover:bg-yellow-600',
      enabled: notificationTypes.warning.enabled
    },
    {
      icon: <Info className="w-4 h-4" />,
      label: 'Info',
      onClick: () => notifyInfo('Here is some information!'),
      color: 'bg-blue-500 hover:bg-blue-600',
      enabled: notificationTypes.info.enabled
    },
    {
      icon: <Navigation className="w-4 h-4" />,
      label: 'Navigation',
      onClick: () => notifyNavigation('Navigating to dashboard'),
      color: 'bg-purple-500 hover:bg-purple-600',
      enabled: notificationTypes.navigation.enabled
    },
    {
      icon: <FileText className="w-4 h-4" />,
      label: 'Form Submit',
      onClick: () => notifyFormSubmit('User Registration Form'),
      color: 'bg-indigo-500 hover:bg-indigo-600',
      enabled: notificationTypes.form.enabled
    },
    {
      icon: <Download className="w-4 h-4" />,
      label: 'Export',
      onClick: () => notifyExport('Excel file'),
      color: 'bg-emerald-500 hover:bg-emerald-600',
      enabled: notificationTypes.export.enabled
    },
    {
      icon: <Upload className="w-4 h-4" />,
      label: 'Import',
      onClick: () => notifyImport('CSV file'),
      color: 'bg-orange-500 hover:bg-orange-600',
      enabled: notificationTypes.import.enabled
    },
    {
      icon: <LogIn className="w-4 h-4" />,
      label: 'Login',
      onClick: () => notifyLogin('admin@example.com'),
      color: 'bg-teal-500 hover:bg-teal-600',
      enabled: notificationTypes.login.enabled
    },
    {
      icon: <LogOut className="w-4 h-4" />,
      label: 'Logout',
      onClick: () => notifyLogout('admin@example.com'),
      color: 'bg-gray-500 hover:bg-gray-600',
      enabled: notificationTypes.logout.enabled
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Sound Notification Demo
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Test generalized sound notifications
            </p>
          </div>
        </div>
        
        <button
          onClick={toggleSound}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
            soundEnabled 
              ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          {soundEnabled ? 'Sound On' : 'Sound Off'}
        </button>
      </div>

      {/* Global Volume Control */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Global Volume: {Math.round(globalVolume * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={globalVolume}
          onChange={(e) => updateGlobalVolume(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
      </div>

      {/* Notification Type Controls */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Notification Types
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(notificationTypes).map(([type, config]) => (
            <div key={type} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                {type}
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={config.volume}
                  onChange={(e) => updateNotificationVolume(type, parseFloat(e.target.value))}
                  className="w-16 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
                />
                <button
                  onClick={() => toggleNotificationType(type)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                    config.enabled 
                      ? 'bg-green-500 text-white hover:bg-green-600' 
                      : 'bg-gray-300 text-gray-600 hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-400'
                  }`}
                >
                  {config.enabled ? '✓' : '✗'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Demo Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {demoButtons.map((button, index) => (
          <button
            key={index}
            onClick={button.onClick}
            disabled={!button.enabled}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl text-white font-medium transition-all duration-200 ${
              button.enabled 
                ? `${button.color} hover:scale-105 shadow-lg hover:shadow-xl` 
                : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed opacity-50'
            }`}
          >
            {button.icon}
            <span className="text-xs">{button.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-xs text-blue-700 dark:text-blue-300">
          <strong>Note:</strong> Your existing DataTable operations (add, edit, delete) will continue to work exactly as before. 
          These generalized notifications are additional features you can use throughout your application.
        </p>
      </div>
    </div>
  );
};

export default SoundNotificationDemo;
