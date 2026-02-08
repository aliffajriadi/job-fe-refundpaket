import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const pesan = formData.get("pesan") as string;
    const file = formData.get("file") as File | null;

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return NextResponse.json(
        {
          success: false,
          error: "Telegram configuration missing",
          details:
            "Token atau Chat ID tidak ditemukan di environment variables",
        },
        { status: 500 },
      );
    }

    const telegramForm = new FormData();
    telegramForm.append("chat_id", chatId);

    let url = `https://api.telegram.org/bot${token}/sendMessage`;

    if (file && file.size > 0) {
      url = `https://api.telegram.org/bot${token}/sendPhoto`;
      telegramForm.append("photo", file);
      telegramForm.append("caption", pesan);
      telegramForm.append("parse_mode", "Markdown");
    } else {
      telegramForm.append("text", pesan);
      telegramForm.append("parse_mode", "Markdown");
    }

    const response = await fetch(url, {
      method: "POST",
      body: telegramForm,
    });

    const result = await response.json();

    if (response.ok && result.ok) {
      return NextResponse.json({ success: true });
    } else {
      console.error("Telegram API Error Details:", result);
      return NextResponse.json(
        {
          success: false,
          error: "Telegram API Error",
          details: result.description || "Gagal mengirim ke Telegram",
        },
        { status: response.status },
      );
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Server Error logic:", errorMessage);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}
