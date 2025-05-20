import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function LandingFinalCTA() {
  return (
    <section className="w-full py-20 px-4 md:px-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-2xl mx-auto rounded-2xl bg-gradient-to-br from-[var(--primary)] via-[var(--accent)] to-[var(--primary)] shadow-xl p-12 flex flex-col items-center text-center"
      >
        <h2 className="text-3xl font-bold text-[color:var(--primary-foreground)] mb-3">
          Ready to get started?
        </h2>
        <p className="text-lg text-[color:var(--accent-foreground)] mb-8">
          Create your first Paylinkr in seconds, or explore the dashboard to see
          how it works.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <button className="bg-[color:var(--background)] text-[color:var(--primary)] font-semibold px-8 py-3 rounded-full shadow hover:bg-[color:var(--muted)] transition text-lg flex items-center justify-center gap-2">
            Create Your First Paylinkr <ArrowRight className="w-5 h-5" />
          </button>
          <Link
            href="/dashboard"
            className="text-[color:var(--primary-foreground)]/80 hover:text-[color:var(--primary-foreground)] underline text-base flex items-center justify-center"
          >
            Explore the Dashboard
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
