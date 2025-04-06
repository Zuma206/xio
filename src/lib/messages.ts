import { createContext } from "react";
import { z } from "zod";

export type MessageDB = Record<string, Message[] | undefined>;
export const MessageDBContext = createContext<MessageDB>({});
export type Message = z.infer<typeof messageSchema>;
export const messageSchema = z.object({
  id: z.number(),
  name: z.string(),
  content: z.string(),
  picture: z.string(),
  date: z.number(),
  channel: z.number(),
});
