export function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="facilito-logo-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="50%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="44" height="44" rx="12" fill="#0b1020" />
      <rect x="4" y="4" width="40" height="40" rx="10" fill="url(#facilito-logo-grad)" opacity="0.98" />
      <path d="M14 32V16h9.8c6.5 0 10.4 3.7 10.4 9.7 0 6-3.9 9.7-10.4 9.7H20v5.6h-6zm6-7.5h3.4c3.2 0 5.1-1.8 5.1-4.7 0-2.9-1.9-4.7-5.1-4.7H20v9.4z" fill="white" />
      <path d="M31 16h6v17h-6z" fill="white" opacity="0.92" />
      <path d="M31 16h13v6H31z" fill="#d1fae5" opacity="0.95" />
    </svg>
  );
}
