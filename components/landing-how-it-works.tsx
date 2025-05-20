import { Pencil, QrCode, MousePointerClick, Bell } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Pencil,
    title: "Create a Paylinkr",
    desc: "Set the amount and add a description for your payment request.",
  },
  {
    icon: QrCode,
    title: "Share your link or QR code",
    desc: "Send your PayTag as a link or QR code to anyone, anywhere.",
  },
  {
    icon: MousePointerClick,
    title: "Recipient pays with one click",
    desc: "The payer simply clicks or scans and approves the payment.",
  },
  {
    icon: Bell,
    title: "Instant notification when paid",
    desc: "Get notified immediately when your payment is complete.",
  },
];

export function LandingHowItWorks() {
  return (
    <section className="w-full container mx-auto py-20 px-4 md:px-8">
      <h2 className="text-3xl font-bold text-center mb-12 text-[color:var(--foreground)]">
        How It Works
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: 0.7,
              delay: i * 0.15,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="flex flex-col items-center text-center"
          >
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[color:var(--primary)]/10 mb-4">
              <step.icon className="w-7 h-7 text-[color:var(--primary)]" />
            </div>
            <h3 className="text-lg font-semibold mb-1 text-[color:var(--foreground)]">
              {step.title}
            </h3>
            <p className="text-[color:var(--muted-foreground)] text-base">
              {step.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
