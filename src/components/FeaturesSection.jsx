import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { cottageFeatures } from '../data/cottageData';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function FeaturesSection() {
  const containerRef = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const header = document.querySelector(".features-header");
      const cards = gsap.utils.toArray(".feature-card");

      // 1. Header Entrance
      gsap.fromTo(
        header,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#section-features",
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );

      // 2. Staggered Cards Entrance (Fade & Slide Up)
      gsap.fromTo(
        cards,
        { opacity: 0, y: 70, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          ease: "power3.out",
          stagger: {
            each: 0.12, // 120ms gap between consecutive cards
            from: "start",
            grid: "auto",
          },
          scrollTrigger: {
            trigger: ".features-grid",
            start: "top 82%", // triggers when top of grid reaches 82% of viewport
            toggleActions: "play none none none",
            once: true,
            invalidateOnRefresh: true,
          },
        }
      );
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      const header = document.querySelector(".features-header");
      const cards = gsap.utils.toArray(".feature-card");
      
      gsap.set([header, cards], { opacity: 1, y: 0, scale: 1 });
    });

    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <section id="section-features" ref={containerRef} className="relative w-full py-24 md:py-32 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="features-header text-center mb-16 md:mb-20">
          <span className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-medium">
            DISCOVER YOUR PERFECT RETREAT
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight text-neutral-900 leading-tight">
            Traditional Charm.<br className="hidden sm:inline" /> Modern Comfort.
          </h2>
          <p className="mt-2 text-sm text-neutral-400">Features</p>
        </div>

        {/* 6-Card Grid */}
        <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {cottageFeatures.map((feature) => (
            <div 
              key={feature.id}
              className="feature-card group relative bg-neutral-50 rounded-2xl md:rounded-3xl p-3 md:p-4 overflow-hidden border border-neutral-100/80 transition-shadow duration-500 hover:shadow-xl"
              style={{ willChange: 'transform, opacity' }}
            >
              <div className="aspect-[4/3] w-full rounded-xl md:rounded-2xl overflow-hidden bg-neutral-200">
                <img 
                  src={feature.image} 
                  alt={feature.title} 
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                />
              </div>
              <div className="mt-4 px-2 pb-2">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400">
                  {feature.tag}
                </span>
                <h3 className="text-base md:text-lg font-semibold text-neutral-900 mt-0.5">
                  {feature.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
