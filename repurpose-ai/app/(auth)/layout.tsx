import Link from "next/link";
import { Logo } from "@/components/shared/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      <div aria-hidden="true" className="pointer-events-none absolute -left-56 -top-72 h-[38rem] w-[38rem] rounded-full bg-indigo-100 opacity-40 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-80 -right-48 h-[42rem] w-[42rem] rounded-full bg-purple-100 opacity-40 blur-3xl" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[1fr_1.1fr]">
        <section className="hidden flex-col justify-between px-12 py-10 lg:flex">
          <Link href="/"><Logo /></Link>

          <div className="max-w-lg pb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-indigo-600">
              One source. Every channel.
            </p>
            <h1 className="mt-6 text-balance font-display text-5xl font-bold leading-[1.05] tracking-tight text-gray-900">
              Turn your best ideas into content people actually read.
            </h1>
            <p className="mt-6 max-w-[55ch] text-lg leading-8 text-gray-500">
              Repurpose videos, articles, and podcasts into LinkedIn posts, carousels, and X threads matched to your voice.
            </p>
          </div>

          <p className="text-sm text-gray-400">Built for founders, marketers, and content teams.</p>
        </section>

        <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-10 lg:hidden">
              <Link href="/"><Logo /></Link>
            </div>
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
