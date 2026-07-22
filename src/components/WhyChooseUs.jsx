import { Users, BadgeCheck, Star, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Certified Experts',
    description:
      'H2 Softskills\u2019 team ships production-grade work end-to-end \u2014 React and FastAPI builds, not throwaway prototypes.',
  },
  {
    icon: BadgeCheck,
    title: 'Proven Results',
    description:
      'From cricket-scoring platforms to school management portals, H2 Softskills has real, in-use products running across industries.',
  },
  {
    icon: Star,
    title: 'Highly Rated',
    description:
      'Clients come back to H2 Softskills for repeat work \u2014 from web builds to ongoing business services support.',
  },
  {
    icon: BarChart3,
    title: 'Transparent Reporting',
    description:
      'H2 Softskills keeps you updated at every stage of the build, so you always know exactly where your project stands.',
  },
];

function FeatureBlock({ feature }) {
  const Icon = feature.icon;
  return (
    <article data-purpose="feature-block">
      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#c1ff00] text-[#1b3322] mb-3">
        <Icon className="w-5 h-5" strokeWidth={2} />
      </div>
      <h3 className="font-['Hanken_Grotesk'] text-lg font-bold mb-2">{feature.title}</h3>
      <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
    </article>
  );
}

export default function WhyChooseUs() {
  return (
    <section
      className="py-9 px-4 md:px-8 max-w-6xl mx-auto font-['Hanken_Grotesk'] text-[#1b3322]"
      data-purpose="why-choose-us-section"
    >
      {/* Header */}
      <header className="text-center mb-8" data-purpose="section-header">
        <div className="inline-flex items-center gap-2 mb-3">
          <div className="flex">
            <div className="w-3.5 h-3.5 bg-[#c1ff00] rounded-full" />
            <div className="w-3.5 h-3.5 bg-[#1b3322] rounded-full -ml-1 opacity-80" />
          </div>
          <span className="text-sm font-bold tracking-tight">Why Choose Us</span>
        </div>
        <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight max-w-2xl mx-auto leading-tight">
          Why Our Clients Believe We&apos;re Different
        </h2>
      </header>

      {/* Bento layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 items-stretch" data-purpose="bento-layout">
        {/* Left column: image bento grid */}
        <div className="grid grid-cols-2 gap-3.5 h-full" data-purpose="image-bento-grid">
          {/* Tall image, left */}
          <div className="relative overflow-hidden rounded-2xl h-full min-h-[230px] lg:min-h-0">
            <img
              alt="Team member working"
              className="w-full h-full object-cover grayscale"
              loading="lazy"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDk7Wwc1HQdoBUHa3ZHbZHUBJEe1j9DuS5CBSJ_tgO27s_Arky0WsHVwA6ObqSKfYXW0OYCm91Sw5GFpDMJzVrdTEunsFqDC5MPSKXaI6VBT2wC-eN8tWljiC2o_q7WctzUcBJlJ2T8vQBBfZYm-E6vyPZ9aNGqH_6zAgQ3m05vRgZipAoVt-pZo4Ewit6Fjo4uHKzQ-yLzTK8as7Qzj-2dhvZ7p3asusf1vRV8w56Jbpm1Zxn3Uewa7w"
            />
            {/* Sparkle decorations */}
            <div className="absolute bottom-16 -left-2 text-[#c1ff00] text-3xl">✦</div>
            <div className="absolute bottom-8 left-3 text-[#c1ff00] text-4xl">✦</div>
          </div>

          {/* Right side of the left column: stacked photo + lime graphic */}
          <div className="flex flex-col gap-3.5">
            <div className="flex-grow overflow-hidden rounded-2xl min-h-[105px]">
              <img
                alt="Team meeting"
                className="w-full h-full object-cover grayscale"
                loading="lazy"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNVpYJaxqkSW4YIe3WMNPTd5hKM3oYD0B7UQPRVF5K6l57yPkz_Nbnbl2KPZAChZUnskCWDzQ2ayVVL4LtKZSdBU33r-WlOiHm4zqK67fUF6xv3cxukyORUw4Bf55Qm-oBAj8pyXLRyvy8FN6VOgKU-Sc-zBZMw6-bLDFuhfZkTguwyxsROK7NIeiuLBVy1EZyfuEVyM7Gc_Kjidkfk7RykY1au9zWQBjhFl0IrtlSZrT98YMWWMx0DA"
              />
            </div>

            {/* Lime graphic block */}
            <div className="h-1/2 min-h-[90px] bg-[#c1ff00] rounded-2xl flex items-center justify-center relative overflow-hidden">
              <svg className="w-full h-full opacity-60" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path
                  d="M50 0 C50 25 50 25 50 50 C50 75 50 75 50 100"
                  fill="none"
                  stroke="#1b3322"
                  strokeWidth="2"
                />
                <circle cx="50" cy="20" fill="#1b3322" r="3" />
                <circle cx="50" cy="40" fill="#1b3322" r="3" />
                <circle cx="50" cy="60" fill="#1b3322" r="3" />
                <circle cx="50" cy="80" fill="#1b3322" r="3" />
                <path d="M30 0 Q 70 25 30 50 T 30 100" fill="none" stroke="#1b3322" strokeWidth="1.5" />
              </svg>
              {/* Half-circle cutout, bottom-left */}
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-white rounded-tr-full transform translate-y-10 -translate-x-10" />
            </div>
          </div>
        </div>

        {/* Right column: dark feature card, 2x2 grid */}
        <div className="bg-[#1b3322] rounded-2xl p-6 lg:p-8 text-white" data-purpose="features-card-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
            {features.map((feature) => (
              <FeatureBlock key={feature.title} feature={feature} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}