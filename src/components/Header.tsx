import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  return (
    <header className="bg-gray-900 text-white p-4 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link href="/">Prajwal Rao</Link>
        </div>
        <nav className="flex items-center space-x-4">
          <ul className="hidden md:flex space-x-8">
            <li><Link href="#about" className="hover:text-gray-400 transition-colors dark:hover:text-gray-600">About</Link></li>
            <li><Link href="#experience" className="hover:text-gray-400 transition-colors dark:hover:text-gray-600">Experience</Link></li>
            <li><Link href="#projects" className="hover:text-gray-400 transition-colors dark:hover:text-gray-600">Projects</Link></li>
            <li><Link href="#contact" className="hover:text-gray-400 transition-colors dark:hover:text-gray-600">Contact</Link></li>
          </ul>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};

export default Header;
