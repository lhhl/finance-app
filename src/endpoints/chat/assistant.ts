import { Context }	from "hono";
import { ChatContext } from "../../types/chat-context";

export async function assistant(text: string, context: ChatContext) {
  console.log('User send a message to assistant:', text);
}