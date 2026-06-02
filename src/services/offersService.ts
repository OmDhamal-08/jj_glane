import type { SpecialOffer } from '../types';

const OFFERS_API_URL = '/api/offers';
const OFFERS_CSV_URL = '/offers.csv';

const DEFAULT_SPECIAL_OFFERS: SpecialOffer[] = [
  {
    active: true,
    priority: 1,
    id: 'fallback-chimney-upgrade',
    title: 'Chimney Upgrade Offer',
    subtitle: 'Auto-clean chimney with live demo',
    product: 'Glen 6060 BL AC 60cm',
    enquiryProduct: 'Glen 6060 BL AC 60cm',
    discount: '30%',
    originalPrice: 'Rs. 28,990',
    salePrice: 'Call for Price',
    eventName: 'Store Offer',
    badge: 'LIVE',
    endDate: '2026-12-31T23:59:59+05:30',
    image: '/showroom-kitchen-studio.jpg',
    highlight: true,
    terms: 'Ask the store team for today pricing and stock confirmation.',
    ctaText: 'Ask Price',
  },
];

const parseCsv = (text: string): string[][] => {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(field.trim());
      field = '';
    } else if (char === '\n') {
      row.push(field.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      field = '';
    } else if (char !== '\r') {
      field += char;
    }
  }

  row.push(field.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
};

const toBoolean = (value = '') => ['yes', 'true', '1', 'active'].includes(value.trim().toLowerCase());

const toNumber = (value = '', fallback = 999) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeOffer = (record: Record<string, string>, index: number): SpecialOffer | null => {
  const id = record.id || `offer-${index + 1}`;
  const title = record.title || '';
  const product = record.product || '';
  const endDate = record.endDate || '';

  if (!title || !product || !endDate) return null;

  return {
    active: toBoolean(record.active || 'yes'),
    priority: toNumber(record.priority, index + 1),
    id,
    title,
    subtitle: record.subtitle || 'Limited period store offer',
    product,
    enquiryProduct: record.enquiryProduct || product,
    discount: record.discount || '',
    originalPrice: record.originalPrice || '',
    salePrice: record.salePrice || 'Call for Price',
    eventName: record.eventName || 'Store Offer',
    badge: record.badge || '',
    endDate,
    image: record.image || '',
    highlight: toBoolean(record.highlight),
    terms: record.terms || 'Offer subject to stock availability and store confirmation.',
    ctaText: record.ctaText || 'Enquire Now',
  };
};

const rowsToOffers = (rows: string[][]) => {
  const [headers, ...dataRows] = rows;
  if (!headers?.length) return [];

  return dataRows
    .map((row, index) => {
      const record = headers.reduce<Record<string, string>>((acc, header, headerIndex) => {
        acc[header] = row[headerIndex] || '';
        return acc;
      }, {});
      return normalizeOffer(record, index);
    })
    .filter((offer): offer is SpecialOffer => Boolean(offer?.active))
    .sort((a, b) => {
      if (a.highlight !== b.highlight) return a.highlight ? -1 : 1;
      if (a.priority !== b.priority) return a.priority - b.priority;
      return a.title.localeCompare(b.title);
    });
};

type OffersApiResponse = {
  offers?: SpecialOffer[];
  offer?: SpecialOffer;
  error?: string;
};

const readJsonResponse = async (response: Response): Promise<OffersApiResponse> => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

const normalizeLoadedOffers = (offers: SpecialOffer[]) => offers
  .filter((offer) => offer.active)
  .sort((a, b) => {
    if (a.highlight !== b.highlight) return a.highlight ? -1 : 1;
    if (a.priority !== b.priority) return a.priority - b.priority;
    return a.title.localeCompare(b.title);
  });

const getAdminHeaders = (adminPassword: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${adminPassword}`,
});

export const getOfferTimeLeft = (endDate: string) => {
  const diff = new Date(endDate).getTime() - Date.now();
  if (!Number.isFinite(diff) || diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  };
};

export const isOfferLive = (offer: SpecialOffer) => !getOfferTimeLeft(offer.endDate).expired;

export const getOfferEndLabel = (endDate: string) => {
  const parsed = new Date(endDate);
  if (Number.isNaN(parsed.getTime())) return 'Ask store for validity';

  return parsed.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const loadSpecialOffers = async (): Promise<SpecialOffer[]> => {
  try {
    const response = await fetch(OFFERS_API_URL, { cache: 'no-store' });
    if (response.ok) {
      const body = await readJsonResponse(response);
      const offers = normalizeLoadedOffers(body.offers || []);
      if (offers.length > 0) return offers;
    }
  } catch (error) {
    console.error('Failed to load offers from API. Trying editable CSV fallback.', error);
  }

  try {
    const response = await fetch(OFFERS_CSV_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Unable to load offers CSV: ${response.status}`);

    const offers = rowsToOffers(parseCsv(await response.text()));
    return offers.length > 0 ? offers : DEFAULT_SPECIAL_OFFERS;
  } catch (error) {
    console.error('Failed to load editable offers. Using fallback offers.', error);
    return DEFAULT_SPECIAL_OFFERS;
  }
};

export const loadAdminOffers = async (adminPassword: string): Promise<SpecialOffer[]> => {
  const response = await fetch(`${OFFERS_API_URL}?admin=1`, {
    cache: 'no-store',
    headers: getAdminHeaders(adminPassword),
  });
  const body = await readJsonResponse(response);
  if (!response.ok) throw new Error(body.error || 'Could not load offers.');
  return body.offers || [];
};

export const saveAdminOffer = async (adminPassword: string, offer: SpecialOffer): Promise<SpecialOffer> => {
  const response = await fetch(OFFERS_API_URL, {
    method: 'POST',
    headers: getAdminHeaders(adminPassword),
    body: JSON.stringify(offer),
  });
  const body = await readJsonResponse(response);
  if (!response.ok || !body.offer) throw new Error(body.error || 'Could not save offer.');
  return body.offer;
};

export const deleteAdminOffer = async (adminPassword: string, offerId: string): Promise<void> => {
  const response = await fetch(`${OFFERS_API_URL}?id=${encodeURIComponent(offerId)}`, {
    method: 'DELETE',
    headers: getAdminHeaders(adminPassword),
  });
  const body = await readJsonResponse(response);
  if (!response.ok) throw new Error(body.error || 'Could not delete offer.');
};
