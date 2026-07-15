export interface ChatState {
  id?: string;
  chat_id?: string;
  author_id?: string;
  flow?: string;
  step?: number;
  data?: Record<string, any>;
  updated_at?: string;
}