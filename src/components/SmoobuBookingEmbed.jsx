import { useEffect, useRef, useState } from 'react';

const SMOOBU_SCRIPT_URL = 'https://login.smoobu.com/js/Settings/BookingToolIframe.js';
const SMOOBU_CUSTOMER_ID = '1692217';

const APARTMENT_BY_SLUG = {
  'hill-view': '3244297',
  'chalet-le-joyau': '3341427',
};

let vendorScriptPromise;

export function loadSmoobuScript() {
  if (typeof window === 'undefined') return Promise.resolve();

  if (window.BookingToolIframe?.initialize) return Promise.resolve();

  if (vendorScriptPromise) return vendorScriptPromise;

  vendorScriptPromise = new Promise((resolve, reject) => {
    let script = document.querySelector(`script[src="${SMOOBU_SCRIPT_URL}"]`);

    if (script) {
      if (window.BookingToolIframe?.initialize) {
        resolve();
        return;
      }
      script.addEventListener('load', resolve, { once: true });
      script.addEventListener('error', reject, { once: true });
      return;
    }

    script = document.createElement('script');
    script.src = SMOOBU_SCRIPT_URL;
    script.async = true;
    script.addEventListener('load', resolve, { once: true });
    script.addEventListener('error', reject, { once: true });
    document.head.appendChild(script);
  });

  return vendorScriptPromise;
}

// Kick off loading immediately on script execution in browser
if (typeof window !== 'undefined') {
  loadSmoobuScript();
}

export default function SmoobuBookingEmbed({
  propertySlug = null,
  targetId = null,
  className = '',
  showSkeleton = true,
}) {
  const isAll = !propertySlug || propertySlug === 'all';
  const apartmentId = isAll ? null : APARTMENT_BY_SLUG[propertySlug];
  const containerId = targetId || (isAll ? 'apartmentIframeAll' : `apartmentIframe${apartmentId}`);
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    if (!isAll && !apartmentId) return undefined;

    let cancelled = false;

    // Observe container for the injected iframe to detect when it actually loads
    const checkIframe = (iframe) => {
      if (!iframe) return;
      try {
        if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
          if (!cancelled) setIsLoaded(true);
          return;
        }
      } catch (e) {
        // Cross-origin iframe may throw on contentDocument access
      }
      iframe.addEventListener('load', () => {
        if (!cancelled) setIsLoaded(true);
      }, { once: true });
    };

    const observer = new MutationObserver(() => {
      const iframe = container.querySelector('iframe');
      if (iframe) {
        checkIframe(iframe);
      }
    });

    observer.observe(container, { childList: true, subtree: true });

    const existingIframe = container.querySelector('iframe');
    if (existingIframe) {
      checkIframe(existingIframe);
    }

    const handleMessage = (e) => {
      if (e.origin && e.origin.includes('smoobu.com')) {
        if (!cancelled) setIsLoaded(true);
      }
    };
    window.addEventListener('message', handleMessage);

    // Safety fallback timeout so skeleton is never permanently stuck
    const safetyTimer = setTimeout(() => {
      if (!cancelled) setIsLoaded(true);
    }, 4500);

    loadSmoobuScript()
      .then(() => {
        if (cancelled || !container.isConnected) return;
        if (!window.BookingToolIframe?.initialize) return;

        container.replaceChildren();

        const url = isAll
          ? `https://login.smoobu.com/en/booking-tool/iframe/${SMOOBU_CUSTOMER_ID}`
          : `https://login.smoobu.com/en/booking-tool/iframe/${SMOOBU_CUSTOMER_ID}/${apartmentId}`;

        window.BookingToolIframe.initialize({
          url,
          baseUrl: 'https://login.smoobu.com',
          target: `#${container.id}`,
        });
      })
      .catch((error) => {
        if (!cancelled) {
          console.warn('Smoobu booking widget could not be loaded.', error);
          setIsLoaded(true);
        }
      });

    return () => {
      cancelled = true;
      observer.disconnect();
      window.removeEventListener('message', handleMessage);
      clearTimeout(safetyTimer);
      container.replaceChildren();
    };
  }, [apartmentId, isAll, containerId]);

  if (!isAll && !apartmentId) return null;

  return (
    <div className="relative w-full">
      {/* Skeleton placeholder shown while loading in parallel */}
      {!isLoaded && showSkeleton && (
        <div
          className="smoobu-skeleton absolute inset-0 z-10 flex flex-col md:flex-row items-center justify-between gap-3 pointer-events-none transition-opacity duration-300"
          aria-hidden="true"
        >
          {isAll ? (
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
        className={className || (isAll ? "w-full min-h-[140px] bg-transparent" : "w-full min-h-[520px] bg-white")}
        aria-label="Smoobu booking availability"
      />
    </div>
  );
}
