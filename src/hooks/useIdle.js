import { useState, useEffect } from 'react';

export default function useIdle(delay = 2000) {
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    let timeoutId;

    const handleActivity = () => {
      setIsIdle(false);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setIsIdle(true), delay);
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'wheel'];
    
    events.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Initialize the timeout
    handleActivity();

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      clearTimeout(timeoutId);
    };
  }, [delay]);

  return isIdle;
}
