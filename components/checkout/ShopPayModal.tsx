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
  | 'phone'
  | 'otp'
  | 'verifying'
  | 'api1'
  | 'api2'
  | 'api3'
  | 'done';

export default function ShopPayModal() {
  const { setScreen, setEntity, setAccounts, addApiLog, setLoading } = useDemoStore();
  const [phase, setPhase] = useState<Phase>('phone');
  const [otpDigits, setOtpDigits] = useState<string[]>([]);
  const [apiStatus, setApiStatus] = useState({ entity: false, connect: false, accounts: false });

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
        setTimeout(() => setPhase('verifying'), 400);
      }
    }, 280);
    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'verifying') return;
    const run = async () => {
      await new Promise((r) => setTimeout(r, 500));
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="px-8 py-7 w-full"
    >
      {/* Shop Pay header */}
      <div className="flex items-center gap-2.5 mb-7">
        <div className="w-9 h-9 rounded-xl bg-[#5A31F4] flex items-center justify-center flex-shrink-0">
          <svg width="18" height="11" viewBox="0 0 60 28" fill="none">
            <rect x="1" y="1" width="58" height="26" rx="8" fill="white" fillOpacity="0.25"/>
            <text x="30" y="19" textAnchor="middle" fill="white" fontSize="12" fontWeight="800">Pay</text>
          </svg>
        </div>
        <div>
          <p className="text-base font-bold text-gray-900">Shop Pay</p>
          <p className="text-xs text-gray-400">Fast, secure checkout</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Phase: phone */}
        {phase === 'phone' && (
          <motion.div key="phone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="text-sm text-gray-500 mb-5">
              We&apos;ll send a 6-digit code to verify your identity.
            </p>

            <div className="mb-5">
              <label className="text-xs font-medium text-gray-600 block mb-1.5">Mobile number</label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3.5 py-2.5 bg-gray-50 gap-2">
                <span className="text-sm text-gray-400">🇺🇸 +1</span>
                <span className="text-sm text-gray-800 font-medium">(408) 555-1234</span>
                <svg className="w-4 h-4 text-green-500 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>

            <button
              onClick={() => setPhase('otp')}
              className="w-full h-[50px] rounded-lg bg-[#5A31F4] hover:bg-[#4a28d4] active:bg-[#3a20c0] text-white font-bold text-sm transition-colors cursor-pointer"
            >
              Send code
            </button>
            <button
              onClick={() => setScreen(0)}
              className="w-full mt-3 text-xs text-gray-400 hover:text-gray-600 py-2 transition-colors cursor-pointer"
            >
              ← Back to checkout
            </button>
          </motion.div>
        )}

        {/* Phase: OTP / verifying */}
        {(phase === 'otp' || phase === 'verifying') && (
          <motion.div key="otp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="text-sm text-gray-600 mb-1.5">
              Enter the code sent to <span className="font-semibold">+1 (408) 555-1234</span>
            </p>
            <p className="text-xs text-gray-400 mb-5">Code auto-filling...</p>

            <div className="flex gap-2.5 mb-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-14 rounded-lg border-2 flex items-center justify-center text-xl font-bold transition-all duration-150 ${
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
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <svg className="animate-spin w-4 h-4 text-[#5A31F4]" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Verifying your identity...
              </div>
            )}
          </motion.div>
        )}

        {/* Phase: API calls */}
        {(phase === 'api1' || phase === 'api2' || phase === 'api3' || phase === 'done') && (
          <motion.div key="apis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Verified badge */}
            <div className="flex items-center gap-2.5 mb-6 p-3.5 bg-green-50 border border-green-200 rounded-xl">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-green-800">Identity verified</p>
                <p className="text-xs text-green-600">+1 (408) 555-1234 confirmed</p>
              </div>
            </div>

            {/* API progress */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Method Financial API — linking accounts
              </p>
              <div className="space-y-3">
                {apiSteps.map((step) => (
                  <div key={step.key} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      step.done ? 'bg-green-100' : step.active ? 'bg-[#5A31F4]/10' : 'bg-gray-100'
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
                    {step.done && <span className="ml-auto text-xs text-green-600 font-medium">200 OK</span>}
                  </div>
                ))}
              </div>
            </div>

            {phase === 'done' && (
              <motion.button
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setScreen(2)}
                className="w-full h-[50px] rounded-lg bg-[#5A31F4] hover:bg-[#4a28d4] active:bg-[#3a20c0] text-white font-bold text-sm transition-colors cursor-pointer"
              >
                Select payment method →
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
