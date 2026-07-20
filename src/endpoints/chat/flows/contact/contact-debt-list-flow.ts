import { ChatContext } from "../../../../types/chat-context";
import { FlowStepResult } from "../../../../types/flow";
import { createContactDebtMessage, createNotFoundMessage } from "../../../../utils/message-template";
import { Debt } from "../../../../models/debt";
import { Flow } from "../flow";
import { FLOW_COMMANDS } from "../../../../constant";
import { generateCRUDButtons } from "../../../../utils/generate";
import { DebtRepository } from "../../../../repositories/debt-repository";
import { ContactRepository } from "../../../../repositories/contact-repository";

export class ContactDebtListFlow extends Flow {
  steps = [this.list];
  flowCommand = FLOW_COMMANDS.LIST_CONTACT_DEBTS;
  flowName = "khoản vay";
  contactRepository: ContactRepository;

  constructor(text: string, context: ChatContext) {
    super(text, context);
    this.contactRepository = new ContactRepository(this.context.supabase);
  }

  async list(): Promise<FlowStepResult> {
    const data = await this.contactRepository.list();
    const message = createContactDebtMessage(data);

    return {
      success: true,
      messages: [message],
      buttons: [
        {
          text: "Thanh toán khoản vay",
          callback_data: FLOW_COMMANDS.PAY_DEBT,
        }
      ]
    };
  }
}