export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  stepId?: string;
}

export interface ChatState {
  [stepKey: string]: ChatMessage[];
}
