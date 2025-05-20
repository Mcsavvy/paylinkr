import ms from "ms";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Smart Contracts
      // MongoDB
      MONGO_URI: string;
      // Backblaze
      BACKBLAZE_BUCKET_NAME: string;
      BACKBLAZE_ENDPOINT: string;
      BACKBLAZE_REGION: string;
      AWS_ACCESS_KEY_ID: string; // backblaze key id
      AWS_SECRET_ACCESS_KEY: string; // backblaze app key
      // JWT Options
      JWT_SECRET: string;
      JWT_EXPIRY: ms.StringValue;
      REFRESH_TOKEN_EXPIRY: ms.StringValue;
      // sBTC
      NEXT_PUBLIC_SBTC_CONTRACT: string;
      NEXT_PUBLIC_SBTC_API_URL: string;
      NEXT_PUBLIC_BTC_API_URL: string;
      NEXT_PUBLIC_STX_API_URL: string;
    }
  }
}

export {};
