import { ChatContext } from "../../../../types/chat-context";
import { FlowStepResult } from "../../../../types/flow";
import { createFundListMessage, createFundOverview, createNotFoundMessage } from "../../../../utils/message-template";
import { formatCurrency } from "../../../../utils/format";
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

  private getFundOverviewData(funds: Fund[]): { totalAvailableAmount: number; totalDebt: number; totalDebtInStatement: number; } {
    const totalAvailableAmount = funds.reduce((sum, fund) => sum + fund.availableAmount, 0);
    const totalDebt = funds.reduce((sum, fund) => sum + fund.totalDebtAmount, 0);
    const totalDebtInStatement = funds.reduce((sum, fund) => sum + fund.totalStatementDebtAmount, 0);
    return { totalAvailableAmount, totalDebt, totalDebtInStatement };
  }

  async list(): Promise<FlowStepResult> {
    const data = await new FundRepository(this.context.supabase).list();
    const sortedData = data?.sort((a, b) => {
      return b.untilMaturityDays - a.untilMaturityDays;
    });
    let messages = [createNotFoundMessage(this.flowName)];
    if (sortedData.length > 0) {
      messages = [createFundListMessage(sortedData)];
      const { totalAvailableAmount, totalDebt, totalDebtInStatement } = this.getFundOverviewData(sortedData);
      messages.push(createFundOverview(
        formatCurrency(totalAvailableAmount),
        formatCurrency(totalDebt),
        formatCurrency(totalDebtInStatement)
      ));
    }

    const buttons = generateCRUDButtons(FLOW_COMMANDS.LIST_FUND, data?.length);

    return {
      success: true,
      messages,
      buttons,
    };
  }
}