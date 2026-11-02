import { cn } from '@/lib/utils'

/**
 * The Devscriptor `d>` mark on its gradient plate.
 *
 * Same geometry as app/icon.svg, which is also what favicon.ico and
 * apple-icon.png were rasterised from — change them together so the header
 * logo, the favicon and the touch icon stay identical.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn('w-8 h-8', className)}
      role="img"
      aria-label="Devscriptor"
    >
      <defs>
        <linearGradient id="dsg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="7" fill="url(#dsg)" />
      <g
        fill="none"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="19.5" r="3.5" />
        <line x1="15.5" y1="9" x2="15.5" y2="23" />
        <polyline points="19.5 15.5 23.5 19.5 19.5 23.5" />
      </g>
    </svg>
  )
}
