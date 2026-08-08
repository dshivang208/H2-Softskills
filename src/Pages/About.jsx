import { Lightbulb, Users, ShieldCheck, Rocket, Smile, Star, Users2, Heart, Settings, Flag } from 'lucide-react';
import aboutHeroBg from '../assets/about-hero-bg.png';
import WhyChooseUs from '../components/WhyChooseUs';
import Leadership from '../components/about/Leadership';

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
  { icon: Rocket, value: '150+', label: 'Projects Delivered' },
  { icon: Smile, value: '80+', label: 'Happy Clients' },
  { icon: Star, value: '10+', label: 'Years of Experience' },
  { icon: Users2, value: '20+', label: 'Team Experts' },
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
      <section
        className="bg-[#010816] text-white pt-10 pb-24 px-6 lg:px-16 overflow-hidden relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${aboutHeroBg})` }}
      >
        <div className="absolute inset-0 bg-[#010816]/40 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Content */}
          <div className="max-w-2xl">
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
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-20 px-6 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-6">Our Journey</h2>
          <div className="max-w-3xl mb-12 space-y-5 text-slate-600 leading-relaxed">
            <p>
              H2 Softskills began with a simple conviction: that technology, applied with
              discipline and craftsmanship, could help ambitious businesses solve problems
              far bigger than their size. What started as a small, focused team taking on
              early web and software projects has since grown into a full-fledged digital
              solutions partner, trusted by founders, enterprises, and public-sector clients
              across multiple continents.
            </p>
            <p>
              Over the years, our practice has matured well beyond writing code. We have
              built cloud infrastructure that scales through unpredictable demand, shipped
              mobile products used by thousands of people daily, engineered CRM and
              automation systems that quietly save our clients hundreds of hours a month,
              and stood up AI-driven tools that turn raw data into decisions. Each engagement
              has sharpened our process, expanded our engineering bench, and reinforced a
              simple internal standard: ship work we would be proud to put our name on.
            </p>
            <p>
              Today, with 120+ projects delivered and a growing roster of long-term clients,
              H2 Softskills operates as a stable, process-driven partner rather than a
              vendor for a single project. We combine strategy, design, and engineering
              under one roof, so the businesses we work with get continuity — the same
              team that scopes the problem is the one that ships, supports, and evolves the
              solution long after launch.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl grid grid-cols-1 md:grid-cols-4">
            {stats.map(({ icon: Icon, value, label }, index) => (
              <div
                key={label}
                className={`relative p-8 flex flex-row items-center justify-center gap-5 border-b border-slate-200 md:border-b-0 last:border-b-0 ${
                  index !== stats.length - 1
                    ? "md:after:content-[''] md:after:absolute md:after:right-0 md:after:top-[12.5%] md:after:h-3/4 md:after:w-px md:after:bg-slate-200"
                    : ''
                }`}
              >
                <div className="text-[#2563eb]">
                  <Icon className="h-10 w-10" strokeWidth={1} />
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-[#00a572]">{value}</div>
                  <div className="text-sm text-slate-500 font-medium">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      {/* <section className="pb-24 px-6 lg:px-16 bg-white">
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
      </section> */}

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Leadership */}
      <Leadership />
    </main>
  );
}

export default About;