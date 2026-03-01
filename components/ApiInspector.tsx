'use client';

import { useState, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ApiLog } from '@/types';

interface Props {
  logs: ApiLog[];
}

function syntaxHighlight(json: unknown): string {
  const str = JSON.stringify(json, null, 2);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = 'text-[#79c0ff]';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) cls = 'text-[#7ee787]';
          else cls = 'text-[#a5d6ff]';
        } else if (/true|false/.test(match)) {
          cls = 'text-[#ff7b72]';
        } else if (/null/.test(match)) {
          cls = 'text-[#8b949e]';
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
}

function MethodBadge({ method }: { method: ApiLog['method'] }) {
  const colors: Record<string, string> = {
    GET: 'bg-[#238636]/30 text-[#3fb950]',
    POST: 'bg-[#1f6feb]/30 text-[#58a6ff]',
    PUT: 'bg-[#9e6a03]/30 text-[#e3b341]',
    PATCH: 'bg-[#9e6a03]/30 text-[#e3b341]',
    DELETE: 'bg-[#b91c1c]/30 text-[#f87171]',
  };
  return (
    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${colors[method] ?? 'bg-gray-700 text-gray-300'}`}>
      {method}
    </span>
  );
}

function ShopifyBagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  );
}

function SystemHandoff() {
  return (
    <div className="flex items-center gap-2 py-0.5">
      <div className="flex-1 h-px bg-[#21262d]" />
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#161b22] border border-[#30363d]">
        <ShopifyBagIcon className="w-3 h-3 text-[#96BF48]" />
        <span className="text-[9px] text-[#8b949e] uppercase tracking-widest">Shopify Payments</span>
        <svg className="w-2.5 h-2.5 text-[#484f58]" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L11 6.414V16a1 1 0 11-2 0V6.414L7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3z" clipRule="evenodd"/>
        </svg>
        <span className="text-[9px] text-[#8b949e] uppercase tracking-widest">Method Financial</span>
      </div>
      <div className="flex-1 h-px bg-[#21262d]" />
    </div>
  );
}

function LogEntry({ log, defaultOpen }: { log: ApiLog; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const [tab, setTab] = useState<'request' | 'response'>('response');

  const isShopify = log.source === 'shopify';
  const borderColor = isShopify ? '#96BF4840' : '#30363d';
  const accentColor = isShopify ? '#96BF48' : '#238636';
  const accentText = isShopify ? 'text-[#96BF48]' : 'text-[#3fb950]';
  const labelColor = isShopify ? 'text-[#96BF48]' : 'text-[#58a6ff]';
  const displayUrl = isShopify
    ? log.url.replace('https://checkout.shopify.com', '')
    : log.url.replace('https://dev.methodfi.com', '');

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg overflow-hidden"
      style={{ border: `1px solid ${borderColor}` }}
    >
      {/* Header row */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-3 py-2.5 bg-[#161b22] hover:bg-[#1c2128] transition-colors text-left"
      >
        <span className={`transition-transform duration-200 text-gray-500 text-xs ${open ? 'rotate-90' : ''}`}>▶</span>
        {isShopify && <ShopifyBagIcon className="w-3.5 h-3.5 text-[#96BF48] flex-shrink-0" />}
        <MethodBadge method={log.method} />
        <span className="text-[11px] text-[#8b949e] font-mono truncate flex-1">{displayUrl}</span>
        <span className={`text-[10px] font-mono ml-auto flex-shrink-0 ${accentText}`}>
          {isShopify ? 'Shopify' : '200'}
        </span>
        <span className="text-[10px] text-gray-600 font-mono ml-2">{log.duration}ms</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-[#0d1117]" style={{ borderTop: `1px solid ${borderColor}` }}>
              {/* Label + description */}
              <div className="px-3 pt-2.5 pb-1.5">
                <span className={`text-[11px] font-semibold ${labelColor}`}>{log.label}</span>
                {log.description && (
                  <span className="ml-2 text-[10px] text-[#8b949e]">— {log.description}</span>
                )}
              </div>

              {/* Tabs */}
              <div className="flex gap-0 border-b border-[#30363d] px-3">
                {(['request', 'response'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    style={{ borderBottomColor: tab === t ? accentColor : 'transparent' }}
                    className={`text-[11px] py-1.5 px-3 capitalize transition-colors border-b-2 -mb-px ${
                      tab === t ? accentText : 'text-[#8b949e] hover:text-gray-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="p-3">
                {tab === 'request' ? (
                  <div className="space-y-2">
                    {log.requestBody != null ? (
                      <div>
                        <p className="text-[9px] text-gray-600 uppercase tracking-wider mb-1">Body</p>
                        <pre
                          className="text-[11px] font-mono leading-relaxed overflow-x-auto"
                          dangerouslySetInnerHTML={{ __html: syntaxHighlight(log.requestBody) }}
                        />
                      </div>
                    ) : (
                      <p className="text-[11px] text-gray-600 italic">No request body</p>
                    )}
                  </div>
                ) : (
                  <pre
                    className="text-[11px] font-mono leading-relaxed overflow-x-auto"
                    dangerouslySetInnerHTML={{ __html: syntaxHighlight(log.responseBody as Record<string, unknown>) }}
                  />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ApiInspector({ logs }: Props) {
  const reversed = [...logs].reverse();
  const methodCount = logs.filter((l) => l.source !== 'shopify').length;
  const shopifyCount = logs.filter((l) => l.source === 'shopify').length;

  const countLabel = shopifyCount > 0
    ? `${methodCount} Method · ${shopifyCount} Shopify`
    : `${logs.length} request${logs.length !== 1 ? 's' : ''}`;

  return (
    <div className="h-full bg-[#0d1117] flex flex-col overflow-hidden">
      {/* Inspector header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#30363d] flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#238636] animate-pulse" />
          <span className="text-[12px] font-semibold text-gray-300 uppercase tracking-wider">API Inspector</span>
        </div>
        <span className="text-[10px] text-[#8b949e] font-mono">{countLabel}</span>
      </div>

      {/* Logs */}
      <div className="flex-1 overflow-y-auto custom-scroll p-3 space-y-2">
        {reversed.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <div className="w-10 h-10 rounded-full bg-[#161b22] flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <div>
              <p className="text-[12px] text-gray-500 font-medium">Waiting for API calls</p>
              <p className="text-[10px] text-gray-700 mt-0.5">Interact with the checkout to see live requests</p>
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {reversed.map((log, i) => {
            const prevLog = reversed[i - 1];
            const showHandoff = prevLog?.source === 'shopify' && log.source !== 'shopify';
            return (
              <Fragment key={log.id}>
                {showHandoff && <SystemHandoff />}
                <LogEntry log={log} defaultOpen={i === 0} />
              </Fragment>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
