interface KidAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
}

export default function KidAvatar({ name, size = "md" }: KidAvatarProps) {
  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base",
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Generate a consistent color based on the name
  const colors = [
    "bg-primary",
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-green-500",
    "bg-orange-500",
  ];
  const colorIndex = name.charCodeAt(0) % colors.length;
  const bgColor = colors[colorIndex];

  return (
    <div
      className={`${sizeClasses[size]} ${bgColor} rounded-full flex items-center justify-center text-white font-semibold`}
      title={name}
    >
      {initials}
    </div>
  );
}
