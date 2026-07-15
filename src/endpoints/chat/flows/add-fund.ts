import { ChatContext } from "../../../types/chat-context";
import { Fund, AddFundRequest } from "../../../types/fund";
import { createAddFundMessage, createConfirmAddFundMessage } from "../message-template";
import { FundModel } from "../../../models/fund";
import { updateState } from "../state";
import { FLOW_COMMANDS } from "../../../constant";

const STEPS = [
  askFundNameStep,
  addFundInfoStep,
];

export async function addFund(text: string, context: ChatContext) {
  console.log('Executing flows: addFund');
  const step = context.state?.step || 0;
  await STEPS[step](text, context);
  await updateState({
    flow: FLOW_COMMANDS.ADD_FUND,
    step: step + 1,
  }, context);

  // await context.sendMessage(message);
}

async function askFundNameStep(text: string, context: ChatContext) {
  console.log('Executing step: askFundNameStep');
  await context.sendMessage(createAddFundMessage());
}

async function addFundInfoStep(text: string, context: ChatContext) {
  console.log('Executing step: addFundInfoStep');
  const input = text.split("\n");
  context.state!.data = {
    name: input[0],
    amount: parseFloat(input[1]) || 0,
    maturity_day: parseInt(input[2]) || 15,
    statement_day: input[3] ? parseInt(input[3]) : undefined,
    month_interval: input[4] ? parseInt(input[4]) : 1,
  };
  await context.sendMessage(createConfirmAddFundMessage(context.state!.data as AddFundRequest), [
    {
      text: "Xác nhận",
      callback_data: 
    },
    {
      text: "Hủy",
      callback_data: "@huy"
    }
  ]);
}

async function saveInfoStep(text: string, context: ChatContext) {
  const { error } = await context.supabase
    .from("funds")
    .insert([context.state!.data]);

  if (error) {
    console.error("Error adding fund:", error);
    return await context.sendMessage("Đã xảy ra lỗi. Vui lòng thử lại.");
  }
  await context.sendMessage("Nguồn tiền đã được thêm thành công.");
}