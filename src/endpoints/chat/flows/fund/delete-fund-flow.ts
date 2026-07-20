import { ChatContext } from "../../../../types/chat-context";
import { FlowStepResult } from "../../../../types/flow";
import { AddFundRequest } from "../../../../models/add-fund-request";
import { Fund } from "../../../../models/fund";
import { createAddFundMessage, createConfirmAddFundMessage, createErrorMessage, createSuccessMessage, createErrorInputMessage, createSelectFundMessage, createEditFundMessage, createNotFoundMessage, createInvalidInputMessage, createConfirmMessage } from "../../../../utils/message-template";
import { generateConfirmButtons } from "../../../../utils/generate";
import { Flow } from "../flow";
import { CALLBACK_COMMANDS, FLOW_COMMANDS } from "../../../../constant";
import { FundRepository } from "../../../../repositories/fund-repository";
import { SelectIdRequest } from "../../../../models/select-id-request";

export class DeleteFundFlow extends Flow {
  steps = [this.showFundList, this.selectFundStep, this.saveInfoStep];
  flowCommand = FLOW_COMMANDS.DELETE_FUND;
  flowName = "xóa nguồn tiền";
  fundRepository: FundRepository;

  constructor(text: string, context: ChatContext) {
    super(text, context);
    this.fundRepository = new FundRepository(context.supabase);
  }

  private async getFundList(): Promise<Fund[]> {
    const funds = await this.fundRepository.list();
    return funds.filter(fund => fund.totalDebtAmount == 0);
  }

  private async showFundList(): Promise<FlowStepResult> {
    const funds = await this.getFundList();
    if (!funds.length) {
      return {
        success: true,
        stepAdded: 10,
        messages: [createNotFoundMessage('nguồn tiền có thể xóa')],
      };
    }
    return {
      success: true,
      messages: [createSelectFundMessage(funds)],
    };
  }

  private async selectFundStep(): Promise<FlowStepResult> {
    const funds = await this.getFundList();
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
      messages: [createConfirmMessage(`xóa nguồn tiền ${selectFund.formatedName} không`)],
    };
  }

  private async saveInfoStep(): Promise<FlowStepResult> {
    if (this.text == CALLBACK_COMMANDS.CONFIRM) {
      const id = this.context.state!.data!.id;
      const rs = await this.fundRepository.delete(id);

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
