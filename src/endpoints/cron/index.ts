import { showMaturingFunds } from "./show-maturing-funds";
import { createMessageContext, createSupabaseContext } from "../../utils/action";
import { SettingRepository } from "../../repositories/setting-repository";
import { SETTING_KEYS } from "../../constant";
import { CronContext } from "../../types/cron-context";
import { TelegramButton } from "../../types/telegram";

export async function scheduled(event: any, env: any, ctx: any) {
  console.log(event.cron);
  console.log("Scheduled event triggered:", event);
  const supabaseClient = await createSupabaseContext(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  const notifyChatId = await new SettingRepository(supabaseClient).get(SETTING_KEYS.NOTIFICATION_CHAT_ID);

  const cronContext: CronContext = {
    supabase: supabaseClient,
    sendMessage: notifyChatId?.value ? await createMessageContext(env.TELEGRAM_BOT_TOKEN, notifyChatId?.value) : undefined,
  };


  switch (event.cron) {
    case "0 12 * * *":
      ctx.waitUntil(showMaturingFunds(cronContext));
      break;

    default:
      ctx.waitUntil(showMaturingFunds(cronContext));
      break;
  }
}