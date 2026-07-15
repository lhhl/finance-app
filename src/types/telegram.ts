export interface TelegramMessagePayload {
  update_id: number;
  message?: {
    message_id: number;
    date: number;
    text?: string;
    from: {
      id: number;
      is_bot: boolean;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
    chat: {
      id: number;
      type: "private" | "group" | "supergroup" | "channel";
      title?: string;
      username?: string;
      first_name?: string;
      last_name?: string;
    };
  };
  callback_query?: {
    id: string;
    from: {
      id: number;
      first_name: string;
      username?: string;
    };
    message?: {
      chat?: {
        id: number;
      }
    };
    data?: string;
  };
}

export interface TelegramButton {
  text: string;
  callback_data: string;
}