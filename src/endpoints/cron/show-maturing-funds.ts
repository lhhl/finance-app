import { FundRepository } from "../../repositories/fund-repository";
import { createMatureFundListMessage } from "../../utils/message-template";
import { NOTIFY_MATURITY_DAYS_IN_DAYS } from "../../constant";
import { CronContext } from "../../types/cron-context";

export async function showMaturingFunds(context: CronContext) {
  console.log("Running showMaturingFunds cron job...");

  if (!context.sendMessage) {
    console.log("No sendMessage function provided in context. Skipping notification.");
    return;
  }

  const funds = await new FundRepository(context.supabase).list();
  const maturingFunds = funds.filter(fund => fund.canRefinance && fund.untilMaturityDays <= NOTIFY_MATURITY_DAYS_IN_DAYS)?.sort((a, b) => a.untilMaturityDays - b.untilMaturityDays) || [];

  if (maturingFunds.length === 0) {
    console.log("No maturing funds found.");
    return;
  };
  await context.sendMessage(createMatureFundListMessage(maturingFunds));
}

