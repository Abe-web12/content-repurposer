"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PLANS, type PlanKey } from "@/lib/constants/plans";
import { cn } from "@/lib/utils";

export function PricingSection() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:py-32" id="pricing">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-600">Pricing</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          Start free. Scale when you need to.
        </h2>
      </motion.div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(Object.keys(PLANS) as PlanKey[]).map((key, i) => {
          const plan = PLANS[key];

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={cn(
                "relative rounded-2xl border p-8",
                plan.popular ? "border-brand-500 ring-1 ring-brand-200" : "border-surface-3"
              )}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-6 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
                  Popular
                </span>
              )}

              <h3 className="text-lg font-semibold text-text-primary">{plan.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-text-primary">${plan.price}</span>
                {plan.price > 0 && <span className="text-text-muted">/mo</span>}
              </div>
              <p className="mt-2 text-sm text-text-secondary">{plan.generationsLabel}</p>

              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-text-secondary">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                className="mt-8 w-full"
                variant={plan.popular ? "default" : "outline"}
                size="lg"
                asChild
              >
                <Link href="/signup">
                  {key === "free" ? "Get started free" : `Start with ${plan.name}`}
                </Link>
              </Button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
