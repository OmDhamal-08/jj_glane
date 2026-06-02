import React from 'react';
import { BRANCH_LOCATIONS } from '../constants';

const PinIcon: React.FC = () => (
  <svg aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d="M12 21s7-5.12 7-11a7 7 0 10-14 0c0 5.88 7 11 7 11z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d="M12 13a3 3 0 100-6 3 3 0 000 6z" />
  </svg>
);

const ArrowIcon: React.FC = () => (
  <svg aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M14 4h6v6m0-6L10 14" />
  </svg>
);

const BranchLocations: React.FC = () => {
  return (
    <section id="branches" className="branch-locations">
      <div className="section-shell">
        <div className="section-heading section-heading--center">
          <span className="tag">Branch Locations</span>
          <h2 className="no-scroll-reveal">Find Us Near You</h2>
        </div>

        <div className="branch-grid">
          {BRANCH_LOCATIONS.map((branch) => (
            <article className="branch-card" key={branch.name}>
              <div className="branch-card__pin">
                <PinIcon />
              </div>
              <h3>{branch.name}</h3>
              <div className="branch-card__content">
                <p>{branch.address}</p>
                <a href={branch.phoneHref}>{branch.phone}</a>
                <span>{branch.hours}</span>
              </div>
              <a
                href={branch.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="branch-card__button"
                aria-label={`Get directions to JJ Kitchen Appliances ${branch.name}`}
              >
                Get Directions
                <ArrowIcon />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BranchLocations;
