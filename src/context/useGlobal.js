import { useContext } from 'react';
import { GlobalContext } from './GlobalContext';

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error(':(');
  return context;
};
