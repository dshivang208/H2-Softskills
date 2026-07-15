import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { services, ServiceCard } from '../components/Services';

function Services() {
  return (
    <main className="bg-[#f8fafc] pt-4 pb-16 md:pt-16">
      {/* Hero Section */}
      <section className="px-6 md:px-12 mb-16 md:mb-24 max-w-7xl mx-auto text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2563eb]/10 border border-[#2563eb]/20 rounded-full mb-4">
          <span className="w-2 h-2 bg-[#2563eb] rounded-full animate-pulse" />
          <span className="font-['Hanken_Grotesk'] text-sm font-semibold tracking-[0.1em] text-[#2563eb]">
            OUR SERVICES
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4 max-w-3xl leading-tight text-[#0f172a] font-['Hanken_Grotesk']">
          End-to-End Solutions to{' '}
          <span className="bg-gradient-to-r from-[#2563eb] to-[#00a572] bg-clip-text text-transparent">
            Accelerate Your Growth
          </span>
        </h1>
        <p className="text-base text-[#434655] max-w-2xl leading-relaxed">
          We provide a wide range of digital services to help businesses transform and succeed
          in the digital era. From robust architectures to user-centric interfaces.
        </p>
      </section>

      {/* Services Grid — same card design used on the Home page */}
      <section className="px-6 md:px-12 mb-16 md:mb-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} fullWidth />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto">
        <div className="relative bg-[#f1f5f9] rounded-3xl p-8 md:p-16 overflow-hidden border border-[#e2e8f0] text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2563eb]/5 via-transparent to-[#00a572]/5 pointer-events-none" />
          <h2 className="relative z-10 text-2xl md:text-4xl font-bold mb-4 text-[#0f172a] font-['Hanken_Grotesk']">
            Ready to transform your vision into reality?
          </h2>
          <p className="relative z-10 text-base text-[#434655] mb-8 max-w-xl mx-auto leading-relaxed">
            Join our growing list of partners and let us handle the technical complexities of
            your next project.
          </p>
          <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-[#2563eb] text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity shadow-lg shadow-[#2563eb]/20"
            >
              Schedule a Call
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/projects"
              className="inline-flex items-center justify-center gap-2 border border-[#8d90a0] text-[#0f172a] px-8 py-3 rounded-lg font-bold hover:bg-[#f1f5f9] transition-colors"
            >
              Our Portfolio
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Services;