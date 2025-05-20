 # sBTC Integration for PayLinkr

This directory contains the integration with sBTC on testnet for the PayLinkr application.

## Overview

The integration allows PayLinkr users to:

1. View their sBTC balance
2. Deposit BTC to receive sBTC on testnet
3. Create payment requests/links with QR codes for receiving sBTC payments

## Files

- `sbtc.ts` - Core utilities for interacting with the sBTC API client
- `../hooks/useSbtc.ts` - React hook for using sBTC in components
- `../components/providers/SbtcProvider.tsx` - Context provider for sBTC functionality
- `../components/ui/sbtc-balance-card.tsx` - UI component for displaying balance and deposit
- `../components/ui/sbtc-request-form.tsx` - UI component for creating payment requests

## Usage

The implementation uses the official Hiro `sbtc` package and connects to the testnet sBTC contracts at:
- `ST1F7QA2MDF17S807EPA36TSS8AMEFY4KA9TVGWXT.sbtc-token`
- `ST1F7QA2MDF17S807EPA36TSS8AMEFY4KA9TVGWXT.sbtc-deposit`

## Testing

To test the integration:

1. Connect a Stacks wallet with testnet mode enabled
2. View your sBTC balance on the dashboard
3. Request testnet BTC from a faucet
4. Use the deposit feature to convert BTC to sBTC
5. Create payment requests and test sending sBTC between accounts

## Resources

- [sBTC Package Documentation](https://docs.hiro.so/stacks.js/packages/sbtc)
- [Working with sBTC in Clarinet](https://docs.hiro.so/stacks/clarinet/guides/working-with-sbtc)