'use client';

import { CartItem } from '@/types';

const CART_ITEMS: CartItem[] = [
  {
    id: '1',
    name: 'Legacy Short',
    variant: 'Black / XL',
    price: 3500,
    quantity: 1,
    image: '🩳',
  },
  {
    id: '2',
    name: 'Arrival 5" Short',
    variant: 'Ash Green / L',
    price: 3800,
    quantity: 1,
    image: '🩳',
  },
  {
    id: '3',
    name: 'Vital Seamless Sports Bra',
    variant: 'Black / S',
    price: 5200,
    quantity: 1,
    image: '👕',
  },
];

export const CART_TOTAL = CART_ITEMS.reduce((sum, item) => sum + item.price * item.quantity, 0);

function fmt(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function OrderSummary() {
  const subtotal = CART_ITEMS.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <div className="bg-[#f5f5f5] border-l border-gray-200 h-full flex flex-col p-6 overflow-y-auto">
      <h2 className="text-sm font-semibold text-gray-800 mb-4">Order summary</h2>

      {/* Items */}
      <div className="space-y-4 mb-6">
        {CART_ITEMS.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            {/* Product image placeholder */}
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 bg-gray-800 rounded-lg flex items-center justify-center text-2xl">
                {item.image}
              </div>
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 leading-tight">{item.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.variant}</p>
            </div>
            <p className="text-sm font-medium text-gray-800 flex-shrink-0">{fmt(item.price)}</p>
          </div>
        ))}
      </div>

      {/* Discount code */}
      <div className="flex gap-2 mb-5">
        <input
          type="text"
          placeholder="Discount code or gift card"
          className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-gray-400 placeholder:text-gray-400"
        />
        <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          Apply
        </button>
      </div>

      {/* Totals */}
      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal · {CART_ITEMS.length} items</span>
          <span>{fmt(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Shipping</span>
          <span className="text-green-600 font-medium">Free</span>
        </div>
        <div className="flex justify-between text-base font-semibold text-gray-900 pt-2 border-t border-gray-200 mt-2">
          <span>Total</span>
          <div className="text-right">
            <span className="text-xs text-gray-500 font-normal mr-1">USD</span>
            <span>{fmt(subtotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
