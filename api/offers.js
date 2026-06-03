import crypto from 'node:crypto';
import https from 'node:https';

export const config = {
  regions: ['bom1'],
};

const MAX_BODY_BYTES = 20_000;
const SUPABASE_TIMEOUT_MS = 10_000;
const API_VERSION = 'node-offers-v2';
const SUPABASE_PROJECT_REF = 'uiilgdphkzejnjqmqnzj';
const DEFAULT_SUPABASE_URL = `https://${SUPABASE_PROJECT_REF}.supabase.co`;
const SUPABASE_DNS_FALLBACK_IPS = ['104.18.38.10', '172.64.149.246'];
const FALLBACK_OFFERS = [
  {
    active: true,
    priority: 1,
    id: 'monsoon-chimney-upgrade',
    title: 'Monsoon Chimney Upgrade',
    subtitle: 'Auto-clean chimney with live demo',
    product: 'Glen 6060 BL AC 60cm',
    enquiryProduct: 'Glen 6060 BL AC 60cm',
    discount: '32%',
    originalPrice: 'Rs. 28,990',
    salePrice: 'Rs. 19,713',
    eventName: 'Monsoon Sale',
    badge: 'BESTSELLER',
    endDate: '2026-07-15T23:59:59+05:30',
    image: '/showroom-kitchen-studio.jpg',
    highlight: true,
    terms: 'Includes showroom demo and installation guidance. Final price depends on current stock.',
    ctaText: 'Reserve Offer',
  },
  {
    active: true,
    priority: 2,
    id: 'chimney-hob-combo',
    title: 'Chimney + Hob Combo',
    subtitle: 'Complete kitchen upgrade set',
    product: 'Glen 6060 + Glen 1074',
    enquiryProduct: 'Glen chimney and hob combo',
    discount: '38%',
    originalPrice: 'Rs. 47,490',
    salePrice: 'Rs. 29,444',
    eventName: 'Combo Deal',
    badge: 'SAVE BIG',
    endDate: '2026-06-30T23:59:59+05:30',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800',
    highlight: true,
    terms: 'Best for new modular kitchens. Ask the store team for fitting requirements.',
    ctaText: 'Check Combo',
  },
  {
    active: true,
    priority: 3,
    id: 'glass-hob-install-pack',
    title: 'Glass Hob Installation Pack',
    subtitle: '4-burner glass hob with support',
    product: 'Glen 1074 SQ BL Hob',
    enquiryProduct: 'Glen 1074 SQ BL Hob',
    discount: '24%',
    originalPrice: 'Rs. 18,500',
    salePrice: 'Rs. 14,060',
    eventName: 'Hob Week',
    badge: 'HOT DEAL',
    endDate: '2026-06-20T23:59:59+05:30',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=82&w=1200',
    highlight: false,
    terms: 'Site visit may be needed before final installation confirmation.',
    ctaText: 'Ask Price',
  },
  {
    active: true,
    priority: 4,
    id: 'built-in-oven-week',
    title: 'Built-in Oven Week',
    subtitle: 'Convection oven for modern kitchens',
    product: 'Glen 658 Black Oven',
    enquiryProduct: 'Glen built-in oven',
    discount: '20%',
    originalPrice: 'Rs. 32,000',
    salePrice: 'Rs. 25,600',
    eventName: 'Oven Week',
    badge: 'LIMITED',
    endDate: '2026-07-31T23:59:59+05:30',
    image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&q=82&w=1200',
    highlight: false,
    terms: 'Offer applies on selected oven models while stock lasts.',
    ctaText: 'Enquire Now',
  },
];

class ValidationError extends Error {}

const getEnv = (...names) => {
  for (const name of names) {
    const value = (process.env[name] || '').trim();
    if (value) return value;
  }
  return '';
};

const getSupabaseConfig = () => {
  const configuredUrl = getEnv('SUPABASE_URL') || DEFAULT_SUPABASE_URL;
  const key = getEnv('SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_KEY');

  if (!key) {
    throw new Error('Supabase configuration is missing');
  }

  let url = DEFAULT_SUPABASE_URL;
  try {
    const parsedUrl = new URL(configuredUrl);
    url = parsedUrl.hostname.includes(SUPABASE_PROJECT_REF)
      ? `${parsedUrl.protocol}//${parsedUrl.hostname}`
      : DEFAULT_SUPABASE_URL;
  } catch {
    url = DEFAULT_SUPABASE_URL;
  }

  return { url, key };
};

const sendJson = (response, status, payload) => {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-JJ-Offers-Api', API_VERSION);
  response.end(JSON.stringify(payload));
};

const cleanText = (value, maxLen = 220) => {
  if (value == null) return '';
  return String(value).replace(/\s+/g, ' ').trim().slice(0, maxLen);
};

const toBool = (value, fallback = false) => {
  if (typeof value === 'boolean') return value;
  if (value == null) return fallback;
  return ['1', 'yes', 'true', 'active', 'on'].includes(String(value).trim().toLowerCase());
};

const toInt = (value, fallback = 999) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const slugify = (value) => {
  const slug = String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

  return slug || `offer-${Math.floor(Date.now() / 1000)}`;
};

const timingSafeEqual = (left, right) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
};

const isAdminRequest = (request) => {
  const configuredPassword = getEnv('ADMIN_PASSWORD');
  if (!configuredPassword) return false;

  const authHeader = request.headers.authorization || '';
  const provided = authHeader.replace(/^Bearer\s+/i, '').trim();
  return timingSafeEqual(provided, configuredPassword);
};

const requireAdmin = (request) => {
  if (!getEnv('ADMIN_PASSWORD')) {
    const error = new Error('Admin password is not configured.');
    error.status = 401;
    throw error;
  }

  if (!isAdminRequest(request)) {
    const error = new Error('Invalid admin password.');
    error.status = 401;
    throw error;
  }
};

const rowToOffer = (row) => ({
  active: Boolean(row.active),
  priority: row.priority || 999,
  id: row.id || '',
  title: row.title || '',
  subtitle: row.subtitle || '',
  product: row.product || '',
  enquiryProduct: row.enquiry_product || row.product || '',
  discount: row.discount || '',
  originalPrice: row.original_price || '',
  salePrice: row.sale_price || '',
  eventName: row.event_name || 'Store Offer',
  badge: row.badge || '',
  endDate: row.end_date || '',
  image: row.image || '',
  highlight: Boolean(row.highlight),
  terms: row.terms || '',
  ctaText: row.cta_text || 'Enquire Now',
});

const offerToRow = (data) => {
  const title = cleanText(data.title, 140);
  const product = cleanText(data.product, 180);
  const endDate = cleanText(data.endDate || data.end_date, 80);

  if (!title) throw new ValidationError('Offer title is required.');
  if (!product) throw new ValidationError('Product name is required.');
  if (!endDate) throw new ValidationError('End date is required.');

  const rawId = cleanText(data.id, 90);

  return {
    id: slugify(rawId || title),
    active: toBool(data.active, true),
    priority: toInt(data.priority, 999),
    title,
    subtitle: cleanText(data.subtitle, 180),
    product,
    enquiry_product: cleanText(data.enquiryProduct || data.enquiry_product, 180) || product,
    discount: cleanText(data.discount, 40),
    original_price: cleanText(data.originalPrice || data.original_price, 60),
    sale_price: cleanText(data.salePrice || data.sale_price, 60),
    event_name: cleanText(data.eventName || data.event_name, 80) || 'Store Offer',
    badge: cleanText(data.badge, 50),
    end_date: endDate,
    image: cleanText(data.image, 500),
    highlight: toBool(data.highlight, false),
    terms: cleanText(data.terms, 320),
    cta_text: cleanText(data.ctaText || data.cta_text, 50) || 'Enquire Now',
    updated_at: new Date().toISOString(),
  };
};

const sortOffers = (offers) => [...offers].sort((a, b) => {
  if (a.highlight !== b.highlight) return a.highlight ? -1 : 1;
  if (a.priority !== b.priority) return a.priority - b.priority;
  return a.title.localeCompare(b.title);
});

const getBody = async (request) => {
  if (request.body && typeof request.body === 'object') return request.body;
  if (typeof request.body === 'string') return request.body ? JSON.parse(request.body) : {};

  const chunks = [];
  let totalBytes = 0;

  for await (const chunk of request) {
    totalBytes += chunk.length;
    if (totalBytes > MAX_BODY_BYTES) {
      throw new ValidationError('Request is too large.');
    }
    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString('utf8');
  return rawBody ? JSON.parse(rawBody) : {};
};

const readJsonPayload = (text) => (text ? JSON.parse(text) : []);

const isDnsFailure = (error) => {
  const code = error?.cause?.code || error?.code;
  return code === 'ENOTFOUND' || code === 'EAI_AGAIN';
};

const supabaseIpRequest = ({ url, key }, method, table, query, body, prefer, ipAddress) => new Promise((resolve, reject) => {
  const parsedUrl = new URL(url);
  const params = new URLSearchParams(query);
  const payload = body === undefined ? '' : JSON.stringify(body);
  const request = https.request({
    hostname: ipAddress,
    port: 443,
    path: `/rest/v1/${encodeURIComponent(table)}?${params}`,
    method,
    servername: parsedUrl.hostname,
    timeout: SUPABASE_TIMEOUT_MS,
    headers: {
      host: parsedUrl.hostname,
      'x-forwarded-host': parsedUrl.hostname,
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...(prefer ? { Prefer: prefer } : {}),
      ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
    },
  }, (response) => {
    const chunks = [];
    response.on('data', (chunk) => chunks.push(chunk));
    response.on('end', () => {
      const text = Buffer.concat(chunks).toString('utf8');
      if (response.statusCode < 200 || response.statusCode >= 300) {
        reject(new Error(`Supabase ${method} ${table} failed (${response.statusCode}): ${text.slice(0, 500)}`));
        return;
      }

      try {
        resolve(readJsonPayload(text));
      } catch (error) {
        reject(error);
      }
    });
  });

  request.on('timeout', () => {
    request.destroy(new Error(`Supabase ${method} ${table} timed out through ${ipAddress}`));
  });
  request.on('error', reject);
  if (payload) request.write(payload);
  request.end();
});

const supabaseRequest = async (method, table, query = {}, body = undefined, prefer = '') => {
  const { url, key } = getSupabaseConfig();
  const params = new URLSearchParams(query);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SUPABASE_TIMEOUT_MS);

  try {
    const result = await fetch(`${url}/rest/v1/${encodeURIComponent(table)}?${params}`, {
      method,
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        ...(prefer ? { Prefer: prefer } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });

    const text = await result.text();
    if (!result.ok) {
      throw new Error(`Supabase ${method} ${table} failed (${result.status}): ${text.slice(0, 500)}`);
    }

    return readJsonPayload(text);
  } catch (error) {
    if (!isDnsFailure(error)) throw error;

    console.warn(`${API_VERSION} DNS failed for ${new URL(url).hostname}; trying Supabase IP fallback.`);
    let lastError = error;
    for (const ipAddress of SUPABASE_DNS_FALLBACK_IPS) {
      try {
        return await supabaseIpRequest({ url, key }, method, table, query, body, prefer, ipAddress);
      } catch (fallbackError) {
        lastError = fallbackError;
      }
    }

    throw lastError;
  } finally {
    clearTimeout(timeout);
  }
};

const handleGet = async (request, response) => {
  const requestUrl = new URL(request.url, 'https://local.vercel');
  if (requestUrl.searchParams.get('health') === '1') {
    sendJson(response, 200, {
      ok: true,
      runtime: API_VERSION,
      supabaseConfigured: Boolean(getEnv('SUPABASE_URL') && getEnv('SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_KEY')),
      adminPasswordConfigured: Boolean(getEnv('ADMIN_PASSWORD')),
    });
    return;
  }

  const adminMode = requestUrl.searchParams.get('admin') === '1';

  if (adminMode) requireAdmin(request);

  let offers = [];
  try {
    const rows = await supabaseRequest('GET', 'offers', { select: '*' });
    offers = rows.map(rowToOffer);
  } catch (error) {
    if (adminMode) throw error;
    console.warn(`${API_VERSION} public offers fallback:`, error);
    offers = FALLBACK_OFFERS;
  }

  if (!adminMode) {
    offers = offers.filter((offer) => offer.active);
  }

  sendJson(response, 200, { offers: sortOffers(offers), runtime: API_VERSION });
};

const handlePost = async (request, response) => {
  requireAdmin(request);

  const offerRow = offerToRow(await getBody(request));
  const result = await supabaseRequest(
    'POST',
    'offers',
    { on_conflict: 'id' },
    offerRow,
    'resolution=merge-duplicates,return=representation',
  );

  sendJson(response, 200, { offer: rowToOffer(result[0] || offerRow) });
};

const handleDelete = async (request, response) => {
  requireAdmin(request);

  const requestUrl = new URL(request.url, 'https://local.vercel');
  const offerId = cleanText(requestUrl.searchParams.get('id'), 90);
  if (!offerId) throw new ValidationError('Offer ID is required.');

  await supabaseRequest(
    'DELETE',
    'offers',
    { id: `eq.${slugify(offerId)}` },
    undefined,
    'return=minimal',
  );

  sendJson(response, 200, { message: 'Offer deleted.' });
};

export default async function handler(request, response) {
  try {
    if (request.method === 'OPTIONS') {
      sendJson(response, 200, {});
      return;
    }

    if (request.method === 'GET') {
      await handleGet(request, response);
      return;
    }

    if (request.method === 'POST') {
      await handlePost(request, response);
      return;
    }

    if (request.method === 'DELETE') {
      await handleDelete(request, response);
      return;
    }

    sendJson(response, 405, { error: 'Method not allowed.' });
  } catch (error) {
    if (error.status) {
      sendJson(response, error.status, { error: error.message });
      return;
    }

    if (error instanceof ValidationError) {
      sendJson(response, 422, { error: error.message });
      return;
    }

    console.error(`${API_VERSION} ${request.method} error:`, error);
    const action = request.method === 'POST' ? 'save' : request.method === 'DELETE' ? 'delete' : 'load';
    const requestUrl = new URL(request.url, 'https://local.vercel');
    const debugPayload = requestUrl.searchParams.get('debug') === '1' && isAdminRequest(request)
      ? {
        details: cleanText(error.message, 500),
        cause: cleanText(error?.cause?.message || error?.cause?.code || '', 240),
      }
      : {};

    sendJson(response, 500, { error: `Could not ${action} offers.`, runtime: API_VERSION, ...debugPayload });
  }
}
