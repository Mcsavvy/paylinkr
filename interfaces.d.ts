import { type Mongoose } from "mongoose";


declare global {
  var global: typeof globalThis & {
    mongoose: {
      conn: unknown;
      promise: Promise<Mongoose> | null;
    };
  };
}