import { useEffect, useState } from 'react';
import { fetchPublishedTestimonials } from '../lib/testimonialApi';

function initials(name) {
  return String(name || '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

function TestimonialCard({ testimonial }) {
  return (
    <div
      className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow duration-300 p-6"
      data-purpose="community-testimonial-card"
    >
      <div>
        <div className="mb-4">
          <svg className="w-10 h-10 text-[#004ac6] opacity-50" fill="currentColor" viewBox="0 0 32 32">
            <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H6c0-2.2 1.8-4 4-4V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-8c0-2.2 1.8-4 4-4V8z" />
          </svg>
        </div>
        <p className="text-slate-700 leading-relaxed text-sm mb-4">{testimonial.quote}</p>
      </div>

      <div>
        <div className="flex items-center gap-1 mb-4">
          <div className="flex text-[#a34700] text-sm">
            {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
              <span key={i}>★</span>
            ))}
          </div>
          <span className="text-xs font-bold text-slate-900 ml-1">{(testimonial.rating || 5).toFixed(1)}</span>
        </div>

        <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
          {testimonial.avatar_url ? (
            <img
              alt={testimonial.name}
              src={testimonial.avatar_url}
              className="w-12 h-12 rounded-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#e1e7ff] text-[#004ac6] flex items-center justify-center font-bold text-sm flex-shrink-0">
              {initials(testimonial.name)}
            </div>
          )}
          <div>
            <h4 className="font-bold text-slate-900 text-sm">{testimonial.name}</h4>
            {testimonial.role && <p className="text-gray-500 text-xs">{testimonial.role}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CommunityTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    fetchPublishedTestimonials()
      .then((data) => {
        if (!ignore) setTestimonials(data.testimonials || []);
      })
      .catch(() => {
        // Fails silently — this is an additive section, so if the admin
        // hasn't published anything yet (or the API is briefly down) the
        // Home page just doesn't render it, rather than showing an error.
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  // Nothing published yet (or still loading with nothing to show) — render
  // nothing at all, so the section simply doesn't exist until the admin
  // adds a testimonial.
  if (loading) {
    return null;
  }
  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-6 bg-white" data-purpose="community-testimonials-section">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12" data-purpose="section-header">
          <span className="font-['Hanken_Grotesk'] text-[15px] font-bold tracking-[0.3em] text-[#004ac6] uppercase mb-3 block">
            MORE FROM OUR CLIENTS
          </span>
          <h2 className="font-['Hanken_Grotesk'] text-xl md:text-4xl font-black text-[#131b2e] leading-tight tracking-tight mb-4">
            What Our Clients <span className="gradient-text">Say</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto" data-purpose="cards-grid">
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  );
}