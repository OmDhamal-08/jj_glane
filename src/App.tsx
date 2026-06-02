// App.tsx â€” Antigravity Minimalist
import React, { useEffect, useRef, useState } from 'react';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustSection from './components/TrustSection';
import KitchenStudio from './components/KitchenStudio';
import ProductCategories from './components/ProductCategories';
import SpecialOffers from './components/SpecialOffers';
import WhyChooseUs from './components/WhyChooseUs';
import Testimonials from './components/Testimonials';
import EnquiryForm from './components/EnquiryForm';
import ContactMap from './components/ContactMap';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import AdminOffers from './components/AdminOffers';
import { initGsapAnimations } from './gsapAnimations';

import { BUSINESS_DETAILS, SOCIAL_LINKS } from './constants';

const PublicSite: React.FC = () => {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [showLoader, setShowLoader] = useState(true);
  const [loaderFading, setLoaderFading] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setLoaderFading(true), 850);
    const removeTimer = window.setTimeout(() => setShowLoader(false), 1250);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  useEffect(() => {
    const updateScrollUi = () => {
      const scrollableHeight = document.body.scrollHeight - window.innerHeight;
      const pct = scrollableHeight > 0
        ? Math.min(100, Math.max(0, (window.scrollY / scrollableHeight) * 100))
        : 0;

      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${pct}%`;
      }

      setShowBackToTop(window.scrollY > 400);
    };

    updateScrollUi();
    window.addEventListener('scroll', updateScrollUi, { passive: true });
    window.addEventListener('resize', updateScrollUi);

    return () => {
      window.removeEventListener('scroll', updateScrollUi);
      window.removeEventListener('resize', updateScrollUi);
    };
  }, []);

  useEffect(() => {
    const updateVisualViewportOffset = () => {
      const viewport = window.visualViewport;
      const offset = viewport
        ? Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)
        : 0;

      document.documentElement.style.setProperty('--visual-viewport-bottom-offset', `${offset}px`);
    };

    updateVisualViewportOffset();
    window.addEventListener('resize', updateVisualViewportOffset);
    window.visualViewport?.addEventListener('resize', updateVisualViewportOffset);
    window.visualViewport?.addEventListener('scroll', updateVisualViewportOffset);

    return () => {
      window.removeEventListener('resize', updateVisualViewportOffset);
      window.visualViewport?.removeEventListener('resize', updateVisualViewportOffset);
      window.visualViewport?.removeEventListener('scroll', updateVisualViewportOffset);
      document.documentElement.style.removeProperty('--visual-viewport-bottom-offset');
    };
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const phoneHref = `tel:+91${BUSINESS_DETAILS.phone.replace(/\D/g, '').slice(-10)}`;

  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": BUSINESS_DETAILS.name,
      "image": "https://picsum.photos/seed/showroom/800/1000",
      "@id": "",
      "url": window.location.href,
      "telephone": BUSINESS_DETAILS.phone,
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Shop No 10, Kohinoor Grandeur, Mukai Chowk",
        "addressLocality": "Ravet, Pune",
        "postalCode": "412101",
        "addressCountry": "IN"
      },
      "geo": { "@type": "GeoCoordinates", "latitude": 18.6434458, "longitude": 73.7431792 },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "10:00",
        "closes": "21:00"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": BUSINESS_DETAILS.rating,
        "reviewCount": BUSINESS_DETAILS.reviewsCount
      },
      "sameAs": Object.values(SOCIAL_LINKS).filter(Boolean)
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);

  useEffect(() => initGsapAnimations(), []);

  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      const sectionParam = new URLSearchParams(window.location.search).get('section') || '';
      const sectionSelector = /^[a-z0-9-]+$/i.test(sectionParam) ? `#${sectionParam}` : '';
      const selector = hash || sectionSelector;
      if (!selector) return;

      [100, 800, 1800].forEach((delay) => {
        window.setTimeout(() => {
          document.querySelector(selector)?.scrollIntoView({ behavior: 'auto', block: 'start' });
        }, delay);
      });
    };

    scrollToHash();
    window.addEventListener('hashchange', scrollToHash);
    return () => window.removeEventListener('hashchange', scrollToHash);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-deep)' }}>
      <div className="scroll-progress-bar" ref={progressBarRef} aria-hidden="true" />

      {showLoader && (
        <div
          className={`page-loader${loaderFading ? ' page-loader--exit' : ''}`}
          aria-label="Loading JJ Kitchen Appliances"
        >
          <div className="page-loader__scene" aria-hidden="true">
            <span className="page-loader__ring page-loader__ring--one" />
            <span className="page-loader__ring page-loader__ring--two" />
            <span className="page-loader__ring page-loader__ring--three" />
            <span className="page-loader__streak page-loader__streak--one" />
            <span className="page-loader__streak page-loader__streak--two" />
            <span className="page-loader__streak page-loader__streak--three" />
            <span className="page-loader__streak page-loader__streak--four" />
            <div className="page-loader__mark">
              <span className="page-loader__letter page-loader__letter--first">J</span>
              <span className="page-loader__letter page-loader__letter--second">J</span>
            </div>
            <span className="page-loader__flash" />
          </div>
          <div className="page-loader__caption" aria-hidden="true">
            <strong>JJ Kitchen</strong>
            <span>Premium Gallery</span>
          </div>
        </div>
      )}

      <Navbar />
      <main>
        <Hero />
        <TrustSection />
        <KitchenStudio />
        <SpecialOffers />
        <ProductCategories />
        <WhyChooseUs />
        <Testimonials />

        {/* Interstitial CTA */}
        <section style={{
          padding: '88px 32px',
          background: 'var(--bg)',
          backdropFilter: 'none',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
        }}>
          <div className="gold-rule" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
          <div className="gold-rule" style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} />

          <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <span className="tag" style={{ marginBottom: 22, display: 'inline-block' }}>Live Demos Available</span>
            <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 'clamp(22px, 3.5vw, 42px)', fontWeight: 700, color: 'var(--ink)', letterSpacing: 0, lineHeight: 1.08, margin: '0 0 18px' }}>
              See Auto-Clean in Action.
              <br />
              <em className="gold-text" style={{ fontStyle: 'normal' }}>Visit the Gallery Today.</em>
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', color: 'var(--muted)', fontSize: 16, margin: '0 0 40px', lineHeight: 1.75, maxWidth: 520, display: 'block', marginLeft: 'auto', marginRight: 'auto' }}>
              Motion sensor hobs, auto-clean chimneys, built-in ovens - all live in our Ravet showroom.
            </p>
            <a href="#enquiry" className="btn-g"
              style={{ padding: '14px 32px', fontSize: 14, letterSpacing: 0, borderRadius: 50 }}>
              <span>Get Your Free Quote</span>
              <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </section>

        <EnquiryForm />
        <ContactMap />
        <FAQ />
      </main>
      <Footer />

      <div className="floating-actions" aria-label="Quick actions">
        <button
          type="button"
          className={`back-to-top-button${showBackToTop ? ' is-visible' : ''}`}
          onClick={scrollToTop}
          aria-label="Back to top"
          tabIndex={showBackToTop ? 0 : -1}
        >
          <svg aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <a
          href={BUSINESS_DETAILS.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-float"
          aria-label="Chat with JJ Kitchen on WhatsApp"
        >
          <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.47 14.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.21 5.08 4.5.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z" />
            <path d="M12.04 2C6.56 2 2.1 6.45 2.1 11.93c0 1.75.46 3.46 1.34 4.97L2 22l5.23-1.37a9.9 9.9 0 004.81 1.23h.01c5.48 0 9.94-4.45 9.94-9.93A9.88 9.88 0 0012.04 2zm.01 18.18h-.01a8.24 8.24 0 01-4.2-1.15l-.3-.18-3.1.81.83-3.02-.2-.31a8.21 8.21 0 01-1.26-4.4c0-4.55 3.7-8.25 8.25-8.25a8.22 8.22 0 018.24 8.25c0 4.55-3.7 8.25-8.25 8.25z" />
          </svg>
        </a>
      </div>

      <div className="mobile-lead-bar" aria-label="Quick lead actions">
        <a href={phoneHref} aria-label="Call JJ Kitchen Appliances">
          <svg aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.3} d="M3 5a2 2 0 012-2h2.2a1 1 0 01.95.68l1.1 3.3a1 1 0 01-.36 1.12l-1.28.96a12 12 0 005.33 5.33l.96-1.28a1 1 0 011.12-.36l3.3 1.1a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.37 21 3 14.63 3 7V5z" />
          </svg>
          <span>Call</span>
        </a>
        <a href={BUSINESS_DETAILS.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp JJ Kitchen Appliances">
          <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.47 14.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.21 5.08 4.5.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z" />
            <path d="M12.04 2C6.56 2 2.1 6.45 2.1 11.93c0 1.75.46 3.46 1.34 4.97L2 22l5.23-1.37a9.9 9.9 0 004.81 1.23h.01c5.48 0 9.94-4.45 9.94-9.93A9.88 9.88 0 0012.04 2zm.01 18.18h-.01a8.24 8.24 0 01-4.2-1.15l-.3-.18-3.1.81.83-3.02-.2-.31a8.21 8.21 0 01-1.26-4.4c0-4.55 3.7-8.25 8.25-8.25a8.22 8.22 0 018.24 8.25c0 4.55-3.7 8.25-8.25 8.25z" />
          </svg>
          <span>WhatsApp</span>
        </a>
        <a href="#enquiry" className="mobile-lead-bar__primary" aria-label="Open enquiry form">
          <span>Get Quote</span>
        </a>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const path = window.location.pathname.replace(/\/+$/, '');
  return path === '/admin' ? <AdminOffers /> : <PublicSite />;
};

export default App;

