import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { cottageImages } from '../data/cottageData';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function KineticTextBannerSection() {
  const containerRef = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const comfortSection = document.querySelector("#section-comfort");
      const comfortBg = document.querySelector(".comfort-bg img");
      const vanishWords = gsap.utils.toArray(".vanish-word");

      // Timeline linked directly to scroll
      const comfortTl = gsap.timeline({
        scrollTrigger: {
          trigger: comfortSection,
          start: "top top",
          end: "+=120%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }
      });

      // 1. Subtle zoom and scale on the background image
      comfortTl.to(
        comfortBg,
        {
          scale: 1.08,
          ease: "none",
        },
        0
      );

      // 2. Words vanish one by one (fade + move upward)
      comfortTl.to(
        vanishWords,
        {
          opacity: 0,
          yPercent: -90,
          rotateX: -15, // subtle perspective tilt as it floats away
          stagger: 0.15, // consecutive delay between words
          ease: "power2.inOut",
        },
        0.1
      );

      // 3. Optional: Subtle background darkening or shrink into next section transition
      comfortTl.to(
        comfortSection,
        {
          scale: 0.96,
          borderRadius: "32px",
          ease: "none",
        },
        0.5
      );
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      // Just keep it visible for reduced motion
      const vanishWords = gsap.utils.toArray(".vanish-word");
      gsap.set(vanishWords, { opacity: 1, yPercent: 0, rotateX: 0 });
    });

    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <section id="section-comfort" ref={containerRef} className="relative w-full min-h-screen overflow-hidden flex items-center justify-center bg-white">
      
      {/* Background Image Container (with subtle parallax) */}
      <div className="comfort-bg absolute inset-0 z-0 overflow-hidden">
        <img 
          src={cottageImages.panoramicDales || "/images/exterior-full.jpg"} 
          alt="Hill View Stone Cottage" 
          className="w-full h-full object-cover object-center brightness-[0.92]"
        />
        {/* Subtle gradient overlay for contrast */}
        <div className="absolute inset-0 bg-black/25"></div>
      </div>

      {/* Centered Headline with Split Words */}
      <div className="comfort-content relative z-10 text-center px-6 max-w-4xl mx-auto pointer-events-none">
        <h2 className="comfort-title font-bold tracking-tight text-white flex flex-wrap justify-center gap-x-4 md:gap-x-6 text-4xl sm:text-6xl md:text-7xl lg:text-8xl">
          <span className="inline-block overflow-hidden"><span className="vanish-word inline-block" style={{ transformOrigin: 'center bottom', willChange: 'transform, opacity' }}>Comfort</span></span>
          <span className="inline-block overflow-hidden"><span className="vanish-word inline-block" style={{ transformOrigin: 'center bottom', willChange: 'transform, opacity' }}>Meets</span></span>
          <span className="inline-block overflow-hidden"><span className="vanish-word inline-block" style={{ transformOrigin: 'center bottom', willChange: 'transform, opacity' }}>Countryside.</span></span>
        </h2>
      </div>

    </section>
  );
}
