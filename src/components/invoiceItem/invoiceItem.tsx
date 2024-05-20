import { Autocomplete, Box, TextField } from "@mui/material"
import { useEffect, useState } from "react"

import Category from "../../models/category"
import fetchCategories from "../../utils/fetchFunctions/fetchCategories"


const InvoiceItem=()=>{

    const [categoriesData,setCategoriesData]=useState<Category[]>([])
    const [selectedCategory,setSelectedCategory]=useState<Category>()

  
   

    const handleSelectedCategory=(selectedCategory:Category)=>{
            setSelectedCategory(selectedCategory)

    }


    useEffect(()=>{
        fetchCategories(setCategoriesData)
    })


    return <Box>
        <Box sx={{display:'flex',alignItems:'center',margin:'10px',justifyContent:'space-evenly'}}>
        <Autocomplete options={categoriesData||null} getOptionLabel={(option)=>option.categoryName}
         value={selectedCategory||null} 
         renderInput={(params) => <TextField {...params} label="Category" />}
         onChange={(_e,newValue)=>{
            if(newValue) handleSelectedCategory(newValue)

         }}
         sx={{margin:'5px', backgroundColor:'white'}}
         
        ></Autocomplete>   

      
        </Box>
    
    </Box>
}

export default InvoiceItem