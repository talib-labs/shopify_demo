'use client';

import { AnimatePresence } from 'framer-motion';
import { useDemoStore } from '@/store/demoStore';
import BaseCheckoutForm from './BaseCheckoutForm';
import ShopPayModal from './ShopPayModal';
import ShopPayReview from './ShopPayReview';
import OrderSummary from './OrderSummary';

export default function CheckoutShell() {
  const screen = useDemoStore((s) => s.screen);

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left: checkout flow */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {screen === 0 && <BaseCheckoutForm key="checkout" />}
          {screen === 1 && <ShopPayModal key="shop-pay" />}
          {screen >= 2 && <ShopPayReview key="review" />}
        </AnimatePresence>
      </div>

      {/* Right: order summary (fixed) */}
      <div className="w-[340px] flex-shrink-0 overflow-y-auto">
        <OrderSummary />
      </div>
    </div>
  );
}
