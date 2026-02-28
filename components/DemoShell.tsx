'use client';

import { useDemoStore } from '@/store/demoStore';
import ApiInspector from './ApiInspector';
import CheckoutShell from './checkout/CheckoutShell';
import Header from './Header';

export default function DemoShell() {
  const apiLogs = useDemoStore((s) => s.apiLogs);

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel: Shopify checkout */}
        <div className="flex-1 flex flex-col overflow-hidden border-r border-gray-200">
          <CheckoutShell />
        </div>

        {/* Right panel: API Inspector */}
        <div className="w-[420px] flex-shrink-0 flex flex-col overflow-hidden">
          <ApiInspector logs={apiLogs} />
        </div>
      </div>
    </div>
  );
}
