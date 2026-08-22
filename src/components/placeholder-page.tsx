export default function PlaceholderPage({
  title,
  icon,
}: {
  title: string;
  icon: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-black/10 py-24 text-center dark:border-white/15">
      <span className="text-4xl" aria-hidden>
        {icon}
      </span>
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="max-w-sm text-sm text-black/60 dark:text-white/60">
        This section is coming soon. We&apos;re focusing on the Home dashboard
        first.
      </p>
    </div>
  );
}
