'use client';

export default function Header() {
  return (
    <header className="h-12 bg-black flex items-center justify-between px-6 flex-shrink-0 border-b border-white/10">
      {/* Gymshark wordmark */}
      <div className="flex items-center gap-2.5">
        {/* Gymshark "shark fin" icon approximation */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
          <path d="M3 20 C3 20 7 4 12 4 C17 4 21 20 21 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          <path d="M7 20 C7 20 9 12 12 12 C15 12 17 20 17 20" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
        </svg>
        <span className="text-white font-black text-base tracking-[0.15em] uppercase">Gymshark</span>
      </div>

      {/* Center: checkout context */}
      <span className="text-gray-500 text-xs tracking-wide uppercase absolute left-1/2 -translate-x-1/2">
        Secure checkout
      </span>

      {/* Right: Powered by Method */}
      <div className="flex items-center gap-1.5">
        <span className="text-gray-500 text-[11px]">Powered by</span>
        <div className="flex items-center gap-1.5 bg-white/8 border border-white/10 rounded-md px-2 py-1">
          <img
            src="https://avatars.githubusercontent.com/u/66761576?s=32&v=4"
            className="w-3.5 h-3.5 rounded"
            alt="Method"
          />
          <span className="text-white text-[11px] font-semibold">Method</span>
        </div>
      </div>
    </header>
  );
}
