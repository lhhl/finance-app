import { ChatContext } from "../../../../types/chat-context";
import { FlowStepResult } from "../../../../types/flow";
import { createErrorInputMessage, createFundListMessage, createNotFoundMessage, createSelectFundMessage, createEditFundMessage, createFundRefinanceMessage, createConfirmMessage, createErrorMessage, createAvailFundsMessage, createSelectMessage, createInvalidInputMessage, createSuccessMessage } from "../../../../utils/message-template";
import { Fund } from "../../../../models/fund";
import { Flow } from "../flow";
import { CALLBACK_COMMANDS, FLOW_COMMANDS, SETTING_KEYS } from "../../../../constant";
import { generateConfirmButtons, generateCRUDButtons } from "../../../../utils/generate";
import { FundRepository } from "../../../../repositories/fund-repository";
import { SelectIdRequest } from "../../../../models/select-id-request";
import { SettingRepository } from "../../../../repositories/setting-repository";

export class RefinanceFundFlow extends Flow {
  steps = [this.list, this.selectFundStep, this.selectRefinanceFundStep, this.confirmFeeStep];
  flowCommand = FLOW_COMMANDS.REFINANCE_FUND;
  flowName = "nguồn tiền đáo hạn";
  fundRepository: FundRepository;
  settingRepository: SettingRepository;

  constructor(text: string, context: ChatContext) {
    super(text, context);
    this.fundRepository = new FundRepository(this.context.supabase);
    this.settingRepository = new SettingRepository(this.context.supabase);
  }

  private async getMatureFundList(): Promise<Fund[]> {
    const data = await this.fundRepository.list();
    const filteredData = data?.filter(fund => fund.canRefinance);
    const sortedData = filteredData?.sort((a, b) => {
      return  a.untilMaturityDays - b.untilMaturityDays;
    });
    return sortedData;
  }

  private async getAvailableFunds(debtAmount: number): Promise<Fund[]> {
    const funds = await this.fundRepository.list();
    const filterFunds = funds.filter((a) => a.isAvailableForAmount(debtAmount));
    const sortedFunds = filterFunds.sort((a, b) => {
      if (a.untilStatementDays === undefined) return -1;
      if (b.untilStatementDays === undefined) return 1;
      return b.untilStatementDays - a.untilStatementDays;
    });
    return sortedFunds;
  }

  async list(): Promise<FlowStepResult> {
    const funds = await this.getMatureFundList();
    if (!funds?.length) {
      return {
        success: true,
        stepAdded: 10,
        messages: [createNotFoundMessage(this.flowName)],
      };
    }
    const message = createSelectFundMessage(funds);

    return {
      success: true,
      messages: [message],
    };
  }
  
  private async selectFundStep(): Promise<FlowStepResult> {
    const funds = await this.getMatureFundList();
    const request = new SelectIdRequest(this.text, funds.length);
    const rs = request.validate();
    if (!rs.isValid) {
      return {
        success: false,
        messages: [createErrorInputMessage(rs.errors)],
      };
    }
    const selectFundId = funds[request.idValue - 1].id;
    this.context.state!.data!['selectedFundId'] = selectFundId;
    const selectFund = await this.fundRepository.detail(selectFundId);
    if (!selectFund) {
      return {
        success: false,
        messages: [createNotFoundMessage(this.flowName)],
      };
    }
    this.context.state!.data!['amount'] = selectFund.totalStatementDebtAmount;
    const availFunds = await this.getAvailableFunds(selectFund.totalStatementDebtAmount);

    return {
      success: true,
      messages: [createAvailFundsMessage(availFunds), createSelectMessage('số thứ tự nguồn tiền khả dụng')],
    };
  }

  private async selectRefinanceFundStep(): Promise<FlowStepResult> {
    const funds = await this.getAvailableFunds(this.context.state?.data?.amount);
    const request = new SelectIdRequest(this.text, funds.length);
    const rs = request.validate();
    if (!rs.isValid) {
      return {
        success: false,
        messages: [createErrorInputMessage(rs.errors)],
      };
    }
    const selectAvailFundId = funds[request.idValue - 1].id;
    this.context.state!.data!['selectedAvailableFundId'] = selectAvailFundId;
    const selectFund = await this.fundRepository.detail(this.context.state!.data?.selectedFundId);
    if (!selectFund) {
      return {
        success: false,
        messages: [createNotFoundMessage('nguồn tiền khả dụng')],
      };
    }

    const currentSetting = await this.settingRepository.get(SETTING_KEYS.CHARGE_FEE_PERCENT);
    const currentValue = parseFloat(currentSetting?.value || '0') || 0;
    selectFund.refinance_percent = currentValue;
    selectFund.debts?.forEach(debt => {
      debt.funds!.refinance_percent = currentValue;
    });

    return {
      success: true,
      messages: [createFundRefinanceMessage(selectFund)],
      buttons: generateConfirmButtons(),
    };
  }

  private async confirmFeeStep(): Promise<FlowStepResult> {
    if (this.text === CALLBACK_COMMANDS.CONFIRM) {
      const fundId = this.context.state!.data?.selectedFundId;
      const sourceId = this.context.state!.data?.selectedAvailableFundId;
      if (!fundId || !sourceId) {
        return {
          success: false,
          messages: [createInvalidInputMessage()],
        };
      }
      const result = await this.fundRepository.refinance(fundId, sourceId);
      if (result) {
        return {
          success: true,
          messages: [createSuccessMessage(`đáo hạn nguồn tiền thành công`)],
        };
      }
    }
    return {
      success: false,
      messages: [createErrorMessage(this.flowName)],
    };
  }
}