import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ExternalLink, Heart } from 'lucide-react';

export default function Footer({ onOpenBooking }) {
  return (
    <footer className="bg-neutral-50 text-neutral-900 border-t border-neutral-200/60 pt-20 pb-12">
      
      {/* Upper Main Footer Grid */}
      <div className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          
          {/* Brand Info (Cols 1-2) */}
          <div className="lg:col-span-2 space-y-4">
            <a href="#" className="inline-block text-2xl font-serif-editorial font-bold text-neutral-900 tracking-wider">
              HILL VIEW
            </a>
            <p className="text-xs md:text-sm text-neutral-500 font-light leading-relaxed max-w-sm">
              A spacious, recently refurbished stone cottage in the tranquil village of Low Row, Swaledale — combining traditional Yorkshire Dales charm with modern comfort.
            </p>
            <div className="pt-2">
              <span className="text-xs text-neutral-600 font-medium block">
                Cottage Host & Contact: <strong className="text-neutral-900">Rob Smith</strong>
              </span>
            </div>
          </div>

          {/* Explore Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-500 font-light">
              <li>
                <a href="#cottage" className="hover:text-neutral-900 transition-colors">The Cottage</a>
              </li>
              <li>
                <a href="#features" className="hover:text-neutral-900 transition-colors">Features & Amenities</a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-neutral-900 transition-colors">Photo Gallery</a>
              </li>
              <li>
                <a href="#rooms" className="hover:text-neutral-900 transition-colors">Rooms & Layout</a>
              </li>
            </ul>
          </div>

          {/* About & Policies */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
              About
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-500 font-light">
              <li>
                <a href="#about" className="hover:text-neutral-900 transition-colors">About Us</a>
              </li>
              <li>
                <button onClick={onOpenBooking} className="hover:text-neutral-900 transition-colors text-left">House Rules</button>
              </li>
              <li>
                <Link to="/terms" className="hover:text-neutral-900 transition-colors text-left">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/terms#cancellation" className="hover:text-neutral-900 transition-colors text-left">Cancellation Policy</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-neutral-900 transition-colors text-left">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          {/* Contact Direct */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
              Contact Direct
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-500 font-light">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                <a href="mailto:robert_smith@agy.com" className="hover:text-neutral-900 transition-colors">robert_smith@agy.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-neutral-400" />
                <a href="tel:+41795489771" className="hover:text-neutral-900 transition-colors">+41 79 548 9771</a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <span>Low Row, Swaledale, UK</span>
              </li>
              <li className="pt-2">
                <button
                  onClick={onOpenBooking}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 uppercase tracking-wider underline underline-offset-4"
                >
                  <span>Book Direct Now</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto pt-8 border-t border-neutral-200/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
        <p>
          Copyright © {new Date().getFullYear()} Hill View. All rights reserved.
        </p>

        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-neutral-900 transition-colors">Instagram</a>
          <a href="#" className="hover:text-neutral-900 transition-colors">Twitter</a>
          <a href="#" className="hover:text-neutral-900 transition-colors">YouTube</a>
        </div>
      </div>

    </footer>
  );
}
