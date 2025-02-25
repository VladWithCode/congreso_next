import mongoose from "mongoose"

const DB_URL = process.env.DB_URL

if (!DB_URL) {
  throw new Error("DB_URL is not set")
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(DB_URL, {}).then((mongoose) => mongoose)
  }

  try {
    cached.conn = await cached.promise
  } catch (err) {
    cached.conn = null
    cached.promise = null
    throw err
  }

  return cached.conn
}

export default connectDB
