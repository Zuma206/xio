import type { Message, User } from "../server/database/schema";
import { createContext } from "react";

export type JoinedMessage = { messages: Message; users: User };
export type MessageDB = Record<string, JoinedMessage[] | undefined>;
export const MessageDBContext = createContext<MessageDB>({});
