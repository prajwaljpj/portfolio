import React from 'react';
import { projects, Project } from '@/data/projects';
import Image from 'next/image';

const ProjectCard = ({ project }: { project: Project }) => (
  <div className="border border-gray-700 bg-gray-800 dark:border-gray-300 dark:bg-white rounded-2xl p-6 text-center hover:border-gray-500 dark:hover:border-gray-500 transition-all duration-300 flex flex-col transform hover:-translate-y-1">
    <div className="relative w-full h-48 mb-6">
      <Image
        src={project.imageUrl}
        alt={project.title}
        fill
        className="object-cover rounded-lg"
      />
    </div>
    <h3 className="text-2xl font-bold mb-4 text-white dark:text-gray-800">{project.title}</h3>
    <div className="mt-auto">
      <a
        href={project.githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-gray-700 text-white dark:bg-gray-300 dark:text-gray-800 font-bold py-2 px-6 rounded-full hover:bg-white hover:text-gray-900 dark:hover:bg-gray-100 dark:hover:text-gray-900 transition-colors duration-300"
      >
        GitHub
      </a>
    </div>
  </div>
);

const Projects = () => {
  return (
    <section id="projects" className="py-20">
      <h2 className="text-4xl font-bold text-center mb-12">Projects</h2>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {projects.map(project => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </section>
  );
};

export default Projects;
