// FAQ.tsx â€” Antigravity Minimalist
import React, { useState } from 'react';

const faqs = [
  { q: "Are you an authorized Glen dealer in Ravet?", a: "Yes, we are a certified JJ Kitchen Appliances gallery and an authorized retail partner for Glen Kitchen Appliances in Ravet, Pune. Every product comes with the official Glen India warranty." },
  { q: "Do you provide installation services?", a: "Absolutely. We coordinate professional installation for all major appliances including chimneys and hobs, often on the same day as delivery for local areas." },
  { q: "Which areas do you deliver to in Pune?", a: "We primarily serve Ravet, Wakad, Hinjewadi, Kiwale, Punawale, and the entire Pimpri-Chinchwad region. For other areas, please call us to check availability." },
  { q: "What is the warranty on Glen Chimneys?", a: "Most Glen chimneys come with a lifetime warranty on the motor and 1-7 year warranty on the product depending on the model." },
  { q: "Can I schedule a live demo at the showroom?", a: "Yes! Our team will demonstrate auto-clean, motion sensor, and suction features live. Walk in between 10 AM - 9 PM, any day." },
];

const FAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section style={{ padding: '96px 0', background: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 56, alignItems: 'start' }} className="lg:grid-cols-12">
          <div style={{ gridColumn: 'span 4' }} className="lg:col-span-4">
            <span className="tag" style={{ marginBottom: 16, display: 'inline-block' }}>FAQ</span>
            <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 'clamp(22px, 3.5vw, 42px)', fontWeight: 700, color: 'var(--ink)', letterSpacing: 0, lineHeight: 1.1, margin: '0 0 16px' }}>
              Common<br /><em className="text-gradient" style={{ fontStyle: 'normal' }}>Questions</em>
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', color: 'var(--muted)', fontSize: 14, lineHeight: 1.8, margin: '0 0 28px' }}>
              Still have questions? Just call or drop by.
            </p>
            <a href="tel:7248983407" className="btn-g ulh"
              style={{ padding: '14px 32px', fontSize: 13, letterSpacing: 0, gap: 8, borderRadius: 50 }}>
              <svg style={{ width: 15, height: 15 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call the Store
            </a>
          </div>

          <div style={{ gridColumn: 'span 8' }} className="lg:col-span-8">
            <div style={{ background: '#FFFFFF', backdropFilter: 'none', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
              {faqs.map((faq, idx) => (
                <div key={idx} style={{ borderBottom: idx < faqs.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <button onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                    style={{ width: '100%', textAlign: 'left', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, background: openIdx === idx ? '#FFF9EC' : 'transparent', border: 'none', cursor: 'pointer', transition: 'background 0.25s' }}>
                    <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 17, fontWeight: 500, color: openIdx === idx ? 'var(--gold)' : 'var(--ink)', lineHeight: 1.35, transition: 'color 0.25s' }}>{faq.q}</span>
                    <div style={{ width: 32, height: 32, borderRadius: 50, flexShrink: 0, background: openIdx === idx ? 'var(--gold)' : '#FFFFFF', border: openIdx === idx ? 'none' : '1px solid var(--border-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: openIdx === idx ? 'var(--ink)' : 'var(--muted)', transition: 'all 0.3s', boxShadow: openIdx === idx ? '0 8px 18px rgba(201,146,42,0.22)' : 'none' }}>
                      <svg style={{ width: 14, height: 14, transform: openIdx === idx ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 0.3s' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  </button>
                  {openIdx === idx && (
                    <div style={{ padding: '0 32px 24px', fontFamily: 'Inter, sans-serif', color: 'var(--muted)', fontSize: 14, lineHeight: 1.8 }}>{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;

