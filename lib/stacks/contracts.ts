import { Cl, hexToCV, cvToHex, cvToValue } from "@stacks/transactions";

// Contract identifiers and addresses
export const TESTNET_CONTRACT_ADDRESS =
  "ST1F7QA2MDF17S807EPA36TSS8AMEFY4KA9TVGWXT";
export const PAYTAG_CONTRACT_NAME = "PayLinkr";
export const SBTC_CONTRACT_NAME = "sbtc-token";
export const SBTC_CONTRACT_TESTNET = `${TESTNET_CONTRACT_ADDRESS}.${SBTC_CONTRACT_NAME}`;
export const PAYTAG_CONTRACT_TESTNET = `${TESTNET_CONTRACT_ADDRESS}.${PAYTAG_CONTRACT_NAME}`;

// PayTag state constants
export const PAYTAG_STATE = {
  PENDING: "pending",
  PAID: "paid",
  EXPIRED: "expired",
  CANCELED: "canceled",
};

// Error constants
export const PAYTAG_ERRORS = {
  ERR_TAG_EXISTS: 100,
  ERR_NOT_PENDING: 101,
  ERR_INSUFFICIENT_FUNDS: 102,
  ERR_NOT_FOUND: 103,
  ERR_UNAUTHORIZED: 104,
  ERR_EXPIRED: 105,
  ERR_INVALID_AMOUNT: 106,
  ERR_EMPTY_MEMO: 107,
  ERR_MAX_EXPIRATION_EXCEEDED: 108,
};

// PayTag interface matching the contract's data structure
export interface PayTag {
  id: number;
  creator: string;
  recipient: string;
  amount: bigint;
  createdAt: number;
  expiresAt: number;
  memo?: string;
  state: string;
  paymentTx?: string;
}

// Function to convert a PayTag from contract representation to our TypeScript interface
export function clarityValueToPayTag(id: number, cvValue: any): PayTag {
  if (!cvValue) return null as unknown as PayTag;

  const value = cvToValue(cvValue);

  return {
    id,
    creator: value.creator,
    recipient: value.recipient,
    amount: BigInt(value.amount),
    createdAt: parseInt(value["created-at"], 10),
    expiresAt: parseInt(value["expires-at"], 10),
    memo: value.memo?.value || undefined,
    state: value.state,
    paymentTx: value["payment-tx"]?.value
      ? value["payment-tx"].value
      : undefined,
  };
}

// Function to parse error codes from contract responses
export function parsePayTagError(error: number): string {
  switch (error) {
    case PAYTAG_ERRORS.ERR_TAG_EXISTS:
      return "PayTag already exists";
    case PAYTAG_ERRORS.ERR_NOT_PENDING:
      return "PayTag is not in pending state";
    case PAYTAG_ERRORS.ERR_INSUFFICIENT_FUNDS:
      return "Insufficient funds to complete the transaction";
    case PAYTAG_ERRORS.ERR_NOT_FOUND:
      return "PayTag not found";
    case PAYTAG_ERRORS.ERR_UNAUTHORIZED:
      return "Unauthorized to perform this action";
    case PAYTAG_ERRORS.ERR_EXPIRED:
      return "PayTag has expired";
    case PAYTAG_ERRORS.ERR_INVALID_AMOUNT:
      return "Invalid amount specified";
    case PAYTAG_ERRORS.ERR_EMPTY_MEMO:
      return "Memo cannot be empty";
    case PAYTAG_ERRORS.ERR_MAX_EXPIRATION_EXCEEDED:
      return "Maximum expiration time exceeded";
    default:
      return `Unknown error (${error})`;
  }
}

// PayTag creation params type
export interface CreatePayTagParams {
  amount: bigint;
  expiresIn: bigint;
  memo?: string;
}

// PayTag fulfillment params type
export interface FulfillPayTagParams {
  id: number;
}

// PayTag cancellation params type
export interface CancelPayTagParams {
  id: number;
}
