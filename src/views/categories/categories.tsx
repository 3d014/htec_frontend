import { Box, Button, Grid, useMediaQuery } from "@mui/material"
import Category from "../../models/category"
import { useEffect, useState } from "react"
import axiosInstance from "../../api/axiosInstance"
import { Columns } from "../../models/columns"
import DeleteIcon from '@mui/icons-material/Delete'
import GenericTable from "../../components/table/genericTable"
import GenericModal from "../../components/modal/genericModal"
const Categories=()=>{
    const isMatch= useMediaQuery('(min-width:600px)')
    const [deleteFlag,setDeleteFlag]=useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [categoriesData,setCategoriesData]=useState<Category[]>([{
        categoryId:'',
        categoryName:''
    }])

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    
    const fetchCategories=async ()=>{
        try{
            const response=await axiosInstance.get('/api/categories',{
                headers:{Authorization:localStorage.getItem('token')}
            })
            const data:Category[]=response.data
            setCategoriesData(data)
        } catch(error){
            console.error('Error fetching categories',error)
        }
    }

    
    useEffect(()=>{
        fetchCategories()
    },[])

    const handleAddCategory=()=>{
        setIsModalOpen(true)
    }
    const config:Columns<Category>[]=[
        {getHeader:()=>'Settings',
         getValue:(_Category:Category)=><> {deleteFlag? <div style={{width:'50px',height:"20px"}}><Button size='small' onClick={()=>{console.log('')}}><DeleteIcon sx={{color:'#32675B'}}/></Button></div>:<div style={{width:'50px',height:"20px"}}></div>}</>
        },
        {getHeader:()=>'Category Name',
            getValue:(Category:Category)=>Category.categoryName
        }
    ]
    return <Box sx={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
        <h1>Categories</h1>
        <Box sx={{display:'flex',flexDirection:"column",alignItems:'center',justifyContent:'center'}}>
            <GenericTable config={config} data={categoriesData}></GenericTable>
            <Box sx={{margin:'5px',display:'flex',gap:'10px'}}>
                <Button variant='contained' sx={{backgroundColor:"#32675B"}} onClick={handleAddCategory}>Add</Button>
                <Button variant='contained' sx={{backgroundColor:"#32675B"}}>Delete</Button>
            </Box>
        </Box>

        <GenericModal isOpen={isModalOpen} onClose={handleModalClose}>
            <div></div>
        </GenericModal>


    </Box>
}



export default Categories