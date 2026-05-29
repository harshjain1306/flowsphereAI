import { MongoMemoryServer } from 'mongodb-memory-server';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  console.log("Starting MongoMemoryServer...");
  const mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  console.log("In-memory MongoDB started at:", uri);

  // Set the environment variables
  process.env.MONGODB_URI = uri;
  if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = 'flowsphere_ai_secret_key_12345';
  }
  if (!process.env.PORT) {
    process.env.PORT = '3000';
  }

  // Import and run server.ts
  console.log("Starting backend server...");
  require('./server');
}

main().catch(err => {
  console.error("Failed to start in-memory server:", err);
  process.exit(1);
});
