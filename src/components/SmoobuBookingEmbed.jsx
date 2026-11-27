import { useEffect, useRef, useState } from 'react';

const RESIZER_SCRIPT_URL = 'https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/3.5.16/iframeResizer.min.js';
const SMOOBU_CUSTOMER_ID = '1692217';
export const HILL_VIEW_APARTMENT_ID = '3244297';

const APARTMENT_BY_SLUG = {
  'hill-view': HILL_VIEW_APARTMENT_ID,
  'hillview': HILL_VIEW_APARTMENT_ID,
};

let resizerScriptPromise;

export function loadIframeResizerScript() {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.iFrameResize) return Promise.resolve();
  if (resizerScriptPromise) return resizerScriptPromise;

  resizerScriptPromise = new Promise((resolve, reject) => {
    let script = document.querySelector(`script[src*="iframeResizer.min.js"]`);
    if (script) {
      if (window.iFrameResize) {
        resolve();
        return;
      }
      script.addEventListener('load', resolve, { once: true });
      script.addEventListener('error', reject, { once: true });
      return;
    }

    script = document.createElement('script');
    script.src = RESIZER_SCRIPT_URL;
    script.async = true;
    script.addEventListener('load', resolve, { once: true });
    script.addEventListener('error', reject, { once: true });
    document.head.appendChild(script);
  });

  return resizerScriptPromise;
}

export function loadSmoobuScript() {
  return loadIframeResizerScript();
}

// Kick off loading immediately on script execution in browser
if (typeof window !== 'undefined') {
  loadIframeResizerScript();
}

export function buildSmoobuUrl(apartmentId, { checkIn, checkOut, guests } = {}) {
  const queryParams = new URLSearchParams();
  queryParams.set('apartmentId', String(apartmentId || HILL_VIEW_APARTMENT_ID));

  if (guests) {
    const guestNum = Math.min(6, Math.max(1, Number(guests)));
    queryParams.set('adults', String(guestNum));
    queryParams.set('guests', String(guestNum));
  }

  if (checkIn) {
    queryParams.set('from', checkIn);
    queryParams.set('checkIn', checkIn);
    const parts = checkIn.split('-');
    if (parts.length === 3) {
      const [y, m, d] = parts;
      queryParams.set('arrivalDate', `${d}/${m}/${y}`);
    }
  }

  if (checkOut) {
    queryParams.set('to', checkOut);
    queryParams.set('checkOut', checkOut);
    const parts = checkOut.split('-');
    if (parts.length === 3) {
      const [y, m, d] = parts;
      queryParams.set('departureDate', `${d}/${m}/${y}`);
    }
  }

  return `https://booking.smoobu.com/9A1692217?${queryParams.toString()}`;
}

export default function SmoobuBookingEmbed({
  propertySlug = 'hill-view',
  targetId = null,
  className = '',
  showSkeleton = true,
  checkIn = null,
  checkOut = null,
  guests = null,
}) {
  const apartmentId = APARTMENT_BY_SLUG[propertySlug] || HILL_VIEW_APARTMENT_ID;
  const containerId = targetId || `apartmentIframe${apartmentId}`;
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const isCompactBar = className && className.includes('min-h-[140px]');
  const iframeUrl = buildSmoobuUrl(apartmentId, { checkIn, checkOut, guests });

  useEffect(() => {
    let cancelled = false;

    loadIframeResizerScript().then(() => {
      if (cancelled) return;
      if (typeof window !== 'undefined' && window.iFrameResize) {
        try {
          window.iFrameResize({
            heightCalculationMethod: 'lowestElement',
            tolerance: 34,
            waitForLoad: true,
            checkOrigin: false,
          }, `#booking-tool-iFrame-apartment${apartmentId}`);
        } catch {
          // ignore re-initialization error
        }
      }
    });

    const handleMessage = (e) => {
      if (e.origin && e.origin.includes('smoobu.com')) {
        if (!cancelled) setIsLoaded(true);
      }
    };
    window.addEventListener('message', handleMessage);

    // Safety fallback timeout so skeleton is never permanently stuck
    const safetyTimer = setTimeout(() => {
      if (!cancelled) setIsLoaded(true);
    }, 3500);

    return () => {
      cancelled = true;
      window.removeEventListener('message', handleMessage);
      clearTimeout(safetyTimer);
    };
  }, [apartmentId, iframeUrl]);

  return (
    <div className="relative w-full">
      {/* Skeleton placeholder shown while loading in parallel */}
      {!isLoaded && showSkeleton && (
        <div
          className="smoobu-skeleton absolute inset-0 z-10 flex flex-col md:flex-row items-center justify-between gap-3 pointer-events-none transition-opacity duration-300"
          aria-hidden="true"
        >
          {isCompactBar ? (
            <>
              <div className="w-full md:flex-1 h-11 md:h-12 rounded-2xl bg-white/10 animate-pulse border border-white/15 flex items-center px-4 gap-3">
                <div className="w-4 h-4 rounded-full bg-white/20" />
                <div className="h-3.5 w-24 rounded bg-white/20" />
              </div>
              <div className="w-full md:flex-1 h-11 md:h-12 rounded-2xl bg-white/10 animate-pulse border border-white/15 flex items-center px-4 gap-3">
                <div className="w-4 h-4 rounded-full bg-white/20" />
                <div className="h-3.5 w-24 rounded bg-white/20" />
              </div>
              <div className="w-full md:flex-1 h-11 md:h-12 rounded-2xl bg-white/10 animate-pulse border border-white/15 flex items-center px-4 gap-3">
                <div className="w-4 h-4 rounded-full bg-white/20" />
                <div className="h-3.5 w-20 rounded bg-white/20" />
              </div>
              <div className="w-full md:w-36 h-11 md:h-12 rounded-2xl bg-white/25 animate-pulse border border-white/20 flex items-center justify-center">
                <div className="h-3.5 w-16 rounded bg-white/40" />
              </div>
            </>
          ) : (
            <div className="w-full h-full min-h-[480px] rounded-2xl bg-neutral-100 animate-pulse border border-neutral-200/80 p-6 space-y-4">
              <div className="h-6 w-40 bg-neutral-200 rounded" />
              <div className="h-44 w-full bg-neutral-200 rounded-xl" />
              <div className="h-12 w-full bg-neutral-200 rounded-xl" />
            </div>
          )}
        </div>
      )}

      <div
        id={containerId}
        ref={containerRef}
        className={className || "w-full min-h-[520px] bg-white"}
        aria-label="Smoobu booking availability"
      >
        <div className="smoobu-booking-tool-container w-full">
          <style>{`.smoobu-booking-tool-container iframe { width: 100%; border: 0; }`}</style>
          <iframe
            id={`booking-tool-iFrame-apartment${apartmentId}`}
            key={iframeUrl}
            src={iframeUrl}
            scrolling="no"
            allowtransparency="true"
            allowFullScreen
            wmode="transparent"
            style={{ width: '100%', border: 0, maxWidth: '1000px' }}
            onLoad={() => setIsLoaded(true)}
          />
        </div>
      </div>
    </div>
  );
}
