import { TelegramButton } from "../types/telegram";
import { FLOW_CUD } from "../endpoints/chat/flows/flow-setup";

import { CALLBACK_COMMANDS, FLOW_COMMANDS } from "../constant";

export function generateCRUDButtons(flowCommand: keyof typeof FLOW_CUD, dataLength?: number): TelegramButton[] {
  const buttons: TelegramButton[] = [];
  const flowCUD = FLOW_CUD[flowCommand];
  if (!flowCUD) {
    return buttons;
  }

  buttons.push({
    text: "➕ Thêm",
    callback_data: flowCUD.add,
  });
  if (dataLength) {
    buttons.push({
      text: "✏️ Sửa",
      callback_data: flowCUD.edit,
    });
    buttons.push({
      text: "🚫 Xóa",
      callback_data: flowCUD.delete,
    });
    buttons.push({
      text: "ℹ️ Chi tiết",
      callback_data: flowCUD.detail,
    });
  }

  return buttons;
}

export function attachExitButton(buttons: TelegramButton[] = []): TelegramButton[] {
  return [
    ...buttons,
    {
      text: "👋 Thoát",
      callback_data: CALLBACK_COMMANDS.EXIT,
    },
  ];
}

export function generateConfirmButtons(allowCancel: boolean = false): TelegramButton[] {
  const buttons: TelegramButton[] = [
    {
      text: "✅ Xác nhận",
      callback_data: CALLBACK_COMMANDS.CONFIRM,
    },
  ];

  if (allowCancel) {
    buttons.push({
      text: "❌ Hủy",
      callback_data: CALLBACK_COMMANDS.CANCEL,
    });
  }

  return buttons;
}