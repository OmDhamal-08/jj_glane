// Navbar.tsx â€” Antigravity Minimalist
import React, { useState, useEffect } from 'react';
import { BUSINESS_DETAILS } from '../constants';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const navLinks = [
    { label: 'Studio', href: '#studio' },
    { label: 'Collection', href: '#products' },
    { label: 'Offers', href: '#offers', hot: true },
    { label: 'About', href: '#about' },
    { label: 'Location', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav className="navbar" style={{
        position: 'sticky', top: 0, left: 0, right: 0,
        zIndex: 100,
        transition: 'all 0.35s ease',
        padding: scrolled ? '10px 0' : '14px 0',
        background: scrolled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.78)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(232,228,220,0.82)',
        boxShadow: scrolled ? '0 8px 24px rgba(0,0,0,0.06)' : '0 1px 0 rgba(232,228,220,0.56)',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

          {/* Logo */}
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', zIndex: 110 }}>
            <div style={{
              width: 44, height: 44,
              background: 'linear-gradient(135deg, #C9922A 0%, #E8B84B 100%)',
              borderRadius: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontWeight: 700, fontSize: 15, color: 'var(--ink)',
              letterSpacing: '0.05em', flexShrink: 0,
              boxShadow: '0 8px 20px rgba(201,146,42,0.22)',
              transition: 'transform 0.25s, box-shadow 0.25s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 28px rgba(201,146,42,0.28)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 20px rgba(201,146,42,0.22)'; }}
            >
              JJ
            </div>
            <div>
              <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 20, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.15, letterSpacing: '-0.01em' }}>
                JJ <span style={{ color: 'var(--gold)' }}>Appliances</span>
              </div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 9, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--faint)', marginTop: 1 }}>
                Authorized Glen Gallery - Ravet
              </div>
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex" style={{ alignItems: 'center', gap: 36 }}>
            {navLinks.map(({ label, href, hot }) => (
              <a
                key={label}
                href={href}
                className="ulh"
                onClick={(e) => { e.preventDefault(); handleNavClick(href); }}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: 'var(--muted)',
                  textDecoration: 'none', transition: 'color 0.25s',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--gold)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)'; }}
              >
                {label}
                {hot && (
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: '#FFB800',
                    display: 'inline-block',
                    animation: 'pulse-ring 2s ease-out infinite',
                    boxShadow: '0 0 8px rgba(255,184,0,0.5)',
                  }} />
                )}
              </a>
            ))}
            <div style={{ width: 1, height: 20, background: 'var(--border-2)' }} />
            <a href="#enquiry" className="btn-g"
              style={{ padding: '14px 32px', fontSize: 13, letterSpacing: 0 }}>
              <span>Get Quote</span>
              <svg style={{ width: 13, height: 13 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          {/* Mobile */}
          <div className="mobile-nav-actions flex lg:hidden" style={{ gap: 8, alignItems: 'center', zIndex: 110 }}>
            <a href={BUSINESS_DETAILS.whatsapp} target="_blank" rel="noopener noreferrer"
              className="mobile-whatsapp-link"
              aria-label="Chat on WhatsApp"
              style={{
                width: 44, height: 44, borderRadius: 50,
                background: '#FFFFFF', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
              <svg style={{ width: 18, height: 18, color: '#22c55e' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656z" />
              </svg>
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className={`hamburger-button${menuOpen ? ' is-open' : ''}`}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div className="mobile-nav-overlay" style={{
        position: 'fixed', inset: 0, zIndex: 99,
        background: 'rgba(250,250,248,0.96)',
        backdropFilter: 'blur(12px)',
        transition: 'opacity 0.35s ease, visibility 0.35s ease',
        opacity: menuOpen ? 1 : 0,
        visibility: menuOpen ? 'visible' : 'hidden',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8,
      }}>
        {navLinks.map(({ label, href, hot }, i) => (
          <a key={label} href={href}
            onClick={(e) => { e.preventDefault(); handleNavClick(href); }}
            style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 36, fontWeight: 700, color: 'var(--ink)',
              textDecoration: 'none', padding: '14px 0', letterSpacing: '-0.02em',
              transition: 'color 0.25s, transform 0.3s',
              transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: `${i * 0.06}s`,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
            {label}
            {hot && (
              <span style={{
                fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
                background: 'linear-gradient(135deg, #C9922A, #E8B84B)', color: 'var(--ink)',
                padding: '4px 10px', borderRadius: 50,
              }}>HOT</span>
            )}
          </a>
        ))}
        <div style={{ width: 60, height: 1, background: 'var(--border-2)', margin: '20px 0' }} />
        <a href="#enquiry" onClick={(e) => { e.preventDefault(); handleNavClick('#enquiry'); }}
          className="btn-g" style={{ padding: '14px 32px', fontSize: 13, letterSpacing: 0, borderRadius: 50 }}>
          Get Quote
        </a>
      </div>
    </>
  );
};

export default Navbar;

