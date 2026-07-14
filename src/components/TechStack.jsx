import { Atom, Hexagon, Leaf, Database, Cloud, Container, Diamond, Feather, Plus } from 'lucide-react';

const techs = [
  { name: 'React', icon: Atom, color: '#149eca' },
  { name: 'Next.js', mono: 'N', bg: '#000000' },
  { name: 'Node.js', icon: Hexagon, color: '#3c873a' },
  { name: 'TypeScript', mono: 'TS', bg: '#3178c6' },
  { name: 'MongoDB', icon: Leaf, color: '#10aa50' },
  { name: 'PostgreSQL', icon: Database, color: '#336791' },
  { name: 'AWS', mono: 'aws', bg: '#131b2e' },
  { name: 'Docker', icon: Container, color: '#2496ed' },
  { name: 'Solidity', icon: Diamond, color: '#3c3c3d' },
  { name: 'Flutter', icon: Feather, color: '#02569b' },
];

function TechBadge({ tech }) {
  const Icon = tech.icon;
  return (
    <div
      className="flex items-center gap-2 bg-white border border-[#e2e4ec] rounded-full px-4 py-2.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
      data-purpose="tech-badge"
    >
      {Icon ? (
        <Icon className="w-4 h-4" style={{ color: tech.color }} strokeWidth={2.2} />
      ) : (
        <span
          className="flex items-center justify-center text-white font-bold rounded-md px-1.5 py-0.5 text-[10px] leading-none"
          style={{ backgroundColor: tech.bg }}
        >
          {tech.mono}
        </span>
      )}
      <span className="text-sm font-semibold font-['Hanken_Grotesk'] text-[#131b2e] whitespace-nowrap">
        {tech.name}
      </span>
    </div>
  );
}

export default function TechStack() {
  return (
    <section className="py-10 px-6 bg-white" data-purpose="tech-stack-strip">
      <div className="max-w-7xl mx-auto">
        <span className="font-['Hanken_Grotesk'] text-[17px] font-semibold tracking-[0.15em] text-[#004ac6] uppercase mb-5 block">
          TECHNOLOGIES WE WORK WITH
        </span>

        <div className="flex flex-wrap items-center gap-3">
          {techs.map((tech) => (
            <TechBadge key={tech.name} tech={tech} />
          ))}

          <div
            className="flex items-center gap-1.5 border border-dashed border-[#c3c6d7] rounded-full px-4 py-2.5 text-[#434655] hover:text-[#004ac6] hover:border-[#004ac6] transition-colors cursor-pointer"
            data-purpose="tech-more"
          >
            <Plus className="w-4 h-4" strokeWidth={2.2} />
            <span className="text-sm font-semibold">More</span>
          </div>
        </div>
      </div>
    </section>
  );
}