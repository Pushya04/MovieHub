import { useState, useEffect } from 'react';

const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    const debouncedResize = () => {
      let timeoutId;
      return () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(handleResize, 100);
      };
    };

    window.addEventListener('resize', debouncedResize());
    return () => window.removeEventListener('resize', debouncedResize());
  }, []);

  return { isMobile };
};

export default useResponsive;