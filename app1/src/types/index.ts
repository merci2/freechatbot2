export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

export interface Document {
  id: string;
  name: string;
  content: string;
  type: string;
  size: number;
}