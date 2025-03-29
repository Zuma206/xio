import { createContext } from "react";

type AuthContext = {
  id: string;
  picture: string;
  name: string | null;
};

export const AuthContext = createContext<AuthContext | undefined>(undefined);
