"use client";

import { useState, useEffect, useRef } from "react";

interface HelpItem {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

interface HelpFloaterProps {
  items: HelpItem[];
}

export default function HelpFloater({ items }: HelpFloaterProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="fixed bottom-6 right-6 z-50">
      {/* Panel */}
      {open && (
        <div className="absolute bottom-14 right-0 w-80 bg-white rounded-2xl shadow-2xl shadow-black/10 border border-slate-200/80 overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="px-5 py-4 bg-linear-to-r from-slate-900 to-slate-800">
            <p className="text-sm font-semibold text-white">Help & Tips</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Quick guide to get you started</p>
          </div>

          {/* Items */}
          <div className="p-2">
            {items.map((item, i) => (
              <div
                key={i}
                className="flex gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center shrink-0 mt-0.5">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{item.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 cursor-pointer ${
          open
            ? "bg-slate-900 text-white shadow-slate-900/25 rotate-45"
            : "bg-amber-400 text-amber-900 border border-amber-500/30 shadow-amber-400/30 hover:shadow-xl hover:shadow-amber-400/40 hover:bg-amber-300 animate-wiggle"
        }`}
      >
        {open ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        ) : (
          <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </button>
    </div>
  );
}
