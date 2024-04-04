import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export const AnonymousRoute = () => {
    const { auth } = useAuth()
  
    if (auth === undefined) {
      return null
    }
  
    return auth.accessToken
      ? <Navigate to='/test' replace /> 
      : <Outlet/>;
  }