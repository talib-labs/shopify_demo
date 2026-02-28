'use client';

import { motion } from 'framer-motion';
import { useDemoStore } from '@/store/demoStore';

export default function BaseCheckoutForm() {
  const setScreen = useDemoStore((s) => s.setScreen);

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

      {/* Express checkout — Shop Pay */}
      <div className="mb-7">
        <p className="text-xs text-gray-400 text-center mb-3 relative flex items-center gap-3">
          <span className="flex-1 border-t border-gray-200" />
          <span>Express checkout</span>
          <span className="flex-1 border-t border-gray-200" />
        </p>

        <button
          onClick={() => setScreen(1)}
          className="w-full h-[52px] rounded-lg flex items-center justify-center gap-2.5 bg-[#5A31F4] hover:bg-[#4a28d4] active:bg-[#3a20c0] transition-colors text-white font-bold text-sm shadow-sm cursor-pointer"
        >
          {/* Shop Pay pill logo */}
          <span className="bg-white/20 rounded px-2 py-0.5 text-xs font-bold tracking-wide">Shop Pay</span>
        </button>

        <div className="flex items-center gap-3 mt-4">
          <span className="flex-1 border-t border-gray-200" />
          <span className="text-xs text-gray-400">Or continue below</span>
          <span className="flex-1 border-t border-gray-200" />
        </div>
      </div>

      {/* Contact */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900">Contact</h2>
          <a className="text-xs text-blue-600 hover:underline cursor-pointer">Log in</a>
        </div>
        <input
          type="email"
          defaultValue="alex.jordan@gmail.com"
          className="w-full text-sm border border-gray-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500/20 bg-white"
          placeholder="Email"
        />
        <label className="flex items-center gap-2 mt-2.5 cursor-pointer">
          <input type="checkbox" defaultChecked className="rounded" />
          <span className="text-xs text-gray-500">Email me with news and offers</span>
        </label>
      </section>

      {/* Delivery */}
      <section className="mb-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Delivery</h2>
        <div className="space-y-2.5">
          <select className="w-full text-sm border border-gray-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-gray-500 bg-white text-gray-700">
            <option>United States</option>
            <option>Canada</option>
            <option>United Kingdom</option>
          </select>
          <div className="grid grid-cols-2 gap-2.5">
            <input
              type="text"
              defaultValue="Alex"
              placeholder="First name"
              className="text-sm border border-gray-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-gray-500 bg-white"
            />
            <input
              type="text"
              defaultValue="Jordan"
              placeholder="Last name"
              className="text-sm border border-gray-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-gray-500 bg-white"
            />
          </div>
          <input
            type="text"
            defaultValue="1234 Market St"
            placeholder="Address"
            className="w-full text-sm border border-gray-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-gray-500 bg-white"
          />
          <input
            type="text"
            placeholder="Apartment, suite, etc. (optional)"
            className="w-full text-sm border border-gray-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-gray-500 bg-white text-gray-500"
          />
          <div className="grid grid-cols-3 gap-2.5">
            <input
              type="text"
              defaultValue="San Francisco"
              placeholder="City"
              className="text-sm border border-gray-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-gray-500 bg-white"
            />
            <select className="text-sm border border-gray-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-gray-500 bg-white text-gray-700">
              <option>CA</option>
              <option>NY</option>
              <option>TX</option>
            </select>
            <input
              type="text"
              defaultValue="94103"
              placeholder="ZIP code"
              className="text-sm border border-gray-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-gray-500 bg-white"
            />
          </div>
          <input
            type="tel"
            defaultValue="+1 (408) 555-1234"
            placeholder="Phone (optional)"
            className="w-full text-sm border border-gray-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-gray-500 bg-white"
          />
        </div>
      </section>

      {/* Shipping method */}
      <section className="mb-7">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Shipping method</h2>
        <div className="border border-gray-800 bg-white rounded-lg px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded-full border-2 border-gray-800 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-gray-800" />
            </div>
            <span className="text-sm text-gray-700">Standard · 4–7 business days</span>
          </div>
          <span className="text-sm font-bold text-gray-900">Free</span>
        </div>
      </section>

      {/* Continue CTA */}
      <button
        onClick={() => setScreen(1)}
        className="w-full h-[52px] rounded-lg bg-gray-900 hover:bg-black active:bg-gray-700 transition-colors text-white font-bold text-sm tracking-wide cursor-pointer"
      >
        Continue to payment
      </button>

      {/* Back to cart */}
      <button className="w-full mt-3 text-xs text-gray-400 hover:text-gray-600 py-2 transition-colors cursor-pointer">
        ← Return to cart
      </button>
    </motion.div>
  );
}
