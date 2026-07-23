import { createClient } from "@supabase/supabase-js";
import { TelegramButton } from "../types/telegram";

export async function createMessageContext(token: string, chatIds: string[]) {
  return async (message: string, button?: TelegramButton[]) => await Promise.all(chatIds.map(async (chatId) => await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: button ? [[...button]] : undefined,
        }
      }),
    }
  )));
}

export async function createSupabaseContext(supabaseUrl: string, supabaseKey: string) {
  const supabaseClient = createClient(supabaseUrl, supabaseKey);
  return supabaseClient;
}