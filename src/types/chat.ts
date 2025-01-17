export interface Chat {
  id: string;
  user_id: string;
  title: string;
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