import { ChatContext } from "../../../types/chat-context";
import { createFundMessage } from "../message-template";
import { Fund } from "../../../models/fund";

export async function fund(_text: string, context: ChatContext) {
  console.log('Executing flows: fund');

  const { data, error } = await context.supabase
    .from("funds")
    .select("*")
    .order("name");

  const message = data?.map((fund, i) => {
    return createFundMessage(new Fund(fund), i + 1);
  })?.join("\n") || "Không có nguồn tiền nào.";
  const buttons = [
    {
      text: "Thêm",
      callback_data: "/themnguontien"
    },
  ];

  if (data?.length) {
    buttons.push(
      {
        text: "Sửa",
        callback_data: "/suanguontien"
      },
      {
        text: "Xóa",
        callback_data: "/xoanguontien"
      }
    );
  }

  await context.sendMessage(message, buttons);
}