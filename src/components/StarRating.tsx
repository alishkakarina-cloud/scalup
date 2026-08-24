import { Star } from "lucide-react";

export function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <Star size={14} className="fill-amber-400 text-amber-400" />
      <span className="text-sm font-semibold text-navy-900">{rating.toFixed(1)}</span>
    </div>
  );
}
