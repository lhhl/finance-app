import { ChatContext } from "../../../../types/chat-context";
import { FlowStepResult } from "../../../../types/flow";
import { createErrorInputMessage, createNotFoundMessage, createInputMessage, createAvailFundsMessage, createConfirmMessage, createSelectMessage, createSelectContactMessage, createSuccessMessage } from "../../../../utils/message-template";
import { generateConfirmButtons } from "../../../../utils/generate";
import { Flow } from "../flow";
import { CALLBACK_COMMANDS, FLOW_COMMANDS } from "../../../../constant";
import { FundRepository } from "../../../../repositories/fund-repository";
import { SelectIdRequest } from "../../../../models/select-id-request";
import { InputIntegerRequest } from "../../../../models/input-integer-request";
import { Fund } from "../../../../models/fund";
import { ContactRepository } from "../../../../repositories/contact-repository";
import { DebtRepository } from "../../../../repositories/debt-repository";
import { AddDebtRequest } from "../../../../models/add-debt-request";

export class DebtAllocationFlow extends Flow {
  steps = [this.inputDebtAmountStep, this.showMatchedFunds, this.selectFund, this.selectContact];
  flowCommand = FLOW_COMMANDS.DEBT_ALLOCATION;
  flowName = "phân bổ khoản vay";
  fundRepository: FundRepository;
  contactRepository: ContactRepository;
  debtRepository: DebtRepository;

  constructor(text: string, context: ChatContext) {
    super(text, context);
    this.fundRepository = new FundRepository(context.supabase);
    this.contactRepository = new ContactRepository(context.supabase);
    this.debtRepository = new DebtRepository(context.supabase);
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

  private async inputDebtAmountStep(): Promise<FlowStepResult> {
    return {
      success: true,
      messages: [createInputMessage('số tiền vay')],
    };
  }

  private async showMatchedFunds(): Promise<FlowStepResult> {
    const request = new InputIntegerRequest(this.text, 10000);
    const rs = request.validate();
    if (!rs.isValid) {
      return {
        success: false,
        messages: [createErrorInputMessage(rs.errors)],
      };
    }

    const debtAmount = request.intValue;
    this.context.state!.data!['amount'] = debtAmount;
    const funds = await this.getAvailableFunds(debtAmount);
    if (funds.length === 0) {
      return {
        success: true,
        stepAdded: 10,
        messages: [createNotFoundMessage(`nguồn tiền để ${this.flowName}`)],
      };
    }
    return {
      success: true,
      messages: [createAvailFundsMessage(funds), createSelectMessage('số thứ tự nguồn tiền bạn muốn sử dụng')]
    };
  }

  private async selectFund(): Promise<FlowStepResult> {
    const funds = await this.getAvailableFunds(this.context.state?.data?.amount);
    const request = new SelectIdRequest(this.text, funds.length);
    const rs = request.validate();
    if (!rs.isValid) {
      return {
        success: false,
        messages: [createErrorInputMessage(rs.errors)],
      };
    }
    const fundId = funds[request.idValue - 1].id;
    this.context!.state!.data!['fundId'] = fundId;

    const contact = await this.contactRepository.list();
    return {
      success: true,
      messages: [createSelectContactMessage(contact)],
    };
  }

  private async selectContact(): Promise<FlowStepResult> {
    const contacts = await this.contactRepository.list();
    const request = new SelectIdRequest(this.text, contacts.length);
    const rs = request.validate();
    if (!rs.isValid) {
      return {
        success: false,
        messages: [createErrorInputMessage(rs.errors)],
      };
    }
    const contactId = contacts[request.idValue - 1].id;
    this.context!.state!.data!['contactId'] = contactId;
    await this.debtRepository.add(
      new AddDebtRequest(
        this.context.state?.data?.amount,
        this.context.state?.data?.fundId,
        this.context.state?.data?.contactId,
      )
    );

    return {
      success: true,
      messages: [createSuccessMessage(this.flowName)],
    };
  }
}
