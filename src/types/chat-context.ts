import { SupabaseClient } from "@supabase/supabase-js";
import { ChatState } from "./chat-state";
import { TelegramButton } from "./telegram";

export interface ChatContext {
  chatId: number;
  authorId?: number;
  state?: ChatState;
  sendMessage: (message: string, button?: TelegramButton[]) => Promise<Response[]>;
  supabase: SupabaseClient;
}