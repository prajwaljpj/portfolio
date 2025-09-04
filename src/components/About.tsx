
import Image from 'next/image';

const About = () => {
  return (
    <section id="about" className="py-20">
      <h2 className="text-4xl font-bold text-center mb-12">About Me</h2>
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16">
        <div className="w-64 h-64 md:w-80 md:h-80 relative flex-shrink-0">
          <Image
            src="/assets/IMG_7604.jpg"
            alt="Profile picture"
            fill
            className="rounded-2xl object-cover shadow-lg shadow-gray-800 dark:shadow-gray-300"
          />
        </div>
        <div className="md:w-1/2 text-lg text-gray-700 dark:text-gray-300 text-center md:text-left">
          <div className="flex flex-col md:flex-row gap-8 mb-8 justify-center">
            <div className="border border-gray-700 bg-gray-800 dark:border-gray-300 dark:bg-gray-800 rounded-2xl p-6 text-center flex-1 hover:bg-gray-700 dark:hover:bg-gray-700 transition-colors">
              <h3 className="text-xl font-bold mb-2 text-white dark:text-white">Experience</h3>
              <p className="text-gray-300 dark:text-gray-300">5+ years</p>
              <p className="text-gray-300 dark:text-gray-300">Machine Learning</p>
            </div>
            <div className="border border-gray-700 bg-gray-800 dark:border-gray-300 dark:bg-gray-800 rounded-2xl p-6 text-center flex-1 hover:bg-gray-700 dark:hover:bg-gray-700 transition-colors">
              <h3 className="text-xl font-bold mb-2 text-white dark:text-white">Education</h3>
              <p className="text-gray-300 dark:text-gray-300">Masters Degree</p>
              <p className="text-gray-300 dark:text-gray-300">Electrical & Computer Engineering</p>
            </div>
          </div>
          <p className="leading-relaxed">
            I am an experienced AI Engineer with a strong background in developing and deploying advanced machine learning systems. I hold a masters degree from Purdue University in electrical and computer engineering, and I am proficient in Python, PyTorch, Tensorflow, and other key tools. My work has consistently focused on improving system performance, accuracy, and efficiency, whether through developing speech interaction systems, optimizing object detection, or implementing voice cloning solutions. I am now seeking new opportunities to leverage my skills and experience in a dynamic and innovative environment.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
