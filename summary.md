PayLinkr – Summary
PayLinkr is a decentralized payment request platform enabling users and merchants to send and receive Bitcoin (via sBTC on the Stacks blockchain) using simple PayTag links or QR codes.

🟢 Core Flow (Peer-to-Peer)
Onboarding:

Users sign up via email or wallet (Xverse/Hiro).

Authenticated sessions link a Stacks address.

Create PayTag:

Enter amount, optional memo/expiration.

Generates a unique URL + QR code to share.

Fulfillment:

Payers visit the link, connect their wallet, and approve the transaction.

Payment is executed on-chain via a Clarity smart contract.

Both parties are notified; dashboard updates status.

Edge Handling:

Handles expired tags, insufficient funds, canceled requests, or network issues gracefully.

🔵 Protocol Overview
A PayTag = an immutable on-chain request object with amount, recipient, memo, and expiration.

State transitions: Pending → Paid / Expired / Canceled.

Clarity contract functions: create-request, fulfill-request, cancel-request, get-request-status.

🛍 Merchant Integration
Purpose: Enable e-commerce and POS payments via API-driven sBTC PayTags.

Key Features:

Merchant onboarding and wallet connect.

REST APIs for tag creation, webhook setup, payment status retrieval.

Dashboard with filters, CSV export, and QR embed widget.

Tech:

HMAC-authenticated APIs.

Event-driven webhooks for real-time status updates.

SLA: 99.9% uptime, <200ms response, 100+ tx/min capacity.

🔄 Unified Platform
Both P2P and merchant use cases supported in a single app with role-based access.

Shared components (dashboard, smart contracts, UI) streamline development.

Seamless user experience: individuals and businesses can onboard, request, and receive sBTC trustlessly.