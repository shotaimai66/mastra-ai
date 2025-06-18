import { Agent } from "@mastra/core";
import { createTool } from "@mastra/core/tools";
import { openai } from "@ai-sdk/openai";
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
const webSearchTool = createTool({
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

// エージェントの指示文
const instructions = `あなたは親切でプロフェッショナルなカスタマーサポートAIアシスタントです。
あなたの役割は以下の通りです：
- 親切でプロフェッショナルなカスタマーサービスを提供する
- 商品、注文、問題に関するお客様の問い合わせをサポートする
- 必要に応じてウェブ検索を実行し、最新情報を提供する
- お客様のメッセージの感情的なトーンを考慮する
- お客様の履歴に基づいたパーソナライズされたサポートを提供する

常に礼儀正しく親切な態度を保ち、お客様の問題を効率的に解決するよう心がけてください。
お客様が他の言語で書いていない限り、日本語で応答してください。`;

// カスタマーサポートエージェントの作成
export const customerSupportAgent = new Agent({
  name: "customer-support-agent",
  instructions: instructions,
  model: openai("gpt-4o-mini"),
  tools: {
    webSearch: webSearchTool,
  },
});
