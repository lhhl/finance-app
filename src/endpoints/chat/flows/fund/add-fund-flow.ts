import { ChatContext } from "../../../../types/chat-context";
import { FlowStepResult } from "../../../../types/flow";
import { AddFundRequest } from "../../../../models/add-fund-request";
import { createAddFundMessage, createConfirmAddFundMessage, createErrorMessage, createSuccessMessage, createErrorInputMessage, createInvalidInputMessage } from "../../../../utils/message-template";
import { generateConfirmButtons } from "../../../../utils/generate";
import { Flow } from "../flow";
import { CALLBACK_COMMANDS, FLOW_COMMANDS } from "../../../../constant";
import { FundRepository } from "../../../../repositories/fund-repository";

export class AddFundFlow extends Flow {
  steps = [this.askFundNameStep, this.confirmAddFundInfoStep, this.saveInfoStep];
  flowCommand = FLOW_COMMANDS.ADD_FUND;
  flowName = "thêm nguồn tiền";
  fundRepository: FundRepository;

  constructor(text: string, context: ChatContext) {
    super(text, context);
    this.fundRepository = new FundRepository(context.supabase);
  }

  private async askFundNameStep(): Promise<FlowStepResult> {
    return {
      success: true,
      messages: [createAddFundMessage()],
    };
  }

  private async confirmAddFundInfoStep(): Promise<FlowStepResult> {
    const lines = this.text.split("\n").map(line => line.trim());
    const input = new AddFundRequest(
      ...lines as [string, number, number, number?]
    );
    const result = input.validate();
    if (!result.isValid) {
      return {
        success: false,
        messages: [createErrorInputMessage(result.errors)],
      };
    }
    this.context.state!.data = input;
    return {
      success: true,
      messages: [createConfirmAddFundMessage(this.context.state!.data as AddFundRequest)],
      buttons: generateConfirmButtons()
    };
  }

  private async saveInfoStep(): Promise<FlowStepResult> {
    if (this.text == CALLBACK_COMMANDS.CONFIRM) {
      const rs = await this.fundRepository.add(this.context.state!.data as AddFundRequest);

      if (!rs) {
        return {
          success: false,
          messages: [createErrorMessage(this.flowName)],
        };
      }

      return {
        success: true,
        messages: [createSuccessMessage(this.flowName)],
      };
    }

    return {
      success: false,
      messages: [createInvalidInputMessage()],
    };
  }
}