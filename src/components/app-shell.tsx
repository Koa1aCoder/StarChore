"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import StartGate from "@/components/start-gate";
import { navItems } from "@/lib/nav";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

const subscribeToSession = () => () => {};
const readSession = () => window.localStorage.getItem("starchore-session") === "active";
const readServerSession = () => false;

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [startedOverride, setStartedOverride] = useState(false);
  const persistedStarted = useSyncExternalStore(subscribeToSession, readSession, readServerSession);
  const started = persistedStarted || startedOverride;

  function start(profile: "Praise" | "Parent") {
    window.localStorage.setItem("starchore-session", "active");
    window.localStorage.setItem("starchore-profile", profile);
    setStartedOverride(true);
    if (profile === "Parent") router.push("/parents");
  }

  if (!started) return <StartGate onStart={start} />;

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc] text-[#172554] md:flex-row">
      {/* Sidebar (desktop / tablet landscape) */}
      <aside className="hidden md:flex md:w-56 lg:w-60 md:flex-col md:bg-[#172554] md:text-white md:shrink-0 md:border-r md:border-[#2563eb]/30">
        <div className="flex h-20 items-center gap-3 px-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fbbf24] text-xl text-[#172554] shadow-[0_0_24px_rgba(251,191,36,0.25)]">✦</span>
          <span className="text-lg font-bold tracking-tight text-white">StarChore</span>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-white/15 text-white shadow-inner"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span aria-hidden>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col bg-[#f8fafc]">
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#e2e8f0] bg-white/90 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-2 text-lg font-bold md:hidden">
            <span className="text-[#ff715b]">✦</span>
            <span>StarChore</span>
          </div>
          <div className="hidden md:block" />
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Notifications"
              className="rounded-lg p-2 text-xl leading-none text-[#172554] transition-colors hover:bg-[#2563eb]/10"
            >
              🔔
            </button>
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2563eb] text-sm text-white" aria-hidden>
                P
              </span>
              <span className="hidden sm:inline">Praise</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <div className="mx-auto w-full max-w-6xl px-3 py-5 sm:px-6 sm:py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Bottom nav (phone / narrow tablet) */}
      <nav className="fixed inset-x-0 bottom-0 z-10 flex min-h-16 overflow-x-auto border-t border-[#e2e8f0] bg-white/95 md:hidden">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 shrink-0 basis-16 flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${
                active
                  ? "text-[#2563eb]"
                  : "text-[#64748b]"
              }`}
            >
              <span className="text-lg leading-none" aria-hidden>
                {item.icon}
              </span>
                <span className="whitespace-nowrap px-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
