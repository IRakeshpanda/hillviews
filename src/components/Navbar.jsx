import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Calendar, Compass, Sparkles, Home, Layers, Image as ImageIcon, BedDouble, MapPin } from 'lucide-react';

export default function Navbar({ onOpenBooking }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header 
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-4xl rounded-full transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-xl border border-black/5 shadow-2xl py-2 px-3 md:px-5' 
            : 'bg-white/80 backdrop-blur-md border border-black/5 py-2.5 px-3 md:px-6 shadow-xl'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center group-hover:bg-neutral-900 group-hover:text-white transition-all duration-300">
              <span className="font-serif-editorial font-bold text-neutral-900 group-hover:text-white text-sm tracking-tight">HV</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-xs tracking-widest text-neutral-900 uppercase group-hover:text-neutral-600 transition-colors">
                HILL VIEW
              </span>
              <span className="text-[10px] text-neutral-500 tracking-wider font-light uppercase hidden sm:inline">
                Swaledale • Yorkshire
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/cottage" 
              className="text-xs uppercase tracking-widest text-neutral-600 hover:text-neutral-900 transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-neutral-900 hover:after:w-full after:transition-all"
            >
              The Cottage
            </Link>
            <Link 
              to="/#features" 
              className="text-xs uppercase tracking-widest text-neutral-600 hover:text-neutral-900 transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-neutral-900 hover:after:w-full after:transition-all"
            >
              Features
            </Link>
            <Link 
              to="/gallery" 
              className="text-xs uppercase tracking-widest text-neutral-600 hover:text-neutral-900 transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-neutral-900 hover:after:w-full after:transition-all"
            >
              Gallery
            </Link>
            <Link 
              to="/#rooms" 
              className="text-xs uppercase tracking-widest text-neutral-600 hover:text-neutral-900 transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-neutral-900 hover:after:w-full after:transition-all"
            >
              Rooms
            </Link>
            <Link 
              to="/contact" 
              className="text-xs uppercase tracking-widest text-neutral-600 hover:text-neutral-900 transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-neutral-900 hover:after:w-full after:transition-all"
            >
              Contact
            </Link>
          </nav>

          {/* Right Action Button */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenBooking}
              className="rounded-full bg-neutral-900 text-white hover:bg-neutral-800 px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-md active:scale-95"
            >
              Book now
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onOpenBooking}
              className="rounded-full bg-neutral-900 text-white px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider"
            >
              Book
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-900 hover:text-neutral-600 transition-colors rounded-full bg-neutral-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white/95 backdrop-blur-2xl flex flex-col justify-between p-8 pt-28 transition-all animate-fadeIn md:hidden">
          <div className="flex flex-col gap-6">
            <p className="text-xs uppercase tracking-widest text-neutral-400 font-medium">Navigation</p>
            <Link
              to="/cottage"
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl font-serif-editorial text-neutral-900 flex items-center justify-between border-b border-neutral-200/60 pb-4"
            >
              <span className="flex items-center gap-3"><Home className="w-5 h-5 text-neutral-400" /> The Cottage</span>
              <span className="text-xs font-sans text-neutral-500">01</span>
            </Link>
            <Link
              to="/#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl font-serif-editorial text-neutral-900 flex items-center justify-between border-b border-neutral-200/60 pb-4"
            >
              <span className="flex items-center gap-3"><Layers className="w-5 h-5 text-neutral-400" /> Features</span>
              <span className="text-xs font-sans text-neutral-500">02</span>
            </Link>
            <Link
              to="/gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl font-serif-editorial text-neutral-900 flex items-center justify-between border-b border-neutral-200/60 pb-4"
            >
              <span className="flex items-center gap-3"><ImageIcon className="w-5 h-5 text-neutral-400" /> Gallery</span>
              <span className="text-xs font-sans text-neutral-500">03</span>
            </Link>
            <Link
              to="/#rooms"
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl font-serif-editorial text-neutral-900 flex items-center justify-between border-b border-neutral-200/60 pb-4"
            >
              <span className="flex items-center gap-3"><BedDouble className="w-5 h-5 text-neutral-400" /> Rooms</span>
              <span className="text-xs font-sans text-neutral-500">04</span>
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl font-serif-editorial text-neutral-900 flex items-center justify-between border-b border-neutral-200/60 pb-4"
            >
              <span className="flex items-center gap-3"><MapPin className="w-5 h-5 text-neutral-400" /> Contact</span>
              <span className="text-xs font-sans text-neutral-500">05</span>
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-4 rounded-full bg-neutral-900 text-white font-semibold text-center uppercase tracking-wider text-sm shadow-lg shadow-neutral-900/20"
            >
              Book Direct & Save
            </button>
            <p className="text-center text-xs text-neutral-500">
              Low Row • Swaledale • Yorkshire Dales
            </p>
          </div>
        </div>
      )}
    </>
  );
}
