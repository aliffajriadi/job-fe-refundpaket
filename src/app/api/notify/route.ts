import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// 1. Perbaikan Fungsi Helper: Menambahkan try-catch internal
async function sendToTelegram(
  token: string,
  chatId: string,
  pesan: string,
  file: File | null,
  signal: AbortSignal,
) {
  const telegramForm = new FormData();
  telegramForm.append("chat_id", chatId);

  let url = `https://api.telegram.org/bot${token}/sendMessage`;

  if (file && file.size > 0) {
    url = `https://api.telegram.org/bot${token}/sendPhoto`;
    // Gunakan Blob untuk memastikan kompatibilitas FormData di server-side
    telegramForm.append("photo", file);
    telegramForm.append("caption", pesan || "");
    telegramForm.append("parse_mode", "Markdown");
  } else {
    telegramForm.append("text", pesan || "");
    telegramForm.append("parse_mode", "Markdown");
  }

  const response = await fetch(url, {
    method: "POST",
    body: telegramForm,
    signal,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.description || `Telegram API Error: ${response.status}`);
  }
  return data;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const pesan = (formData.get("pesan") as string) || "No message";
    const file = formData.get("file") as File | null;

    const bot1 = {
      token: process.env.TELEGRAM_BOT_TOKEN,
      chatId: process.env.TELEGRAM_CHAT_ID,
    };
    const bot2 = {
      token: process.env.TELEGRAM_BOT_TOKEN_2,
      chatId: process.env.TELEGRAM_CHAT_ID_2,
    };

    // Debugging: Cek apakah env terbaca (Akan muncul di log server/terminal)
    console.log("Checking Env Variables...");
    if (!bot1.token || !bot2.token) {
      console.error("CRITICAL: Token Telegram tidak ditemukan di .env!");
    }

    // Check config.json
    try {
      const configPath = path.join(process.cwd(), "src/config.json");
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
        if (config.telegramDisabled) {
          return NextResponse.json({
            success: true,
            message: "Pengiriman Telegram sedang dimatikan (Disabled).",
          });
        }
      }
    } catch (e: any) {
      console.warn("Config check failed, continuing anyway:", e.message);
    }

    // Validasi kredensial
    if (!bot1.token || !bot1.chatId || !bot2.token || !bot2.chatId) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Konfigurasi bot tidak lengkap di server (.env)",
          details: { bot1: !!bot1.token, bot2: !!bot2.token }
        },
        { status: 500 },
      );
    }

    const sendWithTimeout = async (
      bot: { token: string | undefined; chatId: string | undefined },
      name: string,
    ) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      try {
        const res = await sendToTelegram(
          bot.token!,
          bot.chatId!,
          pesan,
          file,
          controller.signal,
        );
        return { name, ok: true, data: res };
      } catch (err: any) {
        // PERBAIKAN: console.log tidak boleh di dalam return object
        console.error(`Error pada ${name}:`, err.message);
        
        let errorMsg = err.message;
        if (err.name === "AbortError") {
          errorMsg = "Timeout: Koneksi ke Telegram lambat/terputus.";
        }
        
        return {
          name,
          ok: false,
          description: errorMsg,
        };
      } finally {
        clearTimeout(timeoutId);
      }
    };

    // Jalankan paralel
    const [res1, res2] = await Promise.all([
      sendWithTimeout(bot1, "Bot 1"),
      sendWithTimeout(bot2, "Bot 2"),
    ]);

    // Response ke client
    if (res1.ok && res2.ok) {
      return NextResponse.json({
        success: true,
        message: "Semua bot berhasil mengirim pesan.",
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Terjadi kegagalan pada salah satu atau kedua bot.",
          errors: {
            bot1: res1.ok ? "Success" : res1.description,
            bot2: res2.ok ? "Success" : res2.description,
          },
        },
        { status: 502 }, // 502 Bad Gateway lebih tepat untuk kegagalan API pihak ketiga
      );
    }
  } catch (error: any) {
    console.error("Global Server Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Internal Server Error", 
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}