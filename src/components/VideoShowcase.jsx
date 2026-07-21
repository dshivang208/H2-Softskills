import { useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

// Promo/showcase video that sits between the Services and Featured Projects
// sections on the homepage. Autoplays muted (required by browsers) with a
// single toggle button letting the visitor turn sound on/off.
function VideoShowcase() {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  return (
    <section
      className="relative py-8 md:py-12 px-6 md:px-12 max-w-[1440px] mx-auto overflow-hidden"
      data-purpose="video-showcase"
      id="video-showcase"
    >
      {/* Section Heading + Caption */}
      <div className="max-w-3xl mx-auto text-center mb-8">
        <span className="font-['Hanken_Grotesk'] text-[15px] font-bold tracking-[0.15em] text-[#004ac6] uppercase mb-4 block">
          SEE IT IN ACTION
        </span>
        <h2 className="font-['Hanken_Grotesk'] text-3xl md:text-4xl font-semibold text-[#131b2e] leading-[1.1] tracking-tight mb-4">
          A Closer Look at{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4edea3] to-[#2563eb] font-extrabold">
            How We Work
          </span>
        </h2>
        <p className="text-base text-[#434655] leading-relaxed">
          A quick walkthrough of our process, from idea to a polished,
          production-ready product.
        </p>
      </div>

      <div className="relative w-full max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-xl shadow-black/10 bg-[#020208] h-64 md:h-80 lg:h-96">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster="/media/promo-poster.jpg"
          className="w-full h-full object-contain"
        >
          <source src="/media/promo-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Mute / Unmute toggle */}
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? 'Unmute video' : 'Mute video'}
          data-purpose="video-mute-toggle"
          className="absolute bottom-4 right-4 md:bottom-6 md:right-6 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-all duration-300 hover:bg-black/80 hover:scale-105 active:scale-95"
        >
          {muted ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </button>
      </div>
    </section>
  );
}

export default VideoShowcase;