import { Star } from "lucide-react";

export function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <Star size={14} strokeWidth={1.5} className="fill-cream text-cream" />
      <span className="text-sm font-bold text-cream">{rating.toFixed(1)}</span>
    </div>
  );
}
