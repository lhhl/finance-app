import { ChatContext } from "../../../../types/chat-context";
import { FlowStepResult } from "../../../../types/flow";
import { createNotFoundMessage, createChargeFeeMessage } from "../../../../utils/message-template";
import { Debt } from "../../../../models/debt";
import { Flow } from "../flow";
import { FLOW_COMMANDS } from "../../../../constant";
import { generateCRUDButtons } from "../../../../utils/generate";
import { DebtRepository } from "../../../../repositories/debt-repository";
import { ContactRepository } from "../../../../repositories/contact-repository";
import { FeeChargeRepository } from "../../../../repositories/fee-charge-repository";

export class ChargeFeeListFlow extends Flow {
  steps = [this.list];
  flowCommand = FLOW_COMMANDS.CHARGE_FEE;
  flowName = "nợ phí";
  contactRepository: ContactRepository;

  constructor(text: string, context: ChatContext) {
    super(text, context);
    this.contactRepository = new ContactRepository(context.supabase);
  }

  async list(): Promise<FlowStepResult> {
    const data = await this.contactRepository.getFeeCharges();
    const filteredContacts = data.filter(contact => contact.totalFeeChargeAmount > 0);
    if (filteredContacts.length === 0) {
      return {
        success: false,
        messages: [createNotFoundMessage("nợ phí")],
      };
    }

    const message = createChargeFeeMessage(filteredContacts);

    return {
      success: true,
      messages: [message]
    };
  }
}