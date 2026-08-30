export function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="facilitologo-gradient" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
      </defs>

      <rect x="2" y="2" width="44" height="44" rx="12" fill="#0b1020" />
      <path
        d="M15 10.5h15.5v4.5H20.5V22h10.2v4.5H20.5v11.5H15V10.5Z"
        fill="url(#facilitologo-gradient)"
      />
      <path
        d="M25.8 10.5h8.7v4.5h-4.2v7.5h4.2v4.5h-4.2v11.5h-4.5V10.5Z"
        fill="url(#facilitologo-gradient)"
        opacity="0.92"
      />
      <path
        d="M13.5 29.5h18.5v5.5c0 4.1-3.3 7.4-7.4 7.4H19.5c-4.1 0-7.4-3.3-7.4-7.4v-5.5h1.4Z"
        fill="url(#facilitologo-gradient)"
      />
      <path
        d="M19 30.5h9.5c1.6 0 2.9 1.3 2.9 2.9v1.1H16.1v-1.1c0-1.6 1.3-2.9 2.9-2.9Z"
        fill="none"
        stroke="#f5f3ff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="20.5" cy="37.8" r="2.6" fill="none" stroke="#f5f3ff" strokeWidth="1.8" />
      <circle cx="30.8" cy="37.8" r="2.6" fill="none" stroke="#f5f3ff" strokeWidth="1.8" />
    </svg>
  );
}
