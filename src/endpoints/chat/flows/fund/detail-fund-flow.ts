import { ChatContext } from "../../../../types/chat-context";
import { FlowStepResult } from "../../../../types/flow";
import { createErrorInputMessage, createSelectFundMessage, createFundDetailMessage, createNotFoundMessage } from "../../../../utils/message-template";
import { Flow } from "../flow";
import { CALLBACK_COMMANDS, FLOW_COMMANDS } from "../../../../constant";
import { FundRepository } from "../../../../repositories/fund-repository";
import { SelectIdRequest } from "../../../../models/select-id-request";

export class DetailFundFlow extends Flow {
  steps = [this.showFundList, this.selectFundStep];
  flowCommand = FLOW_COMMANDS.DETAIL_FUND;
  flowName = "chi tiết nguồn tiền";
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
    const selectFundId = funds[request.idValue - 1].id;
    const fundDetail = await this.fundRepository.detail(selectFundId);
    if (!fundDetail) {
      return {
        success: false,
        messages: [createNotFoundMessage(this.flowName)],
      };
    }
    return {
      success: true,
      messages: [createFundDetailMessage(fundDetail)],
    };
  }
}
