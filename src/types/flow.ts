import { TelegramButton } from "./telegram";

export interface FlowStepResult {
  success: boolean;
  stepAdded?: number;
  messages?: string[];
  buttons?: TelegramButton[];
}