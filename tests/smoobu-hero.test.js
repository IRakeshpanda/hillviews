import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let vite;
let HeroSection;
let SmoobuBookingEmbed;

test.before(async () => {
  vite = await createServer({
    root: rootDir,
    server: { middlewareMode: true }
  });
  const heroMod = await vite.ssrLoadModule('./src/components/HeroSection.jsx');
  HeroSection = heroMod.default;

  const smoobuMod = await vite.ssrLoadModule('./src/components/SmoobuBookingEmbed.jsx');
  SmoobuBookingEmbed = smoobuMod.default;
});

test.after(async () => {
  if (vite) {
    await vite.close();
  }
});

test('SmoobuBookingEmbed: renders apartmentIframe3244297 with skeleton placeholder', () => {
  const html = renderToStaticMarkup(React.createElement(SmoobuBookingEmbed, { propertySlug: 'hill-view' }));
  assert.ok(html.includes('id="apartmentIframe3244297"'), 'must have id apartmentIframe3244297');
  assert.ok(html.includes('smoobu-skeleton'), 'must render skeleton placeholder when loading');
  assert.ok(html.includes('aria-label="Smoobu booking availability"'));
});

test('SmoobuBookingEmbed: defaults to Hill View apartment 3244297', () => {
  const htmlDefault = renderToStaticMarkup(React.createElement(SmoobuBookingEmbed));
  assert.ok(htmlDefault.includes('id="apartmentIframe3244297"'), 'must map default to 3244297');

  const hillHtml = renderToStaticMarkup(React.createElement(SmoobuBookingEmbed, { propertySlug: 'hill-view' }));
  assert.ok(hillHtml.includes('id="apartmentIframe3244297"'), 'must map hill-view to 3244297');
});

test('HeroSection: booking form container has exact requested transparent glass styling and custom search form', () => {
  const html = renderToStaticMarkup(
    React.createElement(
      MemoryRouter,
      null,
      React.createElement(HeroSection)
    )
  );

  // Must contain the exact requested classes
  const expectedClasses = 'mt-8 w-full max-w-4xl rounded-3xl bg-transparent backdrop-blur-xl border border-white/30 shadow-2xl overflow-hidden p-3 md:p-5 text-neutral-900';
  assert.ok(html.includes(expectedClasses), `Hero container must have exact classes: ${expectedClasses}`);

  // bg-white/95 must be completely removed from the desktop hero booking container
  assert.equal(html.includes('rounded-3xl bg-white/95'), false, 'bg-white/95 must be replaced with bg-transparent');

  // Must contain custom search form elements
  assert.ok(html.includes('booking-search-form'), 'Hero section must contain booking-search-form');
  assert.ok(html.includes('Check-in'), 'Hero section must contain Check-in');
  assert.ok(html.includes('Check-out'), 'Hero section must contain Check-out');
  assert.ok(html.includes('Guests'), 'Hero section must contain Guests');
  assert.ok(html.includes('Check Dates'), 'Hero section must contain Check Dates button');
});

test('Navbar: has id="site-navbar" for entrance animation and preserves centering transform on wrapper', () => {
  const navbarSource = fs.readFileSync(path.join(rootDir, 'src/components/Navbar.jsx'), 'utf8');
  assert.ok(navbarSource.includes('id="site-navbar"'), 'Navbar must have id="site-navbar" for entrance animation');
  assert.ok(navbarSource.includes('-translate-x-1/2'), 'Centering wrapper must maintain -translate-x-1/2');
  
  // Extract header element tag definition to verify it does not have transition-all
  const headerMatch = navbarSource.match(/<header\s+id="site-navbar"[\s\S]*?>/);
  assert.ok(headerMatch, 'Header element must exist');
  assert.ok(!headerMatch[0].includes('transition-all'), 'Header element should avoid transition-all to prevent fighting GSAP');
});

test('HeroSection: entrance animation sequence slides navbar upward and staggers elements with power2.out', () => {
  const heroSource = fs.readFileSync(path.join(rootDir, 'src/components/HeroSection.jsx'), 'utf8');
  // Check that navbar slides upward from lower position (y: 12 -> y: 0)
  assert.ok(
    heroSource.includes('siteNavbar') &&
    heroSource.includes('y: 12') &&
    heroSource.includes('y: 0') &&
    heroSource.includes('clearProps: \'transform\''),
    'Navbar entrance animation must slide gently upward from y: 12 to y: 0 with transform cleared'
  );

  // Check that horizontal movement (e.g. xPercent) is completely removed from navbar animation
  assert.ok(!heroSource.includes('xPercent: -50'), 'Horizontal offset/xPercent must not be present in navbar animation');

  // Check easing is power2.out
  assert.ok(heroSource.includes("ease: 'power2.out'"), 'Entrance animations must use soft ease-out power2.out');

  // Check prefersReducedMotion handling
  assert.ok(heroSource.includes('prefersReducedMotion'), 'Must respect prefersReducedMotion');
});

test('Booking search forms: Hero, Gallery, and Cottage pages embed custom BookingSearchForm', () => {
  const navbarSource = fs.readFileSync(path.join(rootDir, 'src/components/Navbar.jsx'), 'utf8');
  assert.ok(navbarSource.includes('to="/cottage"'), 'Navbar must link booking buttons to /cottage');

  const metricsSource = fs.readFileSync(path.join(rootDir, 'src/components/MetricsAndClosing.jsx'), 'utf8');
  assert.ok(metricsSource.includes('to="/cottage"'), 'MetricsAndClosing CTA must link to /cottage');

  const roomsSource = fs.readFileSync(path.join(rootDir, 'src/components/RoomsShowcase.jsx'), 'utf8');
  assert.ok(roomsSource.includes('to="/cottage"'), 'RoomsShowcase CTA must link to /cottage');

  const heroSource = fs.readFileSync(path.join(rootDir, 'src/components/HeroSection.jsx'), 'utf8');
  assert.ok(heroSource.includes('BookingSearchForm'), 'HeroSection must use BookingSearchForm');

  const gallerySource = fs.readFileSync(path.join(rootDir, 'src/pages/GalleryPage.jsx'), 'utf8');
  assert.ok(gallerySource.includes('BookingSearchForm'), 'GalleryPage bottom section must use BookingSearchForm');

  const cottagePageSource = fs.readFileSync(path.join(rootDir, 'src/pages/CottagePage.jsx'), 'utf8');
  assert.ok(cottagePageSource.includes('BookingSearchForm'), 'CottagePage must use BookingSearchForm');

  const footerSource = fs.readFileSync(path.join(rootDir, 'src/components/Footer.jsx'), 'utf8');
  assert.ok(footerSource.includes('to="/cottage"'), 'Footer Book Direct Now must link to /cottage');

  const hillViewCottageSource = fs.readFileSync(path.join(rootDir, 'src/pages/HillViewCottagePage.jsx'), 'utf8');
  assert.ok(hillViewCottageSource.includes('HillViewBookingCard'), 'HillViewCottagePage must embed HillViewBookingCard');
});

test('GalleryPage lookbook: fixes blank space by clamping distance, removing bottom padding, and aligning scroll', () => {
  const gallerySource = fs.readFileSync(path.join(rootDir, 'src/pages/GalleryPage.jsx'), 'utf8');
  assert.ok(gallerySource.includes("viewMode === 'masonry' ? 'pb-16 sm:pb-24' : 'pb-0'"), 'Must remove wrapper bottom padding in lookbook mode');
  assert.ok(gallerySource.includes('track.scrollWidth - track.clientWidth'), 'Must accurately calculate total distance from clientWidth to avoid blank space');
  assert.ok(gallerySource.includes('ResizeObserver'), 'Must observe track size to handle image loading without blank space');
});

test('GalleryPage tab switching: locks minHeight and animates height to avoid layout collapse', () => {
  const gallerySource = fs.readFileSync(path.join(rootDir, 'src/pages/GalleryPage.jsx'), 'utf8');
  assert.ok(gallerySource.includes('masonryGridRef.current.style.minHeight'), 'Must lock minHeight before changing category');
  assert.ok(gallerySource.includes('targetHeight = grid.scrollHeight'), 'Must measure targetHeight');
  assert.ok(gallerySource.includes('gsap.fromTo(grid'), 'Must animate container minHeight with GSAP');
  assert.ok(!gallerySource.includes('Flip.from(state, { absolute: true'), 'Must not make gallery items absolute during tab transition');
});

test('Visible pricing: removed £185 / night and replaced with View Pricing linking to Hill View cottage page', () => {
  const cottagePageSource = fs.readFileSync(path.join(rootDir, 'src/pages/CottagePage.jsx'), 'utf8');
  assert.equal(cottagePageSource.includes('£185'), false, 'CottagePage must not display £185');
  assert.equal(cottagePageSource.includes('/ night'), false, 'CottagePage must not display / night');
  assert.ok(cottagePageSource.includes('View Pricing'), 'CottagePage must display View Pricing');
  assert.equal(cottagePageSource.includes('chalet-le-joyau'), false, 'CottagePage must not contain chalet-le-joyau');
  assert.ok(cottagePageSource.includes('to="/hill-view-cottage"'), 'CottagePage must link View Pricing to /hill-view-cottage');

  assert.equal(fs.existsSync(path.join(rootDir, 'src/pages/ChaletLeJoyauPage.jsx')), false, 'ChaletLeJoyauPage must be removed');

  const hillViewSource = fs.readFileSync(path.join(rootDir, 'src/pages/HillViewCottagePage.jsx'), 'utf8');
  assert.equal(hillViewSource.includes('£185'), false, 'HillViewCottagePage must not display £185');
});

test('Chalet Le Joyau removed completely from all pages, routes, reviews and features', () => {
  assert.equal(fs.existsSync(path.join(rootDir, 'src/pages/ChaletLeJoyauPage.jsx')), false);
  const appSource = fs.readFileSync(path.join(rootDir, 'src/App.jsx'), 'utf8');
  assert.equal(appSource.includes('ChaletLeJoyauPage'), false);

  const reviewsSource = fs.readFileSync(path.join(rootDir, 'src/data/reviews.js'), 'utf8');
  assert.equal(reviewsSource.includes('chalet-le-joyau'), false);

  const featuresSource = fs.readFileSync(path.join(rootDir, 'src/pages/FeaturesPage.jsx'), 'utf8');
  assert.equal(featuresSource.includes('chalet-le-joyau'), false);
  assert.equal(featuresSource.includes('Chalet Le Joyau'), false);
});

test('Custom booking search flow: bookingUtils validates max 6 guests and loads parameters correctly', async () => {
  const { loadBookingSearch, saveBookingSearch, addDaysIso, MAX_GUESTS } = await vite.ssrLoadModule('./src/utils/bookingUtils.js');

  assert.equal(MAX_GUESTS, 6, 'Max guests must be 6');

  // Test URL param parsing
  const params = new URLSearchParams({
    checkin: '2026-12-01',
    checkout: '2026-12-05',
    guests: '4',
  });

  const parsed = loadBookingSearch(params);
  assert.equal(parsed.checkIn, '2026-12-01');
  assert.equal(parsed.checkOut, '2026-12-05');
  assert.equal(parsed.guests, 4);
  assert.equal(parsed.hasFoundValues, true);

  // Test guest cap at 6
  const excessParams = new URLSearchParams({
    checkin: '2026-12-01',
    checkout: '2026-12-05',
    guests: '10',
  });
  const capped = loadBookingSearch(excessParams);
  assert.equal(capped.guests, 6, 'Must cap guests at 6');

  // Test empty params (direct visit)
  const emptyParsed = loadBookingSearch(new URLSearchParams());
  assert.equal(emptyParsed.checkIn, '');
  assert.equal(emptyParsed.checkOut, '');
  assert.equal(emptyParsed.hasFoundValues, false);
});

test('BookingSearchForm: contains flatpickr date pickers, guest selector max 6, and search button', async () => {
  const formMod = await vite.ssrLoadModule('./src/components/BookingSearchForm.jsx');
  const BookingSearchForm = formMod.default;

  const html = renderToStaticMarkup(
    React.createElement(
      MemoryRouter,
      null,
      React.createElement(BookingSearchForm, { variant: 'section', buttonLabel: 'Check Dates' })
    )
  );

  assert.ok(html.includes('Check-in'), 'must contain Check-in');
  assert.ok(html.includes('Check-out'), 'must contain Check-out');
  assert.ok(html.includes('Add date'), 'must default to empty Add date so previous searches are not sticky');
  assert.ok(html.includes('Guests'), 'must contain Guests');
  assert.ok(html.includes('max 6'), 'must indicate max 6 guests');
  assert.ok(html.includes('Check Dates'), 'must render submit button');

  const cottagePageSource = fs.readFileSync(path.join(rootDir, 'src/pages/CottagePage.jsx'), 'utf8');
  assert.ok(
    cottagePageSource.includes('id="booking-section"') && cottagePageSource.includes('z-30'),
    'CottagePage booking-section must have elevated z-index to prevent guest popup hiding behind property card'
  );
});

test('HillViewBookingCard: pre-fills from URL query params and displays Smoobu embed with parameters', async () => {
  const cardMod = await vite.ssrLoadModule('./src/components/HillViewBookingCard.jsx');
  const HillViewBookingCard = cardMod.default;

  // Direct visit without params
  const directHtml = renderToStaticMarkup(
    React.createElement(
      MemoryRouter,
      { initialEntries: ['/hill-view-cottage'] },
      React.createElement(HillViewBookingCard)
    )
  );

  assert.ok(directHtml.includes('Hill View Stone Cottage'), 'must render card header');
  assert.ok(directHtml.includes('apartmentIframe3244297'), 'must render Smoobu embed container');
  assert.equal(directHtml.includes('Please select both check-in'), false, 'direct visit must have zero errors');

  // Pre-filled visit via query parameters
  const prefillParams = new URLSearchParams('checkin=2026-12-01&checkout=2026-12-05&guests=4');
  const prefillHtml = renderToStaticMarkup(
    React.createElement(
      MemoryRouter,
      { initialEntries: ['/hill-view-cottage?checkin=2026-12-01&checkout=2026-12-05&guests=4'] },
      React.createElement(HillViewBookingCard, { initialSearchParams: prefillParams })
    )
  );

  assert.equal(prefillHtml.includes('Dates & Guests Pre-filled'), false, 'custom pre-fill banner must be removed');
  assert.equal(prefillHtml.includes('Pre-filled reservation'), false, 'custom pre-fill reservation text must be removed');
  assert.equal(prefillHtml.includes('Max 6 capacity'), false, 'custom max capacity text must be removed');
  assert.ok(prefillHtml.includes('apartmentIframe3244297'), 'must render Smoobu embed');
});

test('Custom forms removed: only Smoobu booking forms exist', () => {
  assert.equal(fs.existsSync(path.join(rootDir, 'src/components/BookingModal.jsx')), false, 'BookingModal must be removed');
  assert.equal(fs.existsSync(path.join(rootDir, 'src/components/CottageBookingEngine.jsx')), false, 'CottageBookingEngine must be removed');
  assert.equal(fs.existsSync(path.join(rootDir, 'src/components/HillViewBookingForm.jsx')), false, 'HillViewBookingForm must be removed');

  const appSource = fs.readFileSync(path.join(rootDir, 'src/App.jsx'), 'utf8');
  assert.ok(!appSource.includes('BookingModal'), 'App.jsx must not reference BookingModal');
});
