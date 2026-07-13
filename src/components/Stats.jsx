import { Fragment } from 'react';
import { Rocket, Smile, Star, Users, Trophy } from 'lucide-react';

const stats = [
  {
    id: 'projects',
    icon: Rocket,
    value: '120+',
    label: 'Projects Delivered',
    glow: 'drop-shadow(0 0 5px rgba(34,211,238,0.6))',
    color: '#22d3ee',
  },
  {
    id: 'clients',
    icon: Smile,
    value: '60+',
    label: 'Happy Clients',
    glow: 'drop-shadow(0 0 5px rgba(168,85,247,0.6))',
    color: '#a855f7',
  },
  {
    id: 'experience',
    icon: Star,
    value: '5+',
    label: 'Years of Experience',
    glow: 'drop-shadow(0 0 5px rgba(34,197,94,0.6))',
    color: '#22c55e',
    ringed: true,
  },
  {
    id: 'team',
    icon: Users,
    value: '30+',
    label: 'Team Experts',
    glow: 'drop-shadow(0 0 5px rgba(34,211,238,0.6))',
    color: '#60a5fa',
  },
  {
    id: 'satisfaction',
    icon: Trophy,
    value: '98%',
    label: 'Client Satisfaction',
    glow: 'drop-shadow(0 0 5px rgba(34,197,94,0.6))',
    color: '#22c55e',
  },
];

export default function Stats() {
  return (
    <section className="w-full pt-4 pb-12 px-4 bg-[#FAF9F6]">
      <div className="w-full max-w-7xl mx-auto" data-purpose="statistics-bar">
        <div className="stats-container bg-[#030409] rounded-2xl flex flex-wrap lg:flex-nowrap items-center justify-between px-8 p-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const iconStyle = stat.ringed
              ? { color: stat.color, filter: stat.glow, borderColor: stat.color }
              : { color: stat.color, filter: stat.glow };

            return (
              <Fragment key={stat.id}>
                <div
                  className="flex items-center flex-1 justify-center lg:justify-start px-4 gap-4 min-w-[200px]"
                  data-purpose="stat-item"
                >
                  <div
                    style={iconStyle}
                    className={stat.ringed ? 'border-2 rounded-full p-1' : undefined}
                  >
                    <Icon size={32} strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-white text-xl md:text-2xl font-bold leading-tight">
                      {stat.value}
                    </p>
                    <p className="text-gray-400 text-xs md:text-sm font-medium">
                      {stat.label}
                    </p>
                  </div>
                </div>
                {index < stats.length - 1 && (
                  <div className="hidden lg:block divider" />
                )}
              </Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}