import {
  Account,
  AccountSensitive,
  ApiLog,
  ConnectResponse,
  Entity,
  ShopifyPaymentToken,
  VerificationSession,
} from '@/types';

// ─── Utilities ────────────────────────────────────────────────────────────────

const randomDelay = () =>
  new Promise<void>((r) => setTimeout(r, Math.floor(Math.random() * 900) + 500));

function genId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const MASKED_KEY = 'sk_••••••••••••Vjc';

const DEFAULT_HEADERS: Record<string, string> = {
  Authorization: `Bearer ${MASKED_KEY}`,
  'Content-Type': 'application/json',
  'Method-Version': '2024-07-04',
};

function makeLog(
  step: number,
  label: string,
  method: ApiLog['method'],
  url: string,
  headers: Record<string, string>,
  body: unknown,
  responseBody: unknown,
  duration: number,
  description?: string,
  extra?: Partial<ApiLog>
): ApiLog {
  return {
    id: genId(),
    step,
    method,
    url,
    requestHeaders: headers,
    requestBody: body ?? null,
    responseStatus: 200,
    responseBody,
    duration,
    timestamp: new Date().toISOString(),
    label,
    description,
    ...extra,
  };
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_ENTITY: Entity = {
  id: 'ent_BzirqpLEm3BW7',
  type: 'individual',
  individual: {
    first_name: 'Alex',
    last_name: 'Jordan',
    phone: '+14085551234',
    dob: '1995-06-22',
    email: 'alex.jordan@gmail.com',
  },
  address: {
    line1: '1234 Market St',
    city: 'San Francisco',
    state: 'CA',
    zip: '94103',
  },
  status: 'active',
  verification: {
    identity: { verified: true, methods: ['element'] },
    phone: { verified: true, latest_verification_session: 'evf_P4QXNj93Y9J8L', methods: [] },
  },
  products: ['identity', 'connect'],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const MOCK_CONNECT_RESPONSE: ConnectResponse = {
  id: 'cxn_4ewMmBbjYDMR4',
  entity_id: 'ent_BzirqpLEm3BW7',
  status: 'completed',
  accounts: [
    'acc_GV8WbmJW7KGRy',
    'acc_eFFRV9zmpLREK',
    'acc_eKKmrXDpJBKgw',
  ],
  error: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const MOCK_ACCOUNTS: Account[] = [
  {
    id: 'acc_GV8WbmJW7KGRy',
    holder_id: 'ent_BzirqpLEm3BW7',
    status: 'active',
    type: 'liability',
    liability: {
      mch_id: 'mch_200145',
      mask: '4242',
      ownership: 'primary',
      type: 'credit_card',
      name: 'Chase Sapphire Reserve',
    },
    balance: 84500,
    credit_limit: 1000000,
    available_credit: 915500,
    interest_rate_min: 20.99,
    interest_rate_max: 27.99,
    next_payment_minimum_amount: 3500,
    next_payment_due_date: '2024-05-15',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'acc_eFFRV9zmpLREK',
    holder_id: 'ent_BzirqpLEm3BW7',
    status: 'active',
    type: 'liability',
    liability: {
      mch_id: 'mch_600118',
      mask: '5555',
      ownership: 'primary',
      type: 'credit_card',
      name: 'Amex Platinum',
    },
    balance: 210000,
    credit_limit: 2000000,
    available_credit: 1790000,
    interest_rate_min: 18.24,
    interest_rate_max: 29.99,
    next_payment_minimum_amount: 7500,
    next_payment_due_date: '2024-05-02',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'acc_eKKmrXDpJBKgw',
    holder_id: 'ent_BzirqpLEm3BW7',
    status: 'active',
    type: 'liability',
    liability: {
      mch_id: 'mch_300284',
      mask: '1234',
      ownership: 'primary',
      type: 'credit_card',
      name: 'Apple Card',
    },
    balance: 32000,
    credit_limit: 500000,
    available_credit: 468000,
    interest_rate_min: 15.24,
    interest_rate_max: 26.24,
    next_payment_minimum_amount: 1000,
    next_payment_due_date: '2024-05-25',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// ─── Mock Functions ───────────────────────────────────────────────────────────

/** API 1: Create Entity */
export async function mockCreateEntity(): Promise<{ data: Entity; log: ApiLog }> {
  const start = Date.now();
  await randomDelay();
  const duration = Date.now() - start;

  const requestBody = {
    type: 'individual',
    individual: {
      first_name: 'Alex',
      last_name: 'Jordan',
      phone: '+14085551234',
      email: 'alex.jordan@gmail.com',
      dob: '1995-06-22',
    },
    address: {
      line1: '1234 Market St',
      city: 'San Francisco',
      state: 'CA',
      zip: '94103',
    },
  };

  const log = makeLog(
    0,
    'Create Entity',
    'POST',
    'https://dev.methodfi.com/entities',
    DEFAULT_HEADERS,
    requestBody,
    MOCK_ENTITY,
    duration,
    'Customer identity created in Method'
  );

  return { data: MOCK_ENTITY, log };
}

/** API 2: Connect Liabilities */
export async function mockConnectLiabilities(
  entityId: string
): Promise<{ data: ConnectResponse; log: ApiLog }> {
  const start = Date.now();
  await randomDelay();
  const duration = Date.now() - start;

  const data = { ...MOCK_CONNECT_RESPONSE, entity_id: entityId };

  const log = makeLog(
    1,
    'Connect Liabilities',
    'POST',
    `https://dev.methodfi.com/entities/${entityId}/connect`,
    DEFAULT_HEADERS,
    null,
    data,
    duration,
    'Financial accounts linked to entity'
  );

  return { data, log };
}

/** API 3: Get Accounts */
export async function mockGetAccounts(
  entityId: string
): Promise<{ data: Account[]; log: ApiLog }> {
  const start = Date.now();
  await randomDelay();
  const duration = Date.now() - start;

  const log = makeLog(
    2,
    'Retrieve Accounts',
    'GET',
    `https://dev.methodfi.com/accounts?holder_id=${entityId}`,
    { Authorization: `Bearer ${MASKED_KEY}`, 'Method-Version': '2024-07-04' },
    null,
    MOCK_ACCOUNTS,
    duration,
    'Payment-eligible accounts returned'
  );

  return { data: MOCK_ACCOUNTS, log };
}

/** API 4: Create Verification Session */
export async function mockCreateVerificationSession(
  entityId: string
): Promise<{ data: VerificationSession; log: ApiLog }> {
  const start = Date.now();
  await randomDelay();
  const duration = Date.now() - start;

  const data: VerificationSession = {
    id: `evf_${genId().slice(0, 13)}`,
    entity_id: entityId,
    status: 'pending',
    type: 'sms',
    sms: { phone: '+14085551234' },
    verified_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const requestBody = {
    type: 'sms',
  };

  const log = makeLog(
    3,
    'Create Verification Session',
    'POST',
    `https://dev.methodfi.com/entities/${entityId}/verification_sessions`,
    DEFAULT_HEADERS,
    requestBody,
    data,
    duration,
    'SMS verification session initiated'
  );

  return { data, log };
}

/** API 5: Update Verification Session (submit OTP code) */
export async function mockUpdateVerification(
  entityId: string,
  sessionId: string,
  smsCode: string
): Promise<{ data: VerificationSession; log: ApiLog }> {
  const start = Date.now();
  await randomDelay();
  const duration = Date.now() - start;

  const data: VerificationSession = {
    id: sessionId,
    entity_id: entityId,
    status: 'verified',
    type: 'sms',
    sms: { phone: '+14085551234' },
    verified_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const requestBody = { sms: { sms_code: smsCode } };

  const log = makeLog(
    4,
    'Verify Phone (OTP)',
    'PUT',
    `https://dev.methodfi.com/entities/${entityId}/verification_sessions/${sessionId}`,
    DEFAULT_HEADERS,
    requestBody,
    data,
    duration,
    'Phone number verified via OTP'
  );

  return { data, log };
}

/** API 6: Get Account Sensitive Data */
export async function mockGetAccountSensitive(
  accountId: string
): Promise<{ data: AccountSensitive; log: ApiLog }> {
  const start = Date.now();
  await randomDelay();
  const duration = Date.now() - start;

  const data: AccountSensitive = {
    id: `sns_${genId().slice(0, 12)}`,
    account_id: accountId,
    number: '4242424242424242',
    expiration: '12/27',
    cvv: '***',
    billing_address: {
      line1: '1234 Market St',
      city: 'San Francisco',
      state: 'CA',
      zip: '94103',
    },
  };

  const log = makeLog(
    5,
    'Get Sensitive Account Data',
    'GET',
    `https://dev.methodfi.com/accounts/${accountId}/sensitive`,
    { Authorization: `Bearer ${MASKED_KEY}`, 'Method-Version': '2024-07-04' },
    null,
    data,
    duration,
    'Card details retrieved for payment'
  );

  return { data, log };
}

/** API 7: Authorize Shopify Payment */
export async function mockAuthorizePayment(
  accountId: string,
  amountCents: number
): Promise<{ data: ShopifyPaymentToken; log: ApiLog }> {
  const start = Date.now();
  await randomDelay();
  const duration = Date.now() - start;

  const orderId = `GYM-${Math.floor(Math.random() * 90000) + 10000}`;

  const data: ShopifyPaymentToken = {
    id: `pay_${genId().slice(0, 12)}`,
    payment_token: `tok_${genId().slice(0, 20)}`,
    amount: amountCents,
    currency: 'USD',
    status: 'authorized',
    order_id: orderId,
    created_at: new Date().toISOString(),
  };

  const requestBody = {
    account_id: accountId,
    amount: amountCents,
    currency: 'USD',
    reference_id: orderId,
  };

  const log = makeLog(
    6,
    'Authorize Payment',
    'POST',
    'https://dev.methodfi.com/payments/authorize',
    DEFAULT_HEADERS,
    requestBody,
    data,
    duration,
    'Payment token sent to Shopify'
  );

  return { data, log };
}
