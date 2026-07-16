import { ChatContext } from "../../../types/chat-context";
import { FlowStepResult } from "../../../types/flow";
import { AddFundRequest } from "../../../models/add-fund-request";
import { createAddFundMessage, createConfirmAddFundMessage, createErrorMessage, createSuccessMessage, createCancelActionMessage } from "../message-template";
import { clearState, updateState } from "../state";
import { CALLBACK_COMMANDS, FLOW_COMMANDS } from "../../../constant";

const STEPS = [
  askFundNameStep,
  addFundInfoStep,
  saveInfoStep
];

export async function addFund(text: string, context: ChatContext) {
  console.log('Executing flows: addFund');
  const step = context.state?.step || 0;
  const result: FlowStepResult = await STEPS[step](text, context);

  if (result.exit) {
    await clearState(context.state!, context);
    return;
  }

  await updateState({
    flow: FLOW_COMMANDS.ADD_FUND,
    step: step + result.stepAdded,
  }, context);

}

async function askFundNameStep(text: string, context: ChatContext): Promise<FlowStepResult> {
  console.log('Executing step: askFundNameStep');
  await context.sendMessage(createAddFundMessage());
  return {
    success: true,
    stepAdded: 1,
    exit: false,
  };
}

async function addFundInfoStep(text: string, context: ChatContext): Promise<FlowStepResult> {
  console.log('Executing step: addFundInfoStep');
  const lines = text.split("\n").map(line => line.trim());
  const input = new AddFundRequest(
    ...lines as [string, number, number, number?, number?]
  );
  const isValid = input.validate(context);
  if (!isValid) {
    return {
      success: false,
      stepAdded: 0,
      exit: false,
    };
  }

  await context.sendMessage(createConfirmAddFundMessage(context.state!.data as AddFundRequest), [
    {
      text: "✅ Xác nhận",
      callback_data: CALLBACK_COMMANDS.CONFIRM 
    },
    {
      text: "❌ Hủy",
      callback_data: CALLBACK_COMMANDS.CANCEL
    }
  ]);
  return {
    success: true,
    stepAdded: 1,
    exit: false,
  };
}

async function saveInfoStep(text: string, context: ChatContext): Promise<FlowStepResult> {
  if (text == CALLBACK_COMMANDS.CANCEL) {
    await context.sendMessage(createCancelActionMessage("thêm nguồn tiền"));
  }

  if (text == CALLBACK_COMMANDS.CONFIRM) {
    const { error } = await context.supabase
    .from("funds")
    .insert([context.state!.data]);

    if (error) {
      console.error("Error adding fund:", error);
      await context.sendMessage(createErrorMessage());
    } else {
      await context.sendMessage(createSuccessMessage("thêm nguồn tiền"));
    }
  }

  return {
    success: true,
    stepAdded: 0,
    exit: true,
  };
}