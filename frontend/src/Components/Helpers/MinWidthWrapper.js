import React, { useEffect } from 'react';

const MinWidthWrapper = ({ children }) => {
  useEffect(() => {
    const bodyStyle = document.body.style;
    const htmlStyle = document.documentElement.style;

    bodyStyle.minWidth = '800px';
    htmlStyle.minWidth = '800px';

    return () => {
      bodyStyle.minWidth = '';
      htmlStyle.minWidth = '';
    };
  }, []);

  return <div style={{ minWidth: '800px' }}>{children}</div>;
};

export default MinWidthWrapper;