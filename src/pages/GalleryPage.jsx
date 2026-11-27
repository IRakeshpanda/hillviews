import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { useGSAP } from '@gsap/react';
import { Grid, Columns, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import SmoobuBookingEmbed from '../components/SmoobuBookingEmbed';
import BookingSearchForm from '../components/BookingSearchForm';
import { cottageImages } from '../data/cottageData';

gsap.registerPlugin(ScrollTrigger, Flip, useGSAP);

const GALLERY_ITEMS = [
  // Living
  { id: 1, title: "cozy living", category: "Living Room", aspect: "aspect-[16/10]", src: "/images/living/hill-view-2026-indoor-bonfire-and-lamp.jpg", tag: "Ground Floor" },
  { id: 2, title: "Beamed Living Snug", category: "Living Room", aspect: "aspect-[4/3]", src: "/images/living/hill-view-2026-yorkshire-dales-and-cousin.jpg", tag: "Main Lounge" },
  { id: 3, title: "Wood Stove Detail", category: "Living Room", aspect: "aspect-square", src: "/images/living/hill-view-2026-bonfire-on-focus.jpg", tag: "Fireside" },
  { id: 4, title: "Reading Corner", category: "Living Room", aspect: "aspect-[3/4]", src: "/images/living/hill-view-2026-living-room-books.jpg", tag: "Quiet Snug" },

  // Bedrooms
  { id: 5, title: "Master Bedroom Suite", category: "Bedrooms", aspect: "aspect-[16/10]", src: "/images/bedrooms/hill-view-2026-double-bed-front-view.jpg", tag: "Sleeps 2 - Valley Light" },
  { id: 6, title: "Beamed Double Room", category: "Bedrooms", aspect: "aspect-[4/3]", src: "/images/bedrooms/hill-view-2026-double-bed-bed-lamp.jpg", tag: "Sleeps 2" },
  { id: 7, title: "Twin Single Bedroom", category: "Bedrooms", aspect: "aspect-[16/10]", src: "/images/bedrooms/hill-view-2026-2-single-beds.jpg", tag: "Sleeps 2" },

  // Kitchen
  { id: 9, title: "Equipped Chef's Kitchen", category: "Kitchen & Dining", aspect: "aspect-[16/10]", src: "/images/kitchen/yorkshire-dales-kitchen.jpg", tag: "Full Kitchen" },
  { id: 10, title: "Country Dining Table", category: "Kitchen & Dining", aspect: "aspect-[4/3]", src: "/images/kitchen/hill-view-2026-food-dine-elegant-view.jpg", tag: "Seats 8" },

  // Bathrooms
  { id: 11, title: "Hill View Bath Room", category: "Bathrooms", aspect: "aspect-square", src: "/images/bathrooms/hill-view-bathroom.png", tag: "Main Bathroom" },
  { id: 12, title: "Hill View Bath Room Interior", category: "Bathrooms", aspect: "aspect-square", src: "/images/bathrooms/hill-view-bath-tub.png", tag: "Main Bathroom" },

  // Gardens
  { id: 13, title: "Stone Cottage Exterior", category: "Gardens & Dales Views", aspect: "aspect-[16/10]", src: "/images/gardens/yorkshire-dales-hill-view-out-side.jpg", tag: "Low Row" },
  { id: 14, title: "Private Outdoor Seating", category: "Gardens & Dales Views", aspect: "aspect-[16/9]", src: "/images/gardens/hill-view-2026-outdoor-chill-view.jpg", tag: "Valley Terrace" },
  { id: 15, title: "Swaledale Valley Fells", category: "Gardens & Dales Views", aspect: "aspect-[16/10]", src: "/images/gardens/hill-view-2026-view-of-the-hills.jpg", tag: "Countryside" }
];

const CATEGORIES = [
  "All Spaces",
  "Living Room",
  "Bedrooms",
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
  const masonryGridRef = useRef(null);
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

  // Masonry Grid Scroll Animations (with explicit cleanup on viewMode switch)
  useGSAP(() => {
    if (viewMode === 'masonry') {
      const triggers = ScrollTrigger.batch(".gallery-item", {
        interval: 0.1,
        onEnter: batch => gsap.fromTo(batch,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, stagger: 0.08, ease: "power2.out", overwrite: true }
        ),
      });

      return () => {
        triggers.forEach(t => t.kill());
      };
    }
  }, [viewMode, activeCategory]);

  // Handle Category Filter with smooth height preservation (prevents grid collapse)
  const handleCategoryChange = (cat) => {
    if (cat === activeCategory || viewMode === 'lookbook') return;

    // Lock current height before React re-renders so container never collapses
    if (masonryGridRef.current) {
      const currentH = masonryGridRef.current.offsetHeight;
      if (currentH > 0) {
        masonryGridRef.current.style.minHeight = `${currentH}px`;
      }
    }

    setActiveCategory(cat);
  };

  useGSAP(() => {
    if (viewMode === 'masonry' && masonryGridRef.current) {
      const grid = masonryGridRef.current;
      gsap.killTweensOf(grid);

      // Animate new items entering with subtle stagger
      const items = grid.querySelectorAll('.gallery-item');
      if (items.length) {
        gsap.fromTo(items,
          { opacity: 0, y: 15, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.35, stagger: 0.03, ease: 'power2.out' }
        );
      }

      // Smoothly transition container minHeight to the target height
      requestAnimationFrame(() => {
        if (!grid) return;

        const startHeight = parseFloat(grid.style.minHeight) || grid.offsetHeight;

        // Measure natural target height without locking minHeight
        grid.style.minHeight = '0px';
        const targetHeight = grid.scrollHeight;
        grid.style.minHeight = `${startHeight}px`;

        if (startHeight === targetHeight) {
          grid.style.minHeight = '';
          ScrollTrigger.refresh();
          return;
        }

        gsap.fromTo(grid,
          { minHeight: startHeight },
          {
            minHeight: targetHeight,
            duration: 0.45,
            ease: 'power2.out',
            onComplete: () => {
              if (grid) {
                grid.style.minHeight = '';
              }
              ScrollTrigger.refresh();
            }
          }
        );

        // Keep viewport comfortable if current scroll is beyond the new target height
        const gridTop = grid.getBoundingClientRect().top + window.scrollY;
        const stickyBarOffset = 110;
        if (window.scrollY > gridTop + targetHeight - 150 && targetHeight < startHeight) {
          window.scrollTo({
            top: Math.max(0, gridTop - stickyBarOffset),
            behavior: 'smooth'
          });
        }
      });
    }
  }, [activeCategory]);

  // Horizontal Lookbook Mode (accurately clamped distance & ResizeObserver to avoid blank space)
  useGSAP(() => {
    if (viewMode === 'lookbook' && horizontalTrackRef.current && galleryWrapperRef.current) {
      const track = horizontalTrackRef.current;
      const wrapper = galleryWrapperRef.current;

      gsap.set(track, { x: 0 });

      const calculateAndSetup = () => {
        // Exact travel distance so the last slide stops precisely at the right edge without overshooting into blank space
        const totalDistance = Math.max(0, track.scrollWidth - track.clientWidth);

        if (horizontalScrollTriggerRef.current) {
          horizontalScrollTriggerRef.current.scrollTrigger?.kill();
          horizontalScrollTriggerRef.current.kill();
          horizontalScrollTriggerRef.current = null;
        }

        if (totalDistance <= 0) return;

        horizontalScrollTriggerRef.current = gsap.to(track, {
          x: -totalDistance,
          ease: "none",
          scrollTrigger: {
            id: "lookbook-scroll",
            trigger: wrapper,
            pin: true,
            scrub: 1,
            start: "top 90px",
            end: () => `+=${totalDistance}`,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              gsap.to(".lookbook-progress", {
                scaleX: Math.min(1, Math.max(0, self.progress)),
                duration: 0.05,
                ease: "none"
              });
            }
          }
        });
      };

      calculateAndSetup();

      const ro = new ResizeObserver(() => {
        calculateAndSetup();
      });
      ro.observe(track);

      return () => {
        ro.disconnect();
        if (horizontalScrollTriggerRef.current) {
          horizontalScrollTriggerRef.current.scrollTrigger?.kill();
          horizontalScrollTriggerRef.current.kill();
          horizontalScrollTriggerRef.current = null;
        }
      };
    }
  }, [viewMode, activeCategory]);

  // Allow horizontal swipe/wheel on lookbook
  useEffect(() => {
    if (viewMode !== 'lookbook' || !galleryWrapperRef.current) return;

    const wrapper = galleryWrapperRef.current;
    const handleWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && horizontalScrollTriggerRef.current?.scrollTrigger) {
        e.preventDefault();
        window.scrollBy({ top: e.deltaX * 1.5, behavior: 'auto' });
      }
    };

    wrapper.addEventListener('wheel', handleWheel, { passive: false });
    return () => wrapper.removeEventListener('wheel', handleWheel);
  }, [viewMode]);

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
  const imageAspectRatios = {
    'aspect-[16/10]': '16 / 10',
    'aspect-[4/3]': '4 / 3',
    'aspect-square': '1 / 1',
    'aspect-[3/4]': '3 / 4',
    'aspect-[16/9]': '16 / 9'
  };

  const toggleViewMode = (mode) => {
    if (mode === viewMode) return;

    // Clean up lookbook animation before mode transition
    if (horizontalScrollTriggerRef.current) {
      horizontalScrollTriggerRef.current.scrollTrigger?.kill();
      horizontalScrollTriggerRef.current.kill();
      horizontalScrollTriggerRef.current = null;
    }

    // Clean up all masonry triggers
    ScrollTrigger.getAll().forEach(st => {
      if (st.vars.id === 'lookbook-scroll' || st.trigger?.classList?.contains('gallery-item')) {
        st.kill();
      }
    });

    setViewMode(mode);
    if (mode === 'lookbook') {
      setActiveCategory("All Spaces");
    }

    // Smoothly align scroll to the gallery container so user is never stranded in blank space
    requestAnimationFrame(() => {
      if (galleryWrapperRef.current) {
        const yOffset = -90;
        const y = galleryWrapperRef.current.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      }
      setTimeout(() => ScrollTrigger.refresh(), 200);
    });
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
        <div className="backdrop-blur-xl bg-white/85 border border-neutral-200/80 rounded-full px-3 py-2 sm:px-4 sm:py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between shadow-xl shadow-black/5 pointer-events-auto w-full max-w-5xl">

          <div className="w-full min-w-0 sm:flex-1 sm:min-w-0">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:flex-nowrap sm:justify-start sm:overflow-x-auto sm:pb-0">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  disabled={viewMode === 'lookbook'}
                  className={`flex-shrink-0 whitespace-nowrap px-3 py-2 rounded-full text-[10px] sm:text-xs font-medium uppercase tracking-wider transition-all duration-300 min-h-[40px] ${activeCategory === cat
                    ? 'bg-neutral-900 text-white shadow-md'
                    : 'bg-transparent text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
                    } ${viewMode === 'lookbook' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {cat === "All Spaces" ? `All (${GALLERY_ITEMS.length})` : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden sm:flex items-center justify-end gap-2 sm:border-l sm:border-neutral-200 sm:pl-4 shrink-0">
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
      <div ref={galleryWrapperRef} className={`w-full relative ${viewMode === 'masonry' ? 'pb-16 sm:pb-24' : 'pb-0'}`}>

        {viewMode === 'masonry' && (
          <div
            ref={masonryGridRef}
            className="px-4 sm:px-6 md:px-12 lg:px-20 max-w-[1600px] mx-auto columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-6 md:gap-8 space-y-4 sm:space-y-6 md:space-y-8 will-change-[min-height]"
          >
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                data-flip-id={`img-${item.id}`}
                className="gallery-item relative block rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200/60 shadow-sm group cursor-pointer break-inside-avoid"
                onClick={() => setLightboxIndex(index)}
              >
                <div
                  className={`relative block w-full ${item.aspect} overflow-hidden bg-neutral-100`}
                  style={{ aspectRatio: imageAspectRatios[item.aspect] || '4 / 3' }}
                >
                  <img
                    src={item.src}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading={index < 4 ? 'eager' : 'lazy'}
                    decoding="async"
                    fetchPriority={index < 4 ? 'high' : 'low'}
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
          <div className="h-[calc(100vh-100px)] min-h-[580px] max-h-[850px] w-full overflow-hidden flex flex-col justify-between relative bg-[#FBFBFA] border-y border-neutral-200/80 py-4 sm:py-6">
            
            {/* Lookbook Top Info Strip */}
            <div className="px-6 md:px-12 flex items-center justify-between text-xs text-neutral-400 font-mono flex-shrink-0">
              <span className="uppercase tracking-widest text-[11px] font-sans font-semibold text-neutral-500">
                Curated Exhibition • Horizontal Lookbook
              </span>
              <span>{filteredItems.length} Photographs</span>
            </div>

            {/* Horizontal Scroll Track */}
            <div
              ref={horizontalTrackRef}
              className="flex items-center h-[72vh] max-h-[640px] gap-8 md:gap-12 px-6 md:px-12 will-change-transform flex-nowrap"
            >
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className="relative h-full flex-shrink-0 flex items-center gap-6 md:gap-8 group cursor-pointer"
                  onClick={() => setLightboxIndex(index)}
                >
                  <div
                    className="relative h-full overflow-hidden rounded-2xl shadow-xl border border-neutral-200/60 bg-neutral-100 transition-transform duration-500 group-hover:scale-[1.01]"
                    style={{ aspectRatio: imageAspectRatios[item.aspect] || '4 / 3' }}
                  >
                    <img
                      src={item.src}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading={index < 6 ? 'eager' : 'lazy'}
                      decoding="async"
                      fetchPriority={index < 4 ? 'high' : 'low'}
                    />
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                      <Maximize2 className="w-4 h-4 text-neutral-900" />
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="backdrop-blur-md bg-white/90 border border-black/5 text-neutral-900 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider shadow-sm">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Caption Card */}
                  <div className="w-56 md:w-64 space-y-3 hidden sm:block flex-shrink-0">
                    <span className="text-[10px] font-mono text-neutral-400 block border-b border-neutral-200/80 pb-2">
                      0{index + 1} / {filteredItems.length}
                    </span>
                    <h3 className="text-2xl font-serif-editorial text-neutral-900 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-neutral-500 font-light">
                      {item.tag}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Lookbook Bottom Controls & Progress Bar */}
            <div className="px-6 md:px-12 flex items-center justify-between gap-6 flex-shrink-0">
              <div className="flex-1 h-1 bg-neutral-200 rounded-full overflow-hidden">
                <div className="lookbook-progress h-full w-full bg-neutral-900 origin-left scale-x-0 transition-transform duration-75" />
              </div>
              <span className="text-[11px] font-mono text-neutral-400 shrink-0">
                Scroll to view gallery
              </span>
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

      {/* 6. Direct Booking Call-to-Action Strip with Smoobu Embed */}
      <section className="border-t border-neutral-200/60 bg-neutral-50 py-16 sm:py-24 px-5 sm:px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="text-[10px] uppercase tracking-[0.24em] text-neutral-400 font-semibold block mb-3">
            Direct Reservations
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-editorial text-neutral-900 mb-3 sm:mb-4">
            Experience Hill View in Person.
          </h2>
          <p className="text-neutral-500 mb-8 sm:mb-10 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Check real-time availability and reserve your stay direct with secure instant confirmation.
          </p>

          <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-neutral-200/80 max-w-4xl mx-auto text-left">
            <BookingSearchForm variant="section" buttonLabel="Check Dates" />
          </div>
        </div>
      </section>

    </div>
  );
}
