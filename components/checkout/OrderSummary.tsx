'use client';

export const CART_ITEMS = [
  {
    id: '1',
    name: 'Shadow Seamless T-Shirt',
    variant: 'Black / XL',
    price: 3800,
    quantity: 1,
    color: '#1a1a1a',
    letter: 'SS',
  },
  {
    id: '2',
    name: 'Training Shorts',
    variant: 'Navy / L',
    price: 4400,
    quantity: 1,
    color: '#1e2d5a',
    letter: 'TS',
  },
  {
    id: '3',
    name: 'Vital Seamless Sports Bra',
    variant: 'Black / S',
    price: 5200,
    quantity: 1,
    color: '#111111',
    letter: 'VS',
  },
];

export const CART_TOTAL = CART_ITEMS.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0
);

function fmt(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function OrderSummary() {
  const subtotal = CART_TOTAL;

  return (
    <div className="p-5 flex flex-col min-h-full">
      {/* Items */}
      <div className="space-y-4 mb-5">
        {CART_ITEMS.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            {/* Product thumbnail */}
            <div className="relative flex-shrink-0">
              <div
                className="w-[62px] h-[62px] rounded-lg flex items-center justify-center border border-black/10"
                style={{ backgroundColor: item.color }}
              >
                <span className="text-[10px] font-bold text-white/60 tracking-wide">
                  {item.letter}
                </span>
              </div>
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gray-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <p className="text-xs font-semibold text-gray-800 leading-snug">{item.name}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{item.variant}</p>
            </div>
            <p className="text-xs font-semibold text-gray-800 pt-0.5 flex-shrink-0">
              {fmt(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      {/* Discount code */}
      <div className="flex gap-2 mb-5">
        <input
          type="text"
          placeholder="Discount code"
          className="flex-1 text-xs border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:border-gray-500 placeholder:text-gray-400 min-w-0"
        />
        <button className="px-3 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex-shrink-0">
          Apply
        </button>
      </div>

      {/* Totals */}
      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Subtotal · {CART_ITEMS.length} items</span>
          <span className="text-gray-800 font-medium">{fmt(subtotal)}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Shipping</span>
          <span className="text-green-600 font-semibold">Free</span>
        </div>
        <div className="flex justify-between text-sm font-bold text-gray-900 pt-2.5 border-t border-gray-300 mt-1">
          <span>Total</span>
          <div className="text-right">
            <span className="text-[10px] text-gray-400 font-normal mr-1">USD</span>
            <span>{fmt(subtotal)}</span>
          </div>
        </div>
      </div>

      {/* Security note */}
      <div className="mt-auto pt-6 flex items-center gap-1.5">
        <svg className="w-3 h-3 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
        </svg>
        <span className="text-[10px] text-gray-400">All transactions are secure and encrypted</span>
      </div>
    </div>
  );
}
