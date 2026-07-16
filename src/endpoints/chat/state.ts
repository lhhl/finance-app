import { ChatContext } from "../../types/chat-context";
import { CHAT_STATE_EXPIRATION_MINUTES } from "../../constant";
import { ChatState } from "../../types/chat-state";

export async function state(context: ChatContext) {
  const expiredDate = new Date(Date.now() - CHAT_STATE_EXPIRATION_MINUTES * 60 * 1000).toISOString();

  const { data: record, error } = await context.supabase
    .from("chat_states")
    .select("*")
    .eq("chat_id", context.chatId)
    .gte("updated_at", expiredDate)
    .single();

  if (error) {
    console.error("Error fetching state:", error);
  }
  console.log(`State Id: ${record?.id}, Flow: ${record?.flow}, Step: ${record?.step}, Updated At: ${record?.updated_at}`);
  context.state = record || {
    data: {},
  };
  return context;
}

export async function updateState(state: ChatState, context: ChatContext) {
  state.chat_id = context.chatId.toString();
  state.author_id = context.authorId?.toString();
  state.updated_at = new Date().toISOString();
  state.data = context.state?.data || {};

  const action = context.supabase
    .from("chat_states");

  console.log(`Updating state id: ${state.id}, Flow: ${state.flow}, Step: ${state.step}, Updated At: ${state.updated_at}`);
  let data, error;
  if (context.state?.id) {
    ({ data, error } = await action
      .update<ChatState>(state)
      .eq("id", context.state?.id));
  } else {
    ({ data, error } = await action
      .insert<ChatState>([state]));
  }

  if (error) {
    console.error("Error updating state:", error);
  }
}

export async function clearState(state: ChatState, context: ChatContext) {
  const { data, error } = await context.supabase
    .from("chat_states")
    .delete()
    .eq("chat_id", context.chatId);

  if (error) {
    console.error("Error clearing state:", error);
  }
}