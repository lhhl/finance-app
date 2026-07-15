import { ChatContext } from "../../../types/chat-context";
import { Fund } from "../../../types/fund";
import { createFundMessage } from "../message-template";
import { FundModel } from "../../../models/fund";

export async function fund(_text: string, context: ChatContext) {
  console.log('Executing flows: fund');

  const { data, error } = await context.supabase
    .from("funds")
    .select("*")
    .order("name");

  const message = data?.map((fund: Fund, i) => {
    return createFundMessage(new FundModel(fund), i + 1);
  })?.join("\n") || "No funds found.";

  await context.sendMessage(message, [
    {
      text: "Thêm",
      callback_data: "/themnguontien"
    },
    {
      text: "Sửa",
      callback_data: "/suanguontien"
    },
    {
      text: "Xóa",
      callback_data: "/xoanguontien"
    }
  ]);
}