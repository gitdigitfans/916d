import type { ReactNode } from "react";

/** Islamic mihrab-style arched frame around content (photos). */
export function MihrabFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 200 260" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <linearGradient id="mihrab-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.88 0.09 220)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="oklch(0.68 0.15 240)" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <path
          d="M100 6 C140 6 172 30 172 70 L172 216 C172 240 148 254 100 254 C52 254 28 240 28 216 L28 70 C28 30 60 6 100 6 Z"
          fill="none"
          stroke="url(#mihrab-grad)"
          strokeWidth="2.5"
        />
      </svg>
      <div
        className="relative h-full w-full overflow-hidden"
        style={{
          clipPath:
            "path('M100 8 C138 8 170 32 170 70 L170 216 C170 238 146 252 100 252 C54 252 30 238 30 216 L30 70 C30 32 62 8 100 8 Z')",
        }}
      >
        {children}
      </div>
    </div>
  );
}
