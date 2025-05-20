
---

# 🪙 PayLinkr — sBTC Bitcoin Payment gateway

`PayLinkr` is a Bitcoin-native payment request system built on the **Stacks blockchain**, enabling users to generate shareable links or QR codes to receive payments in **sBTC** (a 1:1 Bitcoin-backed programmable asset). It bridges Bitcoin usability and Web3 programmability with a seamless UX.


---

## ✨ Features

* 🔗 Generate PayTag links to request sBTC (like “\$CashTag” but on Bitcoin)
* 📱 Share payment requests as URLs or QR codes
* ⛓️ Fulfill requests through Stacks smart contract interaction
* 🔐 Non-custodial — no one except you ever controls your sBTC
* ⏳ Optional expiration time on each request
* 📖 View the status of each PayTag (pending, fulfilled, or expired)

---

## 🛠️ Tech Stack

| Layer          | Technology         |
| -------------- | ------------------ |
| Smart Contract | Clarity (Stacks)   |
| Backend API    | Node.js, Express   |
| Database       | MongoDB            |
| Frontend       | React, TailwindCSS |
| Wallet         | Xverse and Leather |
| Infra          | Render / Railway   |

---

## 📦 Project Structure

```
paylinkr/
├── contracts/           # Clarity smart contract
├── backend/             # Express API and MongoDB integration
├── frontend/            # React + Tailwind app
├── README.md            # You are here
├── .env.example         # Sample environment file
└── package.json
```

---

## 🧑‍💻 User Flow

### Create a PayTag

1. User fills a form: `amount`, `memo`, optional `expiration`
2. Frontend calls backend API: `POST /api/paytags`
3. Backend:

   * Creates PayTag record in MongoDB
   * Calls Clarity contract to register PayTag on-chain
   * Returns generated URL and QR code


### Fulfill a PayTag

1. Recipient opens link: `/pay/{id}`
2. Frontend fetches PayTag details from backend
3. Displays payment info, e.g., "Send 0.05 sBTC for Lunch"
4. User connects Hiro Wallet and confirms transaction
5. Smart contract marks PayTag as "fulfilled"
6. Frontend updates UI with confirmation

---

## 🔐 Smart Contract: `paytag.clar`

Clarity contract to:

* Create PayTag: `create-paytag(id, amount, expires-at, memo)`
* Fulfill PayTag: `fulfill-paytag(id)` → transfers sBTC
* View status: `get-paytag(id)` → returns PayTag info

Deployed to: **Stacks Testnet**

See: https://explorer.hiro.so/txid/STFPYA06K2F5BY0ESPY7HMK70WEAEXBFF20HGPYX.PayLinkrs?chain=testnet

---

## 📦 API Endpoints (Express)

| Method | Endpoint           | Description                        |
| ------ | ------------------ | ---------------------------------- |
| POST   | `/api/paytags`     | Create a new PayTag (with Clarity) |
| GET    | `/api/paytags/:id` | Get PayTag details (for /pay/\:id) |

---

## 🧪 Local Development

### 1. Clone the repo

```bash
git clone https://github.com/your-username/paylinkr.git
cd paylinkr
```

### 2. Setup Environment

```bash
cp .env.example .env
```

Fill in:

```env
MONGO_URI=<your_mongodb_uri>
APP_URL=http://localhost:5173
```

### 3. Run Backend

```bash
cd backend
npm install
npm run dev
```

### 4. Run Frontend

```bash
cd frontend
npm install
npm run dev
```

### 5. Deploy Contract

```bash
cd contracts
clarinet test
clarinet check
clarinet deploy --network=testnet
```

---

## FRONTEND

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Environment Variables

Create a `.env` file in the project root with the following:

```
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-very-secret-key
```

## Project Structure

- `models/` — Mongoose models (e.g., User)
- `types/` — Shared TypeScript interfaces and types

## 💡 Innovation

* ⚡ **One-link Bitcoin requests** — easier than wallet addresses
* 📲 **Mobile & QR-optimized** — for P2P and real-world use
* 📜 **On-chain verification** — viewable proof of request fulfillment
* 🧱 **Stackable** — perfect base for integrating merchant features later



## 👨‍👩‍👧 Team

* Arowolo Kehinde and David John – Smart Contracts & Backend
* Teammate 2 – Frontend Engineering & Backend

---


