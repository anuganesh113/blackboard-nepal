import React, { useEffect, useRef } from 'react';
import { useGlobalNotifications } from './useGlobalNotifications';

/**
 * Global Notification Interceptor
 * Automatically captures and notifies about common operations across the app
 */
export const useNotificationInterceptor = () => {
  const notifications = useGlobalNotifications();
  const interceptorRef = useRef(null);

  useEffect(() => {
    // Create interceptor object
    interceptorRef.current = {
      // Intercept console methods for error/warning notifications
      interceptConsole: () => {
        const originalError = console.error;
        const originalWarn = console.warn;

        console.error = (...args) => {
          notifications.notifyError(args.join(' '));
          originalError.apply(console, args);
        };

        console.warn = (...args) => {
          notifications.notifyWarning(args.join(' '));
          originalWarn.apply(console, args);
        };

        return () => {
          console.error = originalError;
          console.warn = originalWarn;
        };
      },

      // Intercept fetch requests for API notifications
      interceptFetch: () => {
        const originalFetch = window.fetch;

        window.fetch = async (...args) => {
          try {
            const response = await originalFetch(...args);
            
            if (response.ok) {
              notifications.notifySuccess(`API request successful: ${response.status}`);
            } else {
              notifications.notifyError(`API request failed: ${response.status}`);
            }
            
            return response;
          } catch (error) {
            notifications.notifyError(`API request error: ${error.message}`);
            throw error;
          }
        };

        return () => {
          window.fetch = originalFetch;
        };
      },

      // Intercept localStorage operations
      interceptLocalStorage: () => {
        const originalSetItem = localStorage.setItem;
        const originalRemoveItem = localStorage.removeItem;

        localStorage.setItem = (key, value) => {
          notifications.notifyInfo(`Data saved: ${key}`);
          originalSetItem.call(localStorage, key, value);
        };

        localStorage.removeItem = (key) => {
          notifications.notifyInfo(`Data removed: ${key}`);
          originalRemoveItem.call(localStorage, key);
        };

        return () => {
          localStorage.setItem = originalSetItem;
          localStorage.removeItem = originalRemoveItem;
        };
      },

      // Intercept window events
      interceptWindowEvents: () => {
        const handleBeforeUnload = () => {
          notifications.notifyInfo('Page is being unloaded');
        };

        const handleOnline = () => {
          notifications.notifySuccess('Connection restored');
        };

        const handleOffline = () => {
          notifications.notifyWarning('Connection lost');
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
          window.removeEventListener('online', handleOnline);
          window.removeEventListener('offline', handleOffline);
        };
      },

      // Intercept form submissions
      interceptFormSubmissions: () => {
        const handleFormSubmit = (event) => {
          const form = event.target;
          const formName = form.name || form.id || 'Unknown Form';
          notifications.notifyFormSubmit(formName);
        };

        document.addEventListener('submit', handleFormSubmit);

        return () => {
          document.removeEventListener('submit', handleFormSubmit);
        };
      },

      // Intercept modal operations
      interceptModalOperations: () => {
        const handleModalOpen = (event) => {
          const modal = event.target;
          const modalName = modal.getAttribute('data-modal-name') || modal.id || 'Unknown Modal';
          notifications.notifyModalOpen(modalName);
        };

        const handleModalClose = (event) => {
          const modal = event.target;
          const modalName = modal.getAttribute('data-modal-name') || modal.id || 'Unknown Modal';
          notifications.notifyModalClose(modalName);
        };

        // Listen for custom modal events
        document.addEventListener('modal:open', handleModalOpen);
        document.addEventListener('modal:close', handleModalClose);

        return () => {
          document.removeEventListener('modal:open', handleModalOpen);
          document.removeEventListener('modal:close', handleModalClose);
        };
      },

      // Intercept file operations
      interceptFileOperations: () => {
        const handleFileUpload = (event) => {
          const files = event.target.files;
          if (files && files.length > 0) {
            notifications.notifyFileUpload(files[0].name);
          }
        };

        const handleFileDownload = (event) => {
          const link = event.target;
          if (link.tagName === 'A' && link.download) {
            notifications.notifyFileDownload(link.download);
          }
        };

        document.addEventListener('change', handleFileUpload);
        document.addEventListener('click', handleFileDownload);

        return () => {
          document.removeEventListener('change', handleFileUpload);
          document.removeEventListener('click', handleFileDownload);
        };
      }
    };

    // Start all interceptors
    const cleanupFunctions = [
      interceptorRef.current.interceptConsole(),
      interceptorRef.current.interceptFetch(),
      interceptorRef.current.interceptLocalStorage(),
      interceptorRef.current.interceptWindowEvents(),
      interceptorRef.current.interceptFormSubmissions(),
      interceptorRef.current.interceptModalOperations(),
      interceptorRef.current.interceptFileOperations()
    ];

    // Cleanup function
    return () => {
      cleanupFunctions.forEach(cleanup => {
        if (typeof cleanup === 'function') {
          cleanup();
        }
      });
    };
  }, [notifications]);

  return interceptorRef.current;
};

/**
 * Higher-order component that automatically applies notification interceptors
 * Wrap your app with this component to enable global notifications
 */
export const withNotificationInterceptor = (WrappedComponent) => {
  return function NotificationInterceptorWrapper(props) {
    useNotificationInterceptor();
    return <WrappedComponent {...props} />;
  };
};

export default useNotificationInterceptor;
