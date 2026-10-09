import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowLeft, ArrowRight, Expand } from 'lucide-react';
import { galleryItems } from '../data/cottageData';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function GalleryCarousel({ onOpenBooking }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useGSAP(() => {
    const track = trackRef.current;
    if (!track) return;

    // Pin section and scroll horizontally
    const totalScroll = track.scrollWidth - window.innerWidth + 120;

    const scrollTween = gsap.to(track, {
      x: -totalScroll,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        pin: true,
        scrub: 1,
        start: 'top top',
        end: () => `+=${totalScroll}`,
        invalidateOnRefresh: true,
      }
    });

  }, { scope: sectionRef });

  return (
    <section id="gallery" ref={sectionRef} className="relative bg-white text-neutral-900 h-screen overflow-hidden flex flex-col justify-between py-12">
      
      {/* Gallery Header */}
      <div className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto w-full flex items-end justify-between mb-4 z-10">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400 block mb-2">
            IMMERSIVE GALLERY
          </span>
          <h2 className="text-3xl md:text-5xl font-serif-editorial font-medium tracking-tight text-neutral-900">
            Life at Hill View
          </h2>
        </div>
        <p className="hidden md:block text-xs text-neutral-500 tracking-wider uppercase font-medium">
          Scroll down or drag to explore
        </p>
      </div>

      {/* Horizontal Carousel Track */}
      <div className="flex-1 flex items-center overflow-hidden w-full">
        <div 
          ref={trackRef} 
          className="flex gap-6 md:gap-8 px-6 md:px-12 lg:px-20 will-change-transform"
        >
          {galleryItems.map((item, index) => (
            <div 
              key={index}
              className="relative h-[65vh] w-[82vw] md:w-[50vw] lg:w-[38vw] flex-shrink-0 overflow-hidden rounded-3xl group bg-neutral-100 border border-neutral-200/60 shadow-xl"
            >
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
              
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-white/80 block mb-1">
                    0{index + 1} / 0{galleryItems.length}
                  </span>
                  <h3 className="text-lg md:text-xl font-serif-editorial font-semibold text-white drop-shadow">
                    {item.title}
                  </h3>
                </div>

                <button
                  onClick={onOpenBooking}
                  className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-black/5 flex items-center justify-center text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all group-hover:scale-110 shadow-sm"
                  aria-label="View photo details"
                >
                  <Expand className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto w-full flex items-center justify-between text-xs text-neutral-500 z-10 pt-2 border-t border-neutral-200/60">
        <span>Swaledale • Yorkshire Dales National Park</span>
        <span>8 High-Resolution Exterior & Interior Views</span>
      </div>

    </section>
  );
}
