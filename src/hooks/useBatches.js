import { useState, useCallback } from 'react';
import { useSound } from '../context/SoundContext';

/**
 * useBatches - Custom hook for batch management
 * @param {Array} initialBatches - Initial batches data
 * @returns {Object} Batch management state and handlers
 */
export const useBatches = (initialBatches = []) => {
  const { playNotificationSound } = useSound();
  const [batches, setBatches] = useState(initialBatches);

  /**
   * Add a new batch
   * @param {Object} newBatch - Batch data to add
   * @returns {Object} Created batch with generated ID
   */
  const addBatch = useCallback((newBatch) => {
    const createdBatch = {
      ...newBatch,
      id: Math.max(...batches.map(b => b.id), 0) + 1
    };
    
    setBatches(prev => [...prev, createdBatch]);
    playNotificationSound('add');
    
    return createdBatch;
  }, [batches, playNotificationSound]);

  /**
   * Update an existing batch
   * @param {Object} updatedBatch - Updated batch data
   * @returns {Object} Updated batch
   */
  const updateBatch = useCallback((updatedBatch) => {
    setBatches(prev => 
      prev.map(batch => 
        batch.id === updatedBatch.id ? updatedBatch : batch
      )
    );
    playNotificationSound('edit');
    
    return updatedBatch;
  }, [playNotificationSound]);

  /**
   * Delete a batch by ID
   * @param {number} batchId - ID of batch to delete
   * @returns {Object} Deleted batch
   */
  const deleteBatch = useCallback((batchId) => {
    const batchToDelete = batches.find(b => b.id === batchId);
    if (batchToDelete) {
      setBatches(prev => prev.filter(b => b.id !== batchId));
      playNotificationSound('delete');
    }
    
    return batchToDelete;
  }, [batches, playNotificationSound]);

  /**
   * Get batch by ID
   * @param {number} batchId - ID of batch to get
   * @returns {Object|null} Batch data or null if not found
   */
  const getBatchById = useCallback((batchId) => {
    return batches.find(batch => batch.id === batchId) || null;
  }, [batches]);

  /**
   * Get all batches
   * @returns {Array} All batches
   */
  const getAllBatches = useCallback(() => {
    return [...batches];
  }, [batches]);

  /**
   * Get active batches only
   * @returns {Array} Active batches
   */
  const getActiveBatches = useCallback(() => {
    return batches.filter(batch => batch.isActive);
  }, [batches]);

  /**
   * Get inactive batches only
   * @returns {Array} Inactive batches
   */
  const getInactiveBatches = useCallback(() => {
    return batches.filter(batch => !batch.isActive);
  }, [batches]);

  /**
   * Reset batches to initial state
   */
  const resetBatches = useCallback(() => {
    setBatches(initialBatches);
  }, [initialBatches]);

  return {
    // State
    batches,
    
    // Actions
    addBatch,
    updateBatch,
    deleteBatch,
    getBatchById,
    getAllBatches,
    getActiveBatches,
    getInactiveBatches,
    resetBatches,
    
    // Direct state setter (for advanced use cases)
    setBatches
  };
};

export default useBatches;
