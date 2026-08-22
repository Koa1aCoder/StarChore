import type { ReactNode } from "react";

export function Card({
  title,
  icon,
  children,
  className = "",
  action,
}: {
  title: string;
  icon: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className={`min-w-0 rounded-2xl border border-white/10 bg-[#111827]/90 p-5 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-transform duration-200 hover:-translate-y-0.5 ${className}`}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-white/70">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fff4d6] text-base text-[#111827]" aria-hidden>{icon}</span>
          {title}
        </h2>
        {action}
      </div>
      {children}
    </div>
  );
}

export function StatCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#101827] p-4 shadow-[0_10px_25px_rgba(0,0,0,0.25)]">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff4d6] text-2xl text-[#111827]" aria-hidden>
        {icon}
      </span>
      <div className="min-w-0">
        <p className="truncate text-lg font-semibold leading-tight text-white">{value}</p>
        <p className="truncate text-xs text-white/60">{label}</p>
      </div>
    </div>
  );
}

export function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full bg-[#ff715b]"
        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
      />
    </div>
  );
}
