import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { useGSAP } from '@gsap/react';
import { Grid, Columns, Maximize2, X, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { cottageImages } from '../data/cottageData';

gsap.registerPlugin(ScrollTrigger, Flip, useGSAP);

const GALLERY_ITEMS = [
  { id: 1, title: "Beamed Living Room", category: "Living & Beams", aspect: "aspect-[16/10]", src: cottageImages.livingRoom, tag: "Ground Floor" },
  { id: 2, title: "Master Bedroom Suite", category: "Bedrooms & Suites", aspect: "aspect-[3/4]", src: cottageImages.masterBed || '/images/master-bed.jpg', tag: "Sleeps 2 - Valley View" },
  { id: 3, title: "Freestanding Soaking Tub", category: "Bathrooms", aspect: "aspect-square", src: cottageImages.bathroom || '/images/bathroom-1.jpg', tag: "Ensuite" },
  { id: 4, title: "Country Kitchen & Aga", category: "Kitchen & Dining", aspect: "aspect-[4/3]", src: cottageImages.kitchen || '/images/kitchen-1.jpg', tag: "Fully Equipped" },
  { id: 5, title: "Valley Sunset from Deck", category: "Gardens & Dales Views", aspect: "aspect-[16/9]", src: cottageImages.terrace, tag: "Outdoor Living" },
  { id: 6, title: "Beamed Dining Area", category: "Living & Beams", aspect: "aspect-square", src: cottageImages.diningRoom, tag: "Seats 8" },
  { id: 7, title: "Double Bedroom", category: "Bedrooms & Suites", aspect: "aspect-[16/10]", src: cottageImages.beamedDouble, tag: "Cozy Space" },
  { id: 8, title: "Cottage Exterior", category: "Gardens & Dales Views", aspect: "aspect-[3/4]", src: cottageImages.hero, tag: "Low Row" },
  { id: 9, title: "Living Room Detail", category: "Living & Beams", aspect: "aspect-square", src: cottageImages.livingRoom2 || '/images/living-2.jpg', tag: "Wood Burner" },
  { id: 10, title: "Twin Bedroom", category: "Bedrooms & Suites", aspect: "aspect-[4/5]", src: cottageImages.twinBed || '/images/twin.jpg', tag: "Sleeps 2" },
  { id: 11, title: "Modern Bathroom", category: "Bathrooms", aspect: "aspect-[16/9]", src: cottageImages.bathroom2 || '/images/bathroom-2.jpg', tag: "Family Bath" },
  { id: 12, title: "Kitchen Detail", category: "Kitchen & Dining", aspect: "aspect-square", src: cottageImages.kitchen2 || '/images/kitchen-2.jpg', tag: "Breakfast Bar" },
];

const CATEGORIES = [
  "All Spaces",
  "Living & Beams",
  "Bedrooms & Suites",
  "Kitchen & Dining",
  "Bathrooms",
  "Gardens & Dales Views"
];

export default function GalleryPage({ onOpenBooking }) {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState("All Spaces");
  const [viewMode, setViewMode] = useState("masonry"); // 'masonry' | 'lookbook'
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const galleryWrapperRef = useRef(null);
  const horizontalTrackRef = useRef(null);
  const horizontalScrollTriggerRef = useRef(null);

  // Initial Entrance Animation
  useGSAP(() => {
    gsap.from(".gallery-title-line", {
      yPercent: 100,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.1
    });

    gsap.from(".gallery-subtitle", {
      y: 20,
      opacity: 0,
      duration: 0.9,
      delay: 0.3,
      ease: "power2.out"
    });
  }, { scope: headerRef });

  // Masonry Grid Scroll Animations
  useGSAP(() => {
    if (viewMode === 'masonry') {
      ScrollTrigger.batch(".gallery-item", {
        interval: 0.1,
        onEnter: batch => gsap.fromTo(batch, 
          { opacity: 0, y: 50 }, 
          { opacity: 1, y: 0, stagger: 0.08, ease: "power2.out", overwrite: true }
        ),
      });
    }
  }, [viewMode, activeCategory]);

  // Handle Category Filter with GSAP Flip
  const handleCategoryChange = (cat) => {
    if (cat === activeCategory || viewMode === 'lookbook') return;
    
    const state = Flip.getState(".gallery-item");
    setActiveCategory(cat);
    
    // We let React re-render, then run Flip in useGSAP effect
  };

  useGSAP(() => {
    if (viewMode === 'masonry' && galleryWrapperRef.current) {
      Flip.from(Flip.getState(".gallery-item"), {
        duration: 0.7,
        ease: "power3.inOut",
        stagger: 0.04,
        absolute: true,
        onEnter: elements => gsap.fromTo(elements, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.4 }),
        onLeave: elements => gsap.to(elements, { opacity: 0, scale: 0.9, duration: 0.4 })
      });
      ScrollTrigger.refresh();
    }
  }, [activeCategory]);

  // Horizontal Lookbook Mode
  useGSAP(() => {
    if (viewMode === 'lookbook' && horizontalTrackRef.current) {
      const track = horizontalTrackRef.current;
      const totalWidth = track.scrollWidth - window.innerWidth;

      if (totalWidth > 0) {
        horizontalScrollTriggerRef.current = gsap.to(track, {
          x: -totalWidth,
          ease: "none",
          scrollTrigger: {
            trigger: galleryWrapperRef.current,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${totalWidth}`,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              gsap.to(".lookbook-progress", { scaleX: self.progress, duration: 0.1 });
            }
          }
        });
      }
    }

    return () => {
      if (horizontalScrollTriggerRef.current) {
        horizontalScrollTriggerRef.current.scrollTrigger?.kill();
        horizontalScrollTriggerRef.current.kill();
      }
    };
  }, [viewMode, activeCategory]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowLeft') setLightboxIndex(prev => prev > 0 ? prev - 1 : filteredItems.length - 1);
      if (e.key === 'ArrowRight') setLightboxIndex(prev => prev < filteredItems.length - 1 ? prev + 1 : 0);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  const filteredItems = GALLERY_ITEMS.filter(item => activeCategory === "All Spaces" || item.category === activeCategory);

  const toggleViewMode = (mode) => {
    if (mode === viewMode) return;
    setViewMode(mode);
    if (mode === 'lookbook') setActiveCategory("All Spaces"); // Reset filter for lookbook to ensure full track
    setTimeout(() => ScrollTrigger.refresh(), 100);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-white text-neutral-900 pt-24 pb-0 overflow-x-hidden">
      
      {/* 2. Editorial Page Header */}
      <section ref={headerRef} className="px-5 sm:px-6 md:px-12 lg:px-20 max-w-7xl mx-auto pt-10 sm:pt-16 pb-8 sm:pb-12 text-center">
        <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold block mb-4 sm:mb-6">
          DISCOVER THE SPACES • {GALLERY_ITEMS.length} CURATED MOMENTS
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif-editorial font-medium tracking-tight text-neutral-900 mb-4 sm:mb-6 overflow-hidden">
          <span className="block gallery-title-line">Moments at</span>
          <span className="block gallery-title-line">Hill View.</span>
        </h1>
        <p className="gallery-subtitle text-base sm:text-lg md:text-xl text-neutral-500 font-light max-w-2xl mx-auto leading-relaxed">
          An unfiltered architectural look into cottage life, Swaledale countryside, and handcrafted stone interiors.
        </p>
      </section>

      {/* 3. Floating Control Bar */}
      <div className="sticky top-24 z-40 px-4 md:px-6 mb-12 flex justify-center pointer-events-none">
        <div className="backdrop-blur-xl bg-white/85 border border-neutral-200/80 rounded-full px-4 py-3 flex flex-wrap md:flex-nowrap items-center justify-between gap-4 shadow-xl shadow-black/5 pointer-events-auto w-full max-w-5xl">
          
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1 md:pb-0">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                disabled={viewMode === 'lookbook'}
                className={`whitespace-nowrap px-3 sm:px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-300 min-h-[40px] ${
                  activeCategory === cat 
                    ? 'bg-neutral-900 text-white shadow-md' 
                    : 'bg-transparent text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
                } ${viewMode === 'lookbook' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {cat === "All Spaces" ? `All (${GALLERY_ITEMS.length})` : cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 border-l border-neutral-200 pl-4 shrink-0">
            <button 
              onClick={() => toggleViewMode('masonry')}
              className={`p-2 rounded-full transition-colors ${viewMode === 'masonry' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-400 hover:text-neutral-900'}`}
              title="Masonry Grid"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => toggleViewMode('lookbook')}
              className={`p-2 rounded-full transition-colors ${viewMode === 'lookbook' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-400 hover:text-neutral-900'}`}
              title="Horizontal Lookbook"
            >
              <Columns className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* 4. Dual-View Gallery Container */}
      <div ref={galleryWrapperRef} className="w-full relative pb-16 sm:pb-24">
        
        {viewMode === 'masonry' && (
          <div className="px-4 sm:px-6 md:px-12 lg:px-20 max-w-[1600px] mx-auto columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-6 md:gap-8 space-y-4 sm:space-y-6 md:space-y-8">
            {filteredItems.map((item, index) => (
              <div 
                key={item.id}
                data-flip-id={`img-${item.id}`}
                className="gallery-item relative rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200/60 shadow-sm group cursor-pointer break-inside-avoid"
                onClick={() => setLightboxIndex(index)}
              >
                <div className={`relative w-full ${item.aspect} overflow-hidden`}>
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="backdrop-blur-md bg-white/90 border border-black/5 text-neutral-900 px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider shadow-sm">
                      {item.category}
                    </span>
                  </div>
                  
                  {/* Hover Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <div className="w-full flex justify-between items-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <div>
                        <p className="text-white font-serif-editorial text-xl mb-1">{item.title}</p>
                        <p className="text-white/70 text-xs font-light tracking-wide uppercase">{item.tag}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white">
                        <Maximize2 className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'lookbook' && (
          <div className="h-screen w-full overflow-hidden flex flex-col relative bg-neutral-50 pt-12">
            <div ref={horizontalTrackRef} className="flex items-center h-full gap-12 px-[10vw] pb-24 will-change-transform">
              {filteredItems.map((item, index) => (
                <div key={item.id} className="relative h-[70vh] flex-shrink-0 flex items-center gap-8 group" onClick={() => setLightboxIndex(index)}>
                  <div className={`relative h-full ${item.aspect} overflow-hidden rounded-xl shadow-2xl border border-neutral-200/50 cursor-pointer`}>
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                      <Maximize2 className="w-5 h-5 text-neutral-900" />
                    </div>
                  </div>
                  <div className="w-64 space-y-4 hidden lg:block opacity-60 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 block border-b border-neutral-200 pb-2">
                      0{index + 1} / {filteredItems.length}
                    </span>
                    <h3 className="text-3xl font-serif-editorial text-neutral-900 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-sm text-neutral-500 font-light">
                      {item.tag} • {item.category}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Progress Bar */}
            <div className="absolute bottom-12 left-[10vw] right-[10vw] h-px bg-neutral-200">
              <div className="lookbook-progress absolute top-0 left-0 h-full w-full bg-neutral-900 origin-left scale-x-0" />
            </div>
          </div>
        )}

      </div>

      {/* 5. Fullscreen Editorial Lightbox Modal */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-white/98 backdrop-blur-2xl animate-fadeIn">
          {/* Mobile: Bottom-sheet style; Desktop: centered modal */}
          <div className="flex items-center justify-between px-5 sm:px-8 pt-6 pb-4 border-b border-neutral-100">
            <div>
              <span className="text-xs uppercase tracking-widest text-neutral-400 block">{filteredItems[lightboxIndex].category}</span>
              <h3 className="text-lg sm:text-2xl font-serif-editorial text-neutral-900">{filteredItems[lightboxIndex].title}</h3>
            </div>
            <button 
              onClick={() => setLightboxIndex(null)}
              className="p-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 relative overflow-hidden">
            <img 
              src={filteredItems[lightboxIndex].src} 
              alt={filteredItems[lightboxIndex].title}
              className="w-full h-full object-contain animate-scaleIn"
            />
          </div>

          <div className="flex items-center justify-between px-5 sm:px-8 py-4 border-t border-neutral-100">
            <button 
              onClick={() => setLightboxIndex(prev => prev > 0 ? prev - 1 : filteredItems.length - 1)}
              className="p-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-full transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs text-neutral-400 uppercase tracking-widest">{lightboxIndex + 1} of {filteredItems.length}</span>
            <button 
              onClick={() => setLightboxIndex(prev => prev < filteredItems.length - 1 ? prev + 1 : 0)}
              className="p-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-full transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* 6. Direct Booking Call-to-Action Strip */}
      <section className="border-t border-neutral-200/60 bg-neutral-50 py-16 sm:py-24 px-5 sm:px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-editorial text-neutral-900 mb-3 sm:mb-4">
            Experience Hill View in Person.
          </h2>
          <p className="text-neutral-500 mb-8 sm:mb-12 text-sm sm:text-base">
            Check availability and book direct with instant confirmation.
          </p>
          
          <div className="bg-white rounded-3xl sm:rounded-full p-3 shadow-xl border border-neutral-200 max-w-3xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
             <div className="flex-1 flex items-center justify-between px-4 py-3 sm:border-r border-neutral-100 min-h-[48px]">
                <div className="text-left">
                  <span className="block text-[10px] uppercase tracking-widest text-neutral-400">Arrival</span>
                  <span className="text-sm font-medium text-neutral-900">Select Date</span>
                </div>
                <Calendar className="w-4 h-4 text-neutral-400" />
             </div>
             <div className="flex-1 flex items-center justify-between px-4 py-3 min-h-[48px]">
                <div className="text-left">
                  <span className="block text-[10px] uppercase tracking-widest text-neutral-400">Departure</span>
                  <span className="text-sm font-medium text-neutral-900">Select Date</span>
                </div>
                <Calendar className="w-4 h-4 text-neutral-400" />
             </div>
             <div className="shrink-0 w-full sm:w-auto px-2">
               <button onClick={onOpenBooking} className="w-full sm:w-auto px-8 py-4 bg-neutral-900 text-white rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-colors min-h-[48px]">
                 Check Dates
               </button>
             </div>
          </div>
        </div>
      </section>

    </div>
  );
}
