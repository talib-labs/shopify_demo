// ─── Entity ──────────────────────────────────────────────────────────────────

export interface Entity {
  id: string;
  type: string;
  individual: {
    first_name: string;
    last_name: string;
    phone: string;
    dob: string;
    email: string;
  };
  address: {
    line1: string;
    city: string;
    state: string;
    zip: string;
  };
  status: string;
  verification: {
    identity: { verified: boolean; methods: string[] };
    phone: { verified: boolean; latest_verification_session: string | null; methods: string[] };
  };
  products: string[];
  created_at: string;
  updated_at: string;
}

// ─── Connect ─────────────────────────────────────────────────────────────────

export interface ConnectResponse {
  id: string;
  entity_id: string;
  status: string;
  accounts: string[];
  error: null;
  created_at: string;
  updated_at: string;
}

// ─── Account ─────────────────────────────────────────────────────────────────

export interface Account {
  id: string;
  holder_id: string;
  status: string;
  type: string;
  liability: {
    mch_id: string;
    mask: string;
    ownership: string;
    type: string;
    name: string;
  };
  balance: number;
  credit_limit?: number;
  available_credit?: number;
  interest_rate_min?: number;
  interest_rate_max?: number;
  interest_rate?: number;
  next_payment_minimum_amount?: number;
  next_payment_due_date?: string;
  created_at: string;
  updated_at: string;
}

// ─── Verification Session ─────────────────────────────────────────────────────

export interface VerificationSession {
  id: string;
  entity_id?: string;
  account_id?: string;
  status: 'pending' | 'verified' | 'failed';
  type: 'phone' | 'sms' | 'identity' | 'network';
  sms?: { phone: string };
  network?: { cvv: string };
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Sensitive Account Data ───────────────────────────────────────────────────

export interface AccountSensitive {
  id: string;
  account_id: string;
  number: string;
  routing_number?: string;
  expiration?: string;
  cvv?: string;
  billing_address?: {
    line1: string;
    city: string;
    state: string;
    zip: string;
  };
}

// ─── Shopify Payment Token ────────────────────────────────────────────────────

export interface ShopifyPaymentToken {
  id: string;
  payment_instrument_type: 'credit_card';
  payment_token: string;
  last4: string;
  brand: string;
  expiry_month: number;
  expiry_year: number;
  order_id: string;
  amount: number;
  currency: string;
  created_at: string;
}

// ─── API Log ──────────────────────────────────────────────────────────────────

export interface ApiLog {
  id: string;
  step: number;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  requestHeaders: Record<string, string>;
  requestBody: unknown;
  responseStatus: number;
  responseBody: unknown;
  duration: number;
  timestamp: string;
  label: string;
  description?: string;
  source?: 'method' | 'shopify';
}

// ─── Order ────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  image: string;
}
