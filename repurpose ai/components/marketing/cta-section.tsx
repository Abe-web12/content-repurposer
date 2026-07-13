import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="border-t border-surface-3 bg-surface-1">
      <div className="mx-auto max-w-4xl px-5 py-24 text-center sm:py-32">
        <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          Stop creating from scratch. Start repurposing.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-text-secondary">
          Three free generations. No credit card. See the quality for yourself.
        </p>
        <Button size="xl" className="mt-8" asChild>
          <Link href="/signup">
            Create free account
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
