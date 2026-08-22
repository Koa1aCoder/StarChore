"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { Card, ProgressBar, StatCard } from "@/components/ui";
import {
  dailyProgress,
  initialApprovals,
  initialChores,
  initialRewards,
  kids,
  leastCompletedChores,
  monthlyProgress,
  mostCompletedChores,
  notificationTypes,
  parentActivityFeed,
  reportSummary,
  type ApprovalItem,
  type Chore,
  type RewardItem,
} from "@/lib/parent-data";

const parentActions = [
  { label: "Manage family", detail: "People, roles, and places", href: "/family", icon: "👨‍👩‍👧" },
  { label: "Review chores", detail: "Approve completed tasks", href: "/starchore", icon: "✅" },
  { label: "Set family goals", detail: "Plan the next big win", href: "/goals", icon: "🎯" },
  { label: "Check calendar", detail: "Keep everyone on track", href: "/calendar", icon: "📅" },
  { label: "Manage rewards", detail: "Choose what stars unlock", href: "/goals", icon: "🎁" },
  { label: "Family permissions", detail: "Decide who can change what", href: "/family", icon: "🛡️" },
  { label: "Notifications", detail: "Stay on top of family activity", href: "/help-hub", icon: "🔔" },
  { label: "Manage places", detail: "Update home and activity places", href: "/family", icon: "📍" },
];

const assignees = ["Rotating", ...kids.map((kid) => kid.name)];

function emptyChoreDraft(): Chore {
  return {
    id: "",
    title: "",
    assignee: assignees[0],
    difficulty: "Easy",
    dueDate: "Today",
    reward: 5,
    requirePhoto: false,
    requireApproval: false,
    recurring: "One-time",
    instructions: "",
    checklist: [],
  };
}


export default function ParentsPage() {
  const [pin, setPin] = useState("2246");
  const [enteredPin, setEnteredPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [pinMessage, setPinMessage] = useState("");

  const [chores, setChores] = useState<Chore[]>(initialChores);
  const [choreFormOpen, setChoreFormOpen] = useState(false);
  const [editingChoreId, setEditingChoreId] = useState<string | null>(null);
  const [choreDraft, setChoreDraft] = useState<Chore>(emptyChoreDraft());

  const [approvals, setApprovals] = useState<ApprovalItem[]>(initialApprovals);
  const [feedbackOpenId, setFeedbackOpenId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState("");

  const [rewards, setRewards] = useState<RewardItem[]>(initialRewards);
  const [rewardFormOpen, setRewardFormOpen] = useState(false);
  const [rewardDraft, setRewardDraft] = useState({ label: "", icon: "🎁", cost: 10, availability: "Anytime", quantity: "Unlimited" as number | "Unlimited", expiration: "None" });

  const [notificationsEnabled, setNotificationsEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(notificationTypes.map((type) => [type, true])),
  );

  function startCreateChore() {
    setChoreDraft(emptyChoreDraft());
    setEditingChoreId(null);
    setChoreFormOpen(true);
  }

  function startEditChore(chore: Chore) {
    setChoreDraft(chore);
    setEditingChoreId(chore.id);
    setChoreFormOpen(true);
  }

  function saveChoreDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (editingChoreId) {
      setChores((current) => current.map((chore) => (chore.id === editingChoreId ? { ...choreDraft, id: editingChoreId } : chore)));
    } else {
      setChores((current) => [...current, { ...choreDraft, id: `chore-${Date.now()}` }]);
    }
    setChoreFormOpen(false);
    setEditingChoreId(null);
  }

  function deleteChore(id: string) {
    setChores((current) => current.filter((chore) => chore.id !== id));
  }

  function duplicateChore(id: string) {
    setChores((current) => {
      const source = current.find((chore) => chore.id === id);
      if (!source) return current;
      return [...current, { ...source, id: `chore-${Date.now()}`, title: `${source.title} (Copy)` }];
    });
  }

  function rotateChore(id: string) {
    setChores((current) =>
      current.map((chore) => {
        if (chore.id !== id) return chore;
        const currentIndex = assignees.indexOf(chore.assignee);
        const nextAssignee = assignees[(currentIndex + 1) % assignees.length];
        return { ...chore, assignee: nextAssignee };
      }),
    );
  }

  function approveItem(id: string) {
    setApprovals((current) => current.filter((item) => item.id !== id));
  }

  function rejectItem(id: string) {
    setApprovals((current) => current.filter((item) => item.id !== id));
  }

  function submitFeedback(id: string) {
    setApprovals((current) => current.filter((item) => item.id !== id));
    setFeedbackOpenId(null);
    setFeedbackText("");
  }

  function saveRewardDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRewards((current) => [...current, { ...rewardDraft, id: `reward-${Date.now()}` }]);
    setRewardDraft({ label: "", icon: "🎁", cost: 10, availability: "Anytime", quantity: "Unlimited", expiration: "None" });
    setRewardFormOpen(false);
  }

  function deleteReward(id: string) {
    setRewards((current) => current.filter((reward) => reward.id !== id));
  }

  function toggleNotification(type: string) {
    setNotificationsEnabled((current) => ({ ...current, [type]: !current[type] }));
  }

  useEffect(() => {
    const savedPin = window.localStorage.getItem("homebase-parent-pin");
    if (savedPin) setPin(savedPin);
  }, []);

  function unlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (enteredPin === pin) {
      setUnlocked(true);
      setEnteredPin("");
      return;
    }
    setPinMessage("That PIN does not match. Try again.");
  }

  function changePin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (currentPin !== pin) {
      setPinMessage("Enter your current PIN first.");
      return;
    }
    if (!/^\d{4}$/.test(newPin)) {
      setPinMessage("Your new PIN must be exactly 4 numbers.");
      return;
    }
    setPin(newPin);
    window.localStorage.setItem("homebase-parent-pin", newPin);
    setCurrentPin("");
    setNewPin("");
    setPinMessage("Parent PIN updated.");
  }

  if (!unlocked) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center pb-24 md:pb-6">
        <Card title="Parent access" icon="🔑" className="w-full max-w-md">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff4d6] text-3xl">🔐</div>
            <h1 className="text-2xl font-bold">Parents only</h1>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-black/60 dark:text-white/60">
              Enter the 4-digit PIN to open parent controls and family settings.
            </p>
            <form className="mx-auto mt-6 flex max-w-xs flex-col gap-3" onSubmit={unlock}>
              <label className="sr-only" htmlFor="parent-pin">Parent PIN</label>
              <input
                id="parent-pin"
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                value={enteredPin}
                onChange={(event) => { setEnteredPin(event.target.value.replace(/\D/g, "")); setPinMessage(""); }}
                placeholder="Enter PIN"
                className="rounded-xl border border-black/10 bg-white px-4 py-3 text-center text-lg tracking-[0.5em] outline-none focus:border-[#ff715b] dark:border-white/15 dark:bg-white/5"
              />
              <button type="submit" className="rounded-xl bg-[#ff715b] px-4 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5">Unlock parent space</button>
            </form>
            {pinMessage && <p className="mt-3 text-xs font-semibold text-[#ff715b]">{pinMessage}</p>}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-24 sm:gap-8 md:pb-6">
      <header>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#ff715b]">Adults only</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Parent space</h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-black/60 dark:text-white/60">
          Keep the family moving, approve wins, and shape what everyone is working toward.
        </p>
      </header>

      <section aria-label="Parent overview" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon="⏳" label="Waiting for approval" value="3" />
        <StatCard icon="⭐" label="Stars this week" value="128" />
        <StatCard icon="🏆" label="Family streak" value="7 days" />
      </section>

      <section aria-label="Parent controls">
        <Card title="Parent controls" icon="🔑">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {parentActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="group flex items-center gap-3 rounded-xl border border-black/5 bg-[#fafbfe] p-3 transition-colors hover:border-[#ff715b]/40 hover:bg-[#fff1ed] dark:border-white/10 dark:bg-white/5 dark:hover:bg-[#ff715b]/15"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff4d6] text-xl" aria-hidden>
                  {action.icon}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold group-hover:text-[#ff715b]">{action.label}</span>
                  <span className="block truncate text-xs text-black/50 dark:text-white/50">{action.detail}</span>
                </span>
                <span className="ml-auto text-black/30" aria-hidden>→</span>
              </Link>
            ))}
          </div>
        </Card>
      </section>

      <section aria-label="Parent settings">
        <Card title="Parent settings" icon="⚙️" action={
          <button type="button" onClick={() => setSettingsOpen((open) => !open)} className="text-xs font-bold text-[#ff715b] hover:underline">
            {settingsOpen ? "Close" : "Open settings"}
          </button>
        }>
          {settingsOpen ? (
            <form className="max-w-md" onSubmit={changePin}>
              <p className="text-sm leading-6 text-black/60 dark:text-white/60">Change the 4-digit PIN used to protect this parent space.</p>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="text-xs font-semibold text-black/60 dark:text-white/60">
                  Current PIN
                  <input type="password" inputMode="numeric" maxLength={4} value={currentPin} onChange={(event) => setCurrentPin(event.target.value.replace(/\D/g, ""))} className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-[#ff715b] dark:border-white/15 dark:bg-white/5" />
                </label>
                <label className="text-xs font-semibold text-black/60 dark:text-white/60">
                  New PIN
                  <input type="password" inputMode="numeric" maxLength={4} value={newPin} onChange={(event) => setNewPin(event.target.value.replace(/\D/g, ""))} className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-[#ff715b] dark:border-white/15 dark:bg-white/5" />
                </label>
              </div>
              <button type="submit" className="mt-4 rounded-lg bg-[#172033] px-3 py-2 text-xs font-bold text-white dark:bg-white dark:text-[#172033]">Save new PIN</button>
              {pinMessage && <p className="mt-3 text-xs font-semibold text-[#ff715b]">{pinMessage}</p>}
            </form>
          ) : (
            <p className="text-sm text-black/60 dark:text-white/60">PIN protection is on. Open settings to update the parent PIN.</p>
          )}
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Needs your attention" icon="📬">
          <ul className="flex flex-col gap-3 text-sm">
            <li className="flex items-center justify-between rounded-xl bg-[#fff1ed] px-3 py-3 dark:bg-[#ff715b]/15">
              <span><strong>Praise</strong> finished 20 min reading</span>
              <span className="font-bold text-[#ff715b]">+5 ⭐</span>
            </li>
            <li className="flex items-center justify-between rounded-xl bg-[#fff4d6] px-3 py-3 dark:bg-[#f6c85f]/15">
              <span><strong>Shiloh</strong> asked for help</span>
              <span className="font-bold text-[#a66f00]">Review</span>
            </li>
          </ul>
        </Card>
        <Card title="Family pulse" icon="📈">
          <p className="text-sm leading-6 text-black/65 dark:text-white/65">
            The family completed <strong className="text-[#172033] dark:text-white">82%</strong> of this week&apos;s tasks. Keep the momentum going with a small reward tonight.
          </p>
          <Link href="/goals" className="mt-4 inline-flex text-sm font-bold text-[#ff715b] hover:underline">View family goals →</Link>
        </Card>
      </section>

      <section aria-label="Manage chores">
        <Card
          title="Manage Chores"
          icon="🧹"
          action={
            <button type="button" onClick={startCreateChore} className="text-xs font-bold text-[#ff715b] hover:underline">
              + Create Chore
            </button>
          }
        >
          {choreFormOpen && (
            <form onSubmit={saveChoreDraft} className="mb-4 flex flex-col gap-3 rounded-xl border border-white/10 p-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="text-xs font-semibold text-white/70">
                  Title
                  <input required value={choreDraft.title} onChange={(e) => setChoreDraft({ ...choreDraft, title: e.target.value })} className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#ff715b]" />
                </label>
                <label className="text-xs font-semibold text-white/70">
                  Assign to (rotates with 🔄)
                  <select value={choreDraft.assignee} onChange={(e) => setChoreDraft({ ...choreDraft, assignee: e.target.value })} className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#ff715b]">
                    {assignees.map((name) => <option key={name} value={name} className="text-black">{name}</option>)}
                  </select>
                </label>
                <label className="text-xs font-semibold text-white/70">
                  Difficulty
                  <select value={choreDraft.difficulty} onChange={(e) => setChoreDraft({ ...choreDraft, difficulty: e.target.value as Chore["difficulty"] })} className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#ff715b]">
                    {(["Easy", "Medium", "Hard"] as const).map((level) => <option key={level} value={level} className="text-black">{level}</option>)}
                  </select>
                </label>
                <label className="text-xs font-semibold text-white/70">
                  Due date
                  <input value={choreDraft.dueDate} onChange={(e) => setChoreDraft({ ...choreDraft, dueDate: e.target.value })} className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#ff715b]" />
                </label>
                <label className="text-xs font-semibold text-white/70">
                  Reward (⭐)
                  <input type="number" min={0} value={choreDraft.reward} onChange={(e) => setChoreDraft({ ...choreDraft, reward: Number(e.target.value) })} className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#ff715b]" />
                </label>
                <label className="text-xs font-semibold text-white/70">
                  Recurring
                  <select value={choreDraft.recurring} onChange={(e) => setChoreDraft({ ...choreDraft, recurring: e.target.value as Chore["recurring"] })} className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#ff715b]">
                    {(["One-time", "Daily", "Weekly"] as const).map((option) => <option key={option} value={option} className="text-black">{option}</option>)}
                  </select>
                </label>
              </div>
              <label className="text-xs font-semibold text-white/70">
                Instructions
                <textarea value={choreDraft.instructions} onChange={(e) => setChoreDraft({ ...choreDraft, instructions: e.target.value })} className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#ff715b]" rows={2} />
              </label>
              <label className="text-xs font-semibold text-white/70">
                Checklist (comma separated)
                <input value={choreDraft.checklist.join(", ")} onChange={(e) => setChoreDraft({ ...choreDraft, checklist: e.target.value.split(",").map((item) => item.trim()).filter(Boolean) })} className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#ff715b]" />
              </label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-xs font-semibold text-white/70">
                  <input type="checkbox" checked={choreDraft.requirePhoto} onChange={(e) => setChoreDraft({ ...choreDraft, requirePhoto: e.target.checked })} />
                  Require photo
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-white/70">
                  <input type="checkbox" checked={choreDraft.requireApproval} onChange={(e) => setChoreDraft({ ...choreDraft, requireApproval: e.target.checked })} />
                  Require parent approval
                </label>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="rounded-lg bg-[#ff715b] px-3 py-1.5 text-xs font-bold text-white">
                  {editingChoreId ? "Save changes" : "Create chore"}
                </button>
                <button type="button" onClick={() => setChoreFormOpen(false)} className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-bold text-white/70">
                  Cancel
                </button>
              </div>
            </form>
          )}

          <ul className="flex flex-col gap-2">
            {chores.map((chore) => (
              <li key={chore.id} className="rounded-xl border border-white/10 px-3 py-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-white">{chore.title}</p>
                    <p className="text-xs text-white/60">
                      {chore.assignee} · {chore.difficulty} · Due {chore.dueDate} · {chore.recurring} · +{chore.reward} ⭐
                      {chore.requirePhoto && " · 📷 Photo required"}
                      {chore.requireApproval && " · ✅ Needs approval"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => rotateChore(chore.id)} className="rounded-lg border border-white/15 px-2 py-1 text-[11px] font-semibold text-white/70 hover:border-[#ff715b]/50" title="Rotate assignee">🔄 Rotate</button>
                    <button type="button" onClick={() => startEditChore(chore)} className="rounded-lg border border-white/15 px-2 py-1 text-[11px] font-semibold text-white/70 hover:border-[#ff715b]/50">Edit</button>
                    <button type="button" onClick={() => duplicateChore(chore.id)} className="rounded-lg border border-white/15 px-2 py-1 text-[11px] font-semibold text-white/70 hover:border-[#ff715b]/50">Duplicate</button>
                    <button type="button" onClick={() => deleteChore(chore.id)} className="rounded-lg border border-white/15 px-2 py-1 text-[11px] font-semibold text-[#fb7185] hover:border-[#fb7185]/50">Delete</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section aria-label="Kid management">
        <Card title="Kid Management" icon="🧒">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {kids.map((kid) => (
              <div key={kid.name} className="rounded-xl border border-white/10 p-3">
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: kid.color }} aria-hidden>{kid.icon}</span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{kid.name}</p>
                    <p className="text-xs text-white/50">Age {kid.age} · Level {kid.level}</p>
                  </div>
                </div>
                <p className="text-xs text-white/60">
                  {kid.xp}/{kid.xpToNext} XP · {kid.coins} 🪙 · {kid.streak}d 🔥
                </p>
                <div className="mt-2">
                  <p className="mb-1 text-[11px] text-white/50">Weekly progress</p>
                  <ProgressBar percent={kid.weeklyProgress} />
                </div>
                <div className="mt-2">
                  <p className="mb-1 text-[11px] text-white/50">Monthly progress</p>
                  <ProgressBar percent={kid.monthlyProgress} />
                </div>
                <p className="mt-2 text-xs font-semibold text-[#fbbf24]">{kid.completion}% completion</p>
                {kid.goals.length > 0 && (
                  <p className="mt-2 text-xs text-white/60">Goals: {kid.goals.join(", ")}</p>
                )}
                <p className="mt-1 text-xs text-white/60">
                  Badges: {kid.badges.length > 0 ? kid.badges.join(", ") : "None yet"}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section aria-label="Approvals">
        <Card title="Approvals" icon="📋">
          {approvals.length === 0 && <p className="text-sm text-white/60">Nothing waiting for approval. 🎉</p>}
          <ul className="flex flex-col gap-3">
            {approvals.map((item) => (
              <li key={item.id} className="rounded-xl border border-white/10 px-3 py-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-white">
                      {item.kid} · <span className="text-white/60">{item.type}</span>
                    </p>
                    <p className="text-xs text-white/60">{item.label} · {item.submittedAt}</p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => approveItem(item.id)} className="rounded-lg bg-[#22c55e]/20 px-2 py-1 text-[11px] font-semibold text-[#22c55e]">✅ Approve</button>
                    <button type="button" onClick={() => rejectItem(item.id)} className="rounded-lg bg-[#fb7185]/20 px-2 py-1 text-[11px] font-semibold text-[#fb7185]">❌ Reject</button>
                    <button type="button" onClick={() => setFeedbackOpenId(feedbackOpenId === item.id ? null : item.id)} className="rounded-lg border border-white/15 px-2 py-1 text-[11px] font-semibold text-white/70">💬 Feedback</button>
                  </div>
                </div>
                {feedbackOpenId === item.id && (
                  <div className="mt-2 flex gap-2">
                    <input value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} placeholder="Leave feedback..." className="flex-1 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white outline-none focus:border-[#ff715b]" />
                    <button type="button" onClick={() => submitFeedback(item.id)} className="rounded-lg bg-[#ff715b] px-3 py-1.5 text-xs font-bold text-white">Send</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section aria-label="Rewards management">
        <Card
          title="Rewards Management"
          icon="🎁"
          action={
            <button type="button" onClick={() => setRewardFormOpen((open) => !open)} className="text-xs font-bold text-[#ff715b] hover:underline">
              {rewardFormOpen ? "Close" : "+ Create Reward"}
            </button>
          }
        >
          {rewardFormOpen && (
            <form onSubmit={saveRewardDraft} className="mb-4 grid grid-cols-1 gap-3 rounded-xl border border-white/10 p-4 sm:grid-cols-2">
              <label className="text-xs font-semibold text-white/70">
                Reward name
                <input required value={rewardDraft.label} onChange={(e) => setRewardDraft({ ...rewardDraft, label: e.target.value })} className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#ff715b]" />
              </label>
              <label className="text-xs font-semibold text-white/70">
                Cost (⭐)
                <input type="number" min={0} value={rewardDraft.cost} onChange={(e) => setRewardDraft({ ...rewardDraft, cost: Number(e.target.value) })} className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#ff715b]" />
              </label>
              <label className="text-xs font-semibold text-white/70">
                Availability
                <input value={rewardDraft.availability} onChange={(e) => setRewardDraft({ ...rewardDraft, availability: e.target.value })} className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#ff715b]" />
              </label>
              <label className="text-xs font-semibold text-white/70">
                Quantity (&quot;Unlimited&quot; or a number)
                <input value={rewardDraft.quantity} onChange={(e) => setRewardDraft({ ...rewardDraft, quantity: e.target.value === "Unlimited" ? "Unlimited" : Number(e.target.value) || 0 })} className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#ff715b]" />
              </label>
              <label className="text-xs font-semibold text-white/70 sm:col-span-2">
                Expiration
                <input value={rewardDraft.expiration} onChange={(e) => setRewardDraft({ ...rewardDraft, expiration: e.target.value })} className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#ff715b]" />
              </label>
              <div className="sm:col-span-2">
                <button type="submit" className="rounded-lg bg-[#ff715b] px-3 py-1.5 text-xs font-bold text-white">Create reward</button>
              </div>
            </form>
          )}
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {rewards.map((reward) => (
              <li key={reward.id} className="flex items-center justify-between rounded-xl border border-white/10 px-3 py-3 text-sm">
                <div>
                  <p className="font-semibold text-white"><span aria-hidden>{reward.icon}</span> {reward.label}</p>
                  <p className="text-xs text-white/60">
                    {reward.cost} ⭐ · {reward.availability} · Qty: {reward.quantity} · Expires: {reward.expiration}
                  </p>
                </div>
                <button type="button" onClick={() => deleteReward(reward.id)} className="rounded-lg border border-white/15 px-2 py-1 text-[11px] font-semibold text-[#fb7185] hover:border-[#fb7185]/50">Delete</button>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section aria-label="Reports" className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Daily & Monthly Progress" icon="📊">
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.1em] text-white/45">Daily</p>
          <div className="mb-3 flex flex-col gap-2">
            {dailyProgress.map((day) => (
              <div key={day.label}>
                <div className="mb-1 flex justify-between text-xs text-white/60"><span>{day.label}</span><span>{day.percent}%</span></div>
                <ProgressBar percent={day.percent} />
              </div>
            ))}
          </div>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.1em] text-white/45">Monthly</p>
          <div className="flex flex-col gap-2">
            {monthlyProgress.map((week) => (
              <div key={week.label}>
                <div className="mb-1 flex justify-between text-xs text-white/60"><span>{week.label}</span><span>{week.percent}%</span></div>
                <ProgressBar percent={week.percent} />
              </div>
            ))}
          </div>
        </Card>

        <Card title="Chore Completion" icon="🏅">
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.1em] text-white/45">Most completed</p>
          <ul className="mb-3 flex flex-col gap-1 text-sm text-white/80">
            {mostCompletedChores.map((item) => (
              <li key={item.label} className="flex justify-between"><span>{item.label}</span><span className="text-white/50">{item.count}x</span></li>
            ))}
          </ul>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.1em] text-white/45">Least completed</p>
          <ul className="flex flex-col gap-1 text-sm text-white/80">
            {leastCompletedChores.map((item) => (
              <li key={item.label} className="flex justify-between"><span>{item.label}</span><span className="text-white/50">{item.count}x</span></li>
            ))}
          </ul>
        </Card>
      </section>

      <section aria-label="Report summary" className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon="⏱️" label="Average time" value={reportSummary.averageTime} />
        <StatCard icon="🔥" label="Streak history" value={reportSummary.streakHistory} />
        <StatCard icon="🪙" label="Coins earned" value={String(reportSummary.coinsEarned)} />
        <StatCard icon="✨" label="XP earned" value={String(reportSummary.xpEarned)} />
      </section>

      <section aria-label="Family activity feed">
        <Card title="Family Activity Feed" icon="👨‍👩‍👧‍👦">
          <ul className="flex flex-col gap-3">
            {parentActivityFeed.map((entry) => (
              <li key={`${entry.time}-${entry.message}`} className="text-sm">
                <p className="text-xs font-semibold text-white/50">{entry.time}</p>
                <p className="text-white/85">{entry.message} <span className="text-[#fbbf24]">{entry.detail}</span></p>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section aria-label="Notifications">
        <Card title="Notifications" icon="🔔">
          <p className="mb-3 text-sm text-white/60">Choose which alerts you want to receive.</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {notificationTypes.map((type) => (
              <label key={type} className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2 text-sm text-white/80">
                {type}
                <input type="checkbox" checked={notificationsEnabled[type]} onChange={() => toggleNotification(type)} />
              </label>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
