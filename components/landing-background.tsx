import { motion } from "framer-motion";
import { useTheme } from "next-themes";

export function LandingBackground() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const bgGradient = isDark
    ? "bg-gradient-to-br from-[var(--gray-700)] via-[var(--background)] to-[var(--accent)]"
    : "bg-gradient-to-br from-[var(--gray-100)] via-[var(--background)] to-[var(--accent)]";
  const lineColor = "var(--accent)";
  const lineOpacity = isDark ? 0.2 : 0.12;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className={`fixed inset-0 -z-10 ${bgGradient} overflow-hidden`}
      aria-hidden
    >
      {/* Subtle animated lines and glows */}
      <svg
        className="absolute left-1/2 top-0 -translate-x-1/2"
        width="1200"
        height="900"
        fill="none"
      >
        <motion.path
          d="M0 0 Q600 400 1200 0"
          stroke={`url(#lineGradient)`}
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
        />
        <defs>
          <linearGradient
            id="lineGradient"
            x1="0"
            y1="0"
            x2="1200"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={lineColor} stopOpacity={lineOpacity} />
            <stop offset="1" stopColor="#00D4FF" stopOpacity={lineOpacity} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute left-1/2 top-1/3 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[color:var(--accent)]/20 blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute right-0 bottom-0 w-[400px] h-[400px] rounded-full bg-[color:var(--primary)]/20 blur-2xl opacity-40 pointer-events-none" />
    </motion.div>
  );
}
