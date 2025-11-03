import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

const Tooltip = ({ 
  children, 
  content, 
  position = 'top', 
  delay = 300,
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const timeoutRef = useRef(null);
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);

  const showTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    const updatePosition = () => {
      if (isVisible && triggerRef.current && tooltipRef.current) {
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        let top = 0;
        let left = 0;

        // Add viewport boundary checks
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Check if trigger is in a scrollable container
        const scrollableParent = triggerRef.current.closest('[style*="overflow"]');
        const scrollOffset = scrollableParent ? scrollableParent.scrollTop : 0;

        switch (position) {
          case 'top':
            top = triggerRect.top - tooltipRect.height - 8;
            left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
            // Ensure tooltip doesn't go off-screen
            if (left < 8) left = 8;
            if (left + tooltipRect.width > viewportWidth - 8) {
              left = viewportWidth - tooltipRect.width - 8;
            }
            // Adjust for scrollable containers
            if (scrollableParent && top < 0) {
              top = triggerRect.bottom + 8; // Show below instead
            }
            break;
          case 'bottom':
            top = triggerRect.bottom + 8;
            left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
            // Ensure tooltip doesn't go off-screen
            if (left < 8) left = 8;
            if (left + tooltipRect.width > viewportWidth - 8) {
              left = viewportWidth - tooltipRect.width - 8;
            }
            break;
          case 'left':
            top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
            left = triggerRect.left - tooltipRect.width - 8;
            // Ensure tooltip doesn't go off-screen
            if (top < 8) top = 8;
            if (top + tooltipRect.height > viewportHeight - 8) {
              top = viewportHeight - tooltipRect.height - 8;
            }
            break;
          case 'right':
            top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
            left = triggerRect.right + 8;
            // Ensure tooltip doesn't go off-screen
            if (top < 8) top = 8;
            if (top + tooltipRect.height > viewportHeight - 8) {
              top = viewportHeight - tooltipRect.height - 8;
            }
            break;
          default:
            break;
        }

        setCoords({ top, left });
      }
    };

    if (isVisible) {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        updatePosition();
      });
    }

    // Update position on scroll and resize
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isVisible, position]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!content || content.trim() === '') return children;

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      ref={triggerRef}
    >
      {children}
      
      {isVisible && createPortal(
        <div
          ref={tooltipRef}
          role="tooltip"
          style={{
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            zIndex: 999999,
          }}
          className={`
            fixed px-3 py-2 
            text-sm font-medium text-white 
            bg-gray-900 dark:bg-gray-700
            rounded-lg shadow-2xl
            whitespace-nowrap
            pointer-events-none
            transition-all duration-200 ease-out
            border border-gray-800 dark:border-gray-600
            backdrop-blur-sm
            transform transition-transform duration-200
            ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
          `}
        >
          {content}
          
          {/* Arrow */}
          <div
            className={`
              absolute w-2 h-2 
              bg-gray-900 dark:bg-gray-700
              border border-gray-800 dark:border-gray-600
              transform rotate-45
              ${position === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2' : ''}
              ${position === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2' : ''}
              ${position === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2' : ''}
              ${position === 'right' ? 'left-[-4px] top-1/2 -translate-y-1/2' : ''}
            `}
            style={{ zIndex: 999999 }}
          />
        </div>,
        document.body
      )}
    </div>
  );
};

export default Tooltip;

