import { Context }	from "hono";
import { TelegramMessagePayload } from "../../types/telegram";
import { command } from "./command";
import { assistant } from "./assistant";
import { createMessageContext, createSupabaseContext } from "../../utils/action";
import { ChatContext } from "../../types/chat-context";
import { state } from "./state";

export async function chat(c: Context) {
	const body = await c.req.json<TelegramMessagePayload>();
	console.log(body);

	const senderId = body.message?.from?.id || body.callback_query?.from?.id;
	const chatId = body.message?.chat?.id || body.callback_query?.message?.chat?.id;
	const text = body.message?.text || body.callback_query?.data;
	console.log(`From ${senderId} in ${chatId}: ${text}`);

	if (!chatId || !text) {
		return c.json({ ok: false, error: "Missing chatId or text" });
	}

	const chatContext: ChatContext = await state({
		chatId,
		authorId: senderId,
		sendMessage: await createMessageContext(c.env.TELEGRAM_BOT_TOKEN, chatId.toString()),
		supabase: await createSupabaseContext(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY),
	});

	const commandText = chatContext.state?.flow || text;

	if (commandText.startsWith("/")) {
		await command(commandText, text, chatContext);
	} else {
		await assistant(text, chatContext);
	}

	return c.json({ ok: true });
}