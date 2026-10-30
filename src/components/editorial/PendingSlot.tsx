import type { ReactNode } from 'react';

interface Props {
  label: string;
  /** Where in /src/content the material goes, e.g. "essay.ts → thesis". */
  field?: string;
  children?: ReactNode;
  tone?: 'dark' | 'light';
  className?: string;
}

/**
 * A quiet integration note for academic material that has not been delivered:
 * one hairline, one label, the content path. It marks where the content goes
 * without inventing it, and without drawing a box around it.
 */
export function PendingSlot({ label, field, children, tone = 'dark', className = '' }: Props) {
  const color = tone === 'dark' ? 'border-ivory/25 text-ivory/55' : 'border-navy/25 text-navy/55';
  return (
    <div role="note" aria-label={`Pendiente: ${label}`} className={`border-l pl-4 ${color} ${className}`}>
      <p className="meta">
        <span className={tone === 'dark' ? 'text-gold' : 'text-magenta'}>Pendiente</span> · {label}
      </p>
      {children && <p className="mt-2 max-w-[52ch] text-sm leading-relaxed">{children}</p>}
      {field && <p className="mt-1 font-mono text-[0.62rem] opacity-70">content/{field}</p>}
    </div>
  );
}
