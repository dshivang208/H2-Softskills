import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { fetchPublishedProjects } from '../lib/projectsApi';

const accentText = {
  primary: 'text-[#003594]',
  secondary: 'text-[#006c49]',
};

function ProjectCard({ project }) {
  return (
    <Link
      to={`/projects/${project.id}/case-study`}
      className="bg-white rounded-2xl overflow-hidden border border-[#e1e7ff] shadow-sm group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg block"
    >
      <div className="aspect-[16/10] bg-[#283044] overflow-hidden">
        <img
          alt={project.title}
          src={project.image}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-4">
        <h3 className="text-base font-bold text-[#131b2e] mb-0.5 font-['Hanken_Grotesk']">
          {project.title}
        </h3>
        <p
          className={`text-xs font-semibold mb-2 uppercase tracking-wider ${accentText[project.accent] || accentText.primary}`}
        >
          {project.tag}
        </p>
        <p className="text-[#434654] text-sm leading-relaxed line-clamp-2 mb-2">{project.description}</p>
        <div className="flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-widest text-[#006c49] opacity-0 group-hover:opacity-100 transition-opacity">
          <span>Explore Case Study</span>
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
        </div>
      </div>
    </Link>
  );
}

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    let ignore = false;
    fetchPublishedProjects()
      .then((data) => {
        if (!ignore) {
          setProjects(
            (data.projects || []).map((p) => ({
              id: p.id,
              title: p.title,
              tag: p.tag,
              accent: p.accent,
              description: p.description,
              image: p.image_url,
            }))
          );
        }
      })
      .catch(() => {
        // Fails silently — the grid just stays empty if the API is briefly down.
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const categories = useMemo(() => ['All', ...new Set(projects.map((project) => project.tag))], [projects]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return projects;
    return projects.filter((project) => project.tag === activeCategory);
  }, [projects, activeCategory]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 bg-[#faf8ff]">
      {/* Header Section */}
      <div className="mb-12">
        <p className="text-[#003594] font-bold text-sm tracking-widest uppercase mb-3 font-['Hanken_Grotesk']">
          Our Projects
        </p>
        <h1 className="text-3xl md:text-4xl font-bold mb-4 max-w-3xl leading-tight text-[#0f172a] font-['Hanken_Grotesk']">
          Work That Speaks
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#003594] to-[#006c49]">
            For Itself
          </span>
        </h1>
        <p className="text-[#434654] max-w-xl text-lg leading-relaxed">
          Here are some of the amazing projects we&apos;ve worked on for our clients.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-[#737685]">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading projects…
        </div>
      ) : (
        <>
          {/* Filter Bar — bleeds to the true screen edge and scrolls horizontally */}
          <div className="-mx-4 sm:-mx-6 lg:-mx-8 mb-16">
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar whitespace-nowrap px-4 sm:px-6 lg:px-8">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`flex-none px-4 py-1.5 rounded-full font-semibold text-xs sm:text-sm transition ${
                    activeCategory === category
                      ? 'bg-[#003594] text-white shadow-lg shadow-[#003594]/20'
                      : 'border border-[#c3c6d6] bg-white text-[#434654] hover:border-[#003594] hover:text-[#003594]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}

export default Projects;