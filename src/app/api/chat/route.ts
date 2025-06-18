import { NextRequest, NextResponse } from "next/server";
import { customerSupportAgent } from "@/lib/mastra";

export async function POST(request: NextRequest) {
  try {
    const { message, image } = await request.json();

    // Define message type compatible with Mastra agent
    type Message = {
      role: 'user' | 'assistant' | 'system';
      content: string;
    };

    // Prepare the messages array
    const messages: Message[] = [];

    // For image content, we'll handle it separately if needed

    // Add text message
    if (message) {
      messages.push({
        role: "user",
        content: message,
      });
    }

    // If there's an image, add a text note about the image
    if (image) {
      messages.push({
        role: "user",
        content: message ? `${message} (画像が添付されました)` : "画像を確認してください。",
      });
    }

    // Generate response using the agent
    const response = await customerSupportAgent.generate(messages, {
      maxTokens: 1000,
    });

    return NextResponse.json({
      message: response.text,
      success: true,
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      {
        message:
          "申し訳ございません。一時的な問題が発生しました。しばらくしてからもう一度お試しください。",
        success: false,
      },
      { status: 500 }
    );
  }
}
