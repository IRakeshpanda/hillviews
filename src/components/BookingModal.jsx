import React, { useState } from 'react';
import { X, Calendar, Users, CheckCircle2, ShieldCheck, Sparkles, CreditCard, Clock, MapPin } from 'lucide-react';

export default function BookingModal({ 
  isOpen, 
  onClose, 
  arrivalDate, 
  setArrivalDate, 
  departureDate, 
  setDepartureDate, 
  guests, 
  setGuests 
}) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const NIGHT_RATE = 195;
  const CLEANING_FEE = 45;
  const nightsCount = 4;
  const subtotal = NIGHT_RATE * nightsCount;
  const totalPrice = subtotal + CLEANING_FEE;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(3); // Success step
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 animate-fadeIn">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-black/30 backdrop-blur-md transition-opacity" 
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white border border-neutral-200/60 rounded-3xl p-6 md:p-8 shadow-2xl z-10 overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-neutral-400 hover:text-neutral-900 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 block mb-1">
                DIRECT RESERVATION
              </span>
              <h3 className="text-2xl md:text-3xl font-serif-editorial font-medium text-neutral-900">
                Book Your Stay at Hill View
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Book direct with us to save service fees. Low Row, Swaledale.
              </p>
            </div>

            {/* Date & Guest Picker Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">
                  Arrival Date
                </label>
                <input
                  type="date"
                  value={arrivalDate}
                  onChange={(e) => setArrivalDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm focus:outline-none focus:border-neutral-900 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">
                  Departure Date
                </label>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm focus:outline-none focus:border-neutral-900 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">
                Number of Guests (Max 8)
              </label>
              <div className="flex items-center gap-3">
                {[1, 2, 4, 6, 8].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setGuests(num)}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold uppercase transition-all ${
                      guests === num 
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-md shadow-neutral-900/20' 
                        : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </button>
                ))}
              </div>
            </div>

            {/* Pricing Summary Box */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>£{NIGHT_RATE} x {nightsCount} nights</span>
                <span>£{subtotal}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Cleaning & linen service</span>
                <span>£{CLEANING_FEE}</span>
              </div>
              <div className="flex justify-between font-medium text-neutral-900">
                <span>Direct booking discount</span>
                <span>-£50</span>
              </div>
              <div className="pt-2 border-t border-neutral-200 flex justify-between font-semibold text-sm text-neutral-900">
                <span>Total Due</span>
                <span className="text-neutral-900 text-base">£{totalPrice - 50}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-4 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold uppercase tracking-wider text-xs shadow-xl shadow-neutral-900/20 transition-all"
            >
              Continue to Guest Details
            </button>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 block mb-1">
                STEP 2 OF 2
              </span>
              <h3 className="text-2xl font-serif-editorial font-medium text-neutral-900">
                Guest Contact Details
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1">
                  First Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="Eleanor"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1">
                  Last Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="Vance"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm focus:outline-none focus:border-neutral-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1">
                Email Address
              </label>
              <input
                required
                type="email"
                placeholder="eleanor@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm focus:outline-none focus:border-neutral-900"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1">
                Phone Number
              </label>
              <input
                required
                type="tel"
                placeholder="+44 7700 900077"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm focus:outline-none focus:border-neutral-900"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1">
                Special Requests or Notes
              </label>
              <textarea
                rows={2}
                placeholder="Bringing 1 well-behaved dog, arriving early afternoon..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm focus:outline-none focus:border-neutral-900"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 text-xs uppercase font-semibold tracking-wider"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold uppercase tracking-wider text-xs shadow-xl shadow-neutral-900/20 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Processing Reservation...' : 'Confirm Direct Reservation'}
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="text-center py-8 space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <span className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">
                RESERVATION CONFIRMED
              </span>
              <h3 className="text-3xl font-serif-editorial font-semibold text-neutral-900">
                We Look Forward to Welcoming You!
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Thank you, <strong className="text-neutral-900">{formData.firstName || 'Guest'}</strong>. Confirmation email sent to <strong className="text-neutral-900">{formData.email || 'your email'}</strong>. Host Rob Smith will contact you with key code access.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 text-xs text-left max-w-md mx-auto space-y-1">
              <div className="flex justify-between text-neutral-500">
                <span>Location:</span>
                <span className="text-neutral-900 font-medium">Low Row, Swaledale</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Arrival:</span>
                <span className="text-neutral-900 font-medium">{arrivalDate}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Guests:</span>
                <span className="text-neutral-900 font-medium">{guests} Guests</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase font-semibold tracking-wider transition-colors shadow-lg"
            >
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
