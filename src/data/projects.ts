export interface Project {
  title: string;
  imageUrl: string;
  githubUrl: string;
}

export const projects: Project[] = [
  {
    title: "Decoder GPT",
    imageUrl: "/assets/transformers2.png",
    githubUrl: "https://github.com/prajwaljpj/mygpt",
  },
  {
    title: "Text-to-Speech",
    imageUrl: "/assets/speech_signal2.png",
    githubUrl: "https://github.com/prajwaljpj/text-to-speech",
  },
  {
    title: "Traffic Analytics",
    imageUrl: "/assets/traffic_analytics2.png",
    githubUrl: "https://github.com/prajwaljpj/VisTraSAS",
  },
  {
    title: "ML Basics",
    imageUrl: "/assets/machine_learning_basics2.png",
    githubUrl: "https://github.com/prajwaljpj/ML-basics-freecodecamp",
  },
];
