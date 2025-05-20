import { Zap, Settings2, Wallet } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  {
    icon: Zap,
    title: "One-click payments",
    desc: "Send and receive sBTC instantly with a single tap—no friction, no waiting.",
  },
  {
    icon: Settings2,
    title: "No technical setup required",
    desc: "Anyone can use PayLinkr. No coding, no wallet configuration, just simple links.",
  },
  {
    icon: Wallet,
    title: "Direct wallet-to-wallet transfers",
    desc: "Funds move directly between wallets. No intermediaries, no custodians.",
  },
];

export function LandingKeyBenefits() {
  return (
    <section className="w-full container mx-auto py-20 px-4 md:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {benefits.map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: 0.7,
              delay: i * 0.15,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="bg-[color:var(--card)] rounded-xl shadow-lg p-8 flex flex-col items-center text-center border border-[color:var(--border)]"
          >
            <b.icon className="w-10 h-10 text-[color:var(--primary)] mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-[color:var(--foreground)]">
              {b.title}
            </h3>
            <p className="text-[color:var(--muted-foreground)] text-base">
              {b.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
