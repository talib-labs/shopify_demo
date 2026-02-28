'use client';

export default function Header() {
  return (
    <header className="h-14 bg-black flex items-center justify-between px-6 flex-shrink-0">
      {/* Gymshark Wordmark */}
      <div className="flex items-center gap-3">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
        <span className="text-white font-black text-xl tracking-widest uppercase">Gymshark</span>
      </div>

      {/* Powered by Method */}
      <div className="flex items-center gap-2">
        <span className="text-gray-400 text-xs">Powered by</span>
        <div className="flex items-center gap-1.5 bg-white/10 rounded-md px-2.5 py-1">
          <img
            src="https://avatars.githubusercontent.com/u/66761576?s=32&v=4"
            className="w-4 h-4 rounded"
            alt="Method"
          />
          <span className="text-white text-xs font-semibold">Method</span>
        </div>
      </div>
    </header>
  );
}
