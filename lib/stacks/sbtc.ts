import { SbtcApiClientTestnet } from "sbtc";

// Create a singleton instance of the sBTC testnet client
let sbtcClientInstance: SbtcApiClientTestnet | null = null;
const sbtcContract = process.env.NEXT_PUBLIC_SBTC_CONTRACT;
const sbtcApiUrl = process.env.NEXT_PUBLIC_SBTC_API_URL;
const btcApiUrl = process.env.NEXT_PUBLIC_BTC_API_URL;
const stxApiUrl = process.env.NEXT_PUBLIC_STX_API_URL;

console.log("sbtcContract", sbtcContract);
console.log("sbtcApiUrl", sbtcApiUrl);
console.log("btcApiUrl", btcApiUrl);
console.log("stxApiUrl", stxApiUrl);

/**
 * Returns a singleton instance of the sBTC testnet client
 */
export function getSbtcClient(): SbtcApiClientTestnet {
  if (!sbtcClientInstance) {
    sbtcClientInstance = new SbtcApiClientTestnet({
      sbtcContract,
      sbtcApiUrl,
      btcApiUrl,
      stxApiUrl,
    });
  }
  return sbtcClientInstance;
}

/**
 * Fetches the sBTC balance for a given Stacks address
 * @param stxAddress - The Stacks address to check
 * @returns Promise resolving to the sBTC balance as a string
 */
export async function fetchSbtcBalance(stxAddress: string): Promise<string> {
  const client = getSbtcClient();
  try {
    const balance = await client.fetchSbtcBalance(stxAddress);
    return balance.toString();
  } catch (error) {
    console.error("Error fetching sBTC balance:", error);
    throw error;
  }
}

/**
 * Fetches information about sBTC signers
 * @returns Promise with signers information
 */
export async function fetchSignersInfo() {
  const client = getSbtcClient();
  try {
    const publicKey = await client.fetchSignersPublicKey();
    const address = await client.fetchSignersAddress();
    return { publicKey, address };
  } catch (error) {
    console.error("Error fetching signers info:", error);
    throw error;
  }
}

/**
 * Fetches the current Bitcoin fee rate
 * @param priority - Fee priority: 'low', 'medium', or 'high'
 * @returns Promise resolving to the fee rate
 */
export async function fetchBtcFeeRate(
  priority: "low" | "medium" | "high" = "medium"
) {
  const client = getSbtcClient();
  try {
    const feeRate = await client.fetchFeeRate(priority);
    return feeRate;
  } catch (error) {
    console.error("Error fetching BTC fee rate:", error);
    throw error;
  }
}
