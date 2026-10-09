import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { cottageImages } from '../data/cottageData';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function HillViewCottagePage() {
  const containerRef = useRef(null);

  useGSAP(() => {
    // Header animations
    gsap.from(".animate-header > *", {
      opacity: 0,
      y: 20,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out"
    });

    // Gallery entrance
    gsap.from(".gallery-item", {
      opacity: 0,
      scale: 0.95,
      y: 30,
      duration: 1,
      stagger: 0.1,
      ease: "power3.out",
      delay: 0.2
    });

    // Content sections fade up on scroll
    const sections = gsap.utils.toArray(".content-section");
    sections.forEach((section) => {
      gsap.from(section, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
        }
      });
    });

    // Sticky card entrance
    gsap.from(".sticky-card", {
      opacity: 0,
      x: 30,
      duration: 1,
      ease: "power3.out",
      delay: 0.4
    });
  }, { scope: containerRef });

  return (
    <>
      <main ref={containerRef} className="min-h-screen bg-white pt-28 pb-32 lg:pb-24 px-4 sm:px-6 md:px-10 lg:px-12">
        <div className="max-w-7xl mx-auto">
          
          {/* 1. BREADCRUMB & HEADER */}
          <header className="mb-6 animate-header">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-2">
              <Link to="/cottage" className="hover:text-neutral-900 transition-colors">COTTAGES</Link>
              <span>- </span>
              <span>SWALEDALE</span>
              <span>- </span>
              <span>LOW ROW</span>
              <span>- </span>
              <span className="text-neutral-900">YORKSHIRE DALES NATIONAL PARK</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900">
                  Hill View Stone Cottage
                </h1>
                <p className="mt-2 text-sm sm:text-base text-neutral-600">
                  A spacious 18th-century stone retreat overlooking Swaledale valley.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200/60">
                  ⭐ 15% Off Last-Minute Stays
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-neutral-100 text-neutral-700 text-xs font-semibold">
                  10% Off 7+ Nights
                </span>
              </div>
            </div>
          </header>

          {/* 2. EDITORIAL 5-PHOTO MOSAIC */}
          <section className="relative mb-12 rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-4 gap-3 h-[420px] md:h-[520px]">
            <div className="gallery-item md:col-span-2 h-full rounded-2xl overflow-hidden group relative">
              <img src={cottageImages.panoramicDales} alt="Hill View Stone Cottage Exterior" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="hidden md:grid md:col-span-1 grid-rows-2 gap-3 h-full">
              <div className="gallery-item rounded-2xl overflow-hidden group relative"><img src={cottageImages.beamedDouble} alt="Beamed Living Room" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /></div>
              <div className="gallery-item rounded-2xl overflow-hidden group relative"><img src={cottageImages.kitchen} alt="Modern Kitchen" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /></div>
            </div>
            <div className="hidden md:grid md:col-span-1 grid-rows-2 gap-3 h-full">
              <div className="gallery-item rounded-2xl overflow-hidden group relative"><img src={cottageImages.cosyDouble} alt="Master Bedroom" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /></div>
              <div className="gallery-item rounded-2xl overflow-hidden group relative"><img src={cottageImages.bathroom} alt="Valley Deck Views" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /></div>
            </div>
            <Link to="/gallery" className="absolute bottom-5 right-5 px-5 py-2.5 rounded-full bg-white/90 hover:bg-white text-neutral-900 text-xs font-semibold shadow-lg backdrop-blur-md flex items-center gap-2 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
              <span>View all 32 photos</span>
            </Link>
          </section>

          {/* 3. KEY METRICS STRIP */}
          <section className="content-section grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-3xl bg-[#FBFBFA] border border-neutral-200/80 mb-12">
            <div className="text-center sm:text-left sm:border-r border-neutral-200/70 sm:pr-4">
              <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold">MAX GUESTS</span>
              <p className="text-2xl font-bold text-neutral-900 mt-1">6 Guests</p>
            </div>
            <div className="text-center sm:text-left sm:border-r border-neutral-200/70 sm:pr-4">
              <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold">BEDROOMS</span>
              <p className="text-2xl font-bold text-neutral-900 mt-1">3 Bedrooms</p>
            </div>
            <div className="text-center sm:text-left sm:border-r border-neutral-200/70 sm:pr-4">
              <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold">BATHROOMS</span>
              <p className="text-2xl font-bold text-neutral-900 mt-1">1 Bathroom</p>
            </div>
            <div className="text-center sm:text-left">
              <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold">PROPERTY SIZE</span>
              <p className="text-2xl font-bold text-neutral-900 mt-1">180 m²</p>
            </div>
          </section>

          {/* 4. 2-COLUMN SPLIT (65% CONTENT / 35% STICKY SMOOBU CARD) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* LEFT STREAM (8 COLS) */}
            <div className="lg:col-span-8 space-y-16">
              
              {/* THE SPACE NARRATIVE */}
              <section className="content-section space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900">
                  About the Cottage
                </h2>
                <p className="text-base md:text-lg leading-relaxed text-neutral-600">
                  Hill View Stone Cottage offers all the warmth and character of a classic Yorkshire Dales cottage, thoughtfully updated to create a welcoming and comfortable home from home. Exposed beams, stone details, and carefully styled interiors create a relaxing atmosphere from the moment you arrive.
                </p>
                <p className="text-base leading-relaxed text-neutral-600">
                  Two generous living rooms form the heart of the cottage, featuring a wood-burning stove, Smart TV, and high-end sound systems. Adjacent to the living room, a large dining area accommodates family gatherings and celebratory dinners. A separate modern kitchen and utility room (with washing machine, dryer, and extra fridge) provide seamless self-catering convenience.
                </p>
              </section>

              {/* BEDROOMS SETUP CARDS */}
              <section className="content-section space-y-6 pt-10 border-t border-neutral-200/70">
                <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
                  Where You'll Sleep
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-6 rounded-3xl bg-[#FBFBFA] border border-neutral-200/80">
                    <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">BEDROOM 1</span>
                    <h3 className="text-lg font-bold text-neutral-900 mt-1">King Suite</h3>
                    <p className="text-xs text-neutral-500 mt-2">1 King Size Bed -  Wardrobe, armchair & sideboard with valley light.</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-[#FBFBFA] border border-neutral-200/80">
                    <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">BEDROOM 2</span>
                    <h3 className="text-lg font-bold text-neutral-900 mt-1">Twin Room</h3>
                    <p className="text-xs text-neutral-500 mt-2">2 Single Beds -  Wardrobe & quiet countryside views.</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-[#FBFBFA] border border-neutral-200/80">
                    <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">BEDROOM 3</span>
                    <h3 className="text-lg font-bold text-neutral-900 mt-1">Dales Twin</h3>
                    <p className="text-xs text-neutral-500 mt-2">2 Single Beds -  Chest of drawers & exposed timber details.</p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-neutral-50 text-xs text-neutral-600 border border-neutral-200/60">
                  Additional sleeping configuration: 2 comfortable couches, 1 child bed available on request.
                </div>
              </section>

              {/* AMENITIES BENTO */}
              <section className="content-section space-y-6 pt-10 border-t border-neutral-200/70">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold tracking-tight text-neutral-900">What This Cottage Offers</h2>
                  <span className="text-xs font-mono text-neutral-400 hidden sm:inline-block">30+ Premium Amenities</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-sm">
                  <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center gap-3">
                    <span className="text-neutral-900 font-bold">🔥</span><span>Indoor Wood Stove</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center gap-3">
                    <span className="text-neutral-900 font-bold">📶</span><span>High-Speed Wi-Fi & Ethernet</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center gap-3">
                    <span className="text-neutral-900 font-bold">🚗</span><span>Private Parking (3 Cars) + EV</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center gap-3">
                    <span className="text-neutral-900 font-bold">🍳</span><span>Fully Equipped Kitchen</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center gap-3">
                    <span className="text-neutral-900 font-bold">🧺</span><span>Washer & Tumble Dryer</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center gap-3">
                    <span className="text-neutral-900 font-bold">📺</span><span>Smart TV & Soundsystem</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center gap-3">
                    <span className="text-neutral-900 font-bold">☕</span><span>Coffee Maker & Kettle</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center gap-3">
                    <span className="text-neutral-900 font-bold">🛁</span><span>Deep Bath & Separate Shower</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center gap-3">
                    <span className="text-neutral-900 font-bold">🐾</span><span>Pets Allowed (On Request)</span>
                  </div>
                </div>
              </section>

              {/* LOCATION & GETTING AROUND BENTO */}
              <section className="content-section space-y-6 pt-10 border-t border-neutral-200/70">
                <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
                  Where You'll Be & Getting Around
                </h2>
                <p className="text-sm md:text-base leading-relaxed text-neutral-600">
                  Hill View Stone Cottage sits in the tranquil village of Low Row in Swaledale, officially recognized as an Area of Outstanding Natural Beauty. Encircled by drystone walls, open moorland, and the River Swale, with the historic Punch Bowl Inn just a short stroll away.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-3xl bg-[#FBFBFA] border border-neutral-200/80 space-y-2">
                    <h3 className="font-bold text-sm text-neutral-900">Local Dales Drives (Under 20 Mins)</h3>
                    <ul className="text-xs text-neutral-600 space-y-1.5">
                      <li>-  <strong>6 mins:</strong> Gunnerside riverside walks</li>
                      <li>-  <strong>8 mins:</strong> Reeth village green & Swaledale Museum</li>
                      <li>-  <strong>10 mins:</strong> Dales Bike Centre (Hire & Café)</li>
                      <li>-  <strong>20 mins:</strong> Buttertubs Pass mountain climb</li>
                    </ul>
                  </div>
                  <div className="p-5 rounded-3xl bg-[#FBFBFA] border border-neutral-200/80 space-y-2">
                    <h3 className="font-bold text-sm text-neutral-900">Landmarks & Rail Connections</h3>
                    <ul className="text-xs text-neutral-600 space-y-1.5">
                      <li>-  <strong>24 mins:</strong> Tan Hill Inn (Highest pub in Britain)</li>
                      <li>-  <strong>30 mins:</strong> Richmond Castle & Georgian Theatre</li>
                      <li>-  <strong>49 mins:</strong> Ribblehead Viaduct</li>
                      <li>-  <strong>50–52 mins:</strong> Northallerton & Darlington Mainline Rail</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* HOUSE RULES ACCORDION/GRID */}
              <section className="content-section space-y-6 pt-10 border-t border-neutral-200/70">
                <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
                  House Rules & Countryside Etiquette
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm">
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 flex items-start gap-3">
                    <span className="text-lg">🤫</span>
                    <div>
                      <p className="font-bold text-neutral-900">Quiet Hours: 10:00 PM – 8:00 AM</p>
                      <p className="text-neutral-500 text-xs mt-0.5">Please respect our peaceful rural neighbours.</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 flex items-start gap-3">
                    <span className="text-lg">🚫</span>
                    <div>
                      <p className="font-bold text-neutral-900">No Parties or Events</p>
                      <p className="text-neutral-500 text-xs mt-0.5">Strictly enforced maximum occupancy (6 guests).</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 flex items-start gap-3">
                    <span className="text-lg">🚭</span>
                    <div>
                      <p className="font-bold text-neutral-900">No Smoking or Vaping</p>
                      <p className="text-neutral-500 text-xs mt-0.5">Strictly prohibited anywhere indoors.</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 flex items-start gap-3">
                    <span className="text-lg">🐾</span>
                    <div>
                      <p className="font-bold text-neutral-900">Well-Behaved Pets Welcome</p>
                      <p className="text-neutral-500 text-xs mt-0.5">Keep off furniture/beds and never leave unattended.</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 flex items-start gap-3">
                    <span className="text-lg">🧱</span>
                    <div>
                      <p className="font-bold text-neutral-900">Respect the Countryside</p>
                      <p className="text-neutral-500 text-xs mt-0.5">Do not climb dry-stone walls; be mindful of livestock.</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 flex items-start gap-3">
                    <span className="text-lg">🚽</span>
                    <div>
                      <p className="font-bold text-neutral-900">Rural Septic Care</p>
                      <p className="text-neutral-500 text-xs mt-0.5">No wipes, nappies or food down drains.</p>
                    </div>
                  </div>
                </div>
              </section>

            </div>

            {/* RIGHT STREAM: STICKY SMOOBU BOOKING CARD (4 COLS) */}
            <aside className="lg:col-span-4 hidden lg:block sticky top-28 space-y-4 sticky-card z-10">
              <div className="p-8 rounded-3xl bg-white border-2 border-neutral-900/10 shadow-2xl space-y-6">
                
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold">FROM</span>
                    <p className="text-3xl font-bold text-neutral-900">£185 <span className="text-sm font-normal text-neutral-500">/ night</span></p>
                  </div>
                  <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Direct Rate
                  </span>
                </div>

                {/* Quick Date Selector */}
                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs">
                      <span className="text-[10px] uppercase font-bold text-neutral-400 block">CHECK-IN</span>
                      <span className="font-medium text-neutral-800">Select Date</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs">
                      <span className="text-[10px] uppercase font-bold text-neutral-400 block">CHECK-OUT</span>
                      <span className="font-medium text-neutral-800">Select Date</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">GUESTS</span>
                    <span className="font-medium text-neutral-800">Up to 6 Guests</span>
                  </div>
                </div>

                {/* CTA to Smoobu */}
                <a 
                  href="https://booking.smoobu.com/client-slug" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-6 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-xl"
                >
                  <span>Check Availability</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </a>

                <div className="space-y-2 text-center text-xs text-neutral-500 pt-2 border-t border-neutral-100">
                  <p>🔒 Instant confirmation & secure Stripe/PayPal checkout.</p>
                  <p>🛡️ Fully refundable cancellation up to 6 weeks out.</p>
                </div>

              </div>
            </aside>

          </div>

        </div>
      </main>

      {/* MOBILE FLOATING CTA (ONLY VISIBLE ON SM/MD SCREENS) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-6 bg-white border-t border-neutral-200 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] z-50 lg:hidden flex items-center justify-between">
        <div>
          <p className="text-xl font-bold text-neutral-900">£185 <span className="text-sm font-normal text-neutral-500">/ night</span></p>
          <p className="text-[10px] uppercase tracking-wider text-emerald-600 font-semibold mt-0.5">Direct Rate</p>
        </div>
        <a 
          href="https://booking.smoobu.com/client-slug" 
          target="_blank"
          rel="noopener noreferrer"
          className="py-3.5 px-6 rounded-full bg-neutral-900 active:bg-neutral-800 text-white font-semibold text-sm flex items-center gap-2 shadow-md"
        >
          <span>Availability</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </a>
      </div>
    </>
  );
}
