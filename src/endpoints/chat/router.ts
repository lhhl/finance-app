import { Context, Hono } from "hono";
import { chat } from "./chat"

export const chatRouter = new Hono();
const handleBackground = async (c: Context, next: (c: Context, body: any) => Promise<void>) => {
  const body = await c.req.json();
  const secret = c.req.header("X-Telegram-Bot-Api-Secret-Token");

  if (!secret || secret !== c.env.TELEGRAM_BOT_TOKEN) {
    return c.text("Unauthorized", 401);
  }

  c.executionCtx.waitUntil((async () => {
    await next(c, body);
  })());
  return c.json({ ok: true });
};

chatRouter.use("*", (c) => handleBackground(c, chat));
