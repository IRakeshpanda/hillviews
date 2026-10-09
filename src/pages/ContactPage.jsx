import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Mail, Phone, MapPin, Clock, ArrowUpRight, CheckCircle2, ChevronDown, Car, Train, CarFront, Plus, Minus } from 'lucide-react';
import { cottageImages } from '../data/cottageData';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FAQS = [
  {
    question: "What are the standard check-in and check-out times?",
    answer: "Check-in is from 16:00, and check-out is by 10:00 to allow our housekeeping team adequate time to prepare the cottage for incoming guests."
  },
  {
    question: "Is Hill View dog-friendly?",
    answer: "Yes, we warmly welcome up to 2 well-behaved dogs. We ask that they remain on the ground floor and stay off the furniture to maintain the quality of our furnishings."
  },
  {
    question: "What is the direct booking cancellation policy?",
    answer: "When you book direct, you receive a full refund for cancellations made up to 30 days before your scheduled arrival date."
  },
  {
    question: "Is high-speed Wi-Fi available for remote working?",
    answer: "Yes, the cottage is equipped with high-speed Starlink / Fibre broadband ensuring reliable and fast connectivity across all rooms."
  }
];

export default function ContactPage({ onOpenBooking }) {
  const containerRef = useRef(null);
  const [formState, setFormState] = useState('idle'); // idle, submitting, success
  const [inquiryType, setInquiryType] = useState('General Inquiry');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  useGSAP(() => {
    // Header Animation
    gsap.from(".contact-header-line", {
      yPercent: 100,
      opacity: 0,
      duration: 0.85,
      ease: "power3.out",
      stagger: 0.1
    });

    gsap.from(".contact-subtitle", {
      y: 20,
      opacity: 0,
      duration: 0.85,
      delay: 0.3,
      ease: "power2.out"
    });

    // Stagger layout blocks
    gsap.from(".contact-block", {
      scrollTrigger: {
        trigger: ".contact-grid",
        start: "top 80%"
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.15
    });

    // Arrival Section Animation
    gsap.from(".arrival-anim", {
      scrollTrigger: {
        trigger: "#section-arrival",
        start: "top 85%"
      },
      y: 35,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.15
    });
    
    // FAQ Section Animation
    gsap.from(".faq-anim", {
      scrollTrigger: {
        trigger: "#section-faq",
        start: "top 85%"
      },
      y: 35,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.15
    });
  }, { scope: containerRef });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormState('submitting');
    // Simulate network request
    setTimeout(() => {
      setFormState('success');
    }, 1500);
  };

  const toggleFaq = (index) => {
    const isOpening = activeFaq !== index;
    
    // Close currently active
    if (activeFaq !== null) {
      gsap.to(`#faq-content-${activeFaq}`, { height: 0, duration: 0.4, ease: "power2.inOut" });
      gsap.to(`#faq-icon-${activeFaq}`, { rotation: 0, duration: 0.4, ease: "power2.inOut" });
    }

    if (isOpening) {
      setActiveFaq(index);
      gsap.to(`#faq-content-${index}`, { height: "auto", duration: 0.4, ease: "power2.inOut" });
      gsap.to(`#faq-icon-${index}`, { rotation: 45, duration: 0.4, ease: "power2.inOut" });
    } else {
      setActiveFaq(null);
    }
  };

  const inquiryOptions = ["General Inquiry", "Reservation Question", "Private Chef/Events", "Corporate Retreat"];

  return (
    <div ref={containerRef} className="min-h-screen bg-white text-neutral-900 pt-24 pb-0">
      
      {/* 1. Page Header */}
      <section className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto pt-16 pb-16 text-center md:text-left">
        <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold block mb-6 animate-fadeIn">
          GET IN TOUCH • WE ARE HERE TO HELP
        </span>
        <h1 className="text-5xl md:text-7xl font-serif-editorial font-medium tracking-tight text-neutral-900 mb-6 overflow-hidden">
          <span className="block contact-header-line">Plan Your</span>
          <span className="block contact-header-line">Swaledale Escape.</span>
        </h1>
        <p className="contact-subtitle text-lg md:text-xl text-neutral-500 font-light max-w-2xl leading-relaxed">
          Have questions regarding reservations, private chef arrangements, or local trails? Reach out to our concierge directly.
        </p>
      </section>

      {/* 2. Split Concierge Layout */}
      <section className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto pb-24 contact-grid border-b border-neutral-200/60">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left Column: Direct Channels (Col span 5) */}
          <div className="lg:col-span-5 space-y-12 contact-block">
            
            <div className="space-y-6">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-900 border-b border-neutral-200 pb-4">
                Direct Channels
              </h3>
              
              <div className="space-y-8">
                <a href="mailto:robert_smith@agy.com" className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-neutral-50 border border-neutral-200 flex items-center justify-center shrink-0 group-hover:bg-neutral-900 group-hover:text-white transition-colors duration-300">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1">Email Us</p>
                    <p className="text-lg text-neutral-900 group-hover:text-neutral-600 transition-colors">robert_smith@agy.com</p>
                  </div>
                </a>

                <a href="tel:+41795489771" className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-neutral-50 border border-neutral-200 flex items-center justify-center shrink-0 group-hover:bg-neutral-900 group-hover:text-white transition-colors duration-300">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1">Call Us</p>
                    <p className="text-lg text-neutral-900 group-hover:text-neutral-600 transition-colors">+41 79 548 9771</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-900 border-b border-neutral-200 pb-4">
                Location Details
              </h3>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-neutral-50 border border-neutral-200 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-neutral-500" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1">Address</p>
                    <p className="text-base text-neutral-600 leading-relaxed">
                      Hill View Cottage<br />
                      Low Row, Richmond<br />
                      Swaledale, North Yorkshire<br />
                      United Kingdom
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-neutral-50 border border-neutral-200 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-neutral-500" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1">Check-in Details</p>
                    <p className="text-base text-neutral-600 leading-relaxed">
                      Check-in: After 4:00 PM<br />
                      Check-out: 10:00 AM
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Inquiry Form (Col span 7) */}
          <div className="lg:col-span-7 contact-block">
            <div className="bg-[#F9F9F8] rounded-[2rem] p-8 md:p-12 border border-neutral-200/80 shadow-2xl shadow-black/5 relative overflow-hidden">
              
              {formState === 'success' ? (
                <div className="flex flex-col items-center justify-center text-center h-full min-h-[500px] animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-600 mb-6">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-serif-editorial text-neutral-900 mb-3">Message Received</h3>
                  <p className="text-neutral-500 max-w-sm mb-8">
                    Thank you for reaching out. Our concierge team will get back to you within 24 hours.
                  </p>
                  <button 
                    onClick={() => setFormState('idle')}
                    className="px-8 py-3 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 text-xs uppercase font-semibold tracking-wider transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[11px] uppercase tracking-widest text-neutral-400 font-semibold ml-1">First Name</label>
                      <input 
                        type="text" 
                        required 
                        className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all outline-none text-sm text-neutral-900"
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] uppercase tracking-widest text-neutral-400 font-semibold ml-1">Last Name</label>
                      <input 
                        type="text" 
                        required 
                        className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all outline-none text-sm text-neutral-900"
                        placeholder="Smith"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[11px] uppercase tracking-widest text-neutral-400 font-semibold ml-1">Email Address</label>
                      <input 
                        type="email" 
                        required 
                        className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all outline-none text-sm text-neutral-900"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] uppercase tracking-widest text-neutral-400 font-semibold ml-1">Phone Number (Optional)</label>
                      <input 
                        type="tel" 
                        className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all outline-none text-sm text-neutral-900"
                        placeholder="+44 7700 900000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    <div className="col-span-2 md:col-span-1 space-y-1.5">
                      <label className="text-[11px] uppercase tracking-widest text-neutral-400 font-semibold ml-1">Arrival</label>
                      <input 
                        type="date" 
                        className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all outline-none text-sm text-neutral-900"
                      />
                    </div>
                    <div className="col-span-2 md:col-span-1 space-y-1.5">
                      <label className="text-[11px] uppercase tracking-widest text-neutral-400 font-semibold ml-1">Departure</label>
                      <input 
                        type="date" 
                        className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all outline-none text-sm text-neutral-900"
                      />
                    </div>
                    <div className="col-span-2 md:col-span-2 space-y-1.5 relative z-10">
                      <label className="text-[11px] uppercase tracking-widest text-neutral-400 font-semibold ml-1">Inquiry Type</label>
                      <div className="relative">
                        <button 
                          type="button"
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3.5 text-sm text-neutral-900 text-left flex items-center justify-between focus:outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900 transition-all"
                        >
                          <span>{inquiryType}</span>
                          <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {isDropdownOpen && (
                          <div className="absolute top-full mt-2 left-0 w-full bg-white border border-neutral-200 shadow-xl rounded-xl overflow-hidden animate-fadeIn">
                            {inquiryOptions.map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => {
                                  setInquiryType(opt);
                                  setIsDropdownOpen(false);
                                }}
                                className="w-full text-left px-4 py-3 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-widest text-neutral-400 font-semibold ml-1">Message</label>
                    <textarea 
                      required 
                      rows={4}
                      className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all outline-none text-sm text-neutral-900 resize-none"
                      placeholder="How can we help you plan your stay?"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={formState === 'submitting'}
                    className="w-full py-4 rounded-xl bg-neutral-900 text-white font-semibold uppercase tracking-wider text-xs shadow-xl shadow-neutral-900/20 transition-all flex items-center justify-center gap-2 group hover:bg-neutral-800 hover:scale-[1.02] active:scale-100"
                  >
                    {formState === 'submitting' ? (
                      <span className="flex items-center gap-2 animate-pulse">
                        Sending...
                      </span>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                  
                  <p className="text-center text-[10px] text-neutral-400 mt-4">
                    Your details are kept strictly confidential as per our privacy policy.
                  </p>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* 3. Stylized Location, Arrival & Coordinates Section */}
      <section id="section-arrival" className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto py-24 border-b border-neutral-200/60">
        
        <div className="text-center md:text-left mb-12 arrival-anim">
          <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold block mb-4">
            LOCATION
          </span>
          <h2 className="text-4xl md:text-5xl font-serif-editorial text-neutral-900">
            Finding Hill View in Low Row.
          </h2>
        </div>

        {/* Visual Plate */}
        <div className="relative w-full h-[50vh] md:h-[60vh] rounded-3xl overflow-hidden mb-16 arrival-anim shadow-2xl">
          <img 
            src={cottageImages.panoramicDales || '/images/exterior-full.jpg'} 
            alt="Hill View Stone Cottage Approach" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10"></div>
          
          {/* Embedded Glassmorphic Location Badge */}
          <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 bg-white/85 backdrop-blur-xl border border-white/40 p-6 md:p-8 rounded-2xl shadow-2xl max-w-md animate-slideUp" style={{ animationDelay: '0.4s' }}>
            <p className="font-mono text-xs text-neutral-500 tracking-wider mb-2">54.3804° N, 2.0012° W</p>
            <h4 className="text-lg font-semibold text-neutral-900 mb-2">Hill View Cottage</h4>
            <p className="text-sm text-neutral-600 mb-6 leading-relaxed">
              Low Row, Swaledale, Richmond,<br />
              North Yorkshire, DL11 6NE
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a 
                href="https://maps.google.com" 
                target="_blank" 
                rel="noreferrer"
                className="text-[11px] font-semibold uppercase tracking-wider text-neutral-900 hover:text-neutral-500 transition-colors flex items-center gap-1 group"
              >
                Open in Google Maps <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
              <a 
                href="https://maps.apple.com" 
                target="_blank" 
                rel="noreferrer"
                className="text-[11px] font-semibold uppercase tracking-wider text-neutral-900 hover:text-neutral-500 transition-colors flex items-center gap-1 group"
              >
                Open in Apple Maps <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        {/* Arrival Guide 3-Column Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-10 arrival-anim">
          
          {/* 1. BY CAR CARD */}
          <div className="group relative bg-[#FBFBFA] hover:bg-white rounded-3xl p-8 border border-neutral-200/80 hover:border-neutral-300 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-xl hover:shadow-neutral-900/5 flex flex-col justify-between">
            <div>
              {/* Icon Wrapper */}
              <div className="w-14 h-14 rounded-2xl bg-neutral-100 group-hover:bg-neutral-900 text-neutral-800 group-hover:text-white flex items-center justify-center transition-colors duration-400 ease-out shadow-inner">
                {/* Car Icon with forward nudge motion */}
                <svg className="w-6 h-6 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
                  <circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>
                </svg>
              </div>
              
              {/* Content */}
              <h3 className="mt-6 text-xl font-bold tracking-tight text-neutral-900 group-hover:text-black transition-colors">
                By Car
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                Detailed scenic driving directions from the A1(M) via Richmond or Scotch Corner. The cottage is nestled along the B6270, offering an unforgettable drive through the Dales.
              </p>
            </div>
            
            {/* Subtle Indicator Line */}
            <div className="mt-6 pt-4 border-t border-neutral-200/50 flex items-center gap-2 text-xs font-medium text-neutral-400 group-hover:text-neutral-900 transition-colors">
              <span>Scenic Dales Route</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </div>
          </div>

          {/* 2. BY RAIL CARD */}
          <div className="group relative bg-[#FBFBFA] hover:bg-white rounded-3xl p-8 border border-neutral-200/80 hover:border-neutral-300 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-xl hover:shadow-neutral-900/5 flex flex-col justify-between">
            <div>
              {/* Icon Wrapper */}
              <div className="w-14 h-14 rounded-2xl bg-neutral-100 group-hover:bg-neutral-900 text-neutral-800 group-hover:text-white flex items-center justify-center transition-colors duration-400 ease-out shadow-inner">
                {/* Train Icon with scale & slight rise motion */}
                <svg className="w-6 h-6 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75">
                  <rect width="16" height="16" x="4" y="3" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="m8 19-2 3"/><path d="m18 22-2-3"/><circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/>
                </svg>
              </div>

              {/* Content */}
              <h3 className="mt-6 text-xl font-bold tracking-tight text-neutral-900 group-hover:text-black transition-colors">
                By Rail
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                Nearest mainline stations are Darlington (45 mins) or Garsdale (30 mins). We can recommend trusted local private taxi services to complete your journey.
              </p>
            </div>

            {/* Subtle Indicator Line */}
            <div className="mt-6 pt-4 border-t border-neutral-200/50 flex items-center gap-2 text-xs font-medium text-neutral-400 group-hover:text-neutral-900 transition-colors">
              <span>Station Transfers</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </div>
          </div>

          {/* 3. PARKING & EV CARD */}
          <div className="group relative bg-[#FBFBFA] hover:bg-white rounded-3xl p-8 border border-neutral-200/80 hover:border-neutral-300 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-xl hover:shadow-neutral-900/5 flex flex-col justify-between">
            <div>
              {/* Icon Wrapper */}
              <div className="w-14 h-14 rounded-2xl bg-neutral-100 group-hover:bg-neutral-900 text-neutral-800 group-hover:text-white flex items-center justify-center transition-colors duration-400 ease-out shadow-inner">
                {/* Zap / Charging Icon with subtle rotation & bounce */}
                <svg className="w-6 h-6 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-115 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
              </div>

              {/* Content */}
              <h3 className="mt-6 text-xl font-bold tracking-tight text-neutral-900 group-hover:text-black transition-colors">
                Parking & EV
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                Enjoy private, off-road parking for up to 3 vehicles directly adjacent to the cottage, complete with a complimentary 7kW EV charging point for guests.
              </p>
            </div>

            {/* Subtle Indicator Line */}
            <div className="mt-6 pt-4 border-t border-neutral-200/50 flex items-center gap-2 text-xs font-medium text-neutral-400 group-hover:text-neutral-900 transition-colors">
              <span>Private Driveway</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </div>
          </div>

        </div>

      </section>

      {/* 4. Pre-Arrival Frequently Asked Questions (GSAP Accordion) */}
      <section id="section-faq" className="px-6 md:px-12 lg:px-20 max-w-4xl mx-auto py-24">
        
        <div className="text-center mb-16 faq-anim">
          <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold block mb-4">
            PRE-ARRIVAL
          </span>
          <h2 className="text-4xl md:text-5xl font-serif-editorial text-neutral-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="border-b border-neutral-200/60 pb-2 faq-anim">
              <button 
                onClick={() => toggleFaq(idx)}
                className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
              >
                <h4 className="text-lg font-medium text-neutral-900 pr-8 group-hover:text-neutral-600 transition-colors">
                  {faq.question}
                </h4>
                <div id={`faq-icon-${idx}`} className="shrink-0 w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center border border-neutral-200">
                  <Plus className="w-4 h-4 text-neutral-900" />
                </div>
              </button>
              <div 
                id={`faq-content-${idx}`} 
                className="h-0 overflow-hidden"
              >
                <p className="text-neutral-600 leading-relaxed pb-6 pr-8 md:pr-12">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

      </section>

    </div>
  );
}
