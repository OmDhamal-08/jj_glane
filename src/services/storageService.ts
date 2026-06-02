import type { Enquiry, EnquiryDraft, SaveEnquiryResult } from '../types';

const configuredApiBaseUrl = import.meta.env.VITE_ENQUIRY_API_BASE_URL?.trim();
const API_BASE_URL = (configuredApiBaseUrl || '/api').replace(/\/+$/, '');
const STORAGE_KEY = 'glen_ravet_enquiries';

type EnquiryApiResponse = Partial<Enquiry> & {
  error?: string;
  messageText?: string;
};

const savePendingEnquiry = (enquiry: EnquiryDraft) => {
  const existing = localStorage.getItem(STORAGE_KEY);
  const enquiries: Enquiry[] = existing ? JSON.parse(existing) : [];

  const newEnquiry: Enquiry = {
    ...enquiry,
    id: Math.random().toString(36).slice(2, 11),
    date: new Date().toISOString(),
  };

  enquiries.push(newEnquiry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(enquiries));
};

const readJsonSafely = async (response: Response): Promise<{ body: EnquiryApiResponse; isJson: boolean }> => {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return { body: {}, isJson: false };
  }

  try {
    return { body: await response.json(), isJson: true };
  } catch {
    return { body: {}, isJson: false };
  }
};

export const storageService = {
  saveEnquiry: async (enquiry: EnquiryDraft): Promise<SaveEnquiryResult> => {
    const payload: EnquiryDraft = {
      ...enquiry,
      sourcePath: enquiry.sourcePath || window.location.pathname,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/enquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const { body: responseBody, isJson } = await readJsonSafely(response);

      if (!isJson) {
        return {
          ok: false,
          status: 'failed',
          message: 'The online enquiry service is not responding correctly. Please WhatsApp or call the store directly.',
        };
      }

      if (!response.ok) {
        return {
          ok: false,
          status: 'failed',
          message: responseBody.error || 'Please check the form details and try again.',
        };
      }

      const savedEnquiry: Enquiry = {
        id: responseBody.id,
        product: responseBody.product || payload.product,
        budget: responseBody.budget || payload.budget,
        name: responseBody.name || payload.name,
        phone: responseBody.phone || payload.phone,
        area: responseBody.area || payload.area,
        message: responseBody.message || payload.message,
        offerId: responseBody.offerId || payload.offerId,
        sourcePath: responseBody.sourcePath || payload.sourcePath,
        preferredContactTime: responseBody.preferredContactTime || payload.preferredContactTime,
        purchaseTimeline: responseBody.purchaseTimeline || payload.purchaseTimeline,
        date: responseBody.date || new Date().toISOString(),
      };

      return {
        ok: true,
        status: 'saved',
        message: responseBody.messageText || 'Request received. Our Glen specialist will contact you within 24 hours.',
        data: savedEnquiry,
      };
    } catch (error) {
      console.error('Could not reach enquiry API. Saved a local pending copy.', error);

      try {
        savePendingEnquiry(payload);
        return {
          ok: false,
          status: 'queued',
          message: 'We could not send this online right now. Please WhatsApp or call the store so the team receives it immediately.',
        };
      } catch (localError) {
        console.error('Fallback failed:', localError);
        return {
          ok: false,
          status: 'failed',
          message: 'We could not send this online right now. Please WhatsApp or call the store directly.',
        };
      }
    }
  },

  getEnquiries: async (): Promise<Enquiry[]> => {
    try {
      const existing = localStorage.getItem(STORAGE_KEY);
      return existing ? JSON.parse(existing) : [];
    } catch (error) {
      console.error('Failed to read pending enquiries from localStorage:', error);
      return [];
    }
  },
};
