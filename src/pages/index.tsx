import About from '@/components/About';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import FadeInWhenVisible from '@/components/FadeInWhenVisible';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section id="profile" className="text-center py-20">
        <div className="w-48 h-48 mx-auto mb-4 relative">
          <Image
            src="/assets/cropped-profile.png"
            alt="Prajwal Rao profile picture"
            fill
            className="rounded-full object-cover border-4 border-gray-700"
          />
        </div>
        <p className="text-xl text-gray-400">Hello, I'm</p>
        <h1 className="text-5xl md:text-6xl font-bold mt-2">Prajwal Rao</h1>
        <p className="text-2xl text-gray-300 mt-4">AI Engineer</p>
        <div className="mt-8 flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
          <a href="/assets/RESUME-Prajwal.pdf" target="_blank" className="bg-white text-gray-900 font-bold py-3 px-6 rounded-full hover:bg-gray-300 transition-transform transform hover:scale-105 w-full md:w-auto">
            Download CV
          </a>
          <Link href="#contact" className="border border-white text-white font-bold py-3 px-6 rounded-full hover:bg-white hover:text-gray-900 transition-transform transform hover:scale-105 w-full md:w-auto">
            Contact Info
          </Link>
        </div>
        <div className="mt-8 flex justify-center space-x-6">
          <a href="https://www.linkedin.com/in/prajwalraojpj/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
            <Image src="/assets/linkedin.png" alt="LinkedIn" width={32} height={32} />
          </a>
          <a href="https://github.com/prajwaljpj" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
            <Image src="/assets/github.png" alt="GitHub" width={32} height={32} />
          </a>
        </div>
      </section>

      <FadeInWhenVisible><About /></FadeInWhenVisible>
      <FadeInWhenVisible><Experience /></FadeInWhenVisible>
      <FadeInWhenVisible><Projects /></FadeInWhenVisible>
      <FadeInWhenVisible><Contact /></FadeInWhenVisible>
    </>
  );
}