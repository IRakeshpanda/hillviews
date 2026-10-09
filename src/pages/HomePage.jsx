import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import BrandImpactSection from './components/BrandImpactSection';
import FeaturesSection from './components/FeaturesSection';
import KineticTextBannerSection from './components/KineticTextBannerSection';
import GalleryCarousel from './components/GalleryCarousel';
import RoomsShowcase from './components/RoomsShowcase';
import MetricsAndClosing from './components/MetricsAndClosing';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [arrivalDate, setArrivalDate] = useState('2026-09-24');
  const [departureDate, setDepartureDate] = useState('2026-09-28');
  const [guests, setGuests] = useState(4);

  const mainRef = useRef(null);

  // Synchronize Lenis smooth scroll with GSAP ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 2.0,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);

  return (
    <div ref={mainRef} className="min-h-screen bg-white text-neutral-900 selection:bg-neutral-200 selection:text-neutral-900">
      
      {/* Floating Pill Navigation */}
      <Navbar onOpenBooking={() => setIsBookingOpen(true)} />

      {/* Main Page Sections */}
      <main>
        {/* 1. Hero Section with Card Scale Scrub & Glass Booking Widget */}
        <HeroSection 
          onOpenBooking={() => setIsBookingOpen(true)}
          arrivalDate={arrivalDate}
          setArrivalDate={setArrivalDate}
          departureDate={departureDate}
          setDepartureDate={setDepartureDate}
          guests={guests}
          setGuests={setGuests}
        />

        {/* 2. Brand Impact Transition & Floating Parallax Cards */}
        <BrandImpactSection />

        {/* 3. Features Grid (6 Cards) */}
        <FeaturesSection />

        {/* 4. Parallax Banner & Kinetic Text Word-by-Word Scrub */}
        <KineticTextBannerSection />

        {/* 5. Continuous Horizontal Gallery Carousel */}
        <GalleryCarousel onOpenBooking={() => setIsBookingOpen(true)} />

        {/* 6. The Rooms Showcase */}
        <RoomsShowcase onOpenBooking={() => setIsBookingOpen(true)} />

        {/* 7. Key Facts / Spec Bar & Panoramic Closing */}
        <MetricsAndClosing onOpenBooking={() => setIsBookingOpen(true)} />
      </main>

      {/* 8. Editorial Multi-Column Footer */}
      <Footer onOpenBooking={() => setIsBookingOpen(true)} />

      {/* Interactive Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        arrivalDate={arrivalDate}
        setArrivalDate={setArrivalDate}
        departureDate={departureDate}
        setDepartureDate={setDepartureDate}
        guests={guests}
        setGuests={setGuests}
      />

    </div>
  );
}
