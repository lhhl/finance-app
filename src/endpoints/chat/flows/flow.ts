import { FlowStepResult } from "../../../types/flow";
import { ChatContext } from "../../../types/chat-context";
import { clearState, updateState } from "../state";
import { CALLBACK_COMMANDS, FLOW_COMMANDS } from "../../../constant";
import { createErrorMessage, createCancelActionMessage, createSuccessMessage } from "../../../utils/message-template";
import { attachExitButton } from "../../../utils/generate";
import { TelegramButton } from "../../../types/telegram";
  
export abstract class Flow {
  abstract steps: Array<() => Promise<FlowStepResult>>;
  abstract flowCommand: FLOW_COMMANDS;
  abstract flowName: string;
  constructor(protected text: string, protected context: ChatContext) {}

  private async sendMessage(messages: string[], isCompleted: boolean, buttons?: TelegramButton[]) {
    for (const i in messages) {
      const msg = messages[i];
      const isLastMessage = i === (messages.length - 1).toString();
      await this.context.sendMessage(msg, isLastMessage ? (isCompleted ? buttons : attachExitButton(buttons)) : undefined);
    }
  }

  async execute() {
    if (this.text == CALLBACK_COMMANDS.EXIT) {
      await clearState(this.context);
      return await this.context.sendMessage(createCancelActionMessage(this.flowName));
    }

    let step = this.context.state?.step || 0;
    if (step >= this.steps.length || step < 0) {
      clearState(this.context);
      return await this.context.sendMessage(createErrorMessage(`Sai bước trong luồng ${this.flowName}.`));
    }
    console.log(`Executing flows: ${this.flowCommand}`);
    const result: FlowStepResult = await this.steps[step].bind(this)();

  
    if (result.success) {
      const newStep = step + (result.stepAdded || 1);
      const isCompleted = newStep >= this.steps.length;
      await this.sendMessage(result.messages || [], isCompleted, result.buttons);
      if (isCompleted ) {
        await clearState(this.context);
        return;
      }
      await updateState({
        flow: this.flowCommand,
        data: this.context.state?.data,
        step: newStep,
      }, this.context);
    } else {
      const messages = result.messages ? result.messages.join('\n') : createErrorMessage(`${this.flowName}.`);
      await this.sendMessage([messages], false, result.buttons);
    }
  }
}