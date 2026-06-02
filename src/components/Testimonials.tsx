import React, { useEffect, useRef } from 'react';
import { TESTIMONIALS } from '../constants';

type SwiperInstance = {
  destroy: (deleteInstance?: boolean, cleanStyles?: boolean) => void;
};

type SwiperOptions = {
  loop: boolean;
  speed: number;
  autoplay: {
    delay: number;
    disableOnInteraction: boolean;
  };
  slidesPerView: number;
  spaceBetween: number;
  pagination: {
    el: HTMLElement;
    clickable: boolean;
  };
  breakpoints: Record<number, { slidesPerView: number; spaceBetween: number }>;
};

declare global {
  interface Window {
    Swiper?: new (element: HTMLElement, options: SwiperOptions) => SwiperInstance;
  }
}

const QuoteIcon: React.FC = () => (
  <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
    <path d="M7.9 6.2C5.1 8 3.8 10.4 3.8 13.4c0 2.7 1.6 4.4 3.9 4.4 2 0 3.5-1.4 3.5-3.4 0-1.8-1.2-3.1-3-3.3.2-1.3 1.2-2.4 3-3.4L9.8 5.4c-.7.2-1.3.5-1.9.8zm9 0c-2.8 1.8-4.1 4.2-4.1 7.2 0 2.7 1.6 4.4 3.9 4.4 2 0 3.5-1.4 3.5-3.4 0-1.8-1.2-3.1-3-3.3.2-1.3 1.2-2.4 3-3.4l-1.4-2.3c-.7.2-1.3.5-1.9.8z" />
  </svg>
);

const StarIcon: React.FC = () => (
  <svg aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.07 3.29a1 1 0 00.95.69h3.46c.97 0 1.37 1.24.59 1.81l-2.8 2.03a1 1 0 00-.36 1.12l1.07 3.29c.3.92-.76 1.69-1.54 1.12l-2.8-2.03a1 1 0 00-1.18 0l-2.8 2.03c-.78.57-1.84-.2-1.54-1.12l1.07-3.29a1 1 0 00-.36-1.12l-2.8-2.03c-.78-.57-.38-1.81.59-1.81h3.46a1 1 0 00.95-.69l1.07-3.29z" />
  </svg>
);

const Testimonials: React.FC = () => {
  const swiperRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!swiperRef.current || !paginationRef.current || !window.Swiper) {
      return;
    }

    const swiper = new window.Swiper(swiperRef.current, {
      loop: true,
      speed: 720,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      slidesPerView: 1,
      spaceBetween: 18,
      pagination: {
        el: paginationRef.current,
        clickable: true,
      },
      breakpoints: {
        768: { slidesPerView: 2, spaceBetween: 20 },
        1024: { slidesPerView: 3, spaceBetween: 24 },
      },
    });

    return () => swiper.destroy(true, true);
  }, []);

  return (
    <section id="testimonials" className="testimonials-section">
      <div className="section-shell">
        <div className="section-heading section-heading--center">
          <span className="tag">Testimonials</span>
          <h2 className="no-scroll-reveal">What Our Customers Say</h2>
        </div>

        <div className="swiper testimonial-swiper" ref={swiperRef}>
          <div className="swiper-wrapper">
            {TESTIMONIALS.map((testimonial) => (
              <div className="swiper-slide" key={`${testimonial.name}-${testimonial.location}`}>
                <article className="testimonial-card">
                  <QuoteIcon />
                  <div className="testimonial-card__rating" aria-label="5 star rating">
                    {[0, 1, 2, 3, 4].map((star) => (
                      <StarIcon key={star} />
                    ))}
                  </div>
                  <p>"{testimonial.quote}"</p>
                  <div className="testimonial-card__customer">
                    <strong>{testimonial.name}</strong>
                    <span>{testimonial.location}</span>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
        <div className="testimonial-pagination swiper-pagination" ref={paginationRef} />
      </div>
    </section>
  );
};

export default Testimonials;
