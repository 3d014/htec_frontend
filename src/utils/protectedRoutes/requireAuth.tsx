import { useLocation, Navigate, Outlet } from "react-router"
import {jwtDecode} from 'jwt-decode'



interface RequireAuthProps {
    allowedRoles: string[];
  }



const RequireAuth: React.FC<RequireAuthProps> = ({ allowedRoles })=> {
    
    const location = useLocation();
    const token=localStorage.getItem('token')
    let userEmail = "";
    let roles: string[] = [];

    if (token) {
        const decoded: any = jwtDecode(token);
        userEmail = decoded?.email || "";
        roles = decoded?.roles || [];
        console.log(roles);
    }

    return (
        roles.find((role: string) => allowedRoles?.includes(role)) ? <Outlet /> :
        userEmail ? <Navigate to="/test" state={{ from: location }} replace /> :
        <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuth;
