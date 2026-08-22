"use client";

import { useState } from "react";

type PollOption = {
  icon: string;
  label: string;
  votes: number;
};

export default function FamilyPoll({
  question,
  options,
}: {
  question: string;
  options: PollOption[];
}) {
  const [voteCounts, setVoteCounts] = useState(options);
  const [voted, setVoted] = useState(false);
  const totalVotes = voteCounts.reduce((sum, option) => sum + option.votes, 0);

  function castVote(label: string) {
    if (voted) return;
    setVoteCounts((current) =>
      current.map((option) =>
        option.label === label ? { ...option, votes: option.votes + 1 } : option,
      ),
    );
    setVoted(true);
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold text-white">{question}</p>
      <ul className="flex flex-col gap-2">
        {voteCounts.map((option) => {
          const percent = totalVotes ? Math.round((option.votes / totalVotes) * 100) : 0;
          return (
            <li key={option.label}>
              <button
                type="button"
                disabled={voted}
                onClick={() => castVote(option.label)}
                className="w-full rounded-lg border border-white/10 px-3 py-2 text-left text-sm text-white transition-colors enabled:hover:border-[#ff715b]/50 disabled:cursor-default"
              >
                <div className="mb-1 flex items-center justify-between">
                  <span>
                    <span aria-hidden>{option.icon}</span> {option.label}
                  </span>
                  <span className="text-white/60">{option.votes} votes</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-[#ff715b]"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </button>
            </li>
          );
        })}
      </ul>
      {!voted && <p className="text-xs text-white/50">Tap an option to vote.</p>}
    </div>
  );
}
