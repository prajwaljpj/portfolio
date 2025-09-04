import React from 'react';
import Image from 'next/image';

const Contact = () => {
  return (
    <section id="contact" className="py-20">
      <h2 className="text-4xl font-bold text-center mb-12">Get in Touch</h2>
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 max-w-2xl mx-auto">
        <div className="flex items-center space-x-4 border border-gray-700 bg-gray-800 dark:border-gray-300 dark:bg-white rounded-2xl p-6 hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors">
          <Image src="/assets/email.png" alt="Email" width={32} height={32} />
          <a href="mailto:prajwaljpj@gmail.com" className="text-lg text-white dark:text-gray-800 hover:underline">prajwaljpj@gmail.com</a>
        </div>
        <div className="flex items-center space-x-4 border border-gray-700 bg-gray-800 dark:border-gray-300 dark:bg-white rounded-2xl p-6 hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors">
          <Image src="/assets/linkedin.png" alt="LinkedIn" width={32} height={32} />
          <a href="https://www.linkedin.com/in/prajwalraojpj" target="_blank" rel="noopener noreferrer" className="text-lg text-white dark:text-gray-800 hover:underline">LinkedIn</a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
