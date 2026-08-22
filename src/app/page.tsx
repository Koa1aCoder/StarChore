"use client";

import { useState } from "react";
import Greeting from "@/components/greeting";
import FamilyMood from "@/components/family-mood";
import FamilyPoll from "@/components/family-poll";
import { Card, ProgressBar, StatCard } from "@/components/ui";
import WhosHome from "@/components/whos-home";
import {
  achievements,
  announcement,
  celebrationCard,
  celebrations,
  dinnerPoll,
  familyActivityFeed,
  familyGoals,
  familyMembers,
  familyMessage,
  familyRewards,
  familyStreak,
  familyUpdates,
  featuredGoal,
  helpRequests,
  homeStatus,
  moodCheckIns,
  moodOptions,
  notifications,
  quickLists,
  reminders,
  smartSuggestion,
  starBalances,
  todayOverview,
  todayTasks,
  upcomingEvents,
  weeklyProgress,
  whosHome,
} from "@/lib/home-data";

type Role = "kid" | "parent";

export default function Home() {
  const [role, setRole] = useState<Role>("kid");

  return (
    <div className="flex flex-col gap-6 pb-24 sm:gap-8 md:pb-6">
      <section className="relative overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#2563eb_0%,#172554_55%,#1d4ed8_100%)] px-6 py-7 text-white shadow-[0_18px_40px_rgba(37,99,235,0.28)] sm:px-8 sm:py-9">
        <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full border-[18px] border-[#fbbf24]/25" />
        <div className="absolute right-16 top-10 h-3 w-3 rounded-full bg-[#fbbf24] shadow-[0_0_18px_rgba(251,191,36,0.8)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.18),_transparent_30%)]" />
        <div className="relative max-w-xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#fbbf24]">Saturday, August 15</p>
          <Greeting name="Praise" />
          <p className="mt-2 max-w-md text-sm leading-6 text-white/80">{familyMessage}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button type="button" className="rounded-xl bg-[#22c55e] px-4 py-2.5 text-sm font-bold text-white shadow-[0_8px_18px_rgba(34,197,94,0.25)] transition-transform hover:-translate-y-0.5">Add a win <span aria-hidden>＋</span></button>
            <span className="text-xs font-medium text-white/70">840 stars earned together</span>
          </div>
          <div className="mt-5 inline-flex rounded-xl border border-white/20 bg-white/10 p-1 text-xs font-semibold">
            {(["kid", "parent"] as Role[]).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={role === option}
                onClick={() => setRole(option)}
                className={`rounded-lg px-3 py-1.5 capitalize transition-colors ${
                  role === option ? "bg-white text-[#172554]" : "text-white/70 hover:text-white"
                }`}
              >
                {option} view
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* TOP: today's overview + family streak */}
      <section aria-label="Today's overview" className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {todayOverview.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section aria-label="Family streak">
        <Card title="Family Streak" icon="🔥">
          <p className="text-2xl font-bold text-white">{familyStreak.days} DAYS TOGETHER</p>
          <p className="mt-1 text-sm text-white/70">{familyStreak.message}</p>
          <p className="mt-3 text-xs font-semibold text-[#fbbf24]">
            Next milestone: {familyStreak.nextMilestone} days
          </p>
        </Card>
      </section>

      {/* MIDDLE: my day, help hub, coming up */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card title="Today's Tasks" icon="📋" className="lg:col-span-2">
          <ul className="flex flex-col gap-2">
            {todayTasks.map((task) => (
              <li
                key={task.label}
                className="flex items-center gap-3 rounded-lg border border-black/5 px-3 py-2 text-sm dark:border-white/10"
              >
                <span aria-hidden>{task.done ? "✅" : "⬜"}</span>
                <span
                  className={
                    task.done
                      ? "flex-1 text-black/40 line-through dark:text-white/40"
                      : "flex-1"
                  }
                >
                  {task.label}
                </span>
                <span className="rounded-full bg-black/5 px-2 py-0.5 text-[11px] text-black/60 dark:bg-white/10 dark:text-white/60">
                  {task.category}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Need a Hand?" icon="🤝" action={<a href="/help-hub" className="text-xs font-semibold text-[#fbbf24] hover:underline">View All</a>}>
          <ul className="flex flex-col gap-3">
            {helpRequests.map((request) => (
              <li key={request.task} className="flex items-center gap-3 text-sm">
                <span className="text-lg" aria-hidden>{request.icon}</span>
                <div className="min-w-0">
                  <p className="font-semibold">{request.name}</p>
                  <p className="text-xs text-white/60">
                    {request.task} — ~{request.minutes} min
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {role === "parent" && (
        <section aria-label="Smart suggestions">
          <Card title="HomeBase Suggests" icon="💡">
            <p className="text-sm font-semibold text-white">{smartSuggestion.title}</p>
            <p className="mt-1 text-sm text-white/70">{smartSuggestion.detail}</p>
            <a
              href={smartSuggestion.actionHref}
              className="mt-3 inline-block rounded-lg bg-[#ff715b] px-3 py-1.5 text-xs font-bold text-white transition-transform hover:-translate-y-0.5"
            >
              {smartSuggestion.actionLabel}
            </a>
          </Card>
        </section>
      )}

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card title="Upcoming" icon="📅" className="lg:col-span-2">
          <ul className="flex flex-col gap-2">
            {upcomingEvents.map((event) => (
              <li
                key={event.label}
                className="flex items-center justify-between rounded-lg border border-black/5 px-3 py-2 text-sm dark:border-white/10"
              >
                <span className="font-medium">{event.label}</span>
                <span className="text-black/60 dark:text-white/60">
                  {event.when}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Coming Soon" icon="🎉">
          <ul className="flex flex-col gap-2">
            {celebrations.map((item) => (
              <li key={item.label} className="flex items-center justify-between text-sm">
                <span>
                  <span aria-hidden>{item.icon}</span> {item.label}
                </span>
                <span className="text-white/60">{item.when}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* LOWER: Chores, family goal, achievements */}
      <section aria-label="Family members">
        <Card title="Family Crew" icon="👨‍👩‍👧">
          <div className="flex flex-col gap-5">
            {["Adults", "Kids"].map((group) => (
              <div key={group}>
                <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-black/45 dark:text-white/45">
                  {group}
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {familyMembers.filter((member) => member.group === group).map((member) => (
                    <div
                      key={member.name}
                      className="flex items-center gap-3 rounded-xl border border-black/5 bg-[#fafbfe] px-3 py-3 dark:border-white/10 dark:bg-white/5"
                    >
                      <span
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                        style={{ backgroundColor: member.color }}
                        aria-hidden
                      >
                        {member.icon}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{member.name}</p>
                        <p className="text-xs text-black/50 dark:text-white/50">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card title="Who's Home" icon="🏠">
          <WhosHome people={whosHome} />
        </Card>

        <Card title="Reminders" icon="📌">
          <ul className="flex flex-col gap-2 text-sm">
            {reminders.map((reminder) => (
              <li key={reminder}>{reminder}</li>
            ))}
          </ul>
        </Card>

        <Card title="Star Balances" icon="⭐">
          <ul className="flex flex-col gap-2">
            {starBalances.map((person) => (
              <li
                key={person.name}
                className="flex items-center justify-between text-sm"
              >
                <span className="font-medium">{person.name}</span>
                <span className="text-black/60 dark:text-white/60">
                  {person.stars} ⭐ · {person.streak}d 🔥
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section aria-label="Featured family goal">
        <Card title="Family Goal" icon="🎯">
          <p className="text-lg font-bold text-white">
            <span aria-hidden>{featuredGoal.icon}</span> {featuredGoal.label}
          </p>
          <p className="mt-1 text-sm font-semibold text-[#fbbf24]">{featuredGoal.percent}% complete</p>
          <div className="mt-2">
            <ProgressBar percent={featuredGoal.percent} />
          </div>
          <p className="mt-2 text-xs text-white/60">
            {featuredGoal.membersDone}/{featuredGoal.membersTotal} family members completed their goal.
          </p>
        </Card>
      </section>

      <section aria-label="Family goals">
        <Card title="Family Fund Goals" icon="🎯">
          <ul className="flex flex-col gap-4">
            {familyGoals.map((goal) => (
              <li key={goal.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <p className="font-medium">{goal.label}</p>
                  <p className="text-black/60 dark:text-white/60">
                    {goal.current} / {goal.target} ⭐
                  </p>
                </div>
                <ProgressBar percent={(goal.current / goal.target) * 100} />
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Card title="Recent Achievements" icon="🏆">
          <ul className="flex flex-col gap-2">
            {achievements.map((achievement) => (
              <li key={achievement.label} className="text-sm">
                <p className="font-medium">{achievement.label}</p>
                <p className="text-xs text-black/60 dark:text-white/60">
                  {achievement.detail}
                </p>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Family Rewards" icon="🎁">
          <ul className="flex flex-col gap-4">
            {familyRewards.map((reward) => (
              <li key={reward.label}>
                <p className="mb-1 text-sm font-medium">{reward.label}</p>
                <ProgressBar percent={(reward.current / reward.target) * 100} />
                <p className="mt-1 text-xs text-black/60 dark:text-white/60">
                  {reward.current} / {reward.target} stars
                </p>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {role === "kid" && (
        <section aria-label="Celebration">
          <Card title="Nice Work, Praise!" icon="🎉">
            <p className="text-sm text-white/80">{celebrationCard.message}</p>
            <p className="mt-2 text-lg font-bold text-[#fbbf24]">+{celebrationCard.stars} ⭐</p>
          </Card>
        </section>
      )}

      {/* OPTIONAL / PERSONALIZED */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Family Notice" icon="📣">
          <p className="text-sm font-semibold text-white">{announcement.title}</p>
          <p className="mt-1 text-sm text-white/70">{announcement.detail}</p>
          <button type="button" className="mt-3 rounded-lg bg-[#ff715b] px-3 py-1.5 text-xs font-bold text-white transition-transform hover:-translate-y-0.5">
            {announcement.actionLabel}
          </button>
        </Card>

        <Card title="What Should We Have for Dinner?" icon="🗳️">
          <FamilyPoll question={dinnerPoll.question} options={dinnerPoll.options} />
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Family Lists" icon="🛒" action={<a href="/family" className="text-xs font-semibold text-[#fbbf24] hover:underline">View Lists</a>}>
          <ul className="flex flex-col gap-2">
            {quickLists.map((list) => (
              <li key={list.label} className="flex items-center justify-between text-sm">
                <span>
                  <span aria-hidden>{list.icon}</span> {list.label}
                </span>
                <span className="text-white/60">{list.count} items</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="How's Everyone Doing?" icon="💙">
          <FamilyMood options={moodOptions} checkIns={moodCheckIns} />
        </Card>
      </section>

      {role === "parent" && (
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card title="Home Status" icon="🏡">
            <ul className="flex flex-col gap-2">
              {homeStatus.map((item) => (
                <li key={item.label} className="flex items-center justify-between text-sm">
                  <span>
                    <span aria-hidden>{item.icon}</span> {item.label}
                  </span>
                  <span className="text-white/60">{item.status}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Recent Activity" icon="🔔" action={<a href="/progress" className="text-xs font-semibold text-[#fbbf24] hover:underline">View All</a>}>
            <ul className="flex flex-col gap-2">
              {notifications.map((item) => (
                <li key={item.label} className="text-sm">
                  <p>{item.label}</p>
                  <p className="text-xs text-white/50">{item.time}</p>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}

      {role === "parent" && (
        <section aria-label="Family activity feed">
          <Card title="Family Activity" icon="👨‍👩‍👧‍👦">
            <ul className="flex flex-col gap-3">
              {familyActivityFeed.map((entry) => (
                <li key={`${entry.time}-${entry.target}`} className="text-sm">
                  <p className="text-xs font-semibold text-white/50">{entry.time}</p>
                  <p>
                    <span className="font-medium">{entry.author}</span> {entry.action}{" "}
                    <span className="font-medium">{entry.target}</span>{" "}
                    {entry.detail && <span className="text-[#fbbf24]">{entry.detail}</span>}
                  </p>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card title="Family Updates" icon="💬" className="lg:col-span-3">
          <ul className="flex flex-col gap-3">
            {familyUpdates.map((update) => (
              <li key={update.message} className="text-sm">
                <p>
                  <span className="font-medium">{update.author}</span>{" "}
                  {update.message}
                </p>
                <p className="text-xs text-black/60 dark:text-white/60">
                  {update.time}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section aria-label="Family progress">
        <Card title="Family Progress" icon="📊">
          <div className="flex items-end justify-between gap-2">
            {weeklyProgress.map((day) => (
              <div
                key={day.day}
                className="flex flex-1 flex-col items-center gap-1"
              >
                <div className="flex h-24 w-full items-end overflow-hidden rounded-md bg-black/5 dark:bg-white/10">
                  <div
                    className="w-full rounded-md bg-indigo-600"
                    style={{ height: `${day.percent}%` }}
                  />
                </div>
                <span className="text-[11px] text-black/60 dark:text-white/60">
                  {day.day}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <button
        type="button"
        className="fixed bottom-20 right-4 z-10 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-indigo-500 sm:bottom-6 sm:right-6 md:bottom-6"
      >
        + Quick Add
      </button>
    </div>
  );
}
