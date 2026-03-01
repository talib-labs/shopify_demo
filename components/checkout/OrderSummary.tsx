'use client';

export const CART_ITEMS = [
  { id: '1', name: 'Shadow Seamless T Shirt - Black',  variant: 'Black / XL', price: 3800, quantity: 1, color: '#1a1a1a', letter: 'SS' },
  { id: '2', name: 'Training Shorts - Navy',           variant: 'Navy / L',   price: 4400, quantity: 1, color: '#1e2d5a', letter: 'TS' },
  { id: '3', name: 'Vital Seamless Sports Bra - Black',variant: 'Black / S',  price: 5200, quantity: 1, color: '#111111', letter: 'VS' },
];

export const CART_TOTAL = CART_ITEMS.reduce((s, i) => s + i.price * i.quantity, 0);

function fmt(cents: number) { return `$${(cents / 100).toFixed(2)}`; }

export default function OrderSummary() {
  const subtotal = CART_TOTAL;

  return (
    <div className="p-5">
      {/* Items */}
      <div className="space-y-4 mb-5">
        {CART_ITEMS.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            <div className="relative flex-shrink-0">
              <div
                className="w-14 h-14 rounded-md flex items-center justify-center border border-black/10"
                style={{ backgroundColor: item.color }}
              >
                <span className="text-[9px] font-bold text-white/50 tracking-wide">{item.letter}</span>
              </div>
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gray-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <p className="text-xs font-medium text-gray-800 leading-snug">{item.name}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{item.variant}</p>
            </div>
            <p className="text-xs font-semibold text-gray-800 pt-0.5 flex-shrink-0">{fmt(item.price)}</p>
          </div>
        ))}
      </div>

      {/* Discount */}
      <div className="flex gap-2 mb-5">
        <input
          type="text"
          placeholder="Discount code or gift card"
          className="flex-1 text-xs border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-gray-500 placeholder:text-gray-400 min-w-0 bg-white"
        />
        <button className="px-3 py-2 text-xs font-semibold text-gray-500 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex-shrink-0 bg-white">
          APPLY
        </button>
      </div>

      {/* Totals */}
      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Subtotal · {CART_ITEMS.length} items</span>
          <span className="text-gray-800">{fmt(subtotal)}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Shipping</span>
          <span className="text-gray-400 italic">Enter shipping address</span>
        </div>
        <div className="flex justify-between pt-3 border-t border-gray-200">
          <span className="text-sm font-semibold text-gray-900">Total</span>
          <div className="text-right">
            <span className="text-xs text-gray-400 mr-1">USD</span>
            <span className="text-base font-bold text-gray-900">{fmt(subtotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
