import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Loader2, FileDown, PhoneCall, Sparkles } from 'lucide-react';
import { projects } from '../components/FeaturedProjects';
import { fetchCaseStudy } from '../lib/caseStudyApi';

const accentText = {
  primary: 'text-[#003594]',
  secondary: 'text-[#006c49]',
};

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

function CaseStudy() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const project = projects.find((p) => p.id === projectId);

  const [caseStudy, setCaseStudy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchCaseStudy(projectId).then((data) => {
      if (!cancelled) {
        setCaseStudy(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  // Unknown project id (not one of the existing project cards) — bail out
  // to the projects grid rather than rendering a broken page.
  if (!project) {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-[#faf8ff] px-6 text-center">
        <p className="text-[#434654]">We couldn&apos;t find that project.</p>
        <button
          type="button"
          onClick={() => navigate('/projects')}
          className="text-sm font-semibold text-[#003594] hover:underline"
        >
          Back to Projects
        </button>
      </main>
    );
  }

  const hasContent = Boolean(caseStudy);

  return (
    <main className="relative min-h-screen bg-[#faf8ff] tech-grid overflow-x-hidden">
      <div className="floating-radial bg-[#003594] top-0 -left-64" />
      <div className="floating-radial bg-[#006c49] bottom-0 -right-64" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#003594] hover:text-[#002a72] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>

        {/* Hero */}
        <header className="mb-8">
          <p
            className={`text-xs font-semibold mb-3 uppercase tracking-[0.25em] ${accentText[project.accent]}`}
          >
            {project.tag}
          </p>
          <h1 className="font-['Hanken_Grotesk'] text-3xl md:text-5xl font-black tracking-tight text-[#131b2e] mb-5">
            {project.title}
          </h1>
          <p className="text-[#434654] text-lg leading-relaxed max-w-3xl">
            {hasContent && caseStudy.summary ? caseStudy.summary : project.description}
          </p>
        </header>

        <div className="w-full h-40 sm:h-52 md:h-64 overflow-hidden rounded-xl bg-[#eaedff] mb-8">
          <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12 text-[#737685]">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading case study…
          </div>
        )}

        {!loading && !hasContent && (
          <div className="mb-14 bg-white border border-[#c3c6d6]/30 rounded-2xl px-6 py-8 flex items-start gap-4">
            <Sparkles className="w-5 h-5 text-[#a34700] mt-0.5 flex-shrink-0" />
            <p className="text-[#434654] text-sm leading-relaxed">
              The full write-up for this project is coming soon. In the meantime, you can still
              book a call to talk through the details or explore other projects.
            </p>
          </div>
        )}

        {!loading && hasContent && (
          <div className="space-y-10">
            {/* Key facts */}
            {(caseStudy.client_type || caseStudy.region || caseStudy.tech_stack) && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {caseStudy.client_type && (
                  <div className="bg-white border border-[#c3c6d6]/30 rounded-2xl px-5 py-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#737685] mb-1">
                      Client Type
                    </p>
                    <p className="text-sm font-semibold text-[#131b2e]">{caseStudy.client_type}</p>
                  </div>
                )}
                {caseStudy.region && (
                  <div className="bg-white border border-[#c3c6d6]/30 rounded-2xl px-5 py-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#737685] mb-1">
                      Region
                    </p>
                    <p className="text-sm font-semibold text-[#131b2e]">{caseStudy.region}</p>
                  </div>
                )}
                {caseStudy.tech_stack && (
                  <div className="bg-white border border-[#c3c6d6]/30 rounded-2xl px-5 py-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#737685] mb-1">
                      Tech / Solution
                    </p>
                    <p className="text-sm font-semibold text-[#131b2e]">{caseStudy.tech_stack}</p>
                  </div>
                )}
              </div>
            )}

            {/* Challenges */}
            {caseStudy.challenges?.length > 0 && (
              <section>
                <SectionHeading eyebrow="The Problem" title="Challenges" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {caseStudy.challenges.map((item, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <div key={i} className="bg-white border border-[#c3c6d6]/30 rounded-2xl p-5">
                      <h3 className="font-bold text-[#131b2e] text-sm mb-2">{item.title}</h3>
                      <p className="text-[#434654] text-sm leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Solutions */}
            {caseStudy.solutions?.length > 0 && (
              <section>
                <SectionHeading eyebrow="The Approach" title="What We Built" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {caseStudy.solutions.map((item, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <div key={i} className="bg-white border border-[#c3c6d6]/30 rounded-2xl p-5">
                      <h3 className="font-bold text-[#131b2e] text-sm mb-2">{item.title}</h3>
                      <p className="text-[#434654] text-sm leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Process */}
            {caseStudy.process_steps?.length > 0 && (
              <section>
                <SectionHeading eyebrow="How It Worked" title="Process" />
                <ol className="space-y-3">
                  {caseStudy.process_steps.map((step, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <li key={i} className="flex items-start gap-4 bg-white border border-[#c3c6d6]/30 rounded-2xl px-5 py-4">
                      <span className="w-7 h-7 rounded-full bg-[#e1e7ff] text-[#003594] text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <p className="text-[#434654] text-sm leading-relaxed pt-0.5">{step}</p>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* Outcomes */}
            {caseStudy.outcomes?.length > 0 && (
              <section>
                <SectionHeading eyebrow="The Result" title="Outcome" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {caseStudy.outcomes.map((item, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <div key={i} className="bg-[#e1f7ec] border border-[#006c49]/20 rounded-2xl p-5">
                      <h3 className="font-bold text-[#00553a] text-sm mb-2">{item.title}</h3>
                      <p className="text-[#294f43] text-sm leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Bottom CTA card — present on every project's case study page */}
        <div className="mt-10 p-6 md:p-8 rounded-2xl bg-[#004ac6] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-1.5">
                Want a similar workflow for your business?
              </h3>
              <p className="text-[#dbe1ff] text-sm max-w-md">
                Book a quick call to see how we can map something like this to your process, or
                grab the full report for {project.title}.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-[#003594] font-bold text-sm rounded-xl hover:bg-[#eaedff] transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                Schedule a Call
              </Link>
              {caseStudy?.pdf_url ? (
                <a
                  href={caseStudy.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white/10 border border-white/25 text-white font-bold text-sm rounded-xl hover:bg-white/20 transition-colors"
                >
                  <FileDown className="w-4 h-4" />
                  Download Case Study Report
                </a>
              ) : (
                <span
                  title="Report not available yet"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white/10 border border-white/15 text-white/60 font-bold text-sm rounded-xl cursor-not-allowed"
                >
                  <FileDown className="w-4 h-4" />
                  Report Coming Soon
                </span>
              )}
            </div>
          </div>
        </div>

        <Link
          to="/projects"
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#003594] hover:text-[#002a72] transition-colors"
        >
          Explore more projects
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </main>
  );
}

export default CaseStudy;