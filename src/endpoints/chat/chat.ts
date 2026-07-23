import { Context }	from "hono";
import { TelegramMessagePayload } from "../../types/telegram";
import { command } from "./command";
import { assistant } from "./assistant";
import { createMessageContext, createSupabaseContext } from "../../utils/action";
import { ChatContext } from "../../types/chat-context";
import { state } from "./state";
import { createInvalidCommandMessage, createNoActiveFlowMessage } from "../../utils/message-template";
import { attachExitButton } from "../../utils/generate";

export async function chat(c: Context, body: TelegramMessagePayload) {
	console.log(body);

	const senderId = body.message?.from?.id || body.callback_query?.from?.id;
	const chatId = body.message?.chat?.id || body.callback_query?.message?.chat?.id;
	const text = body.message?.text || body.callback_query?.data;
	console.log(`From ${senderId} in ${chatId}: ${text}`);

	if (!chatId || !text) {
		console.error("Missing chatId or text in the request body.");
		return;
	}

	const chatContext: ChatContext = await state({
		chatId,
		authorId: senderId,
		sendMessage: await createMessageContext(c.env.TELEGRAM_BOT_TOKEN, [chatId.toString()]),
		supabase: await createSupabaseContext(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY),
	});

	if (chatContext.state?.id && text.startsWith("/")) {
		await chatContext.sendMessage(createInvalidCommandMessage(), attachExitButton());
		return;
	}

	if (!chatContext.state?.id && text.startsWith("^")) {
		await chatContext.sendMessage(createNoActiveFlowMessage(), attachExitButton());
		return;
	}

	const commandText = chatContext.state?.flow || text;

	if (commandText.startsWith("/")) {
		await command(commandText, text, chatContext);
	} else {
		await assistant(text, chatContext);
	}

	return;
}