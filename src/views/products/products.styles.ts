interface productStyles{
    largerScreen:{
        body:{},
        proizvodi:{}
    },
    smallerScreen:{
        body:{},
        proizvodi:{}
    }

}

const styles:productStyles={
    largerScreen:{
        body:{display:'flex', flexDirection:'column',padding:'20px',alignItems:'center'},
        proizvodi:{fontSize:'48px',alignSelf:'center',marginBottom:'50px',paddingTop:'20px'}
    },
    smallerScreen:{
        body:{display:'flex', flexDirection:'column',padding:'20px',alignItems:'center'},
        proizvodi:{fontSize:'48px',alignSelf:'center',marginBottom:'50px',paddingTop:'20px'}
    }
}

export default styles