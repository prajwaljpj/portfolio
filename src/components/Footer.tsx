import React from 'react';

const Footer = () => {
  return (
    <footer className="py-8 border-t border-gray-800 dark:border-gray-300 mt-20">
      <p className="text-center text-gray-500 dark:text-gray-600">
        Copyright &#169; {new Date().getFullYear()} Prajwal Rao. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
