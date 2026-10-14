import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { cottageImages } from '../data/cottageData';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function KineticTextBannerSection() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    // ── DESKTOP: Pinned kinetic word-scrub ────────────────────────────────
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const comfortSection = document.querySelector('#section-comfort');
      const comfortBg = document.querySelector('.comfort-bg img');
      const vanishWords = gsap.utils.toArray('.vanish-word');

      const comfortTl = gsap.timeline({
        scrollTrigger: {
          trigger: comfortSection,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }
      });

      comfortTl.to(comfortBg, { scale: 1.08, ease: 'none' }, 0);
      comfortTl.to(vanishWords, {
        opacity: 0, yPercent: -90, rotateX: -15, stagger: 0.15, ease: 'power2.inOut',
      }, 0.1);
      comfortTl.to(comfortSection, { scale: 0.96, borderRadius: '32px', ease: 'none' }, 0.5);
    });

    // ── MOBILE / TABLET: Simple scroll fade reveal, no pinning ────────────
    mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
      const vanishWords = gsap.utils.toArray('.vanish-word');
      gsap.from(vanishWords, {
        opacity: 0, y: 30, stagger: 0.1, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: containerRef.current, start: 'top 80%', once: true }
      });
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      const vanishWords = gsap.utils.toArray('.vanish-word');
      gsap.set(vanishWords, { opacity: 1, yPercent: 0, rotateX: 0 });
    });

    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <section id="section-comfort" ref={containerRef} className="relative w-full min-h-[60vh] lg:min-h-screen overflow-hidden flex items-center justify-center bg-white">

      {/* Background Image */}
      <div className="comfort-bg absolute inset-0 z-0 overflow-hidden">
        <img
          src={cottageImages.panoramicDales}
          alt="Hill View Stone Cottage"
          className="w-full h-full object-cover object-center brightness-[0.92]"
        />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      {/* Centered Headline */}
      <div className="comfort-content relative z-10 text-center px-6 max-w-4xl mx-auto pointer-events-none py-20 lg:py-0">
        <h2 className="comfort-title font-bold tracking-tight text-white flex flex-wrap justify-center gap-x-4 sm:gap-x-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-tight">
          <span className="inline-block overflow-hidden">
            <span className="vanish-word inline-block" style={{ transformOrigin: 'center bottom', willChange: 'transform, opacity' }}>Comfort</span>
          </span>
          <span className="inline-block overflow-hidden">
            <span className="vanish-word inline-block" style={{ transformOrigin: 'center bottom', willChange: 'transform, opacity' }}>Meets</span>
          </span>
          <span className="inline-block overflow-hidden">
            <span className="vanish-word inline-block" style={{ transformOrigin: 'center bottom', willChange: 'transform, opacity' }}>Countryside.</span>
          </span>
        </h2>
      </div>

    </section>
  );
}
