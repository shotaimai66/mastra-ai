import { Pool } from "pg";

// シングルトンパターンでプールを管理
let pool: Pool | null = null;

// PostgreSQLの接続設定を取得
export function getPool(): Pool {
  if (!pool) {
    // 環境変数が設定されている場合はそちらを優先
    if (process.env.DATABASE_URL) {
      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });
    } else {
      // デフォルト設定
      pool = new Pool({
        host: "localhost",
        port: 5432,
        user: "postgres",
        password: "postgres",
        database: "vectordb",
      });
    }
  }
  return pool;
}
