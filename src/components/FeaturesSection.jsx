import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { cottageFeatures } from '../data/cottageData';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function FeaturesSection() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    // ── DESKTOP ≥1024px: Staggered batch scroll reveal ────────────────────
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const header = containerRef.current?.querySelector('.features-header');
      const cards  = gsap.utils.toArray('.feature-card', containerRef.current);

      // Header entrance
      if (header) {
        gsap.fromTo(header,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.9, ease: 'power2.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );
      }

      // Staggered card entrance — desktop: grid stagger, each 120ms
      if (cards.length) {
        gsap.fromTo(cards,
          { opacity: 0, y: 60, scale: 0.97 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.8, ease: 'power3.out',
            stagger: { each: 0.12, from: 'start', grid: 'auto' },
            scrollTrigger: {
              trigger: containerRef.current?.querySelector('.features-grid'),
              start: 'top 82%',
              once: true,
              invalidateOnRefresh: true,
            },
          }
        );
      }
    });

    // ── MOBILE <1024px: Sequential one-by-one fade-up scrub ───────────────
    mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
      const header = containerRef.current?.querySelector('.features-header');
      const cards  = gsap.utils.toArray('.feature-card', containerRef.current);

      // Header entrance
      if (header) {
        gsap.fromTo(header,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }

      // Mobile: each card fades up independently on scroll — stagger 0.15s
      // Use ScrollTrigger.batch for per-card on-enter triggers
      if (cards.length) {
        // Set initial state
        gsap.set(cards, { opacity: 0, y: 40 });

        ScrollTrigger.batch(cards, {
          onEnter: (els) => {
            gsap.to(els, {
              opacity: 1, y: 0,
              duration: 0.7, ease: 'power2.out',
              stagger: 0.15,
              overwrite: true,
            });
          },
          once: true,
          start: 'top 88%',
          invalidateOnRefresh: true,
        });
      }
    });

    // Reduced-motion fallback: show everything instantly
    mm.add('(prefers-reduced-motion: reduce)', () => {
      const header = containerRef.current?.querySelector('.features-header');
      const cards  = gsap.utils.toArray('.feature-card', containerRef.current);
      gsap.set([header, ...cards].filter(Boolean), { opacity: 1, y: 0, scale: 1, clearProps: 'all' });
    });

    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <section id="section-features" ref={containerRef} className="relative w-full py-20 md:py-28 lg:py-36 px-5 sm:px-6 md:px-12 bg-white overflow-x-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="features-header text-center mb-14 md:mb-20">
          <span className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-semibold">
            DISCOVER YOUR PERFECT RETREAT
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-serif-editorial font-bold tracking-tight text-neutral-900 leading-tight">
            Traditional Charm.<br className="hidden sm:inline" /> Modern Comfort.
          </h2>
          <p className="mt-3 text-sm text-neutral-400 font-light">Features & Highlights</p>
        </div>

        {/* 6-Card Grid */}
        <div className="features-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
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
