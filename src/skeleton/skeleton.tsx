import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/layout";
import RequireAuth from "../utils/protectedRoutes/requireAuth";
import Home from "../views/home/home";
import Test from "../views/test";
import Login from "../views/login/login";
import { AnonymousRoute } from "../utils/anonymousRoutes/anonymousRoues";

const Skeleton = () => {
  return (
    <BrowserRouter>
      <Routes>
       
 <Route element={<AnonymousRoute />}>
<Route path='/login'  element={ <Login />} />
</Route> 
        {/* Anonimna ruta za /test */}
        <Route path="/test" element={<Test />} />
        {/* Rute koje zahtijevaju autentikaciju i autorizaciju */}
        <Route
          element={<RequireAuth allowedRoles={['admin']} />}
        >
          {/* Sve rute koje zahtijevaju autentikaciju i autorizaciju bit će omotane s Layout komponentom */}
          <Route path="/*" element={<Layout><Home /></Layout>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Skeleton;


