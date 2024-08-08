import React, { useEffect } from 'react';

const MinWidthWrapper = ({ children }) => {
  useEffect(() => {
    // Apply min-width style to prevent shrinking below 800px
    const bodyStyle = document.body.style;
    const htmlStyle = document.documentElement.style;

    bodyStyle.minWidth = '800px';
    htmlStyle.minWidth = '800px';

    // Clean up the styles when the component is unmounted
    return () => {
      bodyStyle.minWidth = '';
      htmlStyle.minWidth = '';
    };
  }, []);

  return <div style={{ minWidth: '800px' }}>{children}</div>;
};

export default MinWidthWrapper;