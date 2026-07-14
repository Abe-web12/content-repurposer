"use client";

import { motion } from "framer-motion";
import { Layers, Linkedin, Mic2, Sparkles, Twitter, Zap } from "lucide-react";

const features = [
  { icon: Sparkles, title: "Multi-step AI pipeline", description: "Extract, analyze, then generate. Not a single-prompt wrapper." },
  { icon: Mic2, title: "Voice matching", description: "Paste your writing examples. Every output matches your tone." },
  { icon: Linkedin, title: "LinkedIn-native formatting", description: "Hook-first posts, carousel slides, engagement-optimized structure." },
  { icon: Twitter, title: "Thread generation", description: "5-9 tweets, each under 280 chars, each standalone-worthy." },
  { icon: Layers, title: "Carousel content", description: "Slide-by-slide copy for PDF carousels. Headlines and body per slide." },
  { icon: Zap, title: "Chrome extension", description: "Repurpose any article while reading it. One click from your browser." },
];

export function FeaturesGrid() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-600">Features</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          Built for people who publish weekly.
        </h2>
      </motion.div>

      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="group rounded-2xl border border-surface-3 bg-white p-6 transition-shadow hover:shadow-soft"
          >
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-100">
              <feature.icon className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-text-primary">{feature.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
