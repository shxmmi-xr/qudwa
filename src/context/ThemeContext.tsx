import React from 'react';
import { useData } from './DataContext';

// Backwards-compatible proxy hook
export const useTheme = () => {
  const data = useData();
  return {
    currentTheme: data.currentTheme,
    setThemePreset: data.setThemePreset,
    setCustomColors: data.setCustomColors,
    brand: data.brand,
    updateBrand: data.updateBrand,
    resetToDefaults: data.resetAllToDefaults,
  };
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};
