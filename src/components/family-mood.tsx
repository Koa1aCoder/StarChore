"use client";

import { useState } from "react";

type MoodOption = {
  icon: string;
  label: string;
};

type MoodTally = {
  icon: string;
  count: number;
};

export default function FamilyMood({
  options,
  checkIns,
}: {
  options: MoodOption[];
  checkIns: MoodTally[];
}) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.label}
            type="button"
            aria-pressed={selected === option.label}
            onClick={() => setSelected(option.label)}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
              selected === option.label
                ? "border-[#ff715b] bg-[#ff715b] text-white"
                : "border-white/10 text-white/70 hover:border-[#ff715b]/50"
            }`}
          >
            <span aria-hidden>{option.icon}</span>
            {option.label}
          </button>
        ))}
      </div>
      {selected && (
        <p className="text-xs text-white/50">Thanks for checking in — kept private to your family.</p>
      )}
      <div className="rounded-lg border border-white/10 px-3 py-2">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.1em] text-white/45">Family Check-In</p>
        <p className="text-sm text-white">
          {checkIns.map((tally) => `${tally.icon} ${tally.count}`).join("  ")}
        </p>
      </div>
    </div>
  );
}
