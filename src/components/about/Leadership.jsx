import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import virendraFounderImage from "../../assets/honey-director.png";
import sarabjitDirectorImage from "../../assets/Sarabjit-director.png";

const TEAM = [
  
  
  {
    key: "Virendra",
    name: "Dewan Varender Partap Singh",
    role: "Founder & CEO",
    image: virendraFounderImage,
    alt: "virendra's Image",
  },
  {
    key: "sarabjit",
    name: "Sarbjeet Singh Gulati",
    role: "Director - Finance",
    image: sarabjitDirectorImage,
    alt: "sarabjit's Image",
  },
];

export default function Leadership() {
  const carouselRef = useRef(null);
  const [scrollPct, setScrollPct] = useState(0);
  const [thumbPct, setThumbPct] = useState(30);

  const scrollBy = (amount) => {
    carouselRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  const handleScroll = () => {
    const el = carouselRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const pct = maxScroll > 0 ? (el.scrollLeft / maxScroll) * 100 : 0;
    setScrollPct(pct);
    setThumbPct(Math.min(100, (el.clientWidth / el.scrollWidth) * 100));
  };

  useEffect(() => {
    handleScroll();
  }, []);

  return (
    <section className="bg-white py-20 relative overflow-hidden font-['Hanken_Grotesk']" data-purpose="leadership-section">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-start gap-12 relative">
          {/* Left header */}
          <div className="lg:w-1/4 lg:-mt-3">
            <h6 className="text-[#005320] text-base tracking-widest mb-4 font-semibold">OUR LEADERSHIP</h6>
            <h2 className="text-[32px] leading-tight font-extrabold mb-6 text-[#071837]">
              Meet the People Behind <span className="text-[#005320]">H2 Softskills</span>
            </h2>
            <p className="text-sm text-[#45464e] mb-8">
              A team of passionate professionals dedicated to building a better tomorrow.
            </p>
            <button className="bg-[#005320] text-white px-6 py-3 rounded-lg flex items-center gap-2 group hover:gap-3 transition-all">
              <span className="text-[16px] font-bold">Meet Our Team</span>
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </button>

            <div className="flex gap-4 mt-8">
              <button
                className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-[#1b3322] hover:text-white hover:border-[#1b3322] transition-all"
                onClick={() => scrollBy(-300)}
                aria-label="Previous team member"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-[#1b3322] hover:text-white hover:border-[#1b3322] transition-all"
                onClick={() => scrollBy(300)}
                aria-label="Next team member"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Carousel */}
          <div className="lg:w-3/4 w-full relative">
            <div
              ref={carouselRef}
              onScroll={handleScroll}
              className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scroll-smooth"
            >
              {TEAM.map((member) => (
                <div
                  key={member.key}
                  className="w-[240px] flex-shrink-0 bg-white rounded-xl shadow-sm border border-gray-100 snap-start group overflow-hidden flex flex-col"
                >
                  <div className="w-full h-[250px] relative shrink-0">
                    <img
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      alt={member.alt}
                      src={member.image}
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4 flex flex-col justify-center gap-1">
                    <h3 className="text-base font-bold text-[#1b3322] leading-snug">{member.name}</h3>
                    <p className="text-sm text-gray-500">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#1b3322] transition-all duration-150"
                style={{
                  width: `${thumbPct}%`,
                  transform: `translateX(${(scrollPct * (100 - thumbPct)) / thumbPct}%)`,
                }}
              />
            </div>

            <div className="mt-6 flex justify-center">
              {/* <button className="border-2 border-[#071837] text-[#071837] px-8 py-3 rounded-lg font-bold hover:bg-[#071837] hover:text-white transition-all">
                Meet Our Entire Team
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}