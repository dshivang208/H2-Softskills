import Navbar from './components/Navbar';
import Services from './components/Services';
import Stats from './components/Stats';
import FeaturedProjects from './components/FeaturedProjects';
import TechStack from './components/TechStack';
import OurProcess from './components/OurProcess';
import CtaBanner from './components/CtaBanner';
import Footer from './components/Footer';
import heroGraphic from './assets/hero-graphic.png';
import { ArrowRight, Play } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-800 antialiased">
      {/* Responsive Navbar */}
      <Navbar />

      {/* Hero Section with Graphic set as Background Image */}
      <main 
        className="relative w-full bg-[#020208] bg-contain bg-center bg-no-repeat text-white min-h-[calc(100vh-58px)] flex items-center"
        style={{ backgroundImage: `url(${heroGraphic})` }}
      >
        {/* Dark overlay for mobile readability */}
        <div className="absolute inset-0 bg-black/60 md:hidden z-0" />

        <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-16 md:py-24">
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
                href="#"
                className="group inline-flex items-center justify-center gap-2.5 rounded-lg bg-gradient-to-r from-blue-600 via-blue-500 to-[#00b06b] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/10 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span classname = "text-xl">Explore Our Services</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              
              <a
                href="#"
                className="group inline-flex items-center justify-center gap-3 rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>View Our Work</span>
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-stone-900 transition-transform duration-300 group-hover:scale-110">
                  <Play className="h-2.5 w-2.5 fill-current ml-0.5" />
                </div>
              </a>
            </div>

            {/* Trust Section */}
            <div className="space-y-4 pt-8 border-t border-white/5">
              <p className="text-sm font-medium text-white tracking-wide uppercase">
                Trusted by innovative companies worldwide
              </p>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-6 opacity-75">
                {/* Polygon Logo */}
                <div className="flex items-center gap-2 text-white">
                  <svg className="h-7 w-7 fill-current text-[#7B3FE4]" viewBox="0 0 24 24">
                    <path d="M12 .21L2.14 5.9v11.38L12 23.79l9.86-5.91V5.9L12 .21zm7.86 16.31l-7.86 4.71-7.86-4.71V6.98l7.86-4.71 7.86 4.71v9.54z" />
                    <path d="M12 5.5l-5.5 3.3v6.4l5.5 3.3 5.5-3.3v-6.4L12 5.5zm3.5 9.1l-3.5 2.1-3.5-2.1V9.8l3.5-2.1 3.5 2.1v4.8z" />
                  </svg>
                  <span className="font-semibold text-xl text-white tracking-tight">polygon</span>
                </div>

                {/* Binance Logo */}
                <div className="flex items-center gap-2 text-white">
                  <svg className="h-7 w-7 fill-current text-[#F0B90B]" viewBox="0 0 24 24">
                    <path d="M12 0l4.5 4.5L12 9 7.5 4.5 12 0zM4.5 7.5L9 12l-4.5 4.5L0 12l4.5-4.5zM12 15l4.5 4.5-4.5 4.5-4.5-4.5 4.5-4.5zm7.5-7.5L24 12l-4.5 4.5L15 12l4.5-4.5z" />
                  </svg>
                  <span className="font-semi-bold text-xl tracking-wider">BINANCE</span>
                </div>

                {/* AWS Logo */}
                <div className="flex items-center gap-2 text-[#ffffff]">
                  <span className="font-bold text-xl  lowercase tracking-tighter text-[#ffffff]">aws</span>
                </div>

                {/* Solana Logo */}
                <div className="flex items-center gap-1.5 text-white">
                  <svg className="h-5 w-auto fill-current" viewBox="0 0 327 274">
                    <path d="M37.2 273.6c-4.4 0-8.8-1.8-12-5.3L1.6 242.4c-2.1-2.4-2.1-6 0-8.4L33.7 197c3.2-3.6 7.6-5.3 12-5.3h280c4.4 0 8.8 1.8 12 5.3l23.6 25.9c2.1 2.4 2.1 6 0 8.4l-32.1 37c-3.2 3.6-7.6 5.3-12 5.3H37.2zM289.8.4c4.4 0 8.8 1.8 12 5.3l32.1 37c2.1 2.4 2.1 6 0 8.4l-32.1 37c-3.2 3.6-7.6 5.3-12 5.3H37.8c-4.4 0-8.8-1.8-12-5.3L2.2 62.2c-2.1-2.4-2.1-6 0-8.4L34.3 16.8C37.5 13.2 41.9 11.5 46.3 11.5h243.5M289.8 96.4c4.4 0 8.8 1.8 12 5.3l32.1 37c2.1 2.4 2.1 6 0 8.4l-32.1 37c-3.2 3.6-7.6 5.3-12 5.3H37.8c-4.4 0-8.8-1.8-12-5.3L2.2 158.2c-2.1-2.4-2.1-6 0-8.4l32.1-37c3.2-3.6 7.6-5.3 12-5.3h243.5z" fill="url(#solana-gradient)" />
                    <defs>
                      <linearGradient id="solana-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00FFA3" />
                        <stop offset="100%" stopColor="#DC1FFF" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="font-semi-bold text-xl tracking-wider uppercase">solana</span>
                </div>

                {/* Microsoft Logo */}
                <div className="flex items-center gap-2 text-white">
                  <div className="grid grid-cols-2 gap-0.7 w-6 h-6">
                    <div className="bg-[#F25022] w-2.5 h-2.5" />
                    <div className="bg-[#7FBA00] w-2.5 h-2.5" />
                    <div className="bg-[#00A4EF] w-2.5 h-2.5" />
                    <div className="bg-[#FFB900] w-2.5 h-2.5" />
                  </div>
                  <span className="font-semibold text-xl tracking-tight">Microsoft</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* What We Do / Services Section */}
      <Services />

      {/* Statistics Bar */}
      <Stats />

      {/* Featured Projects */}
      <FeaturedProjects />

      {/* Technologies We Work With */}
      <TechStack />

      {/* Our Process */}
      <OurProcess />

      {/* Call To Action Banner */}
      <CtaBanner />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;