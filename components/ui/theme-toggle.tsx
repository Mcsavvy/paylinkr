"use client";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";
import { Button } from "./button";
import * as React from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const nextTheme =
    resolvedTheme === "dark"
      ? "light"
      : resolvedTheme === "light"
      ? "system"
      : "dark";
  const icon =
    resolvedTheme === "dark" ? (
      <Moon size={20} />
    ) : resolvedTheme === "light" ? (
      <Sun size={20} />
    ) : (
      <Laptop size={20} />
    );
  const label =
    resolvedTheme === "dark"
      ? "Switch to light mode"
      : resolvedTheme === "light"
      ? "Switch to system mode"
      : "Switch to dark mode";

  return (
    <Button
      variant="icon"
      size="icon"
      aria-label={label}
      onClick={() => setTheme(nextTheme)}
      title={label}
    >
      {icon}
    </Button>
  );
}
