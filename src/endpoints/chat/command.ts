import { fund } from "./flows/fund";
import { ChatContext } from "../../types/chat-context";
import { addFund } from "./flows/add-fund";
import { FLOW_COMMANDS } from "../../constant";

export async function command(commandText: string, text: string, context: ChatContext) {
	console.log('User requests to execute command:', commandText);

  const commandList: Record<string, (text: string, context: ChatContext) => Promise<void>> = {
    [FLOW_COMMANDS.LIST_FUND]: fund,
    [FLOW_COMMANDS.ADD_FUND]: addFund,
    // [FLOW_COMMANDS.EDIT_FUND]: editFund,
    // [FLOW_COMMANDS.DELETE_FUND]: deleteFund,
  }
  const commandFunction = commandList[commandText];
  if (commandFunction) {
    return await commandFunction(text, context);
  } else {
    console.log('Unknown command:', commandText);
    return null;
  }
}