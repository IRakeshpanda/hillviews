import { useEffect, useRef } from 'react';

const SMOOBU_SCRIPT_URL = 'https://login.smoobu.com/js/Settings/BookingToolIframe.js';
const SMOOBU_CUSTOMER_ID = '1692217';

const APARTMENT_BY_SLUG = {
  'hill-view': '3244297',
  'chalet-le-joyau': '3341427',
};

let vendorScriptPromise;

function loadSmoobuScript() {
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

export default function SmoobuBookingEmbed({ propertySlug }) {
  const apartmentId = APARTMENT_BY_SLUG[propertySlug];
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !apartmentId) return undefined;

    let cancelled = false;

    loadSmoobuScript()
      .then(() => {
        if (cancelled || !container.isConnected) return;
        if (!window.BookingToolIframe?.initialize) return;

        container.replaceChildren();
        window.BookingToolIframe.initialize({
          url: `https://login.smoobu.com/en/booking-tool/iframe/${SMOOBU_CUSTOMER_ID}/${apartmentId}`,
          baseUrl: 'https://login.smoobu.com',
          target: `#${container.id}`,
        });
      })
      .catch((error) => {
        if (!cancelled) console.warn('Smoobu booking widget could not be loaded.', error);
      });

    return () => {
      cancelled = true;
      container.replaceChildren();
    };
  }, [apartmentId]);

  if (!apartmentId) return null;

  return (
    <div
      id={`apartmentIframe${apartmentId}`}
      ref={containerRef}
      className="w-full min-h-[520px] bg-white"
      aria-label="Smoobu booking availability"
    />
  );
}
