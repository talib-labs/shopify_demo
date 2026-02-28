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
      className="max-w-lg mx-auto px-6 py-8 w-full"
    >
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <span>Cart</span>
        <span>›</span>
        <span className="text-gray-800 font-medium">Information</span>
        <span>›</span>
        <span>Shipping</span>
        <span>›</span>
        <span>Payment</span>
      </nav>

      {/* Express checkout */}
      <div className="mb-6">
        <p className="text-xs text-gray-500 text-center mb-3 relative">
          <span className="bg-white px-2 relative z-10">Express checkout</span>
          <span className="absolute inset-y-1/2 left-0 right-0 border-t border-gray-200 -z-0" />
        </p>
        <button
          onClick={() => setScreen(1)}
          className="w-full h-12 rounded-lg flex items-center justify-center gap-2 bg-[#5A31F4] hover:bg-[#4a28d4] transition-colors text-white font-semibold text-sm shadow-sm"
        >
          <svg width="20" height="10" viewBox="0 0 56 24" fill="white">
            <path d="M9.5 6.5C9.5 3.46 11.96 1 15 1h26c3.04 0 5.5 2.46 5.5 5.5v11c0 3.04-2.46 5.5-5.5 5.5H15c-3.04 0-5.5-2.46-5.5-5.5V6.5z" fill="white" opacity="0.3"/>
            <text x="28" y="16" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Shop Pay</text>
          </svg>
          <span>Shop Pay</span>
        </button>
        <p className="text-center text-[11px] text-gray-400 mt-2">— or —</p>
      </div>

      {/* Contact */}
      <section className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-800">Contact</h2>
          <a href="#" className="text-xs text-[#1773b0] hover:underline">Log in</a>
        </div>
        <input
          type="email"
          defaultValue="alex.jordan@gmail.com"
          className="w-full text-sm border border-gray-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-[#1773b0] focus:ring-1 focus:ring-[#1773b0]/20"
          placeholder="Email"
        />
        <label className="flex items-center gap-2 mt-2.5 cursor-pointer">
          <input type="checkbox" defaultChecked className="rounded accent-gray-800" />
          <span className="text-xs text-gray-600">Email me with news and offers</span>
        </label>
      </section>

      {/* Delivery */}
      <section className="mb-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-3">Delivery</h2>
        <div className="space-y-2.5">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Country/Region</label>
            <select className="w-full text-sm border border-gray-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-[#1773b0] bg-white">
              <option>United States</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <input
              type="text"
              defaultValue="Alex"
              placeholder="First name"
              className="text-sm border border-gray-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-[#1773b0]"
            />
            <input
              type="text"
              defaultValue="Jordan"
              placeholder="Last name"
              className="text-sm border border-gray-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-[#1773b0]"
            />
          </div>
          <input
            type="text"
            defaultValue="1234 Market St"
            placeholder="Address"
            className="w-full text-sm border border-gray-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-[#1773b0]"
          />
          <div className="grid grid-cols-3 gap-2.5">
            <input
              type="text"
              defaultValue="San Francisco"
              placeholder="City"
              className="text-sm border border-gray-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-[#1773b0]"
            />
            <input
              type="text"
              defaultValue="CA"
              placeholder="State"
              className="text-sm border border-gray-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-[#1773b0]"
            />
            <input
              type="text"
              defaultValue="94103"
              placeholder="ZIP"
              className="text-sm border border-gray-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-[#1773b0]"
            />
          </div>
          <input
            type="tel"
            defaultValue="+1 (408) 555-1234"
            placeholder="Phone (optional)"
            className="w-full text-sm border border-gray-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-[#1773b0]"
          />
        </div>
      </section>

      {/* Shipping method */}
      <section className="mb-6">
        <h2 className="text-sm font-semibold text-gray-800 mb-3">Shipping method</h2>
        <div className="flex items-center justify-between border border-[#1773b0] bg-[#f0f7ff] rounded-lg px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-[#1773b0] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#1773b0]" />
            </div>
            <span className="text-sm text-gray-700">Standard (4–7 business days)</span>
          </div>
          <span className="text-sm font-semibold text-green-600">Free</span>
        </div>
      </section>

      {/* Continue button */}
      <button
        onClick={() => setScreen(1)}
        className="w-full h-12 rounded-lg bg-black hover:bg-gray-900 transition-colors text-white font-semibold text-sm"
      >
        Continue to payment
      </button>
    </motion.div>
  );
}
