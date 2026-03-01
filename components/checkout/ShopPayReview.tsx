'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDemoStore } from '@/store/demoStore';
import {
  mockCreateNetworkVerificationSession,
  mockUpdateNetworkVerification,
  mockGetAccountSensitive,
  mockShopifyTokenize,
} from '@/lib/mock-api';
import { CART_TOTAL } from './OrderSummary';
import { Account } from '@/types';

type Phase = 'select' | 'loading_details' | 'cvv' | 'placing' | 'confirmed';

function fmt(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

// Card brand images keyed by mch_id
const CARD_IMAGES: Record<string, string> = {
  mch_200145: 'https://static.methodfi.com/card_brands/1b7ccaba6535cb837f802d968add4700.png', // Chase Sapphire Reserve
  mch_302686: 'https://static.methodfi.com/card_brands/e0cf0b8789a683d5ca457ea21e634b6b.png', // Capital One Platinum
  mch_189981: 'https://static.methodfi.com/card_brands/ea2fdc4a7ace226fae9bcc5d321a884f.png', // Bank of America Rewards
};

function getBrandColor(name: string): string {
  if (name.toLowerCase().includes('chase')) return '#117ACA';
  if (name.toLowerCase().includes('capital one')) return '#D03027';
  if (name.toLowerCase().includes('bank of america')) return '#E31837';
  return '#1a1a1a';
}

function getBrandInitials(name: string): string {
  if (name.toLowerCase().includes('chase')) return 'CH';
  if (name.toLowerCase().includes('capital one')) return 'C1';
  if (name.toLowerCase().includes('bank of america')) return 'BA';
  return name.slice(0, 2).toUpperCase();
}

function CardThumb({
  mchId,
  name,
  size = 'sm',
}: {
  mchId: string;
  name: string;
  size?: 'sm' | 'md';
}) {
  const imgUrl = CARD_IMAGES[mchId];
  const sizeClass = size === 'sm' ? 'w-10 h-7' : 'w-12 h-8';
  const textSize = size === 'sm' ? 'text-[9px]' : 'text-[10px]';

  if (imgUrl) {
    return (
      <img
        src={imgUrl}
        alt={name}
        className={`${sizeClass} rounded-md object-cover flex-shrink-0`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-md flex items-center justify-center flex-shrink-0`}
      style={{ backgroundColor: getBrandColor(name) }}
    >
      <span className={`${textSize} font-bold text-white`}>{getBrandInitials(name)}</span>
    </div>
  );
}

function AccountCard({
  account,
  selected,
  onClick,
}: {
  account: Account;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left border-2 rounded-xl p-4 transition-all cursor-pointer ${
        selected ? 'border-gray-900 bg-gray-900/3' : 'border-gray-200 hover:border-gray-400 bg-white'
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Radio */}
        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
          selected ? 'border-gray-900' : 'border-gray-300'
        }`}>
          {selected && <div className="w-2 h-2 rounded-full bg-gray-900" />}
        </div>

        {/* Card image */}
        <CardThumb mchId={account.liability.mch_id} name={account.liability.name} size="sm" />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 leading-tight">{account.liability.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">···· {account.liability.mask}</p>
        </div>
      </div>
    </button>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
  );
}

export default function ShopPayReview() {
  const {
    entity,
    accounts,
    selectedAccount,
    setSelectedAccount,
    verificationSession,
    setVerificationSession,
    setSensitiveData,
    setPaymentToken,
    addApiLog,
    setScreen,
  } = useDemoStore();

  const [phase, setPhase] = useState<Phase>('select');
  const [cvv, setCvv] = useState('');
  const [orderId, setOrderId] = useState('');

  const handleContinueToPayment = async () => {
    if (!selectedAccount) return;
    setPhase('loading_details');

    const { data: session, log: sessionLog } = await mockCreateNetworkVerificationSession(
      selectedAccount.id
    );
    setVerificationSession(session);
    addApiLog(sessionLog);

    setPhase('cvv');
  };

  const handlePlaceOrder = async () => {
    if (!selectedAccount || cvv.length < 3 || !verificationSession) return;
    setPhase('placing');

    const { data: verified, log: verifyLog } = await mockUpdateNetworkVerification(
      selectedAccount.id,
      verificationSession.id,
      cvv
    );
    setVerificationSession(verified);
    addApiLog(verifyLog);

    const { data: sensitive, log: sensitiveLog } = await mockGetAccountSensitive(selectedAccount.id);
    setSensitiveData(sensitive);
    addApiLog(sensitiveLog);

    const { data: token, log: paymentLog } = await mockShopifyTokenize(
      sensitive.number,
      sensitive.expiration ?? '12/27',
      cvv,
      CART_TOTAL
    );
    setPaymentToken(token);
    addApiLog(paymentLog);
    setOrderId(token.order_id);

    setPhase('confirmed');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="px-8 py-7 w-full min-h-full"
    >
      <AnimatePresence mode="wait">

        {/* ── Select payment ─────────────────────────────── */}
        {phase === 'select' && (
          <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex items-center gap-2 mb-5">
              <button onClick={() => setScreen(1)} className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              <h2 className="text-base font-bold text-gray-900">Select payment method</h2>
            </div>

            {/* Method banner */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-violet-50 border border-violet-200 mb-5">
              <img
                src="https://avatars.githubusercontent.com/u/66761576?s=32&v=4"
                className="w-4 h-4 rounded mt-0.5 flex-shrink-0"
                alt="Method"
              />
              <p className="text-xs text-violet-700">
                <span className="font-semibold">Method found {accounts.length} cards that can be linked.</span>{' '}
                Pay with an existing card — no number entry needed.
              </p>
            </div>

            <div className="space-y-2.5 mb-4">
              {accounts.map((acc) => (
                <AccountCard
                  key={acc.id}
                  account={acc}
                  selected={selectedAccount?.id === acc.id}
                  onClick={() => setSelectedAccount(acc)}
                />
              ))}
            </div>

            {/* Shipping address */}
            {entity?.address && (
              <div className="border border-gray-200 rounded-xl p-4 mb-5">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Ship to</p>
                <div className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">
                      {entity.individual?.first_name} {entity.individual?.last_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{entity.address.line1}</p>
                    <p className="text-xs text-gray-500">{entity.address.city}, {entity.address.state} {entity.address.zip}</p>
                    <button className="text-xs text-blue-600 hover:underline mt-1.5 cursor-pointer">
                      Edit shipping address
                    </button>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleContinueToPayment}
              disabled={!selectedAccount}
              className="w-full h-[50px] rounded-lg bg-gray-900 hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm transition-colors cursor-pointer"
            >
              Continue
            </button>
          </motion.div>
        )}

        {/* ── Loading ────────────────────────────────────── */}
        {phase === 'loading_details' && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 gap-4">
            <Spinner />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">Verifying account access</p>
              <p className="text-xs text-gray-400 mt-1">Calling Method verification APIs...</p>
            </div>
          </motion.div>
        )}

        {/* ── CVV entry ─────────────────────────────────── */}
        {phase === 'cvv' && selectedAccount && (
          <motion.div key="cvv" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex items-center gap-2 mb-5">
              <button onClick={() => setPhase('select')} className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              <h2 className="text-base font-bold text-gray-900">Confirm payment</h2>
            </div>

            {/* Selected card */}
            <div className="border border-gray-200 rounded-xl p-4 mb-5 flex items-center gap-3">
              <CardThumb mchId={selectedAccount.liability.mch_id} name={selectedAccount.liability.name} size="md" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{selectedAccount.liability.name}</p>
                <p className="text-xs text-gray-400">···· {selectedAccount.liability.mask}</p>
              </div>
              <button onClick={() => setPhase('select')} className="text-xs text-blue-600 hover:underline cursor-pointer">
                Change
              </button>
            </div>

            {/* CVV */}
            <div className="mb-5">
              <label className="text-xs font-medium text-gray-600 block mb-1.5">
                Security code (CVV)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                  placeholder="•••"
                  className="w-24 text-center text-sm border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-gray-700 tracking-widest font-mono"
                />
                <span className="text-xs text-gray-400">3–4 digit code on back of card</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg mb-5">
              <span className="text-sm text-gray-600">Total to charge</span>
              <span className="text-base font-bold text-gray-900">{fmt(CART_TOTAL)}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={cvv.length < 3}
              className="w-full h-[50px] rounded-lg bg-gray-900 hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm transition-colors cursor-pointer"
            >
              Place order · {fmt(CART_TOTAL)}
            </button>

          </motion.div>
        )}

        {/* ── Placing ────────────────────────────────────── */}
        {phase === 'placing' && (
          <motion.div key="placing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 gap-4">
            <Spinner />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">Placing your order...</p>
              <p className="text-xs text-gray-400 mt-1">Authorizing payment token</p>
            </div>
          </motion.div>
        )}

        {/* ── Confirmed ─────────────────────────────────── */}
        {phase === 'confirmed' && (
          <motion.div key="confirmed" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4"
              >
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </motion.div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Order confirmed!</h2>
              <p className="text-sm text-gray-500">Thanks for your order, Alex. It&apos;s on its way.</p>
            </div>

            <div className="border border-gray-200 rounded-xl p-5 mb-5 space-y-3">
              {[
                { label: 'Order number', value: orderId },
                { label: 'Paid with', value: `${selectedAccount?.liability.name} ···· ${selectedAccount?.liability.mask}` },
                { label: 'Total', value: fmt(CART_TOTAL) },
                { label: 'Estimated delivery', value: '4–7 business days' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-semibold text-gray-800">{value}</span>
                </div>
              ))}
            </div>

            {/* Method attribution */}
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-200 mb-5">
              <img
                src="https://avatars.githubusercontent.com/u/66761576?s=32&v=4"
                className="w-5 h-5 rounded flex-shrink-0"
                alt="Method"
              />
              <div>
                <p className="text-xs font-semibold text-gray-700">Powered by Method Financial</p>
                <p className="text-[11px] text-gray-400">6 Method API calls · 1 Shopify tokenization</p>
              </div>
            </div>

            <button
              onClick={() => {
                useDemoStore.getState().reset();
              }}
              className="w-full h-[50px] rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Continue shopping
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
}
