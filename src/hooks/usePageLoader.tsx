
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    
    // Simulate loading time between 1-2.5 seconds for a satisfying experience
    const loadingTime = Math.random() * 1500 + 1000;
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, loadingTime);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return isLoading;
};
