import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { cottageImages } from '../data/cottageData';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function MetricsAndClosing({ onOpenBooking }) {
  const containerRef = useRef(null);
  const metricsRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo('.metric-item',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: metricsRef.current,
          start: 'top 85%',
        }
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="bg-white text-neutral-900">
      
      {/* 4-Column Spec Metric Bar */}
      <div ref={metricsRef} className="border-t border-b border-neutral-200/60 bg-neutral-50">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-neutral-200/60 max-w-7xl mx-auto">
          
          <div className="metric-item p-8 md:p-12 text-center">
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-neutral-400 block mb-2">
              Bedrooms
            </span>
            <span className="text-4xl md:text-6xl font-serif-editorial font-medium text-neutral-900">
              4
            </span>
          </div>

          <div className="metric-item p-8 md:p-12 text-center">
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-neutral-400 block mb-2">
              Sleeps
            </span>
            <span className="text-4xl md:text-6xl font-serif-editorial font-medium text-neutral-900">
              8
            </span>
          </div>

          <div className="metric-item p-8 md:p-12 text-center">
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-neutral-400 block mb-2">
              Bathrooms
            </span>
            <span className="text-4xl md:text-6xl font-serif-editorial font-medium text-neutral-900">
              2
            </span>
          </div>

          <div className="metric-item p-8 md:p-12 text-center">
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-neutral-400 block mb-2">
              Location
            </span>
            <span className="text-2xl md:text-4xl font-serif-editorial font-medium text-neutral-900">
              Low Row
            </span>
          </div>

        </div>
      </div>

      {/* Editorial Story Highlight */}
      <div id="about" className="px-6 py-24 md:px-12 md:py-36 lg:px-20 max-w-5xl mx-auto text-center">
        <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold block mb-6">
          ABOUT HILL VIEW
        </span>
        <p className="text-2xl md:text-4xl lg:text-5xl font-serif-editorial font-light leading-relaxed text-neutral-600">
          Hill View blends the traditional charm of a Yorkshire Dales stone cottage with every modern comfort — a spacious countryside retreat for families, couples and friends who love the great outdoors.
        </p>

        <div className="mt-12 flex justify-center">
          <button
            onClick={onOpenBooking}
            className="rounded-full bg-neutral-900 hover:bg-neutral-800 text-white px-8 py-4 text-xs font-semibold uppercase tracking-widest transition-all duration-300 shadow-xl shadow-neutral-500/20 active:scale-95"
          >
            Reserve Your Stay Direct
          </button>
        </div>
      </div>

      {/* Full-bleed Panoramic Terrace closing photo */}
      <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden">
        <img
          src={cottageImages.terrace}
          alt="Terrace overlooking the Yorkshire Dales at Hill View"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
      </div>

    </section>
  );
}
