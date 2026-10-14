import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowLeft, ArrowRight, Expand } from 'lucide-react';
import { Link } from 'react-router-dom';
import { galleryItems } from '../data/cottageData';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function GalleryCarousel({ onOpenBooking }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    // ── DESKTOP: Pinned horizontal scroll lookbook ────────────────────────
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const track = trackRef.current;
      if (!track) return;

      const totalScroll = track.scrollWidth - window.innerWidth + 120;

      gsap.to(track, {
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
    });

    // ── MOBILE / TABLET: Native touch-swipe track (no GSAP pinning needed)
    // CSS handles the snap scrolling — nothing to register with GSAP here.

    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <section id="gallery" ref={sectionRef} className="relative bg-white text-neutral-900 overflow-x-hidden">

      {/* Gallery Header */}
      <div className="px-5 sm:px-6 md:px-12 lg:px-20 max-w-7xl mx-auto w-full flex items-end justify-between pt-12 sm:pt-16 pb-4 lg:pb-4 lg:h-auto">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400 block mb-1.5">
            IMMERSIVE GALLERY
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif-editorial font-medium tracking-tight text-neutral-900">
            Life at Hill View
          </h2>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <p className="text-xs text-neutral-500 tracking-wider uppercase font-medium hidden md:block">
            Swipe to explore
          </p>
          <Link
            to="/gallery"
            className="px-4 py-2 rounded-full border border-neutral-200 text-xs font-semibold uppercase tracking-widest text-neutral-700 hover:bg-neutral-900 hover:text-white transition-all min-h-[44px] flex items-center"
          >
            Full Gallery
          </Link>
        </div>
      </div>

      {/* ── MOBILE / TABLET: Native touch-swipeable snap track ── */}
      <div className="lg:hidden pb-8 pt-4">
        <div
          ref={trackRef}
          className="flex gap-4 px-5 sm:px-6 overflow-x-auto snap-x snap-mandatory scrollbar-none"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {galleryItems.map((item, index) => (
            <div
              key={index}
              className="snap-start flex-shrink-0 relative w-[82vw] sm:w-[65vw] aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200/60 shadow-lg"
            >
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-white/80 block mb-1">
                  0{index + 1} / 0{galleryItems.length}
                </span>
                <h3 className="text-base font-serif-editorial font-semibold text-white drop-shadow">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between px-5 sm:px-6 mt-4 text-xs text-neutral-500">
          <span>Swaledale • Yorkshire Dales National Park</span>
          <Link to="/gallery" className="font-semibold text-neutral-900 underline underline-offset-2 min-h-[44px] flex items-center">
            View all photos →
          </Link>
        </div>
      </div>

      {/* ── DESKTOP: Pinned Horizontal Lookbook ── */}
      <div className="hidden lg:flex flex-col justify-between h-screen py-12">
        <div className="flex-1 flex items-center overflow-hidden w-full">
          <div
            ref={trackRef}
            className="flex gap-6 md:gap-8 px-6 md:px-12 lg:px-20 will-change-transform"
          >
            {galleryItems.map((item, index) => (
              <div
                key={index}
                className="relative h-[65vh] w-[38vw] flex-shrink-0 overflow-hidden rounded-3xl group bg-neutral-100 border border-neutral-200/60 shadow-xl"
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
                    <h3 className="text-lg lg:text-xl font-serif-editorial font-semibold text-white drop-shadow">
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

        <div className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto w-full flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-neutral-200/60">
          <span>Swaledale • Yorkshire Dales National Park</span>
          <span>8 High-Resolution Exterior & Interior Views</span>
        </div>
      </div>

    </section>
  );
}
