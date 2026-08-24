import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Package } from "lucide-react";

const palette = [
  "bg-orange-50 text-accent-600",
  "bg-blue-50 text-blue-600",
  "bg-emerald-50 text-emerald-600",
  "bg-violet-50 text-violet-600",
  "bg-amber-50 text-amber-600",
  "bg-rose-50 text-rose-600",
];

function hashString(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

export function IconTile({
  iconName,
  seed,
  className = "",
  size = 28,
}: {
  iconName: string;
  seed?: string;
  className?: string;
  size?: number;
}) {
  const IconComponent = (Icons as unknown as Record<string, LucideIcon>)[iconName] ?? Package;
  const colorClass = palette[hashString(seed ?? iconName) % palette.length];

  return (
    <div
      className={`flex items-center justify-center rounded-xl ${colorClass} ${className}`}
    >
      <IconComponent size={size} strokeWidth={1.75} />
    </div>
  );
}
