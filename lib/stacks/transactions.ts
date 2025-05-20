import {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  FungibleConditionCode,
  Cl,
  createAsset,
  fetchCallReadOnlyFunction as callReadOnlyFunction,
  cvToValue,
} from "@stacks/transactions";
import {
  PAYTAG_CONTRACT_TESTNET,
  SBTC_CONTRACT_TESTNET,
  CreatePayTagParams,
  FulfillPayTagParams,
  CancelPayTagParams,
  PayTag,
  clarityValueToPayTag,
} from "./contracts";

// Network configuration
export const NETWORK = "testnet"; // or 'mainnet' for production

/**
 * Create a new PayTag
 * @param params The parameters for creating a PayTag
 * @param senderKey The private key of the sender
 * @returns Transaction ID
 */
export async function createPayTag(
  params: CreatePayTagParams,
  senderKey: string,
  nonce?: number
): Promise<string> {
  // Convert parameters to Clarity values
  const functionArgs = [
    Cl.uint(params.amount), // amount
    Cl.uint(params.expiresIn), // expires_in
    params.memo ? Cl.some(Cl.stringAscii(params.memo)) : Cl.none(), // memo (optional)
  ];

  // Build transaction
  const [contractAddress, contractName] = PAYTAG_CONTRACT_TESTNET.split(".");
  const txOptions = {
    contractAddress,
    contractName,
    functionName: "create-pay-tag",
    functionArgs,
    senderKey,
    validateWithAbi: true,
    network: NETWORK as "testnet",
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
    nonce: nonce !== undefined ? nonce : undefined,
  };

  // Create the transaction
  const transaction = await makeContractCall(txOptions);

  // Broadcast to network
  const result = await broadcastTransaction({ transaction, network: NETWORK });

  // @ts-expect-error ...
  if (result.error) {
    // @ts-expect-error ...
    throw new Error(`Failed to create PayTag: ${result.error}`);
  }

  return result.txid;
}

/**
 * Fulfill a PayTag (pay the recipient)
 * @param params The parameters for fulfilling a PayTag
 * @param senderKey The private key of the sender
 * @returns Transaction ID
 */
export async function fulfillPayTag(
  { id }: FulfillPayTagParams,
  senderKey: string,
  nonce?: number
): Promise<string> {
  // Fetch the PayTag first to create proper post conditions
  const payTag = await getPayTag(id);
  if (!payTag) {
    throw new Error("PayTag not found");
  }

  // Set up post conditions to ensure sBTC transfer
  const [sbtcAddress, sbtcContractName] = SBTC_CONTRACT_TESTNET.split(".");
  const assetInfo = createAsset(sbtcAddress, sbtcContractName, "sbtc");

  // Post condition to ensure the amount of sBTC is sent
  const postConditions = [
    FungiblePostCondition(
      payTag.creator,
      FungibleConditionCode.Equal,
      payTag.amount,
      assetInfo
    ),
  ];

  // Build transaction
  const [contractAddress, contractName] = PAYTAG_CONTRACT_TESTNET.split(".");
  const txOptions = {
    contractAddress,
    contractName,
    functionName: "fulfill-pay-tag",
    functionArgs: [Cl.uint(id)],
    senderKey,
    validateWithAbi: true,
    network: NETWORK,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
    postConditions,
    nonce: nonce !== undefined ? nonce : undefined,
  };

  // Create the transaction
  const transaction = await makeContractCall(txOptions);

  // Broadcast to network
  const result = await broadcastTransaction(transaction, NETWORK);

  if (result.error) {
    throw new Error(`Failed to fulfill PayTag: ${result.error}`);
  }

  return result.txid;
}

/**
 * Cancel a PayTag (creator only)
 * @param params The parameters for canceling a PayTag
 * @param senderKey The private key of the sender
 * @returns Transaction ID
 */
export async function cancelPayTag(
  { id }: CancelPayTagParams,
  senderKey: string,
  nonce?: number
): Promise<string> {
  // Build transaction
  const [contractAddress, contractName] = PAYTAG_CONTRACT_TESTNET.split(".");
  const txOptions = {
    contractAddress,
    contractName,
    functionName: "cancel-pay-tag",
    functionArgs: [Cl.uint(id)],
    senderKey,
    validateWithAbi: true,
    network: NETWORK,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
    nonce: nonce !== undefined ? nonce : undefined,
  };

  // Create the transaction
  const transaction = await makeContractCall(txOptions);

  // Broadcast to network
  const result = await broadcastTransaction(transaction, NETWORK);

  if (result.error) {
    throw new Error(`Failed to cancel PayTag: ${result.error}`);
  }

  return result.txid;
}

/**
 * Mark a PayTag as expired
 * @param id The ID of the PayTag to mark as expired
 * @param senderKey The private key of the sender
 * @returns Transaction ID
 */
export async function markPayTagExpired(
  id: number,
  senderKey: string,
  nonce?: number
): Promise<string> {
  // Build transaction
  const [contractAddress, contractName] = PAYTAG_CONTRACT_TESTNET.split(".");
  const txOptions = {
    contractAddress,
    contractName,
    functionName: "mark-expired",
    functionArgs: [Cl.uint(id)],
    senderKey,
    validateWithAbi: true,
    network: NETWORK,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
    nonce: nonce !== undefined ? nonce : undefined,
  };

  // Create the transaction
  const transaction = await makeContractCall(txOptions);

  // Broadcast to network
  const result = await broadcastTransaction(transaction, NETWORK);

  if (result.error) {
    throw new Error(`Failed to mark PayTag as expired: ${result.error}`);
  }

  return result.txid;
}

/**
 * Fetch a PayTag by ID
 * @param id The ID of the PayTag to fetch
 * @returns The PayTag data
 */
export async function getPayTag(id: number): Promise<PayTag | null> {
  try {
    const [contractAddress, contractName] = PAYTAG_CONTRACT_TESTNET.split(".");
    const functionName = "get-pay-tag";
    const functionArgs = [Cl.uint(id)];

    const options = {
      contractAddress,
      contractName,
      functionName,
      functionArgs,
      network: NETWORK,
      senderAddress: contractAddress,
    };

    const result = await callReadOnlyFunction(options);
    const value = cvToValue(result);

    if (value.success && value.value) {
      return clarityValueToPayTag(id, value.value);
    }

    return null;
  } catch (error) {
    console.error("Error fetching PayTag:", error);
    return null;
  }
}

/**
 * Get all PayTags created by a specific address
 * @param creatorAddress The Stacks address of the creator
 * @returns An array of PayTag IDs
 */
export async function getCreatorPayTags(
  creatorAddress: string
): Promise<number[]> {
  try {
    const [contractAddress, contractName] = PAYTAG_CONTRACT_TESTNET.split(".");
    const functionName = "get-creator-tags";
    const functionArgs = [Cl.standardPrincipal(creatorAddress)];

    const options = {
      contractAddress,
      contractName,
      functionName,
      functionArgs,
      network: NETWORK,
      senderAddress: contractAddress,
    };

    const result = await callReadOnlyFunction(options);
    const value = cvToValue(result);

    if (value.success && Array.isArray(value.value)) {
      return value.value;
    }

    return [];
  } catch (error) {
    console.error("Error fetching creator PayTags:", error);
    return [];
  }
}

/**
 * Get all PayTags where a specific address is the recipient
 * @param recipientAddress The Stacks address of the recipient
 * @returns An array of PayTag IDs
 */
export async function getRecipientPayTags(
  recipientAddress: string
): Promise<number[]> {
  try {
    const [contractAddress, contractName] = PAYTAG_CONTRACT_TESTNET.split(".");
    const functionName = "get-recipient-tags";
    const functionArgs = [Cl.standardPrincipal(recipientAddress)];

    const options = {
      contractAddress,
      contractName,
      functionName,
      functionArgs,
      network: NETWORK,
      senderAddress: contractAddress,
    };

    const result = await callReadOnlyFunction(options);
    const value = cvToValue(result);

    if (value.success && Array.isArray(value.value)) {
      return value.value;
    }

    return [];
  } catch (error) {
    console.error("Error fetching recipient PayTags:", error);
    return [];
  }
}

/**
 * Check if a PayTag is expired
 * @param id The ID of the PayTag to check
 * @returns True if the PayTag is expired, false otherwise
 */
export async function checkPayTagExpired(id: number): Promise<boolean> {
  try {
    const [contractAddress, contractName] = PAYTAG_CONTRACT_TESTNET.split(".");
    const functionName = "check-tag-expired";
    const functionArgs = [Cl.uint(id)];

    const options = {
      contractAddress,
      contractName,
      functionName,
      functionArgs,
      network: NETWORK,
      senderAddress: contractAddress,
    };

    const result = await callReadOnlyFunction(options);
    const value = cvToValue(result);

    if (value.success) {
      return value.value === true;
    }

    return false;
  } catch (error) {
    console.error("Error checking if PayTag is expired:", error);
    return false;
  }
}

/**
 * Get multiple PayTags by IDs
 * @param ids Array of PayTag IDs to fetch (max 20)
 * @returns Array of PayTag objects
 */
export async function getMultiplePayTags(
  ids: number[]
): Promise<(PayTag | null)[]> {
  try {
    // Limit to 20 IDs as per contract constraint
    const limitedIds = ids.slice(0, 20);

    const [contractAddress, contractName] = PAYTAG_CONTRACT_TESTNET.split(".");
    const functionName = "get-multiple-tags";
    const functionArgs = [Cl.list(limitedIds.map((id) => Cl.uint(id)))];

    const options = {
      contractAddress,
      contractName,
      functionName,
      functionArgs,
      network: NETWORK,
      senderAddress: contractAddress,
    };

    const result = await callReadOnlyFunction(options);
    const value = cvToValue(result);

    if (value.success && Array.isArray(value.value)) {
      return value.value.map((payTagValue, index) => {
        return payTagValue
          ? clarityValueToPayTag(limitedIds[index], payTagValue)
          : null;
      });
    }

    return [];
  } catch (error) {
    console.error("Error fetching multiple PayTags:", error);
    return [];
  }
}
