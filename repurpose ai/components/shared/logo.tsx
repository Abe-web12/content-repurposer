
import { cn } from "@/lib/utils";

export function Logo({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      {/* Logo mark */}
      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 shadow-sm">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className="text-white"
          aria-hidden="true"
        >
          <path
            d="M3 4.5A1.5 1.5 0 0 1 4.5 3h4A1.5 1.5 0 0 1 10 4.5v4A1.5 1.5 0 0 1 8.5 10h-4A1.5 1.5 0 0 1 3 8.5v-4Z"
            fill="currentColor"
            opacity="0.6"
          />
          <path
            d="M10 11.5a1.5 1.5 0 0 1 1.5-1.5h4a1.5 1.5 0 0 1 1.5 1.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a1.5 1.5 0 0 1-1.5-1.5v-4Z"
            fill="currentColor"
            opacity="0.6"
          />
          <path
            d="M10 4.5A1.5 1.5 0 0 1 11.5 3h4A1.5 1.5 0 0 1 17 4.5v4A1.5 1.5 0 0 1 15.5 10h-4A1.5 1.5 0 0 1 10 8.5v-4Z"
            fill="currentColor"
          />
          <path
            d="M3 11.5A1.5 1.5 0 0 1 4.5 10h4a1.5 1.5 0 0 1 1.5 1.5v4A1.5 1.5 0 0 1 8.5 17h-4A1.5 1.5 0 0 1 3 15.5v-4Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {!compact && (
        <span className="text-lg font-bold tracking-tight text-text-primary">
          RepurposeAI
        </span>
      )}
    </div>
  );
}