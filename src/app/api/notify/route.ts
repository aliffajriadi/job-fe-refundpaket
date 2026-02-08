import { NextResponse } from "next/server";

// Fungsi helper agar tidak nulis kode yang sama berulang kali
async function sendToTelegram(token: string, chatId: string, pesan: string, file: File | null) {
  const telegramForm = new FormData();
  telegramForm.append("chat_id", chatId);

  let url = `https://api.telegram.org/bot${token}/sendMessage`;

  if (file && file.size > 0) {
    url = `https://api.telegram.org/bot${token}/sendPhoto`;
    telegramForm.append("photo", file);
    telegramForm.append("caption", pesan || "");
    telegramForm.append("parse_mode", "Markdown");
  } else {
    telegramForm.append("text", pesan || "");
    telegramForm.append("parse_mode", "Markdown");
  }

  const response = await fetch(url, { method: "POST", body: telegramForm });
  return await response.json();
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const pesan = formData.get("pesan") as string;
    const file = formData.get("file") as File | null;

    // Ambil kredensial untuk 2 bot
    const bot1 = {
      token: process.env.TELEGRAM_BOT_TOKEN,
      chatId: process.env.TELEGRAM_CHAT_ID,
    };
    const bot2 = {
      token: process.env.TELEGRAM_BOT_TOKEN_2,
      chatId: process.env.TELEGRAM_CHAT_ID_2,
    };

    // Validasi dasar
    if (!bot1.token || !bot1.chatId || !bot2.token || !bot2.chatId) {
      return NextResponse.json({ error: "Konfigurasi salah satu bot kurang!" }, { status: 500 });
    }

    // Eksekusi pengiriman ke dua bot secara bersamaan (Parallel)
    const [res1, res2] = await Promise.all([
      sendToTelegram(bot1.token, bot1.chatId, pesan, file),
      sendToTelegram(bot2.token, bot2.chatId, pesan, file),
    ]);

    // Cek apakah keduanya berhasil
    if (res1.ok && res2.ok) {
      return NextResponse.json({ success: true, message: "Keduanya terkirim!" });
    } else {
      return NextResponse.json({
        success: false,
        bot1: res1.description,
        bot2: res2.description,
      }, { status: 400 });
    }

  } catch (error: any) {
    console.error("Server Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}