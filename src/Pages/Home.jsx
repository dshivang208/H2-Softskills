import Services from '../components/Services';
import Stats from '../components/Stats';
import VideoShowcase from '../components/VideoShowcase';
import FeaturedProjects from '../components/FeaturedProjects';
import TechStack from '../components/TechStack';
import OurProcess from '../components/OurProcess';
import WhyChooseUs from '../components/WhyChooseUs';
import Clients from '../components/Clients';
import Testimonials from '../components/Testimonials';
import CtaBanner from '../components/CtaBanner';
import heroGraphic from '../assets/hero-graphic.png';
import Leadership1 from '../components/about/Leadership';
import { ArrowRight, Play, Rocket, ShieldCheck, TrendingUp, Users } from 'lucide-react';

const trustBadges = [
  {
    icon: Rocket,
    color: '#38bdf8',
    title: 'Innovative',
    description: 'Future-focused solutions',
  },
  {
    icon: ShieldCheck,
    color: '#22d3ee',
    title: 'Reliable',
    description: 'Secure. Scalable. Dependable.',
  },
  {
    icon: TrendingUp,
    color: '#3b82f6',
    title: 'Results-Driven',
    description: 'Measurable impact that matters',
  },
  {
    icon: Users,
    color: '#a855f7',
    title: 'Client-Centric',
    description: 'Your success is our priority',
  },
];

function Home() {
  return (
    <>
      {/* Hero Section with Graphic set as Background Image */}
      <main
        className="relative w-full bg-[#020208] bg-contain bg-center bg-no-repeat text-white min-h-[60vh] lg:min-h-[calc(100vh-58px)] flex items-center"
        style={{ backgroundImage: `url(${heroGraphic})` }}
      >
        {/* Dark overlay for mobile readability */}
        <div className="absolute inset-0 bg-black/60 md:hidden z-0" />

        <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-4 md:py-6 lg:py-16">
          {/* Left aligned text content, matching the layout from the mockup */}
          <div className="max-w-xl md:max-w-2xl space-y-8 text-left">

            {/* Pill Tag */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/5 bg-emerald-500/5 px-3.5 py-1 text-xs font-semibold tracking-wider text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>INNOVATE</span>
              <span className="text-stone-600">•</span>
              <span>BUILD</span>
              <span className="text-stone-600">•</span>
              <span className="text-blue-500">GROW</span>
            </div>

            {/* Title Header */}
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] text-[#ffffff]">
              Building Future-Ready <br />
              Digital Solutions for <br />
              <span className="bg-gradient-to-r from-[#00b06b] to-[#0070b8] bg-clip-text text-transparent">
                Modern Businesses
              </span>
            </h1>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="/Services"
                className="group inline-flex items-center justify-center gap-2.5 rounded-lg bg-gradient-to-r from-blue-600 via-blue-500 to-[#00b06b] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/10 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span classname="text-xl">Explore Our Services</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>

              <a
                href="/Projects"
                className="group inline-flex items-center justify-center gap-3 rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>View Our Work</span>
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-stone-900 transition-transform duration-300 group-hover:scale-110">
                  <Play className="h-2.5 w-2.5 fill-current ml-0.5" />
                </div>
              </a>
            </div>

            {/* Trust Section */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 border-t border-white/5">
              {trustBadges.map(({ icon: Icon, color, title, description }) => (
                <div key={title} className="flex items-center gap-3 px-1 py-1">
                  <div
                    className="w-9 h-9 rounded-lg border flex items-center justify-center flex-shrink-0"
                    style={{ borderColor: `${color}40`, color }}
                  >
                    <Icon className="h-4 w-4" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{title}</p>
                    <p className="text-xs text-stone-400 leading-snug">{description}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </main>

      {/* What We Do / Services Section */}
      <Services />

      {/* Promo Video Showcase */}
      <VideoShowcase />

      {/* Featured Projects */}
      <FeaturedProjects />

      {/* Technologies We Work With */}
      <TechStack />

      {/* Our Process */}
      <OurProcess />

      {/* Why Choose Us */}
      <div className="pt-8 md:pt-12">
        <WhyChooseUs />
      </div>

      {/* Testimonials (admin-managed) */}
      <Testimonials />

      {/* Statistics Bar */}
      <Stats />

      {/* Our Clients */}
      <Clients />
      
      {/* Leadership Section */}
      <Leadership1 />

      {/* Call To Action Banner */}
      <CtaBanner />
    </>
  );
}

export default Home;