import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

console.log('=== MongoDB Atlas Connection Troubleshooting ===\n');

// Test 1: Basic DNS resolution
console.log('1. Testing DNS resolution...');
try {
  const url = new URL(process.env.MONGO_URI);
  console.log('✅ URI parsing successful');
  console.log('Host:', url.hostname);
} catch (e) {
  console.log('❌ URI parsing failed:', e.message);
}

// Test 2: Native MongoDB driver
console.log('\n2. Testing with native MongoDB driver...');
const client = new MongoClient(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000,
});

try {
  await client.connect();
  console.log('✅ Native driver connection successful');
  await client.close();
} catch (error) {
  console.log('❌ Native driver failed:', error.message);
}

// Test 3: Mongoose connection
console.log('\n3. Testing with Mongoose...');
try {
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
  });
  console.log('✅ Mongoose connection successful');
  await mongoose.disconnect();
} catch (error) {
  console.log('❌ Mongoose failed:', error.message);
}

console.log('\n=== Test Complete ===');
process.exit(0);