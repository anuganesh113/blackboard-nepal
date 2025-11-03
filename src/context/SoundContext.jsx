import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const SoundContext = createContext();

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};

export const SoundProvider = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    // Check localStorage for saved preference, default to true
    const saved = localStorage.getItem('soundEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Global notification settings
  const [globalVolume, setGlobalVolume] = useState(() => {
    const saved = localStorage.getItem('globalVolume');
    return saved !== null ? parseFloat(saved) : 0.1;
  });

  const [notificationTypes, setNotificationTypes] = useState(() => {
    const saved = localStorage.getItem('notificationTypes');
    return saved ? JSON.parse(saved) : {
      success: { enabled: true, volume: 0.1 },
      error: { enabled: true, volume: 0.1 },
      warning: { enabled: true, volume: 0.1 },
      info: { enabled: true, volume: 0.1 },
      navigation: { enabled: true, volume: 0.05 },
      form: { enabled: true, volume: 0.05 },
      export: { enabled: true, volume: 0.1 },
      import: { enabled: true, volume: 0.1 },
      login: { enabled: true, volume: 0.1 },
      logout: { enabled: true, volume: 0.1 }
    };
  });

  // Audio context management
  const audioContextRef = useRef(null);
  const isInitializedRef = useRef(false);

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('soundEnabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('globalVolume', globalVolume.toString());
  }, [globalVolume]);

  useEffect(() => {
    localStorage.setItem('notificationTypes', JSON.stringify(notificationTypes));
  }, [notificationTypes]);

  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  const updateGlobalVolume = (volume) => {
    setGlobalVolume(Math.max(0, Math.min(1, volume)));
  };

  const toggleNotificationType = (type) => {
    setNotificationTypes(prev => ({
      ...prev,
      [type]: { ...prev[type], enabled: !prev[type].enabled }
    }));
  };

  const updateNotificationVolume = (type, volume) => {
    setNotificationTypes(prev => ({
      ...prev,
      [type]: { ...prev[type], volume: Math.max(0, Math.min(1, volume)) }
    }));
  };

  // Initialize audio context on first user interaction
  const initializeAudioContext = useCallback(async () => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }
        isInitializedRef.current = true;
      } catch (error) {
        console.warn('Could not initialize audio context:', error);
        return null;
      }
    }
    return audioContextRef.current;
  }, []);

  // Enhanced sound creation with generalized notification support
  const createNotificationSound = useCallback(async (type) => {
    if (!soundEnabled) return;

    // Check if this is a generalized notification type
    const isGeneralizedType = notificationTypes[type];
    if (isGeneralizedType && !isGeneralizedType.enabled) return;

    try {
      const audioContext = await initializeAudioContext();
      if (!audioContext) return;

      // Ensure audio context is running
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

      const currentTime = audioContext.currentTime;
      const volume = isGeneralizedType 
        ? isGeneralizedType.volume * globalVolume 
        : globalVolume;

    // Different sound patterns for different operations
    switch (type) {
        // Original DataTable operations (keep existing behavior)
      case 'add':
          oscillator.frequency.setValueAtTime(440, currentTime); // A4
          oscillator.frequency.setValueAtTime(554.37, currentTime + 0.1); // C#5
          oscillator.frequency.setValueAtTime(659.25, currentTime + 0.2); // E5
        oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0, currentTime);
          gainNode.gain.linearRampToValueAtTime(volume, currentTime + 0.05);
          gainNode.gain.linearRampToValueAtTime(0, currentTime + 0.4);
          oscillator.start(currentTime);
          oscillator.stop(currentTime + 0.4);
        break;

      case 'edit':
          oscillator.frequency.setValueAtTime(523.25, currentTime); // C5
          oscillator.frequency.setValueAtTime(659.25, currentTime + 0.15); // E5
        oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0, currentTime);
          gainNode.gain.linearRampToValueAtTime(volume, currentTime + 0.05);
          gainNode.gain.linearRampToValueAtTime(0, currentTime + 0.35);
          oscillator.start(currentTime);
          oscillator.stop(currentTime + 0.35);
        break;

      case 'delete':
          oscillator.frequency.setValueAtTime(523.25, currentTime); // C5
          oscillator.frequency.setValueAtTime(440, currentTime + 0.1); // A4
          oscillator.frequency.setValueAtTime(349.23, currentTime + 0.2); // F4
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0, currentTime);
          gainNode.gain.linearRampToValueAtTime(volume, currentTime + 0.05);
          gainNode.gain.linearRampToValueAtTime(0, currentTime + 0.4);
          oscillator.start(currentTime);
          oscillator.stop(currentTime + 0.4);
          break;

        // New generalized notification types
        case 'success':
          oscillator.frequency.setValueAtTime(523.25, currentTime); // C5
          oscillator.frequency.setValueAtTime(659.25, currentTime + 0.1); // E5
          oscillator.frequency.setValueAtTime(783.99, currentTime + 0.2); // G5
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0, currentTime);
          gainNode.gain.linearRampToValueAtTime(volume, currentTime + 0.05);
          gainNode.gain.linearRampToValueAtTime(0, currentTime + 0.5);
          oscillator.start(currentTime);
          oscillator.stop(currentTime + 0.5);
          break;

        case 'error':
          oscillator.frequency.setValueAtTime(349.23, currentTime); // F4
          oscillator.frequency.setValueAtTime(311.13, currentTime + 0.1); // D#4
          oscillator.frequency.setValueAtTime(277.18, currentTime + 0.2); // C#4
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0, currentTime);
          gainNode.gain.linearRampToValueAtTime(volume, currentTime + 0.05);
          gainNode.gain.linearRampToValueAtTime(0, currentTime + 0.6);
          oscillator.start(currentTime);
          oscillator.stop(currentTime + 0.6);
          break;

        case 'warning':
          oscillator.frequency.setValueAtTime(440, currentTime); // A4
          oscillator.frequency.setValueAtTime(440, currentTime + 0.2); // A4
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0, currentTime);
          gainNode.gain.linearRampToValueAtTime(volume, currentTime + 0.05);
          gainNode.gain.linearRampToValueAtTime(0, currentTime + 0.1);
          gainNode.gain.linearRampToValueAtTime(volume, currentTime + 0.25);
          gainNode.gain.linearRampToValueAtTime(0, currentTime + 0.4);
          oscillator.start(currentTime);
          oscillator.stop(currentTime + 0.4);
          break;

        case 'info':
          oscillator.frequency.setValueAtTime(523.25, currentTime); // C5
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0, currentTime);
          gainNode.gain.linearRampToValueAtTime(volume, currentTime + 0.05);
          gainNode.gain.linearRampToValueAtTime(0, currentTime + 0.3);
          oscillator.start(currentTime);
          oscillator.stop(currentTime + 0.3);
          break;

        case 'navigation':
          oscillator.frequency.setValueAtTime(659.25, currentTime); // E5
          oscillator.frequency.setValueAtTime(523.25, currentTime + 0.1); // C5
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0, currentTime);
          gainNode.gain.linearRampToValueAtTime(volume, currentTime + 0.05);
          gainNode.gain.linearRampToValueAtTime(0, currentTime + 0.25);
          oscillator.start(currentTime);
          oscillator.stop(currentTime + 0.25);
          break;

        case 'form':
          oscillator.frequency.setValueAtTime(440, currentTime); // A4
          oscillator.frequency.setValueAtTime(554.37, currentTime + 0.1); // C#5
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0, currentTime);
          gainNode.gain.linearRampToValueAtTime(volume, currentTime + 0.05);
          gainNode.gain.linearRampToValueAtTime(0, currentTime + 0.2);
          oscillator.start(currentTime);
          oscillator.stop(currentTime + 0.2);
          break;

        case 'export':
          oscillator.frequency.setValueAtTime(523.25, currentTime); // C5
          oscillator.frequency.setValueAtTime(659.25, currentTime + 0.1); // E5
          oscillator.frequency.setValueAtTime(783.99, currentTime + 0.2); // G5
          oscillator.frequency.setValueAtTime(1046.50, currentTime + 0.3); // C6
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0, currentTime);
          gainNode.gain.linearRampToValueAtTime(volume, currentTime + 0.05);
          gainNode.gain.linearRampToValueAtTime(0, currentTime + 0.6);
          oscillator.start(currentTime);
          oscillator.stop(currentTime + 0.6);
          break;

        case 'import':
          oscillator.frequency.setValueAtTime(1046.50, currentTime); // C6
          oscillator.frequency.setValueAtTime(783.99, currentTime + 0.1); // G5
          oscillator.frequency.setValueAtTime(659.25, currentTime + 0.2); // E5
          oscillator.frequency.setValueAtTime(523.25, currentTime + 0.3); // C5
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0, currentTime);
          gainNode.gain.linearRampToValueAtTime(volume, currentTime + 0.05);
          gainNode.gain.linearRampToValueAtTime(0, currentTime + 0.6);
          oscillator.start(currentTime);
          oscillator.stop(currentTime + 0.6);
          break;

        case 'login':
          oscillator.frequency.setValueAtTime(440, currentTime); // A4
          oscillator.frequency.setValueAtTime(554.37, currentTime + 0.1); // C#5
          oscillator.frequency.setValueAtTime(659.25, currentTime + 0.2); // E5
          oscillator.frequency.setValueAtTime(783.99, currentTime + 0.3); // G5
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0, currentTime);
          gainNode.gain.linearRampToValueAtTime(volume, currentTime + 0.05);
          gainNode.gain.linearRampToValueAtTime(0, currentTime + 0.7);
          oscillator.start(currentTime);
          oscillator.stop(currentTime + 0.7);
          break;

        case 'logout':
          oscillator.frequency.setValueAtTime(783.99, currentTime); // G5
          oscillator.frequency.setValueAtTime(659.25, currentTime + 0.1); // E5
          oscillator.frequency.setValueAtTime(554.37, currentTime + 0.2); // C#5
          oscillator.frequency.setValueAtTime(440, currentTime + 0.3); // A4
        oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0, currentTime);
          gainNode.gain.linearRampToValueAtTime(volume, currentTime + 0.05);
          gainNode.gain.linearRampToValueAtTime(0, currentTime + 0.7);
          oscillator.start(currentTime);
          oscillator.stop(currentTime + 0.7);
        break;

      default:
        // Default notification sound
          oscillator.frequency.setValueAtTime(440, currentTime);
        oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0, currentTime);
          gainNode.gain.linearRampToValueAtTime(volume, currentTime + 0.05);
          gainNode.gain.linearRampToValueAtTime(0, currentTime + 0.3);
          oscillator.start(currentTime);
          oscillator.stop(currentTime + 0.3);
      }
    } catch (error) {
      console.warn('Could not play notification sound:', error);
    }
  }, [soundEnabled, notificationTypes, globalVolume, initializeAudioContext]);

  const playNotificationSound = useCallback((type) => {
    createNotificationSound(type);
  }, [createNotificationSound]);

  // Generalized notification functions
  const notifySuccess = useCallback((message) => {
    playNotificationSound('success');
    console.log('✅ Success:', message);
  }, [playNotificationSound]);

  const notifyError = useCallback((message) => {
    playNotificationSound('error');
    console.error('❌ Error:', message);
  }, [playNotificationSound]);

  const notifyWarning = useCallback((message) => {
    playNotificationSound('warning');
    console.warn('⚠️ Warning:', message);
  }, [playNotificationSound]);

  const notifyInfo = useCallback((message) => {
    playNotificationSound('info');
    console.info('ℹ️ Info:', message);
  }, [playNotificationSound]);

  const notifyNavigation = useCallback((route) => {
    playNotificationSound('navigation');
    console.log('🧭 Navigation:', route);
  }, [playNotificationSound]);

  const notifyFormSubmit = useCallback((formName) => {
    playNotificationSound('form');
    console.log('📝 Form submitted:', formName);
  }, [playNotificationSound]);

  const notifyExport = useCallback((format) => {
    playNotificationSound('export');
    console.log('📤 Export:', format);
  }, [playNotificationSound]);

  const notifyImport = useCallback((format) => {
    playNotificationSound('import');
    console.log('📥 Import:', format);
  }, [playNotificationSound]);

  const notifyLogin = useCallback((user) => {
    playNotificationSound('login');
    console.log('🔐 Login:', user);
  }, [playNotificationSound]);

  const notifyLogout = useCallback((user) => {
    playNotificationSound('logout');
    console.log('🚪 Logout:', user);
  }, [playNotificationSound]);

  const value = {
    // Original DataTable functionality (kept intact)
    soundEnabled,
    toggleSound,
    setSoundEnabled,
    playNotificationSound,
    
    // New generalized notification system
    globalVolume,
    updateGlobalVolume,
    notificationTypes,
    toggleNotificationType,
    updateNotificationVolume,
    
    // Generalized notification functions
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
  };

  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  );
};
