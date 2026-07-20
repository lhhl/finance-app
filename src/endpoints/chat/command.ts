import { ChatContext } from "../../types/chat-context";
import { FLOW_COMMANDS_LIST } from "./flows/flow-setup";
import { createNotFoundMessage } from "../../utils/message-template";

export async function command(commandText: string, text: string, context: ChatContext) {
	console.log('User requests to execute command:', commandText);

  const FlowClass = FLOW_COMMANDS_LIST[commandText as keyof typeof FLOW_COMMANDS_LIST];
  if (FlowClass) {
    return await new FlowClass(text, context).execute();
  } else {
    context.sendMessage(createNotFoundMessage(`lệnh ${commandText}`));
    console.log('Unknown command:', commandText);
    return null;
  }
}