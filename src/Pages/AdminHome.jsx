import { Link, useNavigate } from 'react-router-dom';
import { Mail, Newspaper, Wrench, FolderKanban, LogOut, ChevronRight, ShieldCheck, FileStack } from 'lucide-react';
import { clearAdminToken } from '../lib/adminApi';

// ---------------------------------------------------------------------------
// Admin sections registry. To add a new admin section in the future, add an
// entry here (and its route in App.jsx) — nothing else on this page needs
// to change.
// ---------------------------------------------------------------------------
const ADMIN_SECTIONS = [
  {
    key: 'newsletter',
    title: 'Manage Newsletter',
    description: 'View subscribers, unsubscribe them, and send email broadcasts.',
    to: '/admin/newsletter',
    icon: Mail,
    accent: '#003594',
  },
  {
    key: 'blog',
    title: 'Manage Blog',
    description: 'Write, edit, publish, and delete blog posts and popular picks.',
    to: '/admin/blogs',
    icon: Newspaper,
    accent: '#006c49',
  },
  {
    key: 'services',
    title: 'Manage Services',
    description: 'Add new service cards to the Services page without touching the existing ones.',
    to: '/admin/services',
    icon: Wrench,
    accent: '#a34700',
  },
  {
    key: 'case-studies',
    title: 'Manage Case Studies',
    description: 'Add case study write-ups to your existing project cards — none get removed.',
    to: '/admin/case-studies',
    icon: FolderKanban,
    accent: '#7c3aed',
  },
  {
    key: 'service-details',
    title: 'Manage Service Details',
    description: 'Fill in the capabilities, outcomes, deliverables, and FAQ shown on each service\u2019s detail page.',
    to: '/admin/service-details',
    icon: FileStack,
    accent: '#0e7490',
  },
];

function SectionCard({ section }) {
  const Icon = section.icon;
  return (
    <Link
      to={section.to}
      className="group bg-white rounded-2xl border border-[#c3c6d6]/30 shadow-sm p-6 flex items-start gap-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: section.accent + '1a' }}
      >
        <Icon className="w-7 h-7" style={{ color: section.accent }} />
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-bold text-[#131b2e] mb-1 group-hover:text-[#003594] transition-colors">
          {section.title}
        </h2>
        <p className="text-sm text-[#737685] leading-relaxed">{section.description}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-[#c3c6d6] flex-shrink-0 mt-1 group-hover:text-[#003594] group-hover:translate-x-0.5 transition-all" />
    </Link>
  );
}

function AdminHome() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAdminToken();
    navigate('/admin/login', { replace: true });
  };

  return (
    <main className="relative min-h-[calc(100vh-56px)] bg-[#faf8ff] tech-grid overflow-x-hidden">
      <div className="floating-radial bg-[#003594] top-0 -left-64" />
      <div className="floating-radial bg-[#006c49] bottom-0 -right-64" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#e1e7ff] flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#003594]" />
            </div>
            <div>
              <span className="font-['Hanken_Grotesk'] text-[#003594] text-sm leading-4 tracking-[0.3em] font-bold uppercase mb-1 block">
                Admin
              </span>
              <h1 className="font-['Hanken_Grotesk'] text-3xl md:text-4xl font-black tracking-tight text-[#131b2e]">
                Control Panel
              </h1>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#131b2e] text-white rounded-xl font-semibold text-sm hover:bg-[#0a0f1a] transition-colors self-start sm:self-auto"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        <p className="text-[#434654] text-base mb-8 max-w-2xl">
          Pick a section to manage. New admin tools will show up here as they're added.
        </p>

        {/* Section grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {ADMIN_SECTIONS.map((section) => (
            <SectionCard key={section.key} section={section} />
          ))}
        </div>
      </div>
    </main>
  );
}

export default AdminHome;