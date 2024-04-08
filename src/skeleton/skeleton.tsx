// import { Box } from "@mui/material"
import Login from "../views/login/login"
// import styles from "./skeleton.styles"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Layout from "./components/layout/layout"
import RequireAuth from "../utils/protectedRoutes/requireAuth"
import Home from "../views/home/home"
import ForgotPassword from "../views/forgot_password/forgotpassword"
import ResetPassword from "../views/reset_password/resetpassword"
import Test from "../views/test"
import { AnonymousRoute } from "../utils/anonymousRoutes/anonymousRoues"

// test commit


const Skeleton=()=>{



return <Layout>

<BrowserRouter>
    
    <Routes>
    <Route element={<AnonymousRoute />}>
    <Route path='/login'  element={ <Login />} />
    <Route path='/resetpassword'  element={ <ResetPassword />} />
    <Route path='/forgotpassword'  element={ <ForgotPassword />} />
    </Route> 
    

    <Route path='/test' element={<Test></Test>}></Route>
    <Route element={<RequireAuth allowedRoles={['admin']} />}>
          <Route path="/*" element={<Home/>} />
    </Route> 
    
    
    


    </Routes>

</BrowserRouter>

 

</Layout>

}

export default Skeleton