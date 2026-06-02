// ContactMap.tsx â€” Antigravity Minimalist
import React from 'react';
import { BUSINESS_DETAILS } from '../constants';

const ContactMap: React.FC = () => {
  return (
    <section id="contact" style={{ padding: '96px 0', background: 'var(--bg-2)', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, gap: 16 }}>
          <div>
            <span className="tag" style={{ marginBottom: 14, display: 'inline-block' }}>Find Us</span>
            <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 'clamp(22px, 3.5vw, 42px)', fontWeight: 700, color: 'var(--ink)', letterSpacing: 0, lineHeight: 1.05, margin: 0 }}>
              Visit the Gallery
            </h2>
          </div>
          <a href="https://www.google.com/maps/dir/?api=1&destination=Shop+No+10+Kohinoor+Grandeur+Ravet+Pune"
            target="_blank" rel="noopener noreferrer" className="btn-g"
            style={{ padding: '14px 32px', fontSize: 13, letterSpacing: 0, borderRadius: 50, gap: 8 }}>
            Get Directions
            <svg style={{ width: 15, height: 15 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr', borderRadius: 16, overflow: 'hidden',
          border: '1px solid var(--border)', boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
        }} className="lg:grid-cols-3">
          <div style={{
            background: '#FFFFFF', backdropFilter: 'none',
            borderRight: '1px solid var(--border)', padding: 32,
            display: 'flex', flexDirection: 'column', gap: 32, justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              {[
                { icon: <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, label: 'Address', content: BUSINESS_DETAILS.address, link: null },
                { icon: <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, label: 'Hours', content: `${BUSINESS_DETAILS.hours} - All 7 Days`, link: null },
                { icon: <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>, label: 'Phone', content: BUSINESS_DETAILS.phone, link: `tel:${BUSINESS_DETAILS.phone.replace(/\s/g, '')}` },
                { icon: <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>, label: 'Email', content: BUSINESS_DETAILS.email, link: `mailto:${BUSINESS_DETAILS.email}` },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 16,
                    background: 'var(--gold-dim)', border: '1px solid var(--neon-bdr)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', flexShrink: 0,
                  }}>{item.icon}</div>
                  <div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--faint)', marginBottom: 4 }}>{item.label}</div>
                    {item.link
                      ? <a href={item.link} className="ulh" style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'var(--ink)', lineHeight: 1.5, textDecoration: 'none' }}>{item.content}</a>
                      : <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'var(--white-2)', margin: 0, lineHeight: 1.6 }}>{item.content}</p>}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href={BUSINESS_DETAILS.whatsapp} target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '14px 32px',
                  background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.20)', borderRadius: 50,
                  color: '#22c55e', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 13, textDecoration: 'none', transition: 'background 0.25s',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(22,163,74,0.15)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(22,163,74,0.08)')}>
                <svg style={{ width: 18, height: 18 }} fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656z" /></svg>
                Chat on WhatsApp
              </a>
              <a href={`tel:${BUSINESS_DETAILS.phone.replace(/\s/g, '')}`} className="btn-wh"
                style={{ padding: '14px 32px', borderRadius: 50, fontSize: 13, gap: 10, justifyContent: 'flex-start' }}>
                <svg style={{ width: 16, height: 16, color: 'var(--gold)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                Call the Store
              </a>
            </div>
          </div>
          <div style={{ gridColumn: 'span 1' }} className="lg:col-span-2">
            <div style={{ height: '100%', minHeight: 420 }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3780.4578550130985!2d73.7431792!3d18.6434458!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bb3683f06c6b%3A0x86134b2f565be098!2sJJ%20Kitchen%20Appliances%20-%20Glen%20Gallery!5e0!3m2!1sen!2sin!4v1715600000000!5m2!1sen!2sin"
                style={{ width: '100%', height: '100%', border: 0, display: 'block', minHeight: 420 }}
                className="map-warm" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                title="Glen Gallery Ravet Location" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactMap;

