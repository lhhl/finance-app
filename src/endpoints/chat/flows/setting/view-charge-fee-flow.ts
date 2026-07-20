import { ChatContext } from "../../../../types/chat-context";
import { FlowStepResult } from "../../../../types/flow";
import { Flow } from "../flow";
import { FLOW_COMMANDS, SETTING_KEYS } from "../../../../constant";
import { SettingRepository } from "../../../../repositories/setting-repository";
import { createSettingMessage } from "../../../../utils/message-template";

export class ViewChargeFeeFlow extends Flow {
  steps = [this.viewChargeFeeStep];
  flowCommand = FLOW_COMMANDS.VIEW_CHARGE_FEE;
  flowName = "phí cà thẻ";
  settingRepository: SettingRepository;

  constructor(text: string, context: ChatContext) {
    super(text, context);
    this.settingRepository = new SettingRepository(context.supabase);
  }

  private async viewChargeFeeStep(): Promise<FlowStepResult> {
    const currentSetting = await this.settingRepository.get(SETTING_KEYS.CHARGE_FEE_PERCENT);
    const currentValue = currentSetting?.value || 0;
    
    return {
      success: true,
      messages: [createSettingMessage(this.flowName, `${currentValue}%`)],
      buttons: [
        {
          text: "📝 Thay đổi",
          callback_data: FLOW_COMMANDS.CHANGE_CHARGE_FEE
        }
      ]
    };
  }
}
