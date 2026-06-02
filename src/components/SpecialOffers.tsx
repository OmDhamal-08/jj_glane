import React, { useEffect, useMemo, useState } from 'react';
import { BUSINESS_DETAILS } from '../constants';
import { getOfferEndLabel, getOfferTimeLeft, isOfferLive, loadSpecialOffers } from '../services/offersService';
import type { EnquiryPrefillDetail, SpecialOffer } from '../types';

const getPhoneHref = (phone: string) => `tel:+91${phone.replace(/\D/g, '').slice(-10)}`;

const ArrowIcon = () => (
  <svg aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const CountdownTimer: React.FC<{ endDate: string }> = ({ endDate }) => {
  const [time, setTime] = useState(getOfferTimeLeft(endDate));

  useEffect(() => {
    const interval = window.setInterval(() => setTime(getOfferTimeLeft(endDate)), 1000);
    return () => window.clearInterval(interval);
  }, [endDate]);

  if (time.expired) {
    return <div className="offer-countdown offer-countdown--expired">Call for latest price</div>;
  }

  return (
    <div className="offer-countdown" aria-label={`Offer ends on ${getOfferEndLabel(endDate)}`}>
      {[
        { val: time.days, label: 'Days' },
        { val: time.hours, label: 'Hrs' },
        { val: time.minutes, label: 'Min' },
        { val: time.seconds, label: 'Sec' },
      ].map((unit) => (
        <span key={unit.label}>
          <strong>{String(unit.val).padStart(2, '0')}</strong>
          <small>{unit.label}</small>
        </span>
      ))}
    </div>
  );
};

const OfferSkeleton = () => (
  <div className="offer-card offer-card--skeleton" aria-hidden="true">
    <div className="offer-card__media" />
    <div className="offer-card__body">
      <span />
      <strong />
      <p />
      <p />
      <button type="button" tabIndex={-1} />
    </div>
  </div>
);

const OfferCard: React.FC<{
  offer: SpecialOffer;
  index: number;
  onEnquire: (offer: SpecialOffer) => void;
}> = ({ offer, index, onEnquire }) => {
  const live = isOfferLive(offer);

  return (
    <article
      className={`offer-card${offer.highlight ? ' is-highlighted' : ''}${live ? '' : ' is-expired'}`}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="offer-card__media">
        {offer.image ? (
          <img
            src={offer.image}
            alt={offer.product}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
        ) : null}
        <div className="offer-card__fallback" aria-hidden="true">
          <span>{offer.eventName}</span>
          <strong>{offer.product}</strong>
        </div>

        {offer.badge ? <span className="offer-card__badge">{offer.badge}</span> : null}
        {offer.discount ? (
          <div className="offer-card__discount">
            <strong>{offer.discount}</strong>
            <span>OFF</span>
          </div>
        ) : null}
      </div>

      <div className="offer-card__body">
        <div className="offer-card__meta">
          <span>{offer.eventName}</span>
          <span>Ends {getOfferEndLabel(offer.endDate)}</span>
        </div>

        <h3>{offer.title}</h3>
        <p className="offer-card__subtitle">{offer.subtitle}</p>
        <p className="offer-card__product">{offer.product}</p>

        <div className="offer-card__prices">
          <strong>{live ? offer.salePrice : 'Ask latest price'}</strong>
          {live && offer.originalPrice ? <span>{offer.originalPrice}</span> : null}
        </div>

        <CountdownTimer endDate={offer.endDate} />

        <p className="offer-card__terms">{offer.terms}</p>

        <button type="button" className="btn-g offer-card__cta" onClick={() => onEnquire(offer)}>
          <span>{live ? offer.ctaText : 'Ask Latest Price'}</span>
          <ArrowIcon />
        </button>
      </div>
    </article>
  );
};

const SpecialOffers: React.FC = () => {
  const [offers, setOffers] = useState<SpecialOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    loadSpecialOffers()
      .then((loadedOffers) => {
        if (mounted) setOffers(loadedOffers);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const liveOfferCount = useMemo(() => offers.filter(isOfferLive).length, [offers]);

  const handleEnquire = (offer: SpecialOffer) => {
    const detail: EnquiryPrefillDetail = {
      product: offer.enquiryProduct,
      budget: `Offer: ${offer.title} - ${offer.salePrice}`,
      offerId: offer.id,
      message: `Interested in ${offer.title} for ${offer.product}.`,
    };

    window.dispatchEvent(new CustomEvent<EnquiryPrefillDetail>('jj:prefill-enquiry', { detail }));
    document.querySelector('#enquiry')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="offers" className="offers-section">
      <div className="offers-shell">
        <div className="offers-banner">
          <div className="offers-banner__status" aria-label={`${liveOfferCount} live offers`}>
            <span />
            {liveOfferCount > 0 ? `${liveOfferCount} Live Offer${liveOfferCount === 1 ? '' : 's'}` : 'Prices Refreshing'}
          </div>
          <div className="offers-banner__copy">
            <strong>Store event deals are active now.</strong>
            <p>Reserve a product online, then confirm stock and installation details with the showroom team.</p>
          </div>
          <a href={BUSINESS_DETAILS.whatsapp} className="btn-wh offers-banner__whatsapp" target="_blank" rel="noopener noreferrer">
            WhatsApp Store
          </a>
        </div>

        <div className="offers-header">
          <div>
            <span className="tag">Limited Time</span>
            <h2>
              Special <em>Offers</em>
            </h2>
          </div>
          <p>
            Current deals on Glen chimneys, hobs, ovens, and kitchen upgrade bundles at JJ Kitchen Appliances.
          </p>
        </div>

        {loading ? (
          <div className="offers-grid" aria-busy="true">
            {Array.from({ length: 4 }, (_, index) => <OfferSkeleton key={index} />)}
          </div>
        ) : offers.length > 0 ? (
          <div className="offers-grid">
            {offers.map((offer, index) => (
              <OfferCard key={offer.id} offer={offer} index={index} onEnquire={handleEnquire} />
            ))}
          </div>
        ) : (
          <div className="offers-empty">
            <strong>New offers are being prepared.</strong>
            <p>Call the showroom for today's best price on Glen appliances.</p>
            <a className="btn-g" href={getPhoneHref(BUSINESS_DETAILS.phone)}>Call Store</a>
          </div>
        )}

        <div className="offers-bottom-cta">
          <div>
            <strong>Need a deal on a specific model?</strong>
            <p>Share the product name and budget. The store team will suggest the closest available offer.</p>
          </div>
          <div className="offers-bottom-cta__actions">
            <a href="#enquiry" className="btn-g">Send Enquiry</a>
            <a href={getPhoneHref(BUSINESS_DETAILS.phone)} className="btn-wh">Call for Price</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;
