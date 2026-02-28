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
        {/* Left: Gymshark checkout (58% of screen) */}
        <div className="w-[58%] min-w-[600px] flex flex-col border-r border-gray-200 overflow-hidden">
          <CheckoutShell />
        </div>

        {/* Right: API Inspector (remaining width) */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ApiInspector logs={apiLogs} />
        </div>
      </div>
    </div>
  );
}
