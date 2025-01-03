import { NextResponse } from "next/server";

const BOT_TOKEN = "7640312566:AAGwQMcUJlgL-ZwDKkZXJ5614-l-Hrd_KA0"; // Токен вашего бота
const CHAT_ID = "-1002355262976"; // Chat ID вашей группы

async function sendToTelegram(message) {
  const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  const response = await fetch(telegramUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message,
      parse_mode: "Markdown",
    }),
  });
  if (!response.ok) {
    throw new Error("Ошибка отправки сообщения в Telegram");
  }
}

export async function GET() {
  const urls = [
    "https://xnice-trend.com/",
    "https://eko-rozsada.site/",
    "https://eko-sad.site/",
    "https://eko-sadzhancy.site/",
    "https://onlinesadzhancy.site/",
    "https://pro-sadzhancy.space/",
    "https://sadovyi-market.site/",
  ];

  const results = await Promise.all(
    urls.map(async (url) => {
      try {
        const response = await fetch(url);
        return { url, status: response.status, ok: response.ok };
      } catch (error) {
        return { url, status: "Error", ok: false, error: error.message };
      }
    })
  );

  // Проверяем, есть ли хотя бы один недоступный сайт
  const hasOffline = results.some((result) => !result.ok);

  if (hasOffline) {
    // Формируем сообщение со всеми сайтами
    const message = results
      .map(
        (result) =>
          `*URL:* ${result.url}\n*Status:* ${result.status}\n${
            result.ok ? "✅ *Online*" : "❌ *Offline*"
          }`
      )
      .join("\n\n");

    try {
      await sendToTelegram(message);
    } catch (error) {
      return NextResponse.json(
        { error: "Не удалось отправить сообщение в Telegram" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(results);
}
