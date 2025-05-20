# PayTag Integration Guide

This document explains how the PayTag smart contract is integrated into the PayLinkr application using the Stacks.js library.

## Overview

PayTag is a decentralized payment request system built on the Stacks blockchain that allows users to create, fulfill, and manage payment requests using sBTC. The integration provides:

1. Smart contract interactions for creating/canceling/fulfilling payment requests
2. Real-time queries for payment data
3. UI components for managing payment requests

## Contract Integration

The implementation uses the `@stacks/transactions` library to interact with the Clarity smart contract. The main interfaces include:

### Core Contract Files

- `lib/stacks/contracts.ts` - Contract constants, types, and utility functions
- `lib/stacks/transactions.ts` - Transaction functions for interacting with the contract
- `hooks/usePayTags.ts` - React hook for using PayTag functionality
- `components/providers/PayTagProvider.tsx` - Context provider for PayTag functionality
- `components/ui/pay-tag-creator.tsx` - UI component for creating PayTags
- `components/ui/pay-tag-tester.tsx` - UI component for testing PayTags

### Smart Contract Functions

The PayTag contract offers these primary functions:

1. **create-pay-tag** - Create a new payment request with an amount, expiration, and optional memo
2. **fulfill-pay-tag** - Pay a pending payment request (sends sBTC to the recipient)
3. **cancel-pay-tag** - Cancel a pending payment request (creator only)
4. **mark-expired** - Mark a payment request as expired (if past expiration time)
5. **get-pay-tag** - Retrieve details about a payment request
6. **get-creator-tags** - Get all payment requests created by an address
7. **get-recipient-tags** - Get all payment requests where an address is the recipient

## State Management

The integration uses React Query for state management, with the following key features:

- Cached queries for payment requests
- Optimistic updates for better user experience
- Automatic refetching and invalidation
- Loading and error states

## Transaction Flow

When creating a payment request:

1. User enters payment details (amount, memo, expiration)
2. Frontend constructs transaction parameters
3. Transaction is signed and broadcast to the Stacks network
4. On successful broadcast, UI updates to show the new payment request

When fulfilling a payment request:

1. User selects a payment request to fulfill
2. Frontend creates post-conditions to ensure correct sBTC transfer
3. Transaction is signed and broadcast to the Stacks network
4. On successful broadcast, payment status is updated

## Error Handling

The integration handles various error cases:

- Network failures
- Insufficient funds
- Authorization errors (e.g., non-creator trying to cancel)
- Expiration errors
- Contract constraint violations

## Example: Creating a PayTag

```typescript
// Import necessary functions
import { createPayTag } from '@/lib/stacks/transactions';

// Create a new payment request
const txId = await createPayTag(
  {
    amount: BigInt(1000000), // 1 sBTC (in microSTX)
    expiresIn: BigInt(4320), // ~30 days in blocks
    memo: "Payment for services" // Optional
  },
  privateKey, // User's private key
);
```

## Example: Fulfilling a PayTag

```typescript
// Import necessary functions
import { fulfillPayTag } from '@/lib/stacks/transactions';

// Fulfill a payment request
const txId = await fulfillPayTag(
  { id: 1 }, // The ID of the payment request
  privateKey, // User's private key
);
```

## Security Considerations

The integration implements several security features:

1. Post-conditions to ensure exact amounts are transferred
2. Proper error handling and validation
3. Authorization checks before operations
4. Safe contract interactions to prevent unintended behavior

## Future Improvements

Potential enhancements include:

1. Transaction history tracking
2. Multi-signature support for payment approvals
3. Recurring payment functionality
4. Payment request templates
5. Enhanced notification system

## Testing

To test the contract integration, use the PayTag Tester component in the dashboard. You can:

1. Look up payment requests by ID
2. Fulfill payment requests (sending sBTC)
3. Cancel your own payment requests
4. View detailed information about payment requests

## Reference

For more information, see the following resources:

- [Stacks.js Transactions Documentation](https://docs.hiro.so/stacks/stacks.js/packages/transactions)
- [Clarity Smart Contract Documentation](https://docs.stacks.co/clarity/overview)
- [PayTag Contract Source Code](PayLinkr-Backend/contracts/PayLinkr.clar)