export interface Message {
  id: string;
  content: string;
  isAi: boolean;
  createdAt: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
}