import React, { ReactNode, createContext, useState } from "react";
import { AuthContextType, AuthState } from "../models/authorization";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Initialize auth state with values from the decoded token, if available
  const [auth, setAuth] = useState<AuthState | null>(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decodedToken: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        
      }
      
      return {
        email: decodedToken.email || "",
        password: "",
        roles: decodedToken.roles || [],
        accessToken: token,
      };
      
    } else {
      return {
        email: "",
        password: "",
        roles: [],
        accessToken: "",
      };
    }
  });
  
  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
