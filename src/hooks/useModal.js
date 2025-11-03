import { useState, useCallback } from 'react';

/**
 * useModal - Custom hook for modal state management
 * @param {Object} options - Modal options
 * @returns {Object} Modal state and handlers
 */
export const useModal = (options = {}) => {
  const {
    initialOpen = false,
    initialMode = 'create',
    initialData = null
  } = options;

  const [isOpen, setIsOpen] = useState(initialOpen);
  const [mode, setMode] = useState(initialMode);
  const [data, setData] = useState(initialData);

  const openModal = useCallback((modalMode = 'create', modalData = null) => {
    setMode(modalMode);
    setData(modalData);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setMode('create');
    setData(null);
  }, []);

  const openCreateModal = useCallback(() => {
    openModal('create');
  }, [openModal]);

  const openEditModal = useCallback((editData) => {
    openModal('edit', editData);
  }, [openModal]);

  const openViewModal = useCallback((viewData) => {
    openModal('view', viewData);
  }, [openModal]);

  return {
    isOpen,
    mode,
    data,
    openModal,
    closeModal,
    openCreateModal,
    openEditModal,
    openViewModal,
    setIsOpen,
    setMode,
    setData
  };
};

export default useModal;
