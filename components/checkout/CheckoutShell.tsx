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
      {/* Left: checkout form flow */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {screen === 0 && <BaseCheckoutForm key="base" />}
          {screen >= 2 && <ShopPayReview key="review" />}
        </AnimatePresence>
      </div>

      {/* Right: order summary sidebar */}
      <div className="w-[270px] flex-shrink-0 bg-[#f6f6f6] border-l border-gray-200 overflow-y-auto">
        <OrderSummary />
      </div>
    </div>
  );
}
