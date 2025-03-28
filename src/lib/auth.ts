import { createContext } from "react";

type AuthContext = {
  id: string;
};

export const AuthContext = createContext<AuthContext | null>(null);
