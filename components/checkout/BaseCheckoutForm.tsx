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

type OtpPhase = 'idle' | 'otp' | 'api1' | 'api2' | 'api3' | 'done';

function ShopPayPopup({ onSuccess }: { onSuccess: () => void }) {
  const { setEntity, setAccounts, addApiLog, setLoading } = useDemoStore();
  const [phase, setPhase] = useState<OtpPhase>('idle');
  const [otpDigits, setOtpDigits] = useState<string[]>([]);
  const [apiStatus, setApiStatus] = useState({ entity: false, connect: false, accounts: false });

  // Start OTP auto-fill on mount
  useEffect(() => {
    const t = setTimeout(() => setPhase('otp'), 400);
    return () => clearTimeout(t);
  }, []);

  // OTP digit-by-digit fill
  useEffect(() => {
    if (phase !== 'otp') return;
    const digits = OTP_CODE.split('');
    let i = 0;
    const iv = setInterval(() => {
      if (i < digits.length) {
        setOtpDigits((prev) => [...prev, digits[i]]);
        i++;
      } else {
        clearInterval(iv);
        setTimeout(() => setPhase('api1'), 350);
      }
    }, 270);
    return () => clearInterval(iv);
  }, [phase]);

  // Fire API calls after OTP fills
  useEffect(() => {
    if (phase !== 'api1') return;
    const run = async () => {
      setLoading(true);

      const { data: entity, log: l1 } = await mockCreateEntity();
      setEntity(entity);
      addApiLog(l1);
      setApiStatus((s) => ({ ...s, entity: true }));

      setPhase('api2');
      const { log: l2 } = await mockConnectLiabilities(entity.id);
      addApiLog(l2);
      setApiStatus((s) => ({ ...s, connect: true }));

      setPhase('api3');
      const { data: accounts, log: l3 } = await mockGetAccounts(entity.id);
      setAccounts(accounts);
      addApiLog(l3);
      setApiStatus((s) => ({ ...s, accounts: true }));

      setLoading(false);
      setPhase('done');
    };
    run();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const apiSteps = [
    { key: 'entity',   label: 'Create Entity',       done: apiStatus.entity,   active: phase === 'api1' },
    { key: 'connect',  label: 'Connect Liabilities',  done: apiStatus.connect,  active: phase === 'api2' },
    { key: 'accounts', label: 'Retrieve Accounts',    done: apiStatus.accounts, active: phase === 'api3' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ duration: 0.18 }}
      className="mt-2 rounded-xl border border-[#5A31F4]/30 bg-white shadow-lg shadow-[#5A31F4]/10 overflow-hidden"
    >
      {/* Purple top bar */}
      <div className="bg-[#5A31F4] px-4 py-2.5 flex items-center gap-2">
        <div className="w-5 h-5 bg-white/20 rounded-md flex items-center justify-center flex-shrink-0">
          <span className="text-white text-[9px] font-black">Pay</span>
        </div>
        <span className="text-white text-xs font-semibold">Shop Pay — Verify your identity</span>
      </div>

      <div className="px-4 py-3.5">
        {/* Phone line */}
        <p className="text-xs text-gray-500 mb-3">
          Sending code to <span className="font-semibold text-gray-700">+1 (408) 555-1234</span>
        </p>

        {/* OTP boxes */}
        <div className="flex gap-1.5 mb-3.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-10 rounded-md border-2 flex items-center justify-center text-sm font-bold transition-all duration-150 ${
                otpDigits[i]
                  ? 'border-[#5A31F4] bg-[#5A31F4]/5 text-gray-900'
                  : 'border-gray-200 text-transparent'
              }`}
            >
              {otpDigits[i] ?? '0'}
            </div>
          ))}
        </div>

        {/* API progress — shows after OTP fills */}
        <AnimatePresence>
          {phase !== 'idle' && phase !== 'otp' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="border-t border-gray-100 pt-3 mb-3"
            >
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Method API
              </p>
              <div className="space-y-1.5">
                {apiSteps.map((step) => (
                  <div key={step.key} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                      step.done ? 'bg-green-100' : step.active ? 'bg-[#5A31F4]/10' : 'bg-gray-100'
                    }`}>
                      {step.done ? (
                        <svg className="w-2.5 h-2.5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      ) : step.active ? (
                        <svg className="animate-spin w-2.5 h-2.5 text-[#5A31F4]" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                      ) : (
                        <div className="w-1 h-1 rounded-full bg-gray-300" />
                      )}
                    </div>
                    <span className={`text-xs transition-colors ${
                      step.done ? 'text-gray-600' : step.active ? 'text-gray-800 font-medium' : 'text-gray-400'
                    }`}>
                      {step.label}
                    </span>
                    {step.done && (
                      <span className="ml-auto text-[10px] text-green-600 font-medium">✓</span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Continue button — appears when done */}
        <AnimatePresence>
          {phase === 'done' && (
            <motion.button
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={onSuccess}
              className="w-full h-9 rounded-lg bg-[#5A31F4] hover:bg-[#4a28d4] active:bg-[#3a20c0] text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Continue to payment →
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function BaseCheckoutForm() {
  const setScreen = useDemoStore((s) => s.setScreen);

  const [email, setEmail] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const triggerPopup = () => {
    if (email.trim().includes('@')) {
      setShowPopup(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-8 py-7 w-full"
    >
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <span className="hover:text-gray-600 cursor-pointer">Cart</span>
        <span className="text-gray-300">›</span>
        <span className="text-gray-700 font-medium">Information</span>
        <span className="text-gray-300">›</span>
        <span>Shipping</span>
        <span className="text-gray-300">›</span>
        <span>Payment</span>
      </nav>

      {/* Contact */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900">Contact</h2>
          <a className="text-xs text-blue-600 hover:underline cursor-pointer">Log in</a>
        </div>

        {/* Email + inline OTP popup */}
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={triggerPopup}
            onKeyDown={(e) => { if (e.key === 'Enter') triggerPopup(); }}
            className="w-full text-sm border border-gray-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500/20 bg-white"
            placeholder="Email"
          />

          <AnimatePresence>
            {showPopup && (
              <ShopPayPopup onSuccess={() => setScreen(2)} />
            )}
          </AnimatePresence>
        </div>

        <label className="flex items-center gap-2 mt-2.5 cursor-pointer">
          <input type="checkbox" defaultChecked className="rounded" />
          <span className="text-xs text-gray-500">Email me with news and offers</span>
        </label>
      </section>

      {/* Delivery — dimmed while popup is active */}
      <div className={`transition-opacity duration-300 ${showPopup ? 'opacity-30 pointer-events-none select-none' : ''}`}>
        <section className="mb-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Delivery</h2>
          <div className="space-y-2.5">
            <select className="w-full text-sm border border-gray-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-gray-500 bg-white text-gray-700">
              <option>United States</option>
              <option>Canada</option>
              <option>United Kingdom</option>
            </select>
            <div className="grid grid-cols-2 gap-2.5">
              <input type="text" placeholder="First name"
                className="text-sm border border-gray-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-gray-500 bg-white" />
              <input type="text" placeholder="Last name"
                className="text-sm border border-gray-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-gray-500 bg-white" />
            </div>
            <input type="text" placeholder="Address"
              className="w-full text-sm border border-gray-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-gray-500 bg-white" />
            <input type="text" placeholder="Apartment, suite, etc. (optional)"
              className="w-full text-sm border border-gray-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-gray-500 bg-white text-gray-500" />
            <div className="grid grid-cols-3 gap-2.5">
              <input type="text" placeholder="City"
                className="text-sm border border-gray-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-gray-500 bg-white" />
              <select className="text-sm border border-gray-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-gray-500 bg-white text-gray-500">
                <option value="">State</option>
                <option>CA</option><option>NY</option><option>TX</option><option>FL</option><option>WA</option>
              </select>
              <input type="text" placeholder="ZIP code"
                className="text-sm border border-gray-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-gray-500 bg-white" />
            </div>
            <input type="tel" placeholder="Phone (optional)"
              className="w-full text-sm border border-gray-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-gray-500 bg-white" />
          </div>
        </section>

        <section className="mb-7">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Shipping method</h2>
          <div className="border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between text-sm text-gray-500 italic">
            Enter address above to see shipping options
          </div>
        </section>

        <button
          disabled
          className="w-full h-[52px] rounded-lg bg-gray-200 text-gray-400 font-bold text-sm cursor-not-allowed"
        >
          Continue to payment
        </button>
        <p className="text-center text-xs text-gray-400 mt-2">
          Enter your email above to continue with Shop Pay
        </p>
      </div>
    </motion.div>
  );
}
