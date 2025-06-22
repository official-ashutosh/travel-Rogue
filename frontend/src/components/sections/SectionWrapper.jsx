import React from 'react';

const SectionWrapper = ({ children, className = '', id = '' }) => {
  return (
    <section 
      id={id}
      className={`bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}
    >
      {children}
    </section>
  );
};

export default SectionWrapper;
