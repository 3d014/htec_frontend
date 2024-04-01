import { Box } from "@mui/material"
import Login from "../views/login/login"
import styles from "./skeleton.styles"


const Skeleton=()=>{
let autentifikovan:boolean=true
return <>
{autentifikovan?<Login/>:<Box></Box>>}

 

</>

}

export default Skeleton