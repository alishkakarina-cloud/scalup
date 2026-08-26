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
      className={`flex items-center justify-center rounded-xl border border-cream/10 text-cream/75 shadow-[inset_0_2px_6px_rgba(0,0,0,0.35)] ${className}`}
      style={{ background: "radial-gradient(circle at 30% 25%, var(--color-surface-light), var(--color-surface) 80%)" }}
    >
      <IconComponent size={size} strokeWidth={1.5} />
    </div>
  );
}
