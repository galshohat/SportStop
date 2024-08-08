import React, { useEffect } from 'react';

const NoScrollWrapper = ({ children }) => {
  useEffect(() => {
    // Disable scrolling when this component is mounted
    document.body.style.overflow = 'hidden';

    // Re-enable scrolling when this component is unmounted
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return <div style={{ height: '100%' }}>{children}</div>;
};

export default NoScrollWrapper;