import { useMemo, useState } from 'react';
import { projects } from '../components/FeaturedProjects';

const accentText = {
  primary: 'text-[#003594]',
  secondary: 'text-[#006c49]',
};

const categories = ['All', ...new Set(projects.map((project) => project.tag))];

function ProjectCard({ project }) {
  return (
    <article className="bg-white rounded-3xl overflow-hidden border border-[#e1e7ff] shadow-sm group transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
      <div className="aspect-[16/10] bg-[#283044] overflow-hidden">
        <img
          alt={project.title}
          src={project.image}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-8">
        <h3 className="text-2xl font-bold text-[#131b2e] mb-1 font-['Hanken_Grotesk']">
          {project.title}
        </h3>
        <p
          className={`text-sm font-semibold mb-4 uppercase tracking-wider ${accentText[project.accent]}`}
        >
          {project.tag}
        </p>
        <p className="text-[#434654] leading-relaxed">{project.description}</p>
      </div>
    </article>
  );
}

function Projects() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return projects;
    return projects.filter((project) => project.tag === activeCategory);
  }, [activeCategory]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 bg-[#faf8ff]">
      {/* Header Section */}
      <div className="mb-12">
        <p className="text-[#003594] font-bold text-sm tracking-widest uppercase mb-3 font-['JetBrains_Mono']">
          Our Projects
        </p>
        <h1 className="text-4xl md:text-6xl font-black text-[#131b2e] mb-6 leading-tight font-['Hanken_Grotesk']">
          Work That Speaks
          <br />
          For{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#003594] to-[#006c49]">
            Itself
          </span>
        </h1>
        <p className="text-[#434654] max-w-xl text-lg leading-relaxed">
          Here are some of the amazing projects we&apos;ve worked on for our clients.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-4 mb-16 justify-center md:justify-end">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`px-8 py-2.5 rounded-full font-semibold text-sm transition ${
              activeCategory === category
                ? 'bg-[#003594] text-white shadow-lg shadow-[#003594]/20'
                : 'border border-[#c3c6d6] bg-white text-[#434654] hover:border-[#003594] hover:text-[#003594]'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </main>
  );
}

export default Projects;