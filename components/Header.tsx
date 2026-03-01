'use client';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-8 h-16 flex items-center justify-between flex-shrink-0">
      <span className="text-black font-black text-2xl tracking-tight uppercase">Gymshark</span>

      <div className="flex items-center gap-1.5">
        <span className="text-gray-400 text-xs">Powered by</span>
        <div className="flex items-center gap-1.5 border border-gray-200 rounded-md px-2 py-1">
          <img src="https://avatars.githubusercontent.com/u/66761576?s=32&v=4" className="w-3.5 h-3.5 rounded" alt="Method" />
          <span className="text-gray-700 text-[11px] font-semibold">Method</span>
        </div>
      </div>
    </header>
  );
}
