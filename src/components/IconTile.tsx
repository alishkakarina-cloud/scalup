import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Package } from "lucide-react";

export function IconTile({
  iconName,
  className = "",
  size = 28,
}: {
  iconName: string;
  seed?: string;
  className?: string;
  size?: number;
}) {
  const IconComponent = (Icons as unknown as Record<string, LucideIcon>)[iconName] ?? Package;

  return (
    <div
      className={`flex items-center justify-center rounded-xl border border-cream/5 bg-cream/[0.03] text-cream/75 ${className}`}
    >
      <IconComponent size={size} strokeWidth={1.5} />
    </div>
  );
}
