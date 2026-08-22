"use client";

function getGreeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function Greeting({ name }: { name: string }) {
  return (
    <h1 className="text-2xl font-semibold sm:text-3xl">
      {/* time-of-day text depends on the client's clock, so it may differ from the server render */}
      <span suppressHydrationWarning>{getGreeting(new Date().getHours())}</span>
      , {name}! 👋
    </h1>
  );
}
