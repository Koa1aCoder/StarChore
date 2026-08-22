import Link from "next/link";
import { Card } from "@/components/ui";
import { familyMembers } from "@/lib/home-data";

export default function FamilyPage() {
  return (
    <div className="flex flex-col gap-6 pb-24 sm:gap-8 md:pb-6">
      <header>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#ff715b]">Your people</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Family profiles</h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-black/60 dark:text-white/60">Everyone has a place in the family rhythm. Pick a mode to see the day from their perspective.</p>
      </header>
      <section aria-label="Family profiles" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {familyMembers.map((member) => (
          <Card key={member.name} title={member.name} icon="👤">
            <div className="flex items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold text-white" style={{ backgroundColor: member.color }}>{member.icon}</span>
              <div>
                <p className="text-sm font-semibold">{member.role}</p>
                <p className="text-xs text-white/55">Ready for today&apos;s wins</p>
              </div>
            </div>
            <Link href={member.group === "Adults" ? "/parents" : "/kids"} className="mt-5 inline-flex w-full items-center justify-between rounded-xl bg-[#fff1ed] px-3 py-2.5 text-xs font-bold text-[#e85d45] transition-transform hover:-translate-y-0.5 dark:bg-[#ff715b]/15 dark:text-[#ff9b8a]">
              <span>Enter {member.group === "Adults" ? "parent" : "kid"} mode</span><span aria-hidden>→</span>
            </Link>
          </Card>
        ))}
      </section>
    </div>
  );
}
