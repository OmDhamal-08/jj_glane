import React, { useState } from 'react';
import { BUSINESS_DETAILS } from '../constants';
import type { EnquiryPrefillDetail } from '../types';

type StudioZoneId = 'chimney' | 'hob' | 'oven' | 'dishwasher';

interface StudioZone {
  id: StudioZoneId;
  label: string;
  title: string;
  product: string;
  metric: string;
  metricLabel: string;
  fit: string;
  detail: string;
  image: string;
  x: string;
  y: string;
  checks: string[];
}

const studioZones: StudioZone[] = [
  {
    id: 'chimney',
    label: 'Chimney',
    title: 'Auto-clean chimney with motion sensing',
    product: 'Auto-Clean Chimney',
    metric: '1200',
    metricLabel: 'm3/h suction',
    fit: 'Best for daily Indian cooking, frying, and open masala tempering.',
    detail: 'Check suction pull, sound level, filter access, and duct route before finalizing the model.',
    image: 'https://cdn.shopify.com/s/files/1/0569/6883/9344/files/6064-AC.jpg?v=1723473072',
    x: '59%',
    y: '26%',
    checks: ['Suction demo', 'Noise check', 'Duct fit'],
  },
  {
    id: 'hob',
    label: 'Hob',
    title: 'Built-in glass hob for modern counters',
    product: 'Built-in Hob',
    metric: '4',
    metricLabel: 'burner options',
    fit: 'Best for modular kitchens where counter fit, burner spacing, and safety matter.',
    detail: 'Compare brass burner layouts, ignition response, pan support strength, and cleaning access.',
    image: 'https://cdn.shopify.com/s/files/1/0569/6883/9344/files/1_402aa29a-346e-48a2-b903-330496e7c772.jpg?v=1715422034',
    x: '55%',
    y: '63%',
    checks: ['Burner layout', 'Glass finish', 'Pan support'],
  },
  {
    id: 'oven',
    label: 'Oven',
    title: 'Built-in oven and microwave tower',
    product: 'Built-in Oven',
    metric: '70L',
    metricLabel: 'family capacity',
    fit: 'Best for baking, grilling, reheating, and a clean appliance-wall layout.',
    detail: 'Review capacity, control type, rotisserie, heat modes, and cabinet ventilation clearance.',
    image: 'https://cdn.shopify.com/s/files/1/0569/6883/9344/products/1_760019fa-8775-48ba-98a0-1d5980c1e1d4.jpg?v=1659352767',
    x: '80%',
    y: '54%',
    checks: ['Heat modes', 'Cabinet fit', 'Controls'],
  },
  {
    id: 'dishwasher',
    label: 'Dishwasher',
    title: 'Dishwasher planning for Indian utensils',
    product: 'Dishwasher',
    metric: '14',
    metricLabel: 'place settings',
    fit: 'Best for larger households, heavy utensils, and low-effort daily cleanup.',
    detail: 'Match place setting, water connection, drainage access, cycle needs, and loading style.',
    image: 'https://cdn.shopify.com/s/files/1/0569/6883/9344/files/DW-7735M---2049.jpg?v=1722573787',
    x: '70%',
    y: '78%',
    checks: ['Water line', 'Cycle match', 'Utensil load'],
  },
];

const ArrowIcon = () => (
  <svg aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const KitchenStudio: React.FC = () => {
  const [activeZoneId, setActiveZoneId] = useState<StudioZoneId>('chimney');
  const activeZone = studioZones.find((zone) => zone.id === activeZoneId) ?? studioZones[0]!;

  const handleQuoteClick = () => {
    const detail: EnquiryPrefillDetail = {
      product: activeZone.product,
      budget: 'Need store recommendation',
      message: `Interested in ${activeZone.title}. Please suggest demo options, stock, and price.`,
    };

    window.dispatchEvent(new CustomEvent<EnquiryPrefillDetail>('jj:prefill-enquiry', { detail }));
    document.querySelector('#enquiry')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="studio" className="kitchen-studio">
      <div className="kitchen-studio__inner">
        <div className="kitchen-studio__header">
          <div>
            <span className="tag">Showroom Studio</span>
            <h2>
              Build the Kitchen
              <em> Before You Buy</em>
            </h2>
          </div>
          <p>
            A realistic gallery view helps customers understand appliance placement, finish, fit, and service requirements before they ask for a quote.
          </p>
        </div>

        <div className="kitchen-studio__layout">
          <div className="kitchen-studio__visual" aria-label="Interactive kitchen appliance zones">
            <img src="/showroom-kitchen-studio.jpg" alt="Premium kitchen appliance showroom with chimney, hob, oven, and built-in appliances" />
            <div className="kitchen-studio__shade" aria-hidden="true" />

            {studioZones.map((zone) => (
              <button
                key={zone.id}
                type="button"
                className={`kitchen-hotspot${activeZone.id === zone.id ? ' is-active' : ''}`}
                style={{ left: zone.x, top: zone.y }}
                onClick={() => setActiveZoneId(zone.id)}
                aria-pressed={activeZone.id === zone.id}
              >
                <span>{zone.label}</span>
              </button>
            ))}

            <div className="kitchen-studio__readout">
              <span>{activeZone.metricLabel}</span>
              <strong>{activeZone.metric}</strong>
            </div>
          </div>

          <aside className="kitchen-studio__panel" aria-live="polite">
            <div className="kitchen-studio__product">
              <img
                src={activeZone.image}
                alt=""
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />
              <div>
                <span>{activeZone.label}</span>
                <h3>{activeZone.title}</h3>
              </div>
            </div>

            <p className="kitchen-studio__fit">{activeZone.fit}</p>
            <p className="kitchen-studio__detail">{activeZone.detail}</p>

            <div className="kitchen-studio__checks" aria-label="Demo checks">
              {activeZone.checks.map((check) => (
                <span key={check}>{check}</span>
              ))}
            </div>

            <div className="kitchen-studio__zone-list" aria-label="Kitchen appliance zones">
              {studioZones.map((zone) => (
                <button
                  key={zone.id}
                  type="button"
                  className={activeZone.id === zone.id ? 'is-active' : ''}
                  onClick={() => setActiveZoneId(zone.id)}
                >
                  {zone.label}
                </button>
              ))}
            </div>

            <div className="kitchen-studio__actions">
              <button type="button" className="btn-g" onClick={handleQuoteClick}>
                <span>Plan This Setup</span>
                <ArrowIcon />
              </button>
              <a className="btn-wh" href={BUSINESS_DETAILS.whatsapp} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </div>
          </aside>
        </div>

        <div className="kitchen-studio__material-strip" aria-label="Showroom finish options">
          {[
            { name: 'Black glass', swatch: '#111315' },
            { name: 'Brushed steel', swatch: '#B9B8B2' },
            { name: 'Warm wood', swatch: '#A47649' },
            { name: 'Sage cabinet', swatch: '#A6AEA0' },
            { name: 'Quartz counter', swatch: '#E9E1D4' },
          ].map((finish) => (
            <span key={finish.name}>
              <i style={{ background: finish.swatch }} />
              {finish.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KitchenStudio;
