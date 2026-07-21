import { useEffect, useState } from 'react';
import { fetchPublishedTestimonials } from '../lib/testimonialApi';

// Pulls the company name out of a role string like "CEO, Bright Solutions"
// so the small badge in the corner has something to show, without needing
// a separate field in the database.
function companyFromRole(role) {
  if (!role) return null;
  const parts = role.split(',');
  return parts.length > 1 ? parts[parts.length - 1].trim() : null;
}

function TestimonialCard({ testimonial }) {
  const company = companyFromRole(testimonial.role);

  return (
    <div
      className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow duration-300 p-6"
      data-purpose="testimonial-card"
    >
      <div>
        {/* Quote icon */}
        <div className="mb-4">
          <svg className="w-10 h-10 text-[#006c49] opacity-50" fill="currentColor" viewBox="0 0 32 32">
            <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H6c0-2.2 1.8-4 4-4V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-8c0-2.2 1.8-4 4-4V8z" />
          </svg>
        </div>
        <p className="text-slate-700 leading-relaxed text-sm mb-4">{testimonial.quote}</p>
      </div>

      <div>
        {/* Rating + verified badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <div className="flex text-[#006c49] text-sm">
              {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>
            <span className="text-xs font-bold text-slate-900 ml-1">
              {(testimonial.rating || 5).toFixed(1)}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[#006c49]">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              />
            </svg>
            <span className="text-xs font-semibold text-slate-800">Verified Client</span>
          </div>
        </div>

        {/* Profile info + company badge */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <div className="flex items-center gap-3">
            {testimonial.avatar_url ? (
              <img
                alt={testimonial.name}
                src={testimonial.avatar_url}
                className="w-12 h-12 rounded-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#e1e7ff] text-[#004ac6] flex items-center justify-center font-bold text-sm flex-shrink-0">
                {testimonial.name?.[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <h4 className="font-bold text-slate-900 text-sm">{testimonial.name}</h4>
              <p className="text-gray-500 text-xs">{testimonial.role}</p>
            </div>
          </div>
          {company && (
            <span className="text-blue-700 font-bold italic text-sm text-right">{company}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    fetchPublishedTestimonials()
      .then((data) => {
        if (!ignore) setTestimonials(data.testimonials || []);
      })
      .catch(() => {
        // Fails silently — if the API is briefly down the section just
        // doesn't render rather than showing an error.
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
  if (loading || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-6 bg-[#FAF9F6]" data-purpose="testimonials-section">
      <div className="max-w-7xl mx-auto">
        {/* Section header, styled to match the other Home sections */}
        <div className="text-center mb-12" data-purpose="section-header">
          <span className="font-['Hanken_Grotesk'] text-[15px] font-bold tracking-[0.3em] text-[#004ac6] uppercase mb-3 block">
            TESTIMONIALS
          </span>
          <h2 className="font-['Hanken_Grotesk'] text-xl md:text-4xl font-black text-[#131b2e] leading-tight tracking-tight mb-4">
            Trusted by Businesses <span className="gradient-text">Worldwide</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Our clients are at the heart of everything we do. Here&apos;s what they have to say about
            working with H2 Softskills.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto" data-purpose="cards-grid">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}