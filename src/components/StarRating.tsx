import { Star } from "lucide-react";

export function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <Star size={14} strokeWidth={1.5} className="fill-lime-500 text-lime-500" />
      <span className="text-sm font-bold text-paper">{rating.toFixed(1)}</span>
    </div>
  );
}
