import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Eye, Edit, Trash2, Download, BookOpen, BookPlus, BookCheck, Users } from 'lucide-react';
import { createPortal } from 'react-dom';

const ActionDropdown = ({ 
  actions = [], 
  item, 
  className = '',
  position = 'bottom-end' // bottom-start, bottom-end, top-start, top-end
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dynamicPosition, setDynamicPosition] = useState(position);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const [menuCoords, setMenuCoords] = useState({ top: 0, left: 0, alignEnd: true });
  const menuRef = useRef(null);
  const buttonRectRef = useRef(null);

  // Close dropdown when clicking outside and handle window resize
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !buttonRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleResize = () => {
      if (isOpen) {
        const optimalPosition = calculateOptimalPosition();
        setDynamicPosition(optimalPosition);
        updateMenuCoords(optimalPosition);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleResize, true);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
    };
  }, [isOpen]);

  const handleEscapeKey = (event) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      buttonRef.current?.focus();
    }
  };

  const calculateOptimalPosition = () => {
    if (!buttonRef.current) return position;
    
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const dropdownHeight = actions.length * 40 + 20; // Approximate dropdown height
    
    // Check if there's enough space below
    const spaceBelow = viewportHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;
    
    // If not enough space below but enough space above, position above
    if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
      if (position.includes('bottom')) {
        return position.replace('bottom', 'top');
      }
    }
    
    return position;
  };

  const updateMenuCoords = (pos) => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    buttonRectRef.current = rect;
    // Default: show to the LEFT side of the button, vertically centered
    const alignEnd = true; // using translateX(-100%) to anchor menu's right edge
    const top = rect.top + (rect.height / 2) + window.scrollY; // temp; adjusted precisely after measurement
    const left = rect.left + window.scrollX - 4; // slight gap
    setMenuCoords({ top, left, alignEnd });
  };

  const adjustWithMeasurements = () => {
    const el = menuRef.current;
    const btn = buttonRectRef.current;
    if (!el || !btn) return;

    const pad = 8;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Start with left-side, vertically centered position
    let top = btn.top + (btn.height - el.getBoundingClientRect().height) / 2 + window.scrollY;
    let left = btn.left + window.scrollX - 4; // right edge of menu at button's left
    let alignEnd = true; // menu grows to the left from button left edge

    const rect = el.getBoundingClientRect();

    // Clamp vertically within viewport
    const topLimit = window.scrollY + pad;
    const bottomLimit = window.scrollY + vh - pad;
    if (top + rect.height > bottomLimit) {
      top = Math.max(topLimit, bottomLimit - rect.height);
    }
    if (top < topLimit) top = topLimit;

    // Horizontal clamping / side switching
    const leftEdge = left - rect.width; // because we translateX(-100%)
    if (leftEdge < pad) {
      // Not enough space on the left; open on the RIGHT side of the button
      alignEnd = false; // no translateX(-100%)
      left = btn.right + window.scrollX + 4; // small gap on the right
      // If still overflowing right, clamp back to within viewport
      if (left + rect.width > window.scrollX + vw - pad) {
        left = Math.max(window.scrollX + pad, window.scrollX + vw - pad - rect.width);
      }
    }

    setMenuCoords({ top, left, alignEnd });
  };

  const handleToggle = () => {
    if (!isOpen) {
      // Calculate optimal position before opening
      const optimalPosition = calculateOptimalPosition();
      setDynamicPosition(optimalPosition);
      updateMenuCoords(optimalPosition);
    }
    setIsOpen(!isOpen);
  };

  const handleActionClick = (action) => {
    if (action.handler) {
      action.handler(item);
    }
    setIsOpen(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
    }
  };

  // getPositionClasses no longer used; using fixed coords via portal

  const getIcon = (actionType) => {
    switch (actionType) {
      case 'view':
        return <Eye className="w-4 h-4" />;
      case 'edit':
        return <Edit className="w-4 h-4" />;
      case 'delete':
        return <Trash2 className="w-4 h-4" />;
      case 'download':
        return <Download className="w-4 h-4" />;
      case 'assign':
        return <BookOpen className="w-4 h-4" />;
      case 'assignSyllabus':
        return <BookOpen className="w-4 h-4" />;
      case 'assignAdditional':
        return <BookPlus className="w-4 h-4" />;
      case 'assignOptional':
        return <BookCheck className="w-4 h-4" />;
      case 'manageStudents':
        return <Users className="w-4 h-4" />;
      default:
        return actionType.icon || <MoreVertical className="w-4 h-4" />;
    }
  };

  if (!actions || actions.length === 0) {
    return null;
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Action Button */}
      <button
        ref={buttonRef}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className="group relative flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        aria-label="Open action menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors duration-200" />
        
        {/* Hover effect */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </button>

      {/* Dropdown Menu via Portal */}
      {isOpen && createPortal(
        (
          <div
            ref={menuRef}
            className="z-[1000] bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1 animate-in fade-in-0 zoom-in-95 duration-200"
            style={{ position: 'fixed', top: menuCoords.top, left: menuCoords.left, transform: menuCoords.alignEnd ? 'translate(-100%, -50%)' : 'translate(0, -50%)', width: 'max-content', maxHeight: 'min(60vh, 320px)', overflowY: 'auto', boxShadow: '0 12px 28px rgba(0,0,0,0.18), 0 6px 12px rgba(0,0,0,0.12)' }}
            role="menu"
            aria-orientation="vertical"
          >
            {/* Subtle background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-xl pointer-events-none" />
            
            <div className="relative">
              {actions.map((action, index) => (
                <button
                  key={action.key || index}
                  onClick={() => handleActionClick(action)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700 first:rounded-t-xl last:rounded-b-xl"
                  role="menuitem"
                  tabIndex={-1}
                >
                  <div className={`flex-shrink-0 ${action.className || 'text-gray-600 dark:text-gray-400'}`}>
                    {getIcon(action.type || action.key)}
                  </div>
                  <span className="flex-1 text-left">{action.title}</span>
                  
                  {/* Hover indicator */}
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </button>
              ))}
            </div>
            
            {/* Subtle border accent */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />
          </div>
        ),
        document.body
      )}
    </div>
  );
};

export default ActionDropdown;
