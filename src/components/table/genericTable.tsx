import { TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { Columns } from "../../models/columns"
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead';



interface TableProps<T>{
    data:T[],
    isEditable?:boolean
    config:Columns<T>[]
}




 function GenericTable<T>(props:TableProps<T>){




    return( 
        <TableContainer sx={{border:'1px solid', borderRadius:'10px',boxShadow:'10px 23px 75px -6px rgba(175,242,218,1)'}}>
    <Table >
        <TableHead sx={{}}>
            <TableRow>
                {props.config.map((column,key)=>
                    {return <TableCell sx={{backgroundColor:'#D0FBE8',color:"#32675B"}} key={key}>{column.getHeader()}</TableCell>})}
            </TableRow>    
        </TableHead> 

        <TableBody>
            {props.data.map((item,key)=>{return(<TableRow key={key}>
                {props.config.map((column,key)=>{return(
                <TableCell key={key}>
                    {column.getValue(item)}
                </TableCell>
            )})}
            </TableRow>)})}
        </TableBody>   

    
    </Table>
    </TableContainer>)
    
}

export default GenericTable