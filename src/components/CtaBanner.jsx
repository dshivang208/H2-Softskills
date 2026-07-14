import { ArrowRight, Lightbulb } from 'lucide-react';

export default function CtaBanner() {
  return (
    <section
      className="max-w-7xl mx-auto px-6 py-6"
      data-purpose="call-to-action-banner"
      id="cta-banner"
    >
      <div
        className="rounded-xl shadow-lg px-6 py-4 md:py-5 flex flex-col md:flex-row items-center justify-between gap-4 overflow-hidden"
        style={{
          background:
            'linear-gradient(90deg, rgba(0,51,204,1) 0%, rgba(0,119,190,1) 45%, rgba(0,168,107,1) 100%)',
        }}
      >
        {/* Left Content: Icon and Text */}
        <div
          className="flex flex-col md:flex-row items-center text-center md:text-left gap-3 md:gap-4"
          data-purpose="banner-content"
        >
          <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center">
            <Lightbulb className="w-7 h-7 md:w-8 md:h-8 text-blue-200 opacity-80" strokeWidth={1.5} />
          </div>
          <div className="text-white" data-purpose="banner-text">
            <h2 className="text-xl md:text-xl font-semibold tracking-tight mb-1">
              Have an idea in mind?
            </h2>
            <p className="text-blue-100 text-sm md:text-base font-medium opacity-90">
              Let's turn your vision into a powerful digital product.
            </p>
          </div>
        </div>

        {/* Right Content: CTA Button */}
        <div className="flex-shrink-0 w-full md:w-auto" data-purpose="button-container">
          <a
            href="#"
            role="button"
            className="inline-flex items-center justify-center w-full md:w-auto px-6 py-2.5 bg-white text-blue-700 font-bold rounded-lg shadow-md hover:bg-gray-50 transition-colors duration-200 group"
          >
            <span>Let's Build Together</span>
            <ArrowRight className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" strokeWidth={2} />
          </a>
        </div>
      </div>
    </section>
  );
}