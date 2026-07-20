import { ChatContext } from "../../../../types/chat-context";
import { FlowStepResult } from "../../../../types/flow";
import { AddFundRequest } from "../../../../models/add-fund-request";
import { createAddFundMessage, createConfirmAddFundMessage, createErrorMessage, createSuccessMessage, createErrorInputMessage, createSelectFundMessage, createEditFundMessage, createNotFoundMessage, createInvalidInputMessage } from "../../../../utils/message-template";
import { generateConfirmButtons } from "../../../../utils/generate";
import { Flow } from "../flow";
import { CALLBACK_COMMANDS, FLOW_COMMANDS } from "../../../../constant";
import { FundRepository } from "../../../../repositories/fund-repository";
import { SelectIdRequest } from "../../../../models/select-id-request";

export class EditFundFlow extends Flow {
  steps = [this.showFundList, this.selectFundStep, this.confirmEditFundInfoStep, this.saveInfoStep];
  flowCommand = FLOW_COMMANDS.EDIT_FUND;
  flowName = "sửa nguồn tiền";
  fundRepository: FundRepository;

  constructor(text: string, context: ChatContext) {
    super(text, context);
    this.fundRepository = new FundRepository(context.supabase);
  }

  private async showFundList(): Promise<FlowStepResult> {
    const funds = await this.fundRepository.list();
    return {
      success: true,
      messages: [createSelectFundMessage(funds)],
    };
  }

  private async selectFundStep(): Promise<FlowStepResult> {
    const funds = await this.fundRepository.list();
    const request = new SelectIdRequest(this.text, funds.length);
    const rs = request.validate();
    if (!rs.isValid) {
      return {
        success: false,
        messages: [createErrorInputMessage(rs.errors)],
      };
    }
    const selectFund = funds[request.idValue - 1];
    this.context.state!.data!['id'] = selectFund.id;
    return {
      success: true,
      messages: [createEditFundMessage(selectFund)],
    };
  }

  private async confirmEditFundInfoStep(): Promise<FlowStepResult> {
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

    this.context.state!.data = { ...this.context.state!.data, ...input };
    return {
      success: true,
      messages: [createConfirmAddFundMessage(this.context.state!.data as AddFundRequest)],
      buttons: generateConfirmButtons()
    };
  }

  private async saveInfoStep(): Promise<FlowStepResult> {
    if (this.text == CALLBACK_COMMANDS.CONFIRM) {
      const { id, ...editRequest } = this.context.state!.data!;
      if (!id) {
        return {
          success: false,
          messages: [createNotFoundMessage('số thứ tự nguồn tiền')],
        };
      }

      
      const rs = await this.fundRepository.update(id, editRequest as AddFundRequest);

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
