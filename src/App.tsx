import "./App.css";
import { AuthProvider } from "./providers/authContext";
import Skeleton from "./skeleton/skeleton";
import "react-toastify/dist/ReactToastify.css";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';


import { ToastContainer } from "react-toastify";
function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <AuthProvider>
        <ToastContainer />

        <Skeleton />
      </AuthProvider>
    </LocalizationProvider>
  );
}

export default App;
