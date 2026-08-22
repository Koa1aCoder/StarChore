"use client";

import { useState } from "react";

type StartGateProps = {
  onStart: (profile: "Praise" | "Parent") => void;
};

export default function StartGate({ onStart }: StartGateProps) {
  const [mode, setMode] = useState<"kid" | "parent">("kid");

  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-[#172554] px-4 py-8 text-white">
      <section className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/15 bg-[#101827] shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full border-[24px] border-[#fbbf24]/15" />
        <div className="grid gap-8 px-6 py-10 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-16 lg:py-16">
          <div className="relative">
            <div className="mb-8 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fbbf24] text-2xl text-[#172554]">✦</span>
              <span className="text-xl font-bold tracking-tight">StarChore</span>
            </div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#fbbf24]">Family wins, together</p>
            <h1 className="max-w-lg text-4xl font-bold tracking-tight sm:text-6xl">Make home feel like a team.</h1>
            <p className="mt-5 max-w-md text-base leading-7 text-white/65">Chores, goals, rewards, and the little moments that keep your family moving in the same direction.</p>
          </div>

          <div className="relative rounded-2xl border border-white/10 bg-white/[0.06] p-5 sm:p-6">
            <h2 className="text-lg font-bold">Who&apos;s checking in?</h2>
            <p className="mt-1 text-sm text-white/55">Choose a space to start your family day.</p>
            <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-black/20 p-1 text-sm font-semibold">
              <button type="button" onClick={() => setMode("kid")} className={`rounded-lg px-3 py-2 transition-colors ${mode === "kid" ? "bg-white text-[#172554]" : "text-white/60 hover:text-white"}`}>Kid mode</button>
              <button type="button" onClick={() => setMode("parent")} className={`rounded-lg px-3 py-2 transition-colors ${mode === "parent" ? "bg-white text-[#172554]" : "text-white/60 hover:text-white"}`}>Parent mode</button>
            </div>
            <button type="button" onClick={() => onStart(mode === "kid" ? "Praise" : "Parent")} className="mt-4 flex w-full items-center justify-between rounded-xl bg-[#ff715b] px-4 py-3.5 text-left text-sm font-bold text-white shadow-[0_10px_24px_rgba(255,113,91,0.22)] transition-transform hover:-translate-y-0.5">
              <span>{mode === "kid" ? "Enter Praise's space" : "Open parent sign in"}</span>
              <span aria-hidden>→</span>
            </button>
            <p className="mt-4 text-center text-xs text-white/40">Your family space stays on this device.</p>
          </div>
        </div>
      </section>
    </main>
  );
}