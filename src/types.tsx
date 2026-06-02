
export interface Enquiry {
  id?: string;
  product: string;
  budget: string;
  name: string;
  phone: string;
  area: string;
  message?: string;
  offerId?: string;
  sourcePath?: string;
  preferredContactTime?: string;
  purchaseTimeline?: string;
  date: string;
}

export type EnquiryDraft = Omit<Enquiry, 'id' | 'date'> & {
  company?: string;
};

export type SaveEnquiryResult =
  | {
      ok: true;
      status: 'saved';
      message: string;
      data?: Enquiry;
    }
  | {
      ok: false;
      status: 'queued' | 'failed';
      message: string;
    };

export interface EnquiryPrefillDetail {
  product?: string;
  budget?: string;
  message?: string;
  offerId?: string;
}

export interface SpecialOffer {
  id: string;
  title: string;
  subtitle: string;
  discount: string;
  originalPrice: string;
  salePrice: string;
  product: string;
  enquiryProduct: string;
  eventName: string;
  endDate: string;
  image: string;
  badge: string;
  highlight: boolean;
  active: boolean;
  priority: number;
  terms: string;
  ctaText: string;
}

export interface Review {
  author: string;
  rating: number;
  text: string;
  date: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}


