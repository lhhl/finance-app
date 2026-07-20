import type { Context } from "hono";
import { FundRepository } from "../../repositories/fund-repository";
import { createMessageContext, createSupabaseContext } from "../../utils/action";
import { createMatureFundListMessage } from "../../utils/message-template";
import { NOTIFY_MATURITY_DAYS_IN_DAYS } from "../../constant";

export async function showMaturingFunds(env: any) {
  console.log("Running showMaturingFunds cron job...");
  const funds = await new FundRepository(await createSupabaseContext(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)).list();
  const sendMessage = await createMessageContext(env.TELEGRAM_BOT_TOKEN, env.CONVERSATION_CHAT_ID);

  const maturingFunds = funds.filter(fund => fund.canRefinance && fund.untilMaturityDays <= NOTIFY_MATURITY_DAYS_IN_DAYS);
  if (maturingFunds.length === 0) {
    console.log("No maturing funds found.");
    return;
  };
  await sendMessage(createMatureFundListMessage(maturingFunds));
}

