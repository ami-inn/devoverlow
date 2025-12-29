import mongoose, {Mongoose} from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongooseCache {
    conn : Mongoose | null;
    promise : Promise<Mongoose> | null;
}

declare global {
    var mongoose : MongooseCache;
}

let cached = global.mongoose;

// doing this to avoid multiple connections in development
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const dbConnect = async () : Promise<Mongoose> => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            dbName: 'devflow',
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }

    cached.conn = await cached.promise; // wait for the promise to resolve
    return cached.conn;
}

export default dbConnect;