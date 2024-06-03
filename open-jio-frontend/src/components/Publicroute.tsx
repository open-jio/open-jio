import useValidate from "./useValidate";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const Publicroute = () => {
   const location = useLocation();
   const userAuthenticated = useValidate();
 
   return userAuthenticated
     ? <Navigate to="/events" replace state={{ from: location }}  />
     : <Outlet />;
     
}

export default Publicroute;