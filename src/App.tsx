import "./App.css";
import { AuthProvider } from "./providers/authContext";
import Skeleton from "./skeleton/skeleton";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";
function App() {
  return (
    <AuthProvider>
      <ToastContainer />
      <Skeleton />
    </AuthProvider>
  );
}

export default App;
