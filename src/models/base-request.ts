import Schema from "validate";
import { ChatContext } from "../types/chat-context";
import { createErrorInputMessage } from "../endpoints/chat/message-template";

export abstract class BaseRequest {
  abstract getSchema(): Schema;
  validate(context: ChatContext): boolean {
    const schema = this.getSchema();
    const result = schema.validate(this);
    console.log("Validation result:", result);
    if (result.length > 0) {
      context.sendMessage(createErrorInputMessage(result));
      return false;
    }
    return true;
  }
}