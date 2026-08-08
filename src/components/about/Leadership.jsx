import { useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import virendraFounderImage from "../../assets/honey-director.jpeg";
import sarabjitDirectorImage from "../../assets/Sarabjit-director.jpeg";
const LinkedinIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

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
    name: "Sarabjit Singh Gulati",
    role: "Director - Finance",
    image: sarabjitDirectorImage,
    alt: "sarabjit's Image",
  },
];

export default function Leadership() {
  const carouselRef = useRef(null);

  const scrollBy = (amount) => {
    carouselRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="bg-white py-20 relative overflow-hidden font-['Hanken_Grotesk']" data-purpose="leadership-section">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-start gap-12 relative">
          {/* Left header */}
          <div className="lg:w-1/4 lg:-mt-3">
            <h6 className="text-[#1b3322] text-xs tracking-widest mb-4 font-semibold">OUR LEADERSHIP</h6>
            <h2 className="text-[32px] leading-tight font-extrabold mb-6 text-[#1b3322]">
              Meet the People Behind <span className="text-[#1b3322]">H2 Softskills</span>
            </h2>
            <p className="text-sm text-gray-500 mb-8">
              A team of passionate professionals dedicated to building a better tomorrow.
            </p>
            {/* <button className="bg-[#1b3322] text-white px-6 py-3 rounded-lg flex items-center gap-2 group hover:gap-3 transition-all font-bold">
              <span className="text-[16px]">Meet Our Team</span>
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </button> */}

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
              className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scroll-smooth"
            >
              {TEAM.map((member) => (
                <div
                  key={member.key}
                  className="w-[220px] h-[300px] flex-shrink-0 bg-white rounded-xl shadow-sm border border-gray-100 snap-start group overflow-hidden flex flex-col"
                >
                  <div className="w-full h-[220px] relative shrink-0">
                    <img
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      alt={member.alt}
                      src={member.image}
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4 flex justify-between items-start gap-2 h-[80px]">
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-[#1b3322] truncate">{member.name}</h3>
                      <p className="text-xs text-gray-500 line-clamp-2">{member.role}</p>
                    </div>
                    <div className="text-[#0077b5] shrink-0">
                      <LinkedinIcon />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-2 mt-4">
              <div className="h-2 w-2 rounded-full bg-[#c1ff00]" />
              <div className="h-2 w-2 rounded-full bg-gray-200" />
              <div className="h-2 w-2 rounded-full bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}