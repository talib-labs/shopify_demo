'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDemoStore } from '@/store/demoStore';
import {
  mockCreateEntity,
  mockConnectLiabilities,
  mockGetAccounts,
} from '@/lib/mock-api';

const OTP_CODE = '847293';

type Phase =
  | 'phone'      // show phone, send code button
  | 'otp'        // OTP digits auto-filling
  | 'verifying'  // spinner after OTP complete
  | 'api1'       // entity call
  | 'api2'       // connect call
  | 'api3'       // accounts call
  | 'done';      // ready to continue

export default function ShopPayModal() {
  const { setScreen, setEntity, setAccounts, addApiLog, setLoading } = useDemoStore();
  const [phase, setPhase] = useState<Phase>('phone');
  const [otpDigits, setOtpDigits] = useState<string[]>([]);
  const [apiStatus, setApiStatus] = useState({ entity: false, connect: false, accounts: false });

  // Orchestrate the auto-fill flow
  useEffect(() => {
    if (phase !== 'otp') return;

    const digits = OTP_CODE.split('');
    let i = 0;
    const interval = setInterval(() => {
      if (i < digits.length) {
        setOtpDigits((prev) => [...prev, digits[i]]);
        i++;
      } else {
        clearInterval(interval);
        // Brief pause, then move to verifying
        setTimeout(() => setPhase('verifying'), 400);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [phase]);

  // Fire API calls after verifying
  useEffect(() => {
    if (phase !== 'verifying') return;

    const run = async () => {
      // Small delay before starting API calls
      await new Promise((r) => setTimeout(r, 600));

      setPhase('api1');
      setLoading(true);
      const { data: entity, log: entityLog } = await mockCreateEntity();
      setEntity(entity);
      addApiLog(entityLog);
      setApiStatus((s) => ({ ...s, entity: true }));

      setPhase('api2');
      const { log: connectLog } = await mockConnectLiabilities(entity.id);
      addApiLog(connectLog);
      setApiStatus((s) => ({ ...s, connect: true }));

      setPhase('api3');
      const { data: accounts, log: accountsLog } = await mockGetAccounts(entity.id);
      setAccounts(accounts);
      addApiLog(accountsLog);
      setApiStatus((s) => ({ ...s, accounts: true }));

      setLoading(false);
      setPhase('done');
    };

    run();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const apiSteps = [
    { key: 'entity', label: 'Create Entity', done: apiStatus.entity, active: phase === 'api1' },
    { key: 'connect', label: 'Connect Liabilities', done: apiStatus.connect, active: phase === 'api2' },
    { key: 'accounts', label: 'Retrieve Accounts', done: apiStatus.accounts, active: phase === 'api3' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="max-w-lg mx-auto px-6 py-8 w-full"
    >
      {/* Shop Pay header */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-full bg-[#5A31F4] flex items-center justify-center">
          <svg width="16" height="10" viewBox="0 0 40 16" fill="white">
            <text x="20" y="12" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Pay</text>
          </svg>
        </div>
        <span className="text-xl font-bold text-gray-900">Shop Pay</span>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'phone' && (
          <motion.div key="phone" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <p className="text-center text-sm text-gray-600 mb-6">
              We&apos;ll send a verification code to confirm your identity.
            </p>
            <div className="mb-4">
              <label className="text-xs text-gray-500 block mb-1.5">Mobile number</label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3.5 py-2.5 bg-gray-50">
                <span className="text-sm text-gray-400 mr-2">🇺🇸 +1</span>
                <span className="text-sm text-gray-800 font-medium">(408) 555-1234</span>
                <svg className="w-4 h-4 text-gray-400 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
            <button
              onClick={() => setPhase('otp')}
              className="w-full h-11 rounded-lg bg-[#5A31F4] hover:bg-[#4a28d4] text-white font-semibold text-sm transition-colors"
            >
              Send code
            </button>
            <button
              onClick={() => setScreen(0)}
              className="w-full mt-2 text-sm text-gray-500 hover:text-gray-700 py-2 transition-colors"
            >
              ← Back to checkout
            </button>
          </motion.div>
        )}

        {(phase === 'otp' || phase === 'verifying') && (
          <motion.div key="otp" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <p className="text-center text-sm text-gray-600 mb-2">
              Enter the code sent to <span className="font-semibold">+1 (408) 555-1234</span>
            </p>
            <p className="text-center text-xs text-gray-400 mb-6">Code auto-filling...</p>

            {/* OTP Boxes */}
            <div className="flex gap-2.5 justify-center mb-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-12 h-14 rounded-lg border-2 flex items-center justify-center text-2xl font-bold transition-all duration-200 ${
                    otpDigits[i]
                      ? 'border-[#5A31F4] bg-[#5A31F4]/5 text-gray-900'
                      : 'border-gray-200 text-transparent'
                  }`}
                >
                  {otpDigits[i] ?? '0'}
                </div>
              ))}
            </div>

            {phase === 'verifying' && (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <svg className="animate-spin w-4 h-4 text-[#5A31F4]" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Verifying...
              </div>
            )}
          </motion.div>
        )}

        {(phase === 'api1' || phase === 'api2' || phase === 'api3' || phase === 'done') && (
          <motion.div key="apis" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            {/* Verified badge */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-700">Identity verified</span>
            </div>

            {/* API call progress */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Method API — connecting accounts</p>
              <div className="space-y-2.5">
                {apiSteps.map((step) => (
                  <div key={step.key} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      step.done
                        ? 'bg-green-100'
                        : step.active
                        ? 'bg-[#5A31F4]/10'
                        : 'bg-gray-100'
                    }`}>
                      {step.done ? (
                        <svg className="w-3 h-3 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      ) : step.active ? (
                        <svg className="animate-spin w-3 h-3 text-[#5A31F4]" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                      )}
                    </div>
                    <span className={`text-sm transition-colors ${
                      step.done ? 'text-gray-700' : step.active ? 'text-gray-800 font-medium' : 'text-gray-400'
                    }`}>
                      {step.label}
                    </span>
                    {step.done && (
                      <span className="ml-auto text-xs text-green-600 font-medium">✓</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Continue button */}
            <AnimatePresence>
              {phase === 'done' && (
                <motion.button
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setScreen(2)}
                  className="w-full h-11 rounded-lg bg-[#5A31F4] hover:bg-[#4a28d4] text-white font-semibold text-sm transition-colors"
                >
                  Continue to payment →
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
