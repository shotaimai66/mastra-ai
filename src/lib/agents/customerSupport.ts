import { Agent } from "@mastra/core";
import { openai } from "@ai-sdk/openai";
import { webSearchTool } from "../tools/webSearch";

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
