interface loginStyles{
    largerScreen:{
        headerRectangle:React.CSSProperties,
        
    },
    smallerScreen:{
        headerRectangle:React.CSSProperties,
    }
    
}
const styles:loginStyles={
    largerScreen:{
     headerRectangle:{
         background:'#32675B',
         height:'100px',
         textAlign:'center',
         display:'flex',
         justifyContent:'center',
         alignItems:'center',
         backgroundImage:'url(/assets/htecLogo.svg)',
         backgroundSize: 'contain',
         backgroundRepeat:'no-repeat',
         backgroundPosition:'left',
     }
    },
     smallerScreen:{
        headerRectangle:{
            background:'#32675B',
            height:'100px',
            textAlign:'center',
            display:'flex',
            justifyContent:'center',
            alignItems:'center',
            backgroundImage:'url(/assets/htecLogo.svg)',
            backgroundSize: 'contain',
            backgroundRepeat:'no-repeat',
            backgroundPosition:'left'
        }
    }
    }

    export default styles