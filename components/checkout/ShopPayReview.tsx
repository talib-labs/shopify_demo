'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDemoStore } from '@/store/demoStore';
import {
  mockCreateVerificationSession,
  mockUpdateVerification,
  mockGetAccountSensitive,
  mockAuthorizePayment,
} from '@/lib/mock-api';
import { CART_TOTAL } from './OrderSummary';
import { Account } from '@/types';

type Phase = 'select' | 'loading_details' | 'cvv' | 'placing' | 'confirmed';

function fmt(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function cardIcon(type: string) {
  if (type === 'credit_card') return '💳';
  return '🏦';
}

function CardBrand(name: string) {
  if (name.toLowerCase().includes('chase')) return 'Chase';
  if (name.toLowerCase().includes('amex')) return 'Amex';
  if (name.toLowerCase().includes('apple')) return 'Apple';
  return name.split(' ')[0];
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
  const interestDisplay =
    account.interest_rate_min !== undefined
      ? `${account.interest_rate_min}% – ${account.interest_rate_max}% APR`
      : `${account.interest_rate}% APR`;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
        selected
          ? 'border-[#5A31F4] bg-[#5A31F4]/5'
          : 'border-gray-200 hover:border-gray-300 bg-white'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center flex-shrink-0 transition-all ${
          selected ? 'border-[#5A31F4]' : 'border-gray-300'
        }`}>
          {selected && <div className="w-2.5 h-2.5 rounded-full bg-[#5A31F4]" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-base">{cardIcon(account.liability.type)}</span>
            <span className="text-sm font-semibold text-gray-800">{account.liability.name}</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-gray-500">•••• {account.liability.mask}</span>
            <span className="text-xs text-gray-400">|</span>
            <span className="text-xs text-gray-500">{interestDisplay}</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-gray-500">Balance</p>
          <p className="text-sm font-semibold text-gray-800">{fmt(account.balance)}</p>
        </div>
      </div>
    </button>
  );
}

export default function ShopPayReview() {
  const {
    accounts,
    selectedAccount,
    setSelectedAccount,
    setVerificationSession,
    setSensitiveData,
    setPaymentToken,
    addApiLog,
    setScreen,
  } = useDemoStore();

  const [phase, setPhase] = useState<Phase>('select');
  const [cvv, setCvv] = useState('');
  const [orderId, setOrderId] = useState('');

  const handleSelectAndContinue = async () => {
    if (!selectedAccount) return;
    setPhase('loading_details');

    // Fire APIs 4 + 5
    const { data: session, log: sessionLog } = await mockCreateVerificationSession(
      selectedAccount.holder_id
    );
    setVerificationSession(session);
    addApiLog(sessionLog);

    const { data: verified, log: verifyLog } = await mockUpdateVerification(
      selectedAccount.holder_id,
      session.id,
      '847293'
    );
    setVerificationSession(verified);
    addApiLog(verifyLog);

    setPhase('cvv');
  };

  const handleCvvSubmit = async () => {
    if (!selectedAccount || cvv.length < 3) return;
    setPhase('placing');

    // API 6: sensitive data
    const { data: sensitive, log: sensitiveLog } = await mockGetAccountSensitive(
      selectedAccount.id
    );
    setSensitiveData(sensitive);
    addApiLog(sensitiveLog);

    // API 7: authorize payment
    const { data: token, log: paymentLog } = await mockAuthorizePayment(
      selectedAccount.id,
      CART_TOTAL
    );
    setPaymentToken(token);
    addApiLog(paymentLog);
    setOrderId(token.order_id);

    setPhase('confirmed');
  };

  // Screen 2: Account selection
  if (phase === 'select') {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="max-w-lg mx-auto px-6 py-8 w-full"
      >
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => setScreen(1)} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <h2 className="text-base font-semibold text-gray-800">Select payment method</h2>
        </div>

        {/* Method info banner */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#5A31F4]/5 border border-[#5A31F4]/20 mb-4">
          <img
            src="https://avatars.githubusercontent.com/u/66761576?s=32&v=4"
            className="w-4 h-4 rounded mt-0.5 flex-shrink-0"
            alt="Method"
          />
          <p className="text-xs text-[#5A31F4]">
            <span className="font-semibold">Method detected {accounts.length} linked accounts.</span>{' '}
            Select a card to pay with existing credit — no card number entry required.
          </p>
        </div>

        <div className="space-y-2.5 mb-6">
          {accounts.map((acc) => (
            <AccountCard
              key={acc.id}
              account={acc}
              selected={selectedAccount?.id === acc.id}
              onClick={() => setSelectedAccount(acc)}
            />
          ))}
        </div>

        <button
          onClick={handleSelectAndContinue}
          disabled={!selectedAccount}
          className="w-full h-11 rounded-lg bg-[#5A31F4] hover:bg-[#4a28d4] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors"
        >
          Continue
        </button>
      </motion.div>
    );
  }

  // Screen 3: Loading account details
  if (phase === 'loading_details') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-lg mx-auto px-6 py-8 w-full flex flex-col items-center justify-center min-h-[300px] gap-4"
      >
        <svg className="animate-spin w-8 h-8 text-[#5A31F4]" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">Verifying account access...</p>
          <p className="text-xs text-gray-400 mt-1">Calling Method verification APIs</p>
        </div>
      </motion.div>
    );
  }

  // Screen 4: CVV entry
  if (phase === 'cvv' && selectedAccount) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="max-w-lg mx-auto px-6 py-8 w-full"
      >
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => setPhase('select')} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <h2 className="text-base font-semibold text-gray-800">Confirm payment</h2>
        </div>

        {/* Selected card summary */}
        <div className="border border-gray-200 rounded-xl p-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-7 rounded bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
              <span className="text-white text-xs font-bold">{CardBrand(selectedAccount.liability.name).slice(0, 2).toUpperCase()}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{selectedAccount.liability.name}</p>
              <p className="text-xs text-gray-500">•••• {selectedAccount.liability.mask}</p>
            </div>
            <button onClick={() => setPhase('select')} className="ml-auto text-xs text-[#5A31F4] hover:underline">Change</button>
          </div>
        </div>

        {/* Account details from Method */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Balance', value: fmt(selectedAccount.balance) },
            { label: 'Credit Limit', value: fmt(selectedAccount.credit_limit ?? 0) },
            { label: 'Min Payment', value: fmt(selectedAccount.next_payment_minimum_amount ?? 0) },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-[10px] text-gray-500 uppercase tracking-wide">{label}</p>
              <p className="text-sm font-semibold text-gray-800 mt-0.5">{value}</p>
            </div>
          ))}
        </div>

        {/* CVV entry */}
        <div className="mb-5">
          <label className="text-xs text-gray-500 block mb-1.5">Security code (CVV)</label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              maxLength={4}
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
              placeholder="•••"
              className="w-24 text-center text-sm border border-gray-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-[#5A31F4] focus:ring-1 focus:ring-[#5A31F4]/20 tracking-widest font-mono"
            />
            <span className="text-xs text-gray-500">3-digit code on back of card</span>
          </div>
        </div>

        {/* Order total */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-5">
          <span className="text-sm text-gray-600">Total charged</span>
          <span className="text-base font-bold text-gray-900">{fmt(CART_TOTAL)}</span>
        </div>

        <button
          onClick={handleCvvSubmit}
          disabled={cvv.length < 3}
          className="w-full h-11 rounded-lg bg-[#5A31F4] hover:bg-[#4a28d4] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors"
        >
          Place order · {fmt(CART_TOTAL)}
        </button>

        <p className="text-center text-[11px] text-gray-400 mt-3">
          Method retrieves sensitive card data via API — no manual entry needed in production
        </p>
      </motion.div>
    );
  }

  // Placing order
  if (phase === 'placing') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-lg mx-auto px-6 py-8 w-full flex flex-col items-center justify-center min-h-[300px] gap-4"
      >
        <svg className="animate-spin w-8 h-8 text-[#5A31F4]" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">Authorizing payment...</p>
          <p className="text-xs text-gray-400 mt-1">Sending payment token to Shopify</p>
        </div>
      </motion.div>
    );
  }

  // Screen 5: Order confirmed
  if (phase === 'confirmed') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto px-6 py-8 w-full"
      >
        {/* Success header */}
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
          <p className="text-sm text-gray-500">Thank you for your purchase, Alex.</p>
        </div>

        {/* Order details */}
        <div className="space-y-3 mb-6">
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex justify-between text-sm mb-3">
              <span className="text-gray-500">Order number</span>
              <span className="font-mono font-semibold text-gray-800">{orderId}</span>
            </div>
            <div className="flex justify-between text-sm mb-3">
              <span className="text-gray-500">Paid with</span>
              <span className="font-semibold text-gray-800">
                {selectedAccount?.liability.name} ····{selectedAccount?.liability.mask}
              </span>
            </div>
            <div className="flex justify-between text-sm mb-3">
              <span className="text-gray-500">Total charged</span>
              <span className="font-semibold text-gray-800">{fmt(CART_TOTAL)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Estimated delivery</span>
              <span className="font-semibold text-gray-800">4–7 business days</span>
            </div>
          </div>

          {/* Method attribution */}
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-200">
            <img
              src="https://avatars.githubusercontent.com/u/66761576?s=32&v=4"
              className="w-5 h-5 rounded"
              alt="Method"
            />
            <div>
              <p className="text-xs font-semibold text-gray-700">Powered by Method Financial</p>
              <p className="text-[11px] text-gray-500">7 API calls · Card retrieved without manual entry</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setScreen(0)}
          className="w-full h-11 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Continue shopping
        </button>
      </motion.div>
    );
  }

  return null;
}
