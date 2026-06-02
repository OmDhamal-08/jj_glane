import React from 'react';
import { BRANCH_LOCATIONS, BUSINESS_DETAILS, SOCIAL_LINKS } from '../constants';

const FacebookIcon: React.FC = () => (
  <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.03 3.66 9.2 8.44 9.94v-7.03H7.9v-2.91h2.54V9.84c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.23.2 2.23.2v2.47h-1.25c-1.24 0-1.63.78-1.63 1.57v1.89h2.77l-.44 2.91h-2.33V22C18.34 21.26 22 17.09 22 12.06z" />
  </svg>
);

const InstagramIcon: React.FC = () => (
  <svg aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect width="16" height="16" x="4" y="4" rx="4" strokeWidth={1.8} />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.4 11.5a3.4 3.4 0 11-6.8 0 3.4 3.4 0 016.8 0z" />
    <path strokeLinecap="round" strokeWidth={2.2} d="M16.9 7.1h.01" />
  </svg>
);

const WhatsappIcon: React.FC = () => (
  <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.47 14.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.21 5.08 4.5.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z" />
    <path d="M12.04 2C6.56 2 2.1 6.45 2.1 11.93c0 1.75.46 3.46 1.34 4.97L2 22l5.23-1.37a9.9 9.9 0 004.81 1.23h.01c5.48 0 9.94-4.45 9.94-9.93A9.88 9.88 0 0012.04 2zm.01 18.18h-.01a8.24 8.24 0 01-4.2-1.15l-.3-.18-3.1.81.83-3.02-.2-.31a8.21 8.21 0 01-1.26-4.4c0-4.55 3.7-8.25 8.25-8.25a8.22 8.22 0 018.24 8.25c0 4.55-3.7 8.25-8.25 8.25z" />
  </svg>
);

const TwitterIcon: React.FC = () => (
  <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.24 2H21.6l-7.34 8.39L22.9 22h-6.77l-5.3-6.93L4.76 22H1.4l7.85-8.97L1 2h6.94l4.79 6.33L18.24 2zm-1.18 17.95h1.86L6.93 3.94h-2l12.13 16.01z" />
  </svg>
);

const quickLinks = [
  { label: 'Home', href: '#' },
  { label: 'Products', href: '#products' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

const socialLinks = [
  { label: 'Instagram', href: SOCIAL_LINKS.instagram, icon: <InstagramIcon /> },
  { label: 'Facebook', href: SOCIAL_LINKS.facebook, icon: <FacebookIcon /> },
  { label: 'Twitter/X', href: SOCIAL_LINKS.twitter, icon: <TwitterIcon /> },
  { label: 'WhatsApp', href: BUSINESS_DETAILS.whatsapp, icon: <WhatsappIcon /> },
].filter((link) => link.href);

const Footer: React.FC = () => {
  const footerBranches = BRANCH_LOCATIONS.slice(0, 2);

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <a href="#" className="site-footer__logo" aria-label="JJ Kitchen Appliances home">
              <span>JJ</span>
              <strong>JJ Kitchen Appliances</strong>
            </a>
            <p>Authorized Glen Gallery for premium kitchen chimneys, hobs, built-in appliances, and expert showroom guidance.</p>
            <div className="site-footer__socials">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3>Quick Links</h3>
            <nav className="site-footer__links" aria-label="Footer quick links">
              {quickLinks.map((link) => (
                <a href={link.href} key={link.label}>{link.label}</a>
              ))}
            </nav>
          </div>

          <div>
            <h3>Our Branches</h3>
            <div className="site-footer__branches">
              {footerBranches.map((branch) => (
                <address key={branch.name}>
                  <strong>{branch.name}</strong>
                  <span>{branch.address}</span>
                </address>
              ))}
            </div>
          </div>

          <div>
            <h3>Contact</h3>
            <div className="site-footer__contact">
              <a href={`tel:${BUSINESS_DETAILS.phone.replace(/\s/g, '')}`}>{BUSINESS_DETAILS.phone}</a>
              <a href={`mailto:${BUSINESS_DETAILS.email}`}>{BUSINESS_DETAILS.email}</a>
              <span>{BUSINESS_DETAILS.hours} - All 7 Days</span>
              <a
                href={BUSINESS_DETAILS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="site-footer__whatsapp"
              >
                <WhatsappIcon />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="site-footer__copyright">
        <div>
          <span>(c) {new Date().getFullYear()} JJ Kitchen Appliances</span>
          <span>All rights reserved</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
