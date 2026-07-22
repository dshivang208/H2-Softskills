import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Loader2, PhoneCall, Sparkles, CheckCircle2 } from 'lucide-react';
import { FALLBACK_SERVICES, mapApiService } from '../components/Services';
import { fetchPublishedServices } from '../lib/servicesApi';
import { fetchServiceDetail } from '../lib/serviceDetailApi';

function SectionHeading({ eyebrow, title }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="w-1.5 h-6 bg-[#003594] rounded-full" />
      <div>
        {eyebrow && (
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#737685] mb-0.5">
            {eyebrow}
          </p>
        )}
        <h2 className="text-xl md:text-2xl font-bold text-[#131b2e] font-['Hanken_Grotesk']">
          {title}
        </h2>
      </div>
    </div>
  );
}

function FaqItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white border border-[#c3c6d6]/30 rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="font-semibold text-sm text-[#131b2e]">{faq.question}</span>
        <span
          className={`flex-shrink-0 w-6 h-6 rounded-full bg-[#e1e7ff] text-[#003594] flex items-center justify-center text-sm font-bold transition-transform ${
            open ? 'rotate-45' : ''
          }`}
        >
          +
        </span>
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-[#434654] leading-relaxed">{faq.answer}</div>
      )}
    </div>
  );
}

function ServiceDetail() {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [allServices, setAllServices] = useState(FALLBACK_SERVICES);
  const [servicesLoaded, setServicesLoaded] = useState(false);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchPublishedServices().then((data) => {
      if (cancelled) return;
      if (data && data.length > 0) {
        setAllServices(data.map(mapApiService));
      }
      setServicesLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchServiceDetail(serviceId).then((data) => {
      if (!cancelled) {
        setDetail(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [serviceId]);

  const service = allServices.find((s) => s.id === serviceId);

  // Unknown service id — bail out to the services grid rather than
  // rendering a broken page. Wait for the services fetch to finish first,
  // since a service might only exist in the live (non-fallback) list.
  if (!service) {
    if (!servicesLoaded) {
      return (
        <main className="min-h-[60vh] flex items-center justify-center bg-[#faf8ff]">
          <Loader2 className="w-5 h-5 animate-spin text-[#737685]" />
        </main>
      );
    }
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-[#faf8ff] px-6 text-center">
        <p className="text-[#434654]">We couldn&apos;t find that service.</p>
        <button
          type="button"
          onClick={() => navigate('/services')}
          className="text-sm font-semibold text-[#003594] hover:underline"
        >
          Back to Services
        </button>
      </main>
    );
  }

  const Icon = service.icon;
  const hasContent = Boolean(detail);

  return (
    <main className="relative min-h-screen bg-[#faf8ff] tech-grid overflow-x-hidden">
      <div className="floating-radial bg-[#003594] top-0 -left-64" />
      <div className="floating-radial bg-[#006c49] bottom-0 -right-64" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#003594] hover:text-[#002a72] mb-10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Services
        </Link>

        {/* Hero */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#e1e7ff] flex items-center justify-center flex-shrink-0">
              {Icon && <Icon className="w-5 h-5 text-[#003594]" />}
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#003594]">
              {service.tag}
            </p>
          </div>
          <h1 className="font-['Hanken_Grotesk'] text-3xl md:text-5xl font-black tracking-tight text-[#131b2e] mb-5">
            {service.title}
          </h1>
          <p className="text-[#434654] text-lg leading-relaxed max-w-3xl mb-8">
            {hasContent && detail.intro ? detail.intro : service.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#003594] text-white font-bold rounded-xl hover:bg-[#002a72] transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              Request a Consultation
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-[#c3c6d6]/50 text-[#131b2e] font-bold rounded-xl hover:bg-[#f2f3ff] transition-colors"
            >
              View All Services
            </Link>
          </div>
        </header>

        {loading && (
          <div className="flex items-center justify-center py-12 text-[#737685]">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading service details…
          </div>
        )}

        {!loading && !hasContent && (
          <div className="mb-14 bg-white border border-[#c3c6d6]/30 rounded-2xl px-6 py-8 flex items-start gap-4">
            <Sparkles className="w-5 h-5 text-[#a34700] mt-0.5 flex-shrink-0" />
            <p className="text-[#434654] text-sm leading-relaxed">
              The full details for this service are coming soon. In the meantime, you can still
              book a call to talk through what you need or explore our other services.
            </p>
          </div>
        )}

        {!loading && hasContent && (
          <div className="space-y-14">
            {/* Capabilities */}
            {detail.capabilities?.length > 0 && (
              <section>
                <SectionHeading eyebrow="Capabilities" title="What We Build" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {detail.capabilities.map((item, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <div
                      key={i}
                      className="flex items-start gap-3 bg-white border border-[#c3c6d6]/30 rounded-xl px-4 py-3.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#003594] mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-[#434654] leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Outcomes */}
            {detail.outcomes?.length > 0 && (
              <section>
                <SectionHeading eyebrow="Outcomes" title="Key Benefits" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {detail.outcomes.map((item, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <div key={i} className="bg-[#e1f7ec] border border-[#006c49]/20 rounded-2xl p-5">
                      <p className="text-[#294f43] text-sm font-semibold leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Deliverables */}
            {detail.deliverables?.length > 0 && (
              <section>
                <SectionHeading eyebrow="Deliverables" title="What We Deliver" />
                <ol className="space-y-3">
                  {detail.deliverables.map((item, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <li
                      key={i}
                      className="flex items-start gap-4 bg-white border border-[#c3c6d6]/30 rounded-2xl px-5 py-4"
                    >
                      <span className="w-7 h-7 rounded-full bg-[#e1e7ff] text-[#003594] text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <p className="text-[#434654] text-sm leading-relaxed pt-0.5">{item}</p>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* Ideal Fit */}
            {detail.ideal_fit?.length > 0 && (
              <section>
                <SectionHeading eyebrow="Fit" title="Ideal For" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {detail.ideal_fit.map((item, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <div
                      key={i}
                      className="flex items-start gap-3 bg-white border border-[#c3c6d6]/30 rounded-xl px-4 py-3.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#003594] mt-2 flex-shrink-0" />
                      <p className="text-sm text-[#434654] leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* FAQ */}
            {detail.faqs?.length > 0 && (
              <section>
                <SectionHeading eyebrow="FAQ" title="Common Questions" />
                <div className="space-y-3">
                  {detail.faqs.map((faq, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <FaqItem key={i} faq={faq} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Bottom CTA card — present on every service's detail page */}
        <div className="mt-16 p-8 md:p-10 rounded-2xl bg-[#004ac6] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                Ready to discuss {service.title}?
              </h3>
              <p className="text-[#dbe1ff] text-sm max-w-md">
                Book a consultation and we&apos;ll outline a practical path forward for your team,
                or explore the rest of what we offer.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-[#003594] font-bold rounded-xl hover:bg-[#eaedff] transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                Book a Consultation
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 border border-white/25 text-white font-bold rounded-xl hover:bg-white/20 transition-colors"
              >
                Explore Services
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ServiceDetail;