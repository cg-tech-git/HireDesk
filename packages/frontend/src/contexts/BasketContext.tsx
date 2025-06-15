import React, { createContext, useContext, useState, useEffect } from 'react';
import { Equipment, EquipmentWithRelations } from '@hiredesk/shared';
import toast from 'react-hot-toast';

export interface BasketItem {
  equipment: EquipmentWithRelations;
  startDate: string;
  endDate: string;
  duration: number;
  addedAt: Date;
}

interface BasketContextType {
  items: BasketItem[];
  addItem: (equipment: EquipmentWithRelations, startDate: string, endDate: string) => void;
  removeItem: (equipmentId: string) => void;
  updateItemDates: (equipmentId: string, startDate: string, endDate: string) => void;
  clearBasket: () => void;
  getItemCount: () => number;
  getTotalDays: () => number;
}

const BasketContext = createContext<BasketContextType | undefined>(undefined);

const BASKET_STORAGE_KEY = 'allaith_basket';

export const BasketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<BasketItem[]>([]);

  // Load basket from localStorage on mount
  useEffect(() => {
    try {
      const savedBasket = localStorage.getItem(BASKET_STORAGE_KEY);
      if (savedBasket) {
        const parsedBasket = JSON.parse(savedBasket);
        setItems(parsedBasket.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt),
        })));
      }
    } catch (error) {
      console.error('Error loading basket from storage:', error);
    }
  }, []);

  // Save basket to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(BASKET_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving basket to storage:', error);
    }
  }, [items]);

  const calculateDuration = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInMs = end.getTime() - start.getTime();
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24)) + 1;
    return diffInDays;
  };

  const addItem = (equipment: EquipmentWithRelations, startDate: string, endDate: string) => {
    // Check if item already exists
    const existingItem = items.find(item => item.equipment.id === equipment.id);
    if (existingItem) {
      toast.error('This equipment is already in your basket');
      return;
    }

    const duration = calculateDuration(startDate, endDate);
    const newItem: BasketItem = {
      equipment,
      startDate,
      endDate,
      duration,
      addedAt: new Date(),
    };

    setItems([...items, newItem]);
    toast.success(`${equipment.name} added to basket`);
  };

  const removeItem = (equipmentId: string) => {
    const item = items.find(item => item.equipment.id === equipmentId);
    if (item) {
      setItems(items.filter(item => item.equipment.id !== equipmentId));
      toast.success(`${item.equipment.name} removed from basket`);
    }
  };

  const updateItemDates = (equipmentId: string, startDate: string, endDate: string) => {
    const duration = calculateDuration(startDate, endDate);
    
    setItems(items.map(item => 
      item.equipment.id === equipmentId
        ? { ...item, startDate, endDate, duration }
        : item
    ));
    
    toast.success('Dates updated');
  };

  const clearBasket = () => {
    setItems([]);
    localStorage.removeItem(BASKET_STORAGE_KEY);
    toast.success('Basket cleared');
  };

  const getItemCount = () => items.length;

  const getTotalDays = () => items.reduce((total, item) => total + item.duration, 0);

  return (
    <BasketContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateItemDates,
        clearBasket,
        getItemCount,
        getTotalDays,
      }}
    >
      {children}
    </BasketContext.Provider>
  );
};

export const useBasket = () => {
  const context = useContext(BasketContext);
  if (context === undefined) {
    throw new Error('useBasket must be used within a BasketProvider');
  }
  return context;
}; 