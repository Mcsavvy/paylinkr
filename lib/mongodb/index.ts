import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('Please define the MONGO_URI environment variable inside .env.local');
}

// @ts-expect-error ...
let cached = global.mongoose;

if (!cached) {
  // @ts-expect-error ...
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    console.log(`using cached database connection ${cached.conn}`);
    return cached.conn;
  }

  if (!cached.promise) {
    console.log(`connecting to database ${MONGO_URI}`);
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      console.log(`connected to database ${mongoose.connection.db?.databaseName}`);
      return mongoose;
    });
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
