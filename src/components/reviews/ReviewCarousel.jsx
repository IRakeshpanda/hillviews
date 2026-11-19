import React, { useMemo, useState } from 'react';
import { Star, StarHalf, UserRound } from 'lucide-react';
import Carousel from './Carousel';
import { approvedReviews } from '../../data/reviews';

const propertyNames = {
  'hill-view': 'Hill View Stone Cottage',
  'chalet-le-joyau': 'Chalet Le Joyau',
};

function fisherYatesShuffle(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
}

export default function ReviewCarousel({ propertySlug = null, shuffle = false, heading = null, subline = null, combined = false }) {
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  React.useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);

  const isDevelopment = import.meta.env.DEV;

  const eligibleReviews = useMemo(() => {
    let eligible = approvedReviews.filter((review) => isDevelopment || !review.isSample);
    if (propertySlug) eligible = eligible.filter((review) => review.propertySlug === propertySlug);
    return shuffle ? fisherYatesShuffle(eligible) : eligible;
  }, [isDevelopment, propertySlug, shuffle]);

  if (eligibleReviews.length === 0) return null;

  const preview = isDevelopment;
  const items = eligibleReviews.map((review) => {
    const fullStars = Math.floor(review.rating);
    const hasHalfStar = review.rating % 1 !== 0;
    const starElements = Array.from({ length: 5 }, (_, index) => {
      if (index < fullStars) {
        return React.createElement(Star, { key: index, className: 'review-carousel-card__star review-carousel-card__star--filled', 'aria-hidden': 'true' });
      }
      if (index === fullStars && hasHalfStar) {
        return React.createElement(StarHalf, { key: index, className: 'review-carousel-card__star review-carousel-card__star--filled', 'aria-hidden': 'true' });
      }
      return React.createElement(Star, { key: index, className: 'review-carousel-card__star', 'aria-hidden': 'true' });
    });

    return React.createElement(
      'article',
      { key: review.id, className: 'review-carousel-card' },
      React.createElement(
        'div',
        { className: 'review-carousel-card__top' },
        React.createElement('span', { className: 'review-carousel-card__property' }, propertyNames[review.propertySlug]),
        React.createElement(
          'span',
          { className: 'review-carousel-card__rating', 'aria-label': `${review.rating} out of ${review.ratingScale} stars`, role: 'img' },
          ...starElements
        )
      ),
      React.createElement('blockquote', { className: 'review-carousel-card__quote' }, `“${review.text}”`),
      React.createElement(
        'cite',
        { className: 'review-carousel-card__name' },
        React.createElement(
          'span',
          { className: `review-carousel-card__profile review-carousel-card__profile--${review.gender}`, 'aria-hidden': 'true' },
          React.createElement(UserRound, { className: 'review-carousel-card__profile-icon' })
        ),
        React.createElement('span', null, review.reviewerName)
      ),
      preview && React.createElement('span', { className: 'review-carousel-card__sample', 'aria-label': 'Sample review — fictional' }, 'Sample review — fictional')
    );
  });

  const sectionHeading = preview ? 'Review carousel preview' : heading;
  const sectionSubline = preview ? 'Fictional sample content for layout testing only.' : subline;

  return (
    <section className="review-carousel-section">
      {sectionHeading && (
        <header className="review-carousel-section__header">
          <h2 className="review-carousel-section__heading">{sectionHeading}</h2>
          {sectionSubline && <p className="review-carousel-section__subline">{sectionSubline}</p>}
        </header>
      )}
      <div className="review-carousel-wrap">
        <div className="review-carousel-controls-top">
          <button
            type="button"
            className="review-carousel-toggle"
            onClick={() => setPaused((value) => !value)}
            aria-label={paused ? 'Play review carousel' : 'Pause review carousel'}
          >
            {paused || reducedMotion ? 'Play' : 'Pause'}
          </button>
        </div>

        <Carousel
          key={`${paused}-${reducedMotion}`}
          items={items}
          baseWidth={600}
          aspectRatio={1.25}
          peek={72}
          gap={16}
          radius={20}
          frame={false}
          effect="scale"
          indicator="bars"
          arrows
          autoplay={!paused && !reducedMotion}
          autoplayDelay={4000}
          pauseOnHover
          loop
          draggable
          round={false}
          theme="light"
          className="approved-review-carousel"
        />
      </div>
    </section>
  );
}
