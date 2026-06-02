import React, { useEffect, useMemo, useState } from 'react';
import { deleteAdminOffer, loadAdminOffers, saveAdminOffer } from '../services/offersService';
import type { SpecialOffer } from '../types';

const ADMIN_PASSWORD_KEY = 'jj-admin-password';

const IMAGE_PRESETS = [
  {
    label: 'Showroom',
    url: '/showroom-kitchen-studio.jpg',
  },
  {
    label: 'Kitchen',
    url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=82&w=1200',
  },
  {
    label: 'Premium',
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=82&w=1200',
  },
  {
    label: 'Oven',
    url: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&q=82&w=1200',
  },
];

const slugify = (value: string) => value
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 80);

const getDefaultEndDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString().slice(0, 16);
};

const toDateInputValue = (value: string) => {
  if (!value) return '';
  return value.slice(0, 16);
};

const fromDateInputValue = (value: string) => {
  if (!value) return '';
  return `${value}:59+05:30`;
};

const createDraftOffer = (): SpecialOffer => ({
  active: true,
  priority: 1,
  id: '',
  title: '',
  subtitle: 'Limited period store offer',
  product: '',
  enquiryProduct: '',
  discount: '',
  originalPrice: '',
  salePrice: 'Call for Price',
  eventName: 'Store Offer',
  badge: 'LIVE',
  endDate: fromDateInputValue(getDefaultEndDate()),
  image: IMAGE_PRESETS[0].url,
  highlight: false,
  terms: 'Offer subject to stock availability and store confirmation.',
  ctaText: 'Enquire Now',
});

const sortOffers = (offers: SpecialOffer[]) => [...offers].sort((a, b) => {
  if (a.highlight !== b.highlight) return a.highlight ? -1 : 1;
  if (a.priority !== b.priority) return a.priority - b.priority;
  return a.title.localeCompare(b.title);
});

const AdminOffers: React.FC = () => {
  const [password, setPassword] = useState(() => sessionStorage.getItem(ADMIN_PASSWORD_KEY) || '');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [offers, setOffers] = useState<SpecialOffer[]>([]);
  const [draft, setDraft] = useState<SpecialOffer>(() => createDraftOffer());
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const selectedOffer = useMemo(
    () => offers.find((offer) => offer.id === selectedId) || null,
    [offers, selectedId],
  );

  useEffect(() => {
    if (selectedOffer) {
      setDraft(selectedOffer);
    }
  }, [selectedOffer]);

  const loadOffers = async (adminPassword = password) => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const loadedOffers = await loadAdminOffers(adminPassword);
      setOffers(sortOffers(loadedOffers));
      setIsUnlocked(true);
      sessionStorage.setItem(ADMIN_PASSWORD_KEY, adminPassword);
      if (!selectedId && loadedOffers[0]) {
        setSelectedId(loadedOffers[0].id);
      }
      if (loadedOffers.length === 0) {
        setDraft(createDraftOffer());
      }
    } catch (loadError) {
      setIsUnlocked(false);
      sessionStorage.removeItem(ADMIN_PASSWORD_KEY);
      setError(loadError instanceof Error ? loadError.message : 'Could not open admin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (password) {
      void loadOffers(password);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateDraft = <Key extends keyof SpecialOffer,>(key: Key, value: SpecialOffer[Key]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const handleTitleChange = (title: string) => {
    setDraft((current) => ({
      ...current,
      title,
      id: selectedId ? current.id : slugify(title),
    }));
  };

  const handleNewOffer = () => {
    setSelectedId('');
    setDraft(createDraftOffer());
    setError('');
    setMessage('New offer draft ready.');
  };

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    void loadOffers(password);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const savedOffer = await saveAdminOffer(password, {
        ...draft,
        id: draft.id || slugify(draft.title),
        enquiryProduct: draft.enquiryProduct || draft.product,
      });

      setOffers((current) => sortOffers([
        savedOffer,
        ...current.filter((offer) => offer.id !== savedOffer.id),
      ]));
      setDraft(savedOffer);
      setSelectedId(savedOffer.id);
      setMessage('Offer saved.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save offer.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!draft.id) return;
    const confirmed = window.confirm(`Delete "${draft.title}"? This cannot be undone.`);
    if (!confirmed) return;

    setSaving(true);
    setError('');
    setMessage('');

    try {
      await deleteAdminOffer(password, draft.id);
      setOffers((current) => current.filter((offer) => offer.id !== draft.id));
      setSelectedId('');
      setDraft(createDraftOffer());
      setMessage('Offer deleted.');
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Could not delete offer.');
    } finally {
      setSaving(false);
    }
  };

  if (!isUnlocked) {
    return (
      <main className="admin-page admin-page--login">
        <form className="admin-login-card" onSubmit={handleLogin}>
          <span>JJ Kitchen Admin</span>
          <h1>Offers Manager</h1>
          <p>Enter the admin password to manage live website offers.</p>

          <label htmlFor="admin-password">Admin Password</label>
          <input
            id="admin-password"
            type="password"
            value={password}
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
            required
          />

          {error ? <div className="admin-alert admin-alert--error">{error}</div> : null}

          <button type="submit" className="btn-g" disabled={loading}>
            {loading ? 'Opening...' : 'Open Admin'}
          </button>
          <a href="/" className="admin-home-link">Back to website</a>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <header className="admin-topbar">
        <div>
          <span>Hidden Admin</span>
          <h1>Offers Manager</h1>
        </div>
        <div className="admin-topbar__actions">
          <a href="/" className="btn-wh">Website</a>
          <button
            type="button"
            className="btn-wh"
            onClick={() => {
              sessionStorage.removeItem(ADMIN_PASSWORD_KEY);
              setIsUnlocked(false);
              setPassword('');
            }}
          >
            Lock
          </button>
        </div>
      </header>

      <section className="admin-layout">
        <aside className="admin-list-panel">
          <div className="admin-panel-header">
            <div>
              <strong>{offers.length} Offers</strong>
              <span>Active, hidden, and expired</span>
            </div>
            <button type="button" className="btn-g" onClick={handleNewOffer}>New</button>
          </div>

          <div className="admin-offer-list">
            {offers.length > 0 ? offers.map((offer) => (
              <button
                type="button"
                key={offer.id}
                className={`admin-offer-row${offer.id === selectedId ? ' is-selected' : ''}`}
                onClick={() => setSelectedId(offer.id)}
              >
                <span className={offer.active ? 'is-live' : 'is-hidden'}>
                  {offer.active ? 'Live' : 'Hidden'}
                </span>
                <strong>{offer.title}</strong>
                <small>{offer.salePrice || 'Call for Price'}</small>
              </button>
            )) : (
              <div className="admin-empty">
                <strong>No database offers yet.</strong>
                <p>Create the first offer here.</p>
              </div>
            )}
          </div>
        </aside>

        <form className="admin-editor" onSubmit={handleSave}>
          <div className="admin-panel-header admin-editor__header">
            <div>
              <strong>{draft.id ? 'Edit Offer' : 'New Offer'}</strong>
              <span>Changes show on the website after saving</span>
            </div>
            <div className="admin-editor__toggles">
              <label>
                <input
                  type="checkbox"
                  checked={draft.active}
                  onChange={(event) => updateDraft('active', event.target.checked)}
                />
                Active
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={draft.highlight}
                  onChange={(event) => updateDraft('highlight', event.target.checked)}
                />
                Highlight
              </label>
            </div>
          </div>

          <div className="admin-fields">
            <label>
              Offer Title
              <input
                type="text"
                value={draft.title}
                onChange={(event) => handleTitleChange(event.target.value)}
                placeholder="Diwali Chimney Offer"
                required
              />
            </label>

            <label>
              Offer ID
              <input
                type="text"
                value={draft.id}
                onChange={(event) => updateDraft('id', slugify(event.target.value))}
                placeholder="diwali-chimney-offer"
                required
              />
            </label>

            <label>
              Subtitle
              <input
                type="text"
                value={draft.subtitle}
                onChange={(event) => updateDraft('subtitle', event.target.value)}
                placeholder="Auto-clean chimney with live demo"
              />
            </label>

            <label>
              Product Name
              <input
                type="text"
                value={draft.product}
                onChange={(event) => updateDraft('product', event.target.value)}
                placeholder="Glen chimney and hob combo"
                required
              />
            </label>

            <label>
              Enquiry Product
              <input
                type="text"
                value={draft.enquiryProduct}
                onChange={(event) => updateDraft('enquiryProduct', event.target.value)}
                placeholder="Leave blank to use product name"
              />
            </label>

            <label>
              Event Name
              <input
                type="text"
                value={draft.eventName}
                onChange={(event) => updateDraft('eventName', event.target.value)}
                placeholder="Festival Sale"
              />
            </label>

            <label>
              Discount
              <input
                type="text"
                value={draft.discount}
                onChange={(event) => updateDraft('discount', event.target.value)}
                placeholder="30%"
              />
            </label>

            <label>
              Badge
              <input
                type="text"
                value={draft.badge}
                onChange={(event) => updateDraft('badge', event.target.value)}
                placeholder="BESTSELLER"
              />
            </label>

            <label>
              Original Price
              <input
                type="text"
                value={draft.originalPrice}
                onChange={(event) => updateDraft('originalPrice', event.target.value)}
                placeholder="Rs. 28,990"
              />
            </label>

            <label>
              Sale Price
              <input
                type="text"
                value={draft.salePrice}
                onChange={(event) => updateDraft('salePrice', event.target.value)}
                placeholder="Rs. 19,999"
              />
            </label>

            <label>
              Priority
              <input
                type="number"
                min="1"
                value={draft.priority}
                onChange={(event) => updateDraft('priority', Number(event.target.value))}
              />
            </label>

            <label>
              End Date
              <input
                type="datetime-local"
                value={toDateInputValue(draft.endDate)}
                onChange={(event) => updateDraft('endDate', fromDateInputValue(event.target.value))}
                required
              />
            </label>
          </div>

          <div className="admin-image-panel">
            <div>
              <strong>Offer Background</strong>
              <span>Pick a preset or paste a custom image URL.</span>
            </div>
            <div className="admin-image-presets">
              {IMAGE_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset.url}
                  className={draft.image === preset.url ? 'is-selected' : ''}
                  onClick={() => updateDraft('image', preset.url)}
                >
                  <img src={preset.url} alt="" loading="lazy" />
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
            <label>
              Custom Image URL
              <input
                type="url"
                value={draft.image}
                onChange={(event) => updateDraft('image', event.target.value)}
                placeholder="https://example.com/kitchen-photo.jpg"
              />
            </label>
          </div>

          <label className="admin-full-field">
            Terms
            <textarea
              rows={3}
              value={draft.terms}
              onChange={(event) => updateDraft('terms', event.target.value)}
              placeholder="Offer subject to stock availability and store confirmation."
            />
          </label>

          <label className="admin-full-field">
            CTA Text
            <input
              type="text"
              value={draft.ctaText}
              onChange={(event) => updateDraft('ctaText', event.target.value)}
              placeholder="Enquire Now"
            />
          </label>

          {message ? <div className="admin-alert admin-alert--success">{message}</div> : null}
          {error ? <div className="admin-alert admin-alert--error">{error}</div> : null}

          <div className="admin-editor__actions">
            <button type="submit" className="btn-g" disabled={saving}>
              {saving ? 'Saving...' : 'Save Offer'}
            </button>
            <button type="button" className="btn-wh" onClick={handleNewOffer} disabled={saving}>
              Clear Form
            </button>
            <button
              type="button"
              className="admin-danger-button"
              onClick={handleDelete}
              disabled={saving || !draft.id}
            >
              Delete
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default AdminOffers;
