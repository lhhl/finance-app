import { ChatContext } from "../../../../types/chat-context";
import { FlowStepResult } from "../../../../types/flow";
import { Flow } from "../flow";
import { CALLBACK_COMMANDS, FLOW_COMMANDS, SETTING_KEYS } from "../../../../constant";
import { SettingRepository } from "../../../../repositories/setting-repository";
import { createConfirmMessage, createErrorInputMessage, createErrorMessage, createInputMessage, createSuccessMessage } from "../../../../utils/message-template";
import { InputFloatRequest } from "../../../../models/input-float-request";
import { generateConfirmButtons } from "../../../../utils/generate";

export class ChangeChargeFeeFlow extends Flow {
  steps = [this.inputChargeFeeStep, this.confirmChargeFeeStep, this.saveChargeFeeStep];
  flowCommand = FLOW_COMMANDS.CHANGE_CHARGE_FEE;
  flowName = "thay đổi phí cà thẻ";
  settingRepository: SettingRepository;

  constructor(text: string, context: ChatContext) {
    super(text, context);
    this.settingRepository = new SettingRepository(context.supabase);
  }

  private async inputChargeFeeStep(): Promise<FlowStepResult> {
    return {
      success: true,
      messages: [createInputMessage('phí cà thẻ mới (%)')],
    };
  }

  private async confirmChargeFeeStep(): Promise<FlowStepResult> {
    const request = new InputFloatRequest(this.text, 0, 100);
    const rs = request.validate();
    if (!rs.isValid) {
      return {
        success: false,
        messages: [createErrorInputMessage(rs.errors)],
      };
    }

    const feePercent = request.floatValue;
    this.context.state!.data!['feePercent'] = feePercent;

    return {
      success: true,
      messages: [createConfirmMessage(`đổi phí cà thẻ thành ${feePercent}%`)],
      buttons: generateConfirmButtons(),
    };
  }

  private async saveChargeFeeStep(): Promise<FlowStepResult> {
    if (this.text === CALLBACK_COMMANDS.CONFIRM) {
      const feePercent = this.context.state!.data?.feePercent;
      const result = await this.settingRepository.set(
        SETTING_KEYS.CHARGE_FEE_PERCENT,
        feePercent.toString()
      );

      if (result) {
        return {
          success: true,
          messages: [createSuccessMessage(this.flowName)],
        };
      }
    }

    return {
      success: false,
      messages: [createErrorMessage(this.flowName)],
    };
  }
}
