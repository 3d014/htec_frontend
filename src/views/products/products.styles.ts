interface productStyles{
    largerScreen:{
        body:React.CSSProperties,
        proizvodi:React.CSSProperties
    },
    smallerScreen:{
        body:React.CSSProperties,
        proizvodi:React.CSSProperties
    }

}

const styles:productStyles={
    largerScreen:{
        body:{display:'flex', flexDirection:'column',padding:'20px',alignItems:'center'},
        proizvodi:{fontSize:'32px',alignSelf:'center',marginTop:'50px',paddingTop:'20px',fontWeight:'bold'}
    },
    smallerScreen:{
        body:{display:'flex', flexDirection:'column',padding:'20px',alignItems:'center'},
        proizvodi:{fontSize:'32px',alignSelf:'center',marginTop:'50px',paddingTop:'20px',fontWeight:'bold'}
    }
}

export default styles