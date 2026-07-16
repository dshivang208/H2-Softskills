import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import logo from '../assets/logo.png';

const quickLinks = ['Home', 'About Us', 'Services', 'Projects', 'Blog', 'Contact'];

const services = [
  'Web & Full Stack Development',
  'Mobile App Development',
  'Blockchain Solutions',
  'CRM Solutions',
  'Digital Marketing',
  'AI & Automation',
];

const technologies = ['MERN Stack', 'Next.js', 'Blockchain', 'AWS & DevOps', 'More'];

// lucide-react doesn't ship brand/social icons, so these are small
// hand-drawn, simplified line-icon stand-ins for each platform.
function LinkedInIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="8" y1="11" x2="8" y2="16" />
      <circle cx="8" cy="7.5" r="0.6" fill="currentColor" stroke="none" />
      <path d="M12 16v-3.2c0-1.2.8-1.8 1.8-1.8s1.7.6 1.7 1.9V16" />
    </svg>
  );
}

function TwitterIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 4l16 16M20 4L4 20" />
    </svg>
  );
}

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YoutubeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="5" width="20" height="14" rx="4" />
      <path d="M10 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

const socialLinks = [
  { icon: LinkedInIcon, label: 'LinkedIn', href: '#' },
  { icon: TwitterIcon, label: 'Twitter', href: '#' },
  { icon: InstagramIcon, label: 'Instagram', href: '#' },
  { icon: YoutubeIcon, label: 'YouTube', href: '#' },
];

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">{title}</h4>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link}>
            <a
              href="#"
              className="text-gray-400 text-sm hover:text-[#4edea3] transition-colors"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#020208] border-t border-white/5" data-purpose="site-footer">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-2">
            <img src={logo} alt="H2 Softskills Logo" className="h-36 md:h-40 w-auto object-contain -mb-4" />
            <p className="text-gray-400 text-sm leading-relaxed mb-5 max-w-xs">
              We empower businesses with digital solutions that drive innovation, growth and success in the digital world.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-11 h-11 flex items-center justify-center rounded-full bg-white/5 text-gray-300 hover:bg-[#00b06b] hover:text-white transition-colors"
                >
                  <Icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Quick Links" links={quickLinks} />
          <FooterColumn title="Services" links={services} />
          <FooterColumn title="Technologies" links={technologies} />

          {/* Contact Us Column */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone className="w-4 h-4 flex-shrink-0 text-[#4edea3]" strokeWidth={2} />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail className="w-4 h-4 flex-shrink-0 text-[#4edea3]" strokeWidth={2} />
                <span>hello@h2softskills.in</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0 text-[#4edea3]" strokeWidth={2} />
                <span>Mohali, Punjab, India</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} H2 Softskills. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <span className="text-gray-700">|</span>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms &amp; Conditions</a>
            <span className="text-gray-700">|</span>
            <Link to="/admin/login" className="hover:text-gray-300 transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}