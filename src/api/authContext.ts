import { User } from "firebase/auth";
import { createContext, useContext, useState } from "react";

export const AuthContext = createContext(useState<null | User>(null));
export const useAuth = () => useContext(AuthContext)[0];
export const setAuth = (auth: null | User) => useContext(AuthContext)[1](auth);
