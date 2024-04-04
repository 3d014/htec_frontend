import { useLocation, Navigate, Outlet } from "react-router"
import {jwtDecode} from 'jwt-decode'



interface RequireAuthProps {
    allowedRoles: string[];
  }



const RequireAuth: React.FC<RequireAuthProps> = ({ allowedRoles })=> {
    
    const location = useLocation();

    const decoded: any = jwtDecode(localStorage.getItem("token") || "");

    const userEmail: string = decoded?.email || "";
    const roles=decoded?.roles||[]
    console.log(roles)

    return (
        roles.find((role: string) => allowedRoles?.includes(role)) ? <Outlet /> :
        userEmail ? <Navigate to="/test" state={{ from: location }} replace /> :
        <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuth;
