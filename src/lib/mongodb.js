import mongoose from 'mongoose';
let MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/outcome360';
// Ensure database name is included if uri is just mongodb://localhost:27017/
if (MONGODB_URI.endsWith('localhost:27017/') || MONGODB_URI.endsWith('127.0.0.1:27017/')) {
    MONGODB_URI = `${MONGODB_URI}outcome360`;
}
else if (MONGODB_URI === 'mongodb://localhost:27017' || MONGODB_URI === 'mongodb://127.0.0.1:27017') {
    MONGODB_URI = `${MONGODB_URI}/outcome360`;
}
let cached = global.mongooseCache || { conn: null, promise: null };
if (!global.mongooseCache) {
    global.mongooseCache = cached;
}
/**
 * Connects to MongoDB database using Mongoose with connection pooling and caching
 */
export async function connectToDatabase() {
    if (cached.conn && cached.conn.connection.readyState === 1) {
        return cached.conn;
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
        };
        cached.promise = mongoose
            .connect(MONGODB_URI, opts)
            .then((m) => {
            console.log(`[MongoDB] Connected successfully to ${MONGODB_URI}`);
            return m;
        })
            .catch((err) => {
            cached.promise = null;
            console.error('[MongoDB] Connection error:', err.message);
            throw err;
        });
    }
    try {
        cached.conn = await cached.promise;
    }
    catch (e) {
        cached.promise = null;
        throw e;
    }
    return cached.conn;
}
/**
 * Check if MongoDB connection is active
 */
export function getDbConnectionState() {
    const readyState = mongoose.connection.readyState;
    const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
    };
    return {
        isConnected: readyState === 1,
        stateName: states[readyState] || 'unknown',
        uri: MONGODB_URI,
    };
}
