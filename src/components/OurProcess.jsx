import { Search, Workflow, PenTool, Code2, Rocket } from 'lucide-react';

const steps = [
  {
    id: '01',
    title: 'Discover',
    description: 'We understand your business, goals, and audience with surgical precision.',
    icon: Search,
  },
  {
    id: '02',
    title: 'Plan',
    description: 'We analyze and create a strategic roadmap tailored to your technical needs.',
    icon: Workflow,
  },
  {
    id: '03',
    title: 'Design',
    description: 'We architect intuitive and engaging interfaces that drive conversion.',
    icon: PenTool,
  },
  {
    id: '04',
    title: 'Develop',
    description: 'We build scalable, high-performance engines with clean, robust code.',
    icon: Code2,
  },
  {
    id: '05',
    title: 'Deliver',
    description: 'We test, deploy and ensure continuous technical support and evolution.',
    icon: Rocket,
  },
];

function StepCard({ step, className = '' }) {
  const Icon = step.icon;
  return (
    <div
      className={`step-card rounded-xl p-4 flex flex-col min-h-[150px] ${className}`}
      data-purpose="process-step-card"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-green-500/60" />
        </div>
        <div className="w-6 h-6 rounded-md flex items-center justify-center bg-gradient-to-br from-[#00b06b] to-[#0070b8] shadow-md">
          <Icon className="w-3 h-3 text-white" strokeWidth={2} />
        </div>
      </div>
      <div className="mt-auto">
        <span className="font-['JetBrains_Mono'] text-[8px] text-[#ff8c00] mb-1 block tracking-widest uppercase">
          STEP {step.id}
        </span>
        <h3 className="font-['Hanken_Grotesk'] text-base font-bold text-white mb-1.5">
          {step.title}
        </h3>
        <p className="text-gray-400 text-[11px] leading-relaxed">{step.description}</p>
      </div>
    </div>
  );
}

export default function OurProcess() {
  const [step1, step2, step3, step4, step5] = steps;

  return (
    <section className="pt-6 pb-4 px-6 bg-[#FAF9F6]" data-purpose="our-process">
      {/* Section Header — sits on the normal page background */}
      <div className="max-w-7xl mx-auto text-center mb-8">
        <span className="font-['Hanken_Grotesk'] text-[15px] font-bold tracking-[0.3em] text-[#004ac6] uppercase mb-3 block">
          OUR PROCESS
        </span>
        <h2 className="font-['Hanken_Grotesk'] text-xl md:text-5xl font-black text-[#131b2e] leading-tight tracking-tight">
          <span className="text-black">Simple Steps</span>,{' '}
          <span className="text-[#006c49]">Powerful</span>{' '}
          <span className="text-[#004ac6]">Results</span>
        </h2>
      </div>

      {/* Rectangular black container — only the cards live inside this */}
      <div className="max-w-[1320px] mx-auto relative px-4 md:px-10 py-10 rounded-2xl bg-[#0a0a0c] overflow-hidden">
        {/* Animated connector wire */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-visible">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 600" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="wireGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor="#ff8c00" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#ff8c00" stopOpacity="1" />
                <stop offset="100%" stopColor="#ff8c00" stopOpacity="0.2" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur result="coloredBlur" stdDeviation="3" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              className="opacity-80 hidden md:block"
              d="M 160 120 C 240 120, 260 420, 330 420 S 420 120, 500 120 S 580 420, 660 420 S 750 120, 840 120"
              fill="none"
              filter="url(#glow)"
              stroke="url(#wireGradient)"
              strokeDasharray="8 8"
              strokeWidth="2"
            />
            <circle className="hidden md:block" fill="#ff8c00" filter="url(#glow)" r="5">
              <animateMotion
                dur="6s"
                path="M 160 120 C 240 120, 260 420, 330 420 S 420 120, 500 120 S 580 420, 660 420 S 750 120, 840 120"
                repeatCount="indefinite"
              />
            </circle>
            <circle className="hidden md:block" cx="160" cy="120" fill="#ff8c00" filter="url(#glow)" r="4" />
            <circle className="hidden md:block" cx="330" cy="420" fill="#ff8c00" filter="url(#glow)" r="4" />
            <circle className="hidden md:block" cx="500" cy="120" fill="#ff8c00" filter="url(#glow)" r="4" />
            <circle className="hidden md:block" cx="660" cy="420" fill="#ff8c00" filter="url(#glow)" r="4" />
            <circle className="hidden md:block" cx="840" cy="120" fill="#ff8c00" filter="url(#glow)" r="4" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col gap-6 md:gap-0">
          {/* Row 1: Steps 1, 3, 5 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-0 md:mb-6">
            <StepCard step={step1} />
            <StepCard step={step3} />
            <StepCard step={step5} />
          </div>
          {/* Row 2: Steps 2, 4 (offset between row 1 columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 md:px-20">
            <StepCard step={step2} className="md:translate-y-3" />
            <StepCard step={step4} className="md:translate-y-3" />
          </div>
        </div>
      </div>
    </section>
  );
}