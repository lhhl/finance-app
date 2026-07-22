import { ChatContext } from "../../../../types/chat-context";
import { FlowStepResult } from "../../../../types/flow";
import { createContactDebtMessage, createErrorInputMessage, createInputMessage, createNotFoundMessage, createSelectOptionMessage, createConfirmMessage, createErrorMessage, createInvalidInputMessage, createSuccessMessage, createAllocationDebtMessage } from "../../../../utils/message-template";
import { Debt } from "../../../../models/debt";
import { Flow } from "../flow";
import { CALLBACK_COMMANDS, FLOW_COMMANDS } from "../../../../constant";
import { ContactRepository } from "../../../../repositories/contact-repository";
import { InputIntegerRequest } from "../../../../models/input-integer-request";
import { SelectOption } from "../../../../types/select-option";
import { DebtRepository } from "../../../../repositories/debt-repository";
import { formatCurrency } from "../../../../utils/format";
import { generateConfirmButtons } from "../../../../utils/generate";

export class PayDebtFlow extends Flow {
  steps = [this.listContact, this.inputAmount, this.confirm, this.showAllocation, this.payDebt];
  flowCommand = FLOW_COMMANDS.PAY_DEBT;
  flowName = "thanh toán khoản vay";
  contactRepository: ContactRepository;
  debtRepository: DebtRepository;

  constructor(text: string, context: ChatContext) {
    super(text, context);
    this.contactRepository = new ContactRepository(this.context.supabase);
    this.debtRepository = new DebtRepository(this.context.supabase);
  }

  private async getContactListOptions(): Promise<(SelectOption & { amount: number; })[]> {
    const data = await this.contactRepository.list();
    return data.map(contact => ({
      id: contact.id.toString(),
      name: `${contact.name}`,
      amount: contact.totalDebtAmount,
    }));
  }

  async listContact(): Promise<FlowStepResult> {
    const selectOptions = await this.getContactListOptions();
    const message = createSelectOptionMessage("người vay", selectOptions);

    return {
      success: true,
      messages: [message]
    };
  }

  async inputAmount(): Promise<FlowStepResult> {
    const selectOptions = await this.getContactListOptions();
    const request = new InputIntegerRequest(this.text, 1, selectOptions.length);
    const rs = request.validate();
    if (!rs.isValid) {
      return {
        success: false,
        messages: [createErrorInputMessage(rs.errors)],
      };
    }
    const contact = selectOptions[request.intValue - 1];
    this.context.state!.data!['contactId'] = contact.id;
    this.context.state!.data!['contactAmount'] = contact.amount;
    const message = createInputMessage("số tiền thanh toán");
    return {
      success: true,
      messages: [message]
    };
  }

  async confirm(): Promise<FlowStepResult> {
    const selectOptions = await this.getContactListOptions();
    const contactId = this.context.state!.data!['contactId'];
    const amount = this.context.state!.data!['contactAmount'];
    const contact = selectOptions.find(option => option.id === contactId);
    const request = new InputIntegerRequest(this.text, 100000, amount);
    const rs = request.validate();
    if (!rs.isValid) {
      return {
        success: false,
        messages: [createErrorInputMessage(rs.errors)],
      };
    }

    const message = createConfirmMessage(`thanh toán <b>${formatCurrency(request.intValue)}</b> cho <b>${contact?.name}</b>`);
    this.context.state!.data!['paymentAmount'] = request.intValue;
    return {
      success: true,
      messages: [message],
      buttons: generateConfirmButtons(),
    };
  }

  async showAllocation(): Promise<FlowStepResult> {
    if (this.text == CALLBACK_COMMANDS.CONFIRM) {
      const contactId = this.context.state!.data!['contactId'];
      const amount = this.context.state!.data!['paymentAmount'];
      
      const contact = await this.contactRepository.detail(contactId);
      const allocation = contact?.allocateDebtPayment(amount);
      if (!allocation) {
        return {
          success: false,
          messages: [createNotFoundMessage('khoản thanh toán vay')],
        };
      }
      this.context.state!.data!['allocation'] = allocation;

      return {
        success: true,
        messages: [createAllocationDebtMessage(contact!,allocation)],
        buttons: generateConfirmButtons(),
      };
    }
    return {
      success: false,
      messages: [createInvalidInputMessage()],
    };
  }

  async payDebt(): Promise<FlowStepResult> {
    if (this.text == CALLBACK_COMMANDS.CONFIRM) {
      const allocation = this.context.state!.data!['allocation'];
      allocation.forEach(async (item: { debtId: number; currentAmount: number; newAmount: number; }) => {
        if (item.newAmount == 0) {
          return await this.debtRepository.delete(item.debtId);
        }
        return await this.debtRepository.update(item.debtId, { amount: item.newAmount });
      });
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