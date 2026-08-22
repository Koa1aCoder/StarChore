export type NavItem = {
  label: string;
  href: string;
  icon: string;
};

export const navItems: NavItem[] = [
  { label: "Home", href: "/", icon: "🏠" },
  { label: "Parents", href: "/parents", icon: "🔑" },
  { label: "Kids", href: "/kids", icon: "🚀" },
  { label: "Chores", href: "/starchore", icon: "⭐" },
  { label: "Help Hub", href: "/help-hub", icon: "🤝" },
  { label: "Family", href: "/family", icon: "👨‍👩‍👧" },
  { label: "Calendar", href: "/calendar", icon: "📅" },
  { label: "Goals", href: "/goals", icon: "🎯" },
  { label: "Achievements", href: "/achievements", icon: "🏆" },
  { label: "Progress", href: "/progress", icon: "📊" },
];
