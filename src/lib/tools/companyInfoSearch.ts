import { z } from "zod";
import { createTool } from "@mastra/core";
import { getPool } from "../vectordb/postgres";
import { createEmbedding } from "../embedding";

// 会社情報検索ツールの作成
export const companyInfoSearchTool = createTool({
  id: "company-info-search",
  description: "会社情報検索ツール",
  inputSchema: z.object({
    query: z.string().describe("会社情報検索クエリ"),
    limit: z.number().optional().default(3).describe("最大検索結果数"),
  }),
  execute: async ({ context: { query, limit = 3 } }) => {
    try {
      // クエリをベクトル化
      const queryEmbedding = await createEmbedding(query);

      // PostgreSQLプールを取得
      const pool = getPool();

      console.log("Query", query);

      // ベクトル類似検索とテキスト検索を組み合わせて実行
      const result = await pool.query(
        `
        WITH vector_search AS (
          SELECT 
            id,
            title,
            content,
            1 - (embedding <=> $1::vector) as similarity
          FROM company_info
          WHERE embedding IS NOT NULL
          ORDER BY embedding <=> $1::vector
          LIMIT $2
        ),
        text_search AS (
          SELECT 
            id,
            title,
            content,
            0.8 as similarity
          FROM company_info
          WHERE 
            title ILIKE $3 OR
            content ILIKE $3
          LIMIT $2
        )
        SELECT * FROM (
          SELECT * FROM vector_search
          UNION
          SELECT * FROM text_search
        ) combined
        ORDER BY similarity DESC
        LIMIT $2
      `,
        [`[${queryEmbedding.join(",")}]`, limit, `%${query}%`]
      );

      // 結果をフォーマット
      const searchResults = result.rows.map((row) => ({
        id: row.id,
        title: row.title,
        content: row.content,
        similarity: row.similarity,
      }));

      console.log("Search results", searchResults);

      if (searchResults.length === 0) {
        return {
          results: [],
          message: "No relevant company information found for your query.",
        };
      }

      return {
        results: searchResults,
        message: `Found ${searchResults.length} relevant company information entries.`,
      };
    } catch (error) {
      console.error("Error searching company info:", error);
      return {
        results: [],
        message: "An error occurred while searching company information.",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});
