import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Wifi, Flame, ChefHat, WashingMachine, Tv, Coffee, Bath, ParkingCircle, PawPrint } from 'lucide-react';
import { cottageImages } from '../data/cottageData';
import { getImageSrcSet } from '../utils/imageUtils';
import ReviewCarousel from '../components/reviews/ReviewCarousel';

const sharedFacilities = [
  { label: 'Indoor wood stove', icon: Flame },
  { label: 'High-speed Wi-Fi & ethernet', icon: Wifi },
  { label: 'Private parking for 3 cars + EV', icon: ParkingCircle },
  { label: 'Fully equipped kitchen', icon: ChefHat },
  { label: 'Washer & tumble dryer', icon: WashingMachine },
  { label: 'Smart TV & sound system', icon: Tv },
  { label: 'Coffee maker & kettle', icon: Coffee },
  { label: 'Deep bath & separate shower', icon: Bath },
  { label: 'Pets allowed on request', icon: PawPrint },
];

function PropertyFeatures({ id, name, route, description, image, reviewKey }) {
  return (
    <article id={id} className="scroll-mt-28 border-t border-neutral-200/70 pt-12 md:pt-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-5">
          <img
            src={image}
            srcSet={getImageSrcSet(image)}
            sizes="(max-width: 1024px) 100vw, 500px"
            alt={`${name} interior and facilities`}
            className="w-full aspect-[4/3] object-cover rounded-3xl border border-neutral-200/70"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="lg:col-span-7">
          <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold">Property features</span>
          <h2 className="mt-3 text-3xl md:text-5xl font-serif-editorial font-medium text-neutral-900">{name}</h2>
          <p className="mt-5 text-base md:text-lg leading-relaxed text-neutral-600">{description}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
              <span className="block text-[10px] uppercase tracking-wider text-neutral-400">Maximum guests</span>
              <strong className="block mt-1 text-lg">6 guests</strong>
            </div>
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
              <span className="block text-[10px] uppercase tracking-wider text-neutral-400">Bedrooms</span>
              <strong className="block mt-1 text-lg">3 bedrooms</strong>
            </div>
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
              <span className="block text-[10px] uppercase tracking-wider text-neutral-400">Bathrooms</span>
              <strong className="block mt-1 text-lg">1 bathroom</strong>
            </div>
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
              <span className="block text-[10px] uppercase tracking-wider text-neutral-400">Property size</span>
              <strong className="block mt-1 text-lg">180 m²</strong>
            </div>
          </div>

          <h3 className="mt-10 text-sm font-semibold uppercase tracking-widest text-neutral-900">Confirmed facilities</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {sharedFacilities.map(({ label, icon: Icon }) => (
              <li key={label} className="flex items-center gap-3 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 text-sm text-neutral-700">
                <Icon className="w-4 h-4 text-neutral-500 shrink-0" aria-hidden="true" />
                <span>{label}</span>
              </li>
            ))}
          </ul>

          <Link
            to={`${route}#booking-form`}
            className="inline-flex items-center gap-2 mt-8 min-h-[48px] px-6 py-3 rounded-full bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-800 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900"
          >
            View availability and book
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-white pt-24 pb-24">
      <section className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto pt-12 md:pt-16">
        <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold">Facilities & accommodation</span>
        <h1 className="mt-5 text-5xl md:text-7xl font-serif-editorial font-medium tracking-tight text-neutral-900">Features</h1>
        <p className="mt-5 max-w-2xl text-lg md:text-xl leading-relaxed text-neutral-500 font-light">
          Explore the facilities and handcrafted details of Hill View Cottage in Low Row, Swaledale.
        </p>

        <div className="mt-14 space-y-16 md:space-y-20">
          <PropertyFeatures
            id="hill-view"
            name="Hill View Stone Cottage"
            route="/hill-view-cottage"
            image={cottageImages.panoramicDales}
            description="Two generous living rooms form the heart of the cottage, with a wood-burning stove, Smart TV and high-end sound systems. A large dining area sits beside a separate modern kitchen and utility room."
            reviewKey="hill-view"
          />
        </div>

        <ReviewCarousel
          propertySlug="hill-view"
          heading="What our guests say"
          subline="One story at a time, straight from guests who have stayed at Hill View."
        />
      </section>
    </main>
  );
}
