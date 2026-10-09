import React, { useState } from 'react';
import HeroSection from '../components/HeroSection';
import BrandImpactSection from '../components/BrandImpactSection';
import FeaturesSection from '../components/FeaturesSection';
import KineticTextBannerSection from '../components/KineticTextBannerSection';
import GalleryCarousel from '../components/GalleryCarousel';
import RoomsShowcase from '../components/RoomsShowcase';
import MetricsAndClosing from '../components/MetricsAndClosing';
import BookingModal from '../components/BookingModal';

export default function Home({
  isBookingOpen,
  setIsBookingOpen,
  arrivalDate,
  setArrivalDate,
  departureDate,
  setDepartureDate,
  guests,
  setGuests
}) {
  return (
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
  );
}
