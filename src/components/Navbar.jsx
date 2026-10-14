import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { Menu, X, Phone, Mail, MessageCircle, Home, Layers, Image as ImageIcon, BedDouble, MapPin, FileText } from 'lucide-react';

const NAV_LINKS = [
  { to: '/cottage',    label: 'The Cottage', icon: Home,        num: '01' },
  { to: '/#features', label: 'Features',    icon: Layers,       num: '02' },
  { to: '/gallery',   label: 'Gallery',     icon: ImageIcon,    num: '03' },
  { to: '/#rooms',    label: 'Rooms',       icon: BedDouble,    num: '04' },
  { to: '/contact',   label: 'Contact',     icon: MapPin,       num: '05' },
  { to: '/terms',     label: 'Terms',       icon: FileText,     num: '06' },
];

export default function Navbar({ onOpenBooking }) {
  const [isScrolled, setIsScrolled]       = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const drawerRef  = useRef(null);
  const linksRef   = useRef([]);
  const ctaRef     = useRef(null);
  const contactRef = useRef(null);

  // ── Scroll listener ──────────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Lock body scroll when drawer is open ─────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  // ── GSAP Drawer entrance animation ───────────────────────────────────────
  useEffect(() => {
    if (!mobileMenuOpen || !drawerRef.current) return;

    const ctx = gsap.context(() => {
      // Drawer slides in from the right
      gsap.fromTo(drawerRef.current,
        { xPercent: 100, opacity: 0 },
        { xPercent: 0, opacity: 1, duration: 0.45, ease: 'power3.out' }
      );

      // Nav links stagger up
      gsap.fromTo(linksRef.current.filter(Boolean),
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power3.out', delay: 0.15 }
      );

      // Contact strip fades in
      if (contactRef.current) {
        gsap.fromTo(contactRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', delay: 0.45 }
        );
      }

      // CTA pops in with scale
      if (ctaRef.current) {
        gsap.fromTo(ctaRef.current,
          { opacity: 0, y: 20, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.5)', delay: 0.5 }
        );
      }
    }, drawerRef);

    return () => ctx.revert();
  }, [mobileMenuOpen]);

  const closeDrawer = () => {
    // Animate out, then close
    if (drawerRef.current) {
      gsap.to(drawerRef.current, {
        xPercent: 100, opacity: 0, duration: 0.3, ease: 'power2.in',
        onComplete: () => setMobileMenuOpen(false),
      });
    } else {
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* ── TOP BAR ─────────────────────────────────────────────────── */}
      <header
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-4xl rounded-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-xl border border-black/5 shadow-2xl py-2 px-3 md:px-5'
            : 'bg-white/80 backdrop-blur-md border border-black/5 py-2.5 px-3 md:px-6 shadow-xl'
        }`}
      >
        <div className="flex items-center justify-between">

          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 group" onClick={() => mobileMenuOpen && closeDrawer()}>
            <div className="w-8 h-8 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center group-hover:bg-neutral-900 group-hover:text-white transition-all duration-300">
              <span className="font-serif-editorial font-bold text-neutral-900 group-hover:text-white text-sm tracking-tight">HV</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-xs tracking-widest text-neutral-900 uppercase">HILL VIEW</span>
              <span className="text-[10px] text-neutral-500 tracking-wider font-light uppercase hidden sm:inline">Swaledale • Yorkshire</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-xs uppercase tracking-widest text-neutral-600 hover:text-neutral-900 transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-neutral-900 hover:after:w-full after:transition-all"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={onOpenBooking}
              className="rounded-full bg-neutral-900 text-white hover:bg-neutral-800 px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-md active:scale-95 min-h-[36px]"
            >
              Book now
            </button>
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenBooking}
              className="rounded-full bg-neutral-900 text-white px-4 py-2 text-[11px] font-semibold uppercase tracking-wider min-h-[36px] active:scale-95 transition-transform"
            >
              Book now
            </button>
            <button
              onClick={() => mobileMenuOpen ? closeDrawer() : setMobileMenuOpen(true)}
              className="p-2.5 text-neutral-900 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </header>

      {/* ── MOBILE GLASSMORPHIC DRAWER ──────────────────────────────── */}
      {mobileMenuOpen && (
        <div
          ref={drawerRef}
          className="fixed inset-0 z-40 bg-white/96 backdrop-blur-2xl flex flex-col lg:hidden"
          style={{ transform: 'translateX(100%)' }}
        >
          {/* Drawer Top Bar */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-neutral-900 flex items-center justify-center">
                <span className="font-serif-editorial font-bold text-white text-xs">HV</span>
              </div>
              <span className="font-semibold text-xs tracking-widest text-neutral-900 uppercase">HILL VIEW</span>
            </div>
            <button
              onClick={closeDrawer}
              className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-neutral-700" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto px-6 pt-8 pb-4">

            {/* Label */}
            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-semibold mb-6">Navigation</p>

            {/* Nav Links */}
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map(({ to, label, icon: Icon, num }, i) => (
                <Link
                  key={to}
                  to={to}
                  ref={el => linksRef.current[i] = el}
                  onClick={closeDrawer}
                  className="flex items-center justify-between py-4 border-b border-neutral-100 group min-h-[60px]"
                >
                  <span className="flex items-center gap-4">
                    <span className="w-9 h-9 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center group-hover:bg-neutral-900 group-hover:border-neutral-900 transition-all duration-200">
                      <Icon className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
                    </span>
                    <span className="text-xl font-serif-editorial text-neutral-900 group-hover:text-neutral-600 transition-colors">{label}</span>
                  </span>
                  <span className="text-xs font-mono text-neutral-300 group-hover:text-neutral-500 transition-colors">{num}</span>
                </Link>
              ))}
            </nav>

            {/* Contact Shortcuts */}
            <div ref={contactRef} className="mt-8 grid grid-cols-3 gap-3">
              <a
                href="tel:+441748884494"
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-neutral-50 border border-neutral-100 hover:bg-neutral-100 transition-colors min-h-[72px] justify-center"
              >
                <Phone className="w-4 h-4 text-neutral-600" />
                <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500">Call</span>
              </a>
              <a
                href="https://wa.me/441748884494"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-neutral-50 border border-neutral-100 hover:bg-neutral-100 transition-colors min-h-[72px] justify-center"
              >
                <MessageCircle className="w-4 h-4 text-neutral-600" />
                <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500">WhatsApp</span>
              </a>
              <a
                href="mailto:rob@hillviewcottage.co.uk"
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-neutral-50 border border-neutral-100 hover:bg-neutral-100 transition-colors min-h-[72px] justify-center"
              >
                <Mail className="w-4 h-4 text-neutral-600" />
                <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500">Email</span>
              </a>
            </div>
          </div>

          {/* Drawer Footer CTA */}
          <div ref={ctaRef} className="px-6 pb-8 pt-4 border-t border-neutral-100">
            <button
              onClick={() => { closeDrawer(); onOpenBooking(); }}
              className="w-full py-4 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-center uppercase tracking-wider text-sm shadow-lg shadow-neutral-900/20 active:scale-[0.98] transition-all min-h-[56px]"
            >
              Book Direct on Smoobu
            </button>
            <p className="text-center text-xs text-neutral-400 mt-3">
              Low Row · Swaledale · Yorkshire Dales
            </p>
          </div>
        </div>
      )}
    </>
  );
}
