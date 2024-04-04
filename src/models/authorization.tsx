import { Dispatch, SetStateAction } from "react";

export interface AuthState {
    email?: string;
    password?: string;
    roles?: string[];
    accessToken?: string;
  }// ovaj interfejs ce biti prilagodjen auth tokenu koji dobijamo sa bekenda

export interface AuthContextType {
    auth: AuthState;
    setAuth: Dispatch<SetStateAction<AuthState>>;
  }

