import { Hono } from "hono";
import { chatRouter } from "./endpoints/chat/router";
import { scheduled } from "./endpoints/cron";

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

app.onError((err, c) => {
	console.error("Global error handler caught:", err); // Log the error if it's not known

	// For other errors, return a generic 500 response
	return c.json(
		{
			success: false,
			message: "Internal Server Error",
		},
	);
});

app.route("/chat", chatRouter);

export default {
	fetch: app.fetch,
  scheduled,
};
