export interface Chat {
  id: string;
  title: string;
  user_id: string;
  is_guest: boolean;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  content: string;
  is_ai: boolean;
  created_at: string;
  chat_id: string;
}