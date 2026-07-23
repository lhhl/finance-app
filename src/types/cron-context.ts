import { SupabaseClient } from "@supabase/supabase-js";
import { TelegramButton } from "./telegram";

export interface CronContext {
  sendMessage?: (message: string, button?: TelegramButton[]) => Promise<void>;
  supabase: SupabaseClient;
  notifyChatId?: string;
}