import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Bed, Users, ShieldCheck } from 'lucide-react';
import { cottageRooms } from '../data/cottageData';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function RoomsShowcase({ onOpenBooking }) {
  const containerRef = useRef(null);

  useGSAP(() => {
    ScrollTrigger.batch('.room-card', {
      onEnter: (elements) => {
        gsap.fromTo(elements,
          { opacity: 0, y: 50, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out', overwrite: true }
        );
      },
      once: true,
      start: 'top 85%',
    });
  }, { scope: containerRef });

  return (
    <section id="rooms" ref={containerRef} className="bg-neutral-50 text-neutral-900 py-24 md:py-36 border-t border-neutral-200/60">
      <div className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400 block mb-2">
              ACCOMMODATION LAYOUT
            </span>
            <h2 className="text-4xl md:text-6xl font-serif-editorial font-medium tracking-tight text-neutral-900">
              The Rooms
            </h2>
          </div>
          <p className="text-sm text-neutral-500 font-light max-w-md">
            Four spacious bedrooms sleeping up to 8 guests, plus modern bathrooms and relaxing lounge quarters.
          </p>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cottageRooms.map((room) => (
            <div
              key={room.id}
              onClick={onOpenBooking}
              className="room-card group cursor-pointer bg-white rounded-3xl overflow-hidden border border-neutral-200/60 hover:shadow-2xl hover:border-neutral-300 transition-all duration-500 shadow-md flex flex-col justify-between"
            >
              {/* Portrait Aspect Card Image */}
              <div className="relative aspect-[3/4] overflow-hidden bg-neutral-200">
                <img
                  src={room.image}
                  alt={room.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                
                {/* Badge */}
                <span className="absolute top-4 right-4 backdrop-blur-md px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-white/90 border border-black/5 text-neutral-900 shadow-sm">
                  {room.badge}
                </span>

                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-serif-editorial font-semibold text-white drop-shadow">
                    {room.title}
                  </h3>
                  <p className="text-xs text-white/90 font-light mt-1 drop-shadow">
                    {room.subtitle}
                  </p>
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="p-4 bg-white flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-neutral-500 group-hover:text-neutral-900 transition-colors">
                <span>View Details & Rates</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
