// WhyChooseUs.tsx â€” Antigravity Minimalist
import React from 'react';

const reasons = [
  { num: '01', title: 'Authorized Dealer', desc: '100% genuine Glen products with direct company warranty and official service records.', icon: <svg style={{ width: 22, height: 22 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> },
  { num: '02', title: 'Easy Parking', desc: 'Ample dedicated parking at Kohinoor Grandeur - no stress, just a relaxed showroom visit.', icon: <svg style={{ width: 22, height: 22 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  { num: '03', title: 'Expert Guidance', desc: 'Trained specialists who help you choose the right suction power and design for your kitchen.', icon: <svg style={{ width: 22, height: 22 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
  { num: '04', title: 'Same-Day Delivery', desc: 'Quick dispatch and professional installation for Ravet, Wakad, Hinjewadi and nearby areas.', icon: <svg style={{ width: 22, height: 22 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
  { num: '05', title: '105+ Five-Star Reviews', desc: 'The highest-rated kitchen appliance store in the entire Pimpri-Chinchwad region.', icon: <svg style={{ width: 22, height: 22 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg> },
  { num: '06', title: 'Lifetime Service', desc: 'Dedicated post-purchase service hub. We stand behind every appliance we sell, always.', icon: <svg style={{ width: 22, height: 22 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
];

const WhyChooseUs: React.FC = () => {
  return (
    <section id="about" className="why-section">
      <div className="why-section__inner">
        <div className="why-section__header">
          <div>
            <span className="tag" style={{ marginBottom: 16, display: 'inline-block' }}>The Gallery Experience</span>
            <h2>
              Why Visit Glen Gallery Ravet?
            </h2>
          </div>
          <div className="why-section__intro">
            <p>
              We curate an experience, not just a transaction. Every detail is designed to help you find your perfect kitchen companion.
            </p>
          </div>
        </div>

        <div className="why-grid">
          {reasons.map((r, i) => (
            <article key={i} className="why-reason-card">
              <div className="why-reason-card__top">
                <div className="icon-badge">{r.icon}</div>
                <span>{r.num}</span>
              </div>
              <div>
                <h3>{r.title}</h3>
                <p>{r.desc}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="why-cta">
          <div>
            <h3>Ready to transform your kitchen?</h3>
            <p>Visit our Ravet showroom or get an instant quote online.</p>
          </div>
          <div className="why-cta__actions">
            <a href="#enquiry" className="btn-g">Get Free Quote</a>
            <a href="#contact" className="btn-wh">Find Us</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;

