import { User } from "firebase/auth";
import { createContext, Dispatch, SetStateAction, useContext } from "react";

// Type that represents a state array for User|null
export type AuthState = [User | null, Dispatch<SetStateAction<User | null>>];

// Create an AuthContext for storing user data
export const AuthContext = createContext<AuthState>([null, () => {}]);

// Create a hook-like function to returns the user data from the context
export const useAuth = () => useContext(AuthContext)[0];

// Returns the setter function for the auth state
export const getAuthSetter = () => useContext(AuthContext)[1];
