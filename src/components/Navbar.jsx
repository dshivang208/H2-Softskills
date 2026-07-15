import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import logo from '../assets/logo.png';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Items with a `to` are real routes (react-router Link).
  // Items with only `href` are placeholder anchors until those pages exist.
  const navItems = [
    { name: 'Home', to: '/' },
    { name: 'About Us', to: '/about' },
    { name: 'Services', to: '/services' },
    { name: 'Projects', to: '/projects' },
    { name: 'Blog', to: '/blog' },
    { name: 'Contact', to: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-stone-200/80 bg-[#FAF9F6]/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo on the Left */}
          <div className="flex flex-shrink-0 items-center">
            <a href="/" className="flex items-center">
             <img
  src={logo}
  alt="H2 Softskills Logo"
  className="pt-2 h-24 sm:h-28 md:h-36 lg:h-40 w-auto object-contain transition-transform duration-300 hover:scale-105"
/>
            </a>
          </div>

          {/* Desktop Navigations in the Middle */}
          <div className="hidden md:flex md:items-center md:gap-x-8">
            {navItems.map((item) =>
              item.to ? (
                <Link
                  key={item.name}
                  to={item.to}
                  className="relative text-[16px] font-medium text-black transition-colors duration-300 hover:text-stone-900 group"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#00b06b] transition-all duration-300 group-hover:w-full" />
                </Link>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  className="relative text-[16px] font-medium text-black transition-colors duration-300 hover:text-stone-900 group"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#00b06b] transition-all duration-300 group-hover:w-full" />
                </a>
              )
            )}
          </div>

          {/* Call-to-action Button on the Right */}
          <div className="hidden md:flex md:items-center">
            <a
              href="/contact"
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-[#00b06b] to-[#004e92] px-10 py-2 text-base font-semibold text-white shadow-md shadow-emerald-500/10 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Lets Build Together</span>
              <ArrowRight className="h-4.0 w-4.0 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>

          {/* Mobile hamburger menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center rounded-lg p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500/30"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6 transition-transform duration-300 rotate-90" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6 transition-transform duration-300" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Slide Down */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
        id="mobile-menu"
      >
        <div className="space-y-1 px-4 pb-6 pt-3 border-t border-stone-200/60 bg-[#FAF9F6] shadow-inner">
          {navItems.map((item) =>
            item.to ? (
              <Link
                key={item.name}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className="block rounded-lg px-4 py-3 text-base font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors duration-200"
              >
                {item.name}
              </Link>
            ) : (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-lg px-4 py-3 text-base font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors duration-200"
              >
                {item.name}
              </a>
            )
          )}
          <div className="mt-6 px-4">
            <a
              href="#"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#00b06b] to-[#004e92] py-3 text-base font-semibold text-white shadow-md transition-all duration-300 active:scale-95"
            >
              <span>Lets Build Together</span>
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}