import { Lightbulb, Users, ShieldCheck, Rocket, Smile, Star, Users2, Heart, Settings, Flag } from 'lucide-react';
import logo1 from '../assets/logo1.png';

const heroFeatures = [
  {
    icon: Lightbulb,
    title: 'Innovation First',
    description: 'We use the latest technologies to build future-ready solutions.',
  },
  {
    icon: Users,
    title: 'Client Focused',
    description: "We prioritize our client's goals and deliver measurable results.",
  },
  {
    icon: ShieldCheck,
    title: 'Result Driven',
    description: 'Our solutions are designed to drive growth and productivity.',
  },
];

const stats = [
  { icon: Rocket, value: '120+', label: 'Projects Delivered' },
  { icon: Smile, value: '60+', label: 'Happy Clients' },
  { icon: Star, value: '5+', label: 'Years of Experience' },
  { icon: Users2, value: '30+', label: 'Team Experts' },
];

const values = [
  {
    icon: Heart,
    title: 'Integrity',
    description: 'We believe in transparency and building trust.',
  },
  {
    icon: Settings,
    title: 'Excellence',
    description: 'We are committed to delivering the highest quality.',
  },
  {
    icon: Users2,
    title: 'Collaboration',
    description: 'We work together to achieve great results.',
  },
  {
    icon: Flag,
    title: 'Innovation',
    description: 'We constantly explore new ideas and technologies.',
  },
];

function About() {
  return (
    <main className="min-h-screen flex flex-col justify-center">
      {/* Hero Section */}
      <section className="bg-[#010816] text-white pt-10 pb-20 px-6 lg:px-16 overflow-hidden relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="z-10">
            <span className="text-[#00ff88] font-bold text-xs pb-4 tracking-widest uppercase mb-4 block">
              About Us
            </span>
            <h1 className="text-5xl lg:text-4xl font-bold leading-tight mb-6">
              We Build Digital Solutions
              <br />
              That Drive <span className="about-gradient-text">Real Impact</span>
            </h1>
            <p className="text-slate-400 text-lg mb-12 max-w-lg leading-relaxed">
              H2 Softskills is a digital solutions company dedicated to helping businesses
              innovate, grow, and succeed in the digital world.
            </p>

            {/* Feature Icons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {heroFeatures.map(({ icon: Icon, title, description }) => (
                <div key={title} className="space-y-3">
                  <div className="w-10 h-10 border border-[#2563eb] rounded-full flex items-center justify-center text-[#2563eb]">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <h4 className="font-bold">{title}</h4>
                  <p className="text-xs text-slate-400">{description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content: Atomic Graphic */}
          <div className="relative flex justify-center items-center h-[500px]">
            {/* Background decorative glow */}
            <div className="absolute w-96 h-96 bg-[#2563eb]/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative w-full h-full flex items-center justify-center">
              {/* Central Nucleus (Logo) */}
              <div className="relative z-20 w-56 h-auto about-animate-glow">
                <img
                  src={logo1}
                  alt="H2 Softskills"
                  className="w-16 sm:w-20 md:w-24 lg:w-32 h-auto object-contain opacity-50 drop-shadow-[0_0_20px_rgba(0,255,136,0.25)] translate-x-4 md:translate-x-8"
                />
              </div>

              {/* Premium Orbital System */}
              <div className="about-orbit-container">
                {/* Outer Ring 1 */}
                <div className="about-orbit-ring w-[450px] h-[180px] rotate-[30deg] border-[#2563eb]/30">
                  <div className="about-electron-path about-path-1">
                    <div className="about-electron top-0 left-1/2 -translate-x-1/2 bg-[#2563eb] shadow-[0_0_15px_#2563eb]" />
                  </div>
                </div>
                {/* Middle Ring 2 */}
                <div className="about-orbit-ring w-[400px] h-[160px] rotate-[-45deg] border-[#00ff88]/30">
                  <div className="about-electron-path about-path-2">
                    <div className="about-electron top-0 left-1/2 -translate-x-1/2 bg-[#00ff88] shadow-[0_0_15px_#00ff88]" />
                  </div>
                </div>
                {/* Inner Ring 3 */}
                <div className="about-orbit-ring w-[350px] h-[140px] rotate-[90deg] border-white/20">
                  <div className="about-electron-path about-path-3">
                    <div className="about-electron top-0 left-1/2 -translate-x-1/2 bg-white shadow-[0_0_15px_#ffffff]" />
                  </div>
                </div>
                {/* Extra Fast Ring 4 */}
                <div className="about-orbit-ring w-[300px] h-[120px] rotate-[150deg] border-[#2563eb]/20">
                  <div className="about-electron-path about-path-4">
                    <div className="about-electron top-0 left-1/2 -translate-x-1/2 bg-[#2563eb] shadow-[0_0_10px_#2563eb]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-20 px-6 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-6">Our Journey</h2>
          <p className="text-slate-600 max-w-3xl mb-12 leading-relaxed">
            Founded with a passion for technology and a vision to empower businesses, H2
            Softskills has delivered 120+ successful projects across the globe. We combine
            strategy, creativity, and technology to build digital products that make a
            difference.
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="bg-slate-50 border border-slate-100 p-8 rounded-xl flex items-center gap-6"
              >
                <div className="text-[#2563eb]">
                  <Icon className="h-10 w-10" strokeWidth={1} />
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-slate-900">{value}</div>
                  <div className="text-sm text-slate-500 font-medium">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="pb-24 px-6 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="p-8 border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-[#2563eb] mb-6">
                  <Icon className="h-8 w-8" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;