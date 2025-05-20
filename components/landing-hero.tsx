import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, QrCode } from "lucide-react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import walletAnimation from "@/public/wallet.json";
import { useTheme } from "next-themes";

const GRID_LINES = 16;

export function LandingHero() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const gridColor = isDark ? "var(--foreground)" : "var(--muted-foreground)";
  const gridOpacity = isDark ? 0.07 : 0.1;
  return (
    <section className="flex flex-col-reverse md:flex-row items-center justify-between gap-12 md:gap-0 min-h-[70vh] w-full container mx-auto py-16 px-4 md:px-8 overflow-hidden">
      {/* Animated full-section grid background */}
      <motion.svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        width="100%"
        height="100%"
        viewBox={`0 0 1000 700`}
        preserveAspectRatio="none"
        aria-hidden
      >
        {/* Vertical lines */}
        {[...Array(GRID_LINES)].map((_, i) => (
          <motion.line
            key={`v-${i}`}
            x1={(i * 1000) / (GRID_LINES - 1)}
            y1={0}
            x2={(i * 1000) / (GRID_LINES - 1)}
            y2={700}
            stroke={gridColor}
            strokeOpacity={gridOpacity}
            strokeWidth={1}
            initial={{ y: 0 }}
            animate={{ y: [0, Math.sin(i) * 10, 0] }}
            transition={{
              repeat: Infinity,
              duration: 4 + i * 0.2,
              ease: "easeInOut",
              delay: i * 0.1,
            }}
          />
        ))}
        {/* Horizontal lines */}
        {[...Array(GRID_LINES)].map((_, i) => (
          <motion.line
            key={`h-${i}`}
            x1={0}
            y1={(i * 700) / (GRID_LINES - 1)}
            x2={1000}
            y2={(i * 700) / (GRID_LINES - 1)}
            stroke={gridColor}
            strokeOpacity={gridOpacity}
            strokeWidth={1}
            initial={{ x: 0 }}
            animate={{ x: [0, Math.cos(i) * 10, 0] }}
            transition={{
              repeat: Infinity,
              duration: 4 + i * 0.2,
              ease: "easeInOut",
              delay: i * 0.1,
            }}
          />
        ))}
      </motion.svg>
      {/* Content */}
      <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-6 z-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[color:var(--primary)]/10 text-[color:var(--primary)] dark:text-[color:var(--pure-white)]">
            <QrCode className="w-4 h-4 mr-1 text-[color:var(--primary)]" />
            sBTC Pay Tags
          </span>
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl text-[color:var(--foreground)] leading-tight"
        >
          Request & Receive Bitcoin
          <br />
          Instantly with PayTags
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="text-lg md:text-xl text-[color:var(--muted-foreground)] max-w-xl"
        >
          PayLinkr lets you create decentralized payment requests using sBTC on
          Stacks. Share a PayTag link or QR code, get paid peer-to-peer or as a
          merchant, and track every payment securely—no middlemen, just Bitcoin.
        </motion.p>
        <div className="flex gap-4 mt-4 flex-col sm:flex-row w-full sm:w-auto justify-center md:justify-start">
          <Button
            size="lg"
            className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-[color:var(--primary-foreground)] shadow-lg"
          >
            Create PayTag <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-[color:var(--border)]"
          >
            How it works
          </Button>
        </div>
      </div>
      {/* Right: sBTC Logo Illustration */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="w-[340px] h-[340px] md:w-[420px] md:h-[420px] rounded-full bg-gradient-to-br from-[var(--primary)]/60 to-[var(--accent)]/40 shadow-2xl flex items-center justify-center relative overflow-hidden">
          <Lottie animationData={walletAnimation} loop={true} />
        </div>
      </div>
    </section>
  );
}
