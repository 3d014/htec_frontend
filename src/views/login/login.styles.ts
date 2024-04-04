interface loginStyles{
    largerScreen:{
        headerRectangle:React.CSSProperties,
        headerTriangle:React.CSSProperties,
        loginForm:React.CSSProperties,
        inputArea:React.CSSProperties,
        forgotPasswordWrapper:React.CSSProperties,
        forgotPasswordButton:React.CSSProperties,
        loginButton:React.CSSProperties
    },
    smallerScreen:{
        headerRectangle:React.CSSProperties,
        headerTriangle:React.CSSProperties,
        loginForm:React.CSSProperties,
        inputArea:React.CSSProperties,
        forgotPasswordWrapper:React.CSSProperties,
        forgotPasswordButton:React.CSSProperties,
        loginButton:React.CSSProperties
    }
    
}

const styles:loginStyles={
   largerScreen:{
    headerRectangle:{
        background:'#32675B',
        height:'150px',
        textAlign:'center',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        backgroundImage:'url(/assets/htecLogo.svg)',
        backgroundSize: 'contain',
        backgroundRepeat:'no-repeat',
        backgroundPosition:'center',
        
    },
    headerTriangle:{
        background:'#32675B',
        height:'30px',
        clipPath: 'polygon(50% 100%, 0 0, 100% 0)'
    },
    loginForm:{
        height:'40%',
        marginTop:'5%',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'column',
        border:'1px solid',
        borderColor:'#32675B',
        borderRadius:'24px',
        gap:'20px',
        padding:'50px',
        width:'40%',
        boxShadow:' 7px 6px 26px 9px rgba(174,194,185,1)'
       

    },
    inputArea:{
        backgroundColor:'#D0FBE8 ',
        width:'100%'

    },
    forgotPasswordWrapper:{display:'flex',flexDirection:'column',justifyContent:'flex-start',alignItems:'center',width:'100%'},
    forgotPasswordButton:{color:'#32675B',alignSelf:'flex-start',fontSize:'12px'},
    loginButton:{backgroundColor:'#32675B',width:'30%'}

},

smallerScreen:{
    headerRectangle:{
        background:'#32675B',
        height:'150px',
        textAlign:'center',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        backgroundImage:'url(/assets/htecLogo.svg)',
        backgroundSize: 'contain',
        backgroundRepeat:'no-repeat',
        backgroundPosition:'center'
    },
    headerTriangle:{
        background:'#32675B',
        height:'30px',
        clipPath: 'polygon(50% 100%, 0 0, 100% 0)'
    },
    loginForm:{
        height:'60%',
        marginTop:'10%',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'column',
        border:'1px solid',
        borderColor:'#32675B',
        borderRadius:'24px',
        gap:'20px',
        padding:'50px 30px',
        width:'60%',
        boxShadow:' 7px 6px 26px 9px rgba(174,194,185,1)'

    },
    inputArea:{
        backgroundColor:'#D0FBE8',
        boxShadow:'5px 5px 5px 3px rgba(174,194,185,1)',
        border:'0',
        borderRadius:'10px',
    },
    forgotPasswordWrapper:{display:'flex',flexDirection:'column',justifyContent:'flex-start',alignItems:'flex-start'},
    forgotPasswordButton:{color:'#32675B',alignSelf:'flex-start',fontSize:'12px'},
    loginButton:{backgroundColor:'#32675B',width:'30%'}
    
}

}

export default styles