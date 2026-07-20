import { ChatContext } from "../../../../types/chat-context";
import { FlowStepResult } from "../../../../types/flow";
import { createFundListMessage, createNotFoundMessage } from "../../../../utils/message-template";
import { Fund } from "../../../../models/fund";
import { Flow } from "../flow";
import { FLOW_COMMANDS } from "../../../../constant";
import { generateCRUDButtons } from "../../../../utils/generate";
import { FundRepository } from "../../../../repositories/fund-repository";

export class FundListFlow extends Flow {
  steps = [this.list];
  flowCommand = FLOW_COMMANDS.LIST_FUND;
  flowName = "nguồn tiền";
  constructor(text: string, context: ChatContext) {
    super(text, context);
  }

  async list(): Promise<FlowStepResult> {
    const data = await new FundRepository(this.context.supabase).list();
    const sortedData = data?.sort((a, b) => {
      return b.untilMaturityDays - a.untilMaturityDays;
    });
    const message = sortedData?.map((fund, i) => {
      return createFundListMessage(fund);
    })?.join("\n") || createNotFoundMessage(this.flowName);

    const buttons = generateCRUDButtons(FLOW_COMMANDS.LIST_FUND, data?.length);

    return {
      success: true,
      messages: [message],
      buttons,
    };
  }
}