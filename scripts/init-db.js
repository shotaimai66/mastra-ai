import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function initializeDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log("Initializing database...");

    // Enable pgvector extension
    await pool.query("CREATE EXTENSION IF NOT EXISTS vector");
    console.log("✓ pgvector extension enabled");

    // Create company_info table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS company_info (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        embedding vector(1536),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✓ company_info table created");

    // Create index for vector similarity search
    await pool.query(`
      CREATE INDEX IF NOT EXISTS company_info_embedding_idx 
      ON company_info 
      USING ivfflat (embedding vector_cosine_ops)
      WITH (lists = 100)
    `);
    console.log("✓ Vector search index created");

    console.log("Database initialized successfully!");
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initializeDatabase();
