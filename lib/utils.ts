import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a cryptocurrency amount in a human-friendly way
 * @param amount - The amount as a string (can be a large or small number)
 * @param symbol - The cryptocurrency symbol (e.g., "ETH", "BTC")
 * @returns A formatted string representation
 */
export function formatCryptoAmount(amount: string, symbol: string): string {
  // Parse the amount to a number
  let numericAmount = parseFloat(amount);

  // Handle invalid input
  if (isNaN(numericAmount)) {
    return `Invalid amount: ${amount} ${symbol}`;
  } else {
    numericAmount = numericAmount / 100_000_000;
  }

  // Format based on amount size
  let formattedAmount: string;
  // divide by 1M
  const absAmount = Math.abs(numericAmount);

  if (absAmount >= 1_000_000_000) {
    // Billions
    formattedAmount = `${(numericAmount / 1_000_000_000).toFixed(2)}B`;
  } else if (absAmount >= 1_000_000) {
    // Millions
    formattedAmount = `${(numericAmount / 1_000_000).toFixed(2)}M`;
  } else if (absAmount >= 1_000) {
    // Thousands
    formattedAmount = `${(numericAmount / 1_000).toFixed(2)}K`;
  } else if (absAmount >= 1) {
    // Regular numbers
    formattedAmount = numericAmount.toFixed(2);
  } else if (absAmount > 0) {
    // Small numbers - show up to 6 decimal places but trim trailing zeros
    const smallNumStr = numericAmount.toFixed(6);
    formattedAmount = smallNumStr.replace(/\.?0+$/, "");
  } else {
    // Zero
    formattedAmount = "0";
  }

  // Return formatted amount with symbol
  return `${formattedAmount} ${symbol}`;
}
