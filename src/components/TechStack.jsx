import { ArrowRight } from 'lucide-react';
import {
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiFlutter,
  SiTypescript,
  SiMongodb,
  SiPostgresql,
  SiTailwindcss,
} from 'react-icons/si';

// Real, modern brand marks via react-icons (Simple Icons set) instead of
// generic lucide icons. Note: Simple Icons dropped its AWS mark some time
// ago (Amazon trademark request), so AWS still uses a styled letter-badge.
const stackItems = [
  { name: 'React', icon: SiReact, color: '#149eca' },
  { name: 'Next.js', icon: SiNextdotjs, color: '#000000' },
  { name: 'Node.js', icon: SiNodedotjs, color: '#3c873a' },
  { name: 'React Native', icon: SiReact, color: '#149eca' },
  { name: 'Flutter', icon: SiFlutter, color: '#02569b' },
  { name: 'TypeScript', icon: SiTypescript, color: '#3178c6' },
  { name: 'MongoDB', icon: SiMongodb, color: '#10aa50' },
  { name: 'PostgreSQL', icon: SiPostgresql, color: '#336791' },
  { name: 'AWS', mono: 'aws', bg: '#131b2e' },
  { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06b6d4' },
];

function StackBadge({ item }) {
  const Icon = item.icon;
  return (
    <div
      className="flex items-center gap-3.5 shrink-0"
      data-purpose="tech-badge"
    >
      {Icon ? (
        <Icon className="w-8 h-8" style={{ color: item.color }} />
      ) : (
        <span
          className="flex items-center justify-center w-11 h-11 rounded-full text-white font-bold text-base"
          style={{ backgroundColor: item.bg }}
        >
          {item.mono}
        </span>
      )}
      <span className="font-['Hanken_Grotesk'] text-lg font-semibold text-[#131b2e] whitespace-nowrap">
        {item.name}
      </span>
    </div>
  );
}

export default function TechStack() {
  // Duplicate the list so the CSS animation can loop seamlessly from 0% to -50%.
  const marqueeItems = [...stackItems, ...stackItems];

  return (
    <section className="py-10 px-6 bg-white" data-purpose="tech-stack-strip">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <span className="font-['Hanken_Grotesk'] text-[17px] font-bold tracking-[0.15em] text-[#004ac6] uppercase">
            TECHNOLOGIES WE WORK WITH
          </span>
          <button
            type="button"
            className="group flex items-center gap-1.5 border border-[#c3c6d7] px-4 py-2 rounded-lg hover:bg-[#eaedff] transition-all text-sm font-semibold text-[#131b2e] shrink-0"
          >
            See All
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>


        {/* Auto-scrolling marquee (right to left), pauses on hover */}
        <div className="relative overflow-hidden marquee-mask">
          <div className="marquee-track flex items-center gap-16">
            {marqueeItems.map((item, index) => (
              <StackBadge key={`${item.name}-${index}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}