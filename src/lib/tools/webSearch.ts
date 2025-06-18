import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { tavily } from "@tavily/core";

// Tavilyクライアントの初期化
const tavilyClient = tavily({ apiKey: process.env.TAVILY_API_KEY || "" });

// ウェブ検索を実行する関数
async function searchWeb(query: string, maxResults: number = 3) {
  try {
    const searchResults = await tavilyClient.search(query, {
      maxResults,
    });
    return searchResults.results || [];
  } catch (error) {
    console.error("検索エラー:", error);
    return [];
  }
}

// 外部検索ツールの作成
export const webSearchTool = createTool({
  id: "web-search",
  description: "ウェブ検索を実行して最新情報を取得します。",
  inputSchema: z.object({
    query: z.string().describe("検索クエリ"),
    maxResults: z
      .number()
      .optional()
      .default(3)
      .describe("取得する検索結果の最大数"),
  }),
  outputSchema: z.object({
    results: z.array(
      z.object({
        url: z.string(),
        title: z.string(),
        content: z.string(),
      })
    ),
  }),
  execute: async ({ context: { query, maxResults } }) => {
    const results = await searchWeb(query, maxResults);
    return { results };
  },
});
