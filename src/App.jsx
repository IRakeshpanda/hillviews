import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import Home from './pages/Home';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import CottagePage from './pages/CottagePage';
import ChaletLeJoyauPage from './pages/ChaletLeJoyauPage';
import HillViewCottagePage from './pages/HillViewCottagePage';

gsap.registerPlugin(ScrollTrigger, useGSAP);

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
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
      <ScrollToTop />
      
      {/* Floating Pill Navigation */}
      <Navbar onOpenBooking={() => setIsBookingOpen(true)} />

      {/* Main Page Routing */}
      <Routes>
        <Route 
          path="/" 
          element={
            <Home 
              isBookingOpen={isBookingOpen}
              setIsBookingOpen={setIsBookingOpen}
              arrivalDate={arrivalDate}
              setArrivalDate={setArrivalDate}
              departureDate={departureDate}
              setDepartureDate={setDepartureDate}
              guests={guests}
              setGuests={setGuests}
            />
          } 
        />
        <Route 
          path="/gallery" 
          element={<GalleryPage onOpenBooking={() => setIsBookingOpen(true)} />} 
        />
        <Route 
          path="/contact" 
          element={<ContactPage onOpenBooking={() => setIsBookingOpen(true)} />} 
        />
        <Route 
          path="/privacy-policy" 
          element={<PrivacyPolicyPage />} 
        />
        <Route 
          path="/terms" 
          element={<TermsPage />} 
        />
        <Route 
          path="/cottage" 
          element={<CottagePage />} 
        />
        <Route 
          path="/chalet-le-joyau" 
          element={<ChaletLeJoyauPage />} 
        />
        <Route 
          path="/hill-view-cottage" 
          element={<HillViewCottagePage />} 
        />
      </Routes>

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

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
