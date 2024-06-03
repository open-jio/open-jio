import useValidate from "./useValidate";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const Privateroute= () => {
   const location = useLocation();
   const userAuthenticated = useValidate();
 
   return userAuthenticated
     ? <Outlet />
     : <Navigate to="/login" replace state={{ from: location }}  />;
}

export default Privateroute;