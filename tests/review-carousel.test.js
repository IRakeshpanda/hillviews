import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

import { approvedReviews } from '../src/data/reviews.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let vite;
let ReviewCarousel;

test.before(async () => {
  vite = await createServer({
    root: rootDir,
    server: { middlewareMode: true }
  });
  const mod = await vite.ssrLoadModule('./src/components/reviews/ReviewCarousel.jsx');
  ReviewCarousel = mod.default;
});

test.after(async () => {
  if (vite) {
    await vite.close();
  }
});

test('DATA: approvedReviews contains required fields without sample flags', () => {
  assert.equal(approvedReviews.length, 8);

  for (const review of approvedReviews) {
    assert.ok(review.id, 'review must have an id');
    assert.ok(review.reviewerName, 'review must have a reviewerName');
    assert.ok(review.text, 'review must have text');
    assert.ok(review.rating >= 1 && review.rating <= 5, 'rating must be between 1 and 5');
    assert.ok(review.meta, 'review must have a meta line');
    assert.equal(review.isSample, undefined, 'isSample flag must be deleted');

    // Verify no sample or fictional strings in data
    assert.equal(/sample/i.test(JSON.stringify(review)), false);
    assert.equal(/fictional/i.test(JSON.stringify(review)), false);
    assert.equal(/layout testing/i.test(JSON.stringify(review)), false);
  }
});

test('COMPONENT: renders left column and right column according to target design', () => {
  const html = renderToStaticMarkup(React.createElement(ReviewCarousel));

  // 1. Left column eyebrow
  assert.ok(html.includes('review-carousel-eyebrow'), 'must have eyebrow class');
  assert.ok(html.includes('review-carousel-eyebrow-dot'), 'must have eyebrow dot');
  assert.ok(html.includes('GUEST REVIEWS'), 'must contain GUEST REVIEWS');

  // 2. Heading
  assert.ok(html.includes('review-carousel-heading'), 'must have heading class');
  assert.ok(html.includes('What our guests say'), 'must render target heading');

  // 3. Subtext
  assert.ok(html.includes('review-carousel-subtext'), 'must have subtext class');
  assert.ok(
    html.includes('One story at a time, straight from guests who have stayed at Hill View.'),
    'must render default subtext'
  );

  // 4. Counter (01 / 08 zero-padded)
  assert.ok(html.includes('review-carousel-counter'), 'must have counter class');
  assert.ok(html.includes('01 / 08'), 'must display zero-padded counter 01 / 08');

  // 5. Controls row (segmented progress indicator + circular prev/next buttons)
  assert.ok(html.includes('review-carousel-segments'), 'must have segments container');
  assert.ok(html.includes('review-carousel-segment is-active'), 'active segment must have is-active');
  assert.ok(html.includes('aria-label="Go to review 1"'));
  assert.ok(html.includes('aria-label="Go to review 8"'));
  assert.ok(html.includes('aria-label="Previous review"'));
  assert.ok(html.includes('aria-label="Next review"'));

  // 6. Right column card
  assert.ok(html.includes('review-carousel-card'), 'must have review card');
  assert.ok(html.includes('review-carousel-stars'), 'must have stars container');
  assert.ok(html.includes('review-carousel-star--filled'), 'must render filled stars');
  assert.ok(html.includes('review-carousel-quote'), 'must render quote');
  assert.ok(html.includes('aria-live="polite"'), 'quote must have aria-live="polite"');
  assert.ok(html.includes('“'), 'quote must start with opening curly quote');
  assert.ok(html.includes('”'), 'quote must end with closing curly quote');

  // 7. Author bottom row
  assert.ok(html.includes('review-carousel-avatar'), 'must have avatar container');
  assert.ok(html.includes('EC'), 'must generate EC initials for Emily Carter');
  assert.ok(html.includes('Emily Carter'), 'must display reviewer name');
  assert.ok(html.includes('Stayed August 2026 · Direct'), 'must display meta line');

  // 8. Removals verification
  assert.equal(/sample/i.test(html), false, 'word sample must not appear in rendered HTML');
  assert.equal(/fictional/i.test(html), false, 'word fictional must not appear in rendered HTML');
  assert.equal(/layout testing/i.test(html), false, 'layout testing must not appear in rendered HTML');
  assert.equal(/review carousel preview/i.test(html), false, 'old preview heading must not appear');
  assert.equal(/pause/i.test(html), false, 'pause button must not appear');
  assert.equal(/hill view stone cottage/i.test(html), false, 'old property label above quote must not appear');
});

test('COMPONENT: property filtering and custom heading/subtext support', () => {
  const html = renderToStaticMarkup(
    React.createElement(ReviewCarousel, {
      propertySlug: 'chalet-le-joyau'
    })
  );

  // Counter should reflect 4 chalet reviews
  assert.ok(html.includes('01 / 04'), 'counter must update to 01 / 04 for chalet reviews');
  assert.ok(html.includes('CE'), 'must generate CE initials for Charlotte Evans');
  assert.ok(html.includes('Charlotte Evans'), 'must display Charlotte Evans');
  assert.ok(
    html.includes('One story at a time, straight from guests who have stayed at Chalet Le Joyau.'),
    'must display chalet subtext'
  );
  assert.equal(/sample/i.test(html), false);
});

test('CSS: ReviewCarousel.css specifies desktop 2-col, mobile stacking, and style rules', () => {
  const cssPath = path.join(rootDir, 'src/components/reviews/ReviewCarousel.css');
  const css = fs.readFileSync(cssPath, 'utf8');

  // Desktop 2-column layout (~40% left, 60% right)
  assert.ok(css.includes('grid-template-columns'), 'must specify grid columns');
  assert.ok(css.includes('0.42fr') || css.includes('40%') || css.includes('4fr'), 'must define ~40% left column');

  // Mobile stacked layout order (<900px)
  assert.ok(css.includes('@media (max-width: 899px)'), 'must include tablet/mobile breakpoint <900px');
  assert.ok(css.includes('order: 1'), 'header must be order: 1 on mobile');
  assert.ok(css.includes('order: 2'), 'card must be order: 2 on mobile');
  assert.ok(css.includes('order: 3'), 'controls must be order: 3 on mobile');
  assert.ok(css.includes('display: contents'), 'left column must unwrap with display: contents on mobile');

  // Star colors
  assert.ok(css.includes('#C9A227'), 'filled stars must use gold color #C9A227');

  // Layout shift prevention
  assert.ok(css.includes('min-height'), 'card or quote area must have min-height to prevent layout shift');

  // Accessibility
  assert.ok(css.includes(':focus-visible'), 'interactive elements must have focus-visible styling');
  assert.ok(css.includes('prefers-reduced-motion'), 'must support prefers-reduced-motion');
});

test('REMOVALS: Whole codebase check for sample, fictional, layout testing in front end', () => {
  const srcDir = path.join(rootDir, 'src');
  const filesToCheck = [
    'src/data/reviews.js',
    'src/components/reviews/ReviewCarousel.jsx',
    'src/components/reviews/ReviewCarousel.css',
    'src/index.css',
    'src/pages/CottagePage.jsx',
    'src/pages/HillViewCottagePage.jsx',
    'src/pages/ChaletLeJoyauPage.jsx',
    'src/pages/FeaturesPage.jsx'
  ];

  for (const relPath of filesToCheck) {
    const fullPath = path.join(rootDir, relPath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      assert.equal(/sample/i.test(content), false, `file ${relPath} must not contain sample`);
      assert.equal(/fictional/i.test(content), false, `file ${relPath} must not contain fictional`);
      assert.equal(/layout testing/i.test(content), false, `file ${relPath} must not contain layout testing`);
    }
  }
});
