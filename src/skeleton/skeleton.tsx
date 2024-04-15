import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/layout";
import RequireAuth from "../utils/protectedRoutes/requireAuth";
import { AnonymousRoute } from "../utils/anonymousRoutes/anonymousRoutes";

import RoutesData from "../providers/routeProvider";
const Skeleton = () => {
  return (
    <BrowserRouter>
      <Routes>
        {RoutesData.map((route) => (
          <Route
            key={route.id}
            element={
              route.private ? <AnonymousRoute></AnonymousRoute>:
              (
                route.protected?<RequireAuth allowedRoles={route.roles}></RequireAuth>:null
              )
            }
          >
            {route.private?<Route path={route.path}  element={route.component} />:
            (route.protected?<Route path={route.path} element={<Layout>{route.component}</Layout>} />:<Route path={route.path} element={route.component}></Route>)
            }

            
          </Route>
        ))}
      </Routes>
    </BrowserRouter>
  );
};

export default Skeleton;
