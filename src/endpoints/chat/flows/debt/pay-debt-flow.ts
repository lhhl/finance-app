import { ChatContext } from "../../../../types/chat-context";
import { FlowStepResult } from "../../../../types/flow";
import { createContactDebtMessage, createErrorInputMessage, createInputMessage, createNotFoundMessage, createSelectOptionMessage, createConfirmMessage, createErrorMessage, createInvalidInputMessage, createSuccessMessage } from "../../../../utils/message-template";
import { Debt } from "../../../../models/debt";
import { Flow } from "../flow";
import { CALLBACK_COMMANDS, FLOW_COMMANDS } from "../../../../constant";
import { ContactRepository } from "../../../../repositories/contact-repository";
import { InputIntegerRequest } from "../../../../models/input-integer-request";
import { SelectOption } from "../../../../types/select-option";
import { DebtRepository } from "../../../../repositories/debt-repository";

export class ContactDebtListFlow extends Flow {
  steps = [this.listContact];
  flowCommand = FLOW_COMMANDS.LIST_CONTACT_DEBTS;
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
    const request = new InputIntegerRequest(this.text, 100000, this.context.state!.data!['contactAmount']);
    const rs = request.validate();
    if (!rs.isValid) {
      return {
        success: false,
        messages: [createErrorInputMessage(rs.errors)],
      };
    }

    const message = createConfirmMessage(`thanh toán ${amount} cho ${contact?.name}`);
    return {
      success: true,
      messages: [message]
    };
  }

  async pay(): Promise<FlowStepResult> {
    if (this.text == CALLBACK_COMMANDS.CONFIRM) {
      const contactId = this.context.state!.data!['contactId'];
      const amount = this.context.state!.data!['contactAmount'];
      
      const contact = await this.contactRepository.detail(contactId);
      const allocation = contact?.allocateDebtPayment(amount);
      if (!allocation) {
        return {
          success: false,
          messages: [createNotFoundMessage('khoản thanh toán vay')],
        };
      }

      allocation.forEach(async (item) => {
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