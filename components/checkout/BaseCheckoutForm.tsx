'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDemoStore } from '@/store/demoStore';
import { mockCreateEntity, mockConnectLiabilities, mockGetAccounts } from '@/lib/mock-api';

// ─── OTP Modal ────────────────────────────────────────────────────────────────

const OTP_LENGTH = 6;
type OtpPhase = 'entry' | 'api1' | 'api2' | 'api3' | 'done';

function OtpModal({ email, onClose, onSuccess }: { email: string; onClose: () => void; onSuccess: () => void }) {
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
    /* Fixed full-screen backdrop */
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
    >
      {/* Modal card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-3xl w-[360px] max-w-[92vw] shadow-2xl overflow-hidden"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 pt-5 pb-2">
          <span className="text-[#5A31F4] font-black text-lg tracking-tight">shop</span>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-sm transition-colors cursor-pointer">
            ✕
          </button>
        </div>

        <div className="px-6 pb-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Confirm it&apos;s you</h2>
          <p className="text-sm text-gray-500 mb-3">{email || 'your@email.com'}</p>

          <p className="text-sm text-gray-600 mb-5 leading-snug">
            Enter the code sent to{' '}
            <span className="font-semibold">+1 ••• ••• •990</span>{' '}
            to securely use your saved information.
          </p>

          {/* OTP boxes — fixed size, not flex-grow */}
          <div className="flex gap-2.5 justify-center mb-5" onPaste={handlePaste}>
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

          {/* API progress */}
          <AnimatePresence>
            {phase !== 'entry' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-4 text-left bg-gray-50 rounded-xl p-3"
              >
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Method API</p>
                <div className="space-y-2">
                  {apiSteps.map((step) => (
                    <div key={step.key} className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                        step.done ? 'bg-green-100' : step.active ? 'bg-[#5A31F4]/10' : 'bg-gray-100'
                      }`}>
                        {step.done ? (
                          <svg className="w-2.5 h-2.5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                        ) : step.active ? (
                          <svg className="animate-spin w-2.5 h-2.5 text-[#5A31F4]" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                          </svg>
                        ) : <div className="w-1 h-1 rounded-full bg-gray-300" />}
                      </div>
                      <span className={`text-xs ${step.done ? 'text-gray-600' : step.active ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>{step.label}</span>
                      {step.done && <span className="ml-auto text-[10px] text-green-600">✓</span>}
                    </div>
                  ))}
                </div>
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

          <p className="text-[11px] text-gray-400 mt-4 leading-relaxed">
            By continuing, Shop will share your name and email with Gymshark.
          </p>
        </div>
      </motion.div>
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
  const [country, setCountry] = useState('US');
  const [state, setState] = useState('');

  const handleEmailBlur = () => {
    if (email.includes('@') && email.includes('.')) setShowOtp(true);
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
              <span className="text-white font-black text-sm tracking-tight">shop</span>
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
        <p className="text-center text-xs text-gray-400 mt-2">
          Enter your email above to verify with Shop Pay
        </p>
      </motion.div>

      {/* OTP Modal */}
      <AnimatePresence>
        {showOtp && (
          <OtpModal
            email={email}
            onClose={() => setShowOtp(false)}
            onSuccess={() => setScreen(2)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
