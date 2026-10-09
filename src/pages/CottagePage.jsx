import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { cottageImages } from '../data/cottageData';

export default function CottagePage() {
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.from(".animate-fadeIn", {
      opacity: 0,
      y: 20,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out"
    });
  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="min-h-screen bg-[#FBFBFA] pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-16 md:mb-20 max-w-3xl animate-fadeIn">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-neutral-400 font-semibold mb-3">
            <span className="inline-block w-2 h-2 rounded-full bg-neutral-900"></span>
            <span>OUR PROPERTIES</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-neutral-900 leading-tight">
            The Cottages
          </h1>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-neutral-600">
            Discover our collection of thoughtfully restored retreats in the heart of the Yorkshire Dales.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn">
          
          {/* Chalet le Joyau Card */}
          <div className="group rounded-3xl bg-white border border-neutral-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col">
            <Link to="/chalet-le-joyau" className="block h-64 overflow-hidden relative">
              <img src={cottageImages.hero} alt="Chalet le Joyau" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-neutral-900 shadow-sm">
                Up to 6 Guests
              </div>
            </Link>
            <div className="p-8 flex flex-col flex-grow">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-400 font-semibold mb-2">
                <span>SWALEDALE</span>
                <span>-</span>
                <span>YORKSHIRE DALES</span>
              </div>
              <Link to="/chalet-le-joyau" className="block">
                <h3 className="text-2xl font-bold text-neutral-900 mb-3 group-hover:text-emerald-700 transition-colors">Chalet le Joyau</h3>
              </Link>
              <p className="text-neutral-600 text-sm leading-relaxed mb-8 flex-grow">
                A spacious 18th-century stone retreat overlooking Swaledale valley, thoughtfully updated to create a welcoming and comfortable home from home.
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                 <span className="px-2.5 py-1 rounded-md bg-neutral-50 border border-neutral-100 text-xs text-neutral-600 font-medium">3 Bedrooms</span>
                 <span className="px-2.5 py-1 rounded-md bg-neutral-50 border border-neutral-100 text-xs text-neutral-600 font-medium">1 Bathroom</span>
                 <span className="px-2.5 py-1 rounded-md bg-neutral-50 border border-neutral-100 text-xs text-neutral-600 font-medium">Wood Stove</span>
              </div>

              <div className="flex items-center justify-between mt-auto pt-6 border-t border-neutral-100">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">FROM</span>
                  <div className="text-sm">
                    <span className="font-bold text-lg text-neutral-900">£185</span> <span className="text-neutral-500">/ night</span>
                  </div>
                </div>
                <Link to="/chalet-le-joyau" className="px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-sm transition-colors shadow-md hover:shadow-lg">
                  Book Now
                </Link>
              </div>
            </div>
          </div>

          {/* Hill View Stone Cottage Card */}
          <div className="group rounded-3xl bg-white border border-neutral-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col">
            <Link to="/hill-view-cottage" className="block h-64 overflow-hidden relative">
              <img src={cottageImages.panoramicDales} alt="Hill View Stone Cottage" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-neutral-900 shadow-sm">
                Up to 6 Guests
              </div>
            </Link>
            <div className="p-8 flex flex-col flex-grow">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-400 font-semibold mb-2">
                <span>SWALEDALE</span>
                <span>-</span>
                <span>YORKSHIRE DALES</span>
              </div>
              <Link to="/hill-view-cottage" className="block">
                <h3 className="text-2xl font-bold text-neutral-900 mb-3 group-hover:text-emerald-700 transition-colors">Hill View Stone Cottage</h3>
              </Link>
              <p className="text-neutral-600 text-sm leading-relaxed mb-8 flex-grow">
                A spacious 18th-century stone retreat overlooking Swaledale valley, thoughtfully updated to create a welcoming and comfortable home from home.
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                 <span className="px-2.5 py-1 rounded-md bg-neutral-50 border border-neutral-100 text-xs text-neutral-600 font-medium">3 Bedrooms</span>
                 <span className="px-2.5 py-1 rounded-md bg-neutral-50 border border-neutral-100 text-xs text-neutral-600 font-medium">1 Bathroom</span>
                 <span className="px-2.5 py-1 rounded-md bg-neutral-50 border border-neutral-100 text-xs text-neutral-600 font-medium">Wood Stove</span>
              </div>

              <div className="flex items-center justify-between mt-auto pt-6 border-t border-neutral-100">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">FROM</span>
                  <div className="text-sm">
                    <span className="font-bold text-lg text-neutral-900">£185</span> <span className="text-neutral-500">/ night</span>
                  </div>
                </div>
                <Link to="/hill-view-cottage" className="px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-sm transition-colors shadow-md hover:shadow-lg">
                  Book Now
                </Link>
              </div>
            </div>
          </div>
          
        </div>

      </div>
    </main>
  );
}
