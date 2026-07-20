import { showMaturingFunds } from "./show-maturing-funds";

export async function scheduled(event: any, env: any, ctx: any) {
  console.log(event.cron);
  console.log("Scheduled event triggered:", event);
  switch (event.cron) {
    case "0 12 * * *":
      ctx.waitUntil(showMaturingFunds(env));
      break;

    default:
      ctx.waitUntil(showMaturingFunds(env));
      break;
  }
}