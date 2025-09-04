'use client';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-gray-900 text-white p-4 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link href="/">Prajwal Rao</Link>
        </div>
        <nav className="flex items-center space-x-4">
          <ul className="hidden md:flex space-x-8">
            <li><Link href="/#about" className="hover:text-gray-400 transition-colors dark:hover:text-gray-600">About</Link></li>
            <li><Link href="/#experience" className="hover:text-gray-400 transition-colors dark:hover:text-gray-600">Experience</Link></li>
            <li><Link href="/#projects" className="hover:text-gray-400 transition-colors dark:hover:text-gray-600">Projects</Link></li>
            <li><Link href="/notes" className="hover:text-gray-400 transition-colors dark:hover:text-gray-600">Notes</Link></li>
            <li><Link href="/#contact" className="hover:text-gray-400 transition-colors dark:hover:text-gray-600">Contact</Link></li>
          </ul>
          <ThemeToggle />
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </nav>
      </div>
      {isOpen && (
        <div className="md:hidden mt-4">
          <ul className="flex flex-col space-y-4">
            <li><Link href="/#about" onClick={() => setIsOpen(false)} className="block py-2 px-4 hover:bg-gray-700 rounded">About</Link></li>
            <li><Link href="/#experience" onClick={() => setIsOpen(false)} className="block py-2 px-4 hover:bg-gray-700 rounded">Experience</Link></li>
            <li><Link href="/#projects" onClick={() => setIsOpen(false)} className="block py-2 px-4 hover:bg-gray-700 rounded">Projects</Link></li>
            <li><Link href="/notes" onClick={() => setIsOpen(false)} className="block py-2 px-4 hover:bg-gray-700 rounded">Notes</Link></li>
            <li><Link href="/#contact" onClick={() => setIsOpen(false)} className="block py-2 px-4 hover:bg-gray-700 rounded">Contact</Link></li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;