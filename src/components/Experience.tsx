import React from 'react';

const Skill = ({ name, level }: { name: string; level: string }) => (
  <article className="flex items-center space-x-4 p-2">
    <div className="w-4 h-4 bg-green-400 dark:bg-green-600 rounded-full flex-shrink-0"></div>
    <div>
      <h3 className="font-bold text-white dark:text-gray-800">{name}</h3>
      <p className="text-gray-400 dark:text-gray-600">{level}</p>
    </div>
  </article>
);

const Experience = () => {
  const mlSkills = [
    { name: 'Python', level: 'Experienced' },
    { name: 'PyTorch', level: 'Experienced' },
    { name: 'TensorFlow', level: 'Experienced' },
    { name: 'OpenCV', level: 'Experienced' },
    { name: 'Pandas', level: 'Intermediate' },
    { name: 'Plotly', level: 'Experienced' },
    { name: 'Matplotlib', level: 'Experienced' },
  ];

  const otherSkills = [
    { name: 'Shell Scripting', level: 'Experienced' },
    { name: 'Vim', level: 'Experienced' },
    { name: 'Git', level: 'Experienced' },
    { name: 'Docker', level: 'Intermediate' },
    { name: 'Blender', level: 'Intermediate' },
    { name: 'LaTeX', level: 'Experienced' },
    { name: 'MongoDB', level: 'Intermediate' },
  ];

  return (
    <section id="experience" className="py-20">
      <h2 className="text-4xl font-bold text-center mb-12">Experience</h2>
      <div className="flex flex-col md:flex-row gap-8 justify-center max-w-4xl mx-auto">
        <div className="border border-gray-700 bg-gray-800 dark:border-gray-300 dark:bg-white rounded-2xl p-8 flex-1 hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors">
          <h3 className="text-2xl font-bold text-center mb-6 text-white dark:text-gray-800">ML / AI</h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            {mlSkills.map(skill => <Skill key={skill.name} {...skill} />)}
          </div>
        </div>
        <div className="border border-gray-700 bg-gray-800 dark:border-gray-300 dark:bg-white rounded-2xl p-8 flex-1 hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors">
          <h3 className="text-2xl font-bold text-center mb-6 text-white dark:text-gray-800">Other</h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            {otherSkills.map(skill => <Skill key={skill.name} {...skill} />)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
