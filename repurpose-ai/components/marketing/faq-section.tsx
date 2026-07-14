"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  { q: "What content sources can I use?", a: "YouTube videos (via transcript), any public blog/article URL, podcast URLs, or paste raw text directly. We support any content you want to repurpose." },
  { q: "How does voice matching work?", a: "You paste 1-5 examples of your real writing. Our AI analyzes your tone, structure, and style, then generates all content to match. The more examples, the better the match." },
  { q: "Is the free plan really free?", a: "Yes. You get 3 total generations with no time limit and no credit card required. When you need more, upgrade to Starter (30/month) or Pro (unlimited)." },
  { q: "Can I cancel anytime?", a: "Absolutely. Cancel from your Settings page anytime. You keep access through the end of your billing period." },
  { q: "What makes this different from ChatGPT?", a: "Three things: multi-step pipeline (extract, analyze, then generate), voice matching from your real writing samples, and platform-specific formatting (LinkedIn hooks, tweet character limits, carousel slides)." },
  { q: "Do you store my content?", a: "Your generations are stored in your account so you can access history. Source content is processed and discarded. You can delete any generation anytime." },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="mx-auto max-w-3xl px-5 py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          Common questions
        </h2>
      </motion.div>

      <div className="mt-12 space-y-2">
        {faqs.map((faq, i) => (
          <div key={i} className="rounded-xl border border-surface-3">
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
            >
              <span className="text-sm font-semibold text-text-primary">{faq.q}</span>
              <ChevronDown className={cn("h-4 w-4 shrink-0 text-text-muted transition-transform", open === i && "rotate-180")} />
            </button>
            {open === i && (
              <div className="px-6 pb-5">
                <p className="text-sm leading-relaxed text-text-secondary">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
