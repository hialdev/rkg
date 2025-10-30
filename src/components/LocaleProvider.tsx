import React from 'react';
import { LocaleProvider as AppLocaleProvider } from '../contexts/LocaleContext';

interface LocaleProviderProps {
 children: React.ReactNode;
}

const LocaleProvider: React.FC<LocaleProviderProps> = ({ children }) => {
  return <AppLocaleProvider>{children}</AppLocaleProvider>;
};

export default LocaleProvider;
