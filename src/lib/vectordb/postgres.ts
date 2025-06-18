import { PgVector, PostgresStore } from "@mastra/pg";
import { Memory } from "@mastra/memory";
import { Pool } from "pg";

// 型定義
interface VectorResult {
  id: string;
  score: number;
  metadata?: Record<string, any>;
  vector?: number[];
}

interface VectorData {
  id: string;
  vector: number[];
  metadata: Record<string, any>;
}

// テーブル名の設定
const COMPANY_INFO_TABLE = "company_info";
const VECTOR_INDEX_NAME = "vector_index";

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

// 接続文字列の取得
function getConnectionString(): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  return "postgresql://postgres:postgres@localhost:5432/vectordb";
}

// PostgreSQLストアの作成（エージェントのメモリ用）
export const postgresStore = new PostgresStore({
  connectionString: getConnectionString(),
});

// ベクターストアの作成（ベクトル検索用）
export const vectorStore = new PgVector({
  connectionString: getConnectionString(),
});

// メモリの作成（エージェント用）
export const memory = new Memory({
  storage: postgresStore,
  options: {
    lastMessages: 10, // 直近のメッセージ数
  },
});


// データベース接続のヘルスチェック
export async function checkDatabaseConnection() {
  try {
    const client = await getPool().connect();
    client.release();
    console.log("PostgreSQLデータベースに接続できました");
    return true;
  } catch (error) {
    console.error("PostgreSQLデータベースへの接続に失敗しました:", error);
    return false;
  }
}

// 後方互換性のために残しておく
export const checkVectorDBConnection = checkDatabaseConnection;

// ベクトル検索関数
export async function searchVectors(queryVector: number[], limit: number = 5) {
  try {
    // @ts-ignore - APIの互換性のために無視
    const results = await vectorStore.query({
      indexName: VECTOR_INDEX_NAME,
      queryVector,
      topK: limit,
    });
    
    // 結果が配列でない場合のフォールバック
    if (!Array.isArray(results)) {
      console.error('ベクトル検索結果が配列ではありません');
      return [];
    }
    
    return results.map(result => ({
      id: result.id || '',
      score: result.score || 0,
      metadata: result.metadata || {},
    }));
  } catch (error) {
    console.error('ベクトル検索に失敗しました:', error);
    return [];
  }
}

// ベクトル保存関数
export async function saveVector(id: string, vector: number[], metadata: Record<string, any>) {
  try {
    // @ts-ignore - APIの互換性のために無視
    await vectorStore.upsert({
      indexName: VECTOR_INDEX_NAME,
      vectors: [{
        id,
        vector,
        metadata
      }]
    });
    return true;
  } catch (error) {
    console.error('ベクトル保存に失敗しました:', error);
    return false;
  }
}

// エージェント用のベクターメモリインターフェース
// 後方互換性のために残しておく
export const vectorMemory = {
  // メモリの保存
  save: async (key: string, value: any, embedding: number[]) => {
    return await saveVector(key, embedding, { value });
  },
  
  // メモリの検索
  search: async (embedding: number[], limit: number = 5) => {
    const results = await searchVectors(embedding, limit);
    return results.map(result => {
      // metadataが存在しない場合のフォールバックを追加
      const metadata = result.metadata || {};
      return {
        id: result.id,
        value: metadata.value,
        score: result.score
      };
    });
  },
  
  // 初期化（互換性のため）
  initialize: async () => {
    try {
      return await checkDatabaseConnection();
    } catch (error) {
      console.error('メモリのチェックに失敗しました:', error);
      return false;
    }
  }
}
