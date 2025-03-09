import { useEffect } from 'react';

export const useNotification = (
  showNotification: boolean,
  setShowNotification: React.Dispatch<React.SetStateAction<boolean>>
) => {
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showNotification, setShowNotification]);
};