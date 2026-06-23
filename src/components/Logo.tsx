export function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="facilito-logo-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="50%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#5b21b6" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#facilito-logo-grad)" />
      {/* Rayo / lightning bolt = velocidad */}
      <path
        d="M27 9 L15 27 H22 L20 39 L33 20 H26 L29 9 Z"
        fill="white"
        stroke="white"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
