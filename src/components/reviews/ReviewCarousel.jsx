import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Star, StarHalf, ChevronLeft, ChevronRight } from 'lucide-react';
import { approvedReviews } from '../../data/reviews';
import './ReviewCarousel.css';

function fisherYatesShuffle(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
}

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function ReviewCarousel({
  propertySlug = null,
  shuffle = false,
  heading = 'What our guests say',
  subline = null,
  combined = false,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState('next');
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);

  const eligibleReviews = useMemo(() => {
    let eligible = approvedReviews;
    if (propertySlug) {
      eligible = eligible.filter((review) => review.propertySlug === propertySlug);
    }
    return shuffle ? fisherYatesShuffle(eligible) : eligible;
  }, [propertySlug, shuffle]);

  const totalReviews = eligibleReviews.length;

  const defaultSubline = 'One story at a time, straight from guests who have stayed at Hill View.';
  const effectiveSubline = subline || defaultSubline;

  // Wrap-around navigation handlers
  const handlePrev = () => {
    if (totalReviews <= 1) return;
    setDirection('prev');
    setCurrentIndex((prev) => (prev - 1 + totalReviews) % totalReviews);
  };

  const handleNext = () => {
    if (totalReviews <= 1) return;
    setDirection('next');
    setCurrentIndex((prev) => (prev + 1) % totalReviews);
  };

  const goTo = (index) => {
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? 'next' : 'prev');
    setCurrentIndex(index);
  };

  // Keyboard navigation for carousel
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    } else if (e.key === 'Home') {
      e.preventDefault();
      goTo(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      goTo(totalReviews - 1);
    }
  };

  // Autoplay support: pauses on hover, focus, and when prefers-reduced-motion is active
  useEffect(() => {
    if (reducedMotion || isHovered || isFocused || totalReviews <= 1) return undefined;
    const timer = setInterval(() => {
      setDirection('next');
      setCurrentIndex((prev) => (prev + 1) % totalReviews);
    }, 5000);
    return () => clearInterval(timer);
  }, [reducedMotion, isHovered, isFocused, totalReviews]);

  // Touch swipe support for mobile
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Minimum swipe threshold and mostly horizontal movement
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  if (totalReviews === 0) return null;

  const safeIndex = currentIndex >= totalReviews ? 0 : currentIndex;
  const currentReview = eligibleReviews[safeIndex];

  const renderStars = (rating = 5) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    return Array.from({ length: 5 }, (_, index) => {
      if (index < fullStars) {
        return (
          <Star
            key={index}
            className="review-carousel-star review-carousel-star--filled"
            aria-hidden="true"
          />
        );
      }
      if (index === fullStars && hasHalfStar) {
        return (
          <StarHalf
            key={index}
            className="review-carousel-star review-carousel-star--filled"
            aria-hidden="true"
          />
        );
      }
      return (
        <Star
          key={index}
          className="review-carousel-star review-carousel-star--unfilled"
          aria-hidden="true"
        />
      );
    });
  };

  const counterString = `${String(safeIndex + 1).padStart(2, '0')} / ${String(totalReviews).padStart(2, '0')}`;

  return (
    <section
      ref={containerRef}
      className="review-carousel-section"
      role="region"
      aria-roledescription="carousel"
      aria-label="Guest reviews carousel"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <div className="review-carousel-container">
        {/* Left Column (Desktop) / Stacks around card on mobile */}
        <div className="review-carousel-left">
          {/* Eyebrow, Heading, Subtext */}
          <div className="review-carousel-header">
            <div className="review-carousel-eyebrow">
              <span className="review-carousel-eyebrow-dot" aria-hidden="true" />
              <span>GUEST REVIEWS</span>
            </div>
            <h2 className="review-carousel-heading">
              {heading}
            </h2>
            <p className="review-carousel-subtext">
              {effectiveSubline}
            </p>
          </div>

          {/* Counter and Controls Row */}
          <div className="review-carousel-controls-block">
            <div className="review-carousel-counter" aria-hidden="true">
              {counterString}
            </div>

            <div className="review-carousel-controls-row">
              {/* Segmented Progress Indicator */}
              <div
                className="review-carousel-segments"
                role="tablist"
                aria-label="Review pagination"
              >
                {eligibleReviews.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    role="tab"
                    className={`review-carousel-segment ${index === safeIndex ? 'is-active' : ''}`}
                    aria-selected={index === safeIndex}
                    aria-label={`Go to review ${index + 1}`}
                    onClick={() => goTo(index)}
                  >
                    <span className="review-carousel-segment-bar" />
                  </button>
                ))}
              </div>

              {/* Prev / Next Circular Outline Buttons */}
              <div className="review-carousel-buttons">
                <button
                  type="button"
                  className="review-carousel-nav-btn"
                  onClick={handlePrev}
                  aria-label="Previous review"
                >
                  <ChevronLeft className="review-carousel-nav-icon" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="review-carousel-nav-btn"
                  onClick={handleNext}
                  aria-label="Next review"
                >
                  <ChevronRight className="review-carousel-nav-icon" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Single Large Review Card */}
        <div className="review-carousel-card-wrap">
          <article
            className="review-carousel-card"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              key={currentReview.id}
              className="review-carousel-card-inner"
              data-direction={direction}
            >
              {/* Top: 5-star rating row */}
              <div
                className="review-carousel-stars"
                role="img"
                aria-label={`${currentReview.rating} out of ${currentReview.ratingScale || 5} stars`}
              >
                {renderStars(currentReview.rating)}
              </div>

              {/* Middle: Review quote */}
              <div className="review-carousel-quote-area">
                <blockquote
                  className="review-carousel-quote"
                  aria-live="polite"
                >
                  “{currentReview.text}”
                </blockquote>
              </div>

              {/* Bottom row */}
              <div className="review-carousel-footer">
                <div className="review-carousel-author">
                  <div className="review-carousel-avatar" aria-hidden="true">
                    {getInitials(currentReview.reviewerName)}
                  </div>
                  <div className="review-carousel-author-info">
                    <span className="review-carousel-author-name">
                      {currentReview.reviewerName}
                    </span>
                    {currentReview.meta && (
                      <span className="review-carousel-author-meta">
                        {currentReview.meta}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
