import Route from "../models/routes";
import { v4 as uuidv4 } from "uuid";
import Login from "../views/login/login";
import Products from "../views/products/products";

import ForgotPassword from "../views/forgot_password/forgotpassword";
import ResetPassword from "../views/reset_password/resetpassword";
import NotFoundPage from "../views/not_found/notFoundPage";
import Home from "../views/home/home";
import EmailSent from "../views/email_sent/email_sent";
import Vendors from "../views/vendors/vendors";
import Categories from "../views/categories/categories";


const RoutesData: Route[] = [
  {
    routeName: "Login",
    path: "/login",
    id: uuidv4(),
    roles: [],
    protected: false,
    private: true,
    isNavigation: false,
    component: <Login />,
  },
  {
    routeName: "Dashboard",
    path: "/",
    id: uuidv4(),
    roles: ["admin", "user"],
    protected: true,
    private: false,
    isNavigation: true,
    component: <Home />,
  },
  {
    routeName: "Products",
    path: "/products",
    id: uuidv4(),
    roles: ["admin", "user"],
    protected: true,
    private: false,
    isNavigation: true,
    component: <Products />,
  },
  {
    routeName: "Vendors",
    path: "/vendors",
    id: uuidv4(),
    roles: ["admin", "user"],
    protected: true,
    private: false,
    isNavigation: true,
    component: <Vendors />,
  },
  {
    routeName: "Category",
    path: "/category",
    id: uuidv4(),
    roles: ["admin", "user"],
    protected: true,
    private: false,
    isNavigation: true,
    component: <Categories />,
  },

  {
    routeName: "ForgotPassword",
    path: "/forgotpassword",
    id: uuidv4(),
    roles: [],
    protected: false,
    private: true,
    isNavigation: false,
    component: <ForgotPassword />,
  },
  {
    routeName: "ResetPassword",
    path: "/resetpassword",
    id: uuidv4(),
    roles: [],
    protected: false,
    private: true,
    isNavigation: false,
    component: <ResetPassword />,
  },
  {
    routeName: "home",
    path: "/",
    id: uuidv4(),
    roles: ["admin"],
    protected: true,
    private: false,
    isNavigation: false,
    component: <Home />,
  },
  {
    routeName: "home",
    path: "/home",
    id: uuidv4(),
    roles: ["admin", "user"],
    protected: true,
    private: false,
    isNavigation: false,
    component: <Home />,
  },

  {
    routeName: "all",
    path: "/*",
    id: uuidv4(),
    roles: [],
    protected: false,
    private: false,
    isNavigation: false,
    component: <NotFoundPage />,
  },
  {
    routeName: "emailSent",
    path: "/emailsent",
    id: uuidv4(),
    roles: [],
    protected: false,
    private: true,
    isNavigation: false,
    component: <EmailSent />,
  },



];

export default RoutesData;
