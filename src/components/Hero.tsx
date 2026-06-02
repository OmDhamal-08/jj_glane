import React from 'react';
import { BUSINESS_DETAILS } from '../constants';

const headline = 'Glen Kitchen Gallery for Modern Pune Homes';
const headlineLines = [
  ['Glen', 'Kitchen'],
  ['Gallery', 'for'],
  ['Modern', 'Pune'],
  ['Homes'],
];

const showcaseProducts = [
  {
    label: 'Auto-Clean Chimneys',
    value: '1200 m3/h',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=85&w=300',
  },
  {
    label: 'Built-in Hobs',
    value: '4 Burner',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=85&w=300',
  },
  {
    label: 'Smart Ovens',
    value: '65 Litres',
    image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&q=85&w=300',
  },
];

const heroHighlights = [
  'Live chimney and hob demos',
  'Direct showroom offer guidance',
  'Delivery and installation support',
];

const StarIcon = () => (
  <svg className="premium-hero__star" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M10 1.7l2.35 5.05 5.53.66-4.08 3.74 1.08 5.47L10 13.85l-4.88 2.77 1.08-5.47-4.08-3.74 5.53-.66L10 1.7z" />
  </svg>
);

const Hero: React.FC = () => {
  return (
    <section className="premium-hero mesh-bg">
      <div className="premium-hero__inner">
        <div className="premium-hero__copy">
          <span className="tag premium-hero__eyebrow">Authorized Glen Gallery - Ravet, Pune</span>

          <h1 className="premium-hero__heading" aria-label={headline}>
            {headlineLines.map((line) => (
              <span className="hero-heading-line" aria-hidden="true" key={line.join('-')}>
                {line.map((word) => (
                  <span className="hero-heading-word" key={word}>
                    {word}
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <p className="hero-subheadline premium-hero__subheadline">
            Compare chimneys, hobs, ovens, dishwashers, and kitchen upgrade bundles at JJ Kitchen Appliances in Ravet.
          </p>

          <ul className="premium-hero__quick-list" aria-label="Showroom services">
            {heroHighlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div className="premium-hero__actions" aria-label="Hero actions">
            <a href="#enquiry" className="btn-g hero-cta premium-hero__cta">
              <span>Get Free Quote</span>
              <svg aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a href="#products" className="btn-outline hero-cta premium-hero__cta">
              <span>Explore Products</span>
            </a>
          </div>

          <div className="premium-hero__proof" aria-label="Store highlights">
            {[
              { value: String(BUSINESS_DETAILS.rating), label: 'Google rating' },
              { value: `${BUSINESS_DETAILS.reviewsCount}+`, label: 'Reviews' },
              { value: BUSINESS_DETAILS.hours, label: 'Open all days' },
            ].map((item) => (
              <div className="premium-hero__proof-item" key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-showcase premium-hero__showcase" aria-label="Premium kitchen appliance showcase">
          <div className="premium-hero__image-wrap">
            <img
              src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=90&w=1400"
              alt="Premium kitchen fitted with modern appliances"
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
            />
            <div className="premium-hero__image-sheen" />
            <div className="premium-hero__image-caption">
              <div>
                <span>Live Demo Ready</span>
                <strong>Kitchen Gallery Experience</strong>
              </div>
              <div className="premium-hero__rating">
                <StarIcon />
                <strong>{BUSINESS_DETAILS.rating}</strong>
              </div>
            </div>
          </div>

          <div className="premium-hero__product-stack" aria-hidden="true">
            {showcaseProducts.map((product, index) => (
              <div className="hero-showcase-card premium-hero__product-card" key={product.label} style={{ animationDelay: `${index * -1.35}s` }}>
                <img
                  src={product.image}
                  alt=""
                  onError={(event) => {
                    event.currentTarget.style.display = 'none';
                  }}
                />
                <div>
                  <span>{product.label}</span>
                  <strong>{product.value}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
