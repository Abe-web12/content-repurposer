"use client";

import { motion } from "framer-motion";

// TODO: Replace hardcoded stats with real data from the database once the app
// has active users. These are launch-day placeholders.
const STATS = [
  { value: "200+", label: "active users" },
  { value: "3", label: "output formats" },
  { value: "4", label: "input sources" },
  { value: "60s", label: "average generation" },
] as const;

export function SocialProof() {
  return (
    <section className="border-y border-surface-3 bg-surface-1">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-center sm:gap-16 sm:text-left"
        >
          {STATS.map((stat) => (
            <Stat key={stat.label} value={stat.value} label={stat.label} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl font-bold text-text-primary sm:text-3xl">{value}</p>
      <p className="mt-1 text-sm text-text-muted">{label}</p>
    </div>
  );
}
