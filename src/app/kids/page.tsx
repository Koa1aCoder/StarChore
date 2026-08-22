import Link from "next/link";
import { Card, ProgressBar, StatCard } from "@/components/ui";
import { todayTasks } from "@/lib/home-data";

export default function KidsPage() {
  const openTasks = todayTasks.filter((task) => !task.done);

  return (
    <div className="flex flex-col gap-6 pb-24 sm:gap-8 md:pb-6">
      <header className="relative overflow-hidden rounded-3xl bg-[#172033] px-6 py-7 text-white shadow-[0_18px_40px_rgb(23_32_51/18%)] sm:px-8 sm:py-9">
        <div className="absolute -right-10 -top-10 text-[9rem] leading-none text-[#f6c85f]/15" aria-hidden>★</div>
        <div className="relative">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#f6c85f]">Your space</p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Make today count.</h1>
          <p className="mt-2 max-w-md text-sm leading-6 text-white/70">Finish a task, earn stars, and help your family reach the next reward.</p>
        </div>
      </header>

      <section aria-label="Kid overview" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon="⭐" label="Your stars" value="320" />
        <StatCard icon="🔥" label="Your streak" value="7 days" />
        <StatCard icon="✅" label="Done this week" value="12" />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card title="Your next wins" icon="🚀" className="lg:col-span-2">
          <ul className="flex flex-col gap-2">
            {openTasks.map((task) => (
              <li key={task.label} className="flex items-center gap-3 rounded-xl border border-white/10 px-3 py-3 text-sm">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fff4d6]" aria-hidden>＋</span>
                <span className="min-w-0 flex-1 truncate font-medium text-white">{task.label}</span>
                <span className="rounded-full bg-[#fff1ed] px-2 py-1 text-[11px] font-semibold text-[#ff715b] dark:bg-[#ff715b]/15">{task.category}</span>
              </li>
            ))}
          </ul>
          <Link href="/starchore" className="mt-4 inline-flex text-sm font-bold text-[#ff715b] hover:underline">See all chores →</Link>
        </Card>
        <Card title="Next reward" icon="🎁">
          <p className="text-lg font-bold text-white">Family Game Night</p>
          <p className="mt-1 text-xs text-white/50">420 of 600 stars earned</p>
          <div className="mt-4"><ProgressBar percent={70} /></div>
          <p className="mt-3 text-sm text-white/60">Only 180 more stars to go!</p>
        </Card>
      </section>
    </div>
  );
}
