import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { setCustomerDetails, addItem, clearPendingItem } from '@/store/quoteSlice';
import { CombinedQuoteModal } from './CombinedQuoteModal';
import { toast } from 'react-hot-toast';

export function QuoteManager() {
  const dispatch = useDispatch();
  const { customerDetails, pendingItem, items } = useSelector((state: RootState) => state.quote);
  
  const [showModal, setShowModal] = useState(false);

  // Clear customer details when starting a fresh quote (no existing items)
  useEffect(() => {
    if (pendingItem && items.length === 0 && customerDetails) {
      // Starting fresh quote but have old customer details - clear them
      dispatch(setCustomerDetails(null));
    }
  }, [pendingItem, items.length, customerDetails, dispatch]);

  // Watch for pending items - show modal when there's a pending item
  useEffect(() => {
    if (pendingItem) {
      setShowModal(true);
    }
  }, [pendingItem]);

  const handleModalSubmit = (data: { 
    customerDetails: any; 
    quoteData: { quantity: number; dates: any[] } 
  }) => {
    if (pendingItem) {
      // Save customer details if they're new
      if (!customerDetails) {
        dispatch(setCustomerDetails(data.customerDetails));
      }

      // Create the final quote item with all the data
      const finalQuoteItem = {
        ...pendingItem,
        quantity: data.quoteData.quantity,
        dates: data.quoteData.dates,
      };
      
      // Add to quote
      dispatch(addItem(finalQuoteItem));
      
      // Close modal
      setShowModal(false);
      
      toast.success('Item added to quote!');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    // Clear pending item if user cancels
    dispatch(clearPendingItem());
  };

  return (
    <>
      {/* Combined Quote Modal */}
      <CombinedQuoteModal
        open={showModal}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        selectedModel={pendingItem ? {
          id: Number(pendingItem.modelId) || 0,
          name: pendingItem.modelName,
          manufacturer: pendingItem.manufacturer,
        } : null}
        existingCustomerDetails={customerDetails}
      />
    </>
  );
} 