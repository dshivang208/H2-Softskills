// Logos for the auto-scrolling client marquee.
const clientLogos = [
  { name: 'Polygon', src: 'https://cdn.worldvectorlogo.com/logos/polygon-token.svg' },
  { name: 'Binance', src: 'https://cdn.worldvectorlogo.com/logos/binance-coin-bnb.svg' },
  { name: 'AWS', src: 'https://cdn.worldvectorlogo.com/logos/aws-2.svg' },
  { name: 'Solana', src: 'https://cdn.worldvectorlogo.com/logos/solana-sol.svg' },
  { name: 'Microsoft', src: 'https://cdn.worldvectorlogo.com/logos/microsoft-5.svg' },
  { name: 'Google Cloud', src: 'https://cdn.worldvectorlogo.com/logos/google-cloud-1.svg' },
  { name: 'Stripe', src: 'https://cdn.worldvectorlogo.com/logos/stripe-4.svg' },
  { name: 'Notion', src: 'https://cdn.worldvectorlogo.com/logos/notion-2.svg' },
  { name: 'Slack', src: 'https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg' },
  { name: 'HubSpot', src: 'https://cdn.worldvectorlogo.com/logos/hubspot-2.svg' },
];

function LogoCard({ logo }) {
  return (
    <div
      className="flex-none w-40 h-20 bg-white border border-slate-100 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex items-center justify-center p-4"
      data-purpose="client-logo-card"
    >
      <img
        alt={`${logo.name} logo`}
        src={logo.src}
        className="max-h-10 max-w-full object-contain transition-all duration-300"
        loading="lazy"
      />
    </div>
  );
}

export default function Clients() {
  // Duplicate the list so the marquee CSS animation loops seamlessly from 0% to -50%.
  const marqueeLogos = [...clientLogos, ...clientLogos];

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