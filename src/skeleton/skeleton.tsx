import { Box } from "@mui/material"
import Login from "../views/login/login"
import styles from "./skeleton.styles"


const Skeleton=()=>{
let autentifikovan:boolean=true

if(!autentifikovan)
{
    return <Login />
}

return <>
{autentifikovan?<Login/>:<Box>Radi</Box>}

 

</>

}

export default Skeleton