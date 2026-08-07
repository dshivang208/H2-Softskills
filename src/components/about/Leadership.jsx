import { useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, Linkedin } from "lucide-react";

const TEAM = [
  {
    key: "rohit",
    name: "Rohit Malhotra",
    role: "Founder & CEO",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAtjk2UZ9zIEhB3NtldG3JogbtVw9gELCCfv0fJXpKhy-TcXuSafbyD6TVLMUNJ7AyzgVFc8kZBWmD3yHcdvYHC_BnN2A8Lw2OkONPKePYP0pzNtECS3Qbxwtkl-ZM9dzHa45VRPhzQwXAYG8ANrL-cUVQ4bLr9LlZs62gSfqfbDosfSo5L-AOMWi0Z07p7G5p6vT9mejPRv_5pZKKQMPmwZgz9JDVZHc1DPBwQaveOicH_kr65bsdS6Q",
    alt: "Rohit Malhotra, Founder and CEO",
  },
  {
    key: "neha",
    name: "Neha Sharma",
    role: "Director - Operations",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBKkPNIi5t7Doa8Cn0GA9Af6Q7_Gt08vyRsi7IykAF-grRpUGJ9mr7i_XaaOw_z32HxVWScUKpOp8KpNyALo-gPD-ehaujLTCtXo7gbovTvD5bhbN53u_QEDk0pd8fDa-UUThEhq1jcMpzGoVPyWWyMZNYI3PX1zJTQMtaO8D4vOF2f8ZzM0IoRcgXj7tsJalTq_7xxSLHfkjoaFJINb7-V2Tntf0LHvF7st6QL36KS1Ehlr6-6Cz8V_g",
    alt: "Neha Sharma, Director of Operations",
  },
  {
    key: "amit",
    name: "Amit Verma",
    role: "Director - Sales & Strategy",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCsghShq1aKGlFGmXqoBNwpd4d_aMRhv_OCdA3r0m2MLkBZGYZkXv21tc54gfQpnendptRDMoF2VY-LgRFu-NUZzttWGyz3NKFFsNzy75TXJJNfuXelScNljOSjKcvXp78blMxyV92Z13dyIASOJ8C4R2FIRPljwLvQBa2qtej7nOIy7oGnHKSA3rFGIEba8AbJn7uPOOxeAvf__eve83eIAKqouVrb31Kbd2OD1L8lpUCN1T9HQ4-NFQ",
    alt: "Amit Verma, Director of Sales and Strategy",
  },
  {
    key: "priya",
    name: "Priya Mehta",
    role: "Head - Marketing",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDDXEb9zytQGuBjWAYJEEMDYfx9eVpN1bzQuTf_9GOF1RHcQXQ1xlFGWor2xS-em9h8Nh2ua1lk5M6UstX_j0Ue3Mbt01_p5nEbp7WzPv5EMJb97g1BZFv8CyMTpeYFqtn2WfVE8T5MOTR74oUqOKkZ33DQioxAO98lTElCOL9HLze6I_nCE6yS7U6jAZWeQ9T9RaffsRRCHAc1N_NwRXt0uSfiG1hS_I4FPxiskdSKYmL4YZcV9ZmV9A",
    alt: "Priya Mehta, Head of Marketing",
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
            <button className="bg-[#1b3322] text-white px-6 py-3 rounded-lg flex items-center gap-2 group hover:gap-3 transition-all font-bold">
              <span className="text-[16px]">Meet Our Team</span>
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
                      <Linkedin className="w-5 h-5 fill-current" strokeWidth={0} />
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