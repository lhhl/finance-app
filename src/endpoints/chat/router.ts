import { Context, Hono } from "hono";
import { chat } from "./chat"

export const chatRouter = new Hono();
const handleBackground = async (c: Context, next: (c: Context, body: any) => Promise<void>) => {
  c.executionCtx.waitUntil((async () => {
    const body = await c.req.json();
    await next(c, body);
  })());
  return c.json({ ok: true });
};

chatRouter.use("*", (c) => handleBackground(c, chat));
