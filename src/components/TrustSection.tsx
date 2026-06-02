// TrustSection.tsx â€” Antigravity Minimalist
import React from 'react';
import { Icons } from '../constants';

const stats = [
  {
    target: 105,
    suffix: '+',
    label: 'Five-Star Reviews',
    sub: 'Verified on Google',
    extra: <div style={{ display: 'flex', gap: 3, marginTop: 10 }}>{[1, 2, 3, 4, 5].map(i => <Icons.Star key={i} />)}</div>,
    icon: null,
  },
  {
    target: 1200,
    suffix: '',
    label: 'm3/h Suction',
    sub: 'Auto-Clean Power',
    icon: <svg style={{ width: 22, height: 22 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  },
  {
    target: 200,
    suffix: '+',
    label: 'Models In Store',
    sub: 'Ready for Demo',
    icon: <svg style={{ width: 22, height: 22 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  },
  {
    target: 10,
    suffix: 'K+',
    label: 'Homes Served',
    sub: 'Across PCMC Region',
    icon: <svg style={{ width: 22, height: 22 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  },
];

const TrustSection: React.FC = () => {
  return (
    <section className="stats-counter-section" style={{
      background: 'var(--bg)',
      backdropFilter: 'none',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
        <div className="stg" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', background: '#FFFFFF', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}
          data-cols="4">
          <style>{`@media(min-width:768px){ [data-cols="4"] { grid-template-columns: repeat(4,1fr); } }`}</style>
          {stats.map((s, i) => (
            <div key={i} className="stat-cell" style={{
              padding: 32,
              borderRight: i < 3 ? '1px solid var(--border)' : 'none',
              display: 'flex', flexDirection: 'column',
              position: 'relative', overflow: 'hidden',
            }}>
              {i === 0 && (
                <div style={{ position: 'absolute', top: 0, left: 0, width: 120, height: 120, background: 'radial-gradient(circle, rgba(201,146,42,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
              )}
              {s.icon && (
                <div style={{ color: 'var(--gold)', marginBottom: 10, opacity: 0.85 }}>{s.icon}</div>
              )}
              <div
                className="stat-counter"
                data-counter-target={s.target}
                data-counter-suffix={s.suffix}
                style={{ fontFamily: 'Inter, sans-serif', fontSize: 44, fontWeight: 700, color: 'var(--ink)', lineHeight: 1, letterSpacing: 0 }}
              >
                0
              </div>
              <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14, fontWeight: 700, color: 'var(--white-2)', marginTop: 8 }}>{s.label}</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--faint)', marginTop: 3 }}>{s.sub}</div>
              {s.extra}
            </div>
          ))}
        </div>

        <div style={{ padding: '16px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, flexWrap: 'wrap', overflow: 'hidden' }}>
          {['Glen India', 'Auto-Clean Technology', 'Authorized Gallery', 'Motion Sensor Hobs', 'Built-in Ovens', 'Lifetime Motor Warranty'].map((t, i) => (
            <React.Fragment key={i}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--faint)' }}>{t}</span>
              {i < 5 && <span style={{ color: 'var(--gold)', fontSize: 7, opacity: 0.4 }}>/</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;

