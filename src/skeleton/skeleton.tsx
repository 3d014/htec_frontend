import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/layout";
import RequireAuth from "../utils/protectedRoutes/requireAuth";
import Home from "../views/home/home";
import Test from "../views/test/test";
import Login from "../views/login/login";
import ForgotPassword from "../views/forgot_password/forgotpassword"
import ResetPassword from "../views/reset_password/resetpassword"
import EmailSent from "../views/email_sent/email_sent"
import { AnonymousRoute } from "../utils/anonymousRoutes/anonymousRoues";

const Skeleton = () => {
  return (
    <BrowserRouter>
      <Routes>
    {/* Anonimna ruta za /test */}     
    <Route element={<AnonymousRoute />}>
      <Route path='/login'  element={ <Login />} />
      <Route path='/resetpassword'  element={ <ResetPassword />} />
      <Route path='/forgotpassword'  element={ <ForgotPassword />} />
      <Route path='email-sent' element= { <EmailSent />} />
      <Route path='/test' element= { <Test />} />
    </Route> 
      
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


