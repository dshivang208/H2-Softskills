import { useRef, useState } from 'react';
import { Phone, Mail, MapPin, Clock, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const contactInfo = [
  { icon: Phone, label: 'PHONE', value: '+91 98765-43210' },
  { icon: Mail, label: 'EMAIL', value: 'hello@h2softskills.in' },
  { icon: MapPin, label: 'LOCATION', value: 'Mohali, Punjab, India' },
  { icon: Clock, label: 'BUSINESS HOURS', value: 'Mon - Sat: 9:00 AM - 7:00 PM' },
];

const inputClass =
  'w-full bg-[#f2f3ff] border border-[#c3c6d6]/50 rounded-xl px-6 py-4 focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none transition-all placeholder:text-[#a3a7bd] text-[#131b2e]';

// Points at the Express backend in server/. Override with a Vite env var
// (VITE_API_URL) when deploying so the frontend can hit a different host.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Contact() {
  const [focusedField, setFocusedField] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errorMessage, setErrorMessage] = useState('');
  const formRef = useRef(null);

  const labelClass = (field) =>
    `font-semibold text-xs tracking-[0.3em] uppercase transition-colors ${
      focusedField === field ? 'text-[#003594]' : 'text-[#434654]'
    }`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;

    const formData = new FormData(formRef.current);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    };

    setStatus('sending');
    setErrorMessage('');

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      setStatus('sent');
      setTimeout(() => {
        setStatus('idle');
        setFocusedField(null);
        formRef.current?.reset();
      }, 3000);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message || 'Could not send your message. Please try again.');
    }
  };

  return (
    <main className="relative min-h-screen bg-[#faf8ff] tech-grid overflow-x-hidden">
      {/* Atmospheric Glows */}
      <div className="floating-radial bg-[#003594] top-0 -left-64" />
      <div className="floating-radial bg-[#006c49] bottom-0 -right-64" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-16 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-start">
          {/* Left Column: Narrative & Info */}
          <div className="lg:col-span-5 space-y-12">
            <header className="space-y-4">
              <span className="font-['Hanken_Grotesk'] text-sm font-semibold tracking-[0.2em] text-[#004ac6] bg-[#003594]/10 px-3 py-1 rounded-full inline-block">
                CONTACT US
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 max-w-3xl leading-tight text-[#0f172a] font-['Hanken_Grotesk']">
                Let&apos;s Build Something
                <br />
                <span className="gradient-text">Great Together</span>
              </h1>
              <p className="text-lg leading-relaxed text-slate-800 max-w-md">
                Have a project in mind or want to discuss an idea? We&apos;d love to hear from
                you. Our team is ready to transform your vision into technical reality.
              </p>
            </header>

            <div className="space-y-8 font-['Hanken_Grotesk'] ">
              {contactInfo.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-6 group">
                  <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-[#e1e7ff] flex items-center justify-center transition-all group-hover:bg-[#003594]/20 group-hover:scale-110">
                    <Icon className="w-5 h-5 text-[#003594]" strokeWidth={2} />
                  </div>
                  <div className="space-y-1">
                    <p className="font-['Hanken_Grotesk'] text-xs font-bold tracking-[0.3em] text-black">
                      {label}
                    </p>
                    <p className="text-xl text-[#131b2e] font-['Hanken_Grotesk'] font-bold">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7">
            <div className="glass-card p-6 sm:p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
              {/* Decorative top border animation */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#003594] via-[#006c49] to-[#003594] bg-[length:200%_auto] animate-[gradient_3s_linear_infinite]" />

              <form ref={formRef} onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className={labelClass('name')}>YOUR NAME</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. John Doe"
                    className={inputClass}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2 font-['Hanken_Grotesk']">
                  <label className={labelClass('email')}>YOUR EMAIL</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="e.g. john@company.com"
                    className={inputClass}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className={labelClass('subject')}>SUBJECT</label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="Project Inquiry"
                    className={inputClass}
                    onFocus={() => setFocusedField('subject')}
                    onBlur={() => setFocusedField(null)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className={labelClass('message')}>YOUR MESSAGE</label>
                  <textarea
                    rows={6}
                    name="message"
                    placeholder="Describe your project goals and requirements..."
                    className={`${inputClass} resize-none`}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    required
                  />
                </div>

                <div className="md:col-span-2 pt-4 space-y-3">
                  <button
                    type="submit"
                    disabled={status === 'sending' || status === 'sent'}
                    className={`w-full text-white text-lg font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 ${
                      status === 'sent' ? 'bg-[#006c49]' : status === 'error' ? 'bg-red-600' : 'gradient-btn'
                    } ${status === 'sending' || status === 'sent' ? 'opacity-80 cursor-not-allowed' : ''}`}
                  >
                    {(status === 'idle' || status === 'error') && (
                      <>
                        Send Message
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                    {status === 'sending' && (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    )}
                    {status === 'sent' && (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Sent Successfully
                      </>
                    )}
                  </button>
                  {status === 'error' && (
                    <p className="flex items-center gap-2 text-sm font-semibold text-red-600">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {errorMessage}
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-20 md:mt-28">
          <div className="relative w-full h-[400px] md:h-[500px] rounded-[3rem] overflow-hidden shadow-xl border border-[#c3c6d6]/50">
            <iframe
              title="H2 Softskills location - Mohali, Punjab, India"
              src="https://www.google.com/maps?q=Sector+67,+Mohali,+Punjab,+India&output=embed"
              className="absolute inset-0 w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            {/* Map Overlay Glass Box */}
            <div className="pointer-events-none absolute bottom-8 left-8 glass-card p-6 rounded-2xl max-w-xs hidden md:block">
              <h4 className="text-xl text-black font-bold mb-2">Visit Our HQ</h4>
              <p className="text-sm text-slate-900 font-bold">
                Premium Tech Park, Sector 67, Mohali, Punjab 160062, India
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Contact;