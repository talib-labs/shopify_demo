'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDemoStore } from '@/store/demoStore';
import { mockCreateEntity, mockConnectLiabilities, mockGetAccounts } from '@/lib/mock-api';

// ─── Shop Badge Logo ──────────────────────────────────────────────────────────

function ShopBadge({ withBackground = true, className = '' }: { withBackground?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {withBackground && (
        <path d="M0.5 6C0.5 2.68629 3.18629 0 6.5 0H18.5C21.8137 0 24.5 2.68629 24.5 6V18C24.5 21.3137 21.8137 24 18.5 24H6.5C3.18629 24 0.5 21.3137 0.5 18V6Z" fill="#5433EB"/>
      )}
      <path fill="white" d="M4.88209 11.6146C4.07832 11.4403 3.72025 11.3721 3.72025 11.0624C3.72025 10.7712 3.96257 10.6261 4.44721 10.6261C4.87343 10.6261 5.18498 10.8123 5.41432 11.1772C5.43163 11.2053 5.46733 11.2151 5.49654 11.1999L6.40091 10.7431C6.43336 10.7268 6.44526 10.6857 6.42687 10.6543C6.05149 10.0036 5.35807 9.64746 4.44505 9.64746C3.24535 9.64746 2.5 10.2386 2.5 11.1783C2.5 12.1764 3.40762 12.4287 4.21246 12.603C5.01731 12.7773 5.37646 12.8455 5.37646 13.1551C5.37646 13.4647 5.11467 13.6109 4.59217 13.6109C4.10969 13.6109 3.75162 13.39 3.53527 12.9613C3.51904 12.9299 3.48118 12.9169 3.44981 12.9332L2.5476 13.3803C2.51623 13.3965 2.50325 13.4344 2.51947 13.4669C2.87754 14.1868 3.61207 14.5917 4.59325 14.5917C5.84271 14.5917 6.59779 14.0104 6.59779 13.0414C6.59779 12.0725 5.68585 11.791 4.88209 11.6167V11.6146Z"/>
      <path fill="white" d="M9.72847 9.64773C9.2157 9.64773 8.76244 9.82961 8.43682 10.1533C8.41627 10.1728 8.38273 10.1587 8.38273 10.1306V8.06387C8.38273 8.02815 8.3546 8 8.31891 8H7.18736C7.15166 8 7.12354 8.02815 7.12354 8.06387V14.4783C7.12354 14.5141 7.15166 14.5422 7.18736 14.5422H8.31891C8.3546 14.5422 8.38273 14.5141 8.38273 14.4783V11.6646C8.38273 11.1212 8.79922 10.7044 9.36066 10.7044C9.92211 10.7044 10.3289 11.1125 10.3289 11.6646V14.4783C10.3289 14.5141 10.357 14.5422 10.3927 14.5422H11.5242C11.5599 14.5422 11.5881 14.5141 11.5881 14.4783V11.6646C11.5881 10.4824 10.8135 9.64773 9.72847 9.64773Z"/>
      <path fill="white" d="M13.8837 9.46387C13.2693 9.46387 12.6938 9.65224 12.2805 9.92398C12.2524 9.94238 12.2427 9.98027 12.26 10.0095L12.7587 10.8615C12.7771 10.8918 12.816 10.9027 12.8463 10.8843C13.16 10.6948 13.5192 10.5963 13.8859 10.5984C14.8736 10.5984 15.5995 11.2956 15.5995 12.2169C15.5995 13.0018 15.0185 13.5832 14.2818 13.5832C13.6815 13.5832 13.265 13.2335 13.265 12.7398C13.265 12.4573 13.385 12.2256 13.6977 12.0621C13.7301 12.0448 13.742 12.0048 13.7226 11.9734L13.252 11.1766C13.2368 11.1506 13.2044 11.1387 13.1752 11.1495C12.5445 11.3833 12.1021 11.9463 12.1021 12.702C12.1021 13.8452 13.0118 14.6983 14.2808 14.6983C15.7628 14.6983 16.8284 13.6709 16.8284 12.1975C16.8284 10.6179 15.5886 9.46387 13.8837 9.46387Z"/>
      <path fill="white" d="M20.1387 9.6377C19.5664 9.6377 19.0548 9.84989 18.6815 10.2223C18.661 10.2429 18.6274 10.2277 18.6274 10.1996V9.75137C18.6274 9.71564 18.5993 9.6875 18.5636 9.6875H17.4613C17.4256 9.6875 17.3975 9.71564 17.3975 9.75137V16.1561C17.3975 16.1918 17.4256 16.22 17.4613 16.22H18.5928C18.6285 16.22 18.6567 16.1918 18.6567 16.1561V14.0558C18.6567 14.0277 18.6902 14.0136 18.7107 14.032C19.0829 14.3784 19.5751 14.5809 20.1387 14.5809C21.466 14.5809 22.5013 13.5059 22.5013 12.1093C22.5013 10.7127 21.465 9.6377 20.1387 9.6377ZM19.9245 13.4961C19.1694 13.4961 18.5972 12.8953 18.5972 12.1006C18.5972 11.306 19.1683 10.7051 19.9245 10.7051C20.6807 10.7051 21.2508 11.2963 21.2508 12.1006C21.2508 12.905 20.6882 13.4961 19.9234 13.4961H19.9245Z"/>
    </svg>
  );
}

// ─── OTP Modal ────────────────────────────────────────────────────────────────

const OTP_LENGTH = 6;
type OtpPhase = 'entry' | 'api1' | 'api2' | 'api3' | 'done';

function OtpModal({ email, onClose, onSuccess, pos }: { email: string; onClose: () => void; onSuccess: () => void; pos: { top: number; left: number } }) {
  const { setEntity, setAccounts, addApiLog, setLoading } = useDemoStore();
  const [phase, setPhase] = useState<OtpPhase>('entry');
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [apiStatus, setApiStatus] = useState({ entity: false, connect: false, accounts: false });
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setTimeout(() => inputRefs.current[0]?.focus(), 120);
  }, []);

  // Fire APIs when all digits filled
  useEffect(() => {
    if (phase !== 'entry') return;
    if (digits.every((d) => d !== '')) setPhase('api1');
  }, [digits, phase]);

  useEffect(() => {
    if (phase !== 'api1') return;
    const run = async () => {
      setLoading(true);
      const { data: entity, log: l1 } = await mockCreateEntity();
      setEntity(entity); addApiLog(l1);
      setApiStatus((s) => ({ ...s, entity: true }));

      setPhase('api2');
      const { log: l2 } = await mockConnectLiabilities(entity.id);
      addApiLog(l2);
      setApiStatus((s) => ({ ...s, connect: true }));

      setPhase('api3');
      const { data: accounts, log: l3 } = await mockGetAccounts(entity.id);
      setAccounts(accounts); addApiLog(l3);
      setApiStatus((s) => ({ ...s, accounts: true }));

      setLoading(false);
      setPhase('done');
    };
    run();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const handleChange = (i: number, val: string) => {
    const char = val.replace(/\D/g, '').slice(-1);
    const next = [...digits]; next[i] = char; setDigits(next);
    if (char && i < OTP_LENGTH - 1) inputRefs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) inputRefs.current[i - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((ch, idx) => { next[idx] = ch; });
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const apiSteps = [
    { key: 'entity',   label: 'Create Entity',      done: apiStatus.entity,   active: phase === 'api1' },
    { key: 'connect',  label: 'Connect Liabilities', done: apiStatus.connect,  active: phase === 'api2' },
    { key: 'accounts', label: 'Retrieve Accounts',   done: apiStatus.accounts, active: phase === 'api3' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -8, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -8, scale: 0.97 }}
      transition={{ duration: 0.18 }}
      style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 50 }}
      className="w-[420px]"
    >
      {/* Arrow pointing left toward email field */}
      <div className="absolute -left-[7px] top-4 w-3.5 h-3.5 bg-white rotate-45 border-l border-t border-gray-200 z-10" />

      {/* Bubble */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-7 pt-5 pb-2">
          <ShopBadge className="h-7 w-auto" />
          <button onClick={onClose} className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-xs transition-colors cursor-pointer">
            ✕
          </button>
        </div>

        <div className="px-7 pb-6 text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-0.5">Confirm it&apos;s you</h2>
          <p className="text-sm text-gray-500 mb-2">{email || 'your@email.com'}</p>

          <p className="text-sm text-gray-600 mb-4 leading-snug">
            Enter the code sent to{' '}
            <span className="font-semibold">+1 ••• ••• •123</span>{' '}
            to securely use your saved information.
          </p>

          {/* OTP boxes */}
          <div className="flex gap-2 justify-center mb-4" onPaste={handlePaste}>
            {Array.from({ length: OTP_LENGTH }).map((_, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digits[i]}
                disabled={phase !== 'entry'}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`w-11 h-12 rounded-xl border text-center text-lg font-semibold focus:outline-none transition-all disabled:cursor-default ${
                  digits[i]
                    ? 'border-[#5A31F4] bg-[#5A31F4]/5 text-gray-900'
                    : 'border-gray-300 text-gray-900 focus:border-[#5A31F4] bg-white'
                }`}
              />
            ))}
          </div>

          {/* Loading spinner while APIs fire */}
          <AnimatePresence>
            {(phase === 'api1' || phase === 'api2' || phase === 'api3') && (
              <motion.div
                key="spinner"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-2 mb-4"
              >
                <svg className="animate-spin w-4 h-4 text-[#5A31F4]" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                <span className="text-xs text-gray-400">Verifying...</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Continue */}
          <AnimatePresence>
            {phase === 'done' && (
              <motion.button
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={onSuccess}
                className="w-full h-11 rounded-full bg-[#5A31F4] hover:bg-[#4a28d4] text-white font-semibold text-sm transition-colors cursor-pointer mb-3"
              >
                Continue to payment →
              </motion.button>
            )}
          </AnimatePresence>

          <button className="text-sm text-gray-600 hover:text-gray-900 underline underline-offset-2 cursor-pointer">
            Send code to email instead
          </button>

          <p className="text-[11px] text-gray-400 mt-3 leading-relaxed">
            By continuing, Shop will share your name and email with Gymshark.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Field component ──────────────────────────────────────────────────────────

function Field({
  label, type = 'text', value, onChange, placeholder, icon,
}: {
  label: string; type?: string; value?: string;
  onChange?: (v: string) => void; placeholder?: string;
  icon?: React.ReactNode;
}) {
  const hasValue = (value ?? '').length > 0;
  return (
    <div className="bg-white border border-gray-300 rounded-lg px-3.5 py-2 flex items-center gap-2 focus-within:border-gray-600 transition-colors">
      <div className="flex-1 min-w-0">
        {hasValue && <span className="text-[11px] text-gray-400 block leading-none mb-0.5">{label}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={hasValue ? '' : label}
          className="w-full text-sm text-gray-900 bg-transparent outline-none placeholder:text-gray-400"
        />
      </div>
      {icon && <span className="text-gray-400 flex-shrink-0">{icon}</span>}
    </div>
  );
}

function SelectField({ label, options, value, onChange }: {
  label: string; options: { value: string; label: string }[];
  value?: string; onChange?: (v: string) => void;
}) {
  const hasValue = (value ?? '').length > 0;
  return (
    <div className="bg-white border border-gray-300 rounded-lg px-3.5 py-2 focus-within:border-gray-600 transition-colors">
      {hasValue && <span className="text-[11px] text-gray-400 block leading-none mb-0.5">{label}</span>}
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full text-sm text-gray-900 bg-transparent outline-none appearance-none cursor-pointer"
      >
        {!hasValue && <option value="">{label}</option>}
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

// ─── Main Form ────────────────────────────────────────────────────────────────

export default function BaseCheckoutForm() {
  const setScreen = useDemoStore((s) => s.setScreen);
  const [email, setEmail] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [otpPos, setOtpPos] = useState({ top: 0, left: 0 });
  const [country, setCountry] = useState('US');
  const [state, setState] = useState('');
  const emailRef = useRef<HTMLDivElement>(null);

  const handleEmailBlur = () => {
    if (email.includes('@') && email.includes('.')) {
      if (emailRef.current) {
        const rect = emailRef.current.getBoundingClientRect();
        const bubbleWidth = 420;
        setOtpPos({
          top: rect.top,
          left: Math.min(rect.right + 12, window.innerWidth - bubbleWidth - 12),
        });
      }
      setShowOtp(true);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-full px-8 py-7 w-full"
      >
        {/* Express checkout */}
        <div className="mb-6">
          <p className="text-xs text-gray-400 text-center mb-3 flex items-center gap-3">
            <span className="flex-1 border-t border-gray-300" />
            Express checkout
            <span className="flex-1 border-t border-gray-300" />
          </p>
          <div className="flex gap-2.5">
            <button
              onClick={() => { if (email.includes('@')) setShowOtp(true); else setShowOtp(true); }}
              className="flex-1 h-11 rounded-full bg-[#5A31F4] hover:bg-[#4a28d4] flex items-center justify-center cursor-pointer transition-colors"
            >
              <ShopBadge withBackground={false} className="h-11 w-auto" />
            </button>
            <button className="flex-1 h-11 rounded-full bg-[#FFC439] hover:bg-[#f0b830] flex items-center justify-center cursor-pointer transition-colors">
              <span className="text-[#003087] font-black text-sm italic">PayPal</span>
            </button>
            <button className="flex-1 h-11 rounded-full bg-black hover:bg-gray-900 flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              <span className="text-white font-semibold text-sm">Pay</span>
            </button>
            <button className="flex-1 h-11 rounded-full bg-[#008CFF] hover:bg-[#0080f0] flex items-center justify-center cursor-pointer transition-colors">
              <span className="text-white font-black text-sm">venmo</span>
            </button>
          </div>
          <p className="text-xs text-gray-400 text-center mt-3 flex items-center gap-3">
            <span className="flex-1 border-t border-gray-300" />
            OR
            <span className="flex-1 border-t border-gray-300" />
          </p>
        </div>

        {/* CONTACT */}
        <section className="mb-5">
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Contact</h2>
            <a className="text-xs text-gray-500 underline underline-offset-2 cursor-pointer hover:text-gray-700">Sign in</a>
          </div>
          <div
            ref={emailRef}
            className="bg-white border border-gray-300 rounded-lg px-3.5 py-2 focus-within:border-gray-600 transition-colors"
            onClick={() => !showOtp && document.getElementById('email-input')?.focus()}
          >
            {email && <span className="text-[11px] text-gray-400 block leading-none mb-0.5">Email</span>}
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={handleEmailBlur}
              onKeyDown={(e) => { if (e.key === 'Enter') handleEmailBlur(); }}
              placeholder="Email"
              className="w-full text-sm text-gray-900 bg-transparent outline-none placeholder:text-gray-400"
            />
          </div>

        </section>

        {/* DELIVERY + SHIPPING + BUTTON — dimmed while OTP is open */}
        <div className={`transition-opacity duration-200 ${showOtp ? 'opacity-30 pointer-events-none select-none' : ''}`}>
        {/* DELIVERY */}
        <section className="mb-5">
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">Delivery</h2>
          <div className="space-y-2">
            <SelectField
              label="Country/Region"
              value={country}
              onChange={setCountry}
              options={[
                { value: 'US', label: 'United States' },
                { value: 'CA', label: 'Canada' },
                { value: 'GB', label: 'United Kingdom' },
              ]}
            />
            <div className="grid grid-cols-2 gap-2">
              <Field label="First name" />
              <Field label="Last name" />
            </div>
            <Field
              label="Address Line 1"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
                </svg>
              }
            />
            <Field label="Address Line 2" />
            <div className="grid grid-cols-3 gap-2">
              <Field label="City" />
              <SelectField
                label="State"
                value={state}
                onChange={setState}
                options={[
                  { value: 'AL', label: 'Alabama' }, { value: 'AK', label: 'Alaska' },
                  { value: 'AZ', label: 'Arizona' }, { value: 'CA', label: 'California' },
                  { value: 'CO', label: 'Colorado' }, { value: 'FL', label: 'Florida' },
                  { value: 'GA', label: 'Georgia' }, { value: 'IL', label: 'Illinois' },
                  { value: 'NY', label: 'New York' }, { value: 'TX', label: 'Texas' },
                  { value: 'WA', label: 'Washington' },
                ]}
              />
              <Field label="ZIP code" />
            </div>
            <Field
              label="Phone"
              type="tel"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"/>
                </svg>
              }
            />
          </div>
        </section>

        {/* Shipping */}
        <section className="mb-6">
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">Shipping method</h2>
          <div className="bg-white border border-gray-300 rounded-lg px-3.5 py-3 text-sm text-gray-400 italic">
            Enter your address to see shipping options
          </div>
        </section>

        <button
          disabled
          className="w-full h-12 rounded-lg bg-gray-300 text-gray-500 font-bold text-sm cursor-not-allowed"
        >
          Continue to payment
        </button>
        </div>
      </motion.div>

      {/* OTP bubble — fixed, to the right of the email field */}
      <AnimatePresence>
        {showOtp && (
          <OtpModal
            email={email}
            onClose={() => setShowOtp(false)}
            onSuccess={() => setScreen(2)}
            pos={otpPos}
          />
        )}
      </AnimatePresence>
    </>
  );
}
