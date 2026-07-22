import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { fetchPublishedProjects } from '../lib/projectsApi';

const accentColors = {
  primary: { bg: 'rgba(0,74,198,0.2)', border: 'rgba(0,74,198,0.3)' },
  secondary: { bg: 'rgba(0,108,73,0.2)', border: 'rgba(0,108,73,0.3)' },
};

function ProjectCard({ project }) {
  const colors = accentColors[project.accent] || accentColors.primary;
  return (
    <Link
      to={`/projects/${project.id}/case-study`}
      className="flex-none w-[200px] md:w-[300px] snap-start bg-white border border-[#c3c6d7] rounded-t-[24px] rounded-b-xl overflow-hidden group/card cursor-pointer shadow-md hover:shadow-xl transition-all duration-500"
      data-purpose="project-card"
    >
      <div className="relative h-[120px] md:h-[150px] overflow-hidden">
        <img
          alt={project.title}
          className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-1000 ease-out"
          src={project.image}
        />
        <div className="absolute inset-0 bg-black/40 group-hover/card:bg-black/10 transition-colors duration-500" />
        <div className="absolute top-2.5 left-2.5">
          <span
            style={{ backgroundColor: colors.bg, borderColor: colors.border }}
            className="backdrop-blur-md border text-white text-[7px] font-bold px-2 py-0.5 rounded-full uppercase tracking-[0.1em]"
          >
            {project.tag}
          </span>
        </div>
      </div>
      <div className="p-3 md:p-4">
        <h3 className="font-['Hanken_Grotesk'] text-sm md:text-base font-bold mb-1.5 md:mb-2 transition-colors tracking-tight text-[#131b2e] group-hover/card:text-[#006c49]">
          {project.title}
        </h3>
        <p className="text-[#434655] text-xs md:text-sm leading-relaxed mb-3 md:mb-4 line-clamp-2">
          {project.description}
        </p>
        <div className="flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-widest group-hover/card:gap-3 transition-all text-[#006c49]">
          <span>Explore Case Study</span>
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedProjects() {
  const scrollerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

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
        // Fails silently — if the API is briefly down the section just
        // doesn't render rather than showing an error.
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const scrollByAmount = (direction) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: 'smooth' });
  };

  const scrollToIndex = (index) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.children[index];
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      setActiveIndex(index);
    }
  };

  if (loading) {
    return (
      <section className="pt-6 pb-8 md:pt-8 md:pb-16 px-6 md:px-12 max-w-[1440px] mx-auto">
        <div className="flex items-center justify-center py-16 text-[#737685]">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading projects…
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return null;
  }

  return (
    <section
      className="pt-6 pb-8 md:pt-8 md:pb-16 px-6 md:px-12 max-w-[1440px] mx-auto overflow-hidden"
      data-purpose="portfolio-showcase"
      id="featured-projects"
    >
      {/* Section Header */}
      <div className="mb-6 md:mb-8 ml-2 lg:ml-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-[1px] w-16 bg-[#004ac6]" />
          <span className="font-['Hanken_Grotesk'] text-[#004ac6] font-semibold text-sm tracking-[0.4em] uppercase">
            OUR WORK
          </span>
        </div>
        <h2 className="font-['Hanken_Grotesk'] text-2xl md:text-5xl font-semibold leading-tight tracking-tight text-[#131b2e]">
          Featured <span className="text-[#004ac6]">Projects</span>
        </h2>
      </div>

      {/* Carousel */}
      <div className="relative group" data-purpose="carousel-wrapper">
        {/* Navigation Buttons */}
        <div className="absolute inset-y-0 -left-2 md:-left-12 flex items-center z-20 pointer-events-none">
          <button
            type="button"
            aria-label="Previous project"
            onClick={() => scrollByAmount(-1)}
            className="pointer-events-auto w-12 h-12 md:w-14 md:h-14 bg-white backdrop-blur-xl rounded-full border border-[#c3c6d7] flex items-center justify-center hover:bg-[#eaedff] transition-all shadow-lg"
          >
            <ChevronLeft className="w-6 h-6 text-[#131b2e]" />
          </button>
        </div>
        <div className="absolute inset-y-0 -right-2 md:-right-12 flex items-center z-20 pointer-events-none">
          <button
            type="button"
            aria-label="Next project"
            onClick={() => scrollByAmount(1)}
            className="pointer-events-auto w-12 h-12 md:w-14 md:h-14 bg-white backdrop-blur-xl rounded-full border border-[#c3c6d7] flex items-center justify-center hover:bg-[#eaedff] transition-all shadow-lg"
          >
            <ChevronRight className="w-6 h-6 text-[#131b2e]" />
          </button>
        </div>

        {/* Carousel Track */}
        <div
          ref={scrollerRef}
          className="flex flex-nowrap gap-6 md:gap-8 overflow-x-auto pb-8 pt-4 no-scrollbar snap-x px-2 lg:px-4"
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center items-center gap-2.5 mt-4" data-purpose="carousel-dots">
          {projects.map((project, index) => (
            <button
              key={project.id}
              type="button"
              aria-label={`Go to ${project.title}`}
              onClick={() => scrollToIndex(index)}
              className={`rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? 'w-3 h-3 bg-[#004ac6]'
                  : 'w-2 h-2 bg-[#c3c6d7] hover:bg-[#737686]'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}