import { useId } from "react";

export function Logo({ className = "h-9 w-9" }: { className?: string }) {
  const gradId = useId();
  const accentId = useId();

  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="55%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>
        <linearGradient id={accentId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#dbeafe" />
        </linearGradient>
      </defs>

      <rect x="3" y="3" width="42" height="42" rx="14" fill="#0b1020" />
      <path
        d="M16 12.5h16v4.3H21.5v7.6h9.4v4.1h-9.4v9.1H16v-25.1Z"
        fill={`url(#${gradId})`}
      />
      <path
        d="M24.6 12.5h12.2v4.1H29.2v7.1h7.7v4.2h-7.7v9.1H24.6v-24.5Z"
        fill={`url(#${accentId})`}
        opacity="0.96"
      />
      <rect x="29.5" y="31.5" width="7" height="4.2" rx="1.1" fill="#34d399" />
    </svg>
  );
}
