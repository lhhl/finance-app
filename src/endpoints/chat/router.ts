import { Hono } from "hono";
import { chat } from "./chat"

export const chatRouter = new Hono();

chatRouter.post("/", chat);
