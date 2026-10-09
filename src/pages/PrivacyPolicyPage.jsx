import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function PrivacyPolicyPage() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const sections = gsap.utils.toArray(".policy-card, #summary");
    const navLinks = gsap.utils.toArray(".toc-link");

    // Fade up entrance animation for sections
    gsap.from(sections, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.1,
      scrollTrigger: {
        trigger: ".policy-content",
        start: "top 80%"
      }
    });

    // ScrollSpy for Table of Contents
    sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => {
          if (self.isActive) {
            const id = section.getAttribute("id");
            navLinks.forEach((link) => {
              const href = link.getAttribute("href").replace("#", "");
              if (href === id) {
                link.classList.add("bg-neutral-900", "text-white");
                link.classList.remove("text-neutral-600", "hover:text-neutral-950", "hover:bg-neutral-100");
              } else {
                link.classList.remove("bg-neutral-900", "text-white");
                link.classList.add("text-neutral-600", "hover:text-neutral-950", "hover:bg-neutral-100");
              }
            });
          }
        },
      });
    });
  }, { scope: containerRef });

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 100, // Account for sticky nav and padding
        behavior: 'smooth'
      });
    }
  };

  return (
    <main ref={containerRef} className="min-h-screen bg-white pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        
        {/* 1. EDITORIAL HEADER */}
        <header className="mb-16 md:mb-20 max-w-3xl">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-neutral-400 font-semibold mb-3 animate-fadeIn">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>LEGAL & COMPLIANCE -  UK GDPR</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-neutral-900 leading-tight animate-slideUp">
            Privacy Policy
          </h1>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-neutral-600 animate-slideUp" style={{ animationDelay: '0.1s' }}>
            We respect your privacy and are committed to protecting your personal data. This policy explains how your information is collected, safeguarded, and used when you stay with us or contact us.
          </p>
          
          {/* Metadata Tag */}
          <div className="mt-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 text-xs font-mono text-neutral-600 border border-neutral-200/60 animate-slideUp" style={{ animationDelay: '0.2s' }}>
            <svg className="w-3.5 h-3.5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>Last updated: 08 April 2026</span>
          </div>
        </header>

        {/* 2. TWO-COLUMN READER LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start policy-content">
          
          {/* LEFT COLUMN (Sticky Table of Contents on Desktop - 4 cols) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-28 space-y-4">
            <div className="p-6 rounded-3xl bg-[#FBFBFA] border border-neutral-200/80">
              <h3 className="text-xs uppercase tracking-widest font-bold text-neutral-400 mb-4">
                Table of Contents
              </h3>
              <nav className="space-y-2 text-sm">
                <a href="#summary" onClick={(e) => scrollToSection(e, 'summary')} className="toc-link block py-1.5 px-3 rounded-lg text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 transition-all font-medium">Quick Summary</a>
                <a href="#section-1" onClick={(e) => scrollToSection(e, 'section-1')} className="toc-link block py-1.5 px-3 rounded-lg text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 transition-all font-medium">1. What We Collect</a>
                <a href="#section-2" onClick={(e) => scrollToSection(e, 'section-2')} className="toc-link block py-1.5 px-3 rounded-lg text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 transition-all font-medium">2. How We Use Data</a>
                <a href="#section-3" onClick={(e) => scrollToSection(e, 'section-3')} className="toc-link block py-1.5 px-3 rounded-lg text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 transition-all font-medium">3. Sharing Information</a>
                <a href="#section-4" onClick={(e) => scrollToSection(e, 'section-4')} className="toc-link block py-1.5 px-3 rounded-lg text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 transition-all font-medium">4. Retention Period</a>
                <a href="#section-5" onClick={(e) => scrollToSection(e, 'section-5')} className="toc-link block py-1.5 px-3 rounded-lg text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 transition-all font-medium">5. Data Security</a>
                <a href="#section-6" onClick={(e) => scrollToSection(e, 'section-6')} className="toc-link block py-1.5 px-3 rounded-lg text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 transition-all font-medium">6. Your Rights</a>
                <a href="#section-7" onClick={(e) => scrollToSection(e, 'section-7')} className="toc-link block py-1.5 px-3 rounded-lg text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 transition-all font-medium">7. Contact Concierge</a>
              </nav>
            </div>

            {/* Trust Callout Badge */}
            <div className="p-6 rounded-3xl bg-neutral-900 text-white shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Direct & Protected</h4>
                  <p className="text-xs text-neutral-400 mt-0.5">We never sell personal guest data.</p>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT COLUMN (Policy Content Stream - 8 cols) */}
          <div className="lg:col-span-8 space-y-10 max-w-[720px]">

            {/* HIGH-TRUST SUMMARY BOX */}
            <div id="summary" className="p-8 rounded-3xl bg-neutral-50 border border-neutral-200/80">
              <h2 className="text-xl font-bold tracking-tight text-neutral-900 mb-4 flex items-center gap-2">
                <span>Essential Principles</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-neutral-700">
                <div className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Used exclusively for managing your cottage stay and inquiries.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>No marketing emails unless explicitly opted-in by you.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>We never sell or distribute your data to third parties.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Full compliance with UK Data Protection Regulations.</span>
                </div>
              </div>
            </div>

            {/* SECTION 1 */}
            <section id="section-1" className="policy-card pt-6 border-t border-neutral-200/70">
              <span className="text-xs font-mono font-semibold text-neutral-400 uppercase tracking-widest">01</span>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1 mb-4">
                What Information We Collect
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-neutral-600 mb-4">
                We may collect and process the following information during reservation or inquiry:
              </p>
              <ul className="space-y-2.5 text-sm md:text-base text-neutral-700 pl-4 border-l-2 border-neutral-200">
                <li>-  Your name, email address, phone number, and billing details</li>
                <li>-  Booking details (arrival/departure dates, number of guests, special requests)</li>
                <li>-  Messages or correspondence sent to our team</li>
                <li>-  Emergency contact information (if provided)</li>
              </ul>
            </section>

            {/* SECTION 2 */}
            <section id="section-2" className="policy-card pt-6 border-t border-neutral-200/70">
              <span className="text-xs font-mono font-semibold text-neutral-400 uppercase tracking-widest">02</span>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1 mb-4">
                How We Use Your Information
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-neutral-600 mb-4">
                Your information is used strictly to:
              </p>
              <ul className="space-y-2.5 text-sm md:text-base text-neutral-700 pl-4 border-l-2 border-neutral-200">
                <li>-  Manage your booking, confirm dates, and communicate check-in procedures</li>
                <li>-  Provide seamless access to the cottage (key safe codes, Wi-Fi details)</li>
                <li>-  Comply with statutory legal, safety, or tax requirements</li>
                <li>-  Respond promptly to any questions or maintenance requests during your stay</li>
              </ul>
              <p className="mt-4 text-xs md:text-sm font-medium text-neutral-500 bg-neutral-100 p-3.5 rounded-xl">
                🔒 We do not use your data for marketing or newsletters unless you have explicitly agreed.
              </p>
            </section>

            {/* SECTION 3 */}
            <section id="section-3" className="policy-card pt-6 border-t border-neutral-200/70">
              <span className="text-xs font-mono font-semibold text-neutral-400 uppercase tracking-widest">03</span>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1 mb-4">
                Sharing Your Information
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-neutral-600 mb-4">
                We only share your information when strictly necessary:
              </p>
              <ul className="space-y-2.5 text-sm md:text-base text-neutral-700 pl-4 border-l-2 border-neutral-200">
                <li>-  With essential local service providers (e.g., dedicated cleaners, linen service, or emergency maintenance) solely for the scope of their duties</li>
                <li>-  If required by law, taxation authorities, or regulatory bodies</li>
              </ul>
              <p className="mt-4 text-sm font-semibold text-neutral-900">
                We never sell your data to any third party.
              </p>
            </section>

            {/* SECTION 4 */}
            <section id="section-4" className="policy-card pt-6 border-t border-neutral-200/70">
              <span className="text-xs font-mono font-semibold text-neutral-400 uppercase tracking-widest">04</span>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1 mb-4">
                How Long We Keep Your Data
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-neutral-600">
                We retain personal information only for as long as necessary to manage your stay and meet legal, tax, or insurance requirements. Once these periods expire, your data is securely and permanently deleted.
              </p>
            </section>

            {/* SECTION 5 */}
            <section id="section-5" className="policy-card pt-6 border-t border-neutral-200/70">
              <span className="text-xs font-mono font-semibold text-neutral-400 uppercase tracking-widest">05</span>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1 mb-4">
                Data Security
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-neutral-600">
                We implement industry-standard technical and organizational security measures to protect your personal details, prevent unauthorized access, and ensure complete confidentiality.
              </p>
            </section>

            {/* SECTION 6 */}
            <section id="section-6" className="policy-card pt-6 border-t border-neutral-200/70">
              <span className="text-xs font-mono font-semibold text-neutral-400 uppercase tracking-widest">06</span>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1 mb-4">
                Your Rights Under UK Law
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-neutral-600 mb-4">
                Under UK Data Protection Law, you maintain the following rights:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/60 font-medium text-neutral-800">
                  Access your stored personal data
                </div>
                <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/60 font-medium text-neutral-800">
                  Request correction of inaccurate records
                </div>
                <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/60 font-medium text-neutral-800">
                  Request data deletion (where legally permissible)
                </div>
                <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/60 font-medium text-neutral-800">
                  Raise a concern regarding data handling
                </div>
              </div>
            </section>

            {/* SECTION 7 & CONTACT */}
            <section id="section-7" className="policy-card pt-6 border-t border-neutral-200/70">
              <span className="text-xs font-mono font-semibold text-neutral-400 uppercase tracking-widest">07</span>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1 mb-4">
                Contact & Data Inquiries
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-neutral-600 mb-6">
                If you have any questions regarding this Privacy Policy or wish to exercise your data rights, please contact our team directly:
              </p>
              
              <div className="p-6 rounded-3xl bg-[#FBFBFA] border border-neutral-200/80 space-y-3">
                <div className="flex items-center gap-3 text-sm text-neutral-800">
                  <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  <span>Email: <a href="mailto:robert_smith@sky.com" className="font-semibold text-neutral-950 underline underline-offset-4">robert_smith@sky.com</a></span>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-800">
                  <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                  <span>Property: <span className="font-medium text-neutral-900">Hill View, Low Row, Swaledale, North Yorkshire, UK</span></span>
                </div>
              </div>

              {/* Bottom Consent Notice */}
              <div className="mt-8 p-4 rounded-2xl bg-neutral-900 text-white flex items-center justify-between text-xs sm:text-sm">
                <span>By completing a reservation, you acknowledge and agree to this Privacy Policy.</span>
                <span className="text-emerald-400 font-bold ml-2">✓ Verified</span>
              </div>
            </section>

          </div>
        </div>

      </div>
    </main>
  );
}
