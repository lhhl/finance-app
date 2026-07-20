import { Context, Hono } from "hono";
import { chat } from "./chat"

export const chatRouter = new Hono();
const handleBackground = async (c: Context, next: (c: Context) => Promise<void>) => {
  c.executionCtx.waitUntil((async () => {
    await next(c);
  })());
  return c.json({ ok: true });
};

chatRouter.use("*", (c) => handleBackground(c, chat));
