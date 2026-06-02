import React, { useEffect, useMemo, useState } from 'react';
import { BUSINESS_DETAILS, PRODUCT_CATEGORIES, SERVICE_AREAS } from '../constants';
import { storageService } from '../services/storageService';
import type { EnquiryDraft, EnquiryPrefillDetail } from '../types';

const emptyForm: EnquiryDraft = {
  product: '',
  budget: '',
  name: '',
  phone: '',
  area: '',
  message: '',
  offerId: '',
  sourcePath: '',
  preferredContactTime: '',
  purchaseTimeline: '',
  company: '',
};

const budgetRanges = [
  'Under Rs. 15,000',
  'Rs. 15,000 - Rs. 30,000',
  'Rs. 30,000 - Rs. 50,000',
  'Above Rs. 50,000',
  'Need store recommendation',
];

const purchaseTimelines = [
  'This week',
  'Within 15 days',
  'Within 1 month',
  'Planning stage',
];

const contactTimes = [
  'Any time today',
  'Morning: 10 AM - 1 PM',
  'Afternoon: 1 PM - 5 PM',
  'Evening: 5 PM - 9 PM',
  'WhatsApp first',
];

const getPhoneHref = (phone: string) => `tel:+91${phone.replace(/\D/g, '').slice(-10)}`;

const EnquiryForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState<EnquiryDraft>(emptyForm);

  const selectedSummary = useMemo(
    () => [formData.product, formData.budget, formData.purchaseTimeline].filter(Boolean).join(' | '),
    [formData.product, formData.budget, formData.purchaseTimeline],
  );

  useEffect(() => {
    const handlePrefill = (event: Event) => {
      const detail = (event as CustomEvent<EnquiryPrefillDetail>).detail;
      if (!detail) return;

      setSuccess(false);
      setErrorMessage('');
      setStep(3);
      setFormData((current) => ({
        ...current,
        product: detail.product || current.product,
        budget: detail.budget || current.budget,
        message: detail.message || current.message,
        offerId: detail.offerId || current.offerId,
      }));
    };

    window.addEventListener('jj:prefill-enquiry', handlePrefill as EventListener);
    return () => window.removeEventListener('jj:prefill-enquiry', handlePrefill as EventListener);
  }, []);

  const nextStep = () => setStep((s) => Math.min(3, s + 1));
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const resetForm = () => {
    setSuccess(false);
    setSuccessMessage('');
    setErrorMessage('');
    setStep(1);
    setFormData(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const result = await storageService.saveEnquiry({
      ...formData,
      sourcePath: window.location.pathname,
    });

    setLoading(false);

    if (result.ok) {
      setSuccessMessage(result.message);
      setSuccess(true);
      return;
    }

    setErrorMessage(result.message);
  };

  if (success) {
    return (
      <section id="enquiry" className="enquiry-section enquiry-section--success">
        <div className="enquiry-success">
          <div className="enquiry-success__icon" aria-hidden="true">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3>Request Received!</h3>
          <p>{successMessage || 'Thank you. Our Glen specialist will contact you within 24 hours.'}</p>
          <div className="enquiry-success__actions">
            <a href={BUSINESS_DETAILS.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-g">
              WhatsApp Store
            </a>
            <a href={getPhoneHref(BUSINESS_DETAILS.phone)} className="btn-wh">
              Call Now
            </a>
          </div>
          <button type="button" onClick={resetForm} className="ulh enquiry-reset-button">
            Send Another Enquiry -&gt;
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="enquiry" className="enquiry-section">
      <div className="enquiry-shell">
        <div className="enquiry-layout">
          <div>
            <span className="tag enquiry-eyebrow">Custom Quote</span>
            <h2>
              Get a Quote
              <em> Tailored for You</em>
            </h2>
            <p className="enquiry-intro">
              Tell us what you are looking for and we will suggest the best Glen configuration for your kitchen and budget.
            </p>

            <div className="enquiry-benefits">
              {[
                { label: 'Lead Saved', desc: 'Your enquiry is stored safely in the showroom lead list', icon: '01' },
                { label: '4-Hour Team Digest', desc: 'New leads are emailed to the store team every 4 hours', icon: '02' },
                { label: 'Expert Guidance', desc: 'Specialists suggest the right suction, burner, and fit', icon: '03' },
                { label: 'Installation Support', desc: 'Help with delivery, fitting, and after-sales service', icon: '04' },
              ].map((item) => (
                <div key={item.label}>
                  <span>{item.icon}</span>
                  <div>
                    <strong>{item.label}</strong>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="lead-workflow">
              <strong>What happens next</strong>
              <ol>
                <li>We save your requirement and model interest.</li>
                <li>The showroom gets a fresh lead digest every 4 hours.</li>
                <li>A specialist calls or WhatsApps with stock, price, and demo options.</li>
              </ol>
            </div>
          </div>

          <div>
            <div className="enquiry-steps" aria-label={`Step ${step} of 3`}>
              {[1, 2, 3].map((item) => (
                <React.Fragment key={item}>
                  <span className={step >= item ? 'is-active' : ''}>
                    {step > item ? (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : item}
                  </span>
                  {item < 3 ? <i className={step > item ? 'is-active' : ''} /> : null}
                </React.Fragment>
              ))}
            </div>

            <div className="enquiry-card">
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="company"
                  className="enquiry-honeypot"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.company || ''}
                  onChange={(event) => setFormData({ ...formData, company: event.target.value })}
                />

                {step === 1 && (
                  <div>
                    <h4>What are you looking for?</h4>
                    <p className="enquiry-step-copy">Select the appliance category.</p>
                    <div className="enquiry-category-grid">
                      {PRODUCT_CATEGORIES.map((cat) => (
                        <button
                          key={cat.name}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, product: cat.name });
                            nextStep();
                          }}
                          className={formData.product === cat.name ? 'is-selected' : ''}
                        >
                          <strong>{cat.name}</strong>
                          <span>{cat.desc.slice(0, 62)}...</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h4>What is your budget?</h4>
                    <p className="enquiry-step-copy">Pick the closest range. The team can adjust recommendations after the call.</p>
                    <div className="enquiry-budget-list">
                      {budgetRanges.map((range) => (
                        <button
                          key={range}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, budget: range });
                            nextStep();
                          }}
                          className={formData.budget === range ? 'is-selected' : ''}
                        >
                          <span>{range}</span>
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      ))}
                    </div>
                    <button type="button" onClick={prevStep} className="enquiry-back-link">
                      &lt;- Back
                    </button>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h4>Your Details</h4>
                    <p className="enquiry-step-copy">We will reach out within 24 hours.</p>

                    {selectedSummary ? (
                      <div className="enquiry-selection">
                        <span>Selection</span>
                        <strong>{selectedSummary}</strong>
                      </div>
                    ) : null}

                    <div className="enquiry-fields">
                      <div>
                        <label>Full Name</label>
                        <input
                          required
                          type="text"
                          placeholder="Rajesh Kumar"
                          className="inp"
                          value={formData.name}
                          maxLength={80}
                          onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                        />
                      </div>
                      <div>
                        <label>Phone Number</label>
                        <input
                          required
                          type="tel"
                          inputMode="tel"
                          placeholder="98765 43210"
                          className="inp"
                          value={formData.phone}
                          maxLength={18}
                          pattern="[0-9+\s-]{10,18}"
                          onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                        />
                      </div>
                      <div>
                        <label>Your Area</label>
                        <select
                          required
                          className="inp"
                          value={formData.area}
                          onChange={(event) => setFormData({ ...formData, area: event.target.value })}
                        >
                          <option value="">Select Your Area</option>
                          {SERVICE_AREAS.map((area) => <option key={area} value={area}>{area}</option>)}
                          <option value="Other PCMC/Pune area">Other PCMC/Pune area</option>
                        </select>
                      </div>
                      <div className="enquiry-fields__split">
                        <div>
                          <label>Purchase Timeline</label>
                          <select
                            className="inp"
                            value={formData.purchaseTimeline || ''}
                            onChange={(event) => setFormData({ ...formData, purchaseTimeline: event.target.value })}
                          >
                            <option value="">Select timeline</option>
                            {purchaseTimelines.map((timeline) => (
                              <option key={timeline} value={timeline}>{timeline}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label>Preferred Contact</label>
                          <select
                            className="inp"
                            value={formData.preferredContactTime || ''}
                            onChange={(event) => setFormData({ ...formData, preferredContactTime: event.target.value })}
                          >
                            <option value="">Best time</option>
                            {contactTimes.map((time) => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label>Anything specific?</label>
                        <textarea
                          className="inp"
                          rows={4}
                          placeholder="Model name, kitchen size, preferred visit time..."
                          value={formData.message}
                          maxLength={300}
                          onChange={(event) => setFormData({ ...formData, message: event.target.value })}
                        />
                      </div>
                    </div>

                    {errorMessage ? (
                      <div className="enquiry-alert" role="alert">
                        <strong>Could not send online.</strong>
                        <p>{errorMessage}</p>
                        <div>
                          <a href={BUSINESS_DETAILS.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp Store</a>
                          <a href={getPhoneHref(BUSINESS_DETAILS.phone)}>Call Store</a>
                        </div>
                      </div>
                    ) : null}

                    <div className="enquiry-actions">
                      <button type="button" onClick={prevStep} className="btn-wh">Back</button>
                      <button type="submit" disabled={loading} className="btn-g">
                        {loading ? (
                          <>
                            <svg className="enquiry-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Sending...
                          </>
                        ) : 'Submit Enquiry ->'}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnquiryForm;
