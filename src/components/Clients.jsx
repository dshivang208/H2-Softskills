import { useEffect, useState } from 'react';
import { fetchPublishedClientLogos } from '../lib/clientLogoApi';

function LogoCard({ logo }) {
  const content = (
    <img
      alt={`${logo.name} logo`}
      src={logo.src}
      className="max-h-10 max-w-full object-contain transition-all duration-300"
      loading="lazy"
    />
  );

  const className =
    'flex-none w-40 h-20 bg-white border border-slate-100 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex items-center justify-center p-4';

  if (logo.href) {
    return (
      <a
        href={logo.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        data-purpose="client-logo-card"
      >
        {content}
      </a>
    );
  }

  return (
    <div className={className} data-purpose="client-logo-card">
      {content}
    </div>
  );
}

export default function Clients() {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    fetchPublishedClientLogos()
      .then((data) => {
        if (!ignore) {
          setLogos(
            (data.logos || []).map((l) => ({ name: l.name, src: l.logo_url, href: l.website_url }))
          );
        }
      })
      .catch(() => {
        // Fails silently — if the API is briefly down the marquee just
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
  // adds a logo.
  if (loading || logos.length === 0) {
    return null;
  }

  // Duplicate the list so the marquee CSS animation loops seamlessly from 0% to -50%.
  const marqueeLogos = [...logos, ...logos];

  return (
    <section className="py-10 px-6 bg-white" data-purpose="our-clients-section">
      <div className="max-w-7xl mx-auto">
        {/* Section header, styled to match the other Home sections */}
        <div className="text-center mb-8" data-purpose="section-header">
          <span className="font-['Hanken_Grotesk'] text-[15px] font-bold tracking-[0.3em] text-[#004ac6] uppercase mb-3 block">
            OUR CLIENTS
          </span>
          <h2 className="font-['Hanken_Grotesk'] text-xl md:text-4xl font-black text-[#131b2e] leading-tight tracking-tight">
            Trusted by Innovative Companies{' '}
            <span className="bg-gradient-to-r from-[#006c49] to-[#004ac6] bg-clip-text text-transparent">
              Worldwide
            </span>
          </h2>
        </div>

        {/* Auto-scrolling logo marquee (reuses the same track/mask utilities as TechStack), pauses on hover */}
        <div className="relative overflow-hidden marquee-mask">
          <div className="marquee-track flex items-center gap-4">
            {marqueeLogos.map((logo, index) => (
              <LogoCard key={`${logo.name}-${index}`} logo={logo} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}