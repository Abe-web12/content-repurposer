"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import { useUsage } from "@/components/providers/usage-provider";
import { Progress } from "@/components/ui/progress";

export function UsageBadge() {
  const { plan, generationsUsed, generationsLimit, remaining, percentage, canUserGenerate } = useUsage();
  const unlimited = generationsLimit === -1;

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-indigo-600" />
          <span className="text-sm font-semibold capitalize text-gray-900">{plan}</span>
        </div>
        {!unlimited && <span className="text-xs font-medium text-gray-400">{generationsUsed}/{generationsLimit}</span>}
      </div>

      {!unlimited && <Progress value={percentage} className="mt-3 h-1.5" indicatorClassName={!canUserGenerate ? "bg-red-500" : percentage > 80 ? "bg-amber-500" : undefined} />}
      {!unlimited && <p className="mt-2 text-xs text-gray-500">{remaining} generation{remaining !== 1 ? "s" : ""} remaining</p>}
      {plan === "free" && <Link href="/upgrade" className="mt-3 inline-block text-xs font-semibold text-indigo-600 hover:text-indigo-500">Upgrade plan →</Link>}
    </div>
  );
}
