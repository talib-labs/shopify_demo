'use client';

import { AnimatePresence } from 'framer-motion';
import { useDemoStore } from '@/store/demoStore';
import BaseCheckoutForm from './BaseCheckoutForm';
import ShopPayReview from './ShopPayReview';
import OrderSummary from './OrderSummary';

export default function CheckoutShell() {
  const screen = useDemoStore((s) => s.screen);

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left: checkout form — gray background like Gymshark checkout */}
      <div className="flex-1 overflow-y-auto bg-[#e8e8e8]">
        <AnimatePresence mode="wait">
          {screen === 0 && <BaseCheckoutForm key="base" />}
          {screen >= 2 && <ShopPayReview key="review" />}
        </AnimatePresence>
      </div>

      {/* Right: order summary */}
      <div className="w-[280px] flex-shrink-0 bg-white border-l border-gray-200 overflow-y-auto">
        <OrderSummary />
      </div>
    </div>
  );
}
