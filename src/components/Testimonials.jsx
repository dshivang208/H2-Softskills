const testimonials = [
  {
    id: 'arjun-mehta',
    name: 'Arjun Mehta',
    role: 'CEO, Bright Solutions',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCWtURC5J9gM714t43CwpPTXHgfAXBhjYXZ0wnq1vaC3PlVzSzKURahaECG3aYONSh5jV9GOXGbcrMcM9qfVH1wy4gjRS-XV9v_sAEERv9BlpRR8DE-L46gtPUomVvFA3Bk1lE5ZfwNJecQn8dZwZuSVSZP4v5PAKw6GIcfyKqsvAxNVyxh4nmD5w3XVNZxZp9YQvL05iJSmDPGLb9eT3nkYElUSXcHghwbtZfYOO_eqe5AsvR58w_Tlg',
    quote:
      'H2 Softskills transformed our digital presence with a robust and scalable solution. Their team is highly skilled, responsive, and always focused on delivering real value.',
    companyBadge: (
      <span className="flex items-center text-blue-800 font-bold italic text-sm">
        <span className="mr-1 text-xl">✦</span> Bright
        <span className="font-normal block text-[10px] uppercase tracking-tighter ml-1">Solutions</span>
      </span>
    ),
  },
  {
    id: 'priya-sharma',
    name: 'Priya Sharma',
    role: 'Product Manager, Healthio',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCB3QgtlWINYwwqueybdKK_CLnuDS1Hu4_x5mvEOeNisKPcAPkZDBcXwEiH-YOEhNgVdM3TpySTu6z2CeAcdMd10i1PWVD4KuqtkhnnvdGngNH2w9MrFYI7rZQzK2vTO7YrdquM6SBVl_c6oPzmyhLfkkBExECUaEc-i7RLfG7FQQBAD60fzGQQgU5C6MrvlJyX8naF-5FV-oId9q_eqVPN_gw76e31kP_58XQ7O-EdkSzPCExw8U-F9w',
    quote:
      'The H2 Softskills team delivered our mobile app on time and exceeded our expectations in both quality and performance. A truly reliable technology partner.',
    companyBadge: (
      <span className="flex items-center text-blue-500 font-bold text-lg">
        <span className="text-2xl mr-1">+</span> Healthio
      </span>
    ),
  },
  {
    id: 'vikram-reddy',
    name: 'Vikram Reddy',
    role: 'CTO, Finova',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBLJmT4ftAXSgbqGi1aG7EHzFAH4Rfda6VSE9N5_0sr9zkuMD2vzJjAbMWCHxqg1bD4aOQ3fGCJmHfH6dh7JhctLjFUFoElbwdoz8VwApjkw-lEUX9IqVL6moe2AuI4GA7tYnPr_2tS2JJt-R7Wbr7wv14SAMwWHR44ATR8EkZUZXgSbd-MkXTw0MXhGB70d4KK1uqkt3EGcHxKrk3Bub6z1tcA-TqlCjbMwvfbvqP9TCEOA0zmV5oNsw',
    quote:
      'From concept to deployment, H2 Softskills has been exceptional. Their innovative approach and attention to detail helped us achieve our business goals faster.',
    companyBadge: (
      <span className="flex items-center text-blue-600 font-bold text-lg">
        <span className="bg-blue-600 text-white rounded p-1 text-xs mr-1">F</span> Finova
      </span>
    ),
  },
];

function TestimonialCard({ testimonial }) {
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
              {'★★★★★'.split('').map((star, i) => (
                <span key={i}>{star}</span>
              ))}
            </div>
            <span className="text-xs font-bold text-slate-900 ml-1">5.0</span>
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
            <img
              alt={testimonial.name}
              src={testimonial.avatar}
              className="w-12 h-12 rounded-full object-cover"
              loading="lazy"
            />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">{testimonial.name}</h4>
              <p className="text-gray-500 text-xs">{testimonial.role}</p>
            </div>
          </div>
          {testimonial.companyBadge}
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
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