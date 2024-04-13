interface ForgottenPasswordSuccesStyles {
    largerScreen:{
        headerRectangle:React.CSSProperties,
        headerTriangle:React.CSSProperties,
        textBox:React.CSSProperties
    },
    smallerScreen:{
        headerRectangle:React.CSSProperties,
        headerTriangle:React.CSSProperties,
        textBox:React.CSSProperties
    }

}

const styles:ForgottenPasswordSuccesStyles = {
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
        textBox:{
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
    
        }
    
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
        textBox:{
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
    
        }
        
    }
}
export default styles;