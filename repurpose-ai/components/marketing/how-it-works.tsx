"use client";

import { motion } from "framer-motion";

const steps = [
  { number: "01", title: "Paste your source", description: "YouTube URL, blog link, podcast, or raw text. We extract the substance." },
  { number: "02", title: "Choose your format", description: "LinkedIn post, carousel slides, or X thread. Pick the channel that matters." },
  { number: "03", title: "Get publish-ready content", description: "AI generates in your voice. Copy, edit, and post in under 60 seconds." },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-600">How it works</p>
        <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          Three steps from idea to published content.
        </h2>
      </motion.div>

      <div className="mt-16 grid gap-12 sm:grid-cols-3">
        {steps.map((step, i) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
          >
            <span className="text-4xl font-bold text-brand-200">{step.number}</span>
            <h3 className="mt-4 text-lg font-semibold text-text-primary">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
