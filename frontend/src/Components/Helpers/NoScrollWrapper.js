import React, { useEffect } from 'react';

const NoScrollWrapper = ({ children }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return <div style={{ height: '100%' }}>{children}</div>;
};

export default NoScrollWrapper;