import crypto from 'node:crypto';

const MAX_BODY_BYTES = 20_000;
const SUPABASE_TIMEOUT_MS = 10_000;

class ValidationError extends Error {}

const getEnv = (...names) => {
  for (const name of names) {
    const value = (process.env[name] || '').trim();
    if (value) return value;
  }
  return '';
};

const getSupabaseConfig = () => {
  const url = getEnv('SUPABASE_URL').replace(/\/+$/, '');
  const key = getEnv('SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_KEY');

  if (!url || !key) {
    throw new Error('Supabase configuration is missing');
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

    return text ? JSON.parse(text) : [];
  } finally {
    clearTimeout(timeout);
  }
};

const handleGet = async (request, response) => {
  const requestUrl = new URL(request.url, 'https://local.vercel');
  const adminMode = requestUrl.searchParams.get('admin') === '1';

  if (adminMode) requireAdmin(request);

  const rows = await supabaseRequest('GET', 'offers', { select: '*' });
  let offers = rows.map(rowToOffer);

  if (!adminMode) {
    offers = offers.filter((offer) => offer.active);
  }

  sendJson(response, 200, { offers: sortOffers(offers) });
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

    console.error(`Offers ${request.method} error:`, error);
    const action = request.method === 'POST' ? 'save' : request.method === 'DELETE' ? 'delete' : 'load';
    sendJson(response, 500, { error: `Could not ${action} offers.` });
  }
}
